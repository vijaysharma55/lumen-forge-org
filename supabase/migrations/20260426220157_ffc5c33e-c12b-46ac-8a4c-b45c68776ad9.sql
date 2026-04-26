-- 1. Add referral_code column to inquiries and ngo_clients
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE public.ngo_clients ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- 2. Create referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_coordinator_id UUID NOT NULL REFERENCES public.coordinators(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  referred_inquiry_id UUID REFERENCES public.inquiries(id) ON DELETE SET NULL,
  referred_ngo_client_id UUID REFERENCES public.ngo_clients(id) ON DELETE SET NULL,
  referred_payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | converted | paid
  commission_amount NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referrals_coordinator ON public.referrals(referrer_coordinator_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_referral_code ON public.inquiries(referral_code);
CREATE INDEX IF NOT EXISTS idx_ngo_clients_referral_code ON public.ngo_clients(referral_code);

-- 3. Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Admins manage referrals"
  ON public.referrals FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Coordinators view own referrals"
  ON public.referrals FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.coordinators c
      WHERE c.id = referrer_coordinator_id AND c.user_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
  );

-- 5. Update inquiries INSERT policy to allow referral_code (recreate to include length check)
DROP POLICY IF EXISTS "Anyone can submit valid inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit valid inquiry"
  ON public.inquiries FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(full_name)) BETWEEN 2 AND 100
    AND length(trim(mobile)) BETWEEN 7 AND 20
    AND length(trim(service_type)) BETWEEN 2 AND 60
    AND (message IS NULL OR length(message) <= 2000)
    AND (referral_code IS NULL OR length(referral_code) <= 40)
  );

-- 6. Trigger to bump updated_at
CREATE TRIGGER trg_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 7. Trigger function: when an inquiry comes in with a referral_code, create a 'pending' referral row
CREATE OR REPLACE FUNCTION public.handle_inquiry_referral()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_coord_id UUID;
BEGIN
  IF NEW.referral_code IS NULL OR length(trim(NEW.referral_code)) = 0 THEN
    RETURN NEW;
  END IF;
  SELECT id INTO v_coord_id FROM public.coordinators
    WHERE referral_code = NEW.referral_code AND approval_status = 'approved'
    LIMIT 1;
  IF v_coord_id IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_coordinator_id, referral_code, referred_inquiry_id, status)
    VALUES (v_coord_id, NEW.referral_code, NEW.id, 'pending');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_inquiry_referral
  AFTER INSERT ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_inquiry_referral();

-- 8. Trigger function: when a payment is marked successful for an ngo_client with a referral_code, mark referral 'converted'
CREATE OR REPLACE FUNCTION public.handle_payment_referral()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_client RECORD;
  v_coord_id UUID;
  v_existing UUID;
BEGIN
  IF NEW.payment_status <> 'success' THEN
    RETURN NEW;
  END IF;
  IF (TG_OP = 'UPDATE') AND OLD.payment_status = 'success' THEN
    RETURN NEW; -- already processed
  END IF;

  -- Try to find an ngo_client linked to this payment via user_id
  SELECT * INTO v_client FROM public.ngo_clients
    WHERE user_id = NEW.user_id AND referral_code IS NOT NULL
    ORDER BY created_at DESC LIMIT 1;

  IF v_client.id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT id INTO v_coord_id FROM public.coordinators
    WHERE referral_code = v_client.referral_code AND approval_status = 'approved'
    LIMIT 1;
  IF v_coord_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Upsert: if a pending referral exists for this client, update; else insert
  SELECT id INTO v_existing FROM public.referrals
    WHERE referrer_coordinator_id = v_coord_id
      AND (referred_ngo_client_id = v_client.id OR referred_payment_id = NEW.id)
    LIMIT 1;

  IF v_existing IS NOT NULL THEN
    UPDATE public.referrals
      SET status = 'converted',
          referred_ngo_client_id = v_client.id,
          referred_payment_id = NEW.id,
          updated_at = now()
      WHERE id = v_existing;
  ELSE
    INSERT INTO public.referrals (referrer_coordinator_id, referral_code, referred_ngo_client_id, referred_payment_id, status)
    VALUES (v_coord_id, v_client.referral_code, v_client.id, NEW.id, 'converted');
  END IF;

  RETURN NEW;
END; $$;

CREATE TRIGGER trg_payment_referral
  AFTER INSERT OR UPDATE OF payment_status ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_payment_referral();

DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit valid inquiry" ON public.inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(full_name)) BETWEEN 2 AND 100
    AND length(trim(mobile)) BETWEEN 7 AND 20
    AND length(trim(service_type)) BETWEEN 2 AND 60
    AND (message IS NULL OR length(message) <= 2000)
  );

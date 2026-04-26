import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  amount: number;            // INR rupees
  paymentType: string;       // 'ngo_website' | 'donation' | 'coordinator_fee'
  payerName: string;
  payerMobile?: string;
  payerEmail?: string;
  notes?: Record<string, string>;
  label?: string;
  className?: string;
  onSuccess?: (paymentId: string, paymentCode?: string | null) => void;
  disabled?: boolean;
}

declare global {
  interface Window { Razorpay?: any }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function RazorpayCheckoutButton({
  amount, paymentType, payerName, payerMobile, payerEmail, notes,
  label = "Pay Now", className, onSuccess, disabled,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!payerName?.trim()) { toast.error("Please enter your name first"); return; }
    if (amount <= 0) { toast.error("Invalid amount"); return; }

    setLoading(true);
    const ok = await loadRazorpayScript();
    if (!ok) { setLoading(false); toast.error("Could not load payment SDK"); return; }

    const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
      body: { amount, payment_type: paymentType, payer_name: payerName, payer_mobile: payerMobile, notes },
    });
    if (error || !data?.order_id) {
      setLoading(false);
      toast.error(data?.error ?? error?.message ?? "Could not create order");
      return;
    }

    const rzp = new window.Razorpay({
      key: data.key_id,
      amount: data.amount,
      currency: data.currency,
      order_id: data.order_id,
      name: "Meri Pahal Fast Help Group",
      description: paymentType.replace(/_/g, " "),
      prefill: { name: payerName, contact: payerMobile ?? "", email: payerEmail ?? "" },
      theme: { color: "#1e40af" },
      handler: async (resp: any) => {
        const { data: vData, error: vErr } = await supabase.functions.invoke("verify-razorpay-payment", {
          body: {
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
          },
        });
        setLoading(false);
        if (vErr || !vData?.verified) {
          toast.error("Payment verification failed. Contact support with reference: " + resp.razorpay_payment_id);
          return;
        }
        toast.success(`Payment successful! Ref: ${vData.payment?.payment_code ?? resp.razorpay_payment_id}`);
        onSuccess?.(resp.razorpay_payment_id, vData.payment?.payment_code);
      },
      modal: { ondismiss: () => setLoading(false) },
    });
    rzp.on("payment.failed", (resp: any) => {
      setLoading(false);
      toast.error(resp?.error?.description ?? "Payment failed");
    });
    rzp.open();
  };

  return (
    <Button type="button" onClick={handleClick} disabled={disabled || loading} className={className} variant="hero" size="lg">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
      {label} ₹{amount.toLocaleString("en-IN")}
    </Button>
  );
}

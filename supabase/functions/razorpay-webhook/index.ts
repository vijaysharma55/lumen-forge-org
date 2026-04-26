import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac, timingSafeEqual } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-razorpay-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Razorpay webhook handler. Configure in Razorpay dashboard:
//   URL: https://<PROJECT>.functions.supabase.co/razorpay-webhook
//   Secret: RAZORPAY_WEBHOOK_SECRET
//   Events: payment.captured, payment.failed
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const WEBHOOK_SECRET = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
  if (!WEBHOOK_SECRET) {
    console.error("RAZORPAY_WEBHOOK_SECRET not configured");
    return new Response("Not configured", { status: 503, headers: corsHeaders });
  }

  const signature = req.headers.get("x-razorpay-signature");
  if (!signature) return new Response("Missing signature", { status: 400, headers: corsHeaders });

  const rawBody = await req.text();
  const expected = createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");

  // Timing-safe compare
  const a = new TextEncoder().encode(expected);
  const b = new TextEncoder().encode(signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    console.warn("Webhook signature mismatch");
    return new Response("Invalid signature", { status: 401, headers: corsHeaders });
  }

  let payload: any;
  try { payload = JSON.parse(rawBody); }
  catch { return new Response("Invalid JSON", { status: 400, headers: corsHeaders }); }

  const event = payload?.event as string | undefined;
  const paymentEntity = payload?.payload?.payment?.entity;
  if (!event || !paymentEntity) {
    return new Response("OK", { status: 200, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const orderId: string | undefined = paymentEntity.order_id;
  const paymentId: string | undefined = paymentEntity.id;
  if (!orderId) return new Response("OK", { status: 200, headers: corsHeaders });

  let newStatus: string | null = null;
  if (event === "payment.captured") newStatus = "success";
  else if (event === "payment.failed") newStatus = "failed";

  if (newStatus) {
    // Idempotent: only update if not already in target state
    const { error } = await supabase
      .from("payments")
      .update({ payment_status: newStatus, txn_id: paymentId ?? orderId })
      .eq("txn_id", orderId)
      .neq("payment_status", newStatus);
    if (error) console.error("webhook update error:", error);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

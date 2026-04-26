import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface OrderRequest {
  amount: number; // INR rupees
  payment_type: string; // 'ngo_website' | 'donation' | 'coordinator_fee' | etc.
  payer_name: string;
  payer_mobile?: string;
  notes?: Record<string, string>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!KEY_ID || !KEY_SECRET) {
      return new Response(
        JSON.stringify({ error: "Razorpay not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET secrets." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: OrderRequest = await req.json();
    if (!body.amount || body.amount < 1 || body.amount > 1_000_000) {
      return new Response(JSON.stringify({ error: "Invalid amount" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!body.payment_type || !body.payer_name) {
      return new Response(JSON.stringify({ error: "Missing payment_type or payer_name" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Identify user (optional - allows anonymous donations)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabase.auth.getUser(token);
      userId = userData.user?.id ?? null;
    }

    // Create receipt id
    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Call Razorpay Orders API
    const auth = btoa(`${KEY_ID}:${KEY_SECRET}`);
    const rpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(body.amount * 100), // paise
        currency: "INR",
        receipt,
        notes: { payment_type: body.payment_type, ...(body.notes ?? {}) },
      }),
    });
    const rpData = await rpRes.json();
    if (!rpRes.ok) {
      console.error("Razorpay order error:", rpData);
      return new Response(JSON.stringify({ error: rpData?.error?.description ?? "Razorpay order failed" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert pending payment record
    const { data: payRow, error: insErr } = await supabase
      .from("payments")
      .insert({
        amount: body.amount,
        payment_type: body.payment_type,
        payer_name: body.payer_name,
        payer_mobile: body.payer_mobile ?? null,
        payment_status: "pending",
        txn_id: rpData.id, // razorpay order_id
        user_id: userId,
        notes: receipt,
      })
      .select("id, payment_code")
      .maybeSingle();
    if (insErr) console.error("payments insert error:", insErr);

    return new Response(
      JSON.stringify({
        order_id: rpData.id,
        amount: rpData.amount,
        currency: rpData.currency,
        key_id: KEY_ID,
        payment_id: payRow?.id ?? null,
        payment_code: payRow?.payment_code ?? null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("create-razorpay-order error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useOutletContext } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import type { AppRole } from "./DashboardLayout";
import { generateReceiptPDF } from "@/lib/pdf";

interface Payment { id: string; amount: number; payment_type: string; payment_status: string; txn_id: string | null; created_at: string; payer_name: string; payer_mobile: string | null; notes: string | null; }

export default function PaymentsPage() {
  const { user, roles } = useOutletContext<{ user: User; roles: AppRole[] }>();
  const [items, setItems] = useState<Payment[]>([]);

  useEffect(() => {
    const q = supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(100);
    (roles.includes("admin") ? q : q.eq("user_id", user.id)).then(({ data }) => setItems(data ?? []));
  }, [user.id, roles]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-primary">Payments</h1>
        <Button variant="hero" disabled><CreditCard className="h-4 w-4" /> Make Payment (Coming Soon)</Button>
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-secondary text-primary">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Payer</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Txn ID</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No payments yet.</td></tr>
            )}
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="p-3">{p.payment_type}</td>
                <td className="p-3">{p.payer_name}</td>
                <td className="p-3 text-right font-semibold">₹{Number(p.amount).toLocaleString("en-IN")}</td>
                <td className="p-3"><span className="rounded-full bg-secondary px-2 py-0.5 text-xs capitalize">{p.payment_status}</span></td>
                <td className="p-3 text-xs text-muted-foreground">{p.txn_id ?? "—"}</td>
                <td className="p-3">
                  <Button size="sm" variant="ghost" onClick={() => generateReceiptPDF({
                    receiptNo: `RCP-${p.id.slice(0,8).toUpperCase()}`,
                    date: new Date(p.created_at).toLocaleDateString("en-IN"),
                    payerName: p.payer_name,
                    payerMobile: p.payer_mobile,
                    amount: Number(p.amount),
                    paymentType: p.payment_type,
                    txnId: p.txn_id,
                    status: p.payment_status,
                    notes: p.notes,
                  })}><Download className="h-3.5 w-3.5" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="text-xs text-muted-foreground">Razorpay integration will be added in the next phase.</p>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Receipt, IdCard, FileSignature, FileSpreadsheet } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  generateReceiptPDF,
  generateJoiningLetter,
  generateIdCard,
  generateInvoice,
} from "@/lib/pdf";
import { toast } from "sonner";

interface Payment { id: string; amount: number; payment_type: string; payment_status: string; txn_id: string | null; created_at: string; payer_name: string; payer_mobile: string | null; notes: string | null; }
interface Coordinator { id: string; member_code: string | null; full_name: string; mobile: string; state: string; district: string; block: string | null; panchayat: string | null; role_level: string; approval_status: string; }
interface NgoClient { id: string; ngo_name: string; client_code: string | null; package_name: string | null; contact_person: string; mobile: string; total_amount: number; paid_amount: number; due_amount: number; created_at: string; }

export default function DocumentsPage() {
  const { user } = useOutletContext<{ user: User }>();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [coord, setCoord] = useState<Coordinator | null>(null);
  const [ngo, setNgo] = useState<NgoClient | null>(null);

  useEffect(() => {
    (async () => {
      const [p, c, n] = await Promise.all([
        supabase.from("payments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("coordinators").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("ngo_clients").select("*").eq("user_id", user.id).maybeSingle(),
      ]);
      setPayments(p.data ?? []);
      setCoord(c.data);
      setNgo(n.data);
    })();
  }, [user.id]);

  const downloadReceipt = (p: Payment) => {
    generateReceiptPDF({
      receiptNo: `RCP-${p.id.slice(0, 8).toUpperCase()}`,
      date: new Date(p.created_at).toLocaleDateString("en-IN"),
      payerName: p.payer_name,
      payerMobile: p.payer_mobile,
      amount: Number(p.amount),
      paymentType: p.payment_type,
      txnId: p.txn_id,
      status: p.payment_status,
      notes: p.notes,
    });
    toast.success("Receipt downloaded");
  };

  const downloadJoining = () => {
    if (!coord || coord.approval_status !== "approved") return toast.error("Approval pending");
    generateJoiningLetter({
      memberCode: coord.member_code ?? "PENDING",
      fullName: coord.full_name,
      roleLevel: coord.role_level,
      state: coord.state,
      district: coord.district,
      block: coord.block,
      panchayat: coord.panchayat,
      date: new Date().toLocaleDateString("en-IN"),
    });
  };

  const downloadIdCard = () => {
    if (!coord || coord.approval_status !== "approved") return toast.error("Approval pending");
    generateIdCard({
      memberCode: coord.member_code ?? "PENDING",
      fullName: coord.full_name,
      roleLevel: coord.role_level,
      district: coord.district,
      state: coord.state,
      mobile: coord.mobile,
    });
  };

  const downloadInvoice = () => {
    if (!ngo) return;
    generateInvoice({
      invoiceNo: `INV-${ngo.id.slice(0, 8).toUpperCase()}`,
      date: new Date(ngo.created_at).toLocaleDateString("en-IN"),
      ngoName: ngo.ngo_name,
      contactPerson: ngo.contact_person,
      mobile: ngo.mobile,
      packageName: ngo.package_name ?? "NGO Website Setup Package",
      total: Number(ngo.total_amount),
      paid: Number(ngo.paid_amount),
      due: Number(ngo.due_amount),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-primary">My Documents</h1>
        <p className="text-sm text-muted-foreground">Auto-generated receipts, letters, ID cards and invoices.</p>
      </div>

      {coord && (
        <Card className="p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display font-bold text-primary"><FileSignature className="h-5 w-5 text-accent" /> Coordinator Documents</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={downloadJoining}><Download className="h-4 w-4" /> Joining Letter</Button>
            <Button variant="outline" onClick={downloadIdCard}><IdCard className="h-4 w-4" /> Digital ID Card</Button>
          </div>
          {coord.approval_status !== "approved" && (
            <p className="mt-3 text-xs text-warning">Documents will be available once your application is approved by the admin.</p>
          )}
        </Card>
      )}

      {ngo && (
        <Card className="p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display font-bold text-primary"><FileSpreadsheet className="h-5 w-5 text-accent" /> NGO Client Documents</h2>
          <Button variant="outline" onClick={downloadInvoice}><Download className="h-4 w-4" /> Project Invoice</Button>
        </Card>
      )}

      <Card className="p-5">
        <h2 className="mb-3 flex items-center gap-2 font-display font-bold text-primary"><Receipt className="h-5 w-5 text-accent" /> Payment Receipts</h2>
        {payments.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground/60" />
            No payments yet. Receipts will appear here after a successful payment.
          </div>
        ) : (
          <ul className="divide-y">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium">{p.payment_type} · ₹{Number(p.amount).toLocaleString("en-IN")}</div>
                  <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("en-IN")} · {p.payment_status}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => downloadReceipt(p)}><Download className="h-3.5 w-3.5" /> PDF</Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

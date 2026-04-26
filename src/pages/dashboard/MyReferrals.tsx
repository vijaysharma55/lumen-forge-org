import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOutletContext } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

interface ReferralRow {
  id: string;
  status: string;
  commission_amount: number;
  created_at: string;
  referred_inquiry_id: string | null;
  referred_ngo_client_id: string | null;
  referred_payment_id: string | null;
  referral_code: string;
}

export default function MyReferrals() {
  const { user } = useOutletContext<{ user: User }>();
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [memberCode, setMemberCode] = useState<string | null>(null);
  const [rows, setRows] = useState<ReferralRow[]>([]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data: c } = await supabase
        .from("coordinators")
        .select("id, referral_code, member_code, approval_status")
        .eq("user_id", user.id)
        .maybeSingle();
      if (c) {
        setReferralCode(c.referral_code);
        setMemberCode(c.member_code);
        const { data: r } = await supabase
          .from("referrals")
          .select("*")
          .eq("referrer_coordinator_id", c.id)
          .order("created_at", { ascending: false });
        setRows((r ?? []) as ReferralRow[]);
      }
      setLoading(false);
    })();
  }, [user]);

  const referralLink = referralCode ? `${window.location.origin}/?ref=${referralCode}` : "";

  const copy = (text: string, label = "Copied") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  const share = async () => {
    if (!referralLink) return;
    if (navigator.share) {
      try { await navigator.share({ title: "Meri Pahal Fast Help Group", url: referralLink }); }
      catch { /* user cancelled */ }
    } else {
      copy(referralLink, "Link copied");
    }
  };

  if (loading) {
    return <div className="grid place-items-center p-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }
  if (!referralCode) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-extrabold text-primary">My Referrals</h1>
        <Card className="p-6 text-muted-foreground">
          Your coordinator profile isn't linked yet, or your application is still pending approval. Once approved, your referral code will appear here.
        </Card>
      </div>
    );
  }

  const total = rows.length;
  const converted = rows.filter((r) => r.status === "converted" || r.status === "paid").length;
  const earnings = rows.reduce((sum, r) => sum + Number(r.commission_amount || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-extrabold text-primary">My Referrals</h1>

      <Card className="space-y-4 p-5">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <div className="text-xs text-muted-foreground">Member ID</div>
            <div className="font-mono text-sm font-bold text-primary">{memberCode ?? "—"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Referral Code</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-accent">{referralCode}</span>
              <Button size="sm" variant="ghost" onClick={() => copy(referralCode!)}><Copy className="h-3 w-3" /></Button>
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Your shareable link</div>
          <div className="flex items-center gap-2">
            <Input readOnly value={referralLink} className="font-mono text-xs" />
            <Button size="sm" variant="outline" onClick={() => copy(referralLink, "Link copied")}><Copy className="h-3 w-3" /></Button>
            <Button size="sm" variant="hero" onClick={share}><Share2 className="h-3 w-3" /> Share</Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total Referrals</div><div className="text-2xl font-extrabold text-primary">{total}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Converted</div><div className="text-2xl font-extrabold text-success">{converted}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total Earnings</div><div className="text-2xl font-extrabold text-accent">₹{earnings.toLocaleString("en-IN")}</div></Card>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-secondary text-primary">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Linked</th>
              <th className="p-3 text-right">Commission</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No referrals yet. Share your link to start earning!</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 text-xs">{new Date(r.created_at).toLocaleDateString("en-IN")}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${
                    r.status === "paid" ? "bg-success/15 text-success" :
                    r.status === "converted" ? "bg-primary/15 text-primary" :
                    "bg-warning/15 text-warning"
                  }`}>{r.status}</span>
                </td>
                <td className="p-3 text-xs">
                  {r.referred_ngo_client_id ? "NGO Client" : r.referred_inquiry_id ? "Inquiry" : "—"}
                </td>
                <td className="p-3 text-right font-medium">₹{Number(r.commission_amount).toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

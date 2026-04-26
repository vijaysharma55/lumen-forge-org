import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useOutletContext } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Coordinator { id: string; member_code: string | null; full_name: string; mobile: string; state: string; district: string; block: string | null; panchayat: string | null; role_level: string; approval_status: string; referral_code: string | null; }

export default function MyCoordinator() {
  const { user } = useOutletContext<{ user: User }>();
  const [data, setData] = useState<Coordinator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("coordinators").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { setData(data); setLoading(false); });
  }, [user.id]);

  if (loading) return <Card className="p-6">Loading…</Card>;

  if (!data) return (
    <Card className="p-10 text-center">
      <MapPin className="mx-auto mb-3 h-12 w-12 text-accent" />
      <h2 className="font-display text-xl font-bold text-primary">No coordinator profile yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">Apply via the public coordinator form. After admin approval, your profile and ID card will appear here.</p>
    </Card>
  );

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-primary">{data.full_name}</h1>
            <p className="text-sm text-muted-foreground">Member ID: {data.member_code ?? "—"} · Role: {data.role_level}</p>
            <p className="text-sm text-muted-foreground">{[data.panchayat, data.block, data.district, data.state].filter(Boolean).join(", ")}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${data.approval_status === "approved" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>{data.approval_status}</span>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <div className="text-xs text-muted-foreground">Referral Code</div>
          <div className="font-display text-2xl font-extrabold text-primary">{data.referral_code ?? "Pending"}</div>
          <p className="mt-2 text-xs text-muted-foreground">Share this code with new applicants to grow your network.</p>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground">Documents</div>
          <p className="mt-1 text-sm">Joining letter & digital ID card will be auto-generated soon.</p>
          <Button variant="outline" size="sm" className="mt-3" disabled>Download (Coming Soon)</Button>
        </Card>
      </div>
    </div>
  );
}

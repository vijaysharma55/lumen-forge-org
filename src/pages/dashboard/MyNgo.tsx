import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useOutletContext } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { Globe } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface NgoClient { id: string; ngo_name: string; client_code: string | null; package_name: string | null; total_amount: number; paid_amount: number; due_amount: number; website_status: string; }

const STAGES = ["pending", "in_progress", "review", "live"];

export default function MyNgo() {
  const { user } = useOutletContext<{ user: User }>();
  const [data, setData] = useState<NgoClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("ngo_clients").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { setData(data); setLoading(false); });
  }, [user.id]);

  if (loading) return <Card className="p-6">Loading…</Card>;

  if (!data) return (
    <Card className="p-10 text-center">
      <Globe className="mx-auto mb-3 h-12 w-12 text-accent" />
      <h2 className="font-display text-xl font-bold text-primary">No NGO project yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">Once you sign up for our NGO website service and an admin links your account, your project will appear here.</p>
    </Card>
  );

  const stage = Math.max(0, STAGES.indexOf(data.website_status));
  const pct = ((stage + 1) / STAGES.length) * 100;

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-primary">{data.ngo_name}</h1>
            <p className="text-sm text-muted-foreground">Client Code: {data.client_code ?? "—"}</p>
          </div>
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">{data.package_name ?? "Standard"}</span>
        </div>
        <div className="mt-6">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>Website status: {data.website_status}</span><span>{Math.round(pct)}%</span></div>
          <Progress value={pct} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5"><div className="text-xs text-muted-foreground">Total</div><div className="font-display text-2xl font-extrabold text-primary">₹{Number(data.total_amount).toLocaleString("en-IN")}</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground">Paid</div><div className="font-display text-2xl font-extrabold text-success">₹{Number(data.paid_amount).toLocaleString("en-IN")}</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground">Due</div><div className="font-display text-2xl font-extrabold text-accent">₹{Number(data.due_amount).toLocaleString("en-IN")}</div></Card>
      </div>
    </div>
  );
}

import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SITE, whatsappLink } from "@/config/site";
import { generateAcknowledgement } from "@/lib/pdf";

const schema = z.object({
  full_name: z.string().trim().min(2).max(100),
  mobile: z.string().trim().regex(/^[0-9+\-\s]{7,20}$/, "Invalid mobile"),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  state: z.string().trim().min(2).max(60),
  district: z.string().trim().min(2).max(60),
  block: z.string().trim().max(60).optional().or(z.literal("")),
  panchayat: z.string().trim().max(60).optional().or(z.literal("")),
  role_level: z.enum(["district", "block", "panchayat"]),
});

const ROLE_OPTIONS = [
  { value: "district", label: "District Coordinator" },
  { value: "block", label: "Block Coordinator" },
  { value: "panchayat", label: "Panchayat Coordinator" },
];

export default function CoordinatorApplicationForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "", mobile: "", email: "",
    state: "", district: "", block: "", panchayat: "",
    role_level: "district",
  });
  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const d = parsed.data;
    const { data: inserted, error } = await supabase.from("coordinators").insert([{
      full_name: d.full_name,
      mobile: d.mobile,
      email: d.email || null,
      state: d.state,
      district: d.district,
      block: d.block || null,
      panchayat: d.panchayat || null,
      role_level: d.role_level,
      approval_status: "pending",
      user_id: null,
    }]).select("id, member_code").maybeSingle();
    setLoading(false);
    if (error) { toast.error(error.message); return; }

    const refNo = inserted?.member_code ?? `COORD-${Date.now().toString(36).toUpperCase()}`;
    try {
      generateAcknowledgement({
        refNo,
        date: new Date().toLocaleDateString("en-IN"),
        fullName: d.full_name,
        serviceType: `${ROLE_OPTIONS.find(r => r.value === d.role_level)?.label} Application`,
        mobile: d.mobile,
      });
    } catch {/* */}

    const waMsg = `Hello ${SITE.shortName}, I'm ${d.full_name} (${d.mobile}). I want to apply as ${d.role_level.toUpperCase()} COORDINATOR for ${d.district}, ${d.state}. Member ID: ${refNo}.`;
    window.open(whatsappLink(waMsg), "_blank");

    toast.success(`Application received. Your Member ID: ${refNo}`);
    setForm({ full_name: "", mobile: "", email: "", state: "", district: "", block: "", panchayat: "", role_level: "district" });
  };

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label htmlFor="cf_name">Full Name *</Label><Input id="cf_name" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} required maxLength={100} /></div>
        <div><Label htmlFor="cf_mobile">Mobile *</Label><Input id="cf_mobile" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} required placeholder="+91" maxLength={20} /></div>
        <div className="sm:col-span-2"><Label htmlFor="cf_email">Email</Label><Input id="cf_email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} maxLength={160} /></div>
      </div>
      <div>
        <Label>Apply for *</Label>
        <Select value={form.role_level} onValueChange={(v) => update("role_level", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{ROLE_OPTIONS.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label htmlFor="cf_state">State *</Label><Input id="cf_state" value={form.state} onChange={(e) => update("state", e.target.value)} required maxLength={60} /></div>
        <div><Label htmlFor="cf_district">District *</Label><Input id="cf_district" value={form.district} onChange={(e) => update("district", e.target.value)} required maxLength={60} /></div>
        {form.role_level !== "district" && (
          <div><Label htmlFor="cf_block">Block</Label><Input id="cf_block" value={form.block} onChange={(e) => update("block", e.target.value)} maxLength={60} /></div>
        )}
        {form.role_level === "panchayat" && (
          <div><Label htmlFor="cf_panchayat">Panchayat</Label><Input id="cf_panchayat" value={form.panchayat} onChange={(e) => update("panchayat", e.target.value)} maxLength={60} /></div>
        )}
      </div>
      <Button type="submit" variant="hero" size="lg" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />} Submit Application
      </Button>
      <p className="text-center text-xs text-muted-foreground">Your Member ID will be auto-assigned. Approval is done by our admin team.</p>
    </form>
  );
}

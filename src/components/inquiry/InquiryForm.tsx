import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SITE, whatsappLink } from "@/config/site";
import { generateAcknowledgement } from "@/lib/pdf";

const schema = z.object({
  full_name: z.string().trim().min(2, "Name too short").max(100),
  organization: z.string().trim().max(120).optional().or(z.literal("")),
  mobile: z.string().trim().regex(/^[0-9+\-\s]{7,20}$/, "Invalid mobile"),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  state: z.string().trim().max(60).optional().or(z.literal("")),
  district: z.string().trim().max(60).optional().or(z.literal("")),
  service_type: z.string().min(2, "Select a service").max(60),
  message: z.string().max(2000).optional().or(z.literal("")),
});

export const SERVICES = [
  "NGO Website Setup",
  "CSR Project Partnership",
  "Women Hygiene Mission",
  "Coordinator Joining",
  "Donation",
  "Other",
];

interface Props {
  defaultService?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

export default function InquiryForm({ defaultService = "NGO Website Setup", compact, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    organization: "",
    mobile: "",
    email: "",
    state: "",
    district: "",
    service_type: defaultService,
    message: "",
  });

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const d = parsed.data;
    const payload = {
      full_name: d.full_name,
      mobile: d.mobile,
      service_type: d.service_type,
      organization: d.organization || null,
      email: d.email || null,
      state: d.state || null,
      district: d.district || null,
      message: d.message || null,
    };
    const { data: inserted, error } = await supabase.from("inquiries").insert([payload]).select("id").maybeSingle();
    setLoading(false);
    if (error) {
      toast.error("Could not submit. Please try again.");
      return;
    }

    // Acknowledgement PDF
    const refNo = `INQ-${(inserted?.id ?? "").slice(0, 8).toUpperCase() || Date.now().toString(36).toUpperCase()}`;
    try {
      generateAcknowledgement({
        refNo,
        date: new Date().toLocaleDateString("en-IN"),
        fullName: d.full_name,
        serviceType: d.service_type,
        mobile: d.mobile,
      });
    } catch {/* non-fatal */}

    // Open WhatsApp prefilled chat to admin
    const waMsg = `Hello ${SITE.shortName}, I am ${d.full_name} (Mobile: ${d.mobile}). I'm interested in: ${d.service_type}. Ref: ${refNo}.${d.message ? `\n\n${d.message}` : ""}`;
    window.open(whatsappLink(waMsg), "_blank");

    toast.success("Thank you! Acknowledgement downloaded — we'll contact you shortly.");
    setForm({ ...form, full_name: "", mobile: "", email: "", message: "" });
    onSuccess?.();
  };

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className={compact ? "grid gap-3" : "grid gap-3 sm:grid-cols-2"}>
        <div>
          <Label htmlFor="full_name">Full Name *</Label>
          <Input id="full_name" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} required maxLength={100} />
        </div>
        <div>
          <Label htmlFor="mobile">Mobile *</Label>
          <Input id="mobile" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} required maxLength={20} placeholder="+91" />
        </div>
        <div>
          <Label htmlFor="organization">NGO / Organization</Label>
          <Input id="organization" value={form.organization} onChange={(e) => update("organization", e.target.value)} maxLength={120} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} maxLength={160} />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" value={form.state} onChange={(e) => update("state", e.target.value)} maxLength={60} />
        </div>
        <div>
          <Label htmlFor="district">District</Label>
          <Input id="district" value={form.district} onChange={(e) => update("district", e.target.value)} maxLength={60} />
        </div>
      </div>

      <div>
        <Label>Service Interested In *</Label>
        <Select value={form.service_type} onValueChange={(v) => update("service_type", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {SERVICES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={3} value={form.message} onChange={(e) => update("message", e.target.value)} maxLength={2000} />
      </div>

      <Button type="submit" variant="hero" size="lg" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit Inquiry
      </Button>
      <p className="text-center text-xs text-muted-foreground">After submitting we'll open WhatsApp & download your acknowledgement PDF.</p>
    </form>
  );
}

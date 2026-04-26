import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useOutletContext } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface Ticket { id: string; subject: string; message: string; status: string; created_at: string; admin_response: string | null; }

export default function SupportPage() {
  const { user } = useOutletContext<{ user: User }>();
  const [items, setItems] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const load = () => supabase.from("support_tickets").select("*").order("created_at", { ascending: false })
    .then(({ data }) => setItems(data ?? []));
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim().length < 3) return toast.error("Subject too short");
    if (message.trim().length < 5) return toast.error("Message too short");
    setLoading(true);
    const { error } = await supabase.from("support_tickets").insert([{ subject, message, user_id: user.id }]);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Ticket submitted");
    setSubject(""); setMessage("");
    load();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h2 className="font-display text-lg font-bold text-primary">New Support Ticket</h2>
        <form onSubmit={submit} className="mt-4 grid gap-3">
          <div><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120} required /></div>
          <div><Label>Message</Label><Textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} required /></div>
          <Button type="submit" variant="hero" disabled={loading}>Submit Ticket</Button>
        </form>
      </Card>

      <div className="space-y-3">
        <h2 className="font-display text-lg font-bold text-primary">My Tickets</h2>
        {items.length === 0 && <Card className="p-6 text-sm text-muted-foreground">No tickets yet.</Card>}
        {items.map((t) => (
          <Card key={t.id} className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-primary">{t.subject}</h3>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs capitalize">{t.status}</span>
            </div>
            <p className="mt-1 text-sm text-foreground/70">{t.message}</p>
            {t.admin_response && (
              <div className="mt-3 rounded-md bg-accent-soft p-3 text-sm">
                <div className="text-xs font-semibold text-accent">Admin reply:</div>
                <p className="mt-1">{t.admin_response}</p>
              </div>
            )}
            <div className="mt-2 text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

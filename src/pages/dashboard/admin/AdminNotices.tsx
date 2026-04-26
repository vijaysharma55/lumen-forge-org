import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

interface Notice { id: string; title: string; message: string; audience_type: string; created_at: string; }

export default function AdminNotices() {
  const { user } = useOutletContext<{ user: User }>();
  const [items, setItems] = useState<Notice[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");

  const load = () => supabase.from("notices").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems(data ?? []));
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 3 || message.trim().length < 5) return toast.error("Title and message required");
    const { error } = await supabase.from("notices").insert([{ title, message, audience_type: audience, created_by: user.id }]);
    if (error) return toast.error(error.message);
    toast.success("Notice published");
    setTitle(""); setMessage(""); load();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h2 className="font-display text-lg font-bold text-primary">Publish Notice</h2>
        <form onSubmit={submit} className="mt-4 grid gap-3">
          <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required /></div>
          <div><Label>Message</Label><Textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} required /></div>
          <div>
            <Label>Audience</Label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="ngo_clients">NGO Clients</SelectItem>
                <SelectItem value="coordinators">Coordinators</SelectItem>
                <SelectItem value="members">Members</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="hero" type="submit">Publish Notice</Button>
        </form>
      </Card>

      <div className="space-y-3">
        <h2 className="font-display text-lg font-bold text-primary">Recent Notices</h2>
        {items.length === 0 && <Card className="p-6 text-sm text-muted-foreground">No notices yet.</Card>}
        {items.map((n) => (
          <Card key={n.id} className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-primary">{n.title}</h3>
              <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</span>
            </div>
            <p className="mt-1 text-sm text-foreground/80">{n.message}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

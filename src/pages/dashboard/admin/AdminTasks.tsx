import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

interface Task { id: string; title: string; notes: string | null; status: string; assigned_to: string | null; due_date: string | null; created_at: string; }

const STATUSES = ["pending", "in_progress", "done", "blocked"];

export default function AdminTasks() {
  const { user } = useOutletContext<{ user: User }>();
  const [items, setItems] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", notes: "", assigned_to: "", due_date: "" });

  const load = () => supabase.from("admin_tasks").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems(data ?? []));
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title.trim()) return toast.error("Title required");
    const { error } = await supabase.from("admin_tasks").insert([{
      title: form.title.trim(),
      notes: form.notes.trim() || null,
      assigned_to: form.assigned_to.trim() || null,
      due_date: form.due_date || null,
      created_by: user.id,
    }]);
    if (error) return toast.error(error.message);
    toast.success("Task created");
    setForm({ title: "", notes: "", assigned_to: "", due_date: "" });
    setOpen(false);
    load();
  };

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("admin_tasks").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    const { error } = await supabase.from("admin_tasks").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-primary">Admin Tasks</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button variant="hero"><Plus className="h-4 w-4" /> New Task</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div><Label htmlFor="t_title">Title *</Label><Input id="t_title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} /></div>
              <div><Label htmlFor="t_notes">Notes</Label><Textarea id="t_notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} maxLength={1000} /></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label htmlFor="t_assigned">Assigned to</Label><Input id="t_assigned" value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} placeholder="Name or email" maxLength={120} /></div>
                <div><Label htmlFor="t_due">Due date</Label><Input id="t_due" type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
              </div>
              <Button onClick={create} variant="hero">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-secondary text-primary">
            <tr><th className="p-3 text-left">Title</th><th className="p-3 text-left">Assigned</th><th className="p-3 text-left">Due</th><th className="p-3 text-left">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No tasks yet.</td></tr>}
            {items.map((t) => (
              <tr key={t.id} className="border-t align-top">
                <td className="p-3">
                  <div className="font-medium">{t.title}</div>
                  {t.notes && <div className="mt-1 text-xs text-muted-foreground">{t.notes}</div>}
                </td>
                <td className="p-3 text-xs">{t.assigned_to ?? "—"}</td>
                <td className="p-3 text-xs">{t.due_date ? new Date(t.due_date).toLocaleDateString() : "—"}</td>
                <td className="p-3">
                  <Select value={t.status} onValueChange={(v) => setStatus(t.id, v)}>
                    <SelectTrigger className="h-8 w-[130px]"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}</SelectContent>
                  </Select>
                </td>
                <td className="p-3"><Button variant="ghost" size="icon" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

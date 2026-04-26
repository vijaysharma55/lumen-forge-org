import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ROLES = ["admin", "ngo_client", "coordinator", "member"] as const;
type Role = typeof ROLES[number];

interface Row { user_id: string; role: Role; profile?: { full_name: string | null; mobile: string | null; }; }

export default function AdminRoles() {
  const [rows, setRows] = useState<Row[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("ngo_client");

  const load = async () => {
    const { data: r } = await supabase.from("user_roles").select("user_id, role").order("created_at", { ascending: false });
    if (!r) return setRows([]);
    const ids = Array.from(new Set(r.map((x) => x.user_id)));
    const { data: profs } = await supabase.from("profiles").select("id, full_name, mobile").in("id", ids);
    const map = new Map((profs ?? []).map((p) => [p.id, p]));
    setRows(r.map((x) => ({ user_id: x.user_id, role: x.role as Role, profile: map.get(x.user_id) ?? undefined })));
  };
  useEffect(() => { load(); }, []);

  const grant = async (e: React.FormEvent) => {
    e.preventDefault();
    // Find user by email via profiles? auth.users is not exposed — admin must enter user UUID.
    // Workflow: ask for user UUID (their account id). For simplicity, we accept UUID here.
    const userId = email.trim();
    if (userId.length < 10) return toast.error("Paste the user's account UUID (from auth)");
    const { error } = await supabase.from("user_roles").insert([{ user_id: userId, role }]);
    if (error) return toast.error(error.message);
    toast.success("Role granted"); setEmail(""); load();
  };

  const revoke = async (user_id: string, r: Role) => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", user_id).eq("role", r);
    if (error) return toast.error(error.message);
    toast.success("Revoked"); load();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h2 className="font-display text-lg font-bold text-primary">Grant Role</h2>
        <p className="mt-1 text-xs text-muted-foreground">Paste the user's account UUID. Find it in Lovable Cloud → Users.</p>
        <form onSubmit={grant} className="mt-4 grid gap-3">
          <div><Label>User UUID</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="00000000-0000-0000-..." required /></div>
          <div>
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button type="submit" variant="hero">Grant Role</Button>
        </form>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[400px] text-sm">
          <thead className="bg-secondary text-primary"><tr>
            <th className="p-3 text-left">User</th><th className="p-3 text-left">Role</th><th className="p-3"></th>
          </tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">No role assignments yet.</td></tr>}
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{r.profile?.full_name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{r.user_id.slice(0, 8)}…</div>
                </td>
                <td className="p-3"><span className="rounded-full bg-secondary px-2 py-0.5 text-xs capitalize">{r.role.replace("_", " ")}</span></td>
                <td className="p-3 text-right"><Button size="sm" variant="outline" onClick={() => revoke(r.user_id, r.role)}>Revoke</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

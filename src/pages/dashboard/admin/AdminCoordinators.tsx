import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Item { id: string; member_code: string | null; full_name: string; mobile: string; state: string; district: string; role_level: string; approval_status: string; }

export default function AdminCoordinators() {
  const [items, setItems] = useState<Item[]>([]);
  const load = () => supabase.from("coordinators").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems(data ?? []));
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, approval_status: string) => {
    const { error } = await supabase.from("coordinators").update({ approval_status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated"); load();
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-primary">Coordinators</h1>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-secondary text-primary"><tr>
            <th className="p-3 text-left">Member ID</th><th className="p-3 text-left">Name</th><th className="p-3 text-left">Mobile</th><th className="p-3 text-left">Location</th><th className="p-3 text-left">Role</th><th className="p-3 text-left">Status</th><th className="p-3"></th>
          </tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No coordinators yet.</td></tr>}
            {items.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 text-xs">{c.member_code ?? "—"}</td><td className="p-3 font-medium">{c.full_name}</td><td className="p-3">{c.mobile}</td>
                <td className="p-3 text-xs">{c.district}, {c.state}</td><td className="p-3">{c.role_level}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs capitalize ${c.approval_status === "approved" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>{c.approval_status}</span></td>
                <td className="p-3 space-x-2">
                  {c.approval_status !== "approved" && <Button size="sm" variant="success" onClick={() => setStatus(c.id, "approved")}>Approve</Button>}
                  {c.approval_status !== "rejected" && <Button size="sm" variant="outline" onClick={() => setStatus(c.id, "rejected")}>Reject</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

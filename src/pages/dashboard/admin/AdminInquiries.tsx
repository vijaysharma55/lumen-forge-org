import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Inquiry { id: string; full_name: string; mobile: string; email: string | null; service_type: string; state: string | null; district: string | null; status: string; message: string | null; created_at: string; }

export default function AdminInquiries() {
  const [items, setItems] = useState<Inquiry[]>([]);

  const load = () => supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(200)
    .then(({ data }) => setItems(data ?? []));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-primary">All Inquiries</h1>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-secondary text-primary">
            <tr>
              <th className="p-3 text-left">Date</th><th className="p-3 text-left">Name</th><th className="p-3 text-left">Mobile</th><th className="p-3 text-left">Service</th><th className="p-3 text-left">Location</th><th className="p-3 text-left">Status</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No inquiries yet.</td></tr>}
            {items.map((i) => (
              <tr key={i.id} className="border-t">
                <td className="p-3 text-xs">{new Date(i.created_at).toLocaleDateString()}</td>
                <td className="p-3 font-medium">{i.full_name}</td>
                <td className="p-3"><a href={`tel:${i.mobile}`} className="text-accent hover:underline">{i.mobile}</a></td>
                <td className="p-3">{i.service_type}</td>
                <td className="p-3 text-xs">{[i.district, i.state].filter(Boolean).join(", ") || "—"}</td>
                <td className="p-3">
                  <Select value={i.status} onValueChange={(v) => updateStatus(i.id, v)}>
                    <SelectTrigger className="h-8 w-[140px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3"><Button asChild size="sm" variant="outline"><a href={`https://wa.me/${i.mobile.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">WhatsApp</a></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Item { id: string; ngo_name: string; contact_person: string; mobile: string; package_name: string | null; total_amount: number; paid_amount: number; due_amount: number; website_status: string; client_code: string | null; }

export default function AdminClients() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => { supabase.from("ngo_clients").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems(data ?? [])); }, []);
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-primary">NGO Clients</h1>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-secondary text-primary"><tr>
            <th className="p-3 text-left">Code</th><th className="p-3 text-left">NGO</th><th className="p-3 text-left">Contact</th><th className="p-3 text-left">Mobile</th><th className="p-3 text-left">Package</th><th className="p-3 text-right">Paid</th><th className="p-3 text-right">Due</th><th className="p-3 text-left">Status</th>
          </tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No clients yet.</td></tr>}
            {items.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 text-xs">{c.client_code ?? "—"}</td><td className="p-3 font-medium">{c.ngo_name}</td><td className="p-3">{c.contact_person}</td><td className="p-3">{c.mobile}</td><td className="p-3">{c.package_name ?? "—"}</td>
                <td className="p-3 text-right">₹{Number(c.paid_amount).toLocaleString("en-IN")}</td>
                <td className="p-3 text-right text-accent">₹{Number(c.due_amount).toLocaleString("en-IN")}</td>
                <td className="p-3"><span className="rounded-full bg-secondary px-2 py-0.5 text-xs capitalize">{c.website_status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Inbox, Globe, Users, CreditCard, Bell, MessageSquare } from "lucide-react";
import type { AppRole } from "./DashboardLayout";

interface Ctx { user: User; roles: AppRole[]; }

export default function DashboardOverview() {
  const { user, roles } = useOutletContext<Ctx>();
  const isAdmin = roles.includes("admin");
  const [stats, setStats] = useState({ inquiries: 0, ngo: 0, coord: 0, payments: 0, notices: 0, tickets: 0 });

  useEffect(() => {
    (async () => {
      if (isAdmin) {
        const [a, b, c, d, e, f] = await Promise.all([
          supabase.from("inquiries").select("*", { count: "exact", head: true }),
          supabase.from("ngo_clients").select("*", { count: "exact", head: true }),
          supabase.from("coordinators").select("*", { count: "exact", head: true }),
          supabase.from("payments").select("*", { count: "exact", head: true }),
          supabase.from("notices").select("*", { count: "exact", head: true }),
          supabase.from("support_tickets").select("*", { count: "exact", head: true }),
        ]);
        setStats({ inquiries: a.count ?? 0, ngo: b.count ?? 0, coord: c.count ?? 0, payments: d.count ?? 0, notices: e.count ?? 0, tickets: f.count ?? 0 });
      } else {
        const [p, t, n] = await Promise.all([
          supabase.from("payments").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("support_tickets").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("notices").select("*", { count: "exact", head: true }),
        ]);
        setStats({ inquiries: 0, ngo: 0, coord: 0, payments: p.count ?? 0, notices: n.count ?? 0, tickets: t.count ?? 0 });
      }
    })();
  }, [user.id, isAdmin]);

  const tiles = isAdmin
    ? [
        { l: "New Inquiries", v: stats.inquiries, i: Inbox },
        { l: "NGO Clients", v: stats.ngo, i: Globe },
        { l: "Coordinators", v: stats.coord, i: Users },
        { l: "Payments", v: stats.payments, i: CreditCard },
        { l: "Notices", v: stats.notices, i: Bell },
        { l: "Open Tickets", v: stats.tickets, i: MessageSquare },
      ]
    : [
        { l: "My Payments", v: stats.payments, i: CreditCard },
        { l: "Notices", v: stats.notices, i: Bell },
        { l: "My Tickets", v: stats.tickets, i: MessageSquare },
      ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-primary">Welcome back 👋</h1>
        <p className="text-sm text-muted-foreground">{isAdmin ? "Admin overview of the entire portal." : "Your personal dashboard."}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Card key={t.l} className="flex items-center gap-4 p-5">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-gradient text-primary-foreground"><t.i className="h-6 w-6" /></div>
            <div>
              <div className="text-xs text-muted-foreground">{t.l}</div>
              <div className="font-display text-2xl font-extrabold text-primary">{t.v}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="font-display text-lg font-bold text-primary">Your roles</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {roles.length === 0 && <span className="text-sm text-muted-foreground">No special roles assigned yet.</span>}
          {roles.map((r) => (
            <span key={r} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary capitalize">{r.replace("_", " ")}</span>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">An admin can grant additional roles (NGO Client / Coordinator) from Admin → Roles.</p>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import DashboardSidebar from "./DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

export type AppRole = "admin" | "ngo_client" | "coordinator" | "member";

export default function DashboardLayout() {
  const nav = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (!session) nav("/auth");
    });

    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { nav("/auth"); return; }
      setUser(data.session.user);
      const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id);
      setRoles((r ?? []).map((x: { role: AppRole }) => x.role));
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, [nav]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    nav("/");
  };

  if (loading) {
    return <div className="grid min-h-screen place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-soft">
        <DashboardSidebar roles={roles} />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="font-display font-bold text-primary">Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted-foreground sm:inline">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={signOut}><LogOut className="h-4 w-4" /> Sign out</Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6"><Outlet context={{ user, roles }} /></main>
        </div>
      </div>
    </SidebarProvider>
  );
}

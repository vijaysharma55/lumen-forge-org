import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { Heart, LayoutDashboard, FileText, CreditCard, MessageSquare, Bell, Users, Globe, MapPin, ShieldCheck, Inbox } from "lucide-react";
import type { AppRole } from "./DashboardLayout";

interface Props { roles: AppRole[]; }

export default function DashboardSidebar({ roles }: Props) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const isAdmin = roles.includes("admin");
  const isNgo = roles.includes("ngo_client");
  const isCoord = roles.includes("coordinator");

  const generalItems = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/dashboard/notices", label: "Notices", icon: Bell },
    { to: "/dashboard/payments", label: "Payments", icon: CreditCard },
    { to: "/dashboard/support", label: "Support", icon: MessageSquare },
    { to: "/dashboard/documents", label: "Documents", icon: FileText },
  ];

  const ngoItems = [{ to: "/dashboard/ngo", label: "My NGO Project", icon: Globe }];
  const coordItems = [{ to: "/dashboard/coordinator", label: "My Coordinator Profile", icon: MapPin }];

  const adminItems = [
    { to: "/dashboard/admin/inquiries", label: "Inquiries", icon: Inbox },
    { to: "/dashboard/admin/clients", label: "NGO Clients", icon: Globe },
    { to: "/dashboard/admin/coordinators", label: "Coordinators", icon: Users },
    { to: "/dashboard/admin/payments", label: "All Payments", icon: CreditCard },
    { to: "/dashboard/admin/notices", label: "Manage Notices", icon: Bell },
    { to: "/dashboard/admin/roles", label: "Roles", icon: ShieldCheck },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex items-center gap-2 px-3 py-4 text-sidebar-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Heart className="h-4 w-4" fill="currentColor" />
          </span>
          {!collapsed && <span className="font-display font-extrabold">Meri Pahal</span>}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalItems.map((it) => (
                <SidebarMenuItem key={it.to}>
                  <SidebarMenuButton asChild>
                    <NavLink to={it.to} end={it.end} className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary-foreground">
                      <it.icon className="h-4 w-4" />
                      {!collapsed && <span>{it.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(isNgo || roles.length > 0) && (
          <SidebarGroup>
            <SidebarGroupLabel>NGO Client</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ngoItems.map((it) => (
                  <SidebarMenuItem key={it.to}>
                    <SidebarMenuButton asChild>
                      <NavLink to={it.to} className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent">
                        <it.icon className="h-4 w-4" />
                        {!collapsed && <span>{it.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {(isCoord || roles.length > 0) && (
          <SidebarGroup>
            <SidebarGroupLabel>Coordinator</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {coordItems.map((it) => (
                  <SidebarMenuItem key={it.to}>
                    <SidebarMenuButton asChild>
                      <NavLink to={it.to} className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent">
                        <it.icon className="h-4 w-4" />
                        {!collapsed && <span>{it.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((it) => (
                  <SidebarMenuItem key={it.to}>
                    <SidebarMenuButton asChild>
                      <NavLink to={it.to} className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent">
                        <it.icon className="h-4 w-4" />
                        {!collapsed && <span>{it.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

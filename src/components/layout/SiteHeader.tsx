import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/ngo-website", label: "NGO Website" },
  { to: "/csr", label: "CSR Projects" },
  { to: "/hygiene", label: "Hygiene Mission" },
  { to: "/coordinator", label: "Join as Coordinator" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-primary">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-gradient text-primary-foreground shadow-elegant">
            <Heart className="h-5 w-5" fill="currentColor" />
          </span>
          <span className="leading-tight">
            <span className="block text-base">Meri Pahal</span>
            <span className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Fast Help Group</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-base ${
                  isActive ? "bg-secondary text-primary" : "text-foreground/70 hover:bg-secondary hover:text-primary"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <Button asChild variant="default"><Link to="/dashboard">Dashboard</Link></Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/auth">Login</Link></Button>
              <Button asChild variant="hero" size="sm"><Link to="/contact">Get Started</Link></Button>
            </>
          )}
        </div>

        <button onClick={() => setOpen((o) => !o)} className="rounded-md p-2 lg:hidden" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-background lg:hidden">
          <div className="container flex flex-col py-3">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-secondary text-primary" : "text-foreground/80"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2 border-t pt-3">
              {user ? (
                <Button asChild className="flex-1"><Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link></Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="flex-1"><Link to="/auth" onClick={() => setOpen(false)}>Login</Link></Button>
                  <Button asChild variant="hero" className="flex-1"><Link to="/contact" onClick={() => setOpen(false)}>Get Started</Link></Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

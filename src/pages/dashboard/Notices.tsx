import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";

interface Notice { id: string; title: string; message: string; audience_type: string; created_at: string; }

export default function NoticesPage() {
  const [items, setItems] = useState<Notice[]>([]);
  useEffect(() => {
    supabase.from("notices").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => setItems(data ?? []));
  }, []);
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-primary">Notices</h1>
      {items.length === 0 && <Card className="p-6 text-sm text-muted-foreground">No notices yet.</Card>}
      {items.map((n) => (
        <Card key={n.id} className="p-5">
          <div className="flex items-start gap-3">
            <Bell className="mt-1 h-5 w-5 text-accent" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-primary">{n.title}</h3>
                <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</span>
              </div>
              <p className="mt-1 text-sm text-foreground/80">{n.message}</p>
              <span className="mt-2 inline-block rounded-full bg-secondary px-2 py-0.5 text-xs capitalize text-primary">{n.audience_type}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

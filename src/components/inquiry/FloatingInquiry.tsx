import { useState } from "react";
import { MessageCircle, Globe, Heart, Users, HandHeart, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InquiryForm, { SERVICES } from "./InquiryForm";

const PICKER = [
  { service: SERVICES[0], icon: Globe, color: "text-primary" },
  { service: SERVICES[1], icon: HandHeart, color: "text-accent" },
  { service: SERVICES[2], icon: Heart, color: "text-destructive" },
  { service: SERVICES[3], icon: Users, color: "text-primary" },
  { service: SERVICES[4], icon: Sparkles, color: "text-accent" },
];

export default function FloatingInquiry() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  const close = () => { setOpen(false); setPicked(null); };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-accent-gradient px-5 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition-base hover:scale-105"
        aria-label="Open inquiry form"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Quick Inquiry</span>
      </button>
      <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : close())}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {picked ? `Inquiry: ${picked}` : "What can we help you with?"}
            </DialogTitle>
          </DialogHeader>
          {!picked ? (
            <div className="grid gap-2 pt-2">
              {PICKER.map((p) => (
                <button
                  key={p.service}
                  onClick={() => setPicked(p.service)}
                  className="flex items-center gap-3 rounded-lg border bg-background p-3 text-left transition-base hover:border-accent hover:bg-accent-soft"
                >
                  <div className={`grid h-10 w-10 place-items-center rounded-lg bg-secondary ${p.color}`}>
                    <p.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{p.service}</span>
                </button>
              ))}
            </div>
          ) : (
            <InquiryForm defaultService={picked} compact onSuccess={close} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

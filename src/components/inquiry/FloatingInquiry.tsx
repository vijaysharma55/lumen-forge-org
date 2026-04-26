import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InquiryForm from "./InquiryForm";

export default function FloatingInquiry() {
  const [open, setOpen] = useState(false);
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Send us a quick inquiry</DialogTitle>
          </DialogHeader>
          <InquiryForm compact onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

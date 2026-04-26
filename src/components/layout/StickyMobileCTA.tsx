import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Sticky bottom CTA shown only on small screens to drive conversions.
 * Hidden on /auth and /dashboard routes via the parent layout (PublicLayout only).
 */
export default function StickyMobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/20 bg-background/95 p-3 shadow-elegant backdrop-blur md:hidden">
      <div className="flex items-center gap-2">
        <div className="flex-1 leading-tight">
          <div className="text-xs font-semibold text-accent">Limited slots this month</div>
          <div className="text-sm font-bold text-primary">Start your NGO website at ₹1,250</div>
        </div>
        <Link
          to="/ngo-website"
          className="inline-flex items-center gap-1 rounded-lg bg-primary-gradient px-3 py-2 text-sm font-bold text-primary-foreground shadow-glow"
        >
          Start <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

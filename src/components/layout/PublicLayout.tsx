import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import FloatingInquiry from "@/components/inquiry/FloatingInquiry";
import StickyMobileCTA from "./StickyMobileCTA";
import { captureReferralFromUrl } from "@/lib/referral";

export default function PublicLayout() {
  useEffect(() => { captureReferralFromUrl(); }, []);
  return (
    <div className="flex min-h-screen flex-col">
      {/* Limited slots urgency strip */}
      <div className="bg-accent text-accent-foreground">
        <div className="container flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-1.5 text-center text-xs font-semibold sm:text-sm">
          <span>🔥 Limited slots this month</span>
          <span className="hidden sm:inline opacity-70">·</span>
          <span>Start your NGO website at just ₹1,250</span>
          <span className="hidden sm:inline opacity-70">·</span>
          <span>Live in 7 days</span>
        </div>
      </div>
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <SiteFooter />
      <FloatingInquiry />
      <StickyMobileCTA />
    </div>
  );
}

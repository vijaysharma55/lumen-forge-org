import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Globe, Smartphone, Shield, Zap } from "lucide-react";
import InquiryForm from "@/components/inquiry/InquiryForm";

const features = [
  "Custom NGO branding & logo",
  "About, Programs, Gallery, Donate pages",
  "Mobile responsive design",
  "Donation form integration",
  "Contact & inquiry forms",
  "1 year free domain & hosting",
  "SEO optimization",
  "WhatsApp chat button",
];

export default function NgoWebsite() {
  return (
    <>
      <section className="bg-hero py-20 text-primary-foreground">
        <div className="container grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">Most Popular Service</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold md:text-5xl">Professional NGO Website at ₹4,999</h1>
            <p className="mt-4 text-primary-foreground/85">Get your NGO online in days. Pay just 25% advance to start.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl"><Link to="/contact">Pay 25% Advance</Link></Button>
              <Button asChild variant="outlineLight" size="xl"><a href="#inquire">Send Inquiry</a></Button>
            </div>
          </div>
          <Card className="bg-card/95 p-6 backdrop-blur">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Complete package</div>
              <div className="font-display text-5xl font-extrabold text-primary">₹4,999</div>
              <div className="mt-1 text-sm text-accent font-semibold">Start with ₹1,250 advance</div>
            </div>
            <ul className="mt-6 space-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" /> {f}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-primary">What you get</h2>
          <p className="mt-2 text-muted-foreground">Everything your NGO needs to look credible and accept support online.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            { i: Globe, t: "Custom Domain", d: "yoursngo.org included free" },
            { i: Smartphone, t: "Mobile Ready", d: "Looks great on every device" },
            { i: Shield, t: "Secure Hosting", d: "SSL & daily backups included" },
            { i: Zap, t: "Fast Delivery", d: "Live in 5–7 days" },
          ].map((b) => (
            <Card key={b.t} className="p-6 text-center">
              <b.i className="mx-auto mb-3 h-10 w-10 text-accent" />
              <h3 className="font-display font-bold text-primary">{b.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="inquire" className="bg-soft py-16">
        <div className="container max-w-3xl">
          <div className="mb-6 text-center">
            <h2 className="font-display text-3xl font-bold text-primary">Request your NGO website</h2>
            <p className="mt-2 text-muted-foreground">Fill the form — our team will reach out within 24 hours.</p>
          </div>
          <Card className="p-6 md:p-8">
            <InquiryForm defaultService="NGO Website Setup" />
          </Card>
        </div>
      </section>
    </>
  );
}

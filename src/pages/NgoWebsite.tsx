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
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">🔥 Limited slots — Most Popular</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight md:text-5xl">
              Apni NGO ki Professional Website<br />
              sirf <span className="text-accent">₹1,250 se start</span>.
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/85">
              Total ₹4,999 · Pay just 25% advance · <strong className="text-accent">Live in 7 days.</strong>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl"><a href="#inquire">Start with ₹1,250</a></Button>
              <Button asChild variant="outlineLight" size="xl"><a href="#inquire">Get Free Demo</a></Button>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-primary-foreground/80">
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-accent" /> 7-day delivery</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-accent" /> Pay balance on launch</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-accent" /> CSR-ready</span>
            </div>
          </div>
          <Card className="bg-card/95 p-6 backdrop-blur">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Complete package</div>
              <div className="font-display text-5xl font-extrabold text-primary">₹4,999</div>
              <div className="mt-2 inline-block rounded-lg bg-success/10 px-3 py-1.5">
                <div className="text-xs font-semibold text-success">Start with</div>
                <div className="font-display text-xl font-extrabold text-success">₹1,250 advance</div>
              </div>
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

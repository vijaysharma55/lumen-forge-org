import { Link } from "react-router-dom";
import { ArrowRight, Globe, Handshake, Heart, Users, Award, CheckCircle2, Sparkles, Clock, ShieldCheck, BadgeCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImg from "@/assets/hero-ngo.jpg";
import InquiryForm from "@/components/inquiry/InquiryForm";

const services = [
  { icon: Globe, title: "NGO Website Setup", desc: "Professional website for your NGO at just ₹4,999 — start with 25% advance.", to: "/ngo-website", tag: "₹4,999" },
  { icon: Handshake, title: "CSR Project Partnership", desc: "Partner with corporates on impactful social projects across India.", to: "/csr", tag: "Apply Now" },
  { icon: Heart, title: "Women Hygiene Mission", desc: "Join the Nari Pad Bank Mission as a distributor or franchise.", to: "/hygiene", tag: "Mission" },
  { icon: Users, title: "Join as Coordinator", desc: "Become a District / Block / Panchayat coordinator and lead change.", to: "/coordinator", tag: "Join Now" },
];

const stats = [
  { n: "500+", l: "NGO Partners" },
  { n: "120+", l: "Districts Active" },
  { n: "10K+", l: "Lives Impacted" },
  { n: "1,200+", l: "Coordinators" },
];

const testimonials = [
  { name: "Sunita Devi", role: "District Coordinator, Bihar", quote: "Meri Pahal helped me bring real change to 30 villages in our district." },
  { name: "Asha NGO Trust", role: "NGO Partner", quote: "Our website was live in 5 days. The dashboard makes everything transparent." },
  { name: "Ravi Kumar", role: "CSR Lead", quote: "A trustworthy partner for grassroots CSR delivery." },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative container grid gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div className="text-primary-foreground animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Limited slots this month · Pan-India NGO Network
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] text-balance md:text-5xl lg:text-6xl">
              Apni NGO ki Professional Website<br />
              sirf <span className="text-accent">₹1,250 se start</span> kare —<br />
              <span className="text-accent">7 din me ready.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-primary-foreground/85">
              Total package ₹4,999. Pay just 25% advance (₹1,250) to begin. CSR-ready, mobile-friendly NGO website, delivered in 7 days — plus a full ecosystem for coordinators, payments &amp; documents.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl"><Link to="/ngo-website">Start with ₹1,250 <ArrowRight /></Link></Button>
              <Button asChild variant="outlineLight" size="xl"><Link to="/contact">Get Free Demo</Link></Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-foreground/80">
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" /> 7-day delivery</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-accent" /> Registered NGO</span>
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-accent" /> 500+ NGOs onboard</span>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl font-extrabold text-accent md:text-3xl">{s.n}</div>
                  <div className="text-xs text-primary-foreground/70">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <Card className="animate-scale-in p-6 shadow-elegant lg:p-8">
            <h3 className="font-display text-xl font-bold text-primary">Get a free consultation</h3>
            <p className="mb-4 text-sm text-muted-foreground">Tell us what you need — we'll respond within 24 hours.</p>
            <InquiryForm compact />
          </Card>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-soft py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold text-primary md:text-4xl">Our Core Services</h2>
            <p className="mt-3 text-muted-foreground">Four powerful pathways to scale your social impact.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Card key={s.title} className="group relative overflow-hidden p-6 transition-base hover:-translate-y-1 hover:shadow-elegant" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary-gradient text-primary-foreground shadow-glow">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="mb-1 inline-block rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">{s.tag}</div>
                <h3 className="mt-1 font-display text-lg font-bold text-primary">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                <Link to={s.to} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:gap-2 transition-base">
                  Learn more <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING — NGO Website */}
      <section className="container py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent">Most Popular</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-primary md:text-4xl">Transparent pricing. No surprises.</h2>
            <p className="mt-3 text-muted-foreground">One package. Everything your NGO needs to look credible online.</p>
          </div>

          <Card className="relative mt-10 overflow-hidden border-2 border-accent/30 p-8 shadow-elegant">
            <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              <Zap className="h-3.5 w-3.5" /> Limited slots
            </div>
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Professional NGO Website</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-extrabold text-primary">₹4,999</span>
                  <span className="text-sm text-muted-foreground">total package</span>
                </div>
                <div className="mt-3 inline-block rounded-lg bg-success/10 px-3 py-2">
                  <div className="text-xs font-semibold text-success">Start with just</div>
                  <div className="font-display text-2xl font-extrabold text-success">₹1,250 <span className="text-sm font-medium">(25% advance)</span></div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-foreground/80">
                  <Clock className="h-4 w-4 text-accent" /> Live in <strong>7 days</strong> · Pay balance on delivery
                </div>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <Button asChild variant="hero" size="lg" className="flex-1"><Link to="/ngo-website">Start with ₹1,250 <ArrowRight /></Link></Button>
                  <Button asChild variant="outline" size="lg" className="flex-1"><Link to="/contact">Get Demo</Link></Button>
                </div>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Custom NGO branding, logo & domain",
                  "About / Programs / Gallery / Donate pages",
                  "Mobile responsive · SEO optimized",
                  "Donation & contact forms built-in",
                  "1 year free hosting + SSL",
                  "WhatsApp chat button",
                  "CSR-ready presentation",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                    <span className="text-foreground/85">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Trust badges row */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { i: ShieldCheck, t: "Registered NGO" },
              { i: BadgeCheck, t: "500+ Partners" },
              { i: Clock, t: "7-Day Delivery" },
              { i: Award, t: "Pan-India Network" },
            ].map((b) => (
              <div key={b.t} className="flex items-center justify-center gap-2 rounded-xl border bg-card px-3 py-3 text-center text-sm font-semibold text-primary">
                <b.i className="h-5 w-5 text-accent" /> {b.t}
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="container py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-primary md:text-4xl">Why partner with Meri Pahal?</h2>
            <p className="mt-3 text-muted-foreground">A registered, transparent and tech-enabled NGO ecosystem built for scale.</p>
            <ul className="mt-6 space-y-3">
              {[
                "Registered organization with verified documentation",
                "End-to-end automation: leads, payments, documents, dashboards",
                "Pan-India coordinator network at district, block & panchayat levels",
                "Affordable pricing with transparent payment tracking",
                "Dedicated support for every NGO partner",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                  <span className="text-foreground/80">{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3">
              <Button asChild variant="hero" size="lg"><Link to="/about">About Us</Link></Button>
              <Button asChild variant="outline" size="lg"><Link to="/contact">Contact</Link></Button>
            </div>
          </div>
          <div className="relative">
            <img src={heroImg} alt="Meri Pahal community workers" loading="lazy" width={1600} height={1024} className="rounded-2xl shadow-elegant" />
            <Card className="absolute -bottom-6 -left-6 hidden p-4 sm:block">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-accent" />
                <div>
                  <div className="font-display font-bold text-primary">Trusted Partner</div>
                  <div className="text-xs text-muted-foreground">500+ NGOs onboard</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-soft py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold text-primary md:text-4xl">Voices from the field</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6">
                <p className="text-foreground/80">"{t.quote}"</p>
                <div className="mt-4 border-t pt-4">
                  <div className="font-semibold text-primary">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-extrabold md:text-4xl text-balance">Ready to scale your social impact?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">Join hundreds of NGOs and coordinators already building change with us.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="xl"><Link to="/contact">Get Started</Link></Button>
            <Button asChild variant="outlineLight" size="xl"><Link to="/coordinator">Join the Network</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}

import { Link } from "react-router-dom";
import { ArrowRight, Globe, Handshake, Heart, Users, Award, CheckCircle2, Sparkles } from "lucide-react";
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
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Registered NGO • Pan-India Network
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] text-balance md:text-5xl lg:text-6xl">
              Empowering NGOs.<br />Connecting Communities.<br />
              <span className="text-accent">Driving Real Impact.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-primary-foreground/85">
              Meri Pahal Fast Help Group is a unified platform for NGO website setup, CSR partnerships, the women hygiene mission, and a nationwide coordinator network.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl"><Link to="/ngo-website">Get NGO Website <ArrowRight /></Link></Button>
              <Button asChild variant="outlineLight" size="xl"><Link to="/coordinator">Join as Coordinator</Link></Button>
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

      {/* WHY US */}
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

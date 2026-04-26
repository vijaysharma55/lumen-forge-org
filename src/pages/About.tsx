import { Card } from "@/components/ui/card";
import { Award, Eye, Target, Users } from "lucide-react";

export default function About() {
  return (
    <>
      <section className="bg-hero py-20 text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">About Meri Pahal</h1>
          <p className="mt-3 max-w-2xl text-primary-foreground/85">A registered non-profit organization driving change through technology, partnerships, and grassroots coordination across India.</p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-primary">Who We Are</h2>
            <p className="mt-4 text-foreground/80">
              Meri Pahal Fast Help Group is a registered NGO committed to empowering grassroots organizations and community workers. We bridge the gap between traditional NGO operations and modern digital tools so that every village, block and district can access the resources they deserve.
            </p>
            <p className="mt-3 text-foreground/80">
              From low-cost NGO websites to a structured coordinator network and the women hygiene mission — we deliver impact at scale.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-6">
              <Target className="mb-3 h-8 w-8 text-accent" />
              <h3 className="font-display font-bold text-primary">Mission</h3>
              <p className="mt-1 text-sm text-muted-foreground">Empower every grassroots organization with the tools, partnerships and visibility they need to create change.</p>
            </Card>
            <Card className="p-6">
              <Eye className="mb-3 h-8 w-8 text-accent" />
              <h3 className="font-display font-bold text-primary">Vision</h3>
              <p className="mt-1 text-sm text-muted-foreground">A connected India where every district has empowered community leaders and tech-enabled NGOs.</p>
            </Card>
            <Card className="p-6">
              <Users className="mb-3 h-8 w-8 text-accent" />
              <h3 className="font-display font-bold text-primary">Network</h3>
              <p className="mt-1 text-sm text-muted-foreground">1,200+ coordinators, 500+ NGO partners, 120+ active districts.</p>
            </Card>
            <Card className="p-6">
              <Award className="mb-3 h-8 w-8 text-accent" />
              <h3 className="font-display font-bold text-primary">Registered</h3>
              <p className="mt-1 text-sm text-muted-foreground">Officially registered NGO with verified legal documentation.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-soft py-16">
        <div className="container">
          <Card className="p-8 md:p-12">
            <h2 className="font-display text-2xl font-bold text-primary">Founder's Message</h2>
            <p className="mt-4 italic text-foreground/80">
              "When we started Meri Pahal, our dream was simple — make social impact accessible to every village in India. Today, with our growing family of NGOs, coordinators and partners, that dream is becoming reality."
            </p>
            <p className="mt-4 font-semibold text-primary">— Founder, Meri Pahal Fast Help Group</p>
          </Card>
        </div>
      </section>
    </>
  );
}

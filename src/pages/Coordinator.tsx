import { Card } from "@/components/ui/card";
import CoordinatorApplicationForm from "@/components/coordinator/CoordinatorApplicationForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, MapPin, Award, IdCard } from "lucide-react";

const roles = [
  { level: "District Coordinator", fee: "₹2,100", perks: ["Lead district-wide projects", "Team of block coordinators", "Official ID & joining letter"] },
  { level: "Block Coordinator", fee: "₹1,100", perks: ["Manage block-level activities", "Reports to district lead", "Official ID card"] },
  { level: "Panchayat Coordinator", fee: "₹500", perks: ["Ground-level community work", "Direct village engagement", "Official ID card"] },
];

export default function Coordinator() {
  return (
    <>
      <section className="bg-hero py-20 text-primary-foreground">
        <div className="container max-w-3xl">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">Join as a Coordinator</h1>
          <p className="mt-3 text-primary-foreground/85">Lead change in your district, block or panchayat. Get official recognition, training, and a digital dashboard.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl"><Link to="/contact">Apply Now</Link></Button>
            <Button asChild variant="outlineLight" size="xl"><a href="#apply">View Roles</a></Button>
          </div>
        </div>
      </section>

      <section id="apply" className="container py-16">
        <h2 className="text-center font-display text-3xl font-bold text-primary">Choose your role</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {roles.map((r) => (
            <Card key={r.level} className="flex flex-col p-6 transition-base hover:-translate-y-1 hover:shadow-elegant">
              <MapPin className="mb-3 h-8 w-8 text-accent" />
              <h3 className="font-display text-xl font-bold text-primary">{r.level}</h3>
              <div className="mt-1 text-2xl font-extrabold text-accent">{r.fee}</div>
              <div className="text-xs text-muted-foreground">one-time registration</div>
              <ul className="mt-4 flex-1 space-y-2">
                {r.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />{p}</li>
                ))}
              </ul>
              <Button asChild className="mt-5" variant="hero"><Link to="/contact">Apply for this role</Link></Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-soft py-16">
        <div className="container grid gap-8 md:grid-cols-3">
          {[
            { i: IdCard, t: "Digital ID Card", d: "Auto-generated and downloadable from your dashboard." },
            { i: Award, t: "Joining Letter", d: "Official letter on Meri Pahal letterhead." },
            { i: CheckCircle2, t: "Training & Notices", d: "Get videos, documents and notices in your dashboard." },
          ].map((b) => (
            <div key={b.t} className="text-center">
              <b.i className="mx-auto mb-3 h-10 w-10 text-accent" />
              <h3 className="font-display text-lg font-bold text-primary">{b.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold text-primary">Coordinator Application</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">Submit below — your Member ID will be auto-assigned (e.g. MPFH-CO-0001).</p>
          <Card className="mt-8 p-6 md:p-8">
            <CoordinatorApplicationForm />
          </Card>
        </div>
      </section>
    </>
  );
}

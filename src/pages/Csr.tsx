import { Card } from "@/components/ui/card";
import InquiryForm from "@/components/inquiry/InquiryForm";
import { Building2, Heart, GraduationCap, Leaf } from "lucide-react";

const projects = [
  { i: GraduationCap, t: "Education for All", d: "Support rural schools, scholarships and digital literacy programs." },
  { i: Heart, t: "Healthcare Outreach", d: "Medical camps, awareness drives, and hygiene mission partnerships." },
  { i: Leaf, t: "Environment & Sustainability", d: "Tree plantation, water conservation and clean energy projects." },
  { i: Building2, t: "Skill Development", d: "Vocational training for women and youth in underserved districts." },
];

export default function Csr() {
  return (
    <>
      <section className="bg-hero py-20 text-primary-foreground">
        <div className="container max-w-3xl">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">CSR Project Partnership</h1>
          <p className="mt-3 text-primary-foreground/85">Partner with Meri Pahal to deploy impactful CSR initiatives across rural and semi-urban India.</p>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-display text-3xl font-bold text-primary">Available Project Verticals</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <Card key={p.t} className="p-6">
              <p.i className="mb-3 h-10 w-10 text-accent" />
              <h3 className="font-display text-lg font-bold text-primary">{p.t}</h3>
              <p className="mt-1 text-muted-foreground">{p.d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-soft py-16">
        <div className="container max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold text-primary">Apply for Partnership</h2>
          <Card className="mt-8 p-6 md:p-8">
            <InquiryForm defaultService="CSR Project Partnership" />
          </Card>
        </div>
      </section>
    </>
  );
}

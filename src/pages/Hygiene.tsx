import { Card } from "@/components/ui/card";
import InquiryForm from "@/components/inquiry/InquiryForm";
import { Heart, Users, Truck, Award } from "lucide-react";

export default function Hygiene() {
  return (
    <>
      <section className="bg-hero py-20 text-primary-foreground">
        <div className="container max-w-3xl">
          <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">Flagship Mission</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">Nari Pad Bank Mission</h1>
          <p className="mt-3 text-primary-foreground/85">A nationwide women's hygiene initiative — distributing affordable sanitary products and awareness across rural India.</p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { i: Heart, t: "Awareness", d: "Workshops on menstrual health & hygiene" },
            { i: Truck, t: "Distribution", d: "Affordable pad supply chain in villages" },
            { i: Users, t: "Franchise Network", d: "Earn while serving your community" },
            { i: Award, t: "Recognition", d: "Certificate & ID for active distributors" },
          ].map((b) => (
            <Card key={b.t} className="p-6 text-center">
              <b.i className="mx-auto mb-3 h-10 w-10 text-accent" />
              <h3 className="font-display font-bold text-primary">{b.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-soft py-16">
        <div className="container max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold text-primary">Register as Distributor / Franchise</h2>
          <Card className="mt-8 p-6 md:p-8">
            <InquiryForm defaultService="Women Hygiene Mission" />
          </Card>
        </div>
      </section>
    </>
  );
}

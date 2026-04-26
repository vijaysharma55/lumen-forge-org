import { Card } from "@/components/ui/card";

const photos = [
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800",
  "https://images.unsplash.com/photo-1591291621164-2c6367723315?w=800",
  "https://images.unsplash.com/photo-1547496502-affa22d38842?w=800",
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800",
];

export default function Gallery() {
  return (
    <>
      <section className="bg-hero py-20 text-primary-foreground">
        <div className="container max-w-3xl">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">Success Stories & Gallery</h1>
          <p className="mt-3 text-primary-foreground/85">Glimpses of our work across India — communities, coordinators and partners in action.</p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((src, i) => (
            <Card key={i} className="overflow-hidden">
              <img src={src} alt={`Field work ${i + 1}`} loading="lazy" className="aspect-[4/3] w-full object-cover transition-base hover:scale-105" />
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-soft py-16">
        <div className="container grid gap-6 text-center md:grid-cols-4">
          {[
            { n: "10,000+", l: "Lives impacted" },
            { n: "500+", l: "NGO partners" },
            { n: "1,200+", l: "Coordinators" },
            { n: "120+", l: "Districts active" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-4xl font-extrabold text-accent">{s.n}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

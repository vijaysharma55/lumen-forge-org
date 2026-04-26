import { Card } from "@/components/ui/card";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import InquiryForm from "@/components/inquiry/InquiryForm";

export default function Contact() {
  return (
    <>
      <section className="bg-hero py-20 text-primary-foreground">
        <div className="container max-w-3xl">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">Contact & Support</h1>
          <p className="mt-3 text-primary-foreground/85">We respond within 24 hours. Reach out for services, partnerships or support.</p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="p-6">
            <Phone className="mb-3 h-8 w-8 text-accent" />
            <h3 className="font-display font-bold text-primary">Call Us</h3>
            <p className="mt-1 text-sm text-muted-foreground">+91 00000 00000</p>
            <p className="text-sm text-muted-foreground">Mon–Sat, 10AM–7PM IST</p>
          </Card>
          <Card className="p-6">
            <Mail className="mb-3 h-8 w-8 text-accent" />
            <h3 className="font-display font-bold text-primary">Email</h3>
            <p className="mt-1 text-sm text-muted-foreground">support@meripahal.org</p>
          </Card>
          <Card className="p-6">
            <MessageCircle className="mb-3 h-8 w-8 text-accent" />
            <h3 className="font-display font-bold text-primary">WhatsApp</h3>
            <a href="https://wa.me/910000000000" target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm text-accent hover:underline">Chat with us →</a>
          </Card>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Card className="p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-primary">Send a message</h2>
            <p className="text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
            <div className="mt-6">
              <InquiryForm />
            </div>
          </Card>
          <Card className="overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold text-primary">Head Office</h2>
              <p className="mt-2 flex items-start gap-2 text-muted-foreground"><MapPin className="mt-0.5 h-5 w-5 text-accent" /> Meri Pahal Fast Help Group, India</p>
            </div>
            <iframe
              title="Office location"
              className="h-72 w-full border-0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.0!2d77.2090!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2s0x0!5e0!3m2!1sen!2sin!4v0"
              loading="lazy"
            />
          </Card>
        </div>
      </section>
    </>
  );
}

import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
              <Heart className="h-5 w-5" fill="currentColor" />
            </span>
            Meri Pahal
          </div>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Empowering communities through technology, partnerships and grassroots coordinators across India.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">Services</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/ngo-website" className="hover:text-accent">NGO Website Setup</Link></li>
            <li><Link to="/csr" className="hover:text-accent">CSR Project Partnership</Link></li>
            <li><Link to="/hygiene" className="hover:text-accent">Women Hygiene Mission</Link></li>
            <li><Link to="/coordinator" className="hover:text-accent">Join as Coordinator</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">Organization</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
            <li><Link to="/gallery" className="hover:text-accent">Success Stories</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            <li><Link to="/auth" className="hover:text-accent">Member Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">Contact</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-accent" /> +91 00000 00000</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-accent" /> support@meripahal.org</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-accent" /> Head Office, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-primary-foreground/60 md:flex-row">
          <p>© {new Date().getFullYear()} Meri Pahal Fast Help Group. All rights reserved.</p>
          <p>Built with ❤ for social impact across India.</p>
        </div>
      </div>
    </footer>
  );
}

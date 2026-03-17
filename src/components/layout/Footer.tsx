import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

const links = ["Home", "Products", "Subscription", "Reviews", "About", "Contact"];

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-[#eee3d3] bg-[#fffaf2]">
      <Container className="grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-heading text-2xl font-bold text-[#2b1f14]">Vari Agro Foods</h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#5d554c]">
            Premium quality rice, sourced directly from trusted farmers and delivered with freshness.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[Facebook, Instagram, Linkedin].map((Icon, idx) => (
              <button
                key={idx}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#e8dfd1] text-[#4d4033] transition hover:border-brand-red hover:text-brand-red"
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-brand-green">Quick Links</h4>
          <ul className="mt-4 space-y-3 text-sm text-[#5d554c]">
            {links.map((link) => (
              <li key={link}>{link}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-brand-green">Stay Connected</h4>
          <ul className="mt-4 space-y-3 text-sm text-[#5d554c]">
            <li className="flex items-center gap-2">
              <Phone size={15} /> +91 90000 00000
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} /> support@variagrofoods.com
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={15} /> Hyderabad, India
            </li>
          </ul>
          <div className="mt-4 flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="h-11 w-full rounded-full border border-[#e8dfd1] bg-white px-4 text-sm outline-none focus:border-brand-red"
            />
            <Button variant="primary" className="h-11 px-5">
              Join
            </Button>
          </div>
        </div>
      </Container>
      <div className="border-t border-[#eee3d3] py-4 text-center text-xs text-[#74685b]">
        © {new Date().getFullYear()} Vari Agro Foods. All rights reserved.
      </div>
    </footer>
  );
};

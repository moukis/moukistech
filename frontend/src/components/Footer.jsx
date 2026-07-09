import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Phone, Mail, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { CONTACT } from "@/data/content";
import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  const contactUrl = `${window.location.origin}/#contact`;
  const navItems = [
    [t.nav.services, "/#services"], [t.nav.about, "/#apropos"],
    [t.nav.shop, "/#boutique"], [t.nav.blog, "/blog"], [t.nav.contact, "/#contact"],
  ];
  return (
    <footer data-testid="footer" className="relative border-t border-white/10 bg-[#050507] pt-20 pb-10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display font-900 text-5xl sm:text-6xl tracking-tightest leading-none">
              Moukis<span className="text-[#0055FF]"> tech</span>
            </h2>
            <p className="mt-5 max-w-sm font-body text-white/50 text-sm leading-relaxed">{t.footer.tagline}</p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social" data-testid={`social-${i}`}
                   className="h-10 w-10 rounded-full border border-white/15 grid place-items-center text-white/70 hover:text-black hover:bg-[#00E5FF] hover:border-[#00E5FF] transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-mono-tech text-xs uppercase tracking-[0.2em] text-white/40">{t.footer.navTitle}</h4>
            <ul className="mt-5 space-y-3 font-body text-sm">
              {navItems.map(([l, h]) => (
                <li key={l}>
                  {h.startsWith("/#")
                    ? <a href={h} className="text-white/60 hover:text-[#00E5FF] transition-colors">{l}</a>
                    : <Link to={h} className="text-white/60 hover:text-[#00E5FF] transition-colors">{l}</Link>}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-mono-tech text-xs uppercase tracking-[0.2em] text-white/40">{t.footer.contactTitle}</h4>
            <ul className="mt-5 space-y-3 font-body text-sm">
              <li><a href={`tel:${CONTACT.phoneRaw}`} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"><Phone size={14} /> {CONTACT.phone}</a></li>
              <li><a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"><Mail size={14} /> {CONTACT.email}</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-mono-tech text-xs uppercase tracking-[0.2em] text-white/40">{t.footer.scanTitle}</h4>
            <div className="mt-5 inline-block rounded-xl bg-white p-3" data-testid="footer-qr">
              <QRCodeSVG value={contactUrl} size={96} bgColor="#ffffff" fgColor="#050507" />
            </div>
            <p className="mt-2 font-mono-tech text-[10px] text-white/40">{t.footer.scanSub}</p>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono-tech text-xs text-white/40">© {new Date().getFullYear()} Moukis tech — {CONTACT.owner}. {t.footer.rights}</p>
          <Link to="/admin/login" data-testid="admin-link" className="font-mono-tech text-xs text-white/30 hover:text-white/60 transition-colors">{t.footer.admin}</Link>
        </div>
      </div>
    </footer>
  );
}

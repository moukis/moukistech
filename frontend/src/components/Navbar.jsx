import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { CONTACT } from "@/data/content";

const LINKS = [
  { label: "Accueil", to: "/#accueil" },
  { label: "Services", to: "/#services" },
  { label: "À Propos", to: "/#apropos" },
  { label: "Boutique", to: "/#boutique" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (to) => {
    setOpen(false);
    if (to.startsWith("/#")) {
      const id = to.slice(2);
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 120);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(to);
    }
  };

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-[#050507]/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 h-[72px] flex items-center justify-between">
        <button data-testid="logo-btn" onClick={() => go("/#accueil")} className="flex items-center gap-2 group">
          <span className="h-8 w-8 rounded-lg bg-[#0055FF] grid place-items-center font-display font-900 text-white text-lg group-hover:bg-[#00E5FF] group-hover:text-black transition-colors">M</span>
          <span className="font-display font-700 text-lg tracking-tight">Moukis<span className="text-[#00E5FF]"> tech</span></span>
        </button>

        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => (
            <button
              key={l.label}
              data-testid={`nav-${l.label.toLowerCase()}`}
              onClick={() => go(l.to)}
              className="font-body text-sm text-white/70 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#00E5FF] focus-visible:outline-none rounded"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button
            data-testid="nav-book-btn"
            onClick={() => go("/#contact")}
            className="rounded-full bg-[#0055FF] px-5 py-2.5 text-sm font-600 text-white hover:bg-[#00E5FF] hover:text-black transition-colors"
          >
            Réserver
          </button>
        </div>

        <button data-testid="mobile-menu-btn" className="lg:hidden text-white" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div data-testid="mobile-menu" className="lg:hidden bg-[#050507]/95 backdrop-blur-xl border-b border-white/10 px-5 py-6 flex flex-col gap-4">
          {LINKS.map((l) => (
            <button key={l.label} onClick={() => go(l.to)} className="text-left font-body text-white/80 py-1">
              {l.label}
            </button>
          ))}
          <button onClick={() => go("/#contact")} className="mt-2 rounded-full bg-[#0055FF] px-5 py-3 text-sm font-600 text-white">
            Réserver une réparation
          </button>
        </div>
      )}
    </header>
  );
}

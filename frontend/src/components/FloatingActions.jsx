import { useState, useEffect } from "react";
import { MessageCircle, ArrowUp } from "lucide-react";
import { CONTACT } from "@/data/content";

export default function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-4 sm:right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      {show && (
        <button
          data-testid="back-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Retour en haut"
          className="h-11 w-11 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 grid place-items-center text-white hover:bg-white/20 transition-colors"
        >
          <ArrowUp size={18} />
        </button>
      )}
      <a
        data-testid="whatsapp-float-btn"
        href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Bonjour Moukis tech, je souhaite un devis de réparation.")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="h-14 w-14 rounded-full bg-[#25D366] grid place-items-center text-white shadow-lg shadow-[#25D366]/30 hover:scale-105 transition-transform"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Phone, ArrowRight, MessageCircle } from "lucide-react";
import { CONTACT } from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import { Overline } from "@/components/Reveal";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } };
const word = {
  hidden: { y: "110%", opacity: 0 },
  show: { y: "0%", opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

function Line({ text, highlight }) {
  return (
    <span className="block overflow-hidden">
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span variants={word} className={`inline-block ${w === highlight ? "text-[#0055FF]" : ""}`}>{w}</motion.span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { t } = useLang();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} id="accueil" data-testid="hero-section" className="relative min-h-screen overflow-hidden flex items-center">
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1518770660439-4636190af475" alt="Circuit board macro" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#050507]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-transparent" />
      </motion.div>

      <div className="absolute -left-40 top-1/3 h-[600px] w-[600px] glow-blue z-0" />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 w-full pt-28">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Overline>{t.hero.badge}</Overline>
        </motion.div>

        <motion.h1 variants={container} initial="hidden" animate="show"
          className="mt-6 font-display font-900 tracking-tightest leading-[0.92] text-5xl sm:text-7xl lg:text-[5.5rem] max-w-5xl">
          <Line text={t.hero.title1} highlight={t.hero.highlight} />
          <Line text={t.hero.title2} highlight={t.hero.highlight} />
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-8 max-w-xl font-body text-lg text-white/60">
          {t.hero.subtitle}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center gap-4">
          <a href="#contact" data-testid="hero-book-btn"
             className="group inline-flex items-center gap-2 rounded-full bg-[#0055FF] px-7 py-4 font-600 text-white hover:bg-[#00E5FF] hover:text-black transition-colors active:scale-[0.98]">
            {t.hero.book}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href={`tel:${CONTACT.phoneRaw}`} data-testid="hero-call-btn"
             className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 font-600 text-white hover:border-white hover:bg-white/5 transition-colors active:scale-[0.98]">
            <Phone size={18} /> {t.hero.call}
          </a>
          <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" data-testid="hero-whatsapp-btn"
             className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 text-[#25D366] px-7 py-4 font-600 hover:bg-[#25D366] hover:text-white transition-colors active:scale-[0.98]">
            <MessageCircle size={18} /> {t.hero.whatsapp}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function Marquee() {
  const { t } = useLang();
  const loop = [...t.marquee, ...t.marquee];
  return (
    <div data-testid="marquee" className="relative border-y border-white/10 py-8 overflow-hidden bg-[#0E0E12]">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {loop.map((txt, i) => (
          <span key={i} className="mx-8 font-display font-800 text-4xl sm:text-6xl text-stroke uppercase tracking-tight flex items-center gap-8">
            {txt} <span className="text-[#0055FF]" style={{ WebkitTextStroke: 0 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

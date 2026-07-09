import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { Overline } from "@/components/Reveal";

export default function Testimonials() {
  const { t } = useLang();
  return (
    <section id="avis" data-testid="testimonials-section" className="relative py-28 sm:py-40 bg-[#0E0E12] overflow-hidden">
      <div className="absolute right-0 top-0 h-[500px] w-[500px] glow-cyan" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 relative">
        <div className="max-w-2xl mb-14">
          <Overline>{t.testimonials.overline}</Overline>
          <h2 className="mt-4 font-display font-800 text-4xl sm:text-5xl lg:text-6xl tracking-tightest leading-[0.95]">{t.testimonials.title}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {t.testimonials.items.map((item, i) => (
            <motion.figure
              key={item.name}
              data-testid={`testimonial-${i}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
            >
              <div className="flex gap-1 text-[#00E5FF]">
                {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={16} fill="currentColor" />)}
              </div>
              <blockquote className="mt-5 font-body text-lg text-white/80 leading-relaxed">“{item.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#0055FF]/20 border border-[#0055FF]/30 grid place-items-center font-display font-700 text-[#00E5FF]">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-600 text-sm">{item.name}</p>
                  <p className="font-mono-tech text-xs text-white/40">{item.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

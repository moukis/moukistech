import { motion } from "framer-motion";
import { GALLERY } from "@/data/content";
import { Overline } from "@/components/Reveal";

const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7", "md:col-span-6", "md:col-span-6"];

export default function Gallery() {
  return (
    <section id="galerie" data-testid="gallery-section" className="relative py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl mb-14">
          <Overline>Galerie</Overline>
          <h2 className="mt-4 font-display font-800 text-4xl sm:text-5xl lg:text-6xl tracking-tightest leading-[0.95]">
            L'atelier &amp; le travail réalisé.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {GALLERY.map((g, i) => (
            <motion.div
              key={i}
              data-testid={`gallery-item-${i}`}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 ${spans[i]}`}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 2) * 0.08 }}
            >
              <img src={g.url} alt={g.label} className="h-72 w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 font-mono-tech text-xs uppercase tracking-[0.2em] text-white/80">{g.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

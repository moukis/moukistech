import { motion } from "framer-motion";
import { GALLERY_IMAGES, BEFORE_AFTER } from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import { Overline } from "@/components/Reveal";
import { BeforeAfterSlider } from "@/components/BeforeAfter";

const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7", "md:col-span-6", "md:col-span-6"];

export default function Gallery() {
  const { t } = useLang();
  return (
    <section id="galerie" data-testid="gallery-section" className="relative py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Before / After */}
        <div className="max-w-2xl mb-14">
          <Overline>{t.gallery.baOverline}</Overline>
          <h2 className="mt-4 font-display font-800 text-4xl sm:text-5xl lg:text-6xl tracking-tightest leading-[0.95]">{t.gallery.baTitle}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3" data-testid="before-after-grid">
          {BEFORE_AFTER.map((pair, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <BeforeAfterSlider
                before={pair.before}
                after={pair.after}
                beforeLabel={t.gallery.before}
                afterLabel={t.gallery.after}
                caption={t.gallery.baLabels[i]}
                hint={t.gallery.dragHint}
              />
            </motion.div>
          ))}
        </div>

        {/* Workshop grid */}
        <div className="max-w-2xl mt-28 mb-14">
          <Overline>{t.gallery.overline}</Overline>
          <h2 className="mt-4 font-display font-800 text-4xl sm:text-5xl lg:text-6xl tracking-tightest leading-[0.95]">{t.gallery.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {GALLERY_IMAGES.map((url, i) => (
            <motion.div
              key={i}
              data-testid={`gallery-item-${i}`}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 ${spans[i]}`}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 2) * 0.08 }}
            >
              <img src={url} alt={t.gallery.labels[i]} className="h-72 w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 font-mono-tech text-xs uppercase tracking-[0.2em] text-white/80">{t.gallery.labels[i]}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

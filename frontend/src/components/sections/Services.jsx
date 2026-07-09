import { motion } from "framer-motion";
import { SERVICE_ICONS } from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import { Overline } from "@/components/Reveal";

const spans = [
  "lg:col-span-5", "lg:col-span-4", "lg:col-span-3",
  "lg:col-span-3", "lg:col-span-4", "lg:col-span-5",
  "lg:col-span-4", "lg:col-span-4", "lg:col-span-4",
  "lg:col-span-5", "lg:col-span-3", "lg:col-span-4",
];

export default function Services() {
  const { t } = useLang();
  return (
    <section id="services" data-testid="services-section" className="relative py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <Overline>{t.services.overline}</Overline>
          <h2 className="mt-4 font-display font-800 text-4xl sm:text-5xl lg:text-6xl tracking-tightest leading-[0.95]">
            {t.services.title}
          </h2>
          <p className="mt-6 font-body text-white/50 text-base">{t.services.subtitle}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
          {t.services.items.map((s, i) => {
            const Icon = SERVICE_ICONS[i];
            return (
              <motion.div
                key={s.title}
                data-testid={`service-card-${i}`}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 hover:border-[#00E5FF]/40 transition-colors ${spans[i]}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 glow-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl bg-[#0055FF]/15 border border-[#0055FF]/30 grid place-items-center text-[#00E5FF] group-hover:bg-[#0055FF] group-hover:text-white transition-colors">
                    {Icon && <Icon size={22} />}
                  </div>
                  <h3 className="mt-6 font-display font-700 text-xl tracking-tight">{s.title}</h3>
                  <p className="mt-2 font-body text-sm text-white/50 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

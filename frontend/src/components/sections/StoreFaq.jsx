import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { STORE, FAQ } from "@/data/content";
import { Overline } from "@/components/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function StoreFaq() {
  return (
    <>
      {/* Future Store */}
      <section id="boutique" data-testid="store-section" className="relative py-28 sm:py-40 bg-[#0E0E12] overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 glow-blue" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <Overline>Boutique — Bientôt Disponible</Overline>
              <h2 className="mt-4 font-display font-800 text-4xl sm:text-5xl lg:text-6xl tracking-tightest leading-[0.95]">
                Bientôt : matériel &amp; accessoires en ligne.
              </h2>
              <p className="mt-6 font-body text-white/50">
                Ordinateurs reconditionnés, pièces détachées et accessoires soigneusement sélectionnés seront prochainement disponibles à l'achat.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-4 py-2 font-mono-tech text-xs text-[#00E5FF]">
              <ShoppingBag size={14} /> Ouverture prochaine
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {STORE.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.name}
                  data-testid={`store-item-${i}`}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col items-center text-center gap-3"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <span className="absolute top-2 right-2 font-mono-tech text-[9px] uppercase tracking-wider text-[#00E5FF]/70">Soon</span>
                  <div className="h-11 w-11 rounded-xl bg-[#0055FF]/15 border border-[#0055FF]/30 grid place-items-center text-[#00E5FF]">
                    <Icon size={20} />
                  </div>
                  <p className="font-body text-xs text-white/70 leading-snug">{s.name}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" data-testid="faq-section" className="relative py-28 sm:py-40">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="max-w-2xl mb-12">
            <Overline>Questions Fréquentes</Overline>
            <h2 className="mt-4 font-display font-800 text-4xl sm:text-5xl tracking-tightest leading-[0.95]">
              Tout ce que vous devez savoir.
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full" data-testid="faq-accordion">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
                <AccordionTrigger data-testid={`faq-trigger-${i}`} className="font-display font-600 text-left text-lg hover:text-[#00E5FF] hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-white/55 text-base leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}

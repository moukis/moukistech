import { motion } from "framer-motion";
import { WHY, CONTACT } from "@/data/content";
import { Reveal, Overline } from "@/components/Reveal";

export default function About() {
  return (
    <>
      {/* About */}
      <section id="apropos" data-testid="about-section" className="relative py-28 sm:py-40 bg-[#0E0E12]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid gap-16 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 relative">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-white/10">
                <img
                  src="https://images.pexels.com/photos/9242178/pexels-photo-9242178.jpeg"
                  alt="Technicien travaillant sur de l'électronique"
                  className="w-full h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/80 to-transparent" />
              </div>
            </Reveal>
            <div className="absolute -bottom-6 -right-2 sm:-right-6 rounded-2xl border border-white/10 bg-[#050507] px-7 py-5">
              <p className="font-display font-900 text-4xl text-[#00E5FF]">100%</p>
              <p className="font-mono-tech text-xs text-white/50 uppercase tracking-wider">Diagnostic transparent</p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Overline>À Propos — {CONTACT.owner}</Overline>
            <h2 className="mt-4 font-display font-800 text-4xl sm:text-5xl tracking-tightest leading-[0.98]">
              Une passion pour l'électronique, un engagement pour votre satisfaction.
            </h2>
            <div className="mt-8 space-y-5 font-body text-white/60 leading-relaxed">
              <p>
                Je m'appelle <span className="text-white font-600">{CONTACT.owner}</span>, technicien spécialisé
                dans la réparation d'ordinateurs portables et d'électronique. Depuis mes débuts, une conviction m'anime :
                chaque appareil mérite une seconde vie, et chaque client mérite l'honnêteté.
              </p>
              <p>
                De la micro-soudure sur carte mère au remplacement d'écran, en passant par la récupération de données,
                je mets mon expertise technique au service de solutions durables. Je privilégie toujours des pièces de qualité
                et une communication claire à chaque étape.
              </p>
              <p>
                Mon objectif est simple : gagner votre confiance par un travail rigoureux, rapide et à un prix juste.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Professionnalisme", "Fiabilité", "Satisfaction client"].map((t) => (
                <span key={t} className="rounded-full border border-white/15 px-4 py-2 font-mono-tech text-xs text-white/70">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Me — numbered manifesto */}
      <section id="pourquoi" data-testid="why-section" className="relative py-28 sm:py-40">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl mb-16">
            <Overline>Pourquoi Me Choisir</Overline>
            <h2 className="mt-4 font-display font-800 text-4xl sm:text-5xl lg:text-6xl tracking-tightest leading-[0.95]">
              Cinq raisons de me faire confiance.
            </h2>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {WHY.map((w, i) => (
              <motion.div
                key={w.n}
                data-testid={`why-item-${i}`}
                className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-10 items-baseline"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              >
                <div className="md:col-span-2 font-display font-900 text-5xl text-white/10 group-hover:text-[#0055FF] transition-colors">{w.n}</div>
                <h3 className="md:col-span-4 font-display font-700 text-2xl tracking-tight">{w.title}</h3>
                <p className="md:col-span-6 font-body text-white/50 leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

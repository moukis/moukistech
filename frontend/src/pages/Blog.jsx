import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Overline } from "@/components/Reveal";
import api from "@/lib/api";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Blog — Conseils de réparation | Moukis tech";
    api.get("/blog").then(({ data }) => setPosts(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#050507] text-white min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 sm:px-8 pt-36 pb-28">
        <Overline>Le Blog</Overline>
        <h1 className="mt-4 font-display font-900 text-5xl sm:text-7xl tracking-tightest leading-[0.95] max-w-3xl">
          Conseils &amp; astuces de réparation.
        </h1>
        <p className="mt-6 font-body text-white/50 max-w-xl">Nos guides pour prolonger la vie de votre matériel et éviter les pannes.</p>

        {loading ? (
          <p className="mt-16 font-mono-tech text-white/40">Chargement...</p>
        ) : posts.length === 0 ? (
          <p className="mt-16 font-mono-tech text-white/40">Aucun article pour le moment.</p>
        ) : (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <motion.div key={p.id} data-testid={`blog-card-${i}`}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}>
                <Link to={`/blog/${p.slug}`} className="group block rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-[#00E5FF]/40 transition-colors">
                  {p.cover_image && (
                    <div className="overflow-hidden h-48">
                      <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex gap-2 flex-wrap">
                      {p.tags?.slice(0, 2).map((t) => <span key={t} className="font-mono-tech text-[10px] uppercase tracking-wider text-[#00E5FF]">#{t}</span>)}
                    </div>
                    <h3 className="mt-3 font-display font-700 text-xl tracking-tight leading-snug group-hover:text-[#00E5FF] transition-colors">{p.title}</h3>
                    <p className="mt-2 font-body text-sm text-white/50 line-clamp-3">{p.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 font-mono-tech text-xs text-white/60 group-hover:text-white">Lire <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <Link to="/" className="mt-16 inline-flex items-center gap-2 font-mono-tech text-sm text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>
      </main>
      <Footer />
    </div>
  );
}

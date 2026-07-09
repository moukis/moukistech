import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { fr as frLocale, enUS } from "date-fns/locale";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Overline } from "@/components/Reveal";
import { useLang } from "@/context/LanguageContext";
import api from "@/lib/api";

export default function BlogArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const locale = lang === "fr" ? frLocale : enUS;
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/blog/${slug}`)
      .then(({ data }) => { setPost(data); document.title = `${data.title} | Moukis tech`; })
      .catch(() => setNotFound(true));
  }, [slug]);

  return (
    <div className="bg-[#050507] text-white min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 sm:px-8 pt-36 pb-28">
        <button onClick={() => navigate("/blog")} className="inline-flex items-center gap-2 font-mono-tech text-sm text-white/50 hover:text-white transition-colors mb-10">
          <ArrowLeft size={16} /> {t.blog.allArticles}
        </button>

        {notFound ? (
          <p className="font-mono-tech text-white/40">{t.blog.notFound}</p>
        ) : !post ? (
          <p className="font-mono-tech text-white/40">{t.blog.loading}</p>
        ) : (
          <article data-testid="blog-article">
            <Overline>{post.tags?.join(" · ") || "Article"}</Overline>
            <h1 className="mt-4 font-display font-900 text-4xl sm:text-5xl tracking-tightest leading-[1.02]">{post.title}</h1>
            <p className="mt-4 font-mono-tech text-xs text-white/40">{format(new Date(post.created_at), "PPP", { locale })}</p>
            {post.cover_image && (
              <img src={post.cover_image} alt={post.title} className="mt-8 rounded-2xl border border-white/10 w-full h-80 object-cover" />
            )}
            <div className="mt-10 font-body text-white/70 text-lg leading-relaxed space-y-5">
              {post.content.split("\n").filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </article>
        )}

        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="font-display font-700 text-xl">{t.blog.ctaTitle}</p>
          <Link to="/#contact" className="mt-4 inline-block rounded-full bg-[#0055FF] px-7 py-3 font-600 text-white hover:bg-[#00E5FF] hover:text-black transition-colors">
            {t.blog.ctaBtn}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

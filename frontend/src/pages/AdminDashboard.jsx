import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Mail, FileText, Trash2, Check, Plus, Pencil, X, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api, { formatApiErrorDetail } from "@/lib/api";

function Protected({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate("/admin/login"); }, [user, loading, navigate]);
  if (loading || !user) return <div className="min-h-screen bg-[#050507] grid place-items-center text-white/40 font-mono-tech">Chargement...</div>;
  return children;
}

const EMPTY = { title: "", excerpt: "", content: "", cover_image: "", tags: "", published: true };

export default function AdminDashboard() {
  return <Protected><Dashboard /></Protected>;
}

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("messages");
  const [contacts, setContacts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | post object
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { document.title = "Tableau de bord | Moukis tech"; }, []);

  const loadContacts = useCallback(() => api.get("/contact").then(({ data }) => setContacts(data)).catch(() => {}), []);
  const loadPosts = useCallback(() => api.get("/blog?published_only=false").then(({ data }) => setPosts(data)).catch(() => {}), []);
  useEffect(() => { loadContacts(); loadPosts(); }, [loadContacts, loadPosts]);

  const doLogout = () => { logout(); navigate("/admin/login"); };

  const markRead = async (id) => { await api.patch(`/contact/${id}/read`); loadContacts(); };
  const delContact = async (id) => { await api.delete(`/contact/${id}`); loadContacts(); toast.success("Message supprimé."); };

  const openNew = () => { setForm(EMPTY); setEditing("new"); };
  const openEdit = (p) => { setForm({ ...p, tags: (p.tags || []).join(", ") }); setEditing(p); };
  const closeEditor = () => { setEditing(null); setForm(EMPTY); };

  const savePost = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title, excerpt: form.excerpt, content: form.content,
      cover_image: form.cover_image, published: form.published,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editing === "new") await api.post("/blog", payload);
      else await api.put(`/blog/${editing.id}`, payload);
      toast.success("Article enregistré.");
      closeEditor(); loadPosts();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Échec.");
    } finally { setSaving(false); }
  };

  const delPost = async (id) => { await api.delete(`/blog/${id}`); loadPosts(); toast.success("Article supprimé."); };

  const unread = contacts.filter((c) => !c.is_read).length;
  const inputCls = "w-full rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:border-[#00E5FF] focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <header className="border-b border-white/10 bg-[#0E0E12]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-[#0055FF] grid place-items-center font-display font-900 text-white">M</span>
            <span className="font-display font-700">Admin · Moukis tech</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block font-mono-tech text-xs text-white/40">{user?.email}</span>
            <button onClick={doLogout} data-testid="admin-logout-btn" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/5 transition-colors">
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10">
        <div className="flex gap-3 mb-8">
          <button onClick={() => setTab("messages")} data-testid="tab-messages" className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-600 transition-colors ${tab === "messages" ? "bg-[#0055FF] text-white" : "border border-white/15 text-white/70 hover:bg-white/5"}`}>
            <Mail size={16} /> Messages {unread > 0 && <span className="ml-1 rounded-full bg-[#00E5FF] text-black text-[10px] px-1.5 py-0.5">{unread}</span>}
          </button>
          <button onClick={() => setTab("blog")} data-testid="tab-blog" className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-600 transition-colors ${tab === "blog" ? "bg-[#0055FF] text-white" : "border border-white/15 text-white/70 hover:bg-white/5"}`}>
            <FileText size={16} /> Blog
          </button>
        </div>

        {tab === "messages" && (
          <div data-testid="messages-panel" className="space-y-4">
            {contacts.length === 0 && <p className="font-mono-tech text-white/40">Aucun message.</p>}
            {contacts.map((c) => (
              <div key={c.id} data-testid={`contact-${c.id}`} className={`rounded-2xl border p-6 ${c.is_read ? "border-white/10 bg-white/[0.02]" : "border-[#0055FF]/40 bg-[#0055FF]/5"}`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-display font-700 text-lg">{c.name} {!c.is_read && <span className="ml-2 rounded-full bg-[#00E5FF] text-black text-[10px] px-2 py-0.5 align-middle">Nouveau</span>}</p>
                    <p className="font-mono-tech text-xs text-white/50 mt-1">{c.email} · {c.phone || "—"} {c.service && `· ${c.service}`}</p>
                  </div>
                  <div className="flex gap-2">
                    {!c.is_read && <button onClick={() => markRead(c.id)} data-testid={`mark-read-${c.id}`} className="rounded-full border border-white/15 p-2 hover:bg-white/10 transition-colors" title="Marquer comme lu"><Check size={16} /></button>}
                    <button onClick={() => delContact(c.id)} data-testid={`del-contact-${c.id}`} className="rounded-full border border-white/15 p-2 hover:bg-red-500/20 hover:border-red-500/40 transition-colors" title="Supprimer"><Trash2 size={16} /></button>
                  </div>
                </div>
                <p className="mt-4 font-body text-white/70 whitespace-pre-wrap">{c.message}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "blog" && (
          <div data-testid="blog-panel">
            {!editing ? (
              <>
                <button onClick={openNew} data-testid="new-post-btn" className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#0055FF] px-5 py-2.5 text-sm font-600 hover:bg-[#00E5FF] hover:text-black transition-colors"><Plus size={16} /> Nouvel article</button>
                <div className="space-y-3">
                  {posts.length === 0 && <p className="font-mono-tech text-white/40">Aucun article.</p>}
                  {posts.map((p) => (
                    <div key={p.id} data-testid={`post-row-${p.id}`} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-display font-600 truncate">{p.title} {!p.published && <span className="ml-2 font-mono-tech text-[10px] text-white/40">(brouillon)</span>}</p>
                        <p className="font-mono-tech text-xs text-white/40 truncate">/{p.slug}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 p-2 hover:bg-white/10 transition-colors"><ExternalLink size={16} /></a>
                        <button onClick={() => openEdit(p)} data-testid={`edit-post-${p.id}`} className="rounded-full border border-white/15 p-2 hover:bg-white/10 transition-colors"><Pencil size={16} /></button>
                        <button onClick={() => delPost(p.id)} data-testid={`del-post-${p.id}`} className="rounded-full border border-white/15 p-2 hover:bg-red-500/20 hover:border-red-500/40 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <form onSubmit={savePost} data-testid="post-editor" className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-700 text-2xl">{editing === "new" ? "Nouvel article" : "Modifier l'article"}</h2>
                  <button type="button" onClick={closeEditor} className="rounded-full border border-white/15 p-2 hover:bg-white/10 transition-colors"><X size={16} /></button>
                </div>
                <div className="space-y-4">
                  <input data-testid="post-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre" className={inputCls} required />
                  <input data-testid="post-excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Résumé court" className={inputCls} />
                  <input data-testid="post-cover" value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} placeholder="URL de l'image de couverture" className={inputCls} />
                  <input data-testid="post-tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Tags (séparés par des virgules)" className={inputCls} />
                  <textarea data-testid="post-content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Contenu de l'article..." rows={10} className={`${inputCls} resize-none`} required />
                  <label className="flex items-center gap-2 font-body text-sm text-white/70">
                    <input type="checkbox" data-testid="post-published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-[#0055FF] h-4 w-4" /> Publié
                  </label>
                </div>
                <button type="submit" disabled={saving} data-testid="save-post-btn" className="mt-6 rounded-full bg-[#0055FF] px-7 py-3 font-600 hover:bg-[#00E5FF] hover:text-black transition-colors disabled:opacity-60">
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

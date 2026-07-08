import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLogin() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate("/admin"); }, [user, navigate]);
  useEffect(() => { document.title = "Connexion Admin | Moukis tech"; }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) navigate("/admin");
    else setError(res.error);
  };

  const inputCls = "w-full rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:border-[#00E5FF] focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-[#050507] text-white grid place-items-center px-5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] glow-blue" />
      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 font-mono-tech text-sm text-white/50 hover:text-white transition-colors mb-8"><ArrowLeft size={16} /> Retour au site</Link>
        <form onSubmit={submit} data-testid="admin-login-form" className="rounded-3xl border border-white/10 bg-[#0E0E12] p-8">
          <div className="h-12 w-12 rounded-xl bg-[#0055FF] grid place-items-center text-white mb-6"><Lock size={22} /></div>
          <h1 className="font-display font-800 text-3xl tracking-tight">Espace Admin</h1>
          <p className="mt-2 font-body text-sm text-white/50">Connectez-vous pour gérer les demandes et le blog.</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="font-mono-tech text-xs uppercase text-white/50">Email</label>
              <input data-testid="admin-email-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-2 ${inputCls}`} placeholder="admin@email.com" />
            </div>
            <div>
              <label className="font-mono-tech text-xs uppercase text-white/50">Mot de passe</label>
              <input data-testid="admin-password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`mt-2 ${inputCls}`} placeholder="••••••••" />
            </div>
          </div>

          {error && <p data-testid="admin-login-error" className="mt-4 text-sm text-red-400">{error}</p>}

          <button type="submit" data-testid="admin-login-btn" disabled={loading}
            className="mt-6 w-full rounded-full bg-[#0055FF] px-6 py-3.5 font-600 text-white hover:bg-[#00E5FF] hover:text-black transition-colors active:scale-[0.98] disabled:opacity-60">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

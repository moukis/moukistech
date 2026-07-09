import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Send, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { fr as frLocale, enUS } from "date-fns/locale";
import { toast } from "sonner";
import { CONTACT } from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import { Overline } from "@/components/Reveal";
import api, { formatApiErrorDetail } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const { t, lang } = useLang();
  const locale = lang === "fr" ? frLocale : enUS;
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [date, setDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = t.contact.errName;
    if (!EMAIL_RE.test(form.email)) e.email = t.contact.errEmail;
    if (form.message.trim().length < 5) e.message = t.contact.errMsg;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const message = date ? `${form.message}\n\n${t.contact.dateChosen}: ${format(date, "PPP", { locale })}` : form.message;
    try {
      await api.post("/contact", { ...form, message });
      toast.success(t.contact.success);
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
      setDate(null);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || t.contact.fail);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 font-body text-white placeholder-white/30 focus:border-[#00E5FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]/40 transition-colors";

  return (
    <section id="contact" data-testid="contact-section" className="relative py-28 sm:py-40 bg-[#0E0E12] overflow-hidden">
      <div className="absolute -right-32 bottom-0 h-[500px] w-[500px] glow-blue" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 relative grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Overline>{t.contact.overline}</Overline>
          <h2 className="mt-4 font-display font-800 text-4xl sm:text-5xl tracking-tightest leading-[0.98]">{t.contact.title}</h2>
          <p className="mt-6 font-body text-white/50">{t.contact.desc}</p>

          <div className="mt-10 space-y-4">
            <a href={`tel:${CONTACT.phoneRaw}`} data-testid="contact-phone" className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-[#00E5FF]/40 transition-colors">
              <span className="h-11 w-11 rounded-xl bg-[#0055FF]/15 grid place-items-center text-[#00E5FF]"><Phone size={20} /></span>
              <span><span className="block font-mono-tech text-xs text-white/40 uppercase">{t.contact.phoneL}</span><span className="font-600">{CONTACT.phone}</span></span>
            </a>
            <a href={`mailto:${CONTACT.email}`} data-testid="contact-email" className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-[#00E5FF]/40 transition-colors">
              <span className="h-11 w-11 rounded-xl bg-[#0055FF]/15 grid place-items-center text-[#00E5FF]"><Mail size={20} /></span>
              <span><span className="block font-mono-tech text-xs text-white/40 uppercase">{t.contact.emailL}</span><span className="font-600">{CONTACT.email}</span></span>
            </a>
            <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" data-testid="contact-whatsapp" className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-[#25D366]/40 transition-colors">
              <span className="h-11 w-11 rounded-xl bg-[#25D366]/15 grid place-items-center text-[#25D366]"><MessageCircle size={20} /></span>
              <span><span className="block font-mono-tech text-xs text-white/40 uppercase">{t.contact.whatsappL}</span><span className="font-600">{t.contact.whatsappSub}</span></span>
            </a>
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <span className="h-11 w-11 rounded-xl bg-[#0055FF]/15 grid place-items-center text-[#00E5FF]"><MapPin size={20} /></span>
              <span><span className="block font-mono-tech text-xs text-white/40 uppercase">{t.contact.zoneL}</span><span className="font-600">{t.contact.zoneVal}</span></span>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-white/10" data-testid="contact-map">
            <iframe title="Map" src="https://www.openstreetmap.org/export/embed.html?bbox=2.224%2C48.815%2C2.469%2C48.902&layer=mapnik" className="w-full h-56 grayscale invert-[0.9] contrast-125" loading="lazy" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <motion.form
            onSubmit={submit}
            data-testid="contact-form"
            className="rounded-3xl border border-white/10 bg-[#050507] p-8 sm:p-10"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="font-mono-tech text-xs uppercase tracking-wider text-white/50">{t.contact.name}</label>
                <input data-testid="contact-name-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={t.contact.namePh} className={`mt-2 ${inputCls}`} />
                {errors.name && <p data-testid="error-name" className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label className="font-mono-tech text-xs uppercase tracking-wider text-white/50">{t.contact.email}</label>
                <input data-testid="contact-email-input" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder={t.contact.emailPh} className={`mt-2 ${inputCls}`} />
                {errors.email && <p data-testid="error-email" className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>
              <div>
                <label className="font-mono-tech text-xs uppercase tracking-wider text-white/50">{t.contact.phone}</label>
                <input data-testid="contact-phone-input" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder={t.contact.phonePh} className={`mt-2 ${inputCls}`} />
              </div>
              <div>
                <label className="font-mono-tech text-xs uppercase tracking-wider text-white/50">{t.contact.service}</label>
                <Select value={form.service} onValueChange={(v) => set("service", v)}>
                  <SelectTrigger data-testid="contact-service-select" className={`mt-2 ${inputCls} h-auto`}>
                    <SelectValue placeholder={t.contact.servicePh} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0E0E12] border-white/10 text-white max-h-64">
                    {t.services.items.map((s) => <SelectItem key={s.title} value={s.title} className="focus:bg-[#0055FF] focus:text-white">{s.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-5">
              <label className="font-mono-tech text-xs uppercase tracking-wider text-white/50">{t.contact.date}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" data-testid="contact-date-btn" className={`mt-2 flex items-center gap-3 ${inputCls} text-left`}>
                    <CalendarDays size={18} className="text-[#00E5FF]" />
                    {date ? format(date, "PPP", { locale }) : <span className="text-white/30">{t.contact.datePh}</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#0E0E12] border-white/10" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="mt-5">
              <label className="font-mono-tech text-xs uppercase tracking-wider text-white/50">{t.contact.message}</label>
              <textarea data-testid="contact-message-input" value={form.message} onChange={(e) => set("message", e.target.value)} rows={5} placeholder={t.contact.messagePh} className={`mt-2 ${inputCls} resize-none`} />
              {errors.message && <p data-testid="error-message" className="mt-1 text-xs text-red-400">{errors.message}</p>}
            </div>

            <button type="submit" data-testid="contact-submit-btn" disabled={loading}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0055FF] px-8 py-4 font-600 text-white hover:bg-[#00E5FF] hover:text-black transition-colors active:scale-[0.98] disabled:opacity-60">
              {loading ? t.contact.submitting : <>{t.contact.submit} <Send size={18} /></>}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

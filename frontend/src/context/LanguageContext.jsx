import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { translations } from "@/i18n/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("moukis_lang") || "fr");

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const changeLang = useCallback((l) => {
    setLang(l);
    localStorage.setItem("moukis_lang", l);
    document.documentElement.lang = l;
  }, []);

  const toggle = useCallback(() => changeLang(lang === "fr" ? "en" : "fr"), [lang, changeLang]);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);

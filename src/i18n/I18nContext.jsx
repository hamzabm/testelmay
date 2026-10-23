import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import fr from '../i18n/fr.js';
import ar from '../i18n/ar.js';

const I18nContext = createContext(null);
const dictionaries = { fr, ar };

function getInitialLang() {
  try {
    const url = new URLSearchParams(location.search).get('lang');
    if (url) return url;
    return localStorage.getItem('langue') || 'fr';
  } catch {
    return 'fr';
  }
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);
  const t = useCallback((key, fallback, vars = {}) => {
    let text = (dictionaries[lang] && dictionaries[lang][key]) || fallback || key;
    for (const [k, v] of Object.entries(vars)) {
      text = text.split(`{${k}}`).join(v);
    }
    return text;
  }, [lang]);

  const champ = useCallback((obj, name) => {
    if (lang === 'ar' && obj[`${name}_ar`]) return obj[`${name}_ar`];
    return obj[name];
  }, [lang]);

  const isFr = useCallback((obj, name) => {
    return lang === 'ar' && !obj[`${name}_ar`];
  }, [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('langue', lang); } catch {}
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'ar' ? 'fr' : 'ar'));
  }, []);

  return (
    <I18nContext.Provider value={{ lang, t, champ, isFr, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

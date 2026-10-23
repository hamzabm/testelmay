import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useTheme } from '../hooks/useTheme.js';
import { URL_HELLOASSO } from '../data/constants.js';

const NAV_LINKS = [
  { href: '#qui-sommes-nous', key: 'nav.qui', label: 'Qui sommes-nous' },
  { href: '#realisation', key: 'nav.realisation', label: 'Réalisation' },
  { href: '#projets', key: 'nav.projets', label: 'Projets' },
  { href: '#soutenir', key: 'nav.soutenir', label: 'Nous soutenir' },
  { href: '#communaute', key: 'nav.communaute', label: 'Communauté' },
  { href: '#contact', key: 'nav.contact', label: 'Contact' },
];

const MENU_ICONS = { '#accueil': '🏝️', '#qui-sommes-nous': '🤝', '#realisation': '⭐', '#projets': '🧩', '#soutenir': '💙', '#communaute': '📲', '#contact': '✉️' };

export default function Header({ scrolled }) {
  const { t, lang, toggleLang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-ouvert', menuOpen);
    return () => document.documentElement.classList.remove('menu-ouvert');
  }, [menuOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`} id="header">
        <div className="header-inner">
          <a href="#accueil" className="logo-link" aria-label={t('nav.logo', 'Ouled El May, accueil')} onClick={(e) => handleNavClick(e, '#accueil')}>
            <img src="/img/logo/logo.svg" alt="" width="40" height="40" className="logo-img" />
          </a>
          <nav className="nav-desktop" aria-label={t('nav.label', 'Navigation principale')}>
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                    {t(link.key, link.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-actions">
            <button type="button" className="btn-icon btn-lang" onClick={toggleLang} aria-label={lang === 'ar' ? 'Afficher le site en français' : 'Afficher le site en arabe'}>
              {lang === 'ar' ? 'FR' : 'عربي'}
            </button>
            <button type="button" className="btn-icon btn-theme" onClick={toggleTheme} aria-label={theme === 'dark' ? t('theme.jour', 'Activer le mode jour') : t('theme.nuit', 'Activer le mode nuit')}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <a className="btn-don-header" href={URL_HELLOASSO} target="_blank" rel="noopener">
              {t('don.court', 'Faire un don')}
            </a>
            <button type="button" className="btn-menu" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
              <span aria-hidden="true">☰</span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="menu-panel" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grip">
              <span className="sheet-handle" aria-hidden="true" />
              <button type="button" className="sheet-close" aria-label={t('menu.fermer', 'Fermer le menu')} onClick={() => setMenuOpen(false)}>✕</button>
            </div>
            <div className="sheet-body">
              <h2 className="sr-only">{t('menu.titre', 'Menu')}</h2>
              <ul className="menu-list">
                <li><a href="#accueil" onClick={(e) => handleNavClick(e, '#accueil')}><span aria-hidden="true">🏝️</span><span>{t('menu.accueil', 'Accueil')}</span></a></li>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                      <span aria-hidden="true">{MENU_ICONS[link.href]}</span>
                      <span>{t(link.key, link.label)}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="menu-footer">
                <a className="btn-primary" href={URL_HELLOASSO} target="_blank" rel="noopener">{t('don.helloasso', 'Faire un don sur HelloAsso')}</a>
                <Link className="menu-legal" to="/mentions-legales">{t('pied.mentions', 'Mentions légales et confidentialité')}</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

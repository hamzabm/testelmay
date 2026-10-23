import { useI18n } from '../i18n/I18nContext.jsx';
import { URL_HELLOASSO } from '../data/constants.js';

export default function Hero() {
  const { t } = useI18n();

  const scrollTo = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="accueil" className="hero">
      <div className="hero-img" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-text reveal-up">
          <p className="hero-eyebrow">{t('accueil.eyebrow', 'Association loi 1901 · Montreuil')}</p>
          <h1>{t('accueil.titre', "D'ici et de là-bas, ensemble pour El May.")}</h1>
          <p className="hero-sub">{t('accueil.texte', "Née à Montreuil, notre association fait vivre la culture djerbienne et mène des projets solidaires pour les enfants d'El May.")}</p>
          <div className="hero-actions">
            <a className="btn-primary" href={URL_HELLOASSO} target="_blank" rel="noopener">{t('don.helloasso', 'Faire un don sur HelloAsso')}</a>
            <a className="btn-ghost" href="#projets" onClick={(e) => scrollTo(e, '#projets')}>{t('accueil.projets', 'Voir nos projets')}</a>
          </div>
        </div>
        <div className="hero-arche reveal-up" style={{ '--delay': '.15s' }}>
          <div className="arche-frame">
            <img src="/img/logo/logo.svg" alt="" width="280" height="280" />
          </div>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true"><span /></div>
    </section>
  );
}

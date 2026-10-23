import { useI18n } from '../i18n/I18nContext.jsx';
import { communaute } from '../data/communaute.js';

export default function Communaute() {
  const { t, champ, isFr } = useI18n();

  const txt = (obj, name) => {
    const val = champ(obj, name);
    return isFr(obj, name) ? <span lang="fr" dir="ltr">{val}</span> : val;
  };

  const scrollTo = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="communaute" className="section">
      <div className="section-deco" aria-hidden="true" />
      <div className="container">
        <h2 className="reveal-up">{t('communaute.titre', 'Notre communauté')}</h2>
        <p className="section-intro reveal-up">{t('communaute.intro', 'Restez proches de nos actions, où que vous soyez : en France, à Djerba ou ailleurs.')}</p>
        <ul className="networks">
          {communaute.reseaux.map((r) => (
            <li key={r.id} className="network">
              {r.logo ? <img className="network-icon" src={r.logo} alt="" width="24" height="24" decoding="async" /> : <span className="network-icon" aria-hidden="true">{r.emoji}</span>}
              <span className="network-text">
                <strong>{txt(r, 'nom')}</strong>
                <span>{txt(r, 'texte')}</span>
              </span>
              {r.lien ? (
                <a className="network-btn" href={r.lien} target="_blank" rel="noopener">{txt(r, 'action')}</a>
              ) : (
                <span className="network-soon">{t('communaute.bientot', 'Bientôt disponible')}</span>
              )}
            </li>
          ))}
        </ul>
        <div className="partners-bar">
          <h3 className="partners-title">{t('partenaires.titre', 'Nos partenaires')}</h3>
        </div>
        <ul className="partners">
          {communaute.partenaires.map((p) => (
            <li key={p.id}>
              <a className="partner" href={p.lien} target="_blank" rel="noopener">
                <span className="partner-logo">{p.logo ? <img src={p.logo} alt="" loading="lazy" decoding="async" /> : <span aria-hidden="true">🏢</span>}</span>
                <strong>{txt(p, 'nom')}</strong>
                <span className="partner-role">{txt(p, 'role')}</span>
              </a>
            </li>
          ))}
          <li>
            <a className="partner partner-invite" href="#contact" data-sujet="partenariat" onClick={(e) => scrollTo(e, '#contact')}>
              <span className="partner-logo" aria-hidden="true">🤝</span>
              <strong>{t('partenaires.invitation', 'Votre structure ici ?')}</strong>
              <span className="partner-role">{t('partenaires.devenir', "Devenir partenaire d'Ouled El May")}</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

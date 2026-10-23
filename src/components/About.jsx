import { useI18n } from '../i18n/I18nContext.jsx';

const MISSIONS = [
  { icon: '🎭', titleKey: 'mission1.titre', titleFallback: 'Faire vivre la culture djerbienne', textKey: 'mission1.texte', textFallback: 'Événements, ateliers et échanges culturels, ouverts à tous.' },
  { icon: '🤝', titleKey: 'mission2.titre', titleFallback: 'Créer du lien et de l\'entraide', textKey: 'mission2.texte', textFallback: 'Entre nos membres, ici en France et là-bas à Djerba.' },
  { icon: '❤️', titleKey: 'mission3.titre', titleFallback: 'Agir pour les plus vulnérables', textKey: 'mission3.texte', textFallback: 'Des projets solidaires, notamment pour l\'éducation des enfants d\'El May.' },
];

export default function About() {
  const { t } = useI18n();

  const scrollTo = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="qui-sommes-nous" className="section">
      <div className="section-deco" aria-hidden="true" />
      <div className="container">
        <div className="about-grid">
          <div className="about-text reveal-up">
            <h2 id="titre-qui">{t('qui.titre', 'Qui sommes-nous')}</h2>
            <p>{t('qui.p1', "Ouled El May, « les enfants d'El May », est née en 2025 à Montreuil. Elle réunit des femmes et des hommes attachés à El May, au cœur de Djerba, et reste ouverte à toutes celles et ceux qui veulent agir avec nous.")}</p>
            <p>{t('qui.p2', "Ici, nous faisons vivre la culture de notre île. Là-bas, nous agissons aux côtés des écoles et des habitants.")}</p>
            <div className="ig-badge">
              <span aria-hidden="true">🧾</span> <strong>{t('qui.ig', 'Association d\'intérêt général. Vos dons ouvrent droit à une réduction d\'impôt de 66 %.')}</strong>{' '}
              <a href="#soutenir" onClick={(e) => scrollTo(e, '#soutenir')}>{t('qui.ig.lien', 'Calculer ma réduction')}</a>
            </div>
          </div>
          <ul className="missions reveal-up" style={{ '--delay': '.1s' }}>
            {MISSIONS.map((m) => (
              <li key={m.titleKey} className="mission-card">
                <span className="mission-icon" aria-hidden="true">{m.icon}</span>
                <h3>{t(m.titleKey, m.titleFallback)}</h3>
                <p>{t(m.textKey, m.textFallback)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

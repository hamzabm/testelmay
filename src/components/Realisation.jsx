import { useI18n } from '../i18n/I18nContext.jsx';
import { projets } from '../data/projets.js';
import { URL_HELLOASSO, STATUTS } from '../data/constants.js';

function choisirRealisation() {
  const termines = projets.filter((p) => p.statut === 'termine');
  return termines.find((p) => p.a_la_une) || [...termines].sort((a, b) => (b.date_fin || '').localeCompare(a.date_fin || ''))[0];
}

function photoSrc(photo) {
  return `${photo.src}.webp`;
}

function photoSrcset(photo) {
  return `${photo.src}-480.webp 480w, ${photo.src}.webp 960w`;
}

export default function Realisation({ onOpenProject }) {
  const { t, champ, isFr } = useI18n();
  const projet = choisirRealisation();
  if (!projet) return null;

  const photoCouv = projet.photos.find((p) => p.couverture) || projet.photos[0];
  const autres = projet.photos.filter((p) => p !== photoCouv);

  const txt = (obj, name) => {
    const val = champ(obj, name);
    return isFr(obj, name) ? <span lang="fr" dir="ltr">{val}</span> : val;
  };

  const scrollTo = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="realisation" className="section section-accent">
      <div className="section-deco" aria-hidden="true" />
      <div className="container">
        <h2 className="reveal-up">{t('real.titre', 'Notre dernière réalisation')}</h2>
        <div className="real-grid">
          <figure className="real-cover">
            {photoCouv ? (
              <img src={photoSrc(photoCouv)} srcSet={photoSrcset(photoCouv)} sizes="(max-width: 820px) 90vw, 40vw" alt={champ(photoCouv, 'alt') || ''} loading="lazy" decoding="async" />
            ) : (
              <span className="real-emoji" aria-hidden="true">{projet.emoji || '🌱'}</span>
            )}
          </figure>
          <div className="real-text">
            <p className="real-status"><span aria-hidden="true">✅</span> {t('real.statut', 'Projet terminé')}</p>
            <h3>{txt(projet, 'titre')}</h3>
            <p className="real-accroche">{txt(projet, 'accroche')}</p>
            <p>{txt(projet, 'resume')}</p>
            <ul className="faits">
              {(champ(projet, 'faits') || []).map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            {(champ(projet, 'etapes') || []).length > 0 && (
              <ol className="etapes">
                {(champ(projet, 'etapes') || []).map((e, i) => (
                  <li key={i}>
                    <span className="etape-date">{e.date}</span>
                    <strong>{e.titre}</strong>
                    <span>{e.texte}</span>
                  </li>
                ))}
              </ol>
            )}
            <div className="hero-actions">
              <a className="btn-primary" href={URL_HELLOASSO} target="_blank" rel="noopener">{t('don.helloasso', 'Faire un don sur HelloAsso')}</a>
              <button type="button" className="btn-ghost btn-link" onClick={() => onOpenProject(projet.id)}>{t('real.detail', 'Voir le projet en détail')}</button>
            </div>
          </div>
        </div>
        {autres.length > 0 && (
          <div className="gallery" role="region" aria-label={t('real.galerie', 'Le projet en images')} tabIndex={0}>
            {autres.map((p, i) => (
              <figure key={i}>
                <img src={photoSrc(p)} srcSet={photoSrcset(p)} sizes="240px" alt={champ(p, 'alt') || ''} loading="lazy" decoding="async" />
                <figcaption>{txt(p, 'legende')}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

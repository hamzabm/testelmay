import { useState, useRef } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { projets } from '../data/projets.js';
import { STATUTS } from '../data/constants.js';

export default function Projets({ onOpenProject }) {
  const { t, champ, isFr } = useI18n();
  const [filtre, setFiltre] = useState('tous');
  const carouselRef = useRef(null);

  const txt = (obj, name) => {
    const val = champ(obj, name);
    return isFr(obj, name) ? <span lang="fr" dir="ltr">{val}</span> : val;
  };

  const items = filtre === 'tous' ? projets : projets.filter((p) => p.statut === filtre);

  const compte = (statut) => projets.filter((p) => p.statut === statut).length;
  const boutons = [
    { id: 'tous', label: t('filtre.tous', 'Tous'), n: projets.length },
    ...Object.entries(STATUTS).map(([id, s]) => ({ id, label: t(`filtre.${id}`, s.filtre), n: compte(id) })).filter((f) => f.n > 0),
  ];

  const scrollByDir = (dir) => {
    const piste = carouselRef.current;
    if (!piste) return;
    const card = piste.querySelector('li');
    if (!card) return;
    const sens = document.documentElement.dir === 'rtl' ? -1 : 1;
    const pas = card.getBoundingClientRect().width + 20;
    piste.scrollBy({ left: pas * dir * sens, behavior: 'smooth' });
  };

  const couverture = (projet) => projet.photos.find((p) => p.couverture) || projet.photos[0];

  return (
    <section id="projets" className="section">
      <div className="section-deco" aria-hidden="true" />
      <div className="container">
        <h2 className="reveal-up">{t('projets.titre', 'Nos projets')}</h2>
        <div className="projects-bar">
          <div className="filters" role="group" aria-label={t('projets.filtres', 'Filtrer les projets')}>
            {boutons.map((f) => (
              <button key={f.id} type="button" className="filter" data-filtre={f.id} aria-pressed={f.id === filtre} onClick={() => setFiltre(f.id)}>
                {f.label} <span className="filter-count">{f.n}</span>
              </button>
            ))}
          </div>
          <div className="arrows">
            <button type="button" className="arrow" aria-label={t('projets.precedents', 'Projets précédents')} onClick={() => scrollByDir(-1)}>‹</button>
            <button type="button" className="arrow" aria-label={t('projets.suivants', 'Projets suivants')} onClick={() => scrollByDir(1)}>›</button>
          </div>
        </div>
        <ul className="carousel" ref={carouselRef} aria-live="polite">
          {items.map((p) => {
            const photo = couverture(p);
            const s = STATUTS[p.statut] || STATUTS['a-venir'];
            return (
              <li key={p.id}>
                <button type="button" className="card" onClick={() => onOpenProject(p.id)} aria-haspopup="dialog">
                  <span className="card-visual">
                    {photo ? (
                      <img src={`${photo.src}.webp`} srcSet={`${photo.src}-480.webp 480w, ${photo.src}.webp 960w`} sizes="(max-width: 820px) 80vw, 300px" alt="" loading="lazy" decoding="async" />
                    ) : (
                      <span className="visual-emoji" aria-hidden="true">{p.emoji || '🌱'}</span>
                    )}
                  </span>
                  <span className="card-body">
                    <span className="statut"><span aria-hidden="true">{s.emoji}</span> {t(`statut.${p.statut}`, s.court)}</span>
                    <span className="card-title">{txt(p, 'titre')}</span>
                    <span className="card-accroche">{txt(p, 'accroche')}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

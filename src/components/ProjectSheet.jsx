import { useState, useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { projets } from '../data/projets.js';
import { URL_HELLOASSO, URL_SITE, STATUTS } from '../data/constants.js';

export default function ProjectSheet({ projectId, onClose }) {
  const { t, champ, isFr, lang } = useI18n();
  const [playingVideo, setPlayingVideo] = useState(null);

  useEffect(() => {
    if (projectId) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => { document.documentElement.style.overflow = ''; };
  }, [projectId]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (projectId) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [projectId, onClose]);

  if (!projectId) return null;
  const projet = projets.find((p) => p.id === projectId);
  if (!projet) return null;

  const txt = (obj, name) => {
    const val = champ(obj, name);
    return isFr(obj, name) ? <span lang="fr" dir="ltr">{val}</span> : val;
  };

  const s = STATUTS[projet.statut] || STATUTS['a-venir'];
  const lien = `${URL_SITE}${lang === 'ar' ? '?lang=ar' : ''}#projet-${projet.id}`;
  const messageWhatsApp = `${champ(projet, 'titre')} : ${champ(projet, 'accroche')} ${lien}`;
  const faits = champ(projet, 'faits') || [];
  const etablissements = champ(projet, 'etapes') ? champ(projet, 'etablissements') : projet.etablissements;
  const etapes = champ(projet, 'etapes') || [];
  const videos = projet.videos || [];
  const photos = projet.photos || [];

  return (
    <div className="menu-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grip">
          <span className="sheet-handle" aria-hidden="true" />
          <button type="button" className="sheet-close" aria-label={t('fiche.fermer', 'Fermer la fiche')} onClick={onClose}>✕</button>
        </div>
        <div className="sheet-body">
          {photos.length > 0 ? (
            <div className="sheet-photos" role="region" aria-label={t('fiche.photos', 'Photos du projet')} tabIndex={0}>
              {photos.map((ph, i) => (
                <figure key={i}>
                  <img src={`${ph.src}.webp`} srcSet={`${ph.src}-480.webp 480w, ${ph.src}.webp 960w`} sizes="(max-width: 820px) 85vw, 360px" alt={champ(ph, 'alt') || ''} loading="lazy" decoding="async" />
                  <figcaption>{txt(ph, 'legende')}</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="sheet-emoji" aria-hidden="true">{projet.emoji || '🌱'}</div>
          )}

          <span className="statut"><span aria-hidden="true">{s.emoji}</span> {t(`statut.${projet.statut}`, s.court)}</span>
          <h3 id="fiche-titre">{txt(projet, 'titre')}</h3>
          <p className="sheet-accroche">{txt(projet, 'accroche')}</p>
          <p>{txt(projet, 'resume')}</p>

          {faits.length > 0 && <ul className="faits">{faits.map((f, i) => <li key={i}>{f}</li>)}</ul>}

          {etablissements.length > 0 && (
            <>
              <h4>{t('fiche.etablissements', 'Établissements concernés')}</h4>
              <ul className="sheet-etabs">{etablissements.map((e, i) => <li key={i}>🏫 {e}</li>)}</ul>
            </>
          )}

          {etapes.length > 0 && (
            <>
              <h4>{t('fiche.etapes', 'Les étapes')}</h4>
              <ol className="etapes">
                {etapes.map((e, i) => (
                  <li key={i}>
                    <span className="etape-date">{e.date}</span>
                    <strong>{e.titre}</strong>
                    <span>{e.texte}</span>
                  </li>
                ))}
              </ol>
            </>
          )}

          {videos.length > 0 && (
            <>
              <h4>{t('fiche.videos', 'En vidéo')}</h4>
              <div className="videos">
                {videos.map((v) => (
                  <figure key={v.id} className="video">
                    {playingVideo === v.id ? (
                      <iframe src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&playsinline=1&rel=0`} title={champ(v, 'titre')} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
                    ) : (
                      <button type="button" className="video-facade" onClick={() => setPlayingVideo(v.id)} aria-label={`${t('fiche.lancer', 'Lancer la vidéo : ')}${champ(v, 'titre')}`}>
                        {v.poster && <img src={`${v.poster}-480.webp`} alt="" loading="lazy" decoding="async" />}
                        <span className="video-play" aria-hidden="true">▶️</span>
                      </button>
                    )}
                    <figcaption>{txt(v, 'titre')}</figcaption>
                  </figure>
                ))}
              </div>
            </>
          )}

          <div className="sheet-actions">
            <a className="btn-primary" href={URL_HELLOASSO} target="_blank" rel="noopener">
              {projet.statut === 'a-venir' ? t('fiche.soutenir', 'Soutenir nos projets sur HelloAsso') : t('don.helloasso', 'Faire un don sur HelloAsso')}
            </a>
            <a className="btn-share" href={`https://wa.me/?text=${encodeURIComponent(messageWhatsApp)}`} target="_blank" rel="noopener">
              <span aria-hidden="true">📲</span> {t('fiche.partager', 'Partager sur WhatsApp')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

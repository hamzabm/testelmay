// ============================================================
// Ouled El May : projets (redesign)
// ============================================================

const URL_HELLOASSO = 'https://www.helloasso.com/associations/association-ouled-el-may';
const URL_SITE = 'https://ouledelmay.fr/';

const CONTENU_PROVISOIRE = document.documentElement.dataset.contenu === 'provisoire';

const STATUTS = {
  'termine':  { emoji: '✅', court: 'Terminé',  filtre: 'Terminés' },
  'en-cours': { emoji: '🔄', court: 'En cours', filtre: 'En cours' },
  'a-venir':  { emoji: '🌱', court: 'À venir',  filtre: 'À venir' }
};

let PROJETS = [];

function esc(texte) {
  return String(texte ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function txt(objet, nom) {
  const valeur = esc(I18N.champ(objet, nom));
  return I18N.resteEnFrancais(objet, nom) ? `<span lang="fr" dir="ltr">${valeur}</span>` : valeur;
}

function liste(objet, nom) {
  return I18N.champ(objet, nom) || [];
}

function photoHTML(photo, tailles, alt = I18N.champ(photo, 'alt')) {
  return `<img src="${esc(photo.src)}.webp"
    srcset="${esc(photo.src)}-480.webp 480w, ${esc(photo.src)}.webp 960w"
    sizes="${tailles}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
}

function couverture(projet) {
  return projet.photos.find((p) => p.couverture) || projet.photos[0];
}

function visuelHTML(projet, tailles) {
  const photo = couverture(projet);
  return photo
    ? photoHTML(photo, tailles, '')
    : `<span class="visual-emoji" aria-hidden="true">${esc(projet.emoji || '🌱')}</span>`;
}

function statutHTML(projet) {
  const s = STATUTS[projet.statut] || STATUTS['a-venir'];
  return `<span class="statut statut-${esc(projet.statut)}"><span aria-hidden="true">${s.emoji}</span> ${esc(I18N.t(`statut.${projet.statut}`, s.court))}</span>`;
}

function lienDon(projet) {
  return I18N.champ(projet, 'lien_don') || URL_HELLOASSO;
}

function choisirRealisation(projets) {
  const termines = projets.filter((p) => p.statut === 'termine');
  return termines.find((p) => p.a_la_une)
    || [...termines].sort((a, b) => (b.date_fin || '').localeCompare(a.date_fin || ''))[0];
}

function afficherRealisation(projet) {
  const zone = document.getElementById('realisation-contenu');
  if (!zone || !projet) return;

  const photoCouv = couverture(projet);
  const autres = projet.photos.filter((p) => p !== photoCouv);

  zone.innerHTML = `
    <div class="real-grid">
      <figure class="real-cover">
        ${photoCouv
          ? photoHTML(photoCouv, '(max-width: 820px) 90vw, 40vw')
          : `<span class="real-emoji" aria-hidden="true">${esc(projet.emoji || '🌱')}</span>`}
      </figure>
      <div class="real-text">
        <p class="real-status"><span aria-hidden="true">✅</span> ${esc(I18N.t('real.statut', 'Projet terminé'))}</p>
        <h3>${txt(projet, 'titre')}</h3>
        <p class="real-accroche">${txt(projet, 'accroche')}</p>
        <p>${txt(projet, 'resume')}</p>
        <ul class="faits">${liste(projet, 'faits').map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
        ${etapesHTML(projet)}
        <div class="hero-actions">
          <a class="btn-primary" href="${esc(lienDon(projet))}" target="_blank" rel="noopener">${esc(I18N.t('don.helloasso', 'Faire un don sur HelloAsso'))}</a>
          <button type="button" class="btn-ghost btn-link" data-ouvrir="${esc(projet.id)}">${esc(I18N.t('real.detail', 'Voir le projet en détail'))}</button>
        </div>
      </div>
    </div>
    ${autres.length ? `
    <div class="gallery" role="region" aria-label="${esc(I18N.t('real.galerie', 'Le projet en images'))}" tabindex="0">
      ${autres.map((p) => `
        <figure>
          ${photoHTML(p, '240px')}
          <figcaption>${txt(p, 'legende')}</figcaption>
        </figure>`).join('')}
    </div>` : ''}
  `;
}

function etapesHTML(projet) {
  const etapes = liste(projet, 'etapes');
  if (!etapes.length) return '';
  return `
    <ol class="etapes">
      ${etapes.map((e) => `
        <li>
          <span class="etape-date">${esc(e.date)}</span>
          <strong>${esc(e.titre)}</strong>
          <span>${esc(e.texte)}</span>
        </li>`).join('')}
    </ol>`;
}

let filtreActif = 'tous';

function afficherFiltres() {
  const zone = document.querySelector('#projets .filters');
  if (!zone) return;
  const compte = (statut) => PROJETS.filter((p) => p.statut === statut).length;

  const boutons = [{ id: 'tous', label: I18N.t('filtre.tous', 'Tous'), n: PROJETS.length }]
    .concat(Object.entries(STATUTS)
      .map(([id, s]) => ({ id, label: I18N.t(`filtre.${id}`, s.filtre), n: compte(id) }))
      .filter((f) => f.n > 0));

  zone.innerHTML = boutons.map((f) => `
    <button type="button" class="filter" data-filtre="${f.id}" aria-pressed="${f.id === filtreActif}">
      ${esc(f.label)} <span class="filter-count">${f.n}</span>
    </button>`).join('');
}

document.querySelector('#projets .filters')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter');
  if (!btn) return;
  filtreActif = btn.dataset.filtre;
  e.currentTarget.querySelectorAll('.filter').forEach((b) =>
    b.setAttribute('aria-pressed', b === btn));
  afficherCarrousel();
});

function afficherCarrousel() {
  const zone = document.getElementById('carrousel-projets');
  if (!zone) return;
  const items = filtreActif === 'tous' ? PROJETS : PROJETS.filter((p) => p.statut === filtreActif);

  zone.innerHTML = `
    <ul class="carousel" aria-live="polite">
      ${items.map((p) => `
        <li>
          <button type="button" class="card" data-ouvrir="${esc(p.id)}" aria-haspopup="dialog">
            <span class="card-visual">${visuelHTML(p, '(max-width: 820px) 80vw, 300px')}</span>
            <span class="card-body">
              ${statutHTML(p)}
              <span class="card-title">${txt(p, 'titre')}</span>
              <span class="card-accroche">${txt(p, 'accroche')}</span>
            </span>
          </button>
        </li>`).join('')}
    </ul>`;
  majFleches();
}

function initFleches() {
  document.querySelectorAll('[data-defiler]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const piste = document.querySelector('#carrousel-projets .carousel');
      const card = piste?.querySelector('li');
      if (!piste || !card) return;
      const sens = document.documentElement.dir === 'rtl' ? -1 : 1;
      const pas = card.getBoundingClientRect().width + 20;
      piste.scrollBy({ left: pas * Number(btn.dataset.defiler) * sens, behavior: 'smooth' });
    });
  });
  document.getElementById('carrousel-projets')
    ?.addEventListener('scroll', majFleches, { capture: true, passive: true });
  window.addEventListener('resize', majFleches);
}

function majFleches() {
  const piste = document.querySelector('#carrousel-projets .carousel');
  const [prec, suiv] = document.querySelectorAll('[data-defiler]');
  if (!piste || !prec) return;
  const deborde = piste.scrollWidth > piste.clientWidth + 4;
  const position = Math.abs(piste.scrollLeft);
  prec.parentElement.hidden = !deborde;
  prec.disabled = position < 4;
  suiv.disabled = position + piste.clientWidth >= piste.scrollWidth - 4;
}

const fiche = document.getElementById('fiche-projet');
let ficheOuverte = null;

function videoHTML(video) {
  const titre = I18N.champ(video, 'titre');
  const poster = video.poster
    ? `<img src="${esc(video.poster)}-480.webp" alt="" loading="lazy" decoding="async">`
    : '';
  return `
    <figure class="video">
      <button type="button" class="video-facade" data-video="${esc(video.id)}" data-titre="${esc(titre)}" aria-label="${esc(I18N.t('fiche.lancer', 'Lancer la vidéo : '))}${esc(titre)}">
        ${poster}
        <span class="video-play" aria-hidden="true">▶️</span>
      </button>
      <figcaption>${txt(video, 'titre')}</figcaption>
    </figure>`;
}

function ficheHTML(p) {
  const lien = `${URL_SITE}${I18N.langue === 'ar' ? '?lang=ar' : ''}#projet-${p.id}`;
  const messageWhatsApp = `${I18N.champ(p, 'titre')} : ${I18N.champ(p, 'accroche')} ${lien}`;
  const faits = liste(p, 'faits');
  const etablissements = liste(p, 'etablissements');
  const etapes = liste(p, 'etapes');
  return `
    <div class="sheet-grip">
      <span class="sheet-handle" aria-hidden="true"></span>
      <button type="button" class="sheet-close" aria-label="${esc(I18N.t('fiche.fermer', 'Fermer la fiche'))}">✕</button>
    </div>
    <div class="sheet-body">
      ${p.photos.length ? `
      <div class="sheet-photos" role="region" aria-label="${esc(I18N.t('fiche.photos', 'Photos du projet'))}" tabindex="0">
        ${p.photos.map((ph) => `
          <figure>${photoHTML(ph, '(max-width: 820px) 85vw, 360px')}
            <figcaption>${txt(ph, 'legende')}</figcaption>
          </figure>`).join('')}
      </div>` : `<div class="sheet-emoji" aria-hidden="true">${esc(p.emoji || '🌱')}</div>`}

      ${statutHTML(p)}
      <h3 id="fiche-titre">${txt(p, 'titre')}</h3>
      <p class="sheet-accroche">${txt(p, 'accroche')}</p>
      <p>${txt(p, 'resume')}</p>

      ${faits.length ? `<ul class="faits">${faits.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}

      ${etablissements.length ? `
      <h4>${esc(I18N.t('fiche.etablissements', 'Établissements concernés'))}</h4>
      <ul class="sheet-etabs">${etablissements.map((e) => `<li>🏫 ${esc(e)}</li>`).join('')}</ul>` : ''}

      ${etapes.length ? `<h4>${esc(I18N.t('fiche.etapes', 'Les étapes'))}</h4>${etapesHTML(p)}` : ''}

      ${p.videos.length ? `
      <h4>${esc(I18N.t('fiche.videos', 'En vidéo'))}</h4>
      <div class="videos">${p.videos.map(videoHTML).join('')}</div>` : ''}

      <div class="sheet-actions">
        <a class="btn-primary" href="${esc(lienDon(p))}" target="_blank" rel="noopener">
          ${esc(p.statut === 'a-venir'
            ? I18N.t('fiche.soutenir', 'Soutenir nos projets sur HelloAsso')
            : I18N.t('don.helloasso', 'Faire un don sur HelloAsso'))}
        </a>
        <a class="btn-share" href="https://wa.me/?text=${encodeURIComponent(messageWhatsApp)}" target="_blank" rel="noopener"><span aria-hidden="true">📲</span> ${esc(I18N.t('fiche.partager', 'Partager sur WhatsApp'))}</a>
      </div>
    </div>`;
}

function ouvrirFiche(id) {
  const projet = PROJETS.find((p) => p.id === id);
  if (!projet || !fiche) return;
  ficheOuverte = id;
  fiche.innerHTML = ficheHTML(projet);
  if (!fiche.open) fiche.showModal();
  document.documentElement.style.overflow = 'hidden';
  fiche.querySelector('.sheet-body').scrollTop = 0;
  history.replaceState(null, '', `${location.search}#projet-${id}`);
}

function fermerFiche() {
  if (!fiche?.open) return;
  fiche.close();
}

if (fiche) {
  fiche.addEventListener('close', () => {
    ficheOuverte = null;
    document.documentElement.style.overflow = '';
    fiche.style.transform = '';
    fiche.innerHTML = '';
    history.replaceState(null, '', `${location.search}#projets`);
  });

  fiche.addEventListener('click', (e) => {
    if (e.target === fiche || e.target.closest('.sheet-close')) fermerFiche();

    const facade = e.target.closest('.video-facade');
    if (facade) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(facade.dataset.video)}?autoplay=1&playsinline=1&rel=0`;
      iframe.title = facade.dataset.titre;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      facade.replaceWith(iframe);
    }
  });

  let startY = null;
  fiche.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.sheet-grip') && !e.target.closest('button')) {
      startY = e.clientY;
      fiche.setPointerCapture(e.pointerId);
    }
  });
  fiche.addEventListener('pointermove', (e) => {
    if (startY === null) return;
    const dy = Math.max(0, e.clientY - startY);
    fiche.style.transform = `translateY(${dy}px)`;
  });
  fiche.addEventListener('pointerup', (e) => {
    if (startY === null) return;
    const dy = e.clientY - startY;
    startY = null;
    if (dy > 120) fermerFiche();
    else fiche.style.transform = '';
  });
}

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-ouvrir]');
  if (trigger) ouvrirFiche(trigger.dataset.ouvrir);
});

function ouvrirDepuisAdresse() {
  const m = location.hash.match(/^#projet-([\w-]+)$/);
  if (m) {
    document.getElementById('projets')?.scrollIntoView();
    ouvrirFiche(m[1]);
  }
}

function toutAfficher() {
  afficherRealisation(choisirRealisation(PROJETS));
  afficherFiltres();
  afficherCarrousel();
  if (ficheOuverte) ouvrirFiche(ficheOuverte);
}

fetch(CONTENU_PROVISOIRE ? 'data/provisoire/projets.json' : 'data/projets.json')
  .then((reponse) => reponse.json())
  .then(({ projets }) => {
    PROJETS = projets;
    toutAfficher();
    initFleches();
    ouvrirDepuisAdresse();
    document.addEventListener('langue-change', toutAfficher);
  })
  .catch((erreur) => {
    console.warn('Projets non chargés. Ouvrez le site avec Live Server.', erreur);
    document.getElementById('realisation')?.setAttribute('hidden', '');
  });

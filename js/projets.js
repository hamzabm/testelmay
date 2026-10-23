// ============================================================
// Ouled El May : affichage des projets à partir de data/projets.json
// Pour ajouter ou modifier un projet, on modifie uniquement le fichier JSON.
// Version arabe : ajouter un champ "<nom>_ar" (titre_ar, accroche_ar, resume_ar…).
// S'il manque, le texte français s'affiche.
// ============================================================

const URL_HELLOASSO = 'https://www.helloasso.com/associations/association-ouled-el-may';
const URL_SITE = 'https://ouledelmay.fr/';

// Interrupteur réglé dans index.html (<html data-contenu="...">) :
// "provisoire" affiche les projets fictifs de data/provisoire/, "reel" les vrais projets.
const CONTENU_PROVISOIRE = document.documentElement.dataset.contenu === 'provisoire';

const STATUTS = {
  'termine':  { emoji: '✅', court: 'Terminé',  filtre: 'Terminés' },
  'en-cours': { emoji: '🔄', court: 'En cours', filtre: 'En cours' },
  'a-venir':  { emoji: '🌱', court: 'À venir',  filtre: 'À venir' }
};

let PROJETS = [];

// ---------- Outils ----------

// Protège le texte avant de l'insérer dans la page
function esc(texte) {
  return String(texte ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

// Texte d'un champ dans la langue du site. Un texte resté en français
// dans la version arabe est marqué lang="fr" pour garder son sens de lecture.
function txt(objet, nom) {
  const valeur = esc(I18N.champ(objet, nom));
  return I18N.resteEnFrancais(objet, nom) ? `<span lang="fr" dir="ltr">${valeur}</span>` : valeur;
}

// Liste traduite (faits, établissements) : "faits_ar" si présent, sinon "faits"
function liste(objet, nom) {
  return I18N.champ(objet, nom) || [];
}

// Une photo en deux tailles : 480 px de large pour les petits écrans, 960 px sinon
function photoHTML(photo, tailles, alt = I18N.champ(photo, 'alt')) {
  return `<img src="${esc(photo.src)}.webp"
    srcset="${esc(photo.src)}-480.webp 480w, ${esc(photo.src)}.webp 960w"
    sizes="${tailles}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
}

function couverture(projet) {
  return projet.photos.find((p) => p.couverture) || projet.photos[0];
}

// Visuel d'une carte : la photo de couverture, ou l'emoji du projet s'il n'a pas encore de photo
function visuelHTML(projet, tailles) {
  const photo = couverture(projet);
  return photo
    ? photoHTML(photo, tailles, '')
    : `<span class="visuel-emoji" aria-hidden="true">${esc(projet.emoji || '🌱')}</span>`;
}

function statutHTML(projet) {
  const s = STATUTS[projet.statut] || STATUTS['a-venir'];
  return `<span class="statut statut-${esc(projet.statut)}"><span aria-hidden="true">${s.emoji}</span> ${esc(I18N.t(`statut.${projet.statut}`, s.court))}</span>`;
}

function lienDon(projet) {
  return I18N.champ(projet, 'lien_don') || URL_HELLOASSO;
}

// ---------- Section 3 : notre dernière réalisation ----------
// Règle : le projet marqué "a_la_une", sinon le projet terminé le plus récent.
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
    <div class="real-grille">
      <figure class="real-couverture">
        ${photoCouv
          ? photoHTML(photoCouv, '(max-width: 820px) 90vw, 40vw')
          : `<span class="real-emoji" aria-hidden="true">${esc(projet.emoji || '🌱')}</span>`}
      </figure>
      <div class="real-texte">
        <p class="real-statut"><span aria-hidden="true">✅</span> ${esc(I18N.t('real.statut', 'Projet terminé'))}</p>
        <h3>${txt(projet, 'titre')}</h3>
        <p class="real-accroche">${txt(projet, 'accroche')}</p>
        <p>${txt(projet, 'resume')}</p>
        <ul class="faits">${liste(projet, 'faits').map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
        ${etapesHTML(projet)}
        <div class="accueil-actions">
          <a class="bouton-don" href="${esc(lienDon(projet))}" target="_blank" rel="noopener">${esc(I18N.t('don.helloasso', 'Faire un don sur HelloAsso'))}</a>
          <button type="button" class="lien-secondaire bouton-lien" data-ouvrir="${esc(projet.id)}">${esc(I18N.t('real.detail', 'Voir le projet en détail'))}</button>
        </div>
      </div>
    </div>
    ${autres.length ? `
    <div class="galerie" role="region" aria-label="${esc(I18N.t('real.galerie', 'Le projet en images'))}" tabindex="0">
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

// ---------- Section 4 : filtres + carrousel ----------
let filtreActif = 'tous';

function afficherFiltres() {
  const zone = document.querySelector('#projets .filtres');
  if (!zone) return;
  const compte = (statut) => PROJETS.filter((p) => p.statut === statut).length;

  const boutons = [{ id: 'tous', label: I18N.t('filtre.tous', 'Tous'), n: PROJETS.length }]
    .concat(Object.entries(STATUTS)
      .map(([id, s]) => ({ id, label: I18N.t(`filtre.${id}`, s.filtre), n: compte(id) }))
      .filter((f) => f.n > 0)); // on n'affiche pas un filtre vide

  zone.innerHTML = boutons.map((f) => `
    <button type="button" class="filtre" data-filtre="${f.id}" aria-pressed="${f.id === filtreActif}">
      ${esc(f.label)} <span class="filtre-nombre">${f.n}</span>
    </button>`).join('');
}

// Un seul écouteur pour tous les filtres, même après un nouvel affichage
document.querySelector('#projets .filtres')?.addEventListener('click', (e) => {
  const bouton = e.target.closest('.filtre');
  if (!bouton) return;
  filtreActif = bouton.dataset.filtre;
  e.currentTarget.querySelectorAll('.filtre').forEach((b) =>
    b.setAttribute('aria-pressed', b === bouton));
  afficherCarrousel();
});

function afficherCarrousel() {
  const zone = document.getElementById('carrousel-projets');
  if (!zone) return;
  const liste_ = filtreActif === 'tous' ? PROJETS : PROJETS.filter((p) => p.statut === filtreActif);

  zone.innerHTML = `
    <ul class="carrousel" aria-live="polite">
      ${liste_.map((p) => `
        <li>
          <button type="button" class="carte" data-ouvrir="${esc(p.id)}" aria-haspopup="dialog">
            <span class="carte-visuel">${visuelHTML(p, '(max-width: 820px) 80vw, 300px')}</span>
            <span class="carte-texte">
              ${statutHTML(p)}
              <span class="carte-titre">${txt(p, 'titre')}</span>
              <span class="carte-accroche">${txt(p, 'accroche')}</span>
            </span>
          </button>
        </li>`).join('')}
    </ul>`;
  majFleches();
}

// Flèches ‹ › : font défiler le carrousel d'une carte (dans le sens de lecture)
function initFleches() {
  document.querySelectorAll('[data-defiler]').forEach((bouton) => {
    bouton.addEventListener('click', () => {
      const piste = document.querySelector('#carrousel-projets .carrousel');
      const carte = piste?.querySelector('li');
      if (!piste || !carte) return;
      const sens = document.documentElement.dir === 'rtl' ? -1 : 1;
      const pas = carte.getBoundingClientRect().width + 20;
      piste.scrollBy({ left: pas * Number(bouton.dataset.defiler) * sens, behavior: 'smooth' });
    });
  });
  document.getElementById('carrousel-projets')
    ?.addEventListener('scroll', majFleches, { capture: true, passive: true });
  window.addEventListener('resize', majFleches);
}

function majFleches() {
  const piste = document.querySelector('#carrousel-projets .carrousel');
  const [prec, suiv] = document.querySelectorAll('[data-defiler]');
  if (!piste || !prec) return;
  const deborde = piste.scrollWidth > piste.clientWidth + 4;
  const position = Math.abs(piste.scrollLeft); // négatif en arabe (de droite à gauche)
  prec.parentElement.hidden = !deborde;
  prec.disabled = position < 4;
  suiv.disabled = position + piste.clientWidth >= piste.scrollWidth - 4;
}

// ---------- La fiche projet (bottom sheet) ----------
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
        <span class="video-lecture" aria-hidden="true">▶️</span>
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
    <div class="fiche-entete">
      <span class="fiche-poignee" aria-hidden="true"></span>
      <button type="button" class="fiche-fermer" aria-label="${esc(I18N.t('fiche.fermer', 'Fermer la fiche'))}">✕</button>
    </div>
    <div class="fiche-corps">
      ${p.photos.length ? `
      <div class="fiche-photos" role="region" aria-label="${esc(I18N.t('fiche.photos', 'Photos du projet'))}" tabindex="0">
        ${p.photos.map((ph) => `
          <figure>${photoHTML(ph, '(max-width: 820px) 85vw, 360px')}
            <figcaption>${txt(ph, 'legende')}</figcaption>
          </figure>`).join('')}
      </div>` : `<div class="fiche-emoji" aria-hidden="true">${esc(p.emoji || '🌱')}</div>`}

      ${statutHTML(p)}
      <h3 id="fiche-titre">${txt(p, 'titre')}</h3>
      <p class="fiche-accroche">${txt(p, 'accroche')}</p>
      <p>${txt(p, 'resume')}</p>

      ${faits.length ? `<ul class="faits">${faits.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}

      ${etablissements.length ? `
      <h4>${esc(I18N.t('fiche.etablissements', 'Établissements concernés'))}</h4>
      <ul class="fiche-etablissements">${etablissements.map((e) => `<li>🏫 ${esc(e)}</li>`).join('')}</ul>` : ''}

      ${etapes.length ? `<h4>${esc(I18N.t('fiche.etapes', 'Les étapes'))}</h4>${etapesHTML(p)}` : ''}

      ${p.videos.length ? `
      <h4>${esc(I18N.t('fiche.videos', 'En vidéo'))}</h4>
      <div class="videos">${p.videos.map(videoHTML).join('')}</div>` : ''}

      <div class="fiche-actions">
        <a class="bouton-don" href="${esc(lienDon(p))}" target="_blank" rel="noopener">
          ${esc(p.statut === 'a-venir'
            ? I18N.t('fiche.soutenir', 'Soutenir nos projets sur HelloAsso')
            : I18N.t('don.helloasso', 'Faire un don sur HelloAsso'))}
        </a>
        <a class="bouton-partage" href="https://wa.me/?text=${encodeURIComponent(messageWhatsApp)}" target="_blank" rel="noopener"><span aria-hidden="true">📲</span> ${esc(I18N.t('fiche.partager', 'Partager sur WhatsApp'))}</a>
      </div>
    </div>`;
}

function ouvrirFiche(id) {
  const projet = PROJETS.find((p) => p.id === id);
  if (!projet || !fiche) return;
  ficheOuverte = id;
  fiche.innerHTML = ficheHTML(projet);
  if (!fiche.open) fiche.showModal();
  document.documentElement.classList.add('fiche-ouverte');
  fiche.querySelector('.fiche-corps').scrollTop = 0;
  history.replaceState(null, '', `${location.search}#projet-${id}`);
}

function fermerFiche() {
  if (!fiche?.open) return;
  fiche.close();
}

if (fiche) {
  fiche.addEventListener('close', () => {
    ficheOuverte = null;
    document.documentElement.classList.remove('fiche-ouverte');
    fiche.style.transform = '';
    fiche.innerHTML = ''; // arrête une vidéo en cours de lecture
    history.replaceState(null, '', `${location.search}#projets`);
  });

  // Clic sur le fond assombri ou sur ✕ : fermeture
  fiche.addEventListener('click', (e) => {
    if (e.target === fiche || e.target.closest('.fiche-fermer')) fermerFiche();

    // Vidéo : YouTube n'est chargé qu'au clic (aucun cookie avant)
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

  // Glisser la poignée vers le bas pour fermer (mobile)
  let departY = null;
  fiche.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.fiche-entete') && !e.target.closest('button')) {
      departY = e.clientY;
      fiche.setPointerCapture(e.pointerId);
    }
  });
  fiche.addEventListener('pointermove', (e) => {
    if (departY === null) return;
    const dy = Math.max(0, e.clientY - departY);
    fiche.style.transform = `translateY(${dy}px)`;
  });
  fiche.addEventListener('pointerup', (e) => {
    if (departY === null) return;
    const dy = e.clientY - departY;
    departY = null;
    if (dy > 120) fermerFiche();
    else fiche.style.transform = '';
  });
}

// Tout bouton portant data-ouvrir="id" ouvre la fiche du projet
document.addEventListener('click', (e) => {
  const declencheur = e.target.closest('[data-ouvrir]');
  if (declencheur) ouvrirFiche(declencheur.dataset.ouvrir);
});

// Un lien partagé (#projet-pc-pour-tous) ouvre directement la fiche
function ouvrirDepuisAdresse() {
  const m = location.hash.match(/^#projet-([\w-]+)$/);
  if (m) {
    document.getElementById('projets')?.scrollIntoView();
    ouvrirFiche(m[1]);
  }
}

// Tout réafficher dans la nouvelle langue
function toutAfficher() {
  afficherRealisation(choisirRealisation(PROJETS));
  afficherFiltres();
  afficherCarrousel();
  if (ficheOuverte) ouvrirFiche(ficheOuverte);
}

// ---------- Chargement des données ----------
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
    // Sans serveur (fichier ouvert par double-clic), le navigateur bloque la lecture du JSON.
    console.warn('Projets non chargés. Ouvrez le site avec Live Server.', erreur);
    document.getElementById('realisation')?.setAttribute('hidden', '');
  });

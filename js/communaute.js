// ============================================================
// Ouled El May : réseaux et partenaires, à partir de data/communaute.json
// Pour changer un lien ou ajouter un partenaire, on modifie uniquement le JSON.
// Version arabe : champs "<nom>_ar" (texte_ar, action_ar, role_ar…).
// ============================================================

let COMMUNAUTE = null;

function escC(texte) {
  return String(texte ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

// Logo officiel du réseau (img/reseaux/), ou son emoji si le champ "logo" est vide
function iconeReseau(r, classe) {
  return r.logo
    ? `<img class="${classe}" src="${escC(r.logo)}" alt="" width="24" height="24" decoding="async">`
    : `<span class="${classe}" aria-hidden="true">${escC(r.emoji)}</span>`;
}

function afficherReseaux(reseaux) {
  const zone = document.getElementById('liste-reseaux');
  if (!zone) return;
  zone.innerHTML = reseaux.map((r) => `
    <li class="reseau">
      ${iconeReseau(r, 'reseau-icone')}
      <span class="reseau-texte">
        <strong>${escC(I18N.champ(r, 'nom'))}</strong>
        <span>${escC(I18N.champ(r, 'texte'))}</span>
      </span>
      ${r.lien
        ? `<a class="reseau-action" href="${escC(r.lien)}" target="_blank" rel="noopener">${escC(I18N.champ(r, 'action'))}</a>`
        : `<span class="reseau-bientot">${escC(I18N.t('communaute.bientot', 'Bientôt disponible'))}</span>`}
    </li>`).join('');
}

function afficherPartenaires(partenaires) {
  const zone = document.getElementById('liste-partenaires');
  if (!zone) return;
  const tuiles = partenaires.map((p) => {
    const contenu = `
      <span class="partenaire-logo">${p.logo
        ? `<img src="${escC(p.logo)}" alt="" loading="lazy" decoding="async">`
        : `<span aria-hidden="true">${escC(p.emoji || '🏢')}</span>`}</span>
      <strong>${escC(I18N.champ(p, 'nom'))}</strong>
      <span class="partenaire-role">${escC(I18N.champ(p, 'role'))}</span>`;
    return `<li>${p.lien
      ? `<a class="partenaire" href="${escC(p.lien)}" target="_blank" rel="noopener">${contenu}</a>`
      : `<div class="partenaire">${contenu}</div>`}</li>`;
  });

  // Emplacement toujours présent : il invite de nouveaux partenaires
  tuiles.push(`
    <li>
      <a class="partenaire partenaire-invitation" href="#contact" data-sujet="partenariat">
        <span class="partenaire-logo" aria-hidden="true">🤝</span>
        <strong>${escC(I18N.t('partenaires.invitation', 'Votre structure ici ?'))}</strong>
        <span class="partenaire-role">${escC(I18N.t('partenaires.devenir', "Devenir partenaire d'Ouled El May"))}</span>
      </a>
    </li>`);
  zone.innerHTML = tuiles.join('');
}

// Pied de page : tous les réseaux. Sans lien, le réseau s'affiche avec « bientôt », non cliquable.
function afficherReseauxPied(reseaux) {
  const zone = document.getElementById('pied-reseaux');
  if (!zone) return;
  zone.innerHTML = reseaux.map((r) => {
    const contenu = `${iconeReseau(r, 'pied-icone')} ${escC(I18N.champ(r, 'nom'))}`;
    return `<li>${r.lien
      ? `<a href="${escC(r.lien)}" target="_blank" rel="noopener">${contenu}</a>`
      : `<span class="pied-bientot">${contenu} <small>(${escC(I18N.t('pied.bientot', 'bientôt'))})</small></span>`}</li>`;
  }).join('');
}

// Flèches ‹ › des partenaires : elles n'apparaissent que si les tuiles dépassent
function majFlechesPartenaires() {
  const piste = document.getElementById('liste-partenaires');
  const bloc = document.querySelector('.partenaires-fleches');
  if (!piste || !bloc) return;
  const [prec, suiv] = bloc.querySelectorAll('button');
  const deborde = piste.scrollWidth > piste.clientWidth + 4;
  const position = Math.abs(piste.scrollLeft);
  bloc.hidden = !deborde;
  prec.disabled = position < 4;
  suiv.disabled = position + piste.clientWidth >= piste.scrollWidth - 4;
}

function initFlechesPartenaires() {
  const piste = document.getElementById('liste-partenaires');
  document.querySelectorAll('.partenaires-fleches button').forEach((bouton) => {
    bouton.addEventListener('click', () => {
      const tuile = piste.querySelector('li');
      if (!tuile) return;
      const sens = document.documentElement.dir === 'rtl' ? -1 : 1;
      piste.scrollBy({ left: (tuile.getBoundingClientRect().width + 16) * Number(bouton.dataset.sens) * sens, behavior: 'smooth' });
    });
  });
  piste?.addEventListener('scroll', majFlechesPartenaires, { passive: true });
  window.addEventListener('resize', majFlechesPartenaires);
}

function afficherCommunaute() {
  if (!COMMUNAUTE) return;
  afficherReseaux(COMMUNAUTE.reseaux);
  afficherPartenaires(COMMUNAUTE.partenaires);
  afficherReseauxPied(COMMUNAUTE.reseaux);
  majFlechesPartenaires();
}

// Interrupteur réglé dans index.html (<html data-contenu="...">) :
// en mode "provisoire", les partenaires viennent de data/provisoire/partenaires.json
// (les réseaux sociaux restent ceux de data/communaute.json).
const PARTENAIRES_PROVISOIRES = document.documentElement.dataset.contenu === 'provisoire';

Promise.all([
  fetch('data/communaute.json').then((reponse) => reponse.json()),
  PARTENAIRES_PROVISOIRES
    ? fetch('data/provisoire/partenaires.json').then((reponse) => reponse.json())
    : null
])
  .then(([donnees, provisoire]) => {
    COMMUNAUTE = provisoire ? { ...donnees, partenaires: provisoire.partenaires } : donnees;
    afficherCommunaute();
    initFlechesPartenaires();
    document.addEventListener('langue-change', afficherCommunaute);
  })
  .catch((erreur) => console.warn('Communauté non chargée. Ouvrez le site avec Live Server.', erreur));

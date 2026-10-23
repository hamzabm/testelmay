// ============================================================
// Ouled El May : réseaux et partenaires (redesign)
// ============================================================

let COMMUNAUTE = null;

function escC(texte) {
  return String(texte ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function iconeReseau(r, classe) {
  return r.logo
    ? `<img class="${classe}" src="${escC(r.logo)}" alt="" width="24" height="24" decoding="async">`
    : `<span class="${classe}" aria-hidden="true">${escC(r.emoji)}</span>`;
}

function afficherReseaux(reseaux) {
  const zone = document.getElementById('liste-reseaux');
  if (!zone) return;
  zone.innerHTML = reseaux.map((r) => `
    <li class="network">
      ${iconeReseau(r, 'network-icon')}
      <span class="network-text">
        <strong>${escC(I18N.champ(r, 'nom'))}</strong>
        <span>${escC(I18N.champ(r, 'texte'))}</span>
      </span>
      ${r.lien
        ? `<a class="network-btn" href="${escC(r.lien)}" target="_blank" rel="noopener">${escC(I18N.champ(r, 'action'))}</a>`
        : `<span class="network-soon">${escC(I18N.t('communaute.bientot', 'Bientôt disponible'))}</span>`}
    </li>`).join('');
}

function afficherPartenaires(partenaires) {
  const zone = document.getElementById('liste-partenaires');
  if (!zone) return;
  const tuiles = partenaires.map((p) => {
    const contenu = `
      <span class="partner-logo">${p.logo
        ? `<img src="${escC(p.logo)}" alt="" loading="lazy" decoding="async">`
        : `<span aria-hidden="true">${escC(p.emoji || '🏢')}</span>`}</span>
      <strong>${escC(I18N.champ(p, 'nom'))}</strong>
      <span class="partner-role">${escC(I18N.champ(p, 'role'))}</span>`;
    return `<li>${p.lien
      ? `<a class="partner" href="${escC(p.lien)}" target="_blank" rel="noopener">${contenu}</a>`
      : `<div class="partner">${contenu}</div>`}</li>`;
  });

  tuiles.push(`
    <li>
      <a class="partner partner-invite" href="#contact" data-sujet="partenariat">
        <span class="partner-logo" aria-hidden="true">🤝</span>
        <strong>${escC(I18N.t('partenaires.invitation', 'Votre structure ici ?'))}</strong>
        <span class="partner-role">${escC(I18N.t('partenaires.devenir', "Devenir partenaire d'Ouled El May"))}</span>
      </a>
    </li>`);
  zone.innerHTML = tuiles.join('');
}

function afficherReseauxPied(reseaux) {
  const zone = document.getElementById('pied-reseaux');
  if (!zone) return;
  zone.innerHTML = reseaux.map((r) => {
    const contenu = `${iconeReseau(r, 'footer-icon')} ${escC(I18N.champ(r, 'nom'))}`;
    return `<li>${r.lien
      ? `<a href="${escC(r.lien)}" target="_blank" rel="noopener">${contenu}</a>`
      : `<span class="footer-bientot">${contenu} <small>(${escC(I18N.t('pied.bientot', 'bientôt'))})</small></span>`}</li>`;
  }).join('');
}

function majFlechesPartenaires() {
  const piste = document.getElementById('liste-partenaires');
  const bloc = document.querySelector('.arrows-partners');
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
  document.querySelectorAll('.arrows-partners button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tuile = piste.querySelector('li');
      if (!tuile) return;
      const sens = document.documentElement.dir === 'rtl' ? -1 : 1;
      piste.scrollBy({ left: (tuile.getBoundingClientRect().width + 16) * Number(btn.dataset.sens) * sens, behavior: 'smooth' });
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

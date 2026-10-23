// ============================================================
// Ouled El May : scripts généraux
// ============================================================

// --- Bascule mode jour / nuit -------------------------------
// Par défaut, le site suit le réglage de l'appareil.
// Si le visiteur clique sur 🌙 / ☀️, son choix est mémorisé.
const racine = document.documentElement;
const boutonTheme = document.querySelector('.bouton-theme');
const preferenceNuit = window.matchMedia('(prefers-color-scheme: dark)');

function themeActuel() {
  return racine.dataset.theme || (preferenceNuit.matches ? 'dark' : 'light');
}

function majBoutonTheme() {
  const nuit = themeActuel() === 'dark';
  boutonTheme.textContent = nuit ? '☀️' : '🌙';
  boutonTheme.setAttribute('aria-label', nuit
    ? I18N.t('theme.jour', 'Activer le mode jour')
    : I18N.t('theme.nuit', 'Activer le mode nuit'));
}

boutonTheme.addEventListener('click', () => {
  const nouveau = themeActuel() === 'dark' ? 'light' : 'dark';
  racine.dataset.theme = nouveau;
  try { localStorage.setItem('theme', nouveau); } catch (e) { /* stockage indisponible : le choix vaut pour cette visite */ }
  majBoutonTheme();
});

preferenceNuit.addEventListener('change', majBoutonTheme);
document.addEventListener('langue-change', majBoutonTheme);
majBoutonTheme();

// --- Bouton don flottant (mobile) ----------------------------
// Il n'apparaît qu'une fois le bouton de l'accueil sorti de l'écran,
// pour ne jamais afficher deux boutons « don » l'un sur l'autre.
const donMobile = document.querySelector('.don-mobile');
const donAccueil = document.querySelector('.accueil .bouton-don');

if (donMobile && donAccueil && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entree]) => {
    donMobile.classList.toggle('visible', !entree.isIntersecting);
  }).observe(donAccueil);
} else if (donMobile) {
  donMobile.classList.add('visible');
}

// --- Simulateur de réduction d'impôt -------------------------
// Particulier : 66 % (art. 200 du CGI). Entreprise : 60 % (art. 238 bis du CGI).
const simulateur = document.querySelector('.simulateur');

if (simulateur) {
  const champ = simulateur.querySelector('#montant-don');
  const resultat = simulateur.querySelector('.simulateur-resultat');
  const note = simulateur.querySelector('.simulateur-note');
  const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2, minimumFractionDigits: 0 });
  let taux = 0.66;

  function calculer() {
    const montant = parseFloat(String(champ.value).replace(',', '.'));
    if (!montant || montant <= 0) {
      resultat.textContent = I18N.t('sim.vide', 'Indiquez un montant pour voir ce que votre don vous coûte réellement.');
      return;
    }
    const cout = Math.round(montant * (1 - taux) * 100) / 100;
    resultat.innerHTML = I18N.t('sim.resultat',
      'Votre don de {montant} ne vous coûte que <strong class="cout-reel">{cout}</strong> après réduction d\'impôt.',
      { montant: euros.format(montant), cout: euros.format(cout) });
    simulateur.querySelectorAll('[data-montant]').forEach((b) =>
      b.setAttribute('aria-pressed', Number(b.dataset.montant) === montant));
  }

  function ecrireNote() {
    const plafond = taux === 0.66
      ? I18N.t('sim.plafond.particulier', 'dans la limite de 20 % de votre revenu imposable')
      : I18N.t('sim.plafond.entreprise', "dans la limite de 20 000 € ou de 0,5 % du chiffre d'affaires");
    note.textContent = I18N.t('sim.note',
      "Réduction de {taux} du montant donné, {plafond}. Ouled El May est une association d'intérêt général.",
      { taux: `${Math.round(taux * 100)} %`, plafond });
  }

  simulateur.querySelectorAll('.segment').forEach((bouton) => {
    bouton.addEventListener('click', () => {
      taux = Number(bouton.dataset.taux);
      simulateur.querySelectorAll('.segment').forEach((b) => b.setAttribute('aria-pressed', b === bouton));
      ecrireNote();
      calculer();
    });
  });

  simulateur.querySelectorAll('[data-montant]').forEach((bouton) => {
    bouton.addEventListener('click', () => { champ.value = bouton.dataset.montant; calculer(); });
  });

  champ.addEventListener('input', calculer); // calcul en temps réel, à chaque frappe
  document.addEventListener('langue-change', () => { ecrireNote(); calculer(); });
  ecrireNote();
  calculer();
}

// --- Liens qui présélectionnent le sujet du formulaire de contact ---
document.addEventListener('click', (e) => {
  const lien = e.target.closest('[data-sujet]');
  const choix = document.getElementById('contact-sujet');
  if (lien && choix) choix.value = lien.dataset.sujet;
});

// --- Menu mobile (☰ + panneau du bas) ------------------------
const menu = document.getElementById('menu-mobile');
const boutonMenu = document.querySelector('.bouton-menu');

if (menu && boutonMenu) {
  function ouvrirMenu() {
    menu.showModal();
    boutonMenu.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('menu-ouvert');
  }

  menu.addEventListener('close', () => {
    boutonMenu.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('menu-ouvert');
    menu.style.transform = '';
  });

  boutonMenu.addEventListener('click', ouvrirMenu);

  menu.addEventListener('click', (e) => {
    // Fond assombri ou ✕ : fermeture
    if (e.target === menu || e.target.closest('.menu-fermer')) { menu.close(); return; }

    // Lien vers une section : on ferme, puis on y va
    const lien = e.target.closest('a[href^="#"]');
    if (lien) {
      e.preventDefault();
      menu.close();
      const cible = document.querySelector(lien.getAttribute('href'));
      cible?.scrollIntoView();
      history.replaceState(null, '', `${location.search}${lien.getAttribute('href')}`);
    }
  });

  // Glisser la poignée vers le bas pour fermer
  let departY = null;
  menu.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.fiche-entete') && !e.target.closest('button')) {
      departY = e.clientY;
      menu.setPointerCapture(e.pointerId);
    }
  });
  menu.addEventListener('pointermove', (e) => {
    if (departY !== null) menu.style.transform = `translateY(${Math.max(0, e.clientY - departY)}px)`;
  });
  menu.addEventListener('pointerup', (e) => {
    if (departY === null) return;
    const dy = e.clientY - departY;
    departY = null;
    if (dy > 120) menu.close();
    else menu.style.transform = '';
  });

  // « Vous êtes ici » : la section visible est mise en évidence (panneau mobile et barre ordinateur)
  if ('IntersectionObserver' in window) {
    const liens = document.querySelectorAll('.menu-liste a, .entete nav a');
    const observateur = new IntersectionObserver((entrees) => {
      entrees.filter((en) => en.isIntersecting).forEach((en) => {
        liens.forEach((a) => a.setAttribute('aria-current', a.getAttribute('href') === `#${en.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main > section[id]').forEach((section) => observateur.observe(section));
  }
}

// --- Les frises du logo se déroulent une fois à leur arrivée à l'écran ---
const frises = document.querySelectorAll('.frise');
if (frises.length && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observateurFrises = new IntersectionObserver((entrees) => {
    entrees.filter((en) => en.isIntersecting).forEach((en) => {
      en.target.querySelector(':scope > .frise')?.classList.add('deroulee');
      observateurFrises.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -25% 0px' });
  frises.forEach((frise) => {
    frise.classList.add('a-derouler'); // sans JavaScript, les frises restent simplement visibles
    // On observe la section (une frise masquée n'est pas « visible » pour le navigateur)
    observateurFrises.observe(frise.parentElement);
  });
}

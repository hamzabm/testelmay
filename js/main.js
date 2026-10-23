// ============================================================
// Ouled El May : scripts généraux (redesign)
// ============================================================

const root = document.documentElement;
const themeBtn = document.querySelector('.btn-theme');
const darkPref = window.matchMedia('(prefers-color-scheme: dark)');

function currentTheme() {
  return root.dataset.theme || (darkPref.matches ? 'dark' : 'light');
}

function updateThemeBtn() {
  const dark = currentTheme() === 'dark';
  themeBtn.textContent = dark ? '☀️' : '🌙';
  themeBtn.setAttribute('aria-label', dark
    ? I18N.t('theme.jour', 'Activer le mode jour')
    : I18N.t('theme.nuit', 'Activer le mode nuit'));
}

themeBtn.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
  updateThemeBtn();
});

darkPref.addEventListener('change', updateThemeBtn);
document.addEventListener('langue-change', updateThemeBtn);
updateThemeBtn();

// --- Header scroll effect ---
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// --- Progress bar ---
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progressBar.style.width = scrolled + '%';
}, { passive: true });

// --- Don FAB (mobile) ---
const donFab = document.querySelector('.don-fab');
const heroDon = document.querySelector('.hero .btn-primary');

if (donFab && heroDon && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    donFab.classList.toggle('visible', !entry.isIntersecting);
  }).observe(heroDon);
} else if (donFab) {
  donFab.classList.add('visible');
}

// --- Tax simulator ---
const simulator = document.querySelector('.simulator');

if (simulator) {
  const input = simulator.querySelector('#montant-don');
  const result = simulator.querySelector('.sim-result');
  const note = simulator.querySelector('.sim-note');
  const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2, minimumFractionDigits: 0 });
  let taux = 0.66;

  function calculer() {
    const montant = parseFloat(String(input.value).replace(',', '.'));
    if (!montant || montant <= 0) {
      result.textContent = I18N.t('sim.vide', 'Indiquez un montant pour voir ce que votre don vous coûte réellement.');
      return;
    }
    const cout = Math.round(montant * (1 - taux) * 100) / 100;
    result.innerHTML = I18N.t('sim.resultat',
      'Votre don de {montant} ne vous coûte que <strong class="cost-real">{cout}</strong> après réduction d\'impôt.',
      { montant: euros.format(montant), cout: euros.format(cout) });
    simulator.querySelectorAll('[data-montant]').forEach((b) =>
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

  simulator.querySelectorAll('.seg').forEach((btn) => {
    btn.addEventListener('click', () => {
      taux = Number(btn.dataset.taux);
      simulator.querySelectorAll('.seg').forEach((b) => b.setAttribute('aria-pressed', b === btn));
      ecrireNote();
      calculer();
    });
  });

  simulator.querySelectorAll('[data-montant]').forEach((btn) => {
    btn.addEventListener('click', () => { input.value = btn.dataset.montant; calculer(); });
  });

  input.addEventListener('input', calculer);
  document.addEventListener('langue-change', () => { ecrireNote(); calculer(); });
  ecrireNote();
  calculer();
}

// --- Preselect contact subject from data-sujet links ---
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-sujet]');
  const select = document.getElementById('contact-sujet');
  if (link && select) select.value = link.dataset.sujet;
});

// --- Mobile menu ---
const menu = document.getElementById('menu-mobile');
const menuBtn = document.querySelector('.btn-menu');

if (menu && menuBtn) {
  function openMenu() {
    menu.showModal();
    menuBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('menu-ouvert');
  }

  menu.addEventListener('close', () => {
    menuBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('menu-ouvert');
    menu.style.transform = '';
  });

  menuBtn.addEventListener('click', openMenu);

  menu.addEventListener('click', (e) => {
    if (e.target === menu || e.target.closest('.menu-close')) { menu.close(); return; }
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      e.preventDefault();
      menu.close();
      const target = document.querySelector(link.getAttribute('href'));
      target?.scrollIntoView();
      history.replaceState(null, '', `${location.search}${link.getAttribute('href')}`);
    }
  });

  let startY = null;
  menu.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.sheet-grip') && !e.target.closest('button')) {
      startY = e.clientY;
      menu.setPointerCapture(e.pointerId);
    }
  });
  menu.addEventListener('pointermove', (e) => {
    if (startY !== null) menu.style.transform = `translateY(${Math.max(0, e.clientY - startY)}px)`;
  });
  menu.addEventListener('pointerup', (e) => {
    if (startY === null) return;
    const dy = e.clientY - startY;
    startY = null;
    if (dy > 120) menu.close();
    else menu.style.transform = '';
  });

  // Section highlight in nav
  if ('IntersectionObserver' in window) {
    const links = document.querySelectorAll('.menu-list a, .nav-desktop a');
    const observer = new IntersectionObserver((entries) => {
      entries.filter((en) => en.isIntersecting).forEach((en) => {
        links.forEach((a) => a.setAttribute('aria-current', a.getAttribute('href') === `#${en.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section));
  }
}

// --- Section frise reveal ---
const decos = document.querySelectorAll('.section-deco');
if (decos.length && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const obs = new IntersectionObserver((entries) => {
    entries.filter((en) => en.isIntersecting).forEach((en) => {
      en.target.style.animation = 'revealUp .7s cubic-bezier(.25,.46,.45,.94) both';
      obs.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -25% 0px' });
  decos.forEach((d) => obs.observe(d.parentElement));
}

// ============================================================
// Ouled El May : version arabe (i18n)
// ============================================================

const I18N = (() => {
  const LANGUES = ['fr', 'ar'];
  let langue = 'fr';
  let dico = {};
  const originaux = new Map();
  const attributsOriginaux = new Map();

  try {
    langue = new URLSearchParams(location.search).get('lang') || localStorage.getItem('langue') || 'fr';
  } catch (e) {}
  if (!LANGUES.includes(langue)) langue = 'fr';

  function t(cle, francais, variables = {}) {
    let texte = (langue === 'ar' && dico[cle]) || francais;
    for (const [nom, valeur] of Object.entries(variables)) {
      texte = texte.split(`{${nom}}`).join(valeur);
    }
    return texte;
  }

  function champ(objet, nom) {
    return (langue === 'ar' && objet[`${nom}_ar`]) || objet[nom];
  }

  function resteEnFrancais(objet, nom) {
    return langue === 'ar' && !objet[`${nom}_ar`];
  }

  function appliquer() {
    const racine = document.documentElement;
    racine.lang = langue;
    racine.dir = langue === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (!originaux.has(el)) originaux.set(el, el.innerHTML);
      const traduction = langue === 'ar' && dico[el.dataset.i18n];
      el.innerHTML = traduction || originaux.get(el);
    });

    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((paire) => {
        const [attribut, cle] = paire.split(':').map((x) => x.trim());
        const memo = `${attribut}|${cle}`;
        if (!attributsOriginaux.has(el)) attributsOriginaux.set(el, {});
        const sauvegarde = attributsOriginaux.get(el);
        if (!(memo in sauvegarde)) sauvegarde[memo] = el.getAttribute(attribut);
        el.setAttribute(attribut, (langue === 'ar' && dico[cle]) || sauvegarde[memo]);
      });
    });

    const bouton = document.querySelector('.btn-lang');
    if (bouton) {
      bouton.textContent = langue === 'ar' ? 'FR' : 'عربي';
      bouton.lang = langue === 'ar' ? 'fr' : 'ar';
      bouton.setAttribute('aria-label', langue === 'ar' ? dico['langue.aria'] || 'Afficher le site en français' : 'Afficher le site en arabe');
    }

    document.dispatchEvent(new CustomEvent('langue-change', { detail: { langue } }));
  }

  async function chargerDico() {
    if (langue !== 'ar' || Object.keys(dico).length) return;
    try {
      dico = await fetch('data/i18n/ar.json').then((r) => r.json());
    } catch (e) {
      console.warn('Traductions arabes non chargées.', e);
    }
  }

  async function changer(nouvelle) {
    langue = nouvelle;
    try { localStorage.setItem('langue', langue); } catch (e) {}
    await chargerDico();
    appliquer();
  }

  document.querySelector('.btn-lang')
    ?.addEventListener('click', () => changer(langue === 'ar' ? 'fr' : 'ar'));

  if (langue === 'ar') chargerDico().then(appliquer);

  return {
    t, champ, resteEnFrancais,
    get langue() { return langue; }
  };
})();

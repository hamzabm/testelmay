// ============================================================
// Ouled El May : version arabe du site
// - Le français est écrit directement dans index.html.
// - Les traductions arabes sont dans data/i18n/ar.json.
// - Un élément traduisible porte data-i18n="cle" (son contenu)
//   ou data-i18n-attr="aria-label:cle" (un attribut).
// - Si une traduction manque, le français reste affiché.
// - Les autres scripts écoutent l'événement "langue-change" pour se mettre à jour.
// ============================================================

const I18N = (() => {
  const LANGUES = ['fr', 'ar'];
  let langue = 'fr';
  let dico = {};
  const originaux = new Map();      // contenus français d'origine, pour revenir au français
  const attributsOriginaux = new Map(); // attributs français d'origine

  try {
    langue = new URLSearchParams(location.search).get('lang') || localStorage.getItem('langue') || 'fr';
  } catch (e) { /* stockage indisponible : français par défaut */ }
  if (!LANGUES.includes(langue)) langue = 'fr';

  // Texte traduit, ou texte français par défaut. {variables} remplacées.
  function t(cle, francais, variables = {}) {
    let texte = (langue === 'ar' && dico[cle]) || francais;
    for (const [nom, valeur] of Object.entries(variables)) {
      texte = texte.split(`{${nom}}`).join(valeur);
    }
    return texte;
  }

  // Champ d'une fiche JSON : "titre_ar" en arabe s'il existe, sinon "titre"
  function champ(objet, nom) {
    return (langue === 'ar' && objet[`${nom}_ar`]) || objet[nom];
  }

  // Vrai si le champ s'affichera en français alors que le site est en arabe
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

    const bouton = document.querySelector('.bouton-langue');
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
    try { localStorage.setItem('langue', langue); } catch (e) { /* le choix vaut pour cette visite */ }
    await chargerDico();
    appliquer();
  }

  document.querySelector('.bouton-langue')
    ?.addEventListener('click', () => changer(langue === 'ar' ? 'fr' : 'ar'));

  if (langue === 'ar') chargerDico().then(appliquer);

  return {
    t, champ, resteEnFrancais,
    get langue() { return langue; }
  };
})();

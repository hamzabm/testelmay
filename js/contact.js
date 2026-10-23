// ============================================================
// Ouled El May : envoi du formulaire de contact via Web3Forms
// Les messages arrivent sur ouledelmay@gmail.com.
// ============================================================

const formulaire = document.getElementById('formulaire-contact');
const EMAIL_SECOURS = 'ouledelmay@gmail.com';

const SUJETS = {
  question: 'Question', benevolat: 'Bénévolat', partenariat: 'Partenariat',
  adhesion: 'Adhésion', presse: 'Presse', autre: 'Autre'
};

if (formulaire) {
  const etat = formulaire.querySelector('.formulaire-etat');
  const bouton = formulaire.querySelector('.bouton-envoyer');

  function afficherEtat(texte, type) {
    etat.textContent = texte;
    etat.dataset.type = type; // "succes", "erreur" ou "attente"
  }

  // Message d'erreur précis pour le premier champ incomplet
  function verifier() {
    const champs = [
      ['#contact-nom', I18N.t('form.erreur.nom', 'Indiquez votre nom.')],
      ['#contact-email', I18N.t('form.erreur.email', 'Indiquez une adresse e-mail valide, pour que nous puissions vous répondre.')],
      ['#contact-message', I18N.t('form.erreur.message', 'Écrivez votre message.')],
      ['#contact-accord', I18N.t('form.erreur.accord', 'Cochez la case d\'accord pour que nous puissions traiter votre demande.')]
    ];
    for (const [selecteur, message] of champs) {
      const champ = formulaire.querySelector(selecteur);
      if (!champ.checkValidity()) {
        champ.focus();
        afficherEtat(message, 'erreur');
        return false;
      }
    }
    return true;
  }

  formulaire.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!verifier()) return;

    const donnees = Object.fromEntries(new FormData(formulaire));
    if (donnees.access_key === 'VOTRE_CLE_WEB3FORMS') {
      afficherEtat(I18N.t('form.inactif', "Le formulaire n'est pas encore activé. Écrivez-nous à {email}.", { email: EMAIL_SECOURS }), 'erreur');
      return;
    }
    donnees.subject = `Site OEM : ${SUJETS[donnees.sujet] || 'Message'} de ${donnees.nom}${I18N.langue === 'ar' ? ' (version arabe)' : ''}`;

    bouton.disabled = true;
    afficherEtat(I18N.t('form.envoi', 'Envoi en cours…'), 'attente');

    try {
      const reponse = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(donnees)
      });
      const resultat = await reponse.json();
      if (!resultat.success) throw new Error(resultat.message);
      formulaire.reset();
      afficherEtat(I18N.t('form.succes', 'Message envoyé. Nous vous répondons dans les prochains jours.'), 'succes');
    } catch (erreur) {
      afficherEtat(I18N.t('form.echec', "Le message n'est pas parti. Vérifiez votre connexion et réessayez, ou écrivez-nous à {email}.", { email: EMAIL_SECOURS }), 'erreur');
    } finally {
      bouton.disabled = false;
    }
  });
}

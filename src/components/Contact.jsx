import { useState, useRef } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { EMAIL } from '../data/constants.js';

const SUJETS = [
  { value: 'question', key: 'form.sujet.question', label: 'Une question' },
  { value: 'benevolat', key: 'form.sujet.benevolat', label: 'Devenir bénévole' },
  { value: 'partenariat', key: 'form.sujet.partenariat', label: 'Proposer un partenariat' },
  { value: 'adhesion', key: 'form.sujet.adhesion', label: 'Adhésion' },
  { value: 'presse', key: 'form.sujet.presse', label: 'Presse et médias' },
  { value: 'autre', key: 'form.sujet.autre', label: 'Autre' },
];

export default function Contact({ sujetPreset }) {
  const { t, lang } = useI18n();
  const formRef = useRef(null);
  const [status, setStatus] = useState({ text: '', type: '' });
  const [sending, setSending] = useState(false);
  const [sujet, setSujet] = useState(sujetPreset || 'question');

  const validate = () => {
    const form = formRef.current;
    if (!form) return false;
    const checks = [
      ['#contact-nom', t('form.erreur.nom', 'Indiquez votre nom.')],
      ['#contact-email', t('form.erreur.email', "Indiquez une adresse e-mail valide, pour que nous puissions vous répondre.")],
      ['#contact-message', t('form.erreur.message', 'Écrivez votre message.')],
      ['#contact-accord', t('form.erreur.accord', "Cochez la case d'accord pour que nous puissions traiter votre demande.")],
    ];
    for (const [sel, msg] of checks) {
      const field = form.querySelector(sel);
      if (!field.checkValidity()) { field.focus(); setStatus({ text: msg, type: 'erreur' }); return false; }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const form = formRef.current;
    const data = Object.fromEntries(new FormData(form));
    if (data.access_key === 'VOTRE_CLE_WEB3FORMS') {
      setStatus({ text: t('form.inactif', "Le formulaire n'est pas encore activé. Écrivez-nous à {email}.", { email: EMAIL }), type: 'erreur' });
      return;
    }
    data.subject = `Site OEM : ${data.sujet} de ${data.nom}${lang === 'ar' ? ' (version arabe)' : ''}`;
    setSending(true);
    setStatus({ text: t('form.envoi', 'Envoi en cours…'), type: 'attente' });
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      form.reset();
      setStatus({ text: t('form.succes', 'Message envoyé. Nous vous répondons dans les prochains jours.'), type: 'succes' });
    } catch {
      setStatus({ text: t('form.echec', "Le message n'est pas parti. Vérifiez votre connexion et réessayez, ou écrivez-nous à {email}.", { email: EMAIL }), type: 'erreur' });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section section-accent">
      <div className="section-deco" aria-hidden="true" />
      <div className="container">
        <div className="contact-grid">
          <div className="contact-intro reveal-up">
            <h2 id="titre-contact">{t('contact.titre', 'Nous écrire')}</h2>
            <p>{t('contact.texte', 'Une question, une envie de nous rejoindre, une idée de partenariat ? Écrivez-nous, un membre du bureau vous répond.')}</p>
            <ul className="contact-info">
              <li><span aria-hidden="true">📍</span> {t('contact.siege', 'Siège : 223 rue de Paris, 93100 Montreuil')}</li>
              <li><span aria-hidden="true">✈️</span> <a href="https://t.me/ouledelmay" target="_blank" rel="noopener">{t('contact.telegram', 'Actualités sur notre canal Telegram')}</a></li>
            </ul>
          </div>
          <form className="contact-form" ref={formRef} onSubmit={handleSubmit} novalidate>
            <input type="hidden" name="access_key" value="99f0137e-ed36-40e8-ba62-03ef30e827d7" />
            <input type="hidden" name="from_name" value="Site Ouled El May" />
            <input type="checkbox" name="botcheck" className="honeypot" tabIndex="-1" autoComplete="off" aria-hidden="true" />
            <div className="field">
              <label htmlFor="contact-nom">{t('form.nom', 'Votre nom')}</label>
              <input id="contact-nom" name="nom" type="text" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="contact-email">{t('form.email', 'Votre e-mail')}</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="field">
              <label htmlFor="contact-sujet">{t('form.sujet', 'Sujet')}</label>
              <select id="contact-sujet" name="sujet" value={sujet} onChange={(e) => setSujet(e.target.value)}>
                {SUJETS.map((s) => <option key={s.value} value={s.value}>{t(s.key, s.label)}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="contact-message">{t('form.message', 'Votre message')}</label>
              <textarea id="contact-message" name="message" rows="6" required />
            </div>
            <div className="field field-check">
              <input id="contact-accord" name="accord_rgpd" type="checkbox" value="oui" required />
              <label htmlFor="contact-accord">{t('form.accord', 'J\'accepte que mes informations soient utilisées pour répondre à ma demande.')} <a href="#/mentions-legales">En savoir plus</a></label>
            </div>
            <button type="submit" className="btn-submit" disabled={sending}>{t('form.envoyer', 'Envoyer le message')}</button>
            <p className="form-status" role="status" aria-live="polite" data-type={status.type}>{status.text}</p>
          </form>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { URL_HELLOASSO } from '../data/constants.js';

export default function Soutenir() {
  const { t } = useI18n();
  const [taux, setTaux] = useState(0.66);
  const [montant, setMontant] = useState(100);

  const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2, minimumFractionDigits: 0 });
  const cout = Math.round(montant * (1 - taux) * 100) / 100;

  const plafond = taux === 0.66
    ? t('sim.plafond.particulier', 'dans la limite de 20 % de votre revenu imposable')
    : t('sim.plafond.entreprise', "dans la limite de 20 000 € ou de 0,5 % du chiffre d'affaires");

  const scrollTo = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="soutenir" className="section section-warm">
      <div className="section-deco" aria-hidden="true" />
      <div className="container">
        <h2 className="reveal-up">{t('soutenir.titre', 'Nous soutenir')}</h2>
        <p className="section-intro reveal-up">{t('soutenir.intro', "Chaque projet d'Ouled El May existe grâce à vous. Choisissez la façon d'aider qui vous ressemble.")}</p>
        <div className="support-grid">
          <div className="don-card reveal-up">
            <h3><span aria-hidden="true">💙</span> <span>{t('don.titre', 'Faire un don')}</span></h3>
            <p>{t('don.texte', "Ponctuel ou mensuel, votre don finance directement nos projets à El May. Vous recevez un reçu fiscal.")}</p>
            <form className="simulator" aria-labelledby="simulateur-titre" onSubmit={(e) => e.preventDefault()}>
              <p id="simulateur-titre" className="sim-title">{t('sim.titre', 'Combien votre don vous coûte réellement')}</p>
              <div className="seg-toggle" role="group" aria-label={t('sim.segments', 'Vous donnez en tant que')}>
                <button type="button" className="seg" aria-pressed={taux === 0.66} onClick={() => setTaux(0.66)}><span aria-hidden="true">👤</span> <span>{t('sim.particulier', 'Particulier')}</span></button>
                <button type="button" className="seg" aria-pressed={taux === 0.60} onClick={() => setTaux(0.60)}><span aria-hidden="true">🏢</span> <span>{t('sim.entreprise', 'Entreprise')}</span></button>
              </div>
              <label className="amount-label" htmlFor="montant-don">{t('sim.montant', 'Montant du don')}</label>
              <div className="amount-input">
                <input id="montant-don" type="number" inputMode="decimal" min="1" step="1" value={montant} onChange={(e) => setMontant(parseFloat(e.target.value) || 0)} />
                <span aria-hidden="true">€</span>
              </div>
              <div className="amount-quick" role="group" aria-label={t('sim.rapides', 'Montants suggérés')}>
                {[20, 50, 100, 250].map((m) => (
                  <button key={m} type="button" aria-pressed={montant === m} onClick={() => setMontant(m)}>{m} €</button>
                ))}
              </div>
              <p className="sim-result" aria-live="polite">
                {montant > 0 ? (
                  <span dangerouslySetInnerHTML={{ __html: t('sim.resultat', 'Votre don de {montant} ne vous coûte que <strong class="cost-real">{cout}</strong> après réduction d\'impôt.', { montant: euros.format(montant), cout: euros.format(cout) }) }} />
                ) : (
                  t('sim.vide', 'Indiquez un montant pour voir ce que votre don vous coûte réellement.')
                )}
              </p>
              <p className="sim-note">{t('sim.note', "Réduction de {taux} du montant donné, {plafond}. Ouled El May est une association d'intérêt général.", { taux: `${Math.round(taux * 100)} %`, plafond })}</p>
            </form>
            <a className="btn-primary" href={URL_HELLOASSO} target="_blank" rel="noopener">{t('don.helloasso', 'Faire un don sur HelloAsso')}</a>
          </div>
          <div className="other-ways reveal-up" style={{ '--delay': '.1s' }}>
            <div className="way-card">
              <h3><span aria-hidden="true">🤝</span> <span>{t('adherer.titre', 'Adhérer à l\'association')}</span></h3>
              <p>{t('adherer.texte', 'Devenez membre actif, ou membre bienfaiteur, pour participer à la vie de l\'association et voter en assemblée générale.')}</p>
              <a className="btn-text" href={URL_HELLOASSO} target="_blank" rel="noopener">{t('adherer.lien', 'Adhérer sur HelloAsso')}</a>
            </div>
            <div className="way-card">
              <h3><span aria-hidden="true">🙋</span> <span>{t('benevole.titre', 'Devenir bénévole')}</span></h3>
              <p>{t('benevole.texte', "Préparer le matériel, aider lors de nos événements, partager vos compétences : toutes les mains comptent, ici comme à Djerba.")}</p>
              <a className="btn-text" href="#contact" data-sujet="benevolat" onClick={(e) => scrollTo(e, '#contact')}>{t('benevole.lien', 'Proposer mon aide')}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

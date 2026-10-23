import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useTheme } from '../hooks/useTheme.js';
import { EMAIL } from '../data/constants.js';

export default function LegalPage() {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header className="header" id="header">
        <div className="header-inner">
          <Link to="/" className="logo-link" aria-label="Ouled El May, retour à l'accueil">
            <img src="/img/logo/logo.svg" alt="" width="40" height="40" className="logo-img" />
          </Link>
          <Link className="retour-accueil" to="/">{t('legal.retour', 'Retour au site')}</Link>
          <button type="button" className="btn-icon btn-theme" aria-label={theme === 'dark' ? t('theme.jour', 'Activer le mode jour') : t('theme.nuit', 'Activer le mode nuit')} onClick={toggleTheme} style={{ marginInlineStart: '.75rem' }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="page-legale">
        <h1>{t('legal.titre', 'Mentions légales')}</h1>
        <p className="mise-a-jour">{t('legal.maj', 'Dernière mise à jour : octobre 2026')}</p>

        <h2>Éditeur du site</h2>
        <p>
          Association Ouled El May (O.E.M), association régie par la loi du 1er juillet 1901<br />
          Numéro RNA : W931030076<br />
          Siège social : 223 rue de Paris, 93100 Montreuil<br />
          Contact : <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
        <p>Ouled El May est une association d'intérêt général : les dons qu'elle reçoit ouvrent droit à une réduction d'impôt dans les conditions des articles 200 et 238 bis du Code général des impôts.</p>

        <h2>Directeur de la publication</h2>
        <p>Sofiane Ben Messaoud, président de l'association.</p>

        <h2>Hébergement</h2>
        <p>
          LWS (Ligne Web Services), SAS<br />
          10 rue Penthièvre, 75008 Paris<br />
          <a href="https://www.lws.fr" target="_blank" rel="noopener">www.lws.fr</a>
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>Le logo, les textes et les photographies de ce site appartiennent à l'association Ouled El May ou sont utilisés avec l'accord de leurs auteurs. Toute reproduction sans autorisation écrite est interdite. Les logos des partenaires restent la propriété de leurs titulaires.</p>
        <p>Polices de caractères : Bree Serif et Rubik, sous licence SIL Open Font License.</p>

        <h2>Dons et adhésions</h2>
        <p>Les dons et les adhésions sont réalisés sur la plateforme HelloAsso. Le paiement est traité par HelloAsso : Ouled El May n'a jamais accès à vos coordonnées bancaires.</p>

        <h1 id="confidentialite" style={{ marginTop: '4rem' }}>{t('legal.confidentialite', 'Politique de confidentialité')}</h1>

        <h2>Responsable du traitement</h2>
        <p>Association Ouled El May, 223 rue de Paris, 93100 Montreuil, <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>

        <h2>Données collectées</h2>
        <p>Le site ne collecte des données personnelles que par le formulaire de contact : votre nom, votre adresse e-mail, le sujet et votre message.</p>
        <ul>
          <li><strong>Finalité :</strong> répondre à votre demande.</li>
          <li><strong>Base légale :</strong> votre consentement, donné en cochant la case du formulaire.</li>
          <li><strong>Destinataires :</strong> les membres du bureau de l'association. Le message transite par le service d'envoi Web3Forms jusqu'à la boîte e-mail de l'association. Vos données ne sont jamais vendues ni cédées.</li>
          <li><strong>Durée de conservation :</strong> le temps de traiter votre demande, puis au plus 3 ans après notre dernier échange.</li>
        </ul>

        <h2>Cookies et stockage</h2>
        <p>Ce site n'utilise aucun cookie et aucun outil de mesure d'audience. Il retient seulement, dans votre navigateur, votre choix de mode jour ou nuit. Cette information ne nous est jamais transmise.</p>

        <h2>Contenus de services tiers</h2>
        <p>Les vidéos sont hébergées sur YouTube. Elles ne se chargent que lorsque vous cliquez sur ▶️ : avant ce clic, aucune information n'est envoyée à YouTube. Après, la politique de confidentialité de Google s'applique.</p>
        <p>Les liens vers HelloAsso, Telegram, WhatsApp et Facebook vous mènent vers des services soumis à leurs propres règles de confidentialité.</p>

        <h2>Vos droits</h2>
        <p>Vous pouvez à tout moment demander l'accès à vos données, leur rectification, leur effacement, leur portabilité, ou vous opposer à leur traitement. Écrivez-nous à <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
        <p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a>).</p>

        <p style={{ marginTop: '3rem' }}><Link className="retour-accueil" to="/">{t('legal.retour', 'Retour au site')}</Link></p>
      </main>

      <footer className="pied">
        <p>Association Ouled El May, 223 rue de Paris, 93100 Montreuil</p>
        <Link to="/">Accueil</Link>
      </footer>
    </>
  );
}

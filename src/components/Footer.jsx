import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';
import { communaute } from '../data/communaute.js';

const NAV_LINKS = [
  { href: '#qui-sommes-nous', key: 'nav.qui', label: 'Qui sommes-nous' },
  { href: '#realisation', key: 'nav.realisation', label: 'Réalisation' },
  { href: '#projets', key: 'nav.projets', label: 'Projets' },
  { href: '#soutenir', key: 'nav.soutenir', label: 'Nous soutenir' },
  { href: '#communaute', key: 'nav.communaute', label: 'Communauté' },
  { href: '#contact', key: 'nav.contact', label: 'Contact' },
];

export default function Footer() {
  const { t, champ } = useI18n();

  const handleNavClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-cols">
          <div className="footer-id">
            <img src="/img/icones/icone-192.png" alt="" width="48" height="48" loading="lazy" />
            <p><strong>Ouled El May</strong><br />
              <span>{t('pied.statut', "Association loi 1901 d'intérêt général")}</span><br />
              <span>{t('pied.siege', '223 rue de Paris, 93100 Montreuil')}</span>
            </p>
          </div>
          <nav className="footer-nav" aria-label={t('pied.plan', 'Plan du site')}>
            <h2 className="footer-heading">{t('pied.plan', 'Plan du site')}</h2>
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}><a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>{t(link.key, link.label)}</a></li>
              ))}
            </ul>
          </nav>
          <div className="footer-social">
            <h2 className="footer-heading">{t('pied.suivre', 'Nous suivre')}</h2>
            <ul>
              {communaute.reseaux.map((r) => (
                <li key={r.id}>
                  {r.lien ? (
                    <a href={r.lien} target="_blank" rel="noopener">
                      {r.logo ? <img className="footer-icon" src={r.logo} alt="" width="20" height="20" /> : <span className="footer-icon" aria-hidden="true">{r.emoji}</span>}
                      {' '}{champ(r, 'nom')}
                    </a>
                  ) : (
                    <span className="footer-bientot">
                      {r.logo ? <img className="footer-icon" src={r.logo} alt="" width="20" height="20" /> : <span className="footer-icon" aria-hidden="true">{r.emoji}</span>}
                      {' '}{champ(r, 'nom')} <small>({t('pied.bientot', 'bientôt')})</small>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Ouled El May</p>
          <Link to="/mentions-legales">{t('pied.mentions', 'Mentions légales et confidentialité')}</Link>
        </div>
      </div>
    </footer>
  );
}

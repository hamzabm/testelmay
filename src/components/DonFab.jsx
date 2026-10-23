import { useI18n } from '../i18n/I18nContext.jsx';
import { URL_HELLOASSO } from '../data/constants.js';

export default function DonFab() {
  const { t } = useI18n();
  return (
    <a className="don-fab" href={URL_HELLOASSO} target="_blank" rel="noopener">
      <span aria-hidden="true">💙</span> <span>{t('don.mobile', 'Faire un don')}</span>
    </a>
  );
}

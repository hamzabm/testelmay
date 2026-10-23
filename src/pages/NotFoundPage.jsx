import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <main className="page-404">
      <div className="arche-frame">
        <img src="/img/logo/logo.svg" alt="Ouled El May" width="160" height="160" />
      </div>
      <h1>{t('page404.titre', "Cette page n'existe pas.")}</h1>
      <p>{t('page404.texte', "Le lien est peut-être ancien ou mal recopié. Tout le site tient sur une seule page : vous la retrouverez depuis l'accueil.")}</p>
      <p lang="ar" dir="rtl">{t('page404.texte.ar', 'هذه الصفحة غير موجودة. يمكنكم العودة إلى الصفحة الرئيسية.')}</p>
      <Link className="btn-primary" to="/">{t('page404.bouton', "Revenir à l'accueil")}</Link>
    </main>
  );
}

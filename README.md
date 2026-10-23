# Site de l'association Ouled El May

Site vitrine d'une seule page pour l'association **Ouled El May (O.E.M)**, association loi 1901 d'intérêt général, siège à Montreuil.

- **Adresse du site :** https://ouledelmay.fr (ouledelmay.com redirige vers le .fr)
- **Hébergement :** LWS, offre gratuite (1 Go)
- **Code source :** ce dépôt GitHub privé, `ouledelmay/ouledelmay`
- **Technologie :** HTML, CSS et JavaScript natifs. Pas de serveur, pas de base de données, aucun outil à installer.

Ce guide explique comment reprendre le site, le modifier et le mettre en ligne.

---

## 1. Démarrer sur un nouvel ordinateur

1. Installer **Git** et **VS Code**, puis l'extension VS Code **Live Server** (de Ritwick Dey).
2. Récupérer le code :
   ```powershell
   git clone https://github.com/ouledelmay/ouledelmay.git
   ```
3. Ouvrir le dossier dans VS Code, puis cliquer sur **Go Live** en bas à droite. Le site s'ouvre dans le navigateur et se recharge à chaque sauvegarde.

⚠️ Ouvrir `index.html` par un double-clic ne suffit pas : sans Live Server, le navigateur bloque la lecture des fichiers `data/*.json`, et les projets ne s'affichent pas.

---

## 2. Publier une modification

Le site se met à jour **tout seul** à chaque envoi sur GitHub :

```powershell
git add -A
git commit -m "Ce que j'ai changé"
git push
```

Le suivi se fait sur GitHub, onglet **Actions**. Une coche verte ✅ signifie que le site est à jour sur ouledelmay.fr, en général moins d'une minute après le `push`.

Le fichier qui gère cet envoi est `.github/workflows/deploiement.yml`. Les identifiants FTP de LWS sont rangés dans les **Secrets** du dépôt (Settings → Secrets and variables → Actions), jamais dans le code :

| Secret | Contenu |
|---|---|
| `FTP_SERVEUR` | adresse du serveur FTP indiquée dans l'espace client LWS |
| `FTP_UTILISATEUR` | identifiant FTP |
| `FTP_MOT_DE_PASSE` | mot de passe FTP |
| `FTP_DOSSIER` | dossier racine du site sur LWS (souvent `/htdocs/`), terminé par `/` |

Si le mot de passe FTP change chez LWS, il suffit de mettre à jour le secret `FTP_MOT_DE_PASSE`.

---

## 3. Organisation des fichiers

```
├── index.html               la page unique du site
├── mentions-legales.html    mentions légales et politique de confidentialité
├── 404.html                 page affichée quand une adresse n'existe pas
├── .htaccess                réglages du serveur LWS (page 404, cache, compression)
├── robots.txt, sitemap.xml  aident Google à parcourir le site
├── site.webmanifest         nom et icônes quand on ajoute le site à l'écran d'accueil d'un téléphone
├── css/style.css            toute la mise en forme (couleurs en haut du fichier)
├── js/
│   ├── main.js              mode jour/nuit, bouton don mobile, simulateur fiscal
│   ├── projets.js           dernière réalisation, filtres, carrousel, fiche projet
│   ├── communaute.js        réseaux sociaux et partenaires
│   ├── contact.js           envoi du formulaire (Web3Forms)
│   └── i18n.js              bascule français / arabe
├── data/
│   ├── projets.json         ✏️ LES PROJETS
│   ├── communaute.json      ✏️ LES RÉSEAUX ET LES PARTENAIRES
│   ├── provisoire/          projets et partenaires fictifs (voir section 3 bis)
│   └── i18n/ar.json         ✏️ LES TRADUCTIONS ARABES (textes fixes)
├── img/
│   ├── logo/logo.svg        logo officiel (version allégée et recadrée)
│   ├── logo/frise.webp      frise du logo, répétée entre les sections
│   ├── icones/              icônes d'onglet et d'écran d'accueil (tirées du « Logo Mini »)
│   ├── partage.jpg          image d'aperçu des liens partagés (WhatsApp, Facebook)
│   ├── projets/<id>/        photos d'un projet, un dossier par projet
│   ├── partenaires/         logos des partenaires
│   └── reseaux/             logos officiels WhatsApp, Telegram, Facebook (SVG)
├── fonts/                   polices Bree Serif et Rubik (hébergées sur le site)
├── _sources/                fichiers lourds, jamais envoyés (ignorés par Git)
└── .github/workflows/       déploiement automatique vers LWS
```

**Règle des noms de fichiers :** tout en minuscules, sans espaces ni accents (`gymnase-lycee.webp`, pas `Gymnase Lycée.JPG`). Le serveur LWS distingue majuscules et minuscules : un nom mal écrit casse l'image une fois en ligne, même si tout marche sur Windows.

Les originaux des photos et vidéos restent **hors du site**, dans `Documents\Projets\OEM\Medias`.

---

## 3 bis. Contenu provisoire ou réel (interrupteur)

En attendant la validation du service communication, le site affiche des **vignettes fictives** (« Projet 1 », « Partenaire 1 »…) à la place des vrais projets et partenaires. Les vrais contenus ne sont pas effacés : ils restent dans `data/projets.json` et `data/communaute.json`, et on continue à les préparer normalement.

Le réglage se trouve **tout en haut de `index.html`** :

```html
<html lang="fr" data-contenu="provisoire">
```

| Valeur | Ce que le site affiche |
|---|---|
| `provisoire` | projets de `data/provisoire/projets.json`, partenaires de `data/provisoire/partenaires.json` |
| `reel` | vrais projets (`data/projets.json`) et vrais partenaires (`data/communaute.json`) |

Les réseaux sociaux sont toujours les vrais. Pour revenir au vrai contenu : remplacer `provisoire` par `reel`, puis `git add -A ; git commit ; git push`.

⚠️ En mode provisoire, les vrais fichiers JSON restent sur le serveur : ils ne s'affichent pas sur le site, mais quelqu'un qui taperait leur adresse exacte pourrait les lire.

---

## 4. Ajouter ou modifier un projet

Tout se passe dans **`data/projets.json`**. Le site affiche automatiquement :
- le projet dans le carrousel « Nos projets », avec ses filtres ;
- sa fiche détaillée au clic ;
- dans « Notre dernière réalisation », le **projet terminé le plus récent** (d'après `date_fin`), sauf si un autre projet porte `"a_la_une": true`.

### Modèle de fiche à copier

```json
{
  "id": "nom-court-du-projet",
  "titre": "Titre affiché",
  "statut": "a-venir",
  "date_fin": null,
  "a_la_une": false,
  "emoji": "🌱",
  "accroche": "Une phrase forte qui résume le projet.",
  "resume": "Un paragraphe qui raconte le projet.",
  "faits": ["16 200 € collectés", "7 établissements équipés"],
  "etablissements": ["Lycée d'El May"],
  "etapes": [
    { "date": "Mai 2025", "titre": "Objectif atteint", "texte": "Une phrase." }
  ],
  "partenaires": [],
  "objectif": null,
  "collecte": null,
  "videos": [
    { "id": "e_SceKX-tc0", "titre": "Titre de la vidéo", "poster": "img/projets/nom-court-du-projet/01-photo" }
  ],
  "photos": [
    { "src": "img/projets/nom-court-du-projet/01-photo", "alt": "Description de la photo pour les malvoyants", "legende": "Légende courte", "couverture": true }
  ]
}
```

| Champ | À savoir |
|---|---|
| `id` | minuscules et tirets. Sert au lien direct : `ouledelmay.fr/#projet-<id>` |
| `statut` | `"a-venir"`, `"en-cours"` ou `"termine"` |
| `date_fin` | au format `"2026-06"` ; `null` tant que le projet n'est pas fini |
| `emoji` | affiché à la place de la photo tant que le projet n'en a pas |
| `faits`, `etablissements`, `etapes`, `videos`, `photos` | peuvent rester vides : `[]` |
| `videos[].id` | les caractères après `/shorts/` ou `?v=` dans le lien YouTube |
| `photos[].src` | chemin **sans** l'extension `.webp` (voir ci-dessous) |
| `couverture` | `true` sur la photo à afficher en premier |

⚠️ **Le JSON ne pardonne pas :** une virgule entre chaque fiche, pas de virgule après la dernière, des guillemets droits `"`. En cas d'erreur, la section projets reste vide. Vérifiez sur https://jsonlint.com en collant le fichier.

### Préparer les photos
Chaque photo existe en **deux tailles WebP**, pour un site rapide sur mobile :
- `01-photo.webp` : 960 pixels de large
- `01-photo-480.webp` : 480 pixels de large

Outil gratuit pour les créer : https://squoosh.app (format WebP, qualité environ 78, redimensionner à 960 puis à 480). Rangez-les dans `img/projets/<id>/`.

**Droit à l'image :** pas de visage d'enfant reconnaissable sans autorisation écrite des parents. Pour le parrainage, aucune information personnelle ou médicale sur un étudiant sans son accord écrit.

### Vidéos
Les vidéos sont publiées sur la chaîne YouTube d'Ouled El May, **jamais sur LWS** (trop lourd). Sur le site, YouTube ne se charge qu'au clic sur ▶️ (pas de cookie avant), ce qui respecte le RGPD.

---

## 5. Ajouter un partenaire ou changer un lien de réseau social

Tout se passe dans **`data/communaute.json`**.

**Nouveau partenaire :** déposer son logo (WebP, environ 400 px de large) dans `img/partenaires/`, puis ajouter :
```json
{
  "id": "nom-court",
  "nom": "Nom du partenaire",
  "logo": "img/partenaires/nom-court.webp",
  "lien": "https://site-du-partenaire.org/",
  "role": "Partenaire du projet …"
}
```
Avec `"lien": ""`, la tuile s'affiche sans lien. La case « Votre structure ici ? » s'ajoute toujours automatiquement à la fin. Pensez à obtenir l'**accord écrit** du partenaire avant d'afficher son logo.

**Réseaux sociaux :** modifier le champ `"lien"`. Un lien vide `""` affiche « Bientôt disponible » dans la section Communauté, et « (bientôt) » non cliquable dans le pied de page (c'est le cas de WhatsApp pour l'instant). Dès que le lien est rempli, le réseau devient cliquable partout.

Les logos officiels sont dans `img/reseaux/` (champ `"logo"`), hébergés sur le site : rien n'est chargé depuis Facebook ou WhatsApp. Ils proviennent de Simple Icons (licence libre CC0), en couleurs d'origine ; les marques interdisent de les déformer ou de les recolorer. Si le champ `"logo"` est vide, l'émoji (`"emoji"`) s'affiche à la place.

---

## 6. Autres réglages fréquents

| Je veux… | Où ? |
|---|---|
| Changer le lien HelloAsso | rechercher `helloasso.com/associations/association-ouled-el-may` dans `index.html` et `js/projets.js` |
| Changer la clé du formulaire de contact | sur web3forms.com (compte ouledelmay@gmail.com), puis remplacer la valeur `access_key` dans `index.html` |
| Changer un texte d'une section | `index.html` (chaque section est repérée par un commentaire `<!-- 2. QUI SOMMES-NOUS -->`, etc.) |
| Changer une couleur | bloc `2. COULEURS` en haut de `css/style.css` (mode jour, puis mode nuit) |
| Modifier les taux du simulateur fiscal | `index.html` (attributs `data-taux`) et `js/main.js` |
| Mettre à jour les mentions légales | `mentions-legales.html` |
| Changer l'image d'aperçu des partages | remplacer `img/partage.jpg` (1200 × 630 px) |
| Modifier la fiche d'identité Google (adresse, réseaux) | bloc `application/ld+json` dans le `<head>` de `index.html` |
| Ajouter une page au site | l'ajouter aussi dans `sitemap.xml` |

---

## 6 bis. Version arabe

Le bouton **عربي / FR** du menu bascule tout le site en arabe standard, de droite à gauche. Le choix du visiteur est retenu d'une visite à l'autre. Un lien peut aussi ouvrir directement la version arabe : `https://ouledelmay.fr/?lang=ar`.

- **Textes fixes** (menu, sections, boutons, formulaire) : dans **`data/i18n/ar.json`**. Chaque clé correspond à un attribut `data-i18n="cle"` dans `index.html`. Pour modifier une traduction, on change seulement la valeur dans ce fichier.
- **Projets, réseaux, partenaires** : on ajoute à côté de chaque champ sa version arabe avec le suffixe `_ar`. Exemple dans `data/projets.json` :
  ```json
  "titre": "PC pour tous",
  "titre_ar": "حاسوب للجميع",
  "accroche_ar": "…",
  "resume_ar": "…",
  "faits_ar": ["…", "…"],
  "etablissements_ar": ["…"],
  "etapes_ar": [{ "date": "…", "titre": "…", "texte": "…" }]
  ```
  Pour les photos et les vidéos : `alt_ar`, `legende_ar`, `titre_ar`. Dans `data/communaute.json` : `nom_ar`, `texte_ar`, `action_ar`, `role_ar`.
- **Si une traduction manque**, le texte français s'affiche à sa place : rien ne casse.
- **Un nouveau texte ajouté dans `index.html`** doit recevoir un `data-i18n="nouvelle.cle"`, avec sa traduction dans `ar.json`.
- **Les mentions légales restent en français**, car c'est le texte qui fait foi.
- **Relecture** : chaque traduction doit être relue par un membre arabophone avant sa publication.

## 7. Choix de conception à respecter

- **Identité :** graphie officielle « Ouled El May ». Statut : association **d'intérêt général** (rescrit fiscal RI-2026-46 du 27/07/2026), et non « d'utilité publique ».
- **Couleurs :** chaux `#F9F9F8`, indigo `#1E3A5F`, ocre de Guellala `#A85F1F` (boutons), bleu du logo `#1982FF` (accents seulement, jamais pour du petit texte). Mode nuit : `#0B132B`, `#1C2541`, `#E2E8F0`, or `#F59E0B`.
- **Polices :** Bree Serif (titres), Rubik (texte, latin et arabe). Hébergées dans `fonts/`, jamais chargées depuis Google (RGPD).
- **Élément signature :** l'arche djerbienne (la porte du logo). C'est la seule animation du site.
- **Boutons explicites :** « Faire un don sur HelloAsso », pas « Soutenir ».
- **Vie privée :** aucun numéro de téléphone personnel, aucun cookie, aucune mesure d'audience.
- **Accessibilité :** contrastes vérifiés, navigation au clavier, texte alternatif sur chaque photo.

---

## 8. Reste à faire

**Fait :**
- [x] Mise en ligne automatique GitHub → LWS
- [x] Certificat HTTPS sur ouledelmay.fr et redirection automatique vers `https://`
- [x] Redirection 301 de ouledelmay.com vers ouledelmay.fr (espace client LWS → ouledelmay.com → Redirection web)
- [x] Formulaire de contact activé (clé Web3Forms, messages reçus sur ouledelmay@gmail.com)
- [x] Image de partage, icônes, fiche d'identité Google, sitemap, page 404, cache serveur, pied de page complet
- [x] Menu mobile en panneau, menu ordinateur complet, fonds alternés, frise du logo entre les sections
- [x] Version arabe : bouton عربي / FR, mise en page de droite à gauche, textes fixes, réseaux et partenaires traduits

**À faire :**
- [ ] Liens HelloAsso directs vers les formulaires de **don** et d'**adhésion** (aujourd'hui : page générale), puis un lien par projet
- [ ] Montant de la cotisation, si on veut l'afficher
- [ ] Lien de la chaîne **WhatsApp** dans `data/communaute.json`
- [ ] Dates à confirmer : distribution des PC (« Début 2026 »), vidéoprojecteurs (`2026-03`)
- [ ] Contrôle complet avant lancement : liens, mobile, accessibilité, vitesse
- [ ] Traduire en arabe les fiches projets (`titre_ar`, `accroche_ar`, `resume_ar`…) en peaufinant chaque projet
- [ ] Faire relire toutes les traductions arabes par un membre arabophone

## 9. Travailler avec Claude

Le projet claude.ai **« Site Ouled El May »** contient les statuts, le rescrit fiscal, l'historique du projet PC pour tous et le cahier des charges. Pour reprendre le travail, ouvrez une conversation dans ce projet et décrivez ce que vous voulez faire, par exemple : « Ajoute le projet X avec ces photos », « Ajoute le partenaire Y », « Améliore la section Z ».

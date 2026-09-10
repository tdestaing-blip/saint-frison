# Saint-Frison Textiles

Site éditorial en français, construit à partir des photographies, du logo, du brief et des fiches techniques transmis par Saint-Frison.

## Réalisation

- Accueil photographique, navigation mobile accessible et mise en page responsive.
- Deux sections textiles : Collections textiles et Tissages d’exception. Fiches avec carrousel accessible, coloris et caractéristiques renseignées.
- 4 présentations de luminaires. Noms descriptifs de travail, sans prix ni disponibilité inventés.
- Un projet éditorial documenté « La ligne devient lumière ». Aucun client, lieu ou projet résidentiel fictif.
- Studio en trois parties, processus en quatre étapes et contact contextualisé. Acquisition des luminaires auprès du studio, sans panier ni paiement.
- Sanity embarqué à `/studio`, modèles éditoriaux, brouillons/publication, recadrage, hotspot, textes alternatifs, ordre manuel, présentation et édition visuelle.

## Architecture

Next.js 16 App Router, React 19, TypeScript, Tailwind 4 et CSS éditorial. Le moteur Vinext produit également un Worker Cloudflare pour l’aperçu privé Sites. Les commandes Next standard sont conservées pour Vercel. Sanity assure l’édition et les disponibilités affichées ; Resend peut assurer les notifications.

Le site utilise `content/seed.json` tant qu’aucun projet Sanity n’est configuré. Dès que Sanity est connecté, son contenu devient la source de vérité : une collection vide reste vide, elle n’est pas silencieusement remplacée par des données de démonstration. Les images fournies sont livrées en WebP responsive ; aucun visuel généré n’a été utilisé.

## Démarrer

Node 22 LTS ou 24 LTS et npm.

```sh
npm ci
npm run dev       # Aperçu Sites sur http://localhost:5173
npm run dev:next  # Next.js standard sur http://localhost:3000
```

Copier `.env.example` dans `.env.local` pour activer les services. Ne jamais committer de secrets.

## Connecter l’espace de Margaux

1. Créer un projet Sanity et un dataset `production` privé : il contient aussi les demandes reçues et leurs coordonnées. Le serveur utilise son jeton Viewer pour lire les contenus publiés et les brouillons.
2. Renseigner `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, un jeton Viewer `SANITY_API_READ_TOKEN` et un jeton Editor serveur `SANITY_API_WRITE_TOKEN`.
3. Ajouter les origines locales et de production dans les origines CORS Sanity, avec les identifiants autorisés. Inviter Margaux dans le projet avec les droits éditoriaux nécessaires.
4. Exécuter `npm run seed`. Le script téléverse les photographies optimisées, crée les références et configure l’accueil. Il conserve les documents existants. Effectuer l’import avant la bascule publique.
5. Ouvrir `/studio`, se connecter à Sanity et remplir Réglages du site → email professionnel et Instagram.
6. Utiliser « Présentation » pour voir les brouillons. Les liens d’activation du mode brouillon sont vérifiés par next-sanity ; aucune clé secrète n’est exposée dans le navigateur.

### Gestes éditoriaux

**Textile** : nom, adresse, univers (Collections / Exception / Recherche), famille, photo principale avec description et texte court ; compléter seulement les caractéristiques connues. L’univers Recherche est préparé pour une future rubrique et reste absent des deux grilles publiques. Coloris → associer une photo à chaque pastille. Publier, puis l’ajouter à la sélection de l’Accueil si souhaité.

**Projet** : nom, image principale et courte présentation. Composer l’histoire avec les blocs Image, Portrait, Paire, Image + texte, Note, Respiration. Associer les textiles utilisés. Les références et données absentes ne produisent pas de lignes vides.

**Luminaire** : renseigner le nom définitif, les dimensions, les matières, les photos et le statut. Choisir Disponible uniquement lorsque la disponibilité est confirmée. Le prix à afficher est facultatif et doit préciser la devise et les mentions appropriées. Les boutons d’acquisition ouvrent Contact. Les champs électriques, pied vintage et délai restent masqués tant qu’ils ne sont pas renseignés.

**Demande** : consulter le message et sa référence dans « Demandes reçues », répondre par email, puis changer le suivi en Répondue ou Archivée. Les champs envoyés par le visiteur sont en lecture seule ; le suivi reste modifiable.

## Contact

Le formulaire valide les champs et l’accord, conserve le contexte de la référence et la campagne éventuelle, contrôle l’origine, utilise un champ anti-robot et limite les demandes par adresse email. Il enregistre d’abord la demande dans Sanity, puis notifie le studio via Resend.

Variables : `SANITY_API_WRITE_TOKEN`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (domaine expéditeur vérifié chez Resend), `CONTACT_TO_EMAIL`.

Sans Sanity configuré, le formulaire répond explicitement qu’aucun envoi n’a eu lieu et conserve le texte. L’email direct est disponible dès qu’il est renseigné dans les réglages. En cas d’échec de notification, la demande enregistrée reste consultable dans Sanity avec le statut de livraison. Le jeton d’écriture doit rester strictement côté serveur.

## Vitrine commerciale et compatibilité

L’achat en ligne est désactivé : `POST /api/checkout` répond 410 et ne crée aucun panier. Les anciens champs Shopify et documents sont conservés mais masqués dans l’édition courante. `/available-pieces` redirige vers `/lighting` ; une ancienne fiche redirige vers le luminaire associé ou vers l’index. Aucune requête Shopify n’est nécessaire au catalogue.

Les liens entre textiles, luminaires et projets sont calculés dans les deux sens à partir des références existantes. Les références absentes ne donnent pas de liens cassés. Les anciennes catégories Contact sont normalisées vers les nouveaux objets sans modifier les demandes historiques.

### Migration des contenus existants

`node --experimental-strip-types --env-file=.env.local scripts/migrate-v1-feedback.mjs` affiche les changements. Ajouter `--apply` pour les appliquer. Le script sauvegarde les documents concernés dans un fichier privé temporaire, vérifie leurs révisions et complète seulement les champs manquants. Seul le tissage dont le slug est `tissage-rotin` passe explicitement de Recherche à Exception. Les textes des trois parties Studio sont provisoires et éditables dans Sanity.

## Pages

`/`, `/textiles`, `/textiles/[slug]`, `/lighting`, `/lighting/[slug]`, `/projects`, `/projects/[slug]`, `/about`, `/contact`, `/available-pieces`, `/available-pieces/[handle]`, `/studio`, `/privacy`, `/robots.txt`, `/sitemap.xml`.

## Vérifier

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run build:next
```

Les tests couvrent les associations réciproques, les anciennes catégories de contact, les variantes, les fiches incomplètes, les galeries avec une ou plusieurs images et la désactivation du paiement. Le test de la route Contact utilise un stockage Sanity simulé et isolé : il vérifie l’enregistrement et les réessais sans contacter le service réel, envoyer d’email ni modifier les demandes de production.

## Publier sur Vercel

Importer le dépôt GitHub, choisir Next.js et la commande de build `npm run build:next`. Conserver la sortie Next.js par défaut. Copier les variables de `.env.example` dans Vercel, renseigner `SITE_URL` avec le domaine réel et relancer le build après modification des variables publiques Sanity. Le fichier `vercel.json` explicite cette configuration.

La version Sites utilise `npm run build` et `.openai/hosting.json`. Les variables serveur doivent être configurées dans l’environnement hébergé ; les variables `NEXT_PUBLIC_*` nécessitent également un rebuild. Ne pas publier le site en accès public sans terminer les points ci-dessous.

## État avant lancement commercial

À confirmer avec Margaux : email et Instagram, identité et prix des quatre lampes réellement disponibles, noms définitifs des luminaires, dimensions, crédits photographiques et droits de publication, informations juridiques de l’éditeur, politique de confidentialité définitive, conditions d’acquisition et mentions de prix.

La page Confidentialité est une notice de présentation explicitement provisoire, pas une validation juridique. Le site reste non indexable tant que `SITE_INDEXABLE` n’est pas `true`. Aucun suivi publicitaire ni analytics n’est installé. Sanity est connecté au site de recettage ; la notification par email reste à configurer et à tester avant lancement.

Les fonctions de production Sanity (authentification, droits, sauvegarde, édition visuelle), et l’envoi réel des emails doivent faire l’objet d’un essai de recette avant lancement. La compatibilité du build n’est pas une preuve de fonctionnement de services non configurés.

## Sources

Textes : brief fourni, `Textes Website.docx`, fiches `Infos Référence` du catalogue. Photos et logos : archives fournies. Les poids sont conservés en grammes par mètre linéaire, conformément aux fiches ; ils ne sont pas convertis artificiellement en g/m².

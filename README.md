# Saint-Frison Textiles

Site éditorial en français, construit à partir des photographies, du logo, du brief et des fiches techniques transmis par Saint-Frison.

## Réalisation

- Accueil photographique, navigation mobile accessible et mise en page responsive.
- 11 références et recherches textiles, filtres par famille, pages détaillées, coloris photographiques Edgar, données techniques sourcées.
- 4 présentations de luminaires. Noms descriptifs de travail, sans prix ni disponibilité inventés.
- Un projet éditorial documenté « La ligne devient lumière ». Aucun client, lieu ou projet résidentiel fictif.
- Studio, démarche sur mesure, contact contextualisé, sélection commerciale Shopify et paiement hébergé.
- Sanity embarqué à `/studio`, modèles éditoriaux, brouillons/publication, recadrage, hotspot, textes alternatifs, ordre manuel, présentation et édition visuelle.

## Architecture

Next.js 16 App Router, React 19, TypeScript, Tailwind 4 et CSS éditorial. Le moteur Vinext produit également un Worker Cloudflare pour l’aperçu privé Sites. Les commandes Next standard sont conservées pour Vercel. Sanity assure l’édition, Shopify le stock et le paiement, Resend les notifications.

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

**Textile** : nom, adresse, famille, photo principale avec description et texte court ; compléter seulement les caractéristiques connues. Coloris → associer une photo à chaque pastille. Publier, puis l’ajouter à la sélection de l’Accueil si souhaité.

**Projet** : nom, image principale et courte présentation. Composer l’histoire avec les blocs Image, Portrait, Paire, Image + texte, Note, Respiration. Associer les textiles utilisés. Les références et données absentes ne produisent pas de lignes vides.

**Luminaire** : renseigner le nom définitif, les dimensions, les matières, les photos et le statut. Choisir Disponible uniquement lorsque le produit Shopify correspondant est prêt. Renseigner son handle.

**Demande** : consulter le message et sa référence dans « Demandes reçues », répondre par email, puis changer le suivi en Répondue ou Archivée. Les champs envoyés par le visiteur sont en lecture seule ; le suivi reste modifiable.

## Contact

Le formulaire valide les champs et l’accord, conserve le contexte de la référence et la campagne éventuelle, contrôle l’origine, utilise un champ anti-robot et limite les demandes par adresse email. Il enregistre d’abord la demande dans Sanity, puis notifie le studio via Resend.

Variables : `SANITY_API_WRITE_TOKEN`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (domaine expéditeur vérifié chez Resend), `CONTACT_TO_EMAIL`.

Sans Sanity configuré, le formulaire répond explicitement qu’aucun envoi n’a eu lieu et conserve le texte. L’email direct est disponible dès qu’il est renseigné dans les réglages. En cas d’échec de notification, la demande enregistrée reste consultable dans Sanity avec le statut de livraison. Le jeton d’écriture doit rester strictement côté serveur.

## Shopify

Configurer `SHOPIFY_STORE_DOMAIN` sous la forme `boutique.myshopify.com`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN` et `SHOPIFY_COLLECTION_HANDLE` pour une collection dédiée aux pièces actuelles. Cette sélection explicite évite d’exposer les anciens stocks.

Activer également « Activer la vente de pièces » dans les Réglages du site Sanity.

Les prix, variantes et disponibilités viennent exclusivement de Shopify. La création d’un panier contrôle à nouveau le stock et l’appartenance à la sélection. Le paiement, les taxes, le transport, les commandes et les conditions commerciales sont gérés par Shopify. Les pièces épuisées disparaissent de la sélection commerciale et peuvent rester en archive Luminaires. Sanity permet d’enrichir leur texte, dimensions et matières par handle.

Sans connexion Shopify, aucun produit factice n’est achetable : la page invite à contacter le studio. L’API utilisée est Storefront 2026-07.

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

Les tests vérifient la validation des demandes, la conservation des références, les unités des fiches techniques et l’existence des photographies. Ils n’envoient aucun email et ne créent aucune commande.

## Publier sur Vercel

Importer le dépôt GitHub, choisir Next.js et la commande de build `npm run build:next`. Conserver la sortie Next.js par défaut. Copier les variables de `.env.example` dans Vercel, renseigner `SITE_URL` avec le domaine réel et relancer le build après modification des variables publiques Sanity. Le fichier `vercel.json` explicite cette configuration.

La version Sites utilise `npm run build` et `.openai/hosting.json`. Les variables serveur doivent être configurées dans l’environnement hébergé ; les variables `NEXT_PUBLIC_*` nécessitent également un rebuild. Ne pas publier le site en accès public sans terminer les points ci-dessous.

## État avant lancement commercial

À confirmer avec Margaux : email et Instagram, identité et prix des quatre lampes réellement disponibles, noms définitifs des luminaires, dimensions, crédits photographiques et droits de publication, informations juridiques de l’éditeur, politique de confidentialité définitive, expédition/retours et configuration fiscale Shopify.

La page Confidentialité est une notice de présentation explicitement provisoire, pas une validation juridique. Le site reste non indexable tant que `SITE_INDEXABLE` n’est pas `true`. Aucun suivi publicitaire ni analytics n’est installé. Les comptes Sanity/Shopify/Resend n’ont pas été créés ni configurés à la place du propriétaire ; leur bon fonctionnement doit être validé avec les comptes réels avant lancement.

Les fonctions de production Sanity (authentification, droits, sauvegarde, édition visuelle), l’envoi réel des emails et le checkout doivent faire l’objet d’un essai de recette après connexion. La compatibilité du build n’est pas une preuve de fonctionnement de services non configurés.

## Sources

Textes : brief fourni, `Textes Website.docx`, fiches `Infos Référence` du catalogue. Photos et logos : archives fournies. Les poids sont conservés en grammes par mètre linéaire, conformément aux fiches ; ils ne sont pas convertis artificiellement en g/m².

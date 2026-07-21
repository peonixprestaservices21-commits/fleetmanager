# FleetManager — AfrikaStudio

App standalone de gestion de flotte pour PME sénégalaises (véhicules, chauffeurs, missions, maintenance, carburant).

Stack : **Next.js 14** (App Router, API routes intégrées) + **PostgreSQL (Neon)**, déployable gratuitement sur **Vercel**.

## 1. Créer la base de données (Neon — gratuit)

1. Va sur https://neon.tech, crée un compte et un nouveau projet (choisis une région proche, ex. Europe).
2. Dans le dashboard Neon, récupère la **connection string "pooled"** (celle avec `-pooler` dans le nom d'hôte — importante pour Vercel, qui utilise des fonctions serverless).
3. Ouvre l'éditeur SQL de Neon (ou connecte-toi avec `psql`) et exécute le contenu de `db/schema.sql` pour créer les tables et insérer les données de départ.

## 2. Tester en local (optionnel)

```bash
npm install
cp .env.example .env.local
# colle ta connection string Neon dans .env.local (DATABASE_URL=...)
npm run dev
```

Ouvre http://localhost:3000

## 3. Déployer sur Vercel

1. Pousse ce dossier sur un repo GitHub (nouveau repo, ex. `fleetmanager`).
2. Sur https://vercel.com → "Add New Project" → importe le repo GitHub.
3. Vercel détecte Next.js automatiquement, rien à changer dans le build.
4. Avant de cliquer "Deploy", va dans **Environment Variables** et ajoute :
   - `DATABASE_URL` = ta connection string Neon (pooled)
5. Clique "Deploy". L'app est en ligne en 1–2 minutes, avec une URL `*.vercel.app`.

## Structure

```
app/
  page.js              → Tableau de bord
  vehicules/page.js    → Liste des véhicules
  chauffeurs/page.js   → Liste des chauffeurs
  missions/page.js     → Liste des missions
  maintenance/page.js  → Liste des interventions
  carburant/page.js    → Journal des pleins
  api/*/route.js       → Endpoints REST (GET liste, POST création) pour chaque entité
lib/db.js              → Connexion PostgreSQL partagée
db/schema.sql           → Schéma + données de démarrage
```

## Prochaines étapes possibles

- Ajouter les formulaires de création (les boutons "+ Ajouter" sont en place, il reste à câbler la modale/le formulaire sur les routes POST déjà prêtes)
- Ajouter modification/suppression (PATCH/DELETE) sur chaque route
- Authentification (simple mot de passe ou compte par PME)
- Notifications WhatsApp automatiques sur les alertes maintenance (réutilisable depuis le module WhatsApp NEXUS)

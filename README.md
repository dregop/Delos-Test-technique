# 🧪 Fullstack Test App — Next.js + FastAPI + Supabase (Delos)

Ce projet est une application web fullstack pour un test technique Delos. Il utilise :

- **Next.js + TypeScript** (frontend)
- **FastAPI + Python** (backend)
- **Supabase** en local via `supabase start` (auth + base de données)
- **pnpm + Turborepo** pour la gestion du monorepo

---

## 🗂️ Structure du projet

```
delos/
├── apps/
│   ├── frontend/        # Next.js
│   └── backend/         # FastAPI
├── .env                 # Variables globales
├── supabase/
├── docker-compose.yml
├── pnpm-workspace.yaml
└── README.md

Frontend :

apps/frontend/
    /app
    ├── layout.tsx          # Layout principal avec Auth + Sidebar
    ├── page.tsx            # Page d’accueil ou redirection vers un sport
    ├── sport
    │   └── [slug]
    │       ├── page.tsx    # ChatBot pour le sport sélectionné
    └── admin
        └── page.tsx        # Stats d'utilisation

    /components
    ├── Sidebar.tsx         # Navigation entre sports
    ├── ChatBox.tsx         # Composant principal de chat
    ├── Message.tsx         # Affiche une ligne de dialogue
    └── AdminStats.tsx      # Tableau de stats des utilisateurs (admin)

    /lib
    ├── supabase.ts         # Supabase client initialisé
    └── api.ts              # Fonctions de requêtes vers l’API FastAPI
├── store/
├── styles/
├── public/
├── package.json
└── tsconfig.json
```

---

## ✅ Étapes réalisées

- Initialisation du monorepo avec `pnpm create turbo@latest`
- Suppression des packages inutiles (`eslint-config`, `typescript-config`)
- Mise en place des Dockerfile frontend/backend
- Lancement de Supabase en local via la CLI
- Configuration des services dans `docker-compose.yml`
- Création de l’authentification via OTP email
- Redirection automatique vers la page /sport/rugby si connecté
- Intégration de la sidebar conditionnelle selon l'état de connexion
- Mise en place du chatbot multi-sport (pages dynamiques /sport/[slug])
- Réception streaming mot par mot de la réponse depuis le backend FastAPI
- Création d’un endpoint /chat pour streamer une réponse différente par sport
- Sauvegarde des échanges (question, réponse, user_id, sport) dans Supabase

---

## 💻 Lancer l'application sans Docker

Assure-toi que `supabase start` tourne en parallèle et à la racine :

```bash
pnpm install
pnpm dev
```

---

## 🐳 Lancer l'application avec Docker (Pas encore fonctionnel)

### 🧱 Prérequis

- Docker Desktop
- Supabase CLI : `npm install -g supabase`
- pnpm : `npm install -g pnpm`

### ⚙️ Étapes

#### 1. Lancer Supabase

```bash
supabase start
```

#### 2. Lancer frontend + backend

```bash
docker-compose up --build
```

### 🔗 URLs par défaut

- Frontend : http://localhost:3000
- Backend : http://localhost:8000
- Supabase Studio : http://localhost:54323/

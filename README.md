# 🎮 Fanorona - Jeu Traditionnel Malgache

Une application web moderne du jeu traditionnel malgache **Fanorona** (également connu sous le nom de Alafia).

## 🚀 Fonctionnalités

- ✅ Authentification utilisateur avec Supabase
- ✅ Tableau de jeu interactif 9x5
- ✅ Système de mouvements valides
- ✅ Gestion des parties en ligne
- ✅ Historique des parties
- ✅ Interface responsive

## 📋 Prérequis

- Node.js 16+
- npm ou yarn
- Compte Supabase

## 🛠️ Installation

### 1. Cloner le repository

```bash
git clone https://github.com/Soavina4779/ludovolamalagasy-v2.git
cd ludovolamalagasy-v2
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer Supabase

**a) Créer un projet Supabase:**
- Aller sur [supabase.com](https://supabase.com)
- Créer un nouveau projet
- Copier l'URL et la clé anonyme

**b) Créer les tables SQL:**

Exécuter ces requêtes dans l'éditeur SQL de Supabase:

```sql
-- Table des jeux
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id UUID NOT NULL REFERENCES auth.users(id),
  player2_id UUID,
  status TEXT DEFAULT 'playing',
  board JSONB NOT NULL,
  current_player INTEGER DEFAULT 1,
  winner INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des mouvements
CREATE TABLE moves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id),
  player_id UUID NOT NULL REFERENCES auth.users(id),
  from_row INTEGER NOT NULL,
  from_col INTEGER NOT NULL,
  to_row INTEGER NOT NULL,
  to_col INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**c) Créer le fichier `.env.local`:**

```bash
cp .env.local.example .env.local
```

Editer `.env.local` et ajouter vos identifiants Supabase:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🎮 Utilisation

### Développement

```bash
npm run dev
```

L'application sera disponible à `http://localhost:3000`

### Build pour production

```bash
npm run build
```

## 🚀 Déploiement sur Vercel

### Méthode 1: Avec le CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Méthode 2: Avec GitHub (Recommandé)

1. Pousser le code vers GitHub
2. Aller sur [vercel.com](https://vercel.com)
3. Cliquer sur "New Project"
4. Importer le repository GitHub
5. Configurer les variables d'environnement:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Cliquer sur "Deploy"

## 📱 Règles du Fanorona

- **Objectif**: Capturer tous les pions adverses ou bloquer leurs mouvements
- **Plateau**: Grille 9x5 avec des lignes de connexion
- **Pions**: Chaque joueur commence avec 12 pions
- **Mouvements**: Les pions se déplacent le long des lignes
- **Capture**: En sautant par-dessus un pion adverse

## 🤝 Contribution

Les contributions sont bienvenues! Créez une pull request avec vos améliorations.

## 📄 License

MIT

## 👨‍💻 Auteur

**Soavina** - [GitHub](https://github.com/Soavina4779)

---

**Bon jeu!** 🎮✨

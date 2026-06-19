# Wikrena Academy v3.0
Africa's Data & AI Learning Platform

## Quick Start (Windows)

### 1. Install packages
```
npm install
```

### 2. Setup environment
```
copy .env.example .env
```
Open `.env` and fill in your Supabase keys. Apply the SQL files in `supabase/migrations/` to your Supabase project (via the SQL editor or `supabase db push`).

### 3. Seed starter data
```
npm run db:seed
```

### 4. Run the app
```
npm run dev
```

Open http://localhost:3000

---

## Pages

| URL | Description |
|-----|-------------|
| /home | Landing page |
| /login | Sign in |
| /register | Create account |
| /dashboard | Student dashboard |
| /paths | Learning paths catalog |
| /challenges | Coding challenges |
| /leaderboard | Weekly leaderboard |
| /community | Forums |
| /africa-lab | Africa Data Lab |
| /ai-tutor | Wren AI Tutor |
| /workspace | Code notebook |
| /career | Jobs + Portfolio |
| /profile | Your profile |
| /settings | Account settings |

---

## Key Notes

- No ORM — all app queries use the Supabase JS client (`@supabase/supabase-js`).
- Schema changes are raw SQL migrations in `supabase/migrations/`.

## Brand Colors
- Navy: #0a192f
- Teal: #2ec4b6  
- Coral: #ff6b3d
- Neutral: #f5f7fa

## Fonts
- Headings: Outfit (substitute for Agrandir)
- Body: Figtree
- Code: DM Mono

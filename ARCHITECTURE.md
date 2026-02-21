# SuperBrain – Arkitektur & Tech Stack

## Oversigt

SuperBrain er en PWA (Progressive Web App) til hukommelsesteknikker. Appen fungerer i browseren og kan installeres på mobil som en native-lignende app.

---

## Anbefalet Tech Stack

### Frontend
| Teknologi | Formål |
|-----------|--------|
| **React** + **TypeScript** | UI-framework – komponentbaseret, stort økosystem |
| **Vite** | Build tool – hurtigt, moderne |
| **Tailwind CSS** | Styling – utility-first, matcher mørkt tema |
| **React Router** | Navigation mellem skærme |
| **react-i18next** | Flersproget support (DA/EN) |
| **Workbox** | PWA service worker til offline-support |

### Backend & Database (3 forslag)

#### Forslag 1: **Supabase** (Anbefalet)
- **Hvad:** Open-source Firebase-alternativ baseret på PostgreSQL
- **Auth:** Indbygget auth med email/password og Google login
- **Database:** PostgreSQL med realtime subscriptions
- **Pris:** Gratis tier med 500 MB database, 1 GB storage, 50.000 monthly active users
- **Fordele:**
  - SQL-database (nemmere at forstå og debugge)
  - Genereret API ud fra database-skema
  - God dokumentation
  - Row Level Security (brugere kan kun se egne data)
- **Ulemper:**
  - Mindre community end Firebase

#### Forslag 2: **Firebase**
- **Hvad:** Googles Backend-as-a-Service platform
- **Auth:** Firebase Auth med mange login-metoder
- **Database:** Firestore (NoSQL document database)
- **Pris:** Gratis tier med 1 GB storage, 50.000 daglige reads
- **Fordele:**
  - Stort community og mange tutorials
  - Meget nem opsætning
  - God offline-support
- **Ulemper:**
  - NoSQL kan være forvirrende for begyndere
  - Vendor lock-in (svært at migrere væk)
  - Priserne kan stige uforudsigeligt

#### Forslag 3: **Custom backend med Railway/Render**
- **Hvad:** Eget Node.js/Express API + PostgreSQL database
- **Auth:** Passport.js eller Auth0
- **Database:** PostgreSQL hostet på Railway eller Render
- **Pris:** Railway gratis tier med $5/måned kredit
- **Fordele:**
  - Fuld kontrol over alt
  - Ingen vendor lock-in
- **Ulemper:**
  - Kræver mere kode og vedligeholdelse
  - Du skal selv håndtere auth, API, migrations etc.

### AI Integration
| Tjeneste | Formål |
|----------|--------|
| **Claude API (Anthropic)** | Tekstbeskrivelse af huskereglen – genererer levende, visuelle beskrivelser |
| **DALL-E API (OpenAI)** eller **Stability AI** | Billedgenerering baseret på huskeregel-beskrivelsen |

---

## Database-skema (forenklet)

```
users
├── id (UUID)
├── email
├── name
├── language_preference (da/en)
└── created_at

names
├── id (UUID)
├── user_id (FK → users)
├── full_name
├── mnemonic_text (huskeregel)
├── ai_description (AI-genereret tekst)
├── ai_image_url (AI-genereret billede)
└── created_at

peg_entries
├── id (UUID)
├── user_id (FK → users)
├── number (00-99)
├── peg_word
├── mnemonic_text
├── ai_description
├── ai_image_url
└── updated_at

notes
├── id (UUID)
├── user_id (FK → users)
├── title
├── content (rich text / markdown)
├── category
└── created_at

categories
├── id (UUID)
├── user_id (FK → users)
├── name
└── color
```

---

## Mappestruktur (forslag)

```
superbrain/
├── public/
│   ├── manifest.json       # PWA manifest
│   └── icons/              # App ikoner
├── src/
│   ├── components/         # Delte UI-komponenter
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── SearchBar.tsx
│   │   └── BottomNav.tsx
│   ├── features/
│   │   ├── auth/           # Login/signup
│   │   ├── dashboard/      # Hjem-skærm
│   │   ├── names/          # Navneliste
│   │   ├── peg/            # Number PEG system
│   │   └── notes/          # Noter
│   ├── lib/
│   │   ├── supabase.ts     # Database-klient
│   │   ├── ai.ts           # AI API-kald
│   │   └── i18n.ts         # Oversættelser
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript typer
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

---

## Min anbefaling

**Supabase + React + Tailwind + Vite** er den bedste kombination for dette projekt:

1. **Supabase** håndterer auth og database, så du ikke skal bygge et backend fra bunden
2. **React** er industristandard og har det bedste økosystem
3. **Tailwind** gør det hurtigt at style med det mørke tema
4. **Vite** giver hurtig udvikling med hot reload

Til AI-delen anbefaler jeg at starte med **Claude API** til tekstbeskrivelser (billigere og hurtigere), og så tilføje billedgenerering som en v2-feature.

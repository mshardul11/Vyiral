# Vyiral

Production-oriented YouTube creator growth platform — keyword research, AI metadata, audits, competitors, and stats. Original design (not vidIQ).

## Stack

- Next.js 15 App Router · TypeScript · Tailwind · shadcn-style UI
- Firebase Auth (Google) · Firestore · Admin SDK on server routes
- OpenAI + YouTube APIs (upcoming phases)

## Phase 1 (current)

- Project scaffold, dark premium theme, sidebar app shell
- Firebase client + Admin session cookies
- Google sign-in · onboarding wizard · dashboard shell
- Marketing landing page · Firestore rules · extension API contract stub

## Quick start

1. Copy `.env.example` → `.env.local` and fill Firebase + Admin credentials.
2. Enable **Google** provider in Firebase Authentication.
3. Add authorized domain: `localhost` (and your production domain).
4. Deploy `firestore.rules` to your Firebase project.
5. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Firebase Admin private key

Set `FIREBASE_ADMIN_PRIVATE_KEY` with literal `\n` newlines in `.env.local`, or paste a single-line escaped key.

### Session flow

1. Client signs in with Google (Firebase Auth).
2. ID token POSTs to `/api/auth/session` → httpOnly `vyiral_session` cookie.
3. Server routes use Admin SDK `verifySessionCookie`.
4. `/api/auth/me` bootstraps `users` + `subscriptions` docs.

## Project structure

```
src/
  app/              # Routes (marketing, login, app shell)
  components/       # UI, layout, auth, onboarding, marketing
  contexts/         # AuthProvider
  lib/firebase/     # Client, Admin, collections, user services
  lib/api/          # Extension-ready API contract
  types/            # Firestore document types
functions/          # Cloud Functions (stub — Phase 2+)
```

## Roadmap

| Phase | Scope |
|-------|--------|
| 2 | Firestore CRUD, projects, activity log |
| 3 | Dashboard data, YouTube connect |
| 4 | Keyword research + AI generators |
| 5 | Audits, competitors, stats |
| 6 | Saved items, settings polish, Cloud Functions scheduler |

## Important

- Metrics labeled **Est.** are modeled estimates, not official YouTube numbers.
- Never commit `.env.local` or service account JSON files.

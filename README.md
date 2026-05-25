# Vyiral

Production-oriented YouTube creator growth platform — keyword research, AI metadata, audits, competitors, and stats. Original design (not vidIQ).

## Stack

- Next.js 16 App Router (Turbopack) · TypeScript · Tailwind · shadcn-style UI
- Firebase Auth (Google) · Firestore · Admin SDK on server routes
- OpenAI + YouTube APIs (upcoming phases)

## Phase 1 (current)

- Project scaffold, dark premium theme, sidebar app shell
- Firebase client + Admin session cookies
- Google sign-in · onboarding wizard · dashboard shell
- Marketing landing page · Firestore rules · extension API contract stub

## Requirements

- **Node.js 22+** (see `.nvmrc`). With [nvm](https://github.com/nvm-sh/nvm): `nvm install` then `nvm use`.

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

## Production deployment

### 1. Validate environment

Set all required variables in your host (Vercel, Railway, Docker, etc.). Required for production:

- `NEXT_PUBLIC_FIREBASE_*` (API key, auth domain, project ID, app URL)
- `NEXT_PUBLIC_APP_URL` (canonical HTTPS origin, e.g. `https://app.vyiral.com`)
- `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`

```bash
npm run validate:env   # loads .env.local if present
npm run predeploy      # validate + typecheck + lint + build
```

On server start, `src/instrumentation.ts` runs strict env validation when `NODE_ENV=production`.

### 2. Build & run

**Vercel:** connect repo, add env vars, deploy. Node 22.

**Node (standalone output):**

```bash
npm run build
npm run start:standalone
```

Set `PORT` if needed (default 3000). Static assets: copy `public` and `.next/static` into the standalone folder per [Next.js standalone docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

**Docker:** use the included `Dockerfile` (multi-stage, port 3000).

### 3. Firebase

- Add your production domain under Authentication → Authorized domains.
- Deploy rules: `firebase deploy --only firestore:rules,firestore:indexes`
- Enable Google sign-in provider.

### 4. Health check

`GET /api/health` returns `{ status: "ok" }` for load balancers.

### 5. Security (built-in)

- HTTP-only session cookies (`secure` in production)
- Security headers (HSTS, XFO, XCTO, Referrer-Policy)
- Origin check on `POST /api/auth/session`
- Protected app routes via middleware session gate

Optional next steps: Sentry (`SENTRY_DSN`), rate limiting (Upstash), Firebase App Check.

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

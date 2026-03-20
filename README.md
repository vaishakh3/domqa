# DOMQA

DOMQA is a web-based bug reporting and QA collaboration platform centered on a stronger promise than screenshots: every issue is tied to the real interface element and enriched with technical context. The repository includes a Next.js SaaS dashboard, a Chrome-compatible extension, shared fingerprinting logic, and a Prisma/PostgreSQL data layer.

## Architecture

- `apps/web` — Next.js 15 App Router dashboard, auth, REST API routes, upload handling, and issue management UI.
- `apps/extension` — Manifest V3 extension with popup, content script inspect mode, highlight overlay, in-page issue composer, screenshot capture, and extension-to-API flow.
- `packages/shared` — shared Zod schemas, issue/domain types, fingerprint generation, ranked locator engine, and focused tests.
- `packages/database` — Prisma schema, Prisma client, and seed script.

## Core product capabilities

- Account signup/login/logout with cookie-based JWT sessions.
- Single-owner project model that is ready to expand into memberships later.
- Extension-driven capture flow with:
  - live element hover highlight
  - click-to-capture issue composer
  - screenshot upload
  - automatic page metadata capture
  - rolling console and failed fetch buffers
  - DOM fingerprint storage with multiple selector strategies
- Dashboard with project list, issue list, issue detail page, comments, status workflow, and technical context viewer.
- Relocation-ready locator payload storage plus shared `locateElementFromFingerprint()` logic.

## Tech stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Zod
- Chrome Extension Manifest V3

## Local setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy the example file and update secrets/connection strings:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL` — PostgreSQL connection string.
- `JWT_SECRET` — long random secret for signed session cookies.
- `NEXT_PUBLIC_APP_URL` — usually `http://localhost:3000`.
- `UPLOAD_DIR` — local directory used by the MVP upload abstraction.

### 3. Initialize the database

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

Seeded credentials:

- Email: `demo@domqa.app`
- Password: `password123`

### 4. Run the web app

```bash
pnpm dev
```

Open `http://localhost:3000`.

### 5. Build and load the extension

```bash
pnpm --filter @domqa/extension build
```

Then in Chrome:

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `apps/extension`

The extension uses the compiled files in `apps/extension/dist`.

## Testing the end-to-end flow

1. Sign in to the dashboard.
2. Copy a project ID from a project page or API response.
3. Enter that project ID into the extension popup.
4. Open any page you want to test.
5. Click **Enable inspect mode** in the popup.
6. Hover an element and click it.
7. Fill the in-page issue composer and submit.
8. Open the DOMQA dashboard to view the created issue, screenshot, and technical context.

## API overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `GET /api/projects/:id/issues`
- `GET /api/issues`
- `POST /api/issues`
- `GET /api/issues/:id`
- `PATCH /api/issues/:id`
- `GET /api/issues/:id/comments`
- `POST /api/issues/:id/comments`
- `POST /api/issues/:id/relocate`
- `POST /api/uploads/presign`
- `GET /api/extension/projects`
- `POST /api/extension/issues`

## Fingerprinting and relocation design

The shared locator utility captures:

- stable attributes (`id`, `data-testid`, `aria-label`, etc.)
- ranked selector candidates
- ancestry chain summaries
- sibling summaries
- nearby text hints
- element geometry

Relocation strategy:

1. Try high-confidence selectors first.
2. Fall back to broad candidate search by tag.
3. Score candidates using tag, id, class overlap, role, label, and text similarity.
4. Return best match with confidence and matched strategy.

## Known MVP limitations

- Chrome-compatible extension only.
- The screenshot capture is visible viewport only.
- Network capture is intentionally best-effort and currently focused on failed `fetch()` requests.
- Some websites may restrict extension behavior or heavily sandbox the page.
- Element relocation is best-effort, not guaranteed.
- No full organization permissions model yet.
- No live Jira/Linear sync yet; the codebase keeps service boundaries ready for export integrations.
- Upload storage uses a local filesystem abstraction for MVP development; replace with S3-compatible storage in production.

## Future improvements

- Auth.js or enterprise auth providers.
- Richer project memberships and assignees.
- Better network instrumentation for XHR/resource failures.
- S3 presigned uploads and CDN-backed screenshot delivery.
- Webhook/export adapters for Jira and Linear.
- Replay/re-inspection surface that actively runs locator matching on saved URLs.

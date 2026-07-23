# SpeedRead

A **science-based speed-reading trainer** that helps you read faster **without
losing comprehension**. It's a mobile-first, installable Progressive Web App
(PWA) that runs entirely on your device — no account, no server, no cost.

> The headline metric is **effective WPM = raw speed × comprehension**, so
> reading fast without understanding doesn't inflate your score.

## Why a PWA? (the "best free app" answer)

- **Free forever** — it's a static site, hosted free on GitHub Pages. No backend,
  no accounts, no paid APIs.
- **Mobile-first & installable** — add it to your home screen, works offline, with
  no app-store fees or review.
- **Private by default** — all progress is stored on your device (IndexedDB).
- **Future-proof** — the storage layer sits behind a repository interface, so an
  optional free-tier cloud sync (e.g. Supabase) can be added later without
  touching the UI.

## The science

| Technique                                   | What it does                                                                                                                       |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **RSVP** (Rapid Serial Visual Presentation) | Flashes words at a fixed point so your eyes stop jumping (saccades) and re-reading (regressions).                                  |
| **ORP pivot**                               | Highlights each word's Optimal Recognition Point (the red letter) at the focal centre, so words are recognised in a single glance. |
| **Guided highlight**                        | A sweep over normal text that trains the eye movements used in real reading (RSVP alone transfers only partly).                    |
| **Comprehension gate**                      | A short quiz after each library passage sets your effective WPM.                                                                   |
| **Adaptive overload**                       | Your target speed only climbs while comprehension stays strong, and eases off when it drops.                                       |

An honest note lives in the app: 1000+ WPM with full comprehension isn't supported
by reading research. Realistic, durable gains (e.g. 200 → 400 effective WPM) come
from short, regular practice.

## Architecture

- **Vite + React + TypeScript**, built to static files.
- **Zustand** for state; **Dexie** (IndexedDB) behind a `ProgressRepository` seam.
- Pure, deterministic **`src/engine/`** (WPM math, ORP, RSVP timing, adaptive
  pacing, quiz scoring) — the TDD core.
- **`vite-plugin-pwa`** for offline + install.

```
src/
  engine/   rsvp · orp · wpm · adaptive · scoring   (pure logic, 100% tested)
  data/     repository · dexie · stats · passages   (storage + bundled library)
  features/ library · reader · quiz · results · progress · about
  components/ hooks/ styles/
e2e/        Playwright mobile-viewport flows
```

## Development

```bash
npm install
npm run dev            # local dev server
npm test               # unit tests (Vitest) + coverage
npm run test:e2e       # Playwright end-to-end (mobile viewport)
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm run build          # production build (dist/)
```

> **E2E on a machine with a pre-installed Chromium:** set
> `PW_CHROMIUM_PATH=/path/to/chromium` before `npm run test:e2e`. CI installs its
> own browser and leaves this unset.

## Quality gates (CI)

`.github/workflows/ci.yml` runs on every push:

1. **quality** — format check, lint, typecheck, unit tests (engine/data coverage
   thresholds enforced).
2. **gitleaks** — secret scan (`.gitleaks.toml`).
3. **e2e** — Playwright mobile flow.
4. **deploy** — publishes `dist/` to GitHub Pages (on `main`).

## Deploying free on GitHub Pages

Push to `main` with Pages enabled (Settings → Pages → Source: GitHub Actions). The
build sets the correct base path automatically from the repo name. Any static host
(Netlify, Vercel, Cloudflare Pages) works too — set `BASE_PATH=/` for a root deploy.

## Privacy

No analytics, no accounts, no network calls for your data. Everything you read and
every score stays in your browser. Use **Reset progress** on the Progress screen to
wipe it at any time.

## License

Code: MIT. Bundled passages are original CC0 texts plus a public-domain Aesop fable.

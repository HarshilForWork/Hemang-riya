# CONTEXT — start here

This file is the entry point for anyone (including a new Claude session) picking up this project. Read it first, then open the doc for whatever you're working on.

## What this is

The wedding website for **Riya & Hemang**: a single static page (HTML/CSS/JS, no build step) hosted on Vercel.

- Live: https://hemang-riya.vercel.app
- Repo: `HarshilForWork/Hemang-riya` (branch `main`; every push redeploys)
- Events: **Sangeet** Fri 22 Jan 2027, Navi Mumbai · **Wedding** Wed 27 Jan 2027, Nadiad
- Languages: English, Gujarati, and "Mix" (English with Gujarati lines)

The layout and scroll animations are modelled on a Cordially "origins" wedding template; all content and photos are Riya & Hemang's own.

## Three sites: this one has two siblings

The couple sends different guests different links, so there are **three separate copies** of this code. Each folder is its own git repo with its own `CONTEXT.md`. On Hemang's Mac they sit side by side in one workspace folder (its `README.md` maps them).

| Site | Folder | Repo | Live | For |
|---|---|---|---|---|
| **Full site (this one)** | `site/` | `HarshilForWork/Hemang-riya` (public) | https://hemang-riya.vercel.app | Close guests: the whole story, both events, Travel & Stay |
| **Short invite** | `lite-site/` | `HarshilForWork/riya-hemang-invite` (private) | https://riya-hemang-invite.vercel.app | Most guests: the same look with much less to read (one-chapter story, 3 FAQs, no closing quote) |
| **Sangeet-only** | `sangeet-site/` | `HarshilForWork/Hemang-riya-sangeet` (public) | not deployed yet | Guests invited to the Sangeet but **not** the wedding. It must never mention the wedding |

They don't share code. A fix or content change here (RSVP link, contacts, photos, wording, bug fixes) does **not** reach the others. When you change something, ask which sites it applies to and update each one, testing and pushing each. R&H logo explorations are in `logo-options/` next to the sites, but the couple decided against any R&H / HR monogram, so none is used.

## Documentation map

| Doc | Read it when you need… |
|---|---|
| [docs/01-project-overview.md](docs/01-project-overview.md) | The couple, events, venues, contacts, hashtag, what the site contains |
| [docs/02-architecture.md](docs/02-architecture.md) | How the code works: sections, animations, viewport handling, languages, pop-ups, RSVP |
| [docs/03-content-guide.md](docs/03-content-guide.md) | To change any text, captions, trains, translations, contacts, dates |
| [docs/04-photos.md](docs/04-photos.md) | Which photo is used where, the story behind each, and how to add/replace photos safely |
| [docs/05-testing.md](docs/05-testing.md) | How to test (phone, tablet, desktop) with the headless-Chrome harness, and known testing pitfalls |
| [docs/06-deployment.md](docs/06-deployment.md) | Git remote/SSH alias, commit identity, Vercel, cache-busting |
| [docs/07-decisions-and-open-items.md](docs/07-decisions-and-open-items.md) | Why things are the way they are, bugs already fixed, and what's still to do |
| [docs/rsvp-google-sheet.md](docs/rsvp-google-sheet.md) | Superseded: RSVPs now go to the couple's Google Form (`RSVP_FORM_URL`). Kept only in case the on-site form comes back |

## Rules that matter most

1. **Never crop either face** in any photo, at any screen size. Story photos use frames shaped like the photo; every other photo box uses the face-aware placement in `placeFocus()` (see docs/04 and docs/02).
2. **Test at phone size too**, not just desktop: 390×664 (iPhone with Safari bars), 375×812, 768×1024 and 1440×900. See docs/05.
3. **Every visible text has an English and a Gujarati version.** Add both. Gujarati still needs a native speaker's proofread.
4. **Photos must be stored upright** (orientation baked into the pixels) before measuring sizes or detecting faces. Most iPhone originals carry a rotate/mirror EXIF tag.
5. **Bump the `?v=N` on `styles.css` and `app.js` in `index.html`** whenever you change them, so phones don't keep an old copy.
6. **Keep the pre-wedding shoot photos (24–37) out of the opening collage.** Only the main hero photo (37) is from the shoot; the rest are saved for save-the-date and countdown posts. See docs/04.
7. **Three sites, three copies.** Before changing content or fixing a bug, check whether the short invite (`lite-site/`) and the Sangeet-only site (`sangeet-site/`) need the same change. Never put wedding details on the Sangeet-only site. See "Three sites" above.
8. **No couple photos in decorative spots.** Detail cards, pop-up banners and event photos use stock photos with no faces (`assets/stock/`, sources in docs/04). The couple's photos appear only in the hero and the story.
9. Don't reset the hero animation on resize, and measure heights with the svh/lvh probes, not `window.innerHeight` (iPhone Safari's moving address bar caused visible jumps before). See docs/07.

## Quick commands

```bash
# preview locally (from the repo root)
python3 -m http.server 5173

# run the automated checks in headless Chrome (local server must be running)
node tools/test/cdp-test.mjs "http://localhost:5173/?lang=en" 390 664 1 tools/test/test-hero.js
node tools/test/cdp-test.mjs "http://localhost:5173/?lang=en" 390 664 1 tools/test/test-rsvp.js
node tools/test/cdp-test.mjs "http://localhost:5173/?lang=en" 390 664 1 tools/test/test-audit.js
node tools/test/cdp-test.mjs "http://localhost:5173/?lang=en" 390 664 1 tools/test/test-story.js
node tools/test/cdp-test.mjs "http://localhost:5173/?lang=en" 390 664 1 tools/test/test-welcome.js
```

## Current status (18 Nov 2026)

Live and working:
- welcome screen ("welcome to the story of…", "scroll to begin")
- hero (photo 37 + 68/54/52/5)
- invite line "a few moments that led us here…"
- story (30 photos, 5 chapters, Instagram-print frames, 13 handwritten hashtags, no dates)
- countdown
- event photos (stock)
- RSVP via the couple's Google Form (`RSVP_FORM_URL`)
- Travel & Stay
- six detail cards (stock photos)
- FAQ
- footer quote on a dark frame
- three languages

Siblings: the short invite is live; the Sangeet-only site is built but not deployed. Still open: Gujarati proofreading, a test on a real iPhone, and the accommodation details. Full list in docs/07.

# CONTEXT — start here

This file is the entry point for anyone (including a new Claude session) picking up this project. Read it first, then open the doc for whatever you're working on.

## What this is

The wedding website for **Riya & Hemang**: a single static page (HTML/CSS/JS, no build step) hosted on Vercel.

- Live: https://hemang-riya.vercel.app
- Repo: `HarshilForWork/Hemang-riya` (branch `main`; every push redeploys)
- Events: **Sangeet** Fri 22 Jan 2027, Navi Mumbai · **Wedding** Wed 27 Jan 2027, Nadiad
- Languages: English, Gujarati, and "Mix" (English with Gujarati lines)

The layout and scroll animations are modelled on a Cordially "origins" wedding template; all content and photos are Riya & Hemang's own.

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
| [docs/rsvp-google-sheet.md](docs/rsvp-google-sheet.md) | Optional: collecting RSVPs in a Google Sheet (paused, see open items) |

## Rules that matter most

1. **Never crop either face** in any photo, at any screen size. Story photos use frames shaped like the photo; every other photo box uses the face-aware placement in `placeFocus()` (see docs/04 and docs/02).
2. **Test at phone size too**, not just desktop: 390×664 (iPhone with Safari bars), 375×812, 768×1024 and 1440×900. See docs/05.
3. **Every visible text has an English and a Gujarati version.** Add both. Gujarati still needs a native speaker's proofread.
4. **Photos must be stored upright** (orientation baked into the pixels) before measuring sizes or detecting faces. Most iPhone originals carry a rotate/mirror EXIF tag.
5. **Bump the `?v=N` on `styles.css` and `app.js` in `index.html`** whenever you change them, so phones don't keep an old copy.
6. **Keep the pre-wedding shoot photos (24–37) out of the opening collage.** Only the main hero photo (37) is from the shoot; the rest are saved for save-the-date and countdown posts. See docs/04.
7. Don't reset the hero animation on resize, and measure heights with the svh/lvh probes, not `window.innerHeight` (iPhone Safari's moving address bar caused visible jumps before). See docs/07.

## Quick commands

```bash
# preview locally (from the repo root)
python3 -m http.server 5173

# run the automated checks in headless Chrome (local server must be running)
node tools/test/cdp-test.mjs "http://localhost:5173/?lang=en" 390 664 1 tools/test/test-hero.js
node tools/test/cdp-test.mjs "http://localhost:5173/?lang=en" 390 664 1 tools/test/test-rsvp.js
node tools/test/cdp-test.mjs "http://localhost:5173/?lang=en" 390 664 1 tools/test/test-audit.js
node tools/test/cdp-test.mjs "http://localhost:5173/?lang=en" 390 664 1 tools/test/test-story.js
```

## Current status (18 Nov 2026)

Live and working: hero, story (30 photos, 5 chapters, Instagram-print frames with handwritten hashtags on the "firsts", no dates), events, RSVP form with travel and stay, details, FAQ, footer, three languages. Waiting on: Sangeet/Wedding photos from Hemang, the Google Sheet for RSVPs (personal Gmail, paused), Gujarati proofreading, a test on a real iPhone. Full list in docs/07.

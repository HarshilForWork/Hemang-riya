# CONTEXT — start here

This file is the entry point for anyone (including a new Claude session) picking up this project. Read it first, then open the doc for whatever you're working on.

## What this is

The wedding website for **Riya & Hemang**: a single static page (HTML/CSS/JS, no build step) hosted on Vercel.

- Live: https://hemang-riya.vercel.app
- Repo: `HarshilForWork/Hemang-riya` (branch `main`; every push redeploys)
- Events: **Sangeet** Fri 22 Jan 2027, Navi Mumbai · **Wedding** Wed 27 Jan 2027, Nadiad
- Languages: English, Gujarati, and "Mix" (English with Gujarati lines)

The layout and scroll animations are modelled on a Cordially "origins" wedding template; all content and photos are Riya & Hemang's own.

## Who gets which link (three sites, four links)

The couple sends each group of guests **one** link. There are **three separate copies** of this code; each is its own git repo with its own `CONTEXT.md`. This one is the full site (row 1).

| Guests | Link to send | What they see | RSVP | Repo · folder |
|---|---|---|---|---|
| **Close guests**, invited to both events | https://hemang-riya.vercel.app | The whole story (5 chapters, 30 photos), Sangeet + Wedding, Travel & Stay | The couple's main Google Form (asks about the wedding) | `HarshilForWork/Hemang-riya` (public) · `site/` |
| **Most guests**, invited to both events | https://riya-hemang-invite.vercel.app | The same look and both events (Travel & Stay too), much less to read: one-chapter story, 3 FAQs | The same main Google Form | `HarshilForWork/riya-hemang-invite` (private) · `lite-site/` |
| **Sangeet-only guests** (Hemang's friends) | https://heya-sangeet.vercel.app | Only the Sangeet (Fri 22 Jan 2027, Nerul, Navi Mumbai). **Never the wedding** | Its own Sangeet-only Google Form, in English: name, coming?, how many (made 19 Nov 2026 from the script in that repo's `tools/forms/`) | `HarshilForWork/Hemang-riya-sangeet` (public) · `sangeet-site/` |
| **Riya's friends** who won't come but should still get the invite | **https://heya-sangeet.vercel.app/riya** | The same Sangeet page | **None**: no RSVP button, section, card or FAQ | Same repo and page; the path switches RSVP off |

- **Never send a Sangeet-only guest (rows 3–4) either of the first two links**: they show the wedding. Never put wedding details on the Sangeet site.
- The copies don't share code. A fix or content change (RSVP link, contacts, photos, wording, bug fixes) reaches only the site you change. Ask which sites it applies to, then update, test and push each one.
- Folders: on Hemang's Mac the repos sit side by side as `site/`, `lite-site/`, `sangeet-site/` (the docs use these names); on the Windows laptop they are `Hemang-riya/`, `riya-hemang-invite/`, `Hemang-riya-sangeet/`.
- R&H logo explorations are in `logo-options/` next to the sites on the Mac, but the couple decided against any R&H / HR monogram, so none is used.

### Working on another laptop

1. Clone all three side by side, with the Mac folder names: `git clone https://github.com/HarshilForWork/Hemang-riya.git site`, `git clone https://github.com/HarshilForWork/riya-hemang-invite.git lite-site`, `git clone https://github.com/HarshilForWork/Hemang-riya-sangeet.git sangeet-site` (or use the SSH alias `github-personal` where it's set up). The short invite is private, so sign in to GitHub as HarshilForWork.
2. In each repo, set the commit identity locally (never the global work identity): `git config user.name HarshilForwork` and `git config user.email "$(git log -1 --format=%ae)"` (the same email as the earlier commits).
3. Run `git pull` before starting: the sites have been edited from more than one laptop (19 Nov 2026).
4. The main RSVP form's Apps Script (`rsvp-form/CreateRsvpForms.gs`) is **not in any repo**; it sits next to the sites on the Windows laptop. The form itself lives in Hemang's Google account, so it keeps working either way.

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

Siblings: the short invite is live. The Sangeet-only site is live at https://heya-sangeet.vercel.app (with its own Sangeet-only RSVP form) and https://heya-sangeet.vercel.app/riya (no RSVP), 19 Nov 2026. Still open: Gujarati proofreading, a test on a real iPhone, and the accommodation details. Full list in docs/07.

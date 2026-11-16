# 02 · Architecture

A static site: `index.html` + `styles.css` + `app.js` + `assets/rh/*.jpg`. No framework, no build, no dependencies. Vercel serves the folder as-is.

## Files

```
index.html          page skeleton; every text element has data-i18n="key" (filled from app.js)
styles.css          all styling; phone rules under @media (max-width: 767px); Gujarati rules under html[lang="gu"]
app.js              one IIFE: content constants at the top, then behaviour, then applyLang() starts everything
assets/rh/N.jpg     photos, named by their number in the original wedding folder (see docs/04)
vercel.json         caching for /assets, noindex + security headers
robots.txt          Disallow all
.vercelignore       keeps docs/, tools/ and *.md out of the deployment
docs/               this documentation
tools/photos/       photo straightening + face detection scripts (macOS, Swift/Python)
tools/test/         headless-Chrome test harness and test scripts
```

## app.js layout (top to bottom)

| Block | What it holds |
|---|---|
| Content constants | `UI` (page text, en/gu), `ACCENT` (Gujarati lines for Mix mode), `PHOTOS` (size + face box per photo), `STORY`, `ROTATIONS`, `CONTACTS`, `CARDS`, `OVERLAYS` (pop-up pages), `FAQ`, `TRAINS`, `RSVP_ENDPOINT`, `RSVP_WHATSAPP`, `FORM` (RSVP form text), `COUNTDOWN_TARGET` |
| Viewport probes | `VH()` = height of a hidden `100svh` element; `VHL()` = `100lvh` element |
| Photo placement | `placeFocus(img, n, boxW, boxH)`, `applyFocus(root)` |
| Language state | `lang` (`en`/`gu`/`mix`), `tl()` (text set: gu or en), `mix()`, `T(key)`, `num()` (Gujarati digits) |
| Intro | `splitIntro()` |
| Hero | `measureName()`, `phoneLayout()`, `layoutGallery()`, `renderHero(target)` |
| Word reveal | `splitWords()`, `renderWords()` |
| Story | `buildStory()`, `layoutStory()`, `renderStory()` |
| Main loop | `frame()` driven by scroll + requestAnimationFrame; resize handler |
| Others | reveal-on-scroll observer, countdown `tick()`, confetti canvas, `buildGrid()`, `buildFaq()` |
| Pop-up sheet | `openSheet(id)`, `closeSheet()`, `renderSheet()`; travel page `trainsHtml()`, `travelHtml()` |
| RSVP | `rsvpHtml()`, `rsvpSummary()`, `rsvpDoneHtml()`, `syncRsvp()`, `readRsvp()`, `wireRsvp()` |
| Lightbox, language switcher `applyLang()`, click hearts, start | |

`applyLang()` is the single re-render entry point: it fills every `[data-i18n]` and `[data-accent]`, re-splits the animated texts, rebuilds the story, grid and FAQ, re-renders an open pop-up, and re-measures the hero name.

## Main scroll loop

`frame()` runs on scroll (via `requestAnimationFrame`) and keeps running while the hero is still easing:

1. menu bar becomes a floating pill after 30px of scroll
2. `renderHero(target)` where `target = clamp(scrollY / range)` and `range = (hero height − VHL()) × 1000/1200`
3. `renderWords()` lights words as their paragraph scrolls up
4. `renderStory()` positions the polaroids

The hero uses a smoothed value `heroP` that eases towards `target` (`heroP += (target − heroP) × 0.16`). **Never reset `heroP`** (an old version set it to −1 on resize, which made the photo overshoot on iPhones).

## Hero (opening section)

- Section height `233.34lvh`, sticky stage `100lvh` (large viewport, so no strip opens when Safari's address bar hides). Text inside is kept within the always-visible small viewport (`VH()`): the name's `bottom` and the "Scroll to explore" prompt are computed in `renderHero()`.
- The main photo's box goes from almost full screen to:
  - **desktop**: 48.5vw × 82.9vh, centred; four side photos fly in from the sides and overlap it (the original collage design; positions in CSS `.hero__g--1…4`)
  - **phone / upright tablet** (`vw < 768` or portrait under 1100px): `phoneLayout()` builds a grid inside the visible height — main photo full width in the middle, two side photos above and two below, equal 12px gaps, never overlapping. Side photos have `z-index: 0` (behind the main photo) and slide outwards from the middle as it shrinks, so they're revealed rather than piled on top.
- The name "Riya & Hemang" is sized so it spans ~64% of the photo (82% on phones) whatever the language: `measureName()` measures it at 100px.

## Face-aware photo placement — `placeFocus()`

Every photo in a fixed-shape box (hero, side photos, event photos, detail cards, pop-up banners, footer) is an absolutely positioned `<img data-n="N">` sized by script:

- `PHOTOS[N] = [width, height, x0, y0, x1, y1]`; the last four are the faces area as fractions (from Apple Vision, padded).
- Scale = `min(cover, fit)`: fill the box like `object-fit: cover`, but never so large that the faces area doesn't fit. One continuous rule (an older two-rule version made the photo pop mid-animation).
- Position centres on the faces, clamped so the photo still covers the box when it can.
- If the photo has to be smaller than the box, a blurred copy (`img.blurfill`, inserted as the box's first child) fills the rest, and the photo's edges fade into it via an inline mask whose fade length grows with the gap (0 when filled). This makes transitions smooth.
- Story polaroids don't use this: each polaroid's image area has `aspect-ratio` = the photo's own shape, so nothing is cropped.

## Story (polaroid stack)

- `STORY` = 5 chapters, each with `side` (text left/right), `photos` (numbers) and `en`/`gu` `{title, body, caps[]}`.
- `layoutStory()` sets each card's width from its photo shape and the room left below its stack slot (`perW = 0.045 + 0.91 × h/w + 0.16`), sets the story section height, and remembers `stack[]` (where each card stops) and `natural[]` (its position in the incoming column, `GAP` = 420px at 900px height apart).
- `renderStory()`: card top = `max(stack[k], natural[k] − scrolled)`, so cards slide up and stop on the pile. The active chapter = chapter of the last landed card. Desktop chapter text sits beside the pile (spacer = widest card so far + 24px); phone text (`.chapter-m`) sits at the bottom over a cream gradient.
- In Mix mode the stack starts 50px lower to leave room for the Gujarati line under "our story".

## Languages

- `lang` is `en`, `gu` or `mix`; read from `?lang=` in the URL, else localStorage `rh-lang`, else `en`.
- `html[lang]` is `gu` only in Gujarati mode; `html[data-lang]` is the mode.
- Mix shows English text plus `.accent` lines (hidden unless `html[data-lang="mix"]`).
- Fonts: Instrument Serif / Instrument Sans for Latin; **Rasa** (serif) and **Hind Vadodara** (sans) for Gujarati, via font fallback in the CSS stacks (`--serif`, `--sans`, `--serif-gu`).
- Gujarati mode turns off letter-spacing (it breaks joined letters) and increases line heights; dates and the countdown use Gujarati digits (`num()`), phone numbers and train times stay in Western digits.
- The intro animates Gujarati word by word (vowel signs can't be split from letters) and English letter by letter, with real spaces so it wraps on phones.

## Pop-up sheet and RSVP

- Any element with `data-overlay="id"` opens `OVERLAYS[id]` in a bottom sheet. `renderSheet()` builds banner, title, description, sections, map (sangeet/wedding), the travel page (`travel: true`) or the RSVP form (`rsvp: true`).
- RSVP state `rs` lives in memory and localStorage `rh-rsvp-v2`, so answers survive closing the sheet, switching language and reloading.
- Form sections show/hide via `data-show` keys computed in `syncRsvp()`: `attending`, `wedding`, `mumbai`, `when26`, `when27`, `stay`.
- On submit: validate name, phone (≥10 digits), side, events → `rs.done = true` → summary screen with a WhatsApp link to `RSVP_WHATSAPP` with `rsvpSummary()` (always English). If `RSVP_ENDPOINT` is set, it also POSTs JSON (`mode: "no-cors"`, `text/plain`) to a Google Apps Script web app — see docs/rsvp-google-sheet.md.

## Caching

`index.html` loads `styles.css?v=N` and `app.js?v=N`. Bump N whenever either file changes. Vercel serves HTML with revalidation, so phones fetch the new version immediately.

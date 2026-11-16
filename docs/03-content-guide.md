# 03 · Content guide

All guest-facing text is in `app.js`, near the top. Every entry has an English (`en`) and Gujarati (`gu`) version — always change both. After editing `app.js` or `styles.css`, bump `?v=N` in `index.html` (see docs/06).

## Where each piece of text lives

| What | Constant | Notes |
|---|---|---|
| Static page text (headings, dates, venues, buttons, FAQ intro…) | `UI.en` / `UI.gu` | Keys match `data-i18n="key"` in index.html |
| Gujarati lines in Mix mode | `ACCENT` | Keys match `data-accent="key"` |
| Story chapters and photo captions | `STORY` | `photos` order = `caps` order |
| Detail cards (title, subtitle, image) | `CARDS` | |
| Pop-up pages | `OVERLAYS` | `sections: [label, subtitle, body]`; sangeet/wedding have `map` |
| FAQ | `FAQ.en` / `FAQ.gu` | `[question, [paragraphs]]` |
| RSVP contacts (pop-up and form) | `CONTACTS` | phone in `tel` (no spaces) and `display` |
| Where RSVPs are sent | `RSVP_WHATSAPP`, `RSVP_ENDPOINT` | WhatsApp number without "+"; endpoint = Apps Script URL or "" |
| RSVP form wording, train labels, stay plan text | `FORM.en` / `FORM.gu` | |
| Suggested trains | `TRAINS.d26`, `TRAINS.d27` | see below |
| Countdown target | `COUNTDOWN_TARGET` | UTC; currently 27 Jan 2027 18:00 IST |
| Hero photo | `HERO_PHOTO` in app.js + `src` in index.html | keep both the same |

## Story captions (current)

Captions were rewritten to the couple's taste ("cuter", not plain like "Our first movie date" for everything — though that one was kept on request). Current English captions by chapter:

1. *a concert, then hot chocolate* — The Distillery District, our first photo · Our first December, twinkle lights & all · Cold noses, warm hearts
2. *a season of firsts* — Seven courses, zero awkward silences · Our first movie date · Our first Valentine's · Moving day, with the best helper
3. *our city, our adventures* — Niagara Falls · World Cup trophy sighting! · Two fans, one golden trophy · Allan Gardens · The Portugal parade, for Ronaldo's second-last World Cup game
4. *mexico, garba & fall colours* — Her birthday weekend in Mexico · Off-roading, birthday edition · Making a splash in Mexico · Our first Navratri · Our first fall colours hike
5. *the question* — The surprise · She said yes · Engaged · Our first Diwali

## Trains (Mumbai → Nadiad)

Times come from the Indian Railways timetable as listed on ConfirmTkt and ixigo (checked 16 Nov 2026; both agreed). 26 Jan 2027 is a Tuesday (Republic Day), 27 Jan a Wednesday. The site tells guests to confirm on IRCTC and book early.

| When | Train | From | Departs | Arrives Nadiad |
|---|---|---|---|---|
| Travel on 26 Jan | 12009 Shatabdi Express (Mon–Sat) | Mumbai Central | 06:20 | 11:46 |
| | 12933 Karnavati Express (daily) | Bandra Terminus | 13:55 | 19:39 |
| | 12931 AC Double Decker (Mon–Sat) | Mumbai Central | 14:30 | 20:23 |
| Reach on 27 Jan | 22945 Saurashtra Mail (daily), night of 26th | Mumbai Central | 21:05 | 03:47 |
| | 12901 Gujarat Mail (daily), night of 26th | Dadar | 21:40 | 04:08 |
| | 12009 Shatabdi Express, morning of 27th | Mumbai Central | 06:20 | 11:46 |

Karnavati on the 27th is deliberately not suggested: it arrives 19:39, after the 6 PM start.

Each entry in `TRAINS` has `no`, `en: [name, station]`, `gu: [name, station]`, `dep`, `arr`, optional `when: "night" | "morning"` (label text in `FORM`).

## RSVP form fields

name, phone, side (`riya`/`hemang`), events (`sangeet`, `wedding`, or `none`), guests, fromMumbai, when (`26`/`27`/`unsure`), ticketHelp, stay, nights (`26`, `27`), stayCount, dietary, note. Travel and stay questions only appear when Wedding is ticked; the travel date only after "Yes, from Mumbai".

## Gujarati

- Translations were written by Claude and **need a native speaker's proofread** (open item).
- Names: રિયા, હેમાંગ, હર્ષ. Events: સંગીત સંધ્યા, શુભ લગ્ન. Hashtag stays in Latin script.
- Phone numbers and train numbers/times stay in Western digits; dates and the countdown use Gujarati digits.
- Shareable links: `?lang=gu` (Gujarati) or `?lang=mix`.

## Adding a new pop-up page or card

1. Add an entry to `OVERLAYS` (with `image`, `en`, `gu`).
2. Add a card to `CARDS` with the same `id` (grid shows 3 per row on desktop, 2 on tablet, 1 on phone).
3. Make sure the card's photo is in `PHOTOS` (docs/04).

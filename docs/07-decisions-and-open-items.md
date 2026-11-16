# 07 · Decisions, fixed bugs, open items

## Decisions (and why)

| Decision | Reason / who decided |
|---|---|
| Rebuild the Cordially "origins" demo (jim-pam.cordially.io) as the base, then replace all content | Hemang wanted that look and scroll animation |
| Hero photo = 37 (Toronto streetcar) | Hemang's choice (replaced the twirl photo 30) |
| Never crop faces; polaroids take the photo's shape; face-aware placement elsewhere | Hemang's top requirement (raised twice) |
| Phone hero: tidy grid, none of the four side photos overlapping the main one; they slide out from behind it | Hemang asked for "all overlapping or none"; "none" was recommended and built |
| Desktop hero keeps the original overlapping collage | Only the phone layout was a problem |
| Story captions rewritten to be cuter; some kept as-is | Hemang's line-by-line feedback (see docs/03) |
| Three languages EN / ગુજ / Mix; Hind Vadodara + Rasa fonts | Carried over from the earlier e-invite; Hindi ruled out |
| RSVP as an on-site form, sent to Hemang on WhatsApp | Works with no backend; ~600+ guests, mostly on WhatsApp |
| Ask about Mumbai → Nadiad travel (26 vs 27 Jan) with train suggestions, and accommodation in Nadiad | Hemang's request; many guests travel from Mumbai and the couple arranged a stay |
| Google Sheet collection optional, in personal Gmail; paused for now | Hemang's choice |
| noindex (robots.txt, header, meta) | Phone numbers and family photos on the page |
| Mirrored selfies left as stored | Flipping would mirror the couple too |
| Removed the Cordially demo banner and "Alex Morgan" RSVP demo | Not relevant to a real wedding site |

## Bugs already fixed (don't reintroduce)

| Bug | Cause | Fix |
|---|---|---|
| Faces cropped in many photos | Photos carry EXIF rotation; sizes/face boxes were measured on raw sideways pixels | Bake orientation into pixels (`tools/photos/upright.swift`) before measuring |
| Faces cut on phones (hero, footer) | Wide photos in tall phone boxes | `placeFocus()` shrinks to fit faces + blurred fill |
| Hero photo jumping/overshooting on iPhone while scrolling | Safari fires `resize` when its address bar moves; the handler reset the animation to −1 | Never reset `heroP`; re-layout only when width or the stable heights change |
| Layout maths shifting with Safari's bar | Using `window.innerHeight` | `VH()` / `VHL()` probes (100svh / 100lvh) |
| Strip opening at the bottom of the hero when the bar hides | Hero stage was 100svh | Hero section/stage use lvh |
| Photo popping slightly bigger mid-animation | Two different scaling rules with a switch point; on/off edge masks | One continuous rule `min(cover, fit)`; fade length proportional to gap |
| Side photos piling on top of the main photo mid-animation (phone) | Gallery above main in z-order | Side photos behind the main photo, sliding outwards |
| Nested boxes in the RSVP form | Leftover `.field` class from the old demo | Old styles removed; new class `.ffield` |
| Welcome line running off phone screens (Gujarati) | Non-breaking spaces from the letter animation | Real spaces; English letters wrapped per word |
| Chapter text overlapping the photo pile | Spacer only as wide as the current chapter's cards | Spacer = widest card so far + 24px |
| Phones keeping an old app.js | Caching | `?v=N` on CSS/JS links |

## Open items

- [ ] **Sangeet and Wedding photos** — Hemang will send them; replace photos 21/20 (Sangeet) and 33/31 (Wedding) in index.html, `CARDS` and `OVERLAYS`, and add rows to `PHOTOS` (docs/04).
- [ ] **Google Sheet for RSVPs** — set up in personal Gmail (docs/rsvp-google-sheet.md), then fill `RSVP_ENDPOINT`.
- [ ] **Gujarati proofreading** by a native speaker (all `gu` text, `ACCENT`, `FORM.gu`).
- [ ] **Test on a real iPhone** in Safari (opening animation, rotation, RSVP form).
- [ ] **Confirm train suggestions** with Hemang (and on IRCTC closer to the date).
- [ ] **Accommodation wording** — confirm the stay-plan text matches the actual arrangement; add details (hotel, check-in) when ready.
- [ ] **Other wedding events** — details "to be shared later"; the "More to come" card is a placeholder.
- [ ] Photos 2, 14, 39 have no context yet (unused).

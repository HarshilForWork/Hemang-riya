# 04 · Photos

## The number system

The couple's photos were collected in a folder on Hemang's Mac (`~/Downloads/wedding`, not in this repo) and renamed **1–39 in the order they were taken** (oldest first). Those numbers are used everywhere: the file names in `assets/rh/`, the `PHOTOS` table and `STORY` in app.js, and Hemang's own descriptions. The originals are full-size JPEG/HEIC; the site uses upright, 1600px-long-side JPEG copies.

## The story behind each photo (from Hemang)

| # | Taken | What it is | Used on site |
|---|---|---|---|
| 1 | 28 Nov 2025 | Christmas tree lighting at the Distillery District, Toronto — their **second date**, first hot chocolate, first photo together (they first met at a concert, no photos) | Story ch.1 |
| 2 | 20 Dec 2025 | Not described | — |
| 3, 4 | 25 Dec 2025 | Looking at Christmas trees in downtown Toronto | Story ch.1 |
| 5 | 31 Dec 2025 | First big date: a seven-course dinner | Story ch.2 |
| 6 | 16 Jan 2026 | First movie date | Story ch.2 |
| 7 | 7 Feb 2026 | Trip to Niagara Falls | Story ch.3 |
| 8 | 14 Feb 2026 | First Valentine's date | Story ch.2 |
| 9 | 1 May 2026 | Riya helping Hemang move | Story ch.2 |
| 10, 11 | 26 May 2026 | Seeing the FIFA World Cup trophy while it was in Toronto | Story ch.3 |
| 12 | 27 Jun 2026 | A date Hemang called "Allen Observatory" — the GPS points to **Allan Gardens** (conservatory, Jarvis & Carlton), so the site says Allan Gardens | Story ch.3 |
| 13 | 2 Jul 2026 | The Portugal fans' march from Little Portugal to BMO Field for Portugal vs Croatia (Hemang: Ronaldo's second-last World Cup game) | Story ch.3 |
| 14 | 11 Jul 2026 | Unknown; GPS is downtown Toronto near the Rogers Centre | — |
| 15–18 | 27–28 Jul 2026 | Weekend getaway to Mexico for Riya's birthday (15 is nearly identical to 16) | 16, 17, 18 in story ch.4 |
| 19–21, 23 | 5 Sep & 17 Oct 2026 | Their first Navratri together | 19 story ch.4; 21 Sangeet event photo; 20 Sangeet card; 23 "More to come" card |
| 22 | 4 Oct 2026 | First fall colours hike (Hemang said Muskoka; GPS says Algonquin Park, so the site says "up north") | Story ch.4 |
| 24–37 | 7 Nov 2026 | Pre-wedding photoshoot where Hemang **surprised Riya with the ring** (32 = kneeling, 36 = the ring) | 37 hero; 28/34/29/25 hero side photos; 32/36/26 story ch.5; 33 Wedding event photo; 31 Wedding card; 30 Travel card; 35 RSVP card; 27 hashtag card; 24 footer |
| 38 | 8 Nov 2026 | Their first Diwali together | Story ch.5 |
| 39 | 16 Nov 2026 | Not described | — |

Hemang will send separate photos for the Sangeet and Wedding sections; until then those use the photos listed above.

### Mirrored selfies

Photos 10, 11, 13, 18 and 23 are front-camera selfies saved mirrored (signs read backwards). That's how they're stored and how the phone shows them, so they were left as-is; flipping would also mirror the couple.

## The non-negotiable rule: no cropped faces

Hemang flagged cropped faces twice. Both faces must be fully visible in every photo at every screen size.

- **Story polaroids** take the photo's own shape (`aspect-ratio` from `PHOTOS`), so nothing is cut.
- **Every other box** uses `placeFocus()` with the faces area from `PHOTOS` (docs/02). If the box is too narrow/short, the photo shrinks and a blurred copy fills the gap.

## Adding or replacing a photo

1. **Make it upright.** Most iPhone photos store a rotation/mirror EXIF tag; browsers apply it, but sizes and face detection read the raw pixels. Bake it in:
   ```bash
   swift tools/photos/upright.swift <folder-with-originals> assets/rh 40 41
   ```
   (re-encodes `<folder>/40.*` and `41.*` as upright 1600px JPEGs in `assets/rh/`)
2. **Detect faces** in every photo in `assets/rh` (Apple Vision, macOS):
   ```bash
   swift tools/photos/faces.swift assets/rh > /tmp/faces.json
   ```
3. **Update the `PHOTOS` table** in app.js from that output (pads face boxes; falls back to the heads of detected people when faces aren't found):
   ```bash
   python3 tools/photos/update_photos.py /tmp/faces.json app.js
   ```
   This rewrites the whole `PHOTOS` block for every photo in the folder. Remove rows for photos you've deleted.
4. Reference the number in `STORY`, `CARDS`, `OVERLAYS` or index.html.
5. Run the tests (docs/05). `test-hero.js` and `test-audit.js` check that every face is inside its box at each size.

If face detection misses someone (distant or turned away), check the row by eye and widen the box manually: `[width, height, x0, y0, x1, y1]` with fractions 0–1 from the top-left.

## Unused photos

2, 14, 15 and 39 aren't on the site (15 is a near-duplicate of 16; 2, 14, 39 weren't described). Their originals are still in the wedding folder.

// Story section: photos whole (not cropped), frames on screen when landed, hashtags clear of faces,
// chapter text clear of the photo pile.
const scrollTo = (x, y) => window.scrollTo({ left: x, top: y, behavior: "instant" }); // the site uses smooth scrolling; tests must jump
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
document.getElementById("intro").click();
await wait(500);
const src = await (await fetch(document.querySelector('script[src*="app.js"]').src, { cache: "no-store" })).text();
const P = {}; src.match(/const PHOTOS = \{([\s\S]*?)\n  \};/)[1].split("\n").forEach((l) => { const m = l.match(/(\d+): \[([^\]]+)\]/); if (m) P[m[1]] = m[2].split(",").map(Number); });
const imgs = $$(".polaroid img"); imgs.forEach((i) => (i.loading = "eager"));
await Promise.all(imgs.map((i) => (i.complete ? 1 : new Promise((r) => { i.onload = i.onerror = r; }))));
const out = { storyPhotos: imgs.length, broken: imgs.filter((i) => !i.naturalWidth).length };
out.cropped = imgs.filter((i) => i.naturalWidth && Math.abs((i.naturalWidth / i.naturalHeight) / (i.parentElement.clientWidth / i.parentElement.clientHeight) - 1) > 0.01).map((i) => i.src.split("/").pop());

// hashtags vs faces (text box of the hashtag vs the faces area of its photo)
out.hashtags = $$(".polaroid__tag").length;
out.hashtagsOverFaces = [];
for (const tag of $$(".polaroid__tag")) {
  const im = tag.parentElement.querySelector("img"); const n = im.src.match(/(\d+)\.jpg/)[1];
  const [, , x0, y0, x1, y1] = P[n];
  const box = tag.parentElement.getBoundingClientRect();
  const range = document.createRange(); range.selectNodeContents(tag); const t = range.getBoundingClientRect();
  const f = { l: box.left + x0 * box.width, r: box.left + x1 * box.width, t: box.top + y0 * box.height, b: box.top + y1 * box.height };
  const ow = Math.min(t.right, f.r) - Math.max(t.left, f.l), oh = Math.min(t.bottom, f.b) - Math.max(t.top, f.t);
  const share = ow > 0 && oh > 0 ? (ow * oh) / ((f.r - f.l) * (f.b - f.t)) : 0;
  if (share > 0.04) out.hashtagsOverFaces.push(`${n} ${tag.textContent} covers ${(share * 100).toFixed(0)}% of faces area`);
}

// walk through the story: landed frames on screen, chapter text clear of the pile
const st = document.getElementById("story");
const mobile = innerWidth < 768;
let worstLanded = 0, textOverPile = [];
for (let d = 0; d <= st.offsetHeight - innerHeight - 60; d += 150) {
  scrollTo(0, st.offsetTop + d); await wait(70);
  const wraps = $$(".polaroid-wrap");
  // a card has landed when scrolling a little further doesn't move it (it's resting on the pile)
  const r1 = wraps.map((w) => w.getBoundingClientRect().top);
  scrollTo(0, st.offsetTop + d + 40); await wait(70);
  const moved = wraps.map((w, i) => Math.abs(w.getBoundingClientRect().top - r1[i]) > 0.5);
  scrollTo(0, st.offsetTop + d); await wait(70);
  const landed = wraps.filter((w, i) => !moved[i]);
  landed.forEach((w) => { worstLanded = Math.max(worstLanded, w.getBoundingClientRect().bottom); });
  const text = mobile ? document.querySelector(".chapter-m.is-active h3") : [...(document.querySelector(".chapter.is-active")?.querySelectorAll(".chapter__col") || [])].find((c) => c.textContent.trim());
  if (!text) continue;
  const tr = text.getBoundingClientRect();
  for (const w of landed) {
    const pr = w.querySelector(".polaroid").getBoundingClientRect();
    const ow = Math.min(tr.right, pr.right) - Math.max(tr.left, pr.left), oh = Math.min(tr.bottom, pr.bottom) - Math.max(tr.top, pr.top);
    if (ow > 2 && oh > 2) { textOverPile.push(`d=${d}`); break; }
  }
}
out.lowestLandedFrame = Math.round(worstLanded);
out.screenHeight = innerHeight;
out.chapterTextOverlapsPile = [...new Set(textOverPile)].slice(0, 6);
out.chapters = $$(".chapter").length;
out.pageWiderThanScreen = document.documentElement.scrollWidth > innerWidth;
return out;

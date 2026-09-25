// Behaviour probes on the live site. Usage: node probe.mjs <outDir> <desktop|tablet|phone>
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
const BP = process.argv[3] || "desktop";
const VPS = { desktop: [1440, 900, false], tablet: [810, 1080, false], phone: [390, 844, true] };
const [W, H, mobile] = VPS[BP];
const dir = path.join(OUT, BP);
fs.mkdirSync(dir, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = {};

const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, isMobile: mobile, hasTouch: mobile });
await ctx.route(/googletagmanager|cookiebot|usercentrics|google-analytics/, (r) => r.abort());
const page = await ctx.newPage();
await page.goto("https://www.dittocare.com/", { waitUntil: "networkidle" });
await sleep(4500);

const scrollTo = async (y) => {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
  await sleep(600);
};
// Returns the first visible element whose data-framer-name matches.
const rectOf = (name) =>
  page.evaluate((n) => {
    const els = [...document.querySelectorAll(`[data-framer-name="${n}"]`)].filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && getComputedStyle(e).display !== "none";
    });
    if (!els.length) return null;
    const e = els[0];
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    return { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), transform: cs.transform, bg: cs.backgroundColor, opacity: cs.opacity, position: cs.position };
  }, name);

// 1. Nav position while scrolling
log.nav = [];
for (const y of [0, 300, 1200]) {
  await scrollTo(y);
  log.nav.push({ y, nav: await rectOf("Nav") });
}

// 2. Pain point: background layers and title as the section scrolls
const ppTop = await page.evaluate(() => {
  const e = [...document.querySelectorAll('[data-framer-name="Pain point"]')].find((x) => x.getBoundingClientRect().height > 0);
  return Math.round(e.getBoundingClientRect().top + window.scrollY);
});
log.painPointTop = ppTop;
log.pain = [];
for (let y = ppTop - H; y < ppTop + H * 2.8; y += Math.round(H / 6)) {
  await scrollTo(y);
  const s = await page.evaluate(() => {
    const vis = (n) => [...document.querySelectorAll(`[data-framer-name="${n}"]`)].find((x) => x.getBoundingClientRect().height > 0);
    const white = vis("White"), black = vis("Black");
    const t = [...document.querySelectorAll("h2,h1,h3")].find((h) => /overwhelming/.test(h.innerText) && h.getBoundingClientRect().height > 0);
    const cards = ["Card 1", "Card 2", "Card 3"].map((n) => {
      const c = vis(n);
      if (!c) return null;
      const r = c.getBoundingClientRect();
      return { top: Math.round(r.top), transform: getComputedStyle(c).transform };
    });
    return {
      white: white && { op: getComputedStyle(white).opacity, bg: getComputedStyle(white).backgroundColor },
      black: black && { op: getComputedStyle(black).opacity, bg: getComputedStyle(black).backgroundColor, top: Math.round(black.getBoundingClientRect().top) },
      title: t && { color: getComputedStyle(t).color, top: Math.round(t.getBoundingClientRect().top) },
      cards,
    };
  });
  log.pain.push({ y, rel: y - ppTop, ...s });
}

// 3. This is Ditto: auto-advance and arrows
const fwName = BP === "desktop" ? "Feature walkthrough" : "HowItWorks";
const fwTop = await page.evaluate((n) => {
  const e = [...document.querySelectorAll(`[data-framer-name="${n}"]`)].find((x) => x.getBoundingClientRect().height > 0);
  return e ? Math.round(e.getBoundingClientRect().top + window.scrollY) : null;
}, fwName);
log.featureTop = fwTop;
if (fwTop != null) {
  await scrollTo(fwTop - 60);
  for (const t of [0, 2500, 5000, 8000]) {
    if (t) await sleep(t === 2500 ? 2500 : t === 5000 ? 2500 : 3000);
    await page.screenshot({ path: path.join(dir, `feature-t${t}.jpg`), type: "jpeg", quality: 70 });
  }
  const arrows = await page.evaluate(() => {
    const vis = [...document.querySelectorAll('[data-framer-name="Arrows"]')].filter((x) => x.getBoundingClientRect().height > 0);
    return vis.map((a) => [...a.querySelectorAll("[data-framer-name]")].filter((c) => c.getBoundingClientRect().height > 0 && getComputedStyle(c).cursor === "pointer").map((c) => { const r = c.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, name: c.getAttribute("data-framer-name") }; }));
  });
  log.featureArrows = arrows;
  const flat = arrows.flat();
  if (flat.length) {
    const next = flat[flat.length - 1];
    await page.mouse.click(next.x, next.y);
    await sleep(1200);
    await page.screenshot({ path: path.join(dir, `feature-after-next.jpg`), type: "jpeg", quality: 70 });
    await page.mouse.click(next.x, next.y);
    await sleep(1200);
    await page.screenshot({ path: path.join(dir, `feature-after-next2.jpg`), type: "jpeg", quality: 70 });
  }
  // Clicking the second feature item
  const items = await page.evaluate(() => {
    const vis = [...document.querySelectorAll('[data-framer-name="FeatureList"]')].find((x) => x.getBoundingClientRect().height > 0);
    if (!vis) return [];
    return [...vis.querySelectorAll("h3")].map((h) => { const r = h.getBoundingClientRect(); return { x: r.x + 20, y: r.y + r.height / 2, t: h.innerText }; });
  });
  log.featureItems = items;
  if (items[2]) {
    await page.mouse.click(items[2].x, items[2].y);
    await sleep(1200);
    await page.screenshot({ path: path.join(dir, `feature-after-click-item3.jpg`), type: "jpeg", quality: 70 });
  }
}

// 4. Success stories carousel
const tsTop = await page.evaluate(() => {
  const e = [...document.querySelectorAll('[data-framer-name="Testimonials"]')].find((x) => x.getBoundingClientRect().height > 0);
  return Math.round(e.getBoundingClientRect().top + window.scrollY);
});
await scrollTo(tsTop);
await page.screenshot({ path: path.join(dir, `carousel-0.jpg`), type: "jpeg", quality: 70 });
const btns = await page.evaluate(() =>
  [...document.querySelectorAll('img[alt="Next Arrow"], img[alt="Back Arrow"], [aria-label*="Next"], [aria-label*="Previous"]')]
    .filter((e) => e.getBoundingClientRect().height > 0)
    .map((e) => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, label: e.getAttribute("alt") || e.getAttribute("aria-label") }; })
);
log.carouselButtons = btns;
const nextBtn = btns.find((b) => /next/i.test(b.label));
if (nextBtn) {
  for (let i = 1; i <= 7; i++) {
    await page.mouse.click(nextBtn.x, nextBtn.y);
    await sleep(900);
    if (i <= 2 || i === 6 || i === 7) await page.screenshot({ path: path.join(dir, `carousel-next${i}.jpg`), type: "jpeg", quality: 70 });
  }
}

// 5. Press marquee speed
await scrollTo(0);
const tick = async () => page.evaluate(() => {
  const ul = [...document.querySelectorAll("section ul, ul")].find((u) => u.getBoundingClientRect().height > 0 && getComputedStyle(u).transform !== "none");
  return ul ? { transform: getComputedStyle(ul).transform, w: ul.scrollWidth } : null;
});
const m1 = await tick(); await sleep(2000); const m2 = await tick();
log.marquee = { m1, m2 };

// 6. Footer while scrolling to the bottom
const docH = await page.evaluate(() => document.documentElement.scrollHeight);
log.footer = [];
for (let y = docH - H * 2.2; y <= docH; y += Math.round(H / 4)) {
  await scrollTo(y);
  const f = await page.evaluate(() => {
    const ft = [...document.querySelectorAll("footer")].find((x) => x.getBoundingClientRect().height > 0);
    const big = [...document.querySelectorAll("h1,h2,p")].find((h) => /Ditto Care\(s\)/.test(h.innerText) && h.getBoundingClientRect().height > 0);
    const main = [...document.querySelectorAll('[data-framer-name="Main"]')].find((x) => x.getBoundingClientRect().height > 0);
    const r = (e) => e && (() => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { top: Math.round(b.top), h: Math.round(b.height), transform: cs.transform, position: cs.position, z: cs.zIndex }; })();
    let anc = [];
    let n = big; while (n && n !== ft) { const cs = getComputedStyle(n); if (cs.transform !== "none" || cs.position === "sticky" || cs.position === "fixed") anc.push({ name: n.getAttribute("data-framer-name"), t: cs.transform, p: cs.position, top: cs.top }); n = n.parentElement; }
    return { footer: r(ft), big: r(big), main: r(main), anc, sy: window.scrollY };
  });
  log.footer.push(f);
}
await page.screenshot({ path: path.join(dir, `footer-bottom.jpg`), type: "jpeg", quality: 70 });

fs.writeFileSync(path.join(dir, "probe.json"), JSON.stringify(log, null, 1));
console.log(BP, "probe done");
await browser.close();

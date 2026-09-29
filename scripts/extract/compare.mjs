// Compare one region of the live site with the local rebuild, per breakpoint.
// Regions are aligned on an anchor text (or "top" / "bottom"), so sections can be checked
// before the rest of the page exists.
//
// Usage: node compare.mjs <outDir> <anchor> [offsets] [localUrl]
//   anchor   exact text of an element in the region, or "top" / "bottom" of the page
//   offsets  comma-separated scroll offsets from the anchor, in viewport heights (default 0)
// Writes <outDir>/<bp>-<offset>.jpg (live | local) and prints text elements that differ.
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const [OUT, ANCHOR, OFFSETS = "0", LOCAL = "http://localhost:8080/"] = process.argv.slice(2);
const LIVE = "https://www.dittocare.com/";
const BPS = (process.env.BPS || "desktop,tablet,phone").split(",");
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 810, height: 1080 },
  phone: { width: 390, height: 844, mobile: true },
};
const offsets = OFFSETS.split(",").map(Number);
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(browser, url, vp) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: !!vp.mobile,
    hasTouch: !!vp.mobile,
    reducedMotion: process.env.REDUCED ? "reduce" : "no-preference",
  });
  await ctx.route(/googletagmanager|cookiebot|usercentrics|google-analytics/, (r) => r.abort());
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await sleep(3500); // preloader
  // Scroll through once so lazy images and appear-on-enter effects have run.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += vp.height / 2) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
    await sleep(60);
  }
  return { ctx, page };
}

// Document y of the anchor, so the same region can be found on both pages.
const anchorY = (page, anchor) =>
  page.evaluate((anchor) => {
    const doc = document.documentElement;
    if (anchor === "top") return 0;
    if (anchor === "bottom") return doc.scrollHeight - window.innerHeight;
    const norm = (s) => s.replace(/\s+/g, " ").trim();
    for (const el of document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,a,span,li,button,div")) {
      if (norm(el.innerText || "") === anchor && el.getBoundingClientRect().height > 0) {
        return el.getBoundingClientRect().top + window.scrollY;
      }
    }
    throw new Error(`anchor not found: ${anchor}`);
  }, anchor);

// Leaf text elements in the viewport with their box (relative to the anchor) and type style.
const textIn = (page, top) =>
  page.evaluate((top) => {
    const norm = (s) => s.replace(/\s+/g, " ").trim();
    const canvas = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    const rgb = (c) => {
      canvas.clearRect(0, 0, 1, 1);
      canvas.fillStyle = c;
      canvas.fillRect(0, 0, 1, 1);
      const [r, g, b] = canvas.getImageData(0, 0, 1, 1).data;
      return `${r},${g},${b}`;
    };
    const family = (f) => (/uncut/i.test(f) ? "Uncut" : /bricolage/i.test(f) ? "Bricolage" : /inter/i.test(f) ? "Inter" : f.split(",")[0]);
    const weight = (cs) => {
      const m = /"wght"\s+([\d.]+)/.exec(cs.fontVariationSettings);
      const w = m ? +m[1] : +cs.fontWeight;
      return /uncut/i.test(cs.fontFamily) ? Math.min(w, 700) : w;
    };
    const out = {};
    const sel = "h1,h2,h3,h4,h5,h6,p,a,span,li,button,label,div";
    for (const el of document.querySelectorAll(sel)) {
      const text = norm(el.innerText || "");
      if (!text || text.length > 200) continue;
      if ([...el.querySelectorAll(sel)].some((c) => norm(c.innerText || "") === text)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > window.innerHeight) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || +cs.opacity === 0) continue;
      const key = text.slice(0, 60);
      if (out[key]) continue;
      out[key] = {
        x: Math.round(r.left),
        y: Math.round(r.top + window.scrollY - top),
        w: Math.round(r.width),
        h: Math.round(r.height),
        font: `${family(cs.fontFamily)} ${weight(cs)} ${cs.fontSize}/${cs.lineHeight} ls ${cs.letterSpacing}${cs.textWrapStyle === "balance" ? " balance" : ""}`,
        color: rgb(cs.color),
        // Only the element that holds the text node renders it; wrappers inherit or ignore type.
        own: [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()),
      };
    }
    return out;
  }, top);

const browser = await chromium.launch({ channel: "chrome", headless: true });
for (const bp of BPS) {
  const vp = VIEWPORTS[bp];
  const live = await open(browser, LIVE, vp);
  const local = await open(browser, LOCAL, vp);
  const [liveTop, localTop] = [await anchorY(live.page, ANCHOR), await anchorY(local.page, ANCHOR)];
  for (const off of offsets) {
    const shots = [];
    const texts = [];
    for (const [side, top] of [[live, liveTop], [local, localTop]]) {
      const y = Math.max(0, top + off * vp.height);
      await side.page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
      await sleep(900);
      const actual = await side.page.evaluate(() => window.scrollY);
      shots.push(await side.page.screenshot({ type: "png" }));
      texts.push(await textIn(side.page, top));
      void actual;
    }
    const gap = 16;
    const file = path.join(OUT, `${bp}-${off}.jpg`);
    await sharp({ create: { width: vp.width * 2 + gap, height: vp.height, channels: 3, background: "#ff00ff" } })
      .composite([{ input: shots[0], left: 0, top: 0 }, { input: shots[1], left: vp.width + gap, top: 0 }])
      .jpeg({ quality: 80 })
      .toFile(file);

    const [a, b] = texts;
    const rows = [];
    for (const [key, l] of Object.entries(a)) {
      const r = b[key];
      if (!r) { rows.push(`  MISSING  "${key}"`); continue; }
      const d = ["x", "y", "w", "h"].map((k) => r[k] - l[k]);
      const diffs = [];
      if (d.some((v) => Math.abs(v) > 2)) diffs.push(`box Δ${d.join("/")}`);
      if (l.own && r.own && l.font !== r.font) diffs.push(`font ${l.font} -> ${r.font}`);
      if (l.own && r.own && l.color !== r.color) diffs.push(`color ${l.color} -> ${r.color}`);
      if (diffs.length) rows.push(`  "${key.slice(0, 40)}": ${diffs.join(" | ")}`);
    }
    for (const key of Object.keys(b)) if (!a[key]) rows.push(`  EXTRA    "${key}"`);
    console.log(`== ${bp} offset ${off} -> ${file}\n${rows.join("\n") || "  (text matches)"}`);
  }
  await live.ctx.close();
  await local.ctx.close();
}
await browser.close();

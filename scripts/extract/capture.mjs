// Capture the live dittocare.com homepage at the three Framer breakpoints.
// Usage: node capture.mjs <outDir> [url]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
const URL = process.argv[3] || "https://www.dittocare.com/";
const WIDTHS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 810, height: 1080 },
  { name: "phone", width: 390, height: 844, mobile: true },
];
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Serialises every visible element that has a data-framer-name.
const dumpLayers = () => {
  const props = [
    "position", "top", "display", "flexDirection", "justifyContent", "alignItems", "gap", "rowGap", "columnGap",
    "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "borderRadius", "backgroundColor",
    "backgroundImage", "color", "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing",
    "fontVariationSettings", "fontFeatureSettings", "textAlign", "opacity", "transform", "overflow", "zIndex",
    "maxWidth", "boxShadow", "borderTopWidth", "borderTopColor", "backdropFilter", "gridTemplateColumns",
  ];
  const out = [];
  const pathOf = (el) => {
    const parts = [];
    let n = el;
    while (n && n !== document.body) {
      const nm = n.getAttribute && n.getAttribute("data-framer-name");
      if (nm) parts.unshift(nm);
      n = n.parentElement;
    }
    return parts.join(" > ");
  };
  const all = document.querySelectorAll("[data-framer-name], h1, h2, h3, h4, p, a, img, video, svg");
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const rec = {
      tag: el.tagName.toLowerCase(),
      name: el.getAttribute("data-framer-name") || null,
      path: pathOf(el),
      box: { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
    };
    const s = {};
    for (const p of props) {
      const v = cs[p];
      if (v && v !== "none" && v !== "normal" && v !== "auto" && v !== "0px" && v !== "rgba(0, 0, 0, 0)" && v !== "static" && v !== "visible") s[p] = v;
    }
    rec.style = s;
    if (["h1", "h2", "h3", "h4", "p", "a"].includes(rec.tag)) rec.text = (el.innerText || "").trim().slice(0, 160);
    if (rec.tag === "a") rec.href = el.getAttribute("href");
    if (rec.tag === "img") { rec.src = el.currentSrc || el.src; rec.alt = el.alt; }
    if (rec.tag === "video") rec.src = el.currentSrc || el.src;
    out.push(rec);
  }
  return out;
};

const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = {};

for (const vp of WIDTHS) {
  const dir = path.join(OUT, vp.name);
  fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile: !!vp.mobile,
    hasTouch: !!vp.mobile,
  });
  await ctx.route(/googletagmanager|cookiebot|usercentrics|google-analytics/, (r) => r.abort());
  const page = await ctx.newPage();
  const t0 = Date.now();
  await page.goto(URL, { waitUntil: "domcontentloaded" });

  // Preloader timeline
  const timeline = [0, 150, 300, 450, 600, 800, 1000, 1300, 1600, 2000, 2300, 2600, 2800, 3000, 3200, 3500, 4000, 5000];
  for (const t of timeline) {
    const wait = t - (Date.now() - t0);
    if (wait > 0) await sleep(wait);
    await page.screenshot({ path: path.join(dir, `preload-${String(t).padStart(4, "0")}.jpg`), type: "jpeg", quality: 70 });
  }
  await page.waitForLoadState("networkidle").catch(() => {});
  await sleep(1000);

  const docH = await page.evaluate(() => document.documentElement.scrollHeight);
  report[vp.name] = { docHeight: docH, strips: [] };

  // Scroll strip: step through the page in 0.5 viewport increments to capture sticky/scroll behaviour.
  const step = Math.round(vp.height * 0.5);
  let i = 0;
  for (let y = 0; y < docH; y += step) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
    await sleep(700);
    const actual = await page.evaluate(() => window.scrollY);
    const f = `strip-${String(i).padStart(3, "0")}-y${actual}.jpg`;
    await page.screenshot({ path: path.join(dir, f), type: "jpeg", quality: 70 });
    report[vp.name].strips.push({ y: actual, file: f });
    i++;
  }

  // Layers dump after everything has been scrolled into view once
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await sleep(800);
  const layers = await page.evaluate(dumpLayers);
  fs.writeFileSync(path.join(dir, "layers.json"), JSON.stringify(layers, null, 1));
  report[vp.name].layerCount = layers.length;

  await ctx.close();
  console.log(vp.name, "done", docH, report[vp.name].strips.length, "strips", layers.length, "layers");
}

fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 1));
await browser.close();

// Detect scroll-linked effects: record transform/opacity of every visible named layer at many scroll positions.
import { chromium } from "playwright";
import fs from "node:fs";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bp = process.argv[2] || "desktop";
const [W, H, m] = { desktop: [1440, 900, false], tablet: [810, 1080, false], phone: [390, 844, true] }[bp];
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: W, height: H }, isMobile: m, hasTouch: m });
await ctx.route(/googletagmanager|cookiebot/, (r) => r.abort());
const p = await ctx.newPage();
await p.goto("https://www.dittocare.com/", { waitUntil: "networkidle" });
await sleep(4500);
const docH = await p.evaluate(() => document.documentElement.scrollHeight);
const samples = [];
for (let y = 0; y <= docH - H; y += 150) {
  await p.evaluate((yy) => scrollTo(0, yy), y);
  await sleep(450);
  const s = await p.evaluate(() => {
    const out = {};
    const els = document.querySelectorAll("[data-framer-name]");
    els.forEach((e, i) => {
      const r = e.getBoundingClientRect();
      if (r.width === 0 || getComputedStyle(e).display === "none") return;
      const cs = getComputedStyle(e);
      let path = []; let n = e; while (n) { const nm = n.getAttribute && n.getAttribute("data-framer-name"); if (nm) path.unshift(nm); n = n.parentElement; }
      out[i] = { path: path.join(" > "), tf: cs.transform, op: cs.opacity, top: Math.round(r.top) };
    });
    return { sy: scrollY, out };
  });
  samples.push(s);
}
// report elements whose tf/opacity varies
const keys = new Set(samples.flatMap((s) => Object.keys(s.out)));
const report = [];
for (const k of keys) {
  const vals = samples.map((s) => s.out[k] && `${s.out[k].tf}|${s.out[k].op}`);
  const uniq = new Set(vals.filter(Boolean));
  if (uniq.size > 1) {
    const path = samples.find((s) => s.out[k]).out[k].path;
    report.push({ path, series: samples.filter((s) => s.out[k]).map((s) => [s.sy, s.out[k].top, s.out[k].tf.replace(/matrix\((.*)\)/, "$1"), s.out[k].op]) });
  }
}
fs.writeFileSync(`scrollfx-${bp}.json`, JSON.stringify(report, null, 1));
for (const r of report) {
  const ser = r.series.filter((x, i, a) => i === 0 || `${x[2]}|${x[3]}` !== `${a[i - 1][2]}|${a[i - 1][3]}`);
  console.log("\n#", r.path.slice(-90), `(${ser.length} changes)`);
  console.log(ser.slice(0, 14).map((x) => `  y${x[0]} top${x[1]} [${x[2]}] op${x[3]}`).join("\n"));
}
await b.close();

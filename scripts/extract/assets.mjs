// Collect every framerusercontent asset actually rendered at each breakpoint (img, video, css backgrounds, svg <image>, fonts in use).
import { chromium } from "playwright";
import fs from "node:fs";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await chromium.launch({ channel: "chrome" });
const out = {};
for (const [bp, W, H, m] of [["desktop", 1440, 900, false], ["tablet", 810, 1080, false], ["phone", 390, 844, true]]) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, isMobile: m, hasTouch: m });
  await ctx.route(/googletagmanager|cookiebot/, (r) => r.abort());
  const p = await ctx.newPage();
  const net = new Set();
  p.on("response", (r) => { const u = r.url(); if (/framerusercontent\.com\/(images|assets)/.test(u)) net.add(u); });
  await p.goto("https://www.dittocare.com/", { waitUntil: "networkidle" });
  await sleep(4000);
  const H2 = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H2; y += 400) { await p.evaluate((yy) => scrollTo(0, yy), y); await sleep(150); }
  await sleep(1500);
  const dom = await p.evaluate(() => {
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const sec = (e) => { const names = []; let n = e; while (n) { const nm = n.getAttribute && n.getAttribute("data-framer-name"); if (nm) names.unshift(nm); n = n.parentElement; } return names.slice(0, 4).join(" > "); };
    const res = [];
    for (const i of document.querySelectorAll("img")) if (vis(i)) res.push({ kind: "img", src: i.currentSrc || i.src, alt: i.alt, w: Math.round(i.getBoundingClientRect().width), h: Math.round(i.getBoundingClientRect().height), nat: [i.naturalWidth, i.naturalHeight], ctx: sec(i) });
    for (const v of document.querySelectorAll("video")) if (vis(v)) res.push({ kind: "video", src: v.currentSrc || v.src, poster: v.poster, w: Math.round(v.getBoundingClientRect().width), h: Math.round(v.getBoundingClientRect().height), ctx: sec(v) });
    for (const e of document.querySelectorAll("*")) { const bg = getComputedStyle(e).backgroundImage; if (bg && bg.includes("framerusercontent") && vis(e)) res.push({ kind: "bg", src: bg, w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height), ctx: sec(e) }); }
    return res;
  });
  out[bp] = { dom, network: [...net] };
  await ctx.close();
  console.log(bp, dom.length, net.size);
}
fs.writeFileSync("assets.json", JSON.stringify(out, null, 1));
await b.close();

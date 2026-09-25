import { chromium } from "playwright";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await chromium.launch({ channel: "chrome" });
for (const [bp, W, H, m] of [["phone", 390, 844, true], ["tablet", 810, 1080, false]]) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, isMobile: m, hasTouch: m });
  await ctx.route(/googletagmanager|cookiebot/, (r) => r.abort());
  const p = await ctx.newPage();
  await p.goto("https://www.dittocare.com/", { waitUntil: "networkidle" });
  await sleep(4500);
  const top = await p.evaluate(() => { const e = [...document.querySelectorAll('[data-framer-name="HowItWorks"]')].find((x) => x.getBoundingClientRect().height > 0); return Math.round(e.getBoundingClientRect().top + scrollY); });
  await p.evaluate((y) => scrollTo(0, y), top - 60); await sleep(800);
  // find visible chevrons inside the visible HowItWorks
  const pts = await p.evaluate(() => {
    const root = [...document.querySelectorAll('[data-framer-name="HowItWorks"]')].find((x) => x.getBoundingClientRect().height > 0);
    return [...root.querySelectorAll('[data-framer-name="Chevron"]')].filter((c) => c.getBoundingClientRect().height > 0).map((c) => { const r = c.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
  });
  console.log(bp, "chevrons", JSON.stringify(pts));
  const nx = pts.reduce((a, b) => (b[0] > a[0] ? b : a));
  for (let i = 1; i <= 3; i++) {
    if (m) await p.touchscreen.tap(nx[0], nx[1]); else await p.mouse.click(nx[0], nx[1]);
    await sleep(1200);
    await p.screenshot({ path: `probe/${bp}/feat2-next${i}.jpg`, type: "jpeg", quality: 70 });
  }
  // feature text list state
  const txt = await p.evaluate(() => { const root = [...document.querySelectorAll('[data-framer-name="HowItWorks"]')].find((x) => x.getBoundingClientRect().height > 0); return [...root.querySelectorAll("h3")].filter((h) => h.getBoundingClientRect().height > 0).map((h) => [h.innerText, Math.round(h.getBoundingClientRect().x), getComputedStyle(h.closest("[data-framer-name]")).opacity]); });
  console.log(bp, JSON.stringify(txt));
  await ctx.close();
}
await b.close();

// Save the live page's rendered DOM per breakpoint, plus nav menu / language dropdown open states.
// Usage: node snapshot.mjs <outDir> [url]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
const URL = process.argv[3] || "https://www.dittocare.com/";
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ channel: "chrome", headless: true });
for (const vp of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844, mobile: true },
]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: !!vp.mobile, hasTouch: !!vp.mobile });
  await ctx.route(/googletagmanager|cookiebot|usercentrics|google-analytics/, (r) => r.abort());
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await sleep(3500);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(800);
  fs.writeFileSync(path.join(OUT, `${vp.name}.html`), await page.content());

  // Open states
  const nav = page.locator('[data-framer-name="Nav"]').first();
  if (vp.name === "phone") {
    const btn = page.locator('[data-framer-name="Nav"] [data-framer-name*="Menu" i], [data-framer-name="Nav"] [data-framer-name*="Hamburger" i], [data-framer-name="Nav"] [data-framer-name*="Button" i]').first();
    const names = await page.evaluate(() =>
      [...document.querySelectorAll('[data-framer-name="Nav"] [data-framer-name]')].map((e) => e.getAttribute("data-framer-name")),
    );
    fs.writeFileSync(path.join(OUT, "phone-nav-names.json"), JSON.stringify(names, null, 1));
    await btn.click().catch((e) => console.log("menu click failed", e.message));
    await sleep(1200);
    await page.screenshot({ path: path.join(OUT, "phone-menu-open.png") });
    fs.writeFileSync(path.join(OUT, "phone-menu-open.html"), await nav.evaluate((n) => n.closest("header, nav, [data-framer-name]")?.outerHTML ?? n.outerHTML));
  } else {
    const names = await page.evaluate(() =>
      [...document.querySelectorAll('[data-framer-name="Nav"] [data-framer-name]')].map((e) => e.getAttribute("data-framer-name")),
    );
    fs.writeFileSync(path.join(OUT, "desktop-nav-names.json"), JSON.stringify(names, null, 1));
    const globe = page.locator('[data-framer-name="Nav"] [data-framer-name*="Lang" i], [data-framer-name="Nav"] [data-framer-name*="Globe" i]').first();
    await globe.hover().catch(() => {});
    await sleep(600);
    await page.screenshot({ path: path.join(OUT, "desktop-lang-hover.png"), clip: { x: 900, y: 0, width: 540, height: 300 } });
    await globe.click().catch((e) => console.log("globe click failed", e.message));
    await sleep(900);
    await page.screenshot({ path: path.join(OUT, "desktop-lang-open.png"), clip: { x: 900, y: 0, width: 540, height: 300 } });
  }
  await ctx.close();
}
await browser.close();

import { chromium } from "playwright";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await chromium.launch({ channel: "chrome" });
for (const [bp, W, H, m] of [["desktop", 1440, 900, false], ["phone", 390, 844, true]]) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, isMobile: m, hasTouch: m });
  await ctx.route(/googletagmanager|cookiebot/, (r) => r.abort());
  const p = await ctx.newPage();
  await p.goto("https://www.dittocare.com/", { waitUntil: "networkidle" });
  await sleep(4500);
  const info = await p.evaluate(() => {
    const vis = (n) => [...document.querySelectorAll(`[data-framer-name="${n}"]`)].find((x) => x.getBoundingClientRect().height > 0);
    const pp = vis("Pain point"); const st = vis("Sticky section");
    return { ppTop: Math.round(pp.getBoundingClientRect().top + scrollY), stickyH: st.getBoundingClientRect().height };
  });
  const state = () => p.evaluate(() => {
    const w = [...document.querySelectorAll('[data-framer-name="White"]')].find((x) => x.getBoundingClientRect().height > 0);
    const t = [...document.querySelectorAll("h2")].find((h) => /overwhelming/.test(h.innerText) && h.getBoundingClientRect().height > 0);
    const par = w.parentElement;
    return { white: getComputedStyle(w).backgroundColor, parent: getComputedStyle(par).backgroundColor, parentName: par.getAttribute("data-framer-name"), title: getComputedStyle(t).color, titleCls: t.className, titleFont: getComputedStyle(t).fontSize };
  });
  let prev = null; const found = [];
  for (let y = info.ppTop - 100; y < info.ppTop + 900; y += 20) {
    await p.evaluate((yy) => scrollTo(0, yy), y); await sleep(250);
    const s = await state();
    if (!prev || s.white !== prev.white) found.push({ y, rel: y - info.ppTop, ...s });
    prev = s;
  }
  console.log(bp, JSON.stringify(info), JSON.stringify(found, null, 0));
  // transition timing: jump across the threshold and sample
  const thr = found.length > 1 ? found[1].y : null;
  if (thr) {
    await p.evaluate((yy) => scrollTo(0, yy), thr - 200); await sleep(1500);
    await p.evaluate((yy) => scrollTo(0, yy), thr + 20);
    const t0 = Date.now(); const series = [];
    while (Date.now() - t0 < 1200) { series.push([Date.now() - t0, (await state()).white]); await sleep(40); }
    console.log(bp, "transition", JSON.stringify(series.filter((x, i, a) => i === 0 || x[1] !== a[i - 1][1])));
    await p.evaluate((yy) => scrollTo(0, yy), thr - 200); await sleep(1500);
    console.log(bp, "after scrolling back up:", (await state()).white);
  }
  await ctx.close();
}
await b.close();

# Extraction scripts

These scripts capture the live dittocare.com homepage so the rebuild can be checked against it. They are dev tooling only and are not part of the site build.

Requirements: Node 20+, a local Google Chrome (`channel: "chrome"`), and the tooling dependencies: run `bun install` (or `npm install`) in `scripts/`. GTM and Cookiebot are blocked during capture so the consent banner doesn't cover the screenshots.

| Script | Output |
|---|---|
| `capture.mjs <outDir> [url]` | preloader frames, scroll-strip screenshots, `layers.json` per breakpoint (1440/810/390) |
| `probe.mjs <outDir> <bp>` | nav, pain-point, stepper, carousel, marquee and footer behaviour (`probe.json`) |
| `probe2.mjs`, `probe3.mjs` | tablet/phone stepper clicks; pain background switch threshold and timing |
| `scrollfx.mjs <bp>` | every scroll-linked transform/opacity change (`scrollfx-<bp>.json`) |
| `assets.mjs` | every framerusercontent asset rendered or requested (`assets.json`) |
| `summarize.py <bp> <regex> [depth]` | readable layer summary from `docs/extraction/<bp>/layers.json` |
| `sheet.py` | contact sheets from screenshots |
| `snapshot.mjs <outDir> [url]` | rendered DOM per breakpoint plus the phone menu open state, for reference while rebuilding |
| `compare.mjs <outDir> <anchor> [offsets] [localUrl]` | live vs local side-by-side screenshots of one region, aligned on an anchor text (or `top` / `bottom`), plus a list of text elements whose box, font or colour differ. `BPS=desktop,phone` limits breakpoints, `REDUCED=1` emulates reduced motion |

Pass the local preview URL to `capture.mjs` to capture the rebuild the same way.

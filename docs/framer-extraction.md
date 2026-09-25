# dittocare.com homepage — Framer extraction

Step 1 of the Framer → React rebuild. Everything below was **extracted, not guessed**, from three sources:

1. **Framer MCP** (project `2tBt8IdDT7JGabFTph5tcE`, page `augiA20Il`): page tree, component props, copy, colour styles.
2. **Live published HTML/CSS** of https://www.dittocare.com/ (Framer `6cd4c26`): text-style presets and their breakpoint media queries, meta tags, asset URLs.
3. **Headless Chrome capture** of the live site at 1440 / 810 / 390 px (`scripts/extract/*`): computed styles and boxes of every named layer, scroll-strip screenshots, and behaviour probes (clicks, scroll-linked transforms, timings).

Raw data lives in `docs/extraction/` (per breakpoint `layers.json` + `layers.txt` summary, `probe.json`, scroll-effect dumps, contact sheets in `sheets/`). Re-run with `node scripts/extract/capture.mjs <out>` etc. (needs Playwright).

> **MCP limits hit.** `getNodeXml` returns no children for the Tablet/Phone breakpoint replicas, and errors (`Node is not a text node`) on Primary, Section title, Benefits 3, Cta 2, PreLoader, Pain point/Title 2, Logos, Navigation and Footer. The plugin also disconnected mid-session. Those components were therefore extracted from the rendered live DOM instead, which is the ground truth anyway.

---

## 1. Breakpoints

| Name | Framer canvas | Media query (live CSS) | Capture width |
|---|---|---|---|
| Desktop | 1200 | `min-width: 1200px` | 1440 |
| Tablet | 810 | `810px – 1199.98px` | 810 |
| Phone | 390 | `max-width: 809.98px` | 390 |

Content max width 1600px. Side gutters: **40px** desktop, **20px** tablet, **12px** phone. (Pain points use 20px on all.)

## 2. Page structure (in order)

| # | Section | Framer node | Notes |
|---|---|---|---|
| 0 | Preloader | `PreLoaderConnector` (3s) → `PreLoader drF2G2ioI` | fixed overlay, z 9999 |
| 1 | Nav | `Navigation NIZboanQC` (site-wide, not in page tree) | fixed top |
| 2 | Hero | `sS4o5RQer` | H1, QR + Download App, press marquee, rating, hero image |
| 3 | Pain points | `jKirbh8Zi` | sticky title panel + 3 sticky cards |
| 4 | This is Ditto | `xnv35raZU` / `Add Features BnBREwbLs` | click stepper with phone stack |
| 5 | Success stories | `jV0avXrwc` / `Testimonials slideshow cIKwH_FIf` | looping slideshow, video + review cards |
| 6 | Partners | `ap2zGE9l1` | logo grid |
| 7 | Why Ditto works | `J5x6Z6o3A` | image card + 4 benefits |
| 8 | Download CTA | `d2QFtVVkT` / `Cta 2 jxxHNx0zs` | store buttons + phone |
| 9 | FAQ | `UBz4Um4HO` / `FAQs - Patients w8diTqYgV` | 6-item accordion |
| 10 | Footer | `Footer qH9IZ2yCX` (site-wide) | big wordmark, parallax reveal |
| – | Lenis | `z8Y1V857_` | smooth, **intensity 8**, vertical, not infinite |

**Skipped (off-canvas leftovers, per brief):** `Video1/2/3` (cJ6P84fVS players), `Video1Description`, `VideosTitle`, `Videos3dStack`, `App` (MLbLm3hJb), `BoxedCta` (V5U1wdacz), and the empty second "Pain point" spacer section (`Iwv1xUywB`, only a 4vh spacer — kept as spacing).

## 3. Colours

Brand colour styles (the only ones to become tokens):

| Token | Framer name | Value | Seen on homepage as |
|---|---|---|---|
| `soft-sand` | Soft Sand | `#FFFBF7` rgb(255,251,247) | page bg, cards, FAQ items, light text on dark |
| `light-stone` | Light Stone | `#FAF2EB` | video-card subtitle text |
| `warm-linen` | Warm Linen | `#FFF2E3` | – (tablet This-is-Ditto panel tint, verify in Step 3) |
| `ditto-midnight` | Ditto Midnight | `#0D164F` | headings, nav text, buttons, footer bg, preloader bg |
| `ditto-night` | Ditto Night | `#090F36` | rating stars (80% opacity) |
| `sky-tint` | Sky Tint | `#BFD6E6` | pain card 1, button icon chip, store buttons, footer copy |
| `pale-horizon` | Pale Horizon | `#DCEAF4` | nav bar, logo grid + FAQ containers, review sub-labels, © |
| `coastal-blue` | Coastal Blue | `#7AA8C9` | pain card 2 |
| `atlantic-blue` | Atlantic Blue | `#2A6289` | body copy, pain card 3, review cards |
| `deep-current` | Deep Current | `#173F5C` | pain dark bg, testimonials + CTA panels, arrows, sub-copy |
| `ditto-green` | Ditto Green | `#E0FBD5` | – |
| `ditto-yellow` | Ditto Yellow | `#F3DE70` | – |
| `ditto-purple` | Ditto Purple | `#BEAEF8` | – |
| `sour-blueberry` | Sour Blueberry | `#B2DCF5` | – |

Off-palette values the live page renders (template leftovers). **Proposed mapping to the nearest brand token** (visual delta noted):

| Live value | Where | Proposed token | Delta |
|---|---|---|---|
| `#0A0A0A` | Why-image card fill behind the 90% image, default text fallback | `ditto-night` | invisible (covered by image) |
| `#EBEBEB` "Light Gray" | Why-benefits container | `pale-horizon` | **visible**: grey → pale blue. Alternative: `light-stone`. Needs your call (§12) |
| `#FFFFFF` | pain trigger layers (opacity 0), "Success stories" h2 (white) | `soft-sand` | negligible |
| `#A8A8A8` / `#EBEBEB` | review "App Store / Google Play" sub-labels fallback | live renders `pale-horizon` | none |
| `rgba(0,0,0,.4)` | nav menu backdrop | `ditto-night` at 40% | negligible |

## 4. Typography

**Fonts**

| Family | Source on live site | Weights used | Licence | Plan |
|---|---|---|---|---|
| Bricolage Grotesque | Google Fonts | 500, 600 | OFL | self-host woff2 (latin + latin-ext) |
| Uncut Sans Variable | framerusercontent `1oLc4TO3hOXSqPJEyuB5qarBQ.woff2` | variable `wght` 300–700 (+ `ital` 0–11), feature `ss06` on | OFL 1.1 (verified in font `name` table) | self-host |
| Inter | framerusercontent | 400, 500 | OFL | self-host (FAQ only) |
| Geist, Fragment Mono | Google Fonts | – | – | loaded by Framer but **not used on homepage**; drop |

Framer drives Uncut Sans weight through `font-variation-settings: "wght" N` with `font-weight: 1000`; where no axis is set (footer email/phone) the weight clamps to the font max **700**.

**Text styles** (desktop / tablet / phone). Names are the Framer text-style names where the MCP confirmed them; ⚠ = name inferred (the MCP style list was truncated and the component XML failed).

| Proposed token | Framer style | Font / weight | Size D / T / P | Line height | Letter spacing | Used for |
|---|---|---|---|---|---|---|
| `heading-1-s` | Heading 1 S | Bricolage 500 | 72 / 64 / 40 | 1.1 | −0.05em | Hero H1; phone "This is Ditto", "Why Ditto Works" |
| `heading-2-l` ⚠ | (Section title comp.) | Bricolage 500 | 64 / 56 / 34 | 1.1 | −0.05em | "Why Ditto works" (desktop/tablet) |
| `heading-2-m` | Heading 2 M | Bricolage 500 | 54 / 48 / 34 | 1.1 | −0.05em | This is Ditto, Success stories, CTA, More about Ditto |
| `heading-3-m` | Heading 3 M | Bricolage 600 | 32 / 32 / 26 | 1.1 / 1.1 / 1.3 | −0.05em | Partners title |
| `heading-4` | Heading 4 | Bricolage 600 | 22 / 22 / 18 | 1.4 | −0.04em | Pain card titles, review titles |
| `heading-5` ⚠ | (Feature/Benefit title) | Bricolage 600 | 18 / 18 / 17 | 1.3 | −0.04em | Feature + benefit titles |
| `body-18-medium` | 18 medium | Uncut wght 500 | 18 / 18 / 17 | 1.2 | 0 | Hero sub, "Built for you…", footer copy |
| `body-16-medium` | 16 medium | Uncut wght 500 | 16 / 16 / 15 | 1.2 | 0 | Section subs, feature/benefit/review body, names |
| `body-14-medium` | 14 medium | Uncut wght 500 | 14 / 14 / 13 | 1.2 | 0 | Pain card body, "users", review sub-labels, © |
| `body-14-regular` | 14 regular | Uncut wght **500** | 14 / 14 / 13 | 1.2 | 0 | Rating "4.7/5", pain card 3 body. ⚠ Framer's "regular" is actually wght 500, identical to 14 medium |
| `label-14` ⚠ | (Button/link) | Uncut wght 400 | 14 all | 1.2 | −0.04em | Nav links, buttons, footer links |
| `footer-email` ⚠ | – | Uncut wght 700 | 24 all | 1.3 | −0.04em | support@ditto.care |
| `footer-phone` ⚠ | – | Uncut wght 700 | 16 all | 1.2 | −0.04em | phone number |
| `faq-question` | (code comp.) | Inter 500 | 18 | 1.3 | −0.03em | FAQ question |
| `faq-answer` | (code comp.) | Inter 400 | 16 | 1.4 | −0.03em | FAQ answer |
| *(one-off)* `display-pain` | inline | Bricolage 500 | 40 all | 1.1 | −0.05em | "Healthcare can feel overwhelming" |
| *(one-off)* `display-preloader` | inline | Bricolage 600 | 56 all | 1.1 | −0.07em | Preloader "Ditto" |
| *(one-off)* `display-footer` | inline, fit-to-width | Uncut wght 500, ss06 | ≈19.3cqw (212px in a 1094-wide viewBox scaled to container) | 0.9 | −0.06em | "Ditto Care(s)" |

CSS presets present on the live site but **not used by visible homepage text** (not ported): `17d61ne`, `18yp9az`, `bsbls7`, `1iy8iq8`.

## 5. Shared primitives

- **Primary button** (`uh6QMUOY5`, "Black" variant): Midnight bg, radius 30px, padding 8/20, gap 6, label `label-14` Soft Sand. Optional icon chip 26×26 (Sky Tint circle, radius 16, 6px pad, Phosphor icon 14px Midnight: `DeviceMobile`, `ArrowRight`). Hover: text roll (label duplicated, second copy slides up from +16px).
- **Nav link**: `label-14` Midnight, same text-roll hover.
- **Rating badge**: 5 Phosphor `Star` fill 13px, Ditto Night @80%, gap 2 · "4.7/5" `body-14-regular` Deep Current · "100.000+ users" `body-14-medium` Atlantic Blue. Right-aligned (desktop/tablet), centred (phone).
- **Grain overlay**: tiled `rR6HYXBrMmX4cRpXfXUOvpvpB0.png` (256×256 noise) at **2% opacity**, absolute inset 0. On hero image, pain cards, testimonials panel, CTA panel, footer.
- **Phone mockup**: iPhone frame `YlYIbfFEujexwgWABDzpsRlY.webp` (722×1470) over an app screenshot inset (radius 24 feature / 48 CTA, top 9px, centred).
- **Section title** (`v7JGK6LjJ`): renders an H2 `heading-2-l` ("Large black - H2"); phone variant is H1 centred `heading-1-s`.
- **Radii**: 16 (panels, images), 14 (pain cards), 12 (pain card image, benefit items), 11 (logo tiles, FAQ items), 30 (buttons), 308 (store buttons), 414 (arrow buttons).
- **Inner-container pattern**: tinted container with 6px padding + 6px gap holding Soft Sand tiles (logos, benefits, FAQ).

## 6. Sections — layout per breakpoint

Values are D / T / P unless stated. Full numbers: `docs/extraction/<bp>/layers.txt`.

### 6.1 Nav (fixed)
- Header: fixed top 0, side padding 40 / 20 / 12. Bar: Pale Horizon, **radius 0 0 16 16** (attached to top edge), padding 6, `backdrop-filter: blur(8px)`, height 45, max-width 1520.
- Left: Ditto logo SVG `IeIALCt1iExgaDaXvddRsQAdfFA.svg` 63×19 (+8px left pad).
- Right (D/T): links **Professionals, About, Privacy, News, Support** (gap 16), globe icon 18px (language switcher: English / Nederlands → `/nl/`), Download App button (no icon).
- Phone: logo + round menu button (33×33, Soft Sand, radius 25, hamburger). Opens a menu with a 40% dark backdrop. The open state wasn't captured; I'll screenshot it in Step 3.

### 6.2 Hero
- Container padding-top **140 / 120 / 100**, gap 40.
- **D/T:** row: left column (H1 `heading-1-s` Midnight, sub `body-18-medium` Atlantic Blue, max-width 800, gap 10); right column 157px wide: QR tile (Midnight rounded box, QR `UGl49TxXmHollnHUWPY5ogOFY.png` 121×118, radius 5), then Download App button with `DeviceMobile` icon, space-between.
- **P:** centred: H1 in two lines ("Clarity when / it matters most", 40px), sub 17px centred, Download App button, rating badge centred. **No QR code on phone.**
- Details row (gap 20 / 16 / 12): press marquee (flex-1) + rating (right, D/T only), then hero image.
- **Press marquee**: Framer Ticker, links to `/press`, speed **25 px/s** leftwards, item gap 54px, faded edges. 8 logos (≈37–51px tall, greyscale): NPO Radio 1, Innovation Origins, Margriet, Quote, Het Parool, Skipr, Trouw, AD. Phone: marquee full width, 46px high.
- **Hero image**: frame radius 16, aspect ~1.6 (1360×850 D, 770×481 T, 366×300 P), `object-fit: cover`. Image D/T `sjhAyZGLqVpb930PxW3OS5eJHE.jpg` (3680×2492), P `E7dKBYv2SsftQsxXziK1muOMgSE.png` (3257×2257). Floating UI chips are baked into the image. 2% grain. **Desktop only**: scroll-linked zoom (§7).

### 6.3 Pain points
- Section padding 0 20. **Sticky panel** 100vh, `top: 0`, bg layer spans full width (−20px each side). Title "Healthcare can feel overwhelming" centred, 443px wide (350 on P), Deep Current → Soft Sand on switch.
- **Scroll track**: height **250vh**, max-width 1280, flex column centred, then a 10vh spacer (plus 10vh after the track).
- **Cards** (max-width 690, sticky):

| | Card 1 | Card 2 | Card 3 |
|---|---|---|---|
| bg | Sky Tint | Coastal Blue | Atlantic Blue |
| rotation | −2° | +2° | −2° |
| sticky top | 200px | 220px | 300px |
| icon (Phosphor 20px) | Brain, Atlantic Blue | Alarm, Soft Sand | PhoneCall, Soft Sand |
| title | "Details fade" (Atlantic Blue) | "It's hard to keep up" | "Everyone wants to know" |
| image | `rlcg9pQr8Z1IUJex2TR0YvPejLQ.jpg` | `M5TtYJGbNYknRnCd4WkEXohBc.jpg` | `tQHKtVNWc7341jCkk6Pu0NnWC0g.jpg` |

- Card: D/T **row**, 300px high (≈324 rendered), padding 40, gap 20, radius 14, image half-width radius 12. P: **column**, text on top, image below (card ≈362×371–394).
- Text: title `heading-4`, body `body-14-medium` (card 3 uses `body-14-regular`, identical).
- Three invisible trigger layers inside the track drive the card scale (§7): bottom-anchored, heights **1670 / 1472 / 1180px** on all breakpoints.

### 6.4 This is Ditto
- **Desktop** (1200 wide block, padding 30 40 0, gap 40): header centred (H2 `heading-2-m`, sub `body-16-medium` Deep Current, max 500), then a row: **feature list** (373px, padding 40 0, gap 12) + **phone stage** (747×605).
  - Feature item: padding 20, radius 16, gap 8; title `heading-5` Midnight, body `body-16-medium` Deep Current. Active: Soft-Sand/white bg + "BgBlur" layer 40% opacity; idle: transparent.
  - Phones: 3 mockups 300×605 stacked with rotations **−6° / 9° / 18°** (front → back), centred ~37% / 55% / 68%. Screens: `hAfWpjvH6i6R6u8MW10v3mgLE.png` (Check-up), `BpFObPs7acG37bb9CJSTkru17k0.png` (Questions to ask), `xyalouaMZYhw7FHZ0NDjJxah8E.png` (Loved Ones).
  - Arrows: 2 × 44px circles (Deep Current, radius 414, chevron), gap 12, at top 510px of the stage, centred. Disabled state = 50% opacity.
- **Tablet**: panel section with radius **20 40 0 0**, padding 80 0; content max 1080, gap 40; header H2 48px; phone stack centred; feature cards in a horizontal row below the phones that slides with the step.
- **Phone**: panel radius **30 30 0 0**, padding 50 0; H1 "This is Ditto" 40px centred, sub 15px; one large phone (others peeking), arrows under it, feature card row below. Phone screens differ: `2bMxfwfTnkFwmKEtUjxNTbUBCc.png` (General Practitioner), `BpFObPs7acG37bb9CJSTkru17k0.png`, `63qDqsGYW1xSNL6TxZBpcaF88.png` (Ditto Care Circle).

### 6.5 Success stories
- Section padding 80 40 / 80 20 / 40 12 60. Panel: Deep Current, radius 16, padding **60 / 40 / 40 12 80**, gap 40 (80 on P), 2% grain.
- Title "Success stories" `heading-2-m` Soft Sand, left; arrows top-right (≈32px translucent circles, `Back Arrow` / `Next Arrow` white SVG icons `11KSGbIZoRSg4pjdnUoif6MKHI.svg` / `6tTbkXggWgQCAJ4DO2QEdXXmgM.svg`).
- Track height 380, gap 6 (live renders ~10). Visible items: **3 / 2 / 1**. Phone adds dot pagination (6 dots).
- Card: 409×380 (D), Atlantic Blue, radius 16, padding 24, column space-between.
  - Review card: title `heading-4` Soft Sand, quote `body-16-medium` Soft Sand; footer row: 87px store icon (radius 23, `VEfMBhxwf3O02sCSa2K8LQsoMmQ.png` App Store / `bZWPecLLyopMW7ecA0WzyplZY.png` Google Play) + name `body-16-medium` + source `body-14-medium` Pale Horizon.
  - Video card: muted looping video fills card (`elvrCykLHCyrq99pGmZbN6RU30.mp4` poster `9xN2gvKJAMaPyi2Mozl9ruGys.png`; `APsFS58sARABN9wRm5cOuBiSk.mp4` poster `0j7Evq9e8ivOaBcfwDdYYpAd08.png`), name + label bottom-left (label Light Stone).
- **Order** (loops): Henriëte (video, "Uses Ditto for her complex allergies") → Jet (Google Play) → Els (App Store) → Joke (video, "Uses Ditto at the Physiotherapist") → Freek (App Store) → Michel (Google Play).

### 6.6 Partners
- Padding 80 40 / 80 20 / 40 12, gap 40. Header row (D/T): title `heading-3-m` + sub `body-16-medium` Atlantic Blue (max 520) left; "Ditto for professionals" button with `ArrowRight` right. Phone: centred column, button below.
- Logo grid: Pale Horizon, radius 16, padding 6, gap 6. **5 columns** D/T (square tiles 265 / 147), **3 columns × 2 rows** P (114). Tiles Soft Sand, radius 11, logo ~102px centred.
- Logos: juvoly `iyAKqmVwqIrttRzWaiaysIOO32Q.svg`, Menzis `CEdr2tp2ejFCqAqp3jPw5QitUQ.svg`, HartKliniek `Dnl4b2u9i2knCs9TcYtt3VP5NY.png`, CZ `cv2XeJYcsaJjq5mjN1IG5916HU.svg`, UMCG `K3MFJuQ3dEAUCODsJaY1RqSfPM.jpeg`, **Ikazia** `2JlKGmDeatufaysMmqIwGqOwFo.svg` (6th tile, phone only).

### 6.7 Why Ditto works
- Container padding 80 40 / 100 20 / 40 12, gap 20. Title block: H2 `heading-2-l` (P: H1 `heading-1-s` centred "Why Ditto Works"), sub `body-18-medium` Atlantic Blue.
- **D**: row, gap 6: image card (671×586, radius 16, `k7Gtp7PABw7GFFLH8UDh9slMqpc.png` at 90%) + benefits container (radius 16, padding 6, gap 6, "Light Gray").
- **T**: 2-column grid 382px each, **benefits left, image right**, 720 tall.
- **P**: column: image 350 tall, benefits below.
- Benefit item: Soft Sand, radius 12, padding 24, gap 12; Phosphor icon 24px (ListBullets, Heart, Lock, User) Midnight; title `heading-5` Midnight; body `body-16-medium` Atlantic Blue.

### 6.8 Download CTA
- Section padding 80 40 / 80 20 40 / 20 12. Panel: Deep Current, radius 16, 600px tall (D), padding 20 80 (D) / 80 40 0 (T) / 50 20 0 (P); decorative shape `NgRBnNbQESh21gU58OOjeueuU.png` at 80% (centred, top 80).
- **D**: row: title H2 `heading-2-m` Soft Sand + sub `body-16-medium` (max 465), store buttons (180×52, Sky Tint, radius 308, badges `app_store` / `play_store` SVG); right: phone mockup (350×713, screen `dUb4NW0BMIkpQlu94j5GdzkXPM.png`, radius 48) cropped by panel bottom.
- **T/P**: centred column, title centred, buttons centred (stacked on P), large phone below, cropped.
- Both buttons → `https://dittocare.go.link/kMQxf`.

### 6.9 FAQ
- Container padding 80 40 / 80 20 / 40 12, gap 40. **D/T**: row, gap 80: left title `heading-2-m` + sub; right accordion. **P**: stacked, centred title.
- Accordion container: Pale Horizon, radius 16, padding 6, gap 6. Item: Soft Sand, radius 11, question row padding 24, `faq-question` Midnight, circled-plus icon 20px (`TlGVH6PyyjkaXLmZRxMwsvSk.svg`). Answer: `faq-answer` Atlantic Blue, no divider. All closed initially, one open at a time.
- 6 Q&As (copy in §9).

### 6.10 Footer
- Ditto Midnight, height 100vh (900 D), 2% grain. Container padding 100 40 20 (max 1600), column space-between.
- Wordmark "Ditto Care(s)" fit-to-width (§4). Copy "Whether you're navigating an appointment, supporting someone you love, or exploring how Ditto can help, we're here for you." `body-18-medium` Sky Tint (last clause Soft Sand), max 520. Email `footer-email` + phone `footer-phone` Soft Sand.
- Links (3 columns, `label-14` Soft Sand, gap 8): **Professionals, Press, Contact (/support), Join us (homerun)** · **EU AI Act, Terms & Conditions, Privacy Policy** · **News, Instagram, LinkedIn**; "© 2026 Ditto Care" `body-14-medium` Pale Horizon bottom-right. Phone: all stacked.

## 7. Motion & interaction catalogue

| # | Effect | Where | Spec (measured) | BP |
|---|---|---|---|---|
| M1 | **Preloader** | fixed overlay, Midnight | Letters of "Ditto" (`display-preloader`, Soft Sand) rise from `y+270` with `blur(6px)` → 0, staggered per char (~0.1s), complete ≈1.3s after start; wordmark drifts up; panel slides up (translateY −100%) ≈2.5–3.0s; total 3s (Framer duration prop). | all |
| M2 | **Appear on enter** (once) | section headlines, logo grid, why cards, CTA content, FAQ, feature items | opacity 0→1, translateY **40px** (headlines/grids), **50px** (CTA content), **16px** (feature items) → 0; spring-like ease, duration ≈0.6s (to tune against live in Step 3); triggers as element top enters the viewport. | all |
| M3 | **Word reveal** | "Healthcare can feel overwhelming" | per word: opacity 0→1, scale 0.9→1, staggered | all |
| M4 | **Word reveal** | "Success stories" | per word: opacity 0→1, blur 10px→0, y 10→0 | all |
| M5 | **Hero image zoom** | hero image | scale **1.2 → 1.0** linear over offset `["start end", "end end"]` of the image frame (at scrollY 0 it's already 1.094) | **D only** |
| M6 | **Pain bg switch** | sticky panel | Soft Sand → Deep Current bg, title Deep Current → Soft Sand, **~300ms** crossfade, when scrolled **50vh** past section top; **reverses** on scroll-up | all |
| M7 | **Card stack scale** | pain cards | scale **1 → 0.9** (rotation kept). Card 1: trigger 1 `["start center","end center"]`; cards 2, 3: triggers 2, 3 `["start start","end start"]` | all |
| M8 | **This is Ditto stepper** | phones + feature list | **Click-only (no autoplay)**. Next: front phone animates out, stack advances (3→2→1 visible); active feature card highlights; arrows disable at ends (50%). Feature cards are clickable to jump. T/P: feature row translates to active card. | all |
| M9 | **Carousel** | success stories | infinite loop, 1 item per click, arrows prev/next, drag enabled, no autoplay; slide ease ≈0.4s (to tune); phone dots | all |
| M10 | **Marquee** | press logos | 25 px/s leftwards, seamless loop, hover factor 1 (no slow-down) | all |
| M11 | **Accordion** | FAQ | height auto + opacity, ~0.3–0.4s ease; icon rotates 45° when open | all |
| M12 | **Footer reveal** | footer container | translateY = −(2/3)·(footer top in viewport), clamped to −600px (≈ −66.7vh) → 0 when footer top hits viewport top | **D only** |
| M13 | **Text roll hover** | nav links, buttons | duplicated label slides up 1 line | pointer |
| M14 | **Lenis** | page | smooth wheel, intensity 8 → `lerp ≈ 0.1` (tune to match) | all |

All of M1–M14 are disabled or reduced to instant states under `prefers-reduced-motion`.

## 8. Assets (47 files, all from framerusercontent.com, to be self-hosted under `/public/assets`)

| File | Type / px | Use | Proposed alt |
|---|---|---|---|
| `IeIALCt1iExgaDaXvddRsQAdfFA.svg` | svg 387×129 | nav logo | "Ditto" |
| `UGl49TxXmHollnHUWPY5ogOFY.png` | 500×500 | hero QR | "QR code to download the Ditto app" |
| `sjhAyZGLqVpb930PxW3OS5eJHE.jpg` | 3680×2492 | hero D/T | "Hands holding a phone showing the Ditto app with a summary ready and new care updates" |
| `E7dKBYv2SsftQsxXziK1muOMgSE.png` | 3257×2257 | hero P | (same) |
| `swThgpQQsACyV6fGKNPwV568A7c.png` … (8) | png | press logos | "AD", "NPO Radio 1", "Innovation Origins", "Margriet", "Quote", "Het Parool", "Skipr", "Trouw" |
| `rlcg9pQr8Z1IUJex2TR0YvPejLQ.jpg` | 1376×768 | pain card 1 | "Parent in a busy kitchen with a child running past" |
| `M5TtYJGbNYknRnCd4WkEXohBc.jpg` | 8021×5350 | pain card 2 | "Person reading a thick book of notes" |
| `tQHKtVNWc7341jCkk6Pu0NnWC0g.jpg` | 4160×6240 | pain card 3 | "Young man on the phone at sunset" |
| `hAfWp…png`, `BpFOb…png`, `xyalo…png`, `2bMxf…png`, `63qDq…png` | 786–1179 wide | app screens | "Ditto app: appointment summary" / "…questions to ask" / "…Loved Ones" / "…Care Circle invite" |
| `YlYIbfFEujexwgWABDzpsRlY.webp` | 722×1470 | iPhone frame | decorative (`alt=""`) |
| `dUb4NW0BMIkpQlu94j5GdzkXPM.png` | 1179×2556 | CTA screen | "Ditto app recording an appointment" *(replaces "Weather app image")* |
| `NgRBnNbQESh21gU58OOjeueuU.png` | 1435×1520 | CTA shape | decorative |
| `9xN2gvKJAMaPyi2Mozl9ruGys.png`, `0j7Evq9e8ivOaBcfwDdYYpAd08.png` | ~2300 wide | video posters | used as poster; video `aria-label` "Henriëte talks about using Ditto" / "Joke talks about using Ditto" |
| `elvrCykLHCyrq99pGmZbN6RU30.mp4` (2.1 MB), `APsFS58sARABN9wRm5cOuBiSk.mp4` (3.0 MB) | mp4 | testimonial videos | – |
| `VEfMBhxwf3O02sCSa2K8LQsoMmQ.png`, `bZWPecLLyopMW7ecA0WzyplZY.png` | 297×297 | store icons in reviews | "Review from the App Store" / "…Google Play" |
| `11KSG…svg`, `6tTbk…svg` | 40×40 | carousel arrows | buttons get `aria-label` |
| partner logos (6, §6.6) | svg/png/jpeg | partners | organisation name |
| `k7Gtp7PABw7GFFLH8UDh9slMqpc.png` | 3680×2760 | why image | "Hands holding a phone with the Ditto app on a yellow sofa" |
| `TlGVH6PyyjkaXLmZRxMwsvSk.svg` | 32×32 | FAQ icon | decorative |
| `rR6HYXBrMmX4cRpXfXUOvpvpB0.png` | 256×256 | grain tile | decorative |
| `NbAZaHHw19eOLCXCeuMFSKVcNY.png` / `IR5wm2akjyGOzr5iGoW7iYszMLc.png` / `6JMGQ5H5Rfrfhpb9zxePCYWxZM.png` | 64 / 64 / 180 | favicon light / dark / apple-touch | – |
| `Ze3aCExEiIrToAEm72lxT7yumhc.png` | 1200×630 | OG/Twitter image | – |
| fonts: `1oLc4TO3hOXSqPJEyuB5qarBQ.woff2` (Uncut), Inter latin 400/500, Bricolage 500/600 (Google) | woff2 | – | – |

Several originals are huge (up to 8021px / 4.9 MB). The asset script will keep the originals out of the build and emit responsive WebP/AVIF variants (e.g. 640/1024/1600/2400w) for `srcset`, matching or beating Framer's own resizing.

## 9. Content (verbatim, with fixes marked ✎)

- **Hero H1:** Clarity when it matters most
- **Hero sub:** Record every medical appointment. Get a clear summary in language you understand. Share it with the people who matter. Because care is something you carry together.
- **Rating:** ✎ **4.7/5 · 100.000+ users** everywhere (live phone shows 4.9/5 · 75.000 + users; App Store NL currently 4.6 from 421 ratings).
- **Pain title:** Healthcare can feel overwhelming
  - Details fade — You walk out of the appointment and think: "Wait, what did they say?" the more serious the conversation, the harder it is to hold onto.
  - It's hard to keep up — Some health journeys are straightforward. Many aren't. Suddenly there are specialists, letters, test results, scattered across systems, written in language that wasn't meant for you.
  - Everyone wants to know — "How did it go?" Your partner asks. Then your mother. Then your friend. Explaining what happened once is already hard. Repeating it for everyone is exhausting.
- **This is Ditto:** Everything from your doctor's visit, captured, clarified, and shared with the people who care about you.
  - Summarise any medical appointment — Every word from your consultation, waiting for you when you're ready. Listen back, reread, and never lose an important detail again.
  - Prepare for what's next — Ditto suggests questions for your next visit based on what was discussed. You show up ready, your doctor notices.
  - Invite those who matter — Invite the people who matter. They see your summaries, follow your journey, and can actually help. Instead of asking "how did it go?" and getting a half-remembered answer.
- **Success stories:** Henriëte · Uses Ditto for her complex allergies (video) / Jet · Google Play — A Must-Have for Every Parent! — During my pregnancy, I used Ditto to keep track of all my appointments. But when our son was born, it became truly indispensable! Everything the doctor said I could easily read back and share with my partner, so he was always informed. A recommendation for every (expecting) mom! / Els · App Store — This app inventor deserves an award — "This app is brilliant. Super clear. It gives an explanation of medical terms and an overview of what you recorded. Or it can explain medical letters you have scanned. Super ✎**useful**, highly recommended!" / Joke · Uses Ditto at the Physiotherapist (video) / Freek · App Store — Medical Conversation? Use Ditto! — I have been using the Ditto app for several months to keep track of my father's medical journey. Every conversation we have with any medical professional is recorded with this app, summarized, and ensures we have a wonderful report. / Michel · Google Play — Convenient for the Family! — Amazing app, so clear for loved ones and summarizing difficult, lengthy conversations. A true recommendation for anyone with family/friends who need care. Calmly listen back and read what has been said.
  - ✎ also normalise double spaces ("what  you", "I  have").
- **Partners:** Our partners in the medical field — We work closely together with healthcare organisations to help more and more patients across the Netherlands. — [Ditto for professionals]
- **Why Ditto works:** Built for you, with care.
  - Everything in one place — Your GP, your specialist, your midwife. All in one app. Every appointment, every summary, every document. No matter where you get care.
  - Sharing is caring — Your loved ones can receive and share care updates safely, with end-to-end encryption, within Ditto. You stay in control of who's in your Care Circle.
  - Private by design — Your data lives on your device. When Ditto processes a recording, it uses secure EU servers, then deletes it immediately. We can't read your summaries.
  - Built for you — Patient portals are built for hospitals. Ditto is built for you, and the people around you.
- **CTA:** Record your first appointment tomorrow — Download Ditto, create an account in under a minute, and bring it to your next visit. It's free. No trial, no catch.
- **FAQ:** More about Ditto — Answers to common questions about Ditto.
  1. How does Ditto work in practice? — During an appointment, you ask whether you can record the conversation. Afterward, Ditto creates a clear summary you can revisit. You can also take photos of medical letters to get easy-to-understand explanations.
  2. When should I use Ditto? — Use Ditto before, during, and after appointments, especially when you want to remember details, understand medical language, or share information with people you trust.
  3. How do I share summaries with loved ones? — You can securely share your summaries via Ditto Loved Ones directly within Ditto. This uses end-to-end encryption. You can also use messaging apps. You decide what to share and with whom.
  4. What happens to my recordings and information? — Your data is stored securely and only on your device. You stay in control of your information.
  5. Is Ditto free to use? — Yes. Ditto is currently available for free to download and use.
  6. Can Ditto help if I don't speak the language well? — Yes. Ditto translates medical documents and explanations into language you can understand, helping bridge communication gaps.
- **Footer:** as §6.10; support@ditto.care, +31 85 115 5421, © 2026 Ditto Care.

## 10. Links

| Label | Target (absolute, per decision) |
|---|---|
| Download App / App Store / Google Play | `https://dittocare.go.link/kMQxf` |
| Logo | `https://www.dittocare.com/` |
| Professionals / Ditto for professionals | `https://www.dittocare.com/professionals` |
| About / Privacy / News / Support | `…/about`, `…/privacy`, `…/news`, `…/support` |
| Press marquee, footer Press | `…/press` |
| Footer Contact | `…/support` |
| Join us | `https://ditto.homerun.co/?lang=en` |
| EU AI Act / Terms / Privacy Policy | `…/legal/eu-ai-act`, `…/legal/terms-conditions`, `…/legal/privacy-policy` |
| Instagram | `https://www.instagram.com/ditto.care?igsh=MXJjM29od2hpZnJvaQ==` |
| LinkedIn | `https://www.linkedin.com/company/dittocare/` |
| Language: Nederlands | `https://www.dittocare.com/nl/` |
| support@ditto.care / phone | `mailto:support@ditto.care`, `tel:+31851155421` |

## 11. SEO, meta, tracking

- `<title>` **Ditto | Care. Clarified**
- description / og:description / twitter:description: *Ditto supports patients, loved ones, and professionals by improving clarity, recall, and communication in healthcare conversations.*
- `og:type website`, `og:url` + canonical `https://www.dittocare.com/`, `og:title`/`twitter:title` "Ditto | Care. Clarified", `og:image`/`twitter:image` 1200×630 (self-host), `twitter:card summary_large_image`.
- `hreflang`: en → `/`, nl-NL → `/nl/`, x-default → `/`. `robots: max-image-preview:large`. `google-site-verification: cnEDE-MYuKECuEglxZw32wo8jj9A1_NpSSqGVvjhyhY`.
- Favicons: light/dark PNG via `media="(prefers-color-scheme: …)"`, apple-touch-icon.
- **GTM `GTM-P9R6C66Z`**: head snippet + `<noscript>` iframe. **The Cookiebot consent banner is loaded by this GTM container** (not by the page), so adding GTM brings the consent banner along automatically. Cookiebot may be domain-restricted and not appear on preview domains.
- The live `<html lang>` is `en`.

## 12. Open questions for review

1. **Light Gray (#EBEBEB) benefits container**: map to `pale-horizon` (matches the logo and FAQ containers, but visibly bluer than live) or `light-stone` (closer to live)?
2. **Inferred style names** (⚠ in §4): `heading-2-l`, `heading-5`, `label-14`, `footer-email`, `footer-phone`. Keep these names, or reconnect the Framer MCP so I can read the real ones?
3. **`14 regular` = `14 medium`**: port both names as-is (faithful), or merge into one token?
4. **Language switcher**: port the globe dropdown linking to `/nl/`? (It's live, but the NL page isn't part of this rebuild.)

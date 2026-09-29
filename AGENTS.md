<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Ditto website

The dittocare.com homepage, rebuilt from Framer. `docs/framer-extraction.md` is the spec (layout, text styles, colours, motion, copy, links).

- **Tokens** live in `src/styles.css`. Brand colours are utilities (`bg-deep-current`, `text-ditto-midnight`, …). Breakpoints match Framer: phone is the base, `md` = tablet (810px), `lg` = desktop (1200px). Framer text styles are utilities: `text-heading-1-s`, `text-heading-2-m`, `text-body-16-medium`, `text-label-14`, … Use these, not raw font sizes.
- **Sections** are in `src/components/home/`, one file per section, with the copy written inline. Shared pieces (Button, Picture, PhoneMockup, Reveal, WordReveal, Grain, …) are in `src/components/site/`.
- **Images**: add the file to `scripts/assets/manifest.json`, run `node assets/fetch-assets.mjs` from `scripts/`, then render it with `<Picture name="…" />`. It serves responsive WebP from `public/assets/`.
- **Checking against live**: from `scripts/`, run `node extract/compare.mjs <outDir> "<heading text>"` with the dev server running. It prints side-by-side screenshots and every text element whose position, font or colour differs from dittocare.com.

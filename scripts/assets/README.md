# Asset pipeline

`manifest.json` lists every Framer asset the homepage uses. `fetch-assets.mjs` downloads the originals into `.cache/framer/` (gitignored), then:

- writes raster images to `public/assets/<name>-<width>.webp` at a width ladder up to the entry's `max`;
- copies SVG, MP4, favicons, the OG image and fonts to the path given as `name`;
- regenerates `src/lib/images.gen.ts`, which `<Picture>` uses for `srcset` and intrinsic size.

Run from `scripts/` after `bun install`: `node assets/fetch-assets.mjs`. To add an image, add a manifest entry, re-run, and commit the outputs.

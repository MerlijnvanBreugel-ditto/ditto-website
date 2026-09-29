# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Ditto website

This is the dittocare.com homepage, rebuilt from Framer. It aims to look and move exactly like the live page at 1440, 810 and 390px.

- `docs/framer-extraction.md`: the spec extracted from Framer and the live site.
- `src/components/home/`: one component per section, in page order (see `src/routes/index.tsx`).
- `src/styles.css`: brand colours, breakpoints and the Framer text styles.
- `scripts/`: dev tooling, not part of the site. The asset pipeline is in `scripts/assets/` and the live capture and comparison tools are in `scripts/extract/`. Run `bun install` in `scripts/` first.

Links to other pages point at the live site (www.dittocare.com). Google Tag Manager, and with it the Cookiebot banner, only loads on dittocare.com hostnames.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

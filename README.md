# Reese Roofing (Portfolio Demo)

**Reese Roofing is a fictional company, and this is not a real business's website.** It's a portfolio piece by [techgeek.support](https://techgeek.support/): one of two website mockups designed for a client, who chose the other one. This one is kept as a proof of work and linked from techgeek.support's portfolio.

Live at [reese-roofing.netlify.app](https://reese-roofing.netlify.app/). Its phone number (a 555-01xx number), email (an `.example` domain), address, stats, and history are all placeholders, so nothing on it should be read as a real roofer's details.

## Search and AI visibility

Since the company isn't real, the site is set up to stay out of search results and AI answers, and to say what it is wherever it's read:

- **Kept out of search:** a `noindex` robots meta tag on every page and an `X-Robots-Tag: noindex` header on every file (`public/_headers`), with no sitemap. `public/robots.txt` lets search crawlers in so they can read the `noindex`, and disallows AI training and AI answer crawlers.
- **Says it's a demo:** the page title, description, Open Graph and Twitter card tags, and the 1200x630 preview card (`public/og-image.png`) all call it a portfolio demo by techgeek.support, so shared links preview honestly. A line in the footer says the company is fictional.
- **No business data:** the JSON-LD structured data describes a `WebSite` about a fictional company, with no `LocalBusiness` type, address, or phone.

`npm run test:seo` checks all of this in Chromium, Firefox, and WebKit.

## Stack

- **Node.js** 22.22 or newer (React Router 8 and Vite 8 require it)
- **Vite 8** dev server / bundler
- **React 19** + **TypeScript 6**
- **React Router 8** (set up for future expansion: it currently routes `/` to Home and everything else to a 404)

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Tests

```bash
npm test                    # every suite
npm run test:accessibility  # axe-core plus scripted keyboard, naming, reflow, and motion checks
npm run test:seo            # head tags, structured data, robots.txt, _headers, and the preview image
```

Each suite runs in Chromium, Firefox, and WebKit against its own dev server on port 5191. Reports land in `tests/output/` (git-ignored).

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── assets/            Images and fonts shared by 2+ pages (logo-mark.svg, fonts/)
├── pages/
│   ├── home/          Home page and its sections (Hero, Services, About, Contact), each with its own .module.css, plus logo-full.svg
│   └── not-found/     404 page and its .module.css
├── ui/                Shared components (Nav, Footer), each with its own .module.css
├── styles/            fonts.css (@font-face) + styles.css (design tokens and base element styles)
├── app.tsx            React Router setup
└── main.tsx           Entry point
```

## Design notes

- **Type pairing:** Fraunces (display serif, optical-size aware) paired with Inter Tight (refined sans). Italic Fraunces accents pull the design together.
- **Palette:** Warm off-white paper (`#f5f2ec`), deep ink (`#1a1f24`), and a navy accent (`#1f4e7a`) drawn from the logo. Italic display accents and small details (numbered IDs, list bullets, pull quote marks) all use this brand navy so the design feels native to the logo.
- **Layout:** Editorial grid, generous negative space, hairline dividers, numbered sections (01–04). Hover states are intentional but never showy.
- **Logo usage:**
  - The **full logo** (`src/pages/home/logo-full.svg`) anchors the hero as the primary visual, doubles as a "seal" in the sticky left column of the About section, and appears on a paper-colored signature card in the Contact section. It's a two-color SVG (navy mark + grey subtext).
  - The **simple mark** (`src/assets/logo-mark.svg`) is used in the nav bar and the footer.
  - The **favicon** uses an SVG (`/public/favicon.svg`), a centered, padded version of the simple mark, with raster `.ico` and PNG fallbacks (16/32/192/512) plus a 180×180 Apple touch icon on a paper-colored background.
  - All logos are vector SVG: crisp at any size, tiny payloads, and the brand navy `#1f4e7a` is set as the `fill` attribute so you can edit it directly in the SVG files if you ever want a different color treatment.

## Customization checklist

If this design is ever reused for a real business, update the placeholders below, and swap the demo SEO for real local SEO: remove the `noindex` meta tag, `public/_headers` rule, and AI crawler block, add a sitemap, replace the `WebSite` JSON-LD with `LocalBusiness` (`RoofingContractor`) data matching the real details, rewrite the title, description, social tags, and preview card, and drop the footer's demo line.

- **Phone number:** `(785) 555-0199`. Search the repo for it; it appears in the Nav, Contact, and Footer areas
- **Email:** `hello@reeseroofing.example`. Same; it appears in Contact and the mailto form action
- **Address:** placeholder Lawrence, KS 66044, in the Contact section
- **Stats in Hero:** 17+ years, 400+ roofs, etc. Replace them with real numbers
- **Services list:** edit the `SER_RCD_ARR` array in `src/pages/home/services.tsx`
- **About copy & quote:** `src/pages/home/about.tsx`
- **Form backend:** the form currently uses `mailto:` as a no-backend fallback. To wire up a real backend, replace the `subForFun` handler in `src/pages/home/contact.tsx` with a `fetch` POST to your endpoint (Formspree, Netlify Forms, your own API, etc.).

## Routing

The router is set up so you can easily add pages later (e.g. `/services/tpo-roofing`, `/projects`, `/blog`) without restructuring. Add a `<Route>` in `src/app.tsx` and a new folder under `src/pages/` holding the page and its own components.

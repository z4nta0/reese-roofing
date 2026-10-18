# Reese Roofing (Portfolio Demo)

**Reese Roofing is a fictional company, and this is not a real business's website.** It's a portfolio piece by [techgeek.support](https://techgeek.support/): one of two website mockups designed for a client, who chose the other one. This one is kept as a proof of work and linked from techgeek.support's portfolio.

Live at [reese-roofing.netlify.app](https://reese-roofing.netlify.app/). Its phone number (a 555-01xx number), email (an `.example` domain), address, stats, and history are all placeholders, so nothing on it should be read as a real roofer's details.

## Search and AI visibility

Since the company isn't real, the site is set up to stay out of search results and AI answers, and to say what it is wherever it's read:

- **Kept out of search:** a `noindex` robots meta tag on every page and an `X-Robots-Tag: noindex` header on every file (`public/_headers`), with no sitemap. `public/robots.txt` lets search crawlers in so they can read the `noindex`, and disallows AI training and AI answer crawlers.
- **Says it's a demo:** the page title, description, author tag (naming techgeek.support), Open Graph and Twitter card tags, and the 1200x630 preview card (`public/og-image.png`) all call it a portfolio demo by techgeek.support, so shared links preview honestly. A line in the footer says the company is fictional, linking to techgeek.support.
- **No business data:** the JSON-LD structured data describes a `WebSite` about a fictional company, with no `LocalBusiness` type, address, or phone.

`npm run test:seo` checks all of this in Chromium, Firefox, and WebKit.

The preview card is drawn from the site's own logo and fonts by `design/og-image/card.html` and captured by `npm run og-image`, which writes `public/og-image.png` and fails if it reaches WhatsApp's 300 KB limit. Everything on it sits inside the center square, since some apps crop previews to one. Apps cache previews for a long time, so a changed card should get a new filename, with the `og:image` and `twitter:image` tags updated to match.

## Security headers

`public/_headers` also sends the hardening headers a header security checker looks for on every response: a strict Content-Security-Policy (the site loads only its own files, plus `data:` images for the inlined logo mark and the form's select arrow), HSTS, `nosniff`, a deny on framing, a Referrer-Policy that shows linked sites only this site's origin, and a Permissions-Policy that turns off every browser feature the site doesn't use. Netlify applies them on the live site. `npm run test:seo` checks the file sends each one, once, and `npm run test:production` serves the build under them and checks the pages raise no policy violation.

## Stack

- **Node.js** 22.22 or newer (React Router 8 requires it)
- **Vite 8** dev server / bundler
- **React 19** + **TypeScript 6**
- **React Router 8** (set up for future expansion: it currently routes `/` to Home and everything else to a 404)
- **ESLint 9** with typescript-eslint, and **Playwright** with axe-core for the test suites
- Deployed on **Netlify**, which serves `index.html` for every path (`public/_redirects`) so the router can show the 404 page

Section links scroll to their section without putting a hash in the address bar, while a Ctrl, Cmd, or middle click still opens the section in a new tab (`src/ui/section-link.ts`).

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Checks

```bash
npm run lint       # ESLint across the repo
npm run typecheck  # TypeScript across src/, the configs, tests/, and design/
```

## Tests

```bash
npm test                    # every suite
npm run test:accessibility  # axe-core plus scripted keyboard, naming, reflow, and motion checks
npm run test:interaction    # hover, press, and focus feedback on every control and form field, the drawer's and sent label's real motion, plus hash-free section links, their /#section addresses, and new tabs, the bar's scrolled style, the drawer, the form, and the 404 page
npm run test:production     # the production build served with Netlify's headers: no security policy violations, and a compacted page
npm run test:rendering      # full-page screenshots of each page state against approved baselines
npm run test:responsive     # both pages and the drawer from 320 to 1,920px: no sideways scroll, spill, overlap, or uneven card rows
npm run test:seo            # head tags, structured data, reserved phone and email details, the footer's demo notice and builder link, robots.txt and no sitemap, _headers (robots and security), _redirects, and the preview image
```

Each suite runs in Chromium (as Chrome's full headless mode), Firefox, and WebKit against its own dev server on port 5191 (the production suite serves its own build instead), so a dev server already running on 5173 is left alone. Reports land in `tests/output/` (git-ignored); `npx playwright show-report tests/output/report` opens the HTML report. The rendering suite's approved screenshots live in `tests/rendering/baselines/` and match to the pixel, so after a change meant to alter how a page looks, review the diff in the report, then run `npm run test:rendering -- --update-snapshots` and commit the new baselines with the change. The baselines were captured on Linux, and font rendering differs between systems, so on macOS or Windows refresh them locally before relying on the comparison. If a browser is missing, `npx playwright install chromium firefox webkit` installs all three.

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
├── ui/                Shared components (Nav, Footer), each with its own .module.css, and section-link.ts, the hash-free section link handler
├── utils/             App-agnostic helpers (motion.ts, the reduced-motion check)
├── styles/            fonts.css (@font-face) + styles.css (design tokens and base element styles)
├── app.tsx            React Router setup, with app.module.css for the root's container
├── main.tsx           Entry point
└── vite-env.d.ts      Vite's client type declarations
public/                Files served at fixed addresses: favicons, og-image.png, robots.txt, Netlify's _headers and _redirects
tests/
├── accessibility/     axe-core scan and scripted checks
├── interaction/       control feedback and site behavior checks
├── production/        production build checks under the live site's headers
├── rendering/         screenshot comparisons and their baselines/
├── responsive/        layout checks across screen widths
├── seo/               head, structured data, crawler and Netlify file, and preview image checks
├── support/           the page states the suites visit
└── playwright.config.ts
design/
└── og-image/          card.html and the script that captures it as public/og-image.png
```

## Design notes

- **Type pairing:** Fraunces (display serif, optical-size aware) paired with Inter Tight (refined sans). Italic Fraunces accents pull the design together.
- **Palette:** Warm off-white paper (`#f5f2ec`), deep ink (`#1a1f24`), and a navy accent (`#1f4e7a`) drawn from the logo. Italic display accents and small details (numbered IDs, list bullets, pull quote marks) all use this brand navy so the design feels native to the logo.
- **Interaction:** Every hover, press, and focus visibly registers, subtly: buttons lift on hover and press in when held, text links dim while pressed, arrows nudge forward, keyboard focus draws a ring that eases in (navy on paper, light blue on the dark bands), and the contact button's sent label rises in. Reduced motion keeps the changes and drops the movement.
- **Layout:** Editorial grid, generous negative space, hairline dividers, numbered section labels (02 to 04, after the hero). Hover states are intentional but never showy.
- **Logo usage:**
  - The **full logo** (`src/pages/home/logo-full.svg`) anchors the hero as the primary visual, doubles as a "seal" in the About section's sticky left column on wide screens, and appears on a paper-colored signature card in the Contact section. It's a two-color SVG (navy mark + grey subtext).
  - The **simple mark** (`src/assets/logo-mark.svg`) is used in the nav bar and the footer.
  - The **favicon** uses an SVG (`/public/favicon.svg`), a centered, padded version of the simple mark, with raster `.ico` and PNG fallbacks (16/32/192/512) plus a 180×180 Apple touch icon on a paper-colored background.
  - All logos are vector SVG: crisp at any size, with tiny payloads. The brand navy `#1f4e7a` is set as a `fill` attribute in the mark and the favicon, but the full logo also writes it as `rgb(31, 78, 122)` in two paths' `style` attributes, and its grey as both `#6b7079` and `rgb(107, 112, 121)`, so a different color treatment has to change both forms.

## Customization checklist

If this design is ever reused for a real business, update the placeholders below, and swap the demo SEO for real local SEO: remove the `noindex` meta tag, the `X-Robots-Tag` rule in `public/_headers`, and the AI crawler block in `public/robots.txt`, add a sitemap, replace the `WebSite` JSON-LD with `LocalBusiness` (`RoofingContractor`) data matching the real details, rewrite the title, description, social tags, and preview card, and drop the footer's demo line.

- **Phone number:** `(785) 555-0199`. Search the repo for it and for its link form, `+17855550199` (the `tel:` links); both appear in the Nav (bar and drawer) and the Contact section
- **Email:** `hello@reeseroofing.example`. Same; it appears in the Contact section's contact details and in the mailto link the form opens on submit (`subForFun` in `src/pages/home/contact.tsx`)
- **Address and location:** placeholder Lawrence, Kansas 66044, in the Contact section, plus the city in the hero's label and intro, the About heading, the footer's licensing line, and the Contact section's service area list, plus the county in the hero's first stat and the About story. Search the repo for "Lawrence", "Kansas", and "Douglas"
- **Form placeholders:** the sample name, property, email (`jane@company.example`), and phone (`(785) 555-0100`) shown in the contact form's empty fields, in `src/pages/home/contact.tsx`
- **Footer:** the company's legal name, licensing line, and the demo notice in `src/ui/footer.tsx`
- **Stats in Hero:** 17+ years, 400+ roofs, etc. Replace them with real numbers
- **Services list:** edit the `SER_REC_ARR` array in `src/pages/home/services.tsx`
- **About copy & quote:** `src/pages/home/about.tsx`
- **Form backend:** the form currently uses `mailto:` as a no-backend fallback. To wire up a real backend, replace the `subForFun` handler in `src/pages/home/contact.tsx` with a `fetch` POST to your endpoint (Formspree, Netlify Forms, your own API, etc.). The Content-Security-Policy in `public/_headers` blocks that until it's updated: change `form-action 'none'` to `'self'` (or the endpoint's origin), and add a `connect-src` naming any outside endpoint the script posts to.

## Routing

The router is set up so you can easily add pages later (e.g. `/services/tpo-roofing`, `/projects`, `/blog`) without restructuring. Add a `<Route>` in `src/app.tsx` and a new folder under `src/pages/` holding the page and its own components.

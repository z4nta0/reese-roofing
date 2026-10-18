# Project CLAUDE.md: reese-roofing

A marketing website for Reese Roofing (React, Vite, React Router, deployed on
Netlify at https://reese-roofing.netlify.app/). **Reese Roofing is not a real
business.** This was one of two mockups made for a client, who kept the other
one; this one is a portfolio piece by techgeek.support, linked from
https://techgeek.support. Nothing in the site, its docs, or its metadata may
present the company as real (see "## SEO"). Every rule in the user-level
CLAUDE.md applies here; this file records only what's specific to this
project.

## SEO
Decided 2026-10-08. Under the user-level "## SEO" rule this is a site that
isn't a real business, so it gets the demo treatment rather than local SEO:
- **Out of search**: a `noindex` robots meta in `index.html`, `X-Robots-Tag:
  noindex` on every file through `public/_headers`, and no sitemap.
  `public/robots.txt` allows search crawlers, so they can read the `noindex`,
  and disallows AI training and AI answer crawlers (GPTBot, ClaudeBot,
  PerplexityBot, and others). AI agents fetching the page for a person are
  left alone, since the page itself tells them it's a demo.
- **Says what it is**: the title, description (between 120 and 125
  characters: mobile cards show 125 in full, and preview checkers flag under
  120 as short), Open Graph and Twitter tags, and `public/og-image.png`
  (1200x630) call it a portfolio demo by techgeek.support, the author meta
  names techgeek.support, and the footer says the company is fictional,
  linking to techgeek.support. The 404 page renders its own `<title>`.
- **Social preview card**: per the user-level "## Social Previews" rule,
  `design/og-image/card.html` (outside the served tree) is captured by `npm
  run og-image` (`design/og-image/render.mts`, type checked through
  `tsconfig.test.json`, since it drives a browser) into `public/og-image.png`,
  with every element inside the center 630x630 square. The card imports the
  site's `fonts.css` and `styles.css` and reads their tokens; only its
  1200x630 size, its 40px lines, their 1.2 line height and weights, and the
  title's -0.01em letter spacing stay literal, since the scale has no step
  within 10% of them.
- **Canonical in `index.html`** (decided 2026-10-17): the site counts as a
  one-page site for the canonical rule, since its only other route is the
  `noindex` 404 page, so the canonical stays in `index.html` and the 404 page
  reports the home page's, which the SEO suite checks.
- **Structured data**: one `WebSite` JSON-LD block about a fictional company,
  created by techgeek.support. Never `LocalBusiness`, an address, or a phone.
- **Placeholders stay reserved**: the phone is a 555-01xx number and the
  email an `.example` domain, and so are the contact form's sample phone
  and email (added 2026-10-17, with a sample name and property).
- **Security headers** (added 2026-10-17): `public/_headers` also sends the
  same hardening block as the sibling sites (a strict Content-Security-Policy,
  HSTS, nosniff, a framing deny, and the referrer and permissions policies),
  which a header checker found missing. Its CSP allows `data:` images, since
  Vite inlines the small logo mark SVG as a data URI and the select arrow is
  one; form-action is `'none'`, since the form only opens a mailto link.
  Checked by `npm run test:production`, which serves the built site under
  the policy in all three engines.
- **Checked by** `npm run test:seo`, which also reads the raw page without a
  browser for the home title and description, and checks every route has one
  description within the bounds. No off-site work (Business Profile,
  listings, reviews) applies.

## Directory structure
Decided 2026-10-07. Adapts the user-level "### Directory structure" layout to a
website with routes rather than a web app with tabs.
```
src/
  main.tsx               entry point
  app.tsx                React Router setup, styled by app.module.css
  vite-env.d.ts          Vite's client type declarations
  assets/                images and fonts used by 2 or more pages
  pages/
    home/  not-found/    one folder per route
  ui/                    components and helpers used by 2 or more pages (Nav,
                         Footer, the section link helper)
  utils/                 app-agnostic pure helpers (the reduced-motion check)
  styles/                global CSS only (fonts.css, styles.css)
```
Outside `src/` (added 2026-10-08): `tests/` holds the Playwright suites (see
"## Test suites"), and `design/` holds source artwork that isn't served,
so far the social preview card (see "## SEO").
- **`pages/` takes the place of `tabs/`.** Each route gets its own folder,
  and a component only that page uses (Home's Hero, Services, About, and
  Contact sections) lives in that folder. When a section becomes a route of
  its own, it moves to its own `pages/<name>/` folder, and anything it now
  shares with another page (e.g. `logo-full.svg`) moves to the shared folder
  that fits it.
- **A page's main file is named after its folder, with no prefix**
  (`pages/home/home.tsx`, not `page-home.tsx`). The `tab-` exception in the
  user-level rules exists so a quick-open search lands on a tab's main file;
  here the file already shares its folder's name, so a search finds it
  without one.
- **Nav and Footer live in `ui/`**, since the 404 page will use them too.

## Naming and formatting decisions
Project-only decisions on top of the user-level naming and formatting rules.
- **Scrim is `sci`** (decided 2026-10-17): the nav component already uses
  `scr` for Scroll (`scrPasBoo`, `onScrWinFun`), so the drawer's scrim takes
  `sci` instead (`navSciDiv`, `sciDivRef`, `sciDivEle`), keeping the two
  apart within one component. The user-level color role `--scr-mai-col`
  keeps its standard name, since the role names are the same in every
  project.
- **Subject is `suj`** (decided 2026-10-18): the contact form's submit
  handler already uses `sub` for Submit (`subForFun`, `subEveObj`), so the
  email's subject takes `suj` instead (`sujEncStr`), keeping the two apart
  within one function.
- **The About principle rows stay aligned** (decided 2026-10-07, confirmed
  2026-10-17): `PRI_REC_ARR`'s one-line rows open with a prose-length
  `bodStr`, but the rows' lengths are close enough that the fields after it
  stay column-aligned rather than stopping before it.

## Cleanup plan
Decided 2026-10-07, on the `code-cleanup` branch, after the directory
reorganization, ESLint setup, config rebuild, and dependency upgrades.
1. **Formatting pass** (done 2026-10-07), one file per commit, each brought
   fully in line with the user-level rules (naming, comments, spacing,
   imports, exports, JSDoc and regions). Order:
   1. Config and root files: `vite.config.ts`, then `index.html` (under
      "### HTML"). `eslint.config.ts`, the `tsconfig` files, `package.json`,
      and `public/_redirects` already follow the rules.
   2. `src/` from the bottom of the dependency order up: `main.tsx`,
      `app.tsx`, `ui/` (`nav.tsx`, `footer.tsx`), then `pages/`
      (`not-found/`, then `home/`'s sections and `home.tsx`).
2. **CSS module pass** (done 2026-10-07): each component's `.css` becomes a
   `.module.css` next to it, per "### CSS modules and JS hooks".
3. **Design-system pass** (done 2026-10-07): custom properties renamed and
   moved onto tokens, per "### Custom property naming", with horizontal sizes
   decided below.
4. **404 page** (done 2026-10-07): rebuilt with Nav and Footer from `ui/`,
   written to the rules from its first line.
5. **Full rule audit** (done 2026-10-07): repeated passes until clean.

## Test suites
Added 2026-10-08. Playwright suites live in `tests/`, one project per suite
and engine in `tests/playwright.config.ts`, which starts its own dev server on
port 5191 (never the usual 5173) and stops it afterwards. Every suite runs in
Chromium, Firefox, and WebKit. Chromium runs as Chrome's full headless mode
(`channel : 'chromium'`, decided 2026-10-17) rather than Playwright's default
headless shell, which, with every engine busy, sometimes opened a Ctrl or
middle click's new tab without Playwright ever reporting it, failing about 1
run in 10; the full mode reported it in all 240 runs tried. Results,
screenshots, and traces go to `tests/output/` (git-ignored); `npx playwright
show-report tests/output/report` opens the HTML report. The states each suite
visits (both pages at 390px and 1440px, plus the open drawer) are listed in
`tests/support/states.ts`; the responsive suite opens its own widths through
the same helper, and the seo suite reads the head of each route instead.
- `npm run test:accessibility`: the pre-commit accessibility scan. axe-core
  checks each state against WCAG 2.2 A and AA plus best practices
  (`axe.spec.ts`), and scripted checks (`scripted.spec.ts`) cover link and
  button names, a Tab walk (order, traps, focus on screen, uncovered, and
  visible), reflow at 320px, and motion under reduced motion, while each state
  opens, the drawer closes, and the sent form's label swaps in. The keyboard
  walk runs under reduced motion so smooth scrolling and focus transitions have
  finished when a stop is measured. axe's "needs review" results are printed
  and attached to the report rather than failing the run.
- `npm run test:interaction`: checks the interaction feedback rule on every
  state (every reachable link and button changes on hover and on press, has a
  transition longer than zero, and transitions its focus ring, every form field
  changes when focused and has a transition longer than zero, the first
  keyboard stop, or the control a state's action left focused, draws a 2px
  ring, the brand link, which the Tab order skips, changes on hover and on
  press, the drawer and its scrim really transition open and closed and the
  sent label rises in, and reduced motion keeps the changes with no
  transitions), then the site's behavior: the section, Home, hero, estimate,
  back to top, and logo links (landing on their targets without ever putting a
  hash in the address, each section link's address naming the home page's path,
  and a Ctrl, Cmd, or middle click opening a section in a new tab, and a Ctrl
  or Cmd click on a drawer link leaving the drawer open), the bar's scrolled
  style, every way the drawer opens and closes, the contact form's sent label
  and mailto link (the mailto test is Chromium-only, through the DevTools
  Protocol), and the 404 page, whose Return home opens the home page at its top
  and whose estimate, section, and Home links reach their targets, all inside
  the router without a full page load, and whose back to top scrolls the 404
  page itself.
- `npm run test:production`: builds the site once per engine into
  `tests/output/build-<engine>/` and serves the build through Playwright's
  request routing with every header the site-wide `_headers` blocks set and
  the `_redirects` fallback, since the dev server applies neither. The home
  page and the 404 page at desktop size, and the home page at phone size with
  the drawer open, must each render with no Content-Security-Policy
  violation, and the built `index.html` must ship compacted, as vite.config's
  minifier promises: no comments, indentation, or blank lines, and its JSON-LD
  valid on one line. Added 2026-10-18.
- `npm run test:rendering`: compares a full-page screenshot of every state
  with its baseline in `tests/rendering/baselines/`, with zero tolerance,
  since each engine renders identically from run to run here and even a
  0.1% tolerance hid the nav links moving. The footer's year is masked.
  After an intended visual change, refresh with `npm run test:rendering --
  --update-snapshots` and commit the baselines with it. Baselines are
  captured on Linux.
- `npm run test:responsive`: measures the home page, the 404 page, and the
  open drawer at 21 widths from 320 to 1,920px (a pixel either side of each
  breakpoint included), failing on sideways scrolling, an element past either
  edge (unless it's decoration an ancestor clips, like the hero's grid), text
  spilling its box, two reachable controls overlapping, or a card grid leaving
  uneven rows (the hero stats, the services, and the principles), apart from
  the Card Grids rule's single centered card, kept at the others' width. It
  found the bar's links running into the phone number just above the drawer
  breakpoint, fixed by returning the links to the bar's flex row.
- `npm run test:seo`: checks each route's title, description, robots,
  canonical, social tags, and structured data, that every phone and email it
  shows is a reserved one, the footer's demo line and its techgeek.support
  link, `robots.txt` and that no `sitemap.xml` is served, `_headers` (its
  robots rule and every security header, each set once), `_redirects`' fallback
  to the app, and the preview image's size.
- `npm test` runs every suite.

Next (planned 2026-10-07):
- **Accessibility** (done 2026-10-08): an audit and fixes across both pages.
- **SEO** (done 2026-10-08): set up for a demo site, per "## SEO" above.
- **Reusable tests** (started 2026-10-08): a suite to rerun after large
  changes, checking that every page renders and behaves correctly in all
  three browser engines. Done 2026-10-08: the accessibility, interaction,
  rendering, responsive, and seo suites.

Applied original intent (kept by the user, 2026-10-07): the CSS module pass
found styles that were written but never rendered, because a later global
rule overrode them. Each was applied as its own commit:
- `c15eee8`: the navigation bar's compact estimate button.
- `35cc127`: the hero's extra top padding and lighter bottom padding.
- `72390da`: the hero stat numbers' line height and letter spacing.
- `6c97153`: the about story's bottom margin before the principles.
- `a39b331`: the contact heading's soft accent italic word.
- `281265f`: the paper contact submit button on the dark band.
- `8a5f993`: the mobile drawer's open and close animation (made cross-browser
  in a later commit).

Horizontal sizes (decided 2026-10-07): after comparing both options from the
user-level "Width is decided per project" rule, the user chose the
viewport-based horizontal rhythm, ease-my-life's `--hor-rhy-*` tokens, but only
for layout values; everything inside a component stays on fixed rem steps. The
split:
- **Fluid (horizontal rhythm)**: layout values only, the gutter, the column
  gaps between section columns and between grid cards (the services,
  principles, hero bottom row and stats, footer, and contact rows and form
  fields), the contact label column, the side padding of the contact signature
  card, the form panel, and the 404 page's main column, and the logos. Each is
  a `clamp()` between two `--spa-hor-*` (or rhythm width) steps, so it never
  shrinks below a workable size on a phone or grows past its step on a very
  wide screen. The logos use `max()` with a rhythm step floor instead, since
  their column already caps them.
- **Fixed (rem steps)**: everything inside a component, small gaps, the
  service cards' and the quote's padding, the nav mark and menu lines, the
  eyebrow lines. Gaps and padding read `--spa-hor-*`, widths a vertical rhythm
  step times `1rem`. The 4px arrow nudge stays literal, since no step lands
  within 10% of it.
- **Content column**: capped at a fixed `1920px / ρ` (about 1449.4px), so below
  that width only the gutter limits it.
- **Buttons**: height comes from line height alone, the p04 rhythm step times
  `1rem` (about 44.9px), with no top or bottom padding, and side padding
  clamped between two spacing steps. The user chose it over Ease My Life's
  33.9px, which read too short here.

Design system choices (decided 2026-10-07):
- **Base and body size**: 1rem is the 11px base, and body text is Base Plus 1
  (about 14.57px), as in ease-my-life.
- **Font roles**: Inter Tight is `--fon-fam-mai`, and Fraunces (headings,
  numbers, the brand name, accents) is `--fon-fam-sec`. Inter Tight averages
  about 2.34 characters per em, so the text width tokens use the same powers
  as ease-my-life.
- **Breakpoints**: 500, 540, 600, 640, 880, and 960px, measured against the
  `app` container on AppRooCom's root element.

Section links (decided 2026-10-17, matching tonys-toppers and hair-designs):
every link to a home page section keeps its real `/#section` address but goes
through `ui/section-link.ts`'s `secCliFun`, which leaves a Ctrl, Cmd, Shift,
Alt, or middle click to the browser and otherwise scrolls to the section (or,
from the 404 page, navigates home to it) without a hash. The home page clears
any hash it arrives with once it has scrolled to it. Unlike hair-designs', the
helper scrolls in place only on the home page path, since the 404 page has a
`top` anchor of its own; the footer's back to top link scrolls to whichever
page's `top` is showing through its own handler.

Scroll position (decided 2026-10-17, following hair-designs' recorded
exception): the 404 page makes this a two-route site, but `useScrTopFun` from
the user-level "## Multi-Page React Sites: Scroll Position" rule is left out.
Every in-site link off the 404 page goes through `secCliFun` with a section
hash (Return home to `/#top`, the estimate button to `/#contact`, the bar's
links to theirs), which the home page scrolls to on arrival, except the bar's
brand link, a plain `href='/'` anchor whose full page load opens the home page
at its top. So nothing navigates inside the router to another page without a
hash, the one case the hook covers. The hook would also fight the home page's
hash clearing, a REPLACE with no hash, which it would answer by jumping to the
top. Return home was a plain `Link` until this audit, which opened the home
page as far down as a scrolled 404 page; the interaction suite now checks it
lands at the top. If a hash-free router link between pages is ever added, the
hook comes in with a guard that skips the hash-clearing REPLACE.

Node on Netlify (confirmed 2026-10-08): the live site builds on Node 24.x,
which meets React Router 8's minimum of 22.22.

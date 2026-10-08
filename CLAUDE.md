# Project CLAUDE.md: reese-roofing

A marketing website for Reese Roofing (React, Vite, React Router, deployed on
Netlify). The client chose a different site, so this one is kept as a proof of
work. Every rule in the user-level CLAUDE.md applies here; this file records
only what's specific to this project.

## Directory structure
Decided 2026-10-07. Adapts the user-level "### Directory structure" layout to a
website with routes rather than a web app with tabs.
```
src/
  main.tsx               entry point
  app.tsx                React Router setup
  vite-env.d.ts          Vite's client type declarations
  assets/                images and fonts used by 2 or more pages
  pages/
    home/  not-found/    one folder per route
  ui/                    components used by 2 or more pages (Nav, Footer)
  styles/                global CSS only (fonts.css, styles.css)
```
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
4. **404 page**: rebuilt with Nav and Footer from `ui/`, written to the rules
   from its first line.

Applied original intent (kept by the user, 2026-10-07): the CSS module pass
found styles that were written but never rendered, because a later global
rule overrode them. Each was applied as its own commit:
- `c15eee8`: the navigation bar's compact estimate button.
- `35cc127`: the hero's extra top padding and lighter bottom padding.
- `72390da`: the hero stat numbers' line height and letter spacing.
- `6c97153`: the about story's bottom margin before the principles.
- `a39b331`: the contact heading's soft accent italic word.
- `281265f`: the paper contact submit button on the dark band.
- `8a5f993`: the mobile drawer's open and close animation (made
  cross-browser in a later commit).

Horizontal sizes (decided 2026-10-07): after comparing both options from the
user-level "Width is decided per project" rule, the user chose the
viewport-based horizontal rhythm, ease-my-life's `--hor-rhy-*` tokens, but only
for layout values; everything inside a component stays on fixed rem steps. The
split:
- **Fluid (horizontal rhythm)**: layout values only, the gutter, the column
  gaps between section columns, the contact label column, and the logos. Each
  is a `clamp()` between two `--spa-hor-*` (or rhythm width) steps, so it never
  shrinks below a workable size on a phone or grows past its step on a very
  wide screen. The logos use `max()` with a rhythm step floor instead, since
  their column already caps them.
- **Fixed (rem steps)**: everything inside a component, small gaps, card and
  quote padding, the nav mark and menu lines, the eyebrow lines. Gaps and
  padding read `--spa-hor-*`, widths a vertical rhythm step times `1rem`. The
  4px arrow nudge stays literal, since no step lands within 10% of it.
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

Open item: the live Netlify site keeps the Node version it was pinned to
when it was created, and React Router 8 needs Node 22.22 or newer to build.
Confirm the site's Node version before this branch is merged and deployed.

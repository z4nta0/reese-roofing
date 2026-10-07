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
1. **Formatting pass**, one file per commit, each brought fully in line with
   the user-level rules (naming, comments, spacing, imports, exports, JSDoc
   and regions). Order:
   1. Config and root files: `vite.config.ts`, then `index.html` (under
      "### HTML"). `eslint.config.ts`, the `tsconfig` files, `package.json`,
      and `public/_redirects` already follow the rules.
   2. `src/` from the bottom of the dependency order up: `main.tsx`,
      `app.tsx`, `ui/` (`nav.tsx`, `footer.tsx`), then `pages/`
      (`not-found/`, then `home/`'s sections and `home.tsx`).
2. **CSS module pass**: each component's `.css` becomes a `.module.css`
   next to it, per "### CSS modules and JS hooks".
3. **Design-system pass**: custom properties renamed and moved onto tokens,
   per "### Custom property naming". Horizontal sizing has to be decided with
   the user first, per "Width is decided per project".
4. **404 page**: rebuilt with Nav and Footer from `ui/`, written to the rules
   from its first line.

Open item: the live Netlify site keeps the Node version it was pinned to
when it was created, and React Router 8 needs Node 22.22 or newer to build.
Confirm the site's Node version before this branch is merged and deployed.

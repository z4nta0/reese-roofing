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
  assets/                images used by 2 or more pages
  pages/
    home/  not-found/    one folder per route
  ui/                    components used by 2 or more pages (Nav, Footer)
  styles/                global CSS only (styles.css)
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
- **`vite-env.d.ts` stays at the `src/` root**, where Vite's template puts
  it. It's an ambient type declaration file, so nothing imports it.

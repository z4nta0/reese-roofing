


// #region Imports

import react from '@vitejs/plugin-react'; // What: React. Why: Vite needs the React plugin to compile JSX. How: This is called in the plugins array.


import { defineConfig } from 'vite'; // What: Define Config. Why: Vite's config helper passes the config through with its types. How: This wraps vitConObj.

// #endregion Imports



/**
 * vite.config.ts = Vite Config
 *
 * @summary
 * The build and dev server config. The site only needs React's JSX compiled,
 * so the config holds nothing but the React plugin, and every other setting
 * stays at Vite's default. Files in public/ (the favicons and Netlify's
 * _redirects) are copied into the build untouched by that default.
 *
 * Sections:
 *  - Constants
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const vitConObj = defineConfig({ plugins : [ react() ] }); // What: Vite Config Object. Why: Vite reads its whole configuration from this file's default export. How: This builds the config with the React plugin as its only plugin.

// #endregion Constants



// #region Exports

export default vitConObj; // What: Default Export. Why: Vite reads its config from this file's default export. How: This exports vitConObj.

// #endregion Exports



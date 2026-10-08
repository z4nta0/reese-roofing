


/**
 * vite-env.d.ts = Vite Environment Declarations
 *
 * @summary
 * Pulls in Vite's client types, which describe what Vite adds to the browser
 * code it builds: imports of assets and CSS modules, which resolve to a URL
 * or a class name object, and import.meta.env. Vite's template puts this
 * file at the src/ root, where it stays; nothing imports it, since
 * TypeScript reads every declaration file the project includes.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



/// <reference types="vite/client" /> // What: Vite Client Types Reference. Why: Asset, stylesheet, and CSS module imports need types TypeScript doesn't know on its own. How: This triple-slash directive loads vite/client's declarations, its value double-quoted as the directive syntax expects.



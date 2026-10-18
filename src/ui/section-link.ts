


// #region Imports

import { redMotFun   } from '../utils/motion.ts'; // What: Reduce Motion Function. Why: A section link's smooth scroll has to respect the reduced-motion preference. How: visSecFun asks it before choosing the scroll behavior.
import { useLocation } from 'react-router';       // What: Use Location. Why: A section link scrolls in place only on the home page. How: This reads the current path.
import { useNavigate } from 'react-router';       // What: Use Navigate. Why: A section link on any page but the home page has to take the visitor home first. How: This returns the router's navigate function.

// #endregion Imports



/**
 * section-link.ts = Section Link
 *
 * @summary
 * The one way the bar, its drawer, the hero, and the 404 page reach a home
 * page section, from any page. On the home page the section is already there,
 * so the link scrolls to it in place, smoothly unless the visitor asked for
 * reduced motion. On any other page, such as the 404 page, the section doesn't
 * exist yet, so the link navigates to the home page with the section's id as
 * the hash, and the home page scrolls to it on arrival and then clears the
 * hash, so the address bar stays free of hashes either way. Each link keeps
 * its real address (/#about), so a Ctrl, Cmd, Shift, Alt, or middle click is
 * left to the browser, which handles it its own way: a Ctrl, Cmd, or middle
 * click opens the home page at that section in a new tab, a Shift click in a
 * new window, and an Alt click downloads it. Adapted from hair-designs' own,
 * which decides by whether the section's element is on the page; here it
 * decides by the path instead, since the 404 page has a top anchor of its own,
 * and the bar's and drawer's Home links and its Return home button there have
 * to go home rather than scroll to it.
 *
 * Sections:
 *  - Helpers
 *  - Hooks
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Helpers

// #region modCliFun

/**
 * modCliFun = Modified Click Function
 *
 * @summary
 * Whether a click on a section link, or on the footer's back to top link,
 * should be left to the browser: one made with a modifier key held (Ctrl or
 * Cmd to open a new tab, Shift for a new window, Alt to download) or with any
 * button but the main one. Chromium, Firefox, and WebKit send a middle click
 * as auxclick, which never reaches a link's onClick, so the button check only
 * guards an engine that still fires click for one. A link's handler returns
 * early when this is true, so the browser handles the link's own address its
 * usual way, and wherever that opens a home page section's address, the home
 * page scrolls to it.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param cliEveObj - Click Event Object: The link's click event.
 *
 * @returns Whether the browser should handle the click itself.
 * @see {@link modCliBoo}
 *
 * @example
 * ```ts
 * modCliFun(cliEveObj) // => false for a plain click
 * ```
 *
*/

function modCliFun ( cliEveObj : React.MouseEvent< HTMLAnchorElement > ) : boolean {


	const altKeyBoo = cliEveObj.altKey;       // What: Alt Key Boolean. Why: Alt-click downloads the link in some browsers. How: This reads whether Alt was held.
	const conKeyBoo = cliEveObj.ctrlKey;      // What: Control Key Boolean. Why: Ctrl-click opens a new tab elsewhere. How: This reads whether Ctrl was held.
	const metKeyBoo = cliEveObj.metaKey;      // What: Meta Key Boolean. Why: Cmd-click opens a new tab on a Mac. How: This reads whether Cmd was held.
	const othButBoo = cliEveObj.button !== 0; // What: Other Button Boolean. Why: A click with any button but the main one belongs to the browser, though current engines send a middle click as auxclick, which never reaches here. How: This checks the click wasn't made with the main button.
	const shiKeyBoo = cliEveObj.shiftKey;     // What: Shift Key Boolean. Why: Shift-click opens a new window. How: This reads whether Shift was held.

	const modCliBoo = metKeyBoo || conKeyBoo || shiKeyBoo || altKeyBoo || othButBoo; // What: Modified Click Boolean. Why: Any one of these means the visitor asked the browser to handle the link its own way. How: This combines them.



	return modCliBoo; // What: Modified Click Return. Why: The link's handler decides from this whether to step aside. How: This hands back the combined answer.


}

// #endregion modCliFun

// #endregion Helpers



// #region Hooks

// #region useSecLinFun

/**
 * useSecLinFun = Use Section Link Function
 *
 * @summary
 * Returns visSecFun, the function a section link calls with its section's id.
 * On the home page, visSecFun scrolls the section with that id into view,
 * jumping instead of gliding under reduced motion. On any other page, it
 * navigates to the home page with the id as the hash, inside the site
 * without a full page load, where the home page scrolls to it.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The function a section link calls with its section's id.
 *
 * @example
 * ```ts
 * useSecLinFun() // => visSecFun, the function a section link calls with an id
 * ```
 *
*/

function useSecLinFun () : ( secIdeStr : string ) => void {


	const { pathname : patNamStr } = useLocation(); // What: Path Name String. Why: Only the home page holds the sections. How: This reads the current path, renaming the router's pathname key.

	const navRouFun = useNavigate(); // What: Navigate Router Function. Why: A link on another page has to go to the home page. How: This is the router's navigate function.



	return ( secIdeStr : string ) => { // What: Visit Section Function. Why: Every section link shares one way to reach its section. How: This scrolls to the section on the home page, or navigates home with its id as the hash.


		const secCurEle = patNamStr === '/' ? document.getElementById( secIdeStr ) : null; // What: Section Current Element. Why: The section only exists on the home page, and the 404 page's own top anchor mustn't stand in for the hero's. How: This looks it up by its id on the home page, and gives null anywhere else.


		if ( secCurEle ) { secCurEle.scrollIntoView( { behavior : redMotFun() ? 'auto' : 'smooth' } ); return; } // What: In-Page Scroll Guard. Why: On the home page the section is already there. How: This scrolls it into view, jumping instead of gliding under reduced motion, and stops.



		void navRouFun( { hash : secIdeStr, pathname : '/' } ); // What: Home Navigation Call. Why: On any other page the section has to be loaded first. How: This navigates to the home page with the section's id as the hash, and the home page scrolls to it on arrival; void marks the returned promise as deliberately unawaited.


	};


}

// #endregion useSecLinFun



// #region useSecCliFun

/**
 * useSecCliFun = Use Section Click Function
 *
 * @summary
 * Returns secCliFun, the click handler every section link shares. A Ctrl, Cmd,
 * Shift, Alt, or middle click is left to the browser, which handles the link's
 * own address its usual way (a new tab or window, or a download). Any other
 * click stops the browser's own navigation to the hash and hands the section's
 * id to visSecFun, which scrolls to it on the home page or navigates home to
 * it from any other page. It reports whether it handled the click, so a caller
 * such as the bar's drawer can close itself only then.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The click handler, which takes the click event and the section's
 *          id and returns whether it handled the click.
 *
 * @example
 * ```ts
 * useSecCliFun() // => secCliFun, called as secCliFun(cliEveObj, 'about')
 * ```
 *
*/

function useSecCliFun () : ( cliEveObj : React.MouseEvent< HTMLAnchorElement >, secIdeStr : string ) => boolean {


	const visSecFun = useSecLinFun(); // What: Visit Section Function. Why: A plain click reaches its section through the shared path. How: This scrolls to the section on the home page, or navigates home to it.



	return ( cliEveObj : React.MouseEvent< HTMLAnchorElement >, secIdeStr : string ) => { // What: Section Click Function. Why: Every section link handles a click the same way. How: This leaves a modified click to the browser and otherwise cancels the browser's own navigation and visits the section.


		if ( modCliFun( cliEveObj ) ) return false; // What: Modified Click Guard. Why: A Ctrl, Cmd, Shift, or Alt click asks the browser to handle the link its own way, and a middle click never reaches this handler at all. How: This leaves the click alone and reports it unhandled.



		cliEveObj.preventDefault(); // What: Default Navigation Cancel. Why: The browser would otherwise follow the link itself, leaving the hash in the address, and from the 404 page would load the home page in full. How: This stops the link's own navigation.

		visSecFun( secIdeStr ); // What: Section Visit Call. Why: The visitor should land on the section they chose. How: This scrolls to it, or navigates home to it from another page.



		return true; // What: Handled Click Return. Why: The caller may want to react, such as by closing the menu. How: This reports the click handled.


	};


}

// #endregion useSecCliFun

// #endregion Hooks



// #region Exports

export { modCliFun, useSecCliFun }; // What: Named Exports. Why: The bar, the hero, and the 404 page reach sections through these, and the footer's back to top link shares the modified-click check. How: This exports the modified-click check and the shared click handler, while useSecLinFun stays private to the handler that calls it.

// #endregion Exports



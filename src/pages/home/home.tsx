


// #region Imports

import React from 'react'; // What: React. Why: The page scrolls to a linked section once it has rendered. How: This is read as React.useEffect, and as React.JSX.Element for the page's return type.


import { AboSecCom   } from './about.tsx';         // What: About Section Component. Why: The page tells the company's story third. How: This is rendered inside main, after the services.
import { ConSecCom   } from './contact.tsx';       // What: Contact Section Component. Why: The page ends where visitors reach the company. How: This is rendered last inside main.
import { HerSecCom   } from './hero.tsx';          // What: Hero Section Component. Why: The page opens with the headline and pitch. How: This is rendered first inside main.
import { NavBarCom   } from '../../ui/nav.tsx';    // What: Navigation Bar Component. Why: Every page starts with the shared top bar. How: This is rendered above main.
import { SerSecCom   } from './services.tsx';      // What: Services Section Component. Why: The page lists what the company does second. How: This is rendered inside main, after the hero.
import { SitFooCom   } from '../../ui/footer.tsx'; // What: Site Footer Component. Why: Every page ends with the shared footer. How: This is rendered below main.
import { useLocation } from 'react-router';        // What: Use Location. Why: The page needs the hash a section link or a shared address arrived with. How: This reads the current location.
import { useNavigate } from 'react-router';        // What: Use Navigate. Why: The hash should leave the address once the page has scrolled to it. How: This returns the router's navigate function.

// #endregion Imports



/**
 * home.tsx = Home Page
 *
 * @summary
 * The site's only content page, at the root path. It stacks the shared
 * navigation bar, the four home sections (hero, services, about, contact) in
 * a main landmark, and the shared footer. Each section lives in its own file
 * in this folder, so any of them can later move to a route of its own.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

// #region HomPagCom

/**
 * HomPagCom = Home Page Component
 *
 * @summary
 * Renders the home page: the navigation bar, then a main element holding the
 * hero, services, about, and contact sections in reading order, then the
 * footer. app.tsx renders it at the root path. When the address carries a
 * section's hash (a section link from the 404 page, a link opened in a new
 * tab, or a bookmark), it scrolls that section into view once the fonts have
 * loaded, since Chromium and WebKit look for the anchor before the page has
 * rendered it and stay at the top, then clears the hash, so the address bar
 * stays as clean as it does after an in-page section link.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The home page.
 *
 * @example
 * ```tsx
 * HomPagCom() // => <HomPagCom />
 * ```
 *
*/

function HomPagCom () : React.JSX.Element {


	const { hash : hasValStr } = useLocation(); // What: Hash Value String. Why: A visitor can arrive with a section's id as the hash. How: This reads the hash, e.g. #contact, or an empty string, renaming the router's hash key.

	const navRouFun = useNavigate(); // What: Navigate Router Function. Why: The hash should be cleared once the page has used it. How: This is the router's navigate function.


	React.useEffect( () => { // What: Hash Arrival Effect. Why: Chromium and WebKit don't scroll to a section's anchor that's rendered after load, so a link or bookmark to /#services would land at the top, and the hash should leave the address once used. How: Once the fonts have loaded and the layout has settled, this jumps straight to the hash's element, the way the browser itself would have, then replaces the address with one without it.


		if ( !hasValStr ) return; // What: No Hash Guard. Why: Most visits arrive without a hash. How: This does nothing when the hash is empty, including right after it's been cleared.



		document.fonts.ready.then( () => { // What: Fonts Ready Callback. Why: The jump should land where the section sits once the fonts have reflowed the page above it. How: This waits for the fonts, then scrolls and clears the hash.


			document.getElementById( hasValStr.slice( 1 ) )?.scrollIntoView( { behavior : 'instant' } ); // What: Arrival Scroll Call. Why: The visitor should land on the section, as a normal link arrival would. How: This jumps to the element the hash names, instantly rather than smoothly, as an arrival rather than a movement.

			void navRouFun( { hash : '' }, { replace : true } ); // What: Hash Clear Call. Why: The address should stay as clean as it does for in-page links. How: This replaces the current history entry with the same path and no hash; void marks the returned promise as deliberately unawaited.


		} );


	}, [ hasValStr, navRouFun ] ); // What: Effect Dependency Array. Why: Each new hash has to be handled once. How: hasValStr changes when a visitor arrives with a hash, and navRouFun is listed because the effect calls it, though it stays the same between renders.



	return (


		<>{ /* What: Home Page Fragment. Why: The bar, main content, and footer sit side by side with no wrapper of their own. How: This groups them without adding an element. */ }


			<NavBarCom />{ /* What: Navigation Bar Component. Why: The page starts with the shared top bar. How: This renders it above the content. */ }



			<main>{ /* What: Home Main Element. Why: The four sections are the page's main content. How: This wraps them in the main landmark, in reading order. */ }


				<HerSecCom />{ /* What: Hero Section Component. Why: The page opens with the headline and pitch. How: This renders the hero first. */ }



				<SerSecCom />{ /* What: Services Section Component. Why: Visitors see what the company does next. How: This renders the services second. */ }



				<AboSecCom />{ /* What: About Section Component. Why: The company's story follows its services. How: This renders the about section third. */ }



				<ConSecCom />{ /* What: Contact Section Component. Why: The page ends where visitors reach the company. How: This renders the contact section last. */ }


			</main>



			<SitFooCom />{ /* What: Site Footer Component. Why: The page ends with the shared footer. How: This renders it below the content. */ }


		</>


	);


}

// #endregion HomPagCom

// #endregion Components



// #region Exports

export { HomPagCom }; // What: Named Exports. Why: app.tsx renders the home page at the root path. How: This exports HomPagCom.

// #endregion Exports



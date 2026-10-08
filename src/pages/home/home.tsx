


// #region Imports

import React from 'react'; // What: React. Why: The page scrolls to a linked section once it has rendered. How: This is read as React.useEffect, and as React.JSX.Element for the page's return type.


import { AboSecCom } from './about.tsx';         // What: About Section Component. Why: The page tells the company's story third. How: This is rendered inside main, after the services.
import { ConSecCom } from './contact.tsx';       // What: Contact Section Component. Why: The page ends where visitors reach the company. How: This is rendered last inside main.
import { HerSecCom } from './hero.tsx';          // What: Hero Section Component. Why: The page opens with the headline and pitch. How: This is rendered first inside main.
import { NavBarCom } from '../../ui/nav.tsx';    // What: Navigation Bar Component. Why: Every page starts with the shared top bar. How: This is rendered above main.
import { SerSecCom } from './services.tsx';      // What: Services Section Component. Why: The page lists what the company does second. How: This is rendered inside main, after the hero.
import { SitFooCom } from '../../ui/footer.tsx'; // What: Site Footer Component. Why: Every page ends with the shared footer. How: This is rendered below main.

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
 * section's hash (a link from another page, or a bookmark), it scrolls that
 * section into view once the fonts have loaded, since Chromium and WebKit
 * look for the anchor before the page has rendered it and stay at the top.
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


	React.useEffect( () => { // What: Hash Scroll Effect. Why: Chromium and WebKit don't scroll to a section's anchor that's rendered after load, so a link or bookmark to /#services would land at the top. How: Once the fonts have loaded and the layout has settled, this jumps straight to the hash's element, the way the browser itself would have.


		const hasIdeStr = window.location.hash.slice( 1 ); // What: Hash Identifier String. Why: The address's hash names the section to show. How: This drops the leading # to leave the element's id.


		if ( !hasIdeStr ) return; // What: No Hash Guard. Why: An address without a hash should start at the top as usual. How: This exits before scheduling any scroll.



		document.fonts.ready.then( () => document.getElementById( hasIdeStr )?.scrollIntoView( { behavior : 'instant' } ) ); // What: Hash Section Scroll Call. Why: The jump should land where the section sits once the fonts have reflowed the page above it. How: This waits for the fonts, then scrolls the section into view instantly rather than smoothly, as an arrival rather than a movement.


	}, [] ); // What: Effect Dependency Array. Why: The page should only jump to its hash once, when it first renders. How: An empty array means there is no dependency that could ever change to trigger a re-run.



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



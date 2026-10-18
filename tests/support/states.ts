


// #region Imports

import type { Page } from '@playwright/test'; // What: Page. Why: Opening a state drives a Playwright page. How: This types opeStaFun's page parameter.

// #endregion Imports



/**
 * states.ts = States
 *
 * @summary
 * The page states the accessibility, interaction, and rendering suites visit,
 * and the helper that opens one; the responsive suite opens its own widths
 * through the same helper. A state is a page at a width, sometimes with
 * something opened on it: the home page and the 404 page at phone and desktop
 * widths, and the mobile drawer open on a phone. opeStaFun sizes the viewport,
 * loads the page, waits for the fonts, runs the state's own action, such as
 * opening the drawer, and then waits for any animations to settle so nothing
 * is measured mid-fade.
 *
 * Sections:
 *  - Types
 *  - Constants
 *  - Helpers
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Types

type StaRecTyp = { // What: State Record Type. Why: Every check reads the same description of a state. How: This names a state, its path, its viewport, and an optional action that opens something on it.


	actFun? : ( curPagObj : Page ) => Promise< void >, // What: Action Function. Why: Some states need something opened after the page loads. How: This runs against the loaded page, e.g. clicking the menu toggle.
	heiNum  : number,                                  // What: Height Number. Why: The viewport's height decides what's on screen. How: This is the viewport height in CSS pixels.
	ideStr  : string,                                  // What: Identifier String. Why: Each test names the state it checks. How: This becomes part of the test title.
	patStr  : string,                                  // What: Path String. Why: Each state opens one route. How: This is the path loaded from the dev server.
	widNum  : number                                   // What: Width Number. Why: Layouts and menus change with width. How: This is the viewport width in CSS pixels.


};

// #endregion Types



// #region Constants

// #region STA_REC_ARR

/**
 * STA_REC_ARR = State Record Array
 *
 * @summary
 * Every state the checks visit: each route at a phone width (390px) and a
 * desktop width (1,440px), plus the mobile drawer open at the phone width,
 * since the drawer is only reachable there. The 404 page is reached through
 * an address the site doesn't have, the way a visitor would land on it.
 * Every row shares the {@link StaRecTyp} shape, so its fields carry no
 * comments of their own:
 * - `actFun` (Function): Action Function, run after the page loads to open
 *   something on it, such as the drawer. Only the drawer row has one.
 * - `heiNum` (Number): Height Number, the viewport height in CSS pixels.
 * - `ideStr` (String): Identifier String, the state's name in test titles.
 * - `patStr` (String): Path String, the route loaded from the dev server.
 * - `widNum` (Number): Width Number, the viewport width in CSS pixels.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const STA_REC_ARR : StaRecTyp[] = [ // What: State Record Array. Why: Every check walks the same list of states, so a new state is added in one place. How: Each row names a state, its path, and its viewport, and the drawer row adds the action that opens it.


	{ heiNum : 900, ideStr : 'home-desktop',      patStr : '/',        widNum : 1440 }, // What: Home Desktop State. Why: Most visitors on a computer land here. How: This loads the home page at 1,440px.
	{ heiNum : 844, ideStr : 'home-phone',        patStr : '/',        widNum : 390  }, // What: Home Phone State. Why: The phone layout stacks every section and hides the bar's links behind the menu. How: This loads the home page at 390px.
	{ heiNum : 900, ideStr : 'not-found-desktop', patStr : '/missing', widNum : 1440 }, // What: Not Found Desktop State. Why: A mistyped address should be as usable as any page. How: This loads an unknown path at 1,440px.
	{ heiNum : 844, ideStr : 'not-found-phone',   patStr : '/missing', widNum : 390  }, // What: Not Found Phone State. Why: The 404 page has its own phone layout. How: This loads an unknown path at 390px.

	{ // What: Drawer Phone State. Why: The open drawer holds the phone's only copy of the links, contact details, and estimate button. How: This loads the home page at 390px and opens the menu through its toggle button.


		heiNum : 844,
		ideStr : 'drawer-phone',
		patStr : '/',
		widNum : 390,

		actFun : async ( curPagObj ) => { await curPagObj.getByRole( 'button', { name : 'Toggle menu' } ).click(); }


	}


];

// #endregion STA_REC_ARR

// #endregion Constants



// #region Helpers

// #region opeStaFun

/**
 * opeStaFun = Open State Function
 *
 * @summary
 * Opens one state on a page and waits until it's settled: sizes the viewport,
 * loads the path, waits for the web fonts, loads every lazy image on the page
 * (Firefox only fetches one once it's scrolled near, which a full-page
 * screenshot never does) by switching it to eager loading, which leaves the
 * scroll position and the keyboard's starting point alone, runs the state's
 * action if it has one, then waits until no animation is still running, so a
 * check never measures a heading halfway through its entrance fade or a drawer
 * halfway open. The animation wait fails the check after 5 seconds rather than
 * hanging on a looping animation.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to open the state on.
 * @param staRecObj - State Record Object: {@link StaRecTyp}
 *
 * @returns A promise that settles once the state is open and settled, with no
 *          value.
 *
 * @example
 * ```ts
 * opeStaFun(page, staRecObj) // => Promise<void>
 * ```
 *
*/

async function opeStaFun ( curPagObj : Page, staRecObj : StaRecTyp ) : Promise< void > {


	await curPagObj.setViewportSize( { height : staRecObj.heiNum, width : staRecObj.widNum } ); // What: Viewport Size Call. Why: The state's layout depends on its width. How: This sizes the page before it loads, so breakpoints apply from the first paint.

	await curPagObj.goto( staRecObj.patStr ); // What: Page Load Call. Why: Each state starts from a fresh load of its route. How: This opens the path on the suite's dev server.

	await curPagObj.evaluate( () => document.fonts.ready ); // What: Fonts Ready Wait. Why: Text measured before its web font loads would have the wrong size and wrapping. How: This waits until every font face has loaded.



	await curPagObj.evaluate( async () => { // What: Lazy Images Load Call. Why: Firefox leaves a lazy image unfetched until it's scrolled near, so a full-page screenshot would show it blank. How: This switches each unloaded lazy image to eager loading and waits for it, rather than scrolling to it, which in Chromium would also move where the first Tab lands.


		for ( const imaCurEle of document.querySelectorAll< HTMLImageElement >( 'img[loading="lazy"]' ) ) { // What: Lazy Image Loop. Why: Every lazy image on the page has to load before the state is measured. How: This visits each one in page order.


			if ( imaCurEle.complete || !imaCurEle.getClientRects().length ) continue; // What: Loaded Or Hidden Guard. Why: A loaded image needs nothing, and a hidden one (the about seal on a phone) never loads, so waiting on it would hang. How: This skips an image that's already complete or isn't rendered.



			imaCurEle.loading = 'eager'; // What: Eager Loading Switch. Why: The image has to load wherever it sits on the page. How: Switching a lazy image to eager makes the browser fetch it at once, with no visible change.

			await new Promise( ( resProFun ) => { // What: Image Load Wait. Why: The image has to finish loading before the page moves on, and a failed one shouldn't hang the run. How: This waits for the image's load or error event, whichever fires first.


				imaCurEle.addEventListener( 'error', resProFun, { once : true } ); // What: Error Listener Registration. Why: An image that fails to load still has to end the wait. How: This resolves the promise once on error.
				imaCurEle.addEventListener( 'load', resProFun, { once : true } );  // What: Load Listener Registration. Why: The wait ends once the image has loaded. How: This resolves the promise once on load.


			} );


		}


	} );



	if ( staRecObj.actFun ) await staRecObj.actFun( curPagObj ); // What: State Action Call. Why: Some states need something opened first. How: This runs the state's action, if it has one.



	await curPagObj.waitForFunction( () => document.getAnimations().every( ( aniCurObj ) => aniCurObj.playState !== 'running' ), undefined, { timeout : 5000 } ); // What: Animations Settled Wait. Why: A check should see the page at rest, not mid-fade. How: This polls until no animation is running, for at most 5 seconds.


}

// #endregion opeStaFun

// #endregion Helpers



// #region Exports

export { opeStaFun, STA_REC_ARR, type StaRecTyp }; // What: Named Exports. Why: The accessibility, interaction, and rendering specs share these states and their opener, and the responsive spec the opener alone. How: This exports the state list, its type, and the helper that opens one.

// #endregion Exports



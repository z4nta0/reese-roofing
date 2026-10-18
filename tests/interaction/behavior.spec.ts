


// #region Imports

import { expect } from '@playwright/test'; // What: Expect. Why: Each behavior passes only when the page ends up where it should. How: This asserts on URLs, titles, text, attributes, focus, visibility, and positions.
import { test   } from '@playwright/test'; // What: Test. Why: Each behavior is its own test. How: This declares them.


import type { Locator } from '@playwright/test'; // What: Locator. Why: The new tab checks hand a link's click its options. How: This types those options from the click method's own parameter.
import type { Page    } from '@playwright/test'; // What: Page. Why: Every helper drives a Playwright page. How: This types their page parameters.

// #endregion Imports



/**
 * behavior.spec.ts = Behavior Spec
 *
 * @summary
 * Checks what the site's controls actually do, in whichever engine the project
 * runs. The nav's section links, the Home link, the hero's buttons, the
 * estimate buttons in the bar and the drawer, and back to top land on their
 * targets without ever putting a hash in the address, while a Ctrl, Cmd, or
 * middle click on a section link opens the section in a new tab instead, a
 * Ctrl or Cmd click on a drawer link leaving an open drawer as it was; every
 * section link on the home page and the 404 page names the home page's path;
 * the logo links to the root address; the bar takes its scrolled style once
 * the page moves and drops it at the top; the mobile drawer opens and closes
 * every way it can (the toggle, Escape, a tap on the dimmed page, a drawer
 * link, and a wider screen) and makes the page behind it inert while open; the
 * contact form swaps its button label when sent and builds a mailto link
 * carrying the request; and the 404 page answers an unknown address and leads
 * back home and to the contact section, its nav links included, while its back
 * to top link scrolls the 404 page itself. Pages open under reduced motion, so
 * scrolling jumps straight to its target and each position can be read at
 * once; how things move is the feedback spec's job. Reading the mailto link
 * needs Chromium's DevTools Protocol, so that one test runs in Chromium only.
 *
 * Sections:
 *  - Constants
 *  - Helpers
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const CLI_KIN_ARR : Array< [ string, Parameters< Locator[ 'click' ] >[ 0 ] ] > = [ [ 'Ctrl or Cmd', { modifiers : [ 'ControlOrMeta' ] } ], [ 'middle', { button : 'middle' } ] ]; // What: Click Kind Array. Why: Both ways of asking for a new tab have to keep working now that plain clicks scroll in place. How: Each row pairs a click kind's name with the click options that make it, ControlOrMeta pressing Cmd on a Mac and Ctrl elsewhere.

const DES_VIE_OBJ = { height : 900, width : 1440 }; // What: Desktop Viewport Object. Why: The bar's own links show only on wide screens. How: This is the desktop size the navigation checks use.
const PHO_VIE_OBJ = { height : 844, width : 390  }; // What: Phone Viewport Object. Why: The drawer exists only on small screens. How: This is the phone size the drawer checks use.
const SMA_VIE_OBJ = { height : 568, width : 320  }; // What: Small Viewport Object. Why: The 404 page only scrolls on the smallest phones. How: This is the 320 by 568 size the Return home and back to top checks open it at.

// #endregion Constants



// #region Helpers

// #region opeDraFun

/**
 * opeDraFun = Open Drawer Function
 *
 * @summary
 * Opens the mobile drawer through its toggle and waits until the toggle
 * reports it open, so a drawer check always starts from the drawer showing.
 * The caller has to be on a phone-sized viewport, where the toggle exists.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page whose drawer to open.
 *
 * @returns A promise that settles once the drawer reports itself open, with no
 *          value.
 *
 * @example
 * ```ts
 * opeDraFun(page) // => Promise<void>
 * ```
 *
*/

async function opeDraFun ( curPagObj : Page ) : Promise< void > {


	const togButObj = curPagObj.getByRole( 'button', { name : 'Toggle menu' } ); // What: Toggle Button Object. Why: The drawer opens from its menu button. How: This finds the button by its name.


	await togButObj.click(); // What: Toggle Click Call. Why: The drawer opens from a tap on the button. How: This clicks it.

	await expect( togButObj ).toHaveAttribute( 'aria-expanded', 'true' ); // What: Drawer Open Wait. Why: A check should start with the drawer open. How: This waits until the button reports it expanded.


}

// #endregion opeDraFun



// #region opeRouFun

/**
 * opeRouFun = Open Route Function
 *
 * @summary
 * Opens one route at one viewport size, ready to be used: it turns on reduced
 * motion so in-page scrolling jumps rather than glides, sizes the viewport,
 * counts every hashchange event the page will fire, so a check can tell that
 * no plain jump to a section ever put a hash in the address, loads the path,
 * and waits for the web fonts, so positions read afterwards are final.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to open the route on.
 * @param rouPatStr - Route Path String: The route to load.
 * @param vieSizObj - Viewport Size Object: {@link DES_VIE_OBJ},
 *                    {@link PHO_VIE_OBJ}, or {@link SMA_VIE_OBJ}.
 *
 * @returns A promise that settles once the route is loaded and its fonts are
 *          ready, with no value.
 *
 * @example
 * ```ts
 * opeRouFun(page, '/', DES_VIE_OBJ) // => Promise<void>
 * ```
 *
*/

async function opeRouFun ( curPagObj : Page, rouPatStr : string, vieSizObj : { height : number, width : number } ) : Promise< void > {


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: Scrolling should land at once, so its target can be read right away. How: This makes the page match prefers-reduced-motion, which turns smooth scrolling off.

	await curPagObj.setViewportSize( vieSizObj ); // What: Viewport Size Call. Why: The bar's links and the drawer depend on the width. How: This sizes the page before it loads.

	await curPagObj.addInitScript( () => { // What: Hash Change Counter. Why: A plain jump to a section adds a hash, and a history entry, that the home page then clears, so the address alone can't show it happened. How: This counts every hashchange event, which a jump fires and a router push or replace never does.


		Reflect.set( window, 'hasChaNum', 0 ); // What: Hash Change Number Set. Why: The count starts at zero on every load. How: This puts the counter on the window, where a check reads it.

		window.addEventListener( 'hashchange', () => Reflect.set( window, 'hasChaNum', Number( Reflect.get( window, 'hasChaNum' ) ) + 1 ) ); // What: Hash Change Listener. Why: Each jump has to be counted. How: This adds one to the counter whenever the hash changes.


	} );

	await curPagObj.goto( rouPatStr ); // What: Route Load Call. Why: Each check starts from a fresh load. How: This opens the path on the suite's dev server.

	await curPagObj.evaluate( () => document.fonts.ready ); // What: Fonts Ready Wait. Why: Positions measured before the fonts load would shift. How: This waits until every font face has loaded.


}

// #endregion opeRouFun



// #region secTopFun

/**
 * secTopFun = Section Top Function
 *
 * @summary
 * Reads how far an element's top edge sits below the top of the viewport,
 * in pixels, so a check can tell whether a link scrolled its section to the
 * top of the screen. Zero means the section starts right at the top.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to measure.
 * @param eleIdeStr - Element Identifier String: The id of the element to
 *                    measure.
 *
 * @returns The element's top edge, in pixels from the viewport's top.
 *
 * @example
 * ```ts
 * secTopFun(page, 'services') // => 0
 * ```
 *
*/

async function secTopFun ( curPagObj : Page, eleIdeStr : string ) : Promise< number > {


	return curPagObj.evaluate( ( secIdeStr ) => document.getElementById( secIdeStr )!.getBoundingClientRect().top, eleIdeStr ); // What: Section Top Return. Why: A check compares where the section landed with the top of the screen. How: This reads the element's top edge inside the page. // What: Non-Null Note. Why: getElementById types as possibly null. How: Every id a check passes exists on the page it loaded.


}

// #endregion secTopFun

// #endregion Helpers



// #region Module Init

// #region Navigation Checks

for ( const [ linLabStr, secIdeStr ] of [ [ 'Services', 'services' ], [ 'About', 'about' ], [ 'Contact', 'contact' ] ] ) { // What: Section Link Loop. Why: Each of the bar's section links has its own target. How: This declares one test per link, pairing its label with its section's id.


	test( `the ${ linLabStr } link scrolls to its section`, async ( { page : curPagObj } ) => { // What: Section Link Test. Why: A section link has to take the visitor to its section. How: This clicks the link and checks the section's position and the address.


		await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The bar's own links show on wide screens. How: This opens the home page at desktop size.

		await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : linLabStr } ).click(); // What: Section Link Click Call. Why: This is the action under test. How: This clicks the bar's link by its label.


		await expect.poll( async () => Math.abs( await secTopFun( curPagObj, secIdeStr ) ) ).toBeLessThan( 2 ); // What: Section Position Assertion. Why: The section should start at the top of the screen. How: This waits until its top edge sits less than 2 pixels from the viewport's top.

		await expect( curPagObj ).toHaveURL( /\/$/ ); // What: Clean Address Assertion. Why: The address bar should stay free of hashes. How: This checks the URL still ends at the root.

		expect( await curPagObj.evaluate( () => Reflect.get( window, 'hasChaNum' ) ) ).toBe( 0 ); // What: No Hash Jump Assertion. Why: A plain jump would have put a hash in the address before the home page cleared it. How: This checks the page never fired a hashchange event.


	} );


}



for ( const [ cliKinStr, cliOptObj ] of CLI_KIN_ARR ) { // What: Modified Click Loop. Why: Each way of asking for a new tab gets its own check. How: This declares one test per row of CLI_KIN_ARR.


	test( `a ${ cliKinStr } click opens a section in a new tab`, async ( { page : curPagObj } ) => { // What: New Tab Test. Why: A visitor opening a section in a new tab should land on it there, and the page they clicked from should stay put. How: This makes the click, then checks the new tab's section and address and the old page's scroll and address.


		await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The bar's own links show on wide screens. How: This opens the home page at desktop size.


		const newTabPro = curPagObj.context().waitForEvent( 'page' ); // What: New Tab Promise. Why: The click opens its page in a new tab. How: This waits for the browser context to report a new page, set up before the click so it can't be missed.


		await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : 'About' } ).click( cliOptObj ); // What: Modified Click Call. Why: This is the action under test. How: This clicks the bar's About link the way the loop's row says.


		const newTabObj = await newTabPro; // What: New Tab Object. Why: The section should open in the new tab. How: This is the page the click opened.


		await expect( newTabObj.locator( '#about' ) ).toBeVisible(); // What: Section Render Wait. Why: The new tab loads the page from scratch, so the section has to exist before it's measured. How: This waits until the About section is on the page.

		await expect.poll( async () => Math.abs( await secTopFun( newTabObj, 'about' ) ) ).toBeLessThan( 2 ); // What: New Tab Position Assertion. Why: The new tab should land on the section. How: This waits until the About section's top edge sits less than 2 pixels from the viewport's top.

		await expect( newTabObj ).toHaveURL( /\/$/ ); // What: New Tab Address Assertion. Why: The new tab's hash should be cleared once used. How: This checks its URL ends at the root.

		expect( await curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Original Scroll Assertion. Why: The page clicked from should stay where it was. How: This checks it's still at the top.

		await expect( curPagObj ).toHaveURL( /\/$/ ); // What: Original Address Assertion. Why: The page clicked from shouldn't navigate. How: This checks its URL still ends at the root.


	} );


}



for ( const [ butLabStr, secIdeStr ] of [ [ 'Request an estimate', 'contact' ], [ 'Explore services', 'services' ] ] ) { // What: Hero Button Loop. Why: Each of the hero's buttons leads to its own section. How: This declares one test per button, pairing its label with its section's id.


	test( `the hero's ${ butLabStr } button scrolls to its section`, async ( { page : curPagObj } ) => { // What: Hero Button Test. Why: A section button has to take the visitor to its section without a hash. How: This clicks the button and checks the section's position and the address.


		await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The hero opens the home page. How: This opens it at desktop size.

		await curPagObj.getByRole( 'main' ).getByRole( 'link', { name : butLabStr } ).click(); // What: Hero Button Click Call. Why: This is the action under test. How: This clicks the hero's button by its label.


		await expect.poll( async () => Math.abs( await secTopFun( curPagObj, secIdeStr ) ) ).toBeLessThan( 2 ); // What: Section Position Assertion. Why: The section should start at the top of the screen. How: This waits until its top edge sits less than 2 pixels from the viewport's top.

		await expect( curPagObj ).toHaveURL( /\/$/ ); // What: Clean Address Assertion. Why: The address bar should stay free of hashes. How: This checks the URL still ends at the root.

		expect( await curPagObj.evaluate( () => Reflect.get( window, 'hasChaNum' ) ) ).toBe( 0 ); // What: No Hash Jump Assertion. Why: A plain jump would have put a hash in the address before the home page cleared it. How: This checks the page never fired a hashchange event.


	} );


}



test( "the bar's estimate button scrolls to the contact section", async ( { page : curPagObj } ) => { // What: Bar Estimate Test. Why: The bar's main action has to reach the form without a hash. How: This clicks the bar's estimate button and checks the section's position and the address.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The bar's estimate button shows on wide screens. How: This opens the home page at desktop size.

	await curPagObj.getByRole( 'banner' ).getByRole( 'link', { name : 'Get an estimate' } ).click(); // What: Bar Estimate Click Call. Why: This is the action under test. How: This clicks the bar's estimate button.


	await expect.poll( async () => Math.abs( await secTopFun( curPagObj, 'contact' ) ) ).toBeLessThan( 2 ); // What: Contact Position Assertion. Why: The visitor should land on the form. How: This waits until the section's top edge sits less than 2 pixels from the viewport's top.

	await expect( curPagObj ).toHaveURL( /\/$/ ); // What: Clean Address Assertion. Why: The address bar should stay free of hashes. How: This checks the URL still ends at the root.

	expect( await curPagObj.evaluate( () => Reflect.get( window, 'hasChaNum' ) ) ).toBe( 0 ); // What: No Hash Jump Assertion. Why: A plain jump would have put a hash in the address before the home page cleared it. How: This checks the page never fired a hashchange event.


} );



test( 'the Home link returns to the top', async ( { page : curPagObj } ) => { // What: Home Link Test. Why: Home has to bring a scrolled visitor back to the start. How: This scrolls down, clicks Home, and checks the scroll position.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The bar's Home link shows on wide screens. How: This opens the home page at desktop size.

	await curPagObj.evaluate( () => window.scrollTo( 0, 2000 ) ); // What: Scroll Down Call. Why: Home only matters away from the top. How: This scrolls the page down.

	await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : 'Home' } ).click(); // What: Home Link Click Call. Why: This is the action under test. How: This clicks the bar's Home link.


	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Top Position Assertion. Why: The visitor should end up back at the top. How: This waits until the page has scrolled all the way up.

	await expect( curPagObj ).toHaveURL( /\/$/ ); // What: Clean Address Assertion. Why: The address bar should stay free of hashes. How: This checks the URL still ends at the root.

	expect( await curPagObj.evaluate( () => Reflect.get( window, 'hasChaNum' ) ) ).toBe( 0 ); // What: No Hash Jump Assertion. Why: A plain jump would have put a hash in the address before the home page cleared it. How: This checks the page never fired a hashchange event.


} );



test( 'back to top returns to the top', async ( { page : curPagObj } ) => { // What: Back To Top Test. Why: The footer's link has to bring the visitor back up. How: This scrolls to the bottom, clicks the link, and checks the scroll position.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: Back to top sits at the bottom of the home page. How: This opens it at desktop size.

	await curPagObj.getByRole( 'link', { name : 'Back to top' } ).click(); // What: Back To Top Click Call. Why: This is the action under test. How: This clicks the footer's link, which Playwright scrolls into view first.


	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Top Position Assertion. Why: The visitor should end up back at the top. How: This waits until the page has scrolled all the way up.

	await expect( curPagObj ).toHaveURL( /\/$/ ); // What: Clean Address Assertion. Why: The address bar should stay free of hashes. How: This checks the URL still ends at the root.

	expect( await curPagObj.evaluate( () => Reflect.get( window, 'hasChaNum' ) ) ).toBe( 0 ); // What: No Hash Jump Assertion. Why: A plain jump would have put a hash in the address before the home page cleared it. How: This checks the page never fired a hashchange event.


} );



test( 'the bar takes its scrolled style once the page moves', async ( { page : curPagObj } ) => { // What: Scrolled Bar Test. Why: Once the page moves, the bar needs its frosted background to stay readable over the content. How: This scrolls the home page down and back up, checking the bar's attribute and background each time.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The bar starts transparent at the top of the home page. How: This opens it at desktop size.


	const barHedObj = curPagObj.getByRole( 'banner' ); // What: Bar Header Object. Why: The scrolled style sits on the bar itself. How: This finds the page's banner landmark.


	await expect( barHedObj ).not.toHaveAttribute( 'data-page-scroll-past' ); // What: Top Attribute Assertion. Why: The bar should start without its scrolled style. How: This checks the attribute is absent at the top.

	await expect( barHedObj ).toHaveCSS( 'background-color', 'rgba(0, 0, 0, 0)' ); // What: Top Background Assertion. Why: At the top the bar sits over the hero with no background of its own. How: This checks its background is transparent.

	await curPagObj.evaluate( () => window.scrollTo( 0, 400 ) ); // What: Scroll Down Call. Why: The scrolled style switches on past the top. How: This scrolls the page well past the 24px threshold.

	await expect( barHedObj ).toHaveAttribute( 'data-page-scroll-past' ); // What: Scrolled Attribute Assertion. Why: The bar should mark itself scrolled. How: This waits until the attribute is set.

	await expect( barHedObj ).not.toHaveCSS( 'background-color', 'rgba(0, 0, 0, 0)' ); // What: Scrolled Background Assertion. Why: The attribute only matters if the bar really draws its background. How: This checks the background is no longer transparent.

	await curPagObj.evaluate( () => window.scrollTo( 0, 0 ) ); // What: Scroll Up Call. Why: The style should leave again at the top. How: This scrolls back to the top.

	await expect( barHedObj ).not.toHaveAttribute( 'data-page-scroll-past' ); // What: Returned Attribute Assertion. Why: Back at the top the bar should drop its scrolled style. How: This waits until the attribute is gone.


} );



test( 'the logo links to the root address', async ( { page : curPagObj } ) => { // What: Logo Link Test. Why: The logo should load the home page from anywhere. How: This checks the brand link's address.


	await opeRouFun( curPagObj, '/missing', DES_VIE_OBJ ); // What: Not Found Open Call. Why: The logo matters most away from the home page. How: This opens the 404 page at desktop size.


	await expect( curPagObj.locator( 'header a[aria-hidden="true"]' ) ).toHaveAttribute( 'href', '/' ); // What: Root Address Assertion. Why: The logo points at the site's root, apart from Home's top anchor. How: This checks the hidden brand link's href.


} );



for ( const rouPatStr of [ '/', '/missing' ] ) { // What: Section Address Loop. Why: Section links render on the home page and the 404 page alike. How: This declares the address check once per route.


	test( `every section link on ${ rouPatStr } names the home page's path`, async ( { page : curPagObj } ) => { // What: Section Address Test. Why: A plain click never reads a section link's address, so only a new tab or a copied link would show one written as a bare hash, which opens the 404 page again from there. How: This reads the address of every section link in the bar, its drawer, and the page's main content.


		await opeRouFun( curPagObj, rouPatStr, DES_VIE_OBJ ); // What: Route Open Call. Why: The links are read where they render. How: This opens the route at desktop size, where the drawer's links are still in the page.


		const hreLisArr = await curPagObj.locator( 'header a[href*="#"], main a[href*="#"]' ).evaluateAll( ( ancEleArr ) => ancEleArr.map( ( ancCurEle ) => ancCurEle.getAttribute( 'href' ) ?? '' ) ); // What: Href List Array. Why: Every section link carries a hash, while the brand and phone links don't. How: This reads the address of each link with a hash in the bar, its drawer, and the main content, leaving out the footer's back to top link, whose bare #top is meant for whichever page is showing.


		expect( hreLisArr.length ).toBeGreaterThan( 0 );                                               // What: Links Found Assertion. Why: An empty list would pass the check below without reading anything. How: This checks section links were found.
		expect( hreLisArr.filter( ( hreCurStr ) => !/^\/#[a-z]+$/.test( hreCurStr ) ) ).toEqual( [] ); // What: Path Address Assertion. Why: Each section link has to name the home page's path, so a new tab opened from any page lands on the section. How: This lists every address that isn't the root path and a section id, which should be none.


	} );


}

// #endregion Navigation Checks



// #region Drawer Checks

test( 'the menu toggle opens and closes the drawer', async ( { page : curPagObj } ) => { // What: Toggle Test. Why: The menu button is the drawer's main control. How: This opens the drawer, checks the page behind it is inert, then closes it again.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Home Open Call. Why: The drawer exists on small screens. How: This opens the home page at phone size.

	await opeDraFun( curPagObj ); // What: Drawer Open Call. Why: The open state comes first. How: This opens the drawer through its toggle.


	await expect( curPagObj.locator( 'main' ) ).toHaveAttribute( 'inert', '' ); // What: Inert Page Assertion. Why: The page under the dimmed scrim shouldn't take focus. How: This checks the main content is inert while the drawer is open.

	await expect( curPagObj.getByRole( 'contentinfo' ) ).toHaveAttribute( 'inert', '' ); // What: Inert Footer Assertion. Why: Everything behind the open drawer, not just the main content, should stay out of reach. How: This checks the footer is inert too.


	await curPagObj.getByRole( 'button', { name : 'Toggle menu' } ).click(); // What: Toggle Close Call. Why: The same button closes the drawer. How: This clicks it again.


	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Drawer Closed Assertion. Why: The drawer should close. How: This checks the button reports it collapsed.

	await expect( curPagObj.locator( 'main' ) ).not.toHaveAttribute( 'inert' ); // What: Live Page Assertion. Why: The page has to be usable again. How: This checks the main content is no longer inert.

	await expect( curPagObj.getByRole( 'contentinfo' ) ).not.toHaveAttribute( 'inert' ); // What: Live Footer Assertion. Why: The footer has to be usable again too. How: This checks it's no longer inert.


} );



test( 'Escape closes the drawer and returns focus to the toggle', async ( { page : curPagObj } ) => { // What: Escape Test. Why: Escape is the expected way out of a layer over the page. How: This opens the drawer, focuses one of its links, presses Escape, and checks the drawer and focus.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Home Open Call. Why: The drawer exists on small screens. How: This opens the home page at phone size.

	await opeDraFun( curPagObj ); // What: Drawer Open Call. Why: Escape only matters with the drawer open. How: This opens it.


	const draLinObj = curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : 'Services' } ); // What: Drawer Link Object. Why: A keyboard user presses Escape from inside the drawer, and the click that opened it left focus on the toggle already. How: This finds the drawer's Services link, the only one visible at phone size.


	await draLinObj.focus(); // What: Drawer Link Focus Call. Why: Focus has to start inside the drawer, so the check below can see Escape move it. How: This focuses the link.

	await expect( draLinObj ).toBeFocused(); // What: Drawer Link Focus Assertion. Why: The test only proves something if focus really left the toggle. How: This checks the link holds focus.

	await curPagObj.keyboard.press( 'Escape' ); // What: Escape Press Call. Why: This is the action under test. How: This presses Escape.


	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Drawer Closed Assertion. Why: Escape should close the drawer. How: This checks the button reports it collapsed.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toBeFocused(); // What: Toggle Focus Assertion. Why: Focus shouldn't be left inside the closed drawer. How: This checks it moved from the drawer link to the toggle.


} );



test( 'a tap on the dimmed page closes the drawer', async ( { page : curPagObj } ) => { // What: Scrim Test. Why: Tapping outside the drawer is a natural way to dismiss it. How: This opens the drawer, taps near the bottom of the screen, and checks it closed.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Home Open Call. Why: The drawer exists on small screens. How: This opens the home page at phone size.

	await opeDraFun( curPagObj ); // What: Drawer Open Call. Why: The scrim shows only while the drawer is open. How: This opens it.

	await curPagObj.mouse.click( 195, 830 ); // What: Scrim Tap Call. Why: This is the action under test. How: This clicks near the bottom middle of the screen, below the drawer, where only the scrim sits.


	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Drawer Closed Assertion. Why: The tap should close the drawer. How: This checks the button reports it collapsed.


} );



for ( const [ linLabStr, secIdeStr ] of [ [ 'Home', 'top' ], [ 'Services', 'services' ], [ 'About', 'about' ], [ 'Contact', 'contact' ] ] ) { // What: Drawer Link Loop. Why: Each of the drawer's links leads to its own section. How: This declares one test per link, pairing its label with its section's id.


	test( `the drawer's ${ linLabStr } link closes the drawer and scrolls to its section`, async ( { page : curPagObj } ) => { // What: Drawer Link Test. Why: Picking a section should both take the visitor there and get the drawer out of the way. How: This opens the drawer, picks the link, and checks the drawer, the section, and the address.


		await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Home Open Call. Why: The drawer exists on small screens. How: This opens the home page at phone size.


		if ( secIdeStr === 'top' ) await curPagObj.evaluate( () => window.scrollTo( 0, document.documentElement.scrollHeight ) ); // What: Home Row Scroll Call. Why: The page opens at its top, where the Home row's target already sits, so that row would pass without scrolling. How: This sends the page to its bottom first, for the Home row only.



		await opeDraFun( curPagObj ); // What: Drawer Open Call. Why: The drawer's links show only while it's open. How: This opens it.

		await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : linLabStr } ).click(); // What: Drawer Link Click Call. Why: This is the action under test. How: This clicks the link by its label, the only one visible at phone size, since the bar's own links are hidden there.


		await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Drawer Closed Assertion. Why: The drawer should close once a section is picked. How: This checks the toggle reports it collapsed.

		await expect.poll( async () => Math.abs( await secTopFun( curPagObj, secIdeStr ) ) ).toBeLessThan( 2 ); // What: Section Position Assertion. Why: The visitor should land on the section. How: This waits until its top edge sits less than 2 pixels from the viewport's top.

		await expect( curPagObj ).toHaveURL( /\/$/ ); // What: Clean Address Assertion. Why: The address bar should stay free of hashes. How: This checks the URL still ends at the root.

		expect( await curPagObj.evaluate( () => Reflect.get( window, 'hasChaNum' ) ) ).toBe( 0 ); // What: No Hash Jump Assertion. Why: A plain jump would have put a hash in the address before the home page cleared it. How: This checks the page never fired a hashchange event.


	} );


}



test( "the drawer's estimate button closes the drawer and scrolls to the contact section", async ( { page : curPagObj } ) => { // What: Drawer Estimate Test. Why: On a phone the drawer's estimate button is the main action, and it should both reach the form and get the drawer out of the way. How: This opens the drawer, clicks its estimate button, and checks the drawer, the section, and the address.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Home Open Call. Why: The drawer exists on small screens. How: This opens the home page at phone size.

	await opeDraFun( curPagObj ); // What: Drawer Open Call. Why: The drawer's estimate button shows only while it's open. How: This opens it.

	await curPagObj.getByRole( 'banner' ).getByRole( 'link', { name : 'Get an estimate' } ).click(); // What: Drawer Estimate Click Call. Why: This is the action under test. How: This clicks the only estimate button visible at phone size, since the bar's own is hidden there.


	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Drawer Closed Assertion. Why: The drawer should close once the button is used. How: This checks the toggle reports it collapsed.

	await expect.poll( async () => Math.abs( await secTopFun( curPagObj, 'contact' ) ) ).toBeLessThan( 2 ); // What: Contact Position Assertion. Why: The visitor should land on the form. How: This waits until the section's top edge sits less than 2 pixels from the viewport's top.

	await expect( curPagObj ).toHaveURL( /\/$/ ); // What: Clean Address Assertion. Why: The address bar should stay free of hashes. How: This checks the URL still ends at the root.

	expect( await curPagObj.evaluate( () => Reflect.get( window, 'hasChaNum' ) ) ).toBe( 0 ); // What: No Hash Jump Assertion. Why: A plain jump would have put a hash in the address before the home page cleared it. How: This checks the page never fired a hashchange event.


} );



test( 'a Ctrl or Cmd click on a drawer link leaves the drawer open', async ( { page : curPagObj } ) => { // What: Drawer New Tab Test. Why: A drawer link opened in a new tab hasn't taken the visitor anywhere, so the drawer should stay as it was. How: This makes the click from the open drawer, then checks the new tab opened and the drawer, scroll, and address stayed put.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Home Open Call. Why: The drawer exists on small screens. How: This opens the home page at phone size.

	await opeDraFun( curPagObj ); // What: Drawer Open Call. Why: The drawer's links show only while it's open. How: This opens it.


	const newTabPro = curPagObj.context().waitForEvent( 'page' ); // What: New Tab Promise. Why: The click opens its page in a new tab. How: This waits for the browser context to report a new page, set up before the click so it can't be missed.


	await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : 'About' } ).click( { modifiers : [ 'ControlOrMeta' ] } ); // What: Modified Click Call. Why: This is the action under test, and only a Ctrl or Cmd click reaches the drawer's handler, since a middle click arrives as auxclick. How: This clicks the drawer's About link with Ctrl, or Cmd on a Mac.


	const newTabObj = await newTabPro; // What: New Tab Object. Why: The section should open in the new tab. How: This is the page the click opened.


	await expect( newTabObj.locator( '#about' ) ).toBeVisible(); // What: New Tab Section Assertion. Why: The click should still have opened the section. How: This waits until the About section is on the new tab's page.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'true' ); // What: Drawer Open Assertion. Why: A click the browser handled shouldn't close the drawer. How: This checks the toggle still reports it open.

	expect( await curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Original Scroll Assertion. Why: The page clicked from should stay where it was. How: This checks it's still at the top.

	await expect( curPagObj ).toHaveURL( /\/$/ ); // What: Original Address Assertion. Why: The page clicked from shouldn't navigate. How: This checks its URL still ends at the root.


} );



test( 'widening the screen closes the drawer', async ( { page : curPagObj } ) => { // What: Widen Test. Why: Past the breakpoint the toggle disappears, so an open drawer would leave the page inert with no way out. How: This opens the drawer, widens the viewport, and checks the drawer closed.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Home Open Call. Why: The drawer exists on small screens. How: This opens the home page at phone size.

	await opeDraFun( curPagObj ); // What: Drawer Open Call. Why: Widening only matters with the drawer open. How: This opens it.

	await curPagObj.setViewportSize( DES_VIE_OBJ ); // What: Widen Call. Why: This is the action under test. How: This resizes the viewport to desktop size.


	await expect( curPagObj.locator( 'button[aria-label="Toggle menu"]' ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Drawer Closed Assertion. Why: The drawer should close once the toggle is gone. How: This checks the hidden toggle reports the drawer collapsed, found by its label since a hidden button drops out of the accessibility tree.

	await expect( curPagObj.locator( 'main' ) ).not.toHaveAttribute( 'inert' ); // What: Live Page Assertion. Why: The page has to stay usable once the toggle is gone. How: This checks the main content is no longer inert.

	await expect( curPagObj.getByRole( 'contentinfo' ) ).not.toHaveAttribute( 'inert' ); // What: Live Footer Assertion. Why: The footer has to be usable again too. How: This checks it's no longer inert.


} );

// #endregion Drawer Checks



// #region Contact Form Checks

test( 'sending the form swaps the button label', async ( { page : curPagObj } ) => { // What: Sent Label Test. Why: The visitor should see their request was sent. How: This fills the form, sends it, and checks the button's label.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The form sits at the bottom of the home page. How: This opens it at desktop size.

	await curPagObj.locator( '#conNamInp' ).fill( 'Pat Doe' ); // What: Name Fill Call. Why: A real request carries a name. How: This types one into the name field.

	await curPagObj.locator( '#conEmaInp' ).fill( 'pat@example.com' ); // What: Email Fill Call. Why: A real request carries an email. How: This types one into the email field.

	await curPagObj.getByRole( 'button', { name : 'Send request' } ).click(); // What: Send Click Call. Why: This is the action under test. How: This clicks the submit button.


	await expect( curPagObj.locator( 'form button[type="submit"]' ) ).toHaveText( /Opening your email/ ); // What: Sent Label Assertion. Why: The label confirms the email is opening. How: This checks the button's text changed.


} );



test( 'sending the form opens a mailto link carrying the request', async ( { browserName : engNamStr, page : curPagObj } ) => { // What: Mailto Test. Why: The request reaches the company through the visitor's email app. How: This reads the mailto link the page navigates to and checks its address, subject, and body.


	test.skip( engNamStr !== 'chromium', "Reading a mailto navigation needs Chromium's DevTools Protocol." ); // What: Chromium Only Skip. Why: Only Chromium reports a mailto navigation to the test, through its DevTools Protocol. How: This skips the test in the other engines.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The form sits at the bottom of the home page. How: This opens it at desktop size.


	const cdpSesObj = await curPagObj.context().newCDPSession( curPagObj ); // What: CDP Session Object. Why: The mailto navigation is only visible through the DevTools Protocol. How: This opens a session on the page.

	const navUrlArr : string[] = []; // What: Navigation URL Array. Why: The requested navigation is collected as it happens. How: This holds every URL the page asks to navigate to.


	await cdpSesObj.send( 'Page.enable' ); // What: Page Domain Enable Call. Why: Navigation events only arrive once the page domain is on. How: This turns it on.


	cdpSesObj.on( 'Page.frameRequestedNavigation', ( navEveObj ) => navUrlArr.push( navEveObj.url ) ); // What: Navigation Listener. Why: The mailto URL is the request itself. How: This records each URL the page asks to navigate to.


	await curPagObj.locator( '#conNamInp' ).fill( 'Pat Doe' ); // What: Name Fill Call. Why: The subject should carry the name. How: This types one into the name field.

	await curPagObj.locator( '#conEmaInp' ).fill( 'pat@example.com' ); // What: Email Fill Call. Why: The body should carry the email. How: This types one into the email field.

	await curPagObj.getByRole( 'button', { name : 'Send request' } ).click(); // What: Send Click Call. Why: This is the action under test. How: This clicks the submit button.


	await expect.poll( () => navUrlArr.length ).toBeGreaterThan( 0 ); // What: Navigation Wait. Why: The mailto link is read once the page has asked for it. How: This waits until a navigation arrives.


	const maiUrlStr = decodeURIComponent( navUrlArr[ 0 ] ); // What: Mail URL String. Why: The subject and body are checked as text. How: This decodes the first requested URL.


	expect( maiUrlStr ).toMatch( /^mailto:hello@reeseroofing\.example\?subject=Estimate request: Pat Doe&body=/ ); // What: Mailto Address Assertion. Why: The request has to go to the company with the visitor's name in the subject. How: This checks the address and subject.
	expect( maiUrlStr ).toContain( 'Email: pat@example.com' );                                                     // What: Mailto Body Assertion. Why: The company needs a way to reply. How: This checks the body carries the visitor's email.


} );

// #endregion Contact Form Checks



// #region Not Found Checks

test( 'an unknown address shows the 404 page', async ( { page : curPagObj } ) => { // What: Not Found Test. Why: A mistyped or outdated address should land somewhere useful. How: This opens an address the site doesn't have and checks the page and its title.


	await opeRouFun( curPagObj, '/no-such-page', DES_VIE_OBJ ); // What: Unknown Address Open Call. Why: Any unknown path should reach the 404 page. How: This opens one.


	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toHaveText( 'Page not found.' ); // What: Not Found Heading Assertion. Why: The page should say plainly what happened. How: This checks its heading.

	await expect( curPagObj ).toHaveTitle( 'Page Not Found | Reese Roofing Portfolio Demo' ); // What: Not Found Title Assertion. Why: The tab should name the problem too. How: This checks the page's own title.


} );



test( 'Return home leads to the top of the home page', async ( { page : curPagObj } ) => { // What: Return Home Test. Why: The 404 page's main action has to work, and with no scroll-to-top hook, the home page has to open at its top even when the 404 page was scrolled. How: This scrolls a small 404 page down, clicks Return home, and checks the address, title, and scroll position.


	await opeRouFun( curPagObj, '/missing', SMA_VIE_OBJ ); // What: Not Found Open Call. Why: The 404 page only scrolls on the smallest phones. How: This opens it at 320 by 568.

	await curPagObj.evaluate( () => window.scrollTo( 0, document.documentElement.scrollHeight ) ); // What: Scroll Down Call. Why: A router push keeps the old scroll position unless something resets it. How: This scrolls the 404 page to its bottom.

	expect( await curPagObj.evaluate( () => window.scrollY ) ).toBeGreaterThan( 0 ); // What: Scrolled Start Assertion. Why: The check proves nothing from a page that never left its top. How: This checks the scroll down really moved the 404 page, which only overflows on the smallest phones.

	await curPagObj.evaluate( () => Reflect.set( window, 'samDocBoo', true ) ); // What: Same Document Marker Set. Why: A link that navigates inside the router keeps the same document, while a full page load starts a new one. How: This marks the current document, which a full load would wipe.

	await curPagObj.getByRole( 'link', { name : 'Return home' } ).click(); // What: Return Home Click Call. Why: This is the action under test. How: This clicks the button.


	await expect( curPagObj ).toHaveTitle( 'Reese Roofing | Portfolio Demo by techgeek.support' ); // What: Home Title Assertion. Why: The 404 page's title should give way to the home page's. How: This checks the title changed back.

	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Top Position Assertion. Why: The home page should open at its top. How: This waits until the page sits at the top.

	await expect( curPagObj ).toHaveURL( /\/$/ ); // What: Home Address Assertion. Why: The visitor should land on the home page with no hash left. How: This checks the URL ends at the root.

	expect( await curPagObj.evaluate( () => Reflect.get( window, 'samDocBoo' ) ) ).toBe( true ); // What: Router Navigation Assertion. Why: The home page should open inside the router, without a full page load. How: This checks the marker set before the click survived.


} );



test( 'the 404 page leads to the contact section', async ( { page : curPagObj } ) => { // What: Not Found Estimate Test. Why: The 404 page offers the site's main action too. How: This clicks Get an estimate and checks the visitor lands on the contact section.


	await opeRouFun( curPagObj, '/missing', DES_VIE_OBJ ); // What: Not Found Open Call. Why: This button lives on the 404 page. How: This opens it.

	await curPagObj.evaluate( () => Reflect.set( window, 'samDocBoo', true ) ); // What: Same Document Marker Set. Why: A link that navigates inside the router keeps the same document, while a full page load starts a new one. How: This marks the current document, which a full load would wipe.

	await curPagObj.getByRole( 'main' ).getByRole( 'link', { name : 'Get an estimate' } ).click(); // What: Estimate Click Call. Why: This is the action under test. How: This clicks the page's own estimate button rather than the bar's.


	await expect( curPagObj.locator( '#contact' ) ).toBeVisible(); // What: Contact Render Wait. Why: The address changes before the home page has rendered, so the section has to exist before it's measured. How: This waits until the contact section is on the page.

	await expect.poll( async () => Math.abs( await secTopFun( curPagObj, 'contact' ) ) ).toBeLessThan( 2 ); // What: Contact Position Assertion. Why: The visitor should land on the form. How: This waits until the section's top edge sits less than 2 pixels from the viewport's top.

	await expect( curPagObj ).toHaveURL( /\/$/ ); // What: Clean Address Assertion. Why: The home page clears the hash once it has scrolled to the section. How: This checks the URL ends at the root.

	expect( await curPagObj.evaluate( () => Reflect.get( window, 'samDocBoo' ) ) ).toBe( true ); // What: Router Navigation Assertion. Why: The home page should open inside the router, without a full page load. How: This checks the marker set before the click survived.


} );



for ( const [ linLabStr, secIdeStr ] of [ [ 'Services', 'services' ], [ 'About', 'about' ], [ 'Contact', 'contact' ] ] ) { // What: Not Found Link Loop. Why: The bar's section links on the 404 page lead home to their sections. How: This declares one test per link, pairing its label with its section's id.


	test( `the 404 page's ${ linLabStr } link leads to its section`, async ( { page : curPagObj } ) => { // What: Not Found Section Link Test. Why: A section link away from the home page has to navigate home and land on its section without a hash. How: This clicks the link on the 404 page and checks the section's position and the address.


		await opeRouFun( curPagObj, '/missing', DES_VIE_OBJ ); // What: Not Found Open Call. Why: The bar's links are under test away from the home page. How: This opens the 404 page at desktop size.

		await curPagObj.evaluate( () => Reflect.set( window, 'samDocBoo', true ) ); // What: Same Document Marker Set. Why: A link that navigates inside the router keeps the same document, while a full page load starts a new one. How: This marks the current document, which a full load would wipe.

		await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : linLabStr } ).click(); // What: Section Link Click Call. Why: This is the action under test. How: This clicks the bar's link by its label.


		await expect( curPagObj.locator( `#${ secIdeStr }` ) ).toBeVisible(); // What: Section Render Wait. Why: The address changes before the home page has rendered, so the section has to exist before it's measured. How: This waits until the section is on the page.

		await expect.poll( async () => Math.abs( await secTopFun( curPagObj, secIdeStr ) ) ).toBeLessThan( 2 ); // What: Section Position Assertion. Why: The visitor should land on the section. How: This waits until its top edge sits less than 2 pixels from the viewport's top.

		await expect( curPagObj ).toHaveURL( /\/$/ ); // What: Clean Address Assertion. Why: The home page clears the hash once it has scrolled to the section. How: This checks the URL ends at the root.

		expect( await curPagObj.evaluate( () => Reflect.get( window, 'samDocBoo' ) ) ).toBe( true ); // What: Router Navigation Assertion. Why: The home page should open inside the router, without a full page load. How: This checks the marker set before the click survived.


	} );


}



test( "the 404 page's Home link leads to the home page", async ( { page : curPagObj } ) => { // What: Not Found Home Link Test. Why: The 404 page has a top anchor of its own, which the nav's Home link mustn't settle for. How: This clicks Home on the 404 page and checks the home page's title and a clean address.


	await opeRouFun( curPagObj, '/missing', DES_VIE_OBJ ); // What: Not Found Open Call. Why: The bar's Home link is under test away from the home page. How: This opens the 404 page at desktop size.

	await curPagObj.evaluate( () => Reflect.set( window, 'samDocBoo', true ) ); // What: Same Document Marker Set. Why: A link that navigates inside the router keeps the same document, while a full page load starts a new one. How: This marks the current document, which a full load would wipe.

	await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : 'Home' } ).click(); // What: Home Link Click Call. Why: This is the action under test. How: This clicks the bar's Home link.


	await expect( curPagObj ).toHaveTitle( 'Reese Roofing | Portfolio Demo by techgeek.support' ); // What: Home Title Assertion. Why: The visitor should reach the home page, not stay on the 404 page. How: This checks the home page's title.

	await expect( curPagObj ).toHaveURL( /\/$/ ); // What: Clean Address Assertion. Why: The home page clears the hash once it has scrolled to the top. How: This checks the URL ends at the root.

	expect( await curPagObj.evaluate( () => Reflect.get( window, 'samDocBoo' ) ) ).toBe( true ); // What: Router Navigation Assertion. Why: The home page should open inside the router, without a full page load. How: This checks the marker set before the click survived.


} );



test( 'back to top scrolls the 404 page to its own top', async ( { page : curPagObj } ) => { // What: Not Found Back To Top Test. Why: The footer's link means the top of whichever page is showing, so on the 404 page it should scroll that page up rather than go home. How: This scrolls the 404 page down, clicks the link, and checks the page, its position, and its address.


	await opeRouFun( curPagObj, '/missing', SMA_VIE_OBJ ); // What: Not Found Open Call. Why: The 404 page only scrolls on the smallest phones. How: This opens it at 320 by 568.

	await curPagObj.evaluate( () => window.scrollTo( 0, document.documentElement.scrollHeight ) ); // What: Scroll Down Call. Why: The link only proves anything from a scrolled page. How: This scrolls the 404 page to its bottom.

	expect( await curPagObj.evaluate( () => window.scrollY ) ).toBeGreaterThan( 0 ); // What: Scrolled Start Assertion. Why: The check proves nothing from a page that never left its top. How: This checks the scroll down really moved the 404 page, which only overflows on the smallest phones.

	await curPagObj.getByRole( 'link', { name : 'Back to top' } ).click(); // What: Back To Top Click Call. Why: This is the action under test. How: This clicks the footer's link.


	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Top Position Assertion. Why: The visitor should end up back at the 404 page's top. How: This waits until the page has scrolled all the way up.

	await expect( curPagObj ).toHaveTitle( 'Page Not Found | Reese Roofing Portfolio Demo' ); // What: Same Page Assertion. Why: The link shouldn't leave the 404 page. How: This checks the 404 page's title is still showing.

	await expect( curPagObj ).toHaveURL( /\/missing$/ ); // What: Same Address Assertion. Why: The address should stay the 404 page's own, with no hash. How: This checks the URL still ends at the missing path.

	expect( await curPagObj.evaluate( () => Reflect.get( window, 'hasChaNum' ) ) ).toBe( 0 ); // What: No Hash Jump Assertion. Why: A plain jump would have put a hash in the address. How: This checks the page never fired a hashchange event.


} );

// #endregion Not Found Checks

// #endregion Module Init



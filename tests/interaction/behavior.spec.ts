


// #region Imports

import { expect } from '@playwright/test'; // What: Expect. Why: Each behavior passes only when the page ends up where it should. How: This asserts on URLs, attributes, focus, and positions.
import { test   } from '@playwright/test'; // What: Test. Why: Each behavior is its own test. How: This declares them.


import type { Page } from '@playwright/test'; // What: Page. Why: Every helper drives a Playwright page. How: This types their page parameters.

// #endregion Imports



/**
 * behavior.spec.ts = Behavior Spec
 *
 * @summary
 * Checks what the site's controls actually do, in whichever engine the
 * project runs. The nav's section links, the Home link, and back to top land
 * on their targets; the mobile drawer opens and closes every way it can
 * (the toggle, Escape, a tap on the dimmed page, a drawer link, and a wider
 * screen) and makes the page behind it inert while open; the contact form
 * swaps its button label when sent and builds a mailto link carrying the
 * request; and the 404 page answers an unknown address and leads back home
 * and to the contact section. Pages open under reduced motion, so scrolling
 * jumps straight to its target and each position can be read at once; how
 * things move is the feedback spec's job. Reading the mailto link needs
 * Chromium's DevTools Protocol, so that one test runs in Chromium only.
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

const DES_VIE_OBJ = { height : 900, width : 1440 }; // What: Desktop Viewport Object. Why: The bar's own links show only on wide screens. How: This is the desktop size the navigation checks use.
const PHO_VIE_OBJ = { height : 844, width : 390 };  // What: Phone Viewport Object. Why: The drawer exists only on small screens. How: This is the phone size the drawer checks use.

// #endregion Constants



// #region Helpers

// #region opeRouFun

/**
 * opeRouFun = Open Route Function
 *
 * @summary
 * Opens one route at one viewport size, ready to be used: it turns on
 * reduced motion so in-page scrolling jumps rather than glides, sizes the
 * viewport, loads the path, and waits for the web fonts, so positions read
 * afterwards are final.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to open the route on.
 * @param patStr    - Path String: The route to load.
 * @param vieSizObj - Viewport Size Object: {@link DES_VIE_OBJ} or
 *                    {@link PHO_VIE_OBJ}.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * opeRouFun(page, '/', DES_VIE_OBJ) // => void
 * ```
 *
*/

async function opeRouFun ( curPagObj : Page, patStr : string, vieSizObj : { height : number, width : number } ) : Promise< void > {


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: Scrolling should land at once, so its target can be read right away. How: This makes the page match prefers-reduced-motion, which turns smooth scrolling off.

	await curPagObj.setViewportSize( vieSizObj ); // What: Viewport Size Call. Why: The bar's links and the drawer depend on the width. How: This sizes the page before it loads.

	await curPagObj.goto( patStr ); // What: Route Load Call. Why: Each check starts from a fresh load. How: This opens the path on the suite's dev server.

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
 * @param ideStr    - Identifier String: The id of the element to measure.
 *
 * @returns The element's top edge, in pixels from the viewport's top.
 *
 * @example
 * ```ts
 * secTopFun(page, 'services') // => 0
 * ```
 *
*/

async function secTopFun ( curPagObj : Page, ideStr : string ) : Promise< number > {


	return curPagObj.evaluate( ( secIdeStr ) => ( document.getElementById( secIdeStr ) as HTMLElement ).getBoundingClientRect().top, ideStr ); // What: Section Top Return. Why: A check compares where the section landed with the top of the screen. How: This reads the element's top edge inside the page. // What: Type Assertion Note. Why: getElementById types as possibly null. How: Every id a check passes exists on the page it loaded.


}

// #endregion secTopFun



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
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * opeDraFun(page) // => void
 * ```
 *
*/

async function opeDraFun ( curPagObj : Page ) : Promise< void > {


	const togButObj = curPagObj.getByRole( 'button', { name : 'Toggle menu' } ); // What: Toggle Button Object. Why: The drawer opens from its menu button. How: This finds the button by its name.


	await togButObj.click(); // What: Toggle Click Call. Why: The drawer opens from a tap on the button. How: This clicks it.

	await expect( togButObj ).toHaveAttribute( 'aria-expanded', 'true' ); // What: Drawer Open Wait. Why: A check should start with the drawer open. How: This waits until the button reports it expanded.


}

// #endregion opeDraFun

// #endregion Helpers



// #region Module Init

// #region Navigation Checks

for ( const [ labStr, ideStr ] of [ [ 'Services', 'services' ], [ 'About', 'about' ], [ 'Contact', 'contact' ] ] ) { // What: Section Link Loop. Why: Each of the bar's section links has its own target. How: This declares one test per link, pairing its label with its section's id.


	test( `the ${ labStr } link scrolls to its section`, async ( { page : curPagObj } ) => { // What: Section Link Test. Why: A section link has to take the visitor to its section. How: This clicks the link and checks the address and the section's position.


		await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The bar's own links show on wide screens. How: This opens the home page at desktop size.

		await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : labStr } ).click(); // What: Section Link Click Call. Why: This is the action under test. How: This clicks the bar's link by its label.


		await expect( curPagObj ).toHaveURL( new RegExp( `#${ ideStr }$` ) ); // What: Section Address Assertion. Why: The address should name the section, so it can be shared. How: This checks the URL ends with the section's anchor.

		expect( Math.abs( await secTopFun( curPagObj, ideStr ) ) ).toBeLessThan( 2 ); // What: Section Position Assertion. Why: The section should start at the top of the screen. How: This checks its top edge sits within a pixel of the viewport's top.


	} );


}



test( 'the Home link returns to the top', async ( { page : curPagObj } ) => { // What: Home Link Test. Why: Home has to bring a scrolled visitor back to the start. How: This scrolls down, clicks Home, and checks the scroll position.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The bar's Home link shows on wide screens. How: This opens the home page at desktop size.

	await curPagObj.evaluate( () => window.scrollTo( 0, 2000 ) ); // What: Scroll Down Call. Why: Home only matters away from the top. How: This scrolls the page down.

	await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : 'Home' } ).click(); // What: Home Link Click Call. Why: This is the action under test. How: This clicks the bar's Home link.


	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Top Position Assertion. Why: The visitor should end up back at the top. How: This waits until the page has scrolled all the way up.


} );



test( 'back to top returns to the top', async ( { page : curPagObj } ) => { // What: Back To Top Test. Why: The footer's link has to bring the visitor back up. How: This scrolls to the bottom, clicks the link, and checks the scroll position.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: Back to top sits at the bottom of the home page. How: This opens it at desktop size.

	await curPagObj.getByRole( 'link', { name : 'Back to top' } ).click(); // What: Back To Top Click Call. Why: This is the action under test. How: This clicks the footer's link, which Playwright scrolls into view first.


	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Top Position Assertion. Why: The visitor should end up back at the top. How: This waits until the page has scrolled all the way up.


} );



test( 'the logo links to the root address', async ( { page : curPagObj } ) => { // What: Logo Link Test. Why: The logo should load the home page from anywhere. How: This checks the brand link's address.


	await opeRouFun( curPagObj, '/missing', DES_VIE_OBJ ); // What: Not Found Open Call. Why: The logo matters most away from the home page. How: This opens the 404 page at desktop size.


	await expect( curPagObj.locator( 'header a[aria-hidden="true"]' ) ).toHaveAttribute( 'href', '/' ); // What: Root Address Assertion. Why: The logo points at the site's root, apart from Home's top anchor. How: This checks the hidden brand link's href.


} );

// #endregion Navigation Checks



// #region Drawer Checks

test( 'the menu toggle opens and closes the drawer', async ( { page : curPagObj } ) => { // What: Toggle Test. Why: The menu button is the drawer's main control. How: This opens the drawer, checks the page behind it is inert, then closes it again.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Home Open Call. Why: The drawer exists on small screens. How: This opens the home page at phone size.

	await opeDraFun( curPagObj ); // What: Drawer Open Call. Why: The open state comes first. How: This opens the drawer through its toggle.


	await expect( curPagObj.locator( 'main' ) ).toHaveAttribute( 'inert', '' ); // What: Inert Page Assertion. Why: The page under the dimmed scrim shouldn't take focus. How: This checks the main content is inert while the drawer is open.


	await curPagObj.getByRole( 'button', { name : 'Toggle menu' } ).click(); // What: Toggle Close Call. Why: The same button closes the drawer. How: This clicks it again.


	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Drawer Closed Assertion. Why: The drawer should close. How: This checks the button reports it collapsed.

	await expect( curPagObj.locator( 'main' ) ).not.toHaveAttribute( 'inert' ); // What: Live Page Assertion. Why: The page has to be usable again. How: This checks the main content is no longer inert.


} );



test( 'Escape closes the drawer and returns focus to the toggle', async ( { page : curPagObj } ) => { // What: Escape Test. Why: Escape is the expected way out of a layer over the page. How: This opens the drawer, presses Escape, and checks the drawer and focus.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Home Open Call. Why: The drawer exists on small screens. How: This opens the home page at phone size.

	await opeDraFun( curPagObj ); // What: Drawer Open Call. Why: Escape only matters with the drawer open. How: This opens it.

	await curPagObj.keyboard.press( 'Escape' ); // What: Escape Press Call. Why: This is the action under test. How: This presses Escape.


	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Drawer Closed Assertion. Why: Escape should close the drawer. How: This checks the button reports it collapsed.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toBeFocused(); // What: Toggle Focus Assertion. Why: Focus shouldn't be left inside the closed drawer. How: This checks it moved to the toggle.


} );



test( 'a tap on the dimmed page closes the drawer', async ( { page : curPagObj } ) => { // What: Scrim Test. Why: Tapping outside the drawer is a natural way to dismiss it. How: This opens the drawer, taps near the bottom of the screen, and checks it closed.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Home Open Call. Why: The drawer exists on small screens. How: This opens the home page at phone size.

	await opeDraFun( curPagObj ); // What: Drawer Open Call. Why: The scrim shows only while the drawer is open. How: This opens it.

	await curPagObj.mouse.click( 195, 830 ); // What: Scrim Tap Call. Why: This is the action under test. How: This clicks near the bottom middle of the screen, below the drawer, where only the scrim sits.


	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Drawer Closed Assertion. Why: The tap should close the drawer. How: This checks the button reports it collapsed.


} );



test( 'a drawer link closes the drawer and scrolls to its section', async ( { page : curPagObj } ) => { // What: Drawer Link Test. Why: Picking a section should both take the visitor there and get the drawer out of the way. How: This opens the drawer, picks About, and checks the drawer and the section.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Home Open Call. Why: The drawer exists on small screens. How: This opens the home page at phone size.

	await opeDraFun( curPagObj ); // What: Drawer Open Call. Why: The drawer's links show only while it's open. How: This opens it.

	await curPagObj.getByRole( 'link', { name : 'About' } ).click(); // What: Drawer Link Click Call. Why: This is the action under test. How: This clicks About, the only About link visible at phone size, since the bar's own links are hidden there.


	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Drawer Closed Assertion. Why: The drawer should close once a section is picked. How: This checks the button reports it collapsed.

	await expect.poll( async () => Math.abs( await secTopFun( curPagObj, 'about' ) ) ).toBeLessThan( 2 ); // What: Section Position Assertion. Why: The visitor should land on the section. How: This waits until its top edge sits within a pixel of the viewport's top.


} );



test( 'widening the screen closes the drawer', async ( { page : curPagObj } ) => { // What: Widen Test. Why: Past the breakpoint the toggle disappears, so an open drawer would leave the page inert with no way out. How: This opens the drawer, widens the viewport, and checks the drawer closed.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Home Open Call. Why: The drawer exists on small screens. How: This opens the home page at phone size.

	await opeDraFun( curPagObj ); // What: Drawer Open Call. Why: Widening only matters with the drawer open. How: This opens it.

	await curPagObj.setViewportSize( DES_VIE_OBJ ); // What: Widen Call. Why: This is the action under test. How: This resizes the viewport to desktop size.


	await expect( curPagObj.locator( 'main' ) ).not.toHaveAttribute( 'inert' ); // What: Live Page Assertion. Why: The page has to stay usable once the toggle is gone. How: This checks the main content is no longer inert.


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


	test.skip( engNamStr !== 'chromium', 'Reading a mailto navigation needs Chromium\'s DevTools Protocol.' ); // What: Chromium Only Skip. Why: Only Chromium reports a mailto navigation to the test, through its DevTools Protocol. How: This skips the test in the other engines.


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



test( 'Return home leads to the home page', async ( { page : curPagObj } ) => { // What: Return Home Test. Why: The 404 page's main action has to work. How: This clicks Return home and checks the address and title.


	await opeRouFun( curPagObj, '/missing', DES_VIE_OBJ ); // What: Not Found Open Call. Why: Return home lives on the 404 page. How: This opens it.

	await curPagObj.getByRole( 'link', { name : 'Return home' } ).click(); // What: Return Home Click Call. Why: This is the action under test. How: This clicks the button.


	await expect( curPagObj ).toHaveURL( /\/$/ ); // What: Home Address Assertion. Why: The visitor should land on the home page. How: This checks the URL ends at the root.

	await expect( curPagObj ).toHaveTitle( 'Reese Roofing | Portfolio Demo by techgeek.support' ); // What: Home Title Assertion. Why: The 404 page's title should give way to the home page's. How: This checks the title changed back.


} );



test( 'the 404 page leads to the contact section', async ( { page : curPagObj } ) => { // What: Not Found Estimate Test. Why: The 404 page offers the site's main action too. How: This clicks Get an estimate and checks the visitor lands on the contact section.


	await opeRouFun( curPagObj, '/missing', DES_VIE_OBJ ); // What: Not Found Open Call. Why: This button lives on the 404 page. How: This opens it.

	await curPagObj.getByRole( 'main' ).getByRole( 'link', { name : 'Get an estimate' } ).click(); // What: Estimate Click Call. Why: This is the action under test. How: This clicks the page's own estimate button rather than the bar's.


	await expect( curPagObj ).toHaveURL( /\/#contact$/ ); // What: Contact Address Assertion. Why: The button names the home page's contact section. How: This checks the URL.

	await expect( curPagObj.locator( '#contact' ) ).toBeVisible(); // What: Contact Render Wait. Why: The address changes before the home page has rendered, so the section has to exist before it's measured. How: This waits until the contact section is on the page.

	await expect.poll( async () => Math.abs( await secTopFun( curPagObj, 'contact' ) ) ).toBeLessThan( 2 ); // What: Contact Position Assertion. Why: The visitor should land on the form. How: This waits until the section's top edge sits within a pixel of the viewport's top.


} );

// #endregion Not Found Checks

// #endregion Module Init



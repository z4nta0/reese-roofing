


// #region Imports

import { expect      } from '@playwright/test';     // What: Expect. Why: Each state passes only when every control responds. How: This asserts each problem list is empty.
import { opeStaFun   } from '../support/states.ts'; // What: Open State Function. Why: Each check opens and settles its state first. How: This loads it and waits for it.
import { STA_REC_ARR } from '../support/states.ts'; // What: State Record Array. Why: Every page state is checked. How: This lists them.
import { test        } from '@playwright/test';     // What: Test. Why: Each check of each state is its own test. How: This declares them.


import type { ElementHandle } from '@playwright/test'; // What: Element Handle. Why: Each control is probed through a handle to its element. How: This types the control list.
import type { Page          } from '@playwright/test'; // What: Page. Why: Every helper drives a Playwright page. How: This types their page parameters.

// #endregion Imports



/**
 * feedback.spec.ts = Feedback Spec
 *
 * @summary
 * Checks the interaction feedback rule on every page state, in whichever
 * engine the project runs. Every link and button in the Tab order has to look
 * different while hovered than at rest, look different again while pressed,
 * have a transition longer than zero, and transition both of its focus ring's
 * outline properties, offset and width, and the first keyboard stop (or the
 * control a state's action left focused) has to draw that ring at full width
 * once it has eased in. Every form field a visitor can reach has to look
 * different once focused and have a transition longer than zero. The brand
 * link, which the Tab order skips, has to change on hover and again on press
 * too. Under reduced motion every control keeps its hover and press changes,
 * and every field its focus change, but nothing transitions, the parts inside
 * a control and their pseudo-elements included. Real clicks are blocked during
 * the checks, so pressing a link or the drawer's rows never navigates or
 * closes anything mid-check.
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

const SET_WAI_NUM = 400; // What: Settle Wait Number. Why: Each look is read once its transition has finished, and the longest interface transition runs about 367ms. How: This is the pause, in milliseconds, after each hover, press, or focus.

// #endregion Constants



// #region Helpers

// #region cliBloFun

/**
 * cliBloFun = Click Block Function
 *
 * @summary
 * Runs inside the page and cancels every click before anything handles it,
 * so pressing a control during a check never follows a link, opens a mail
 * app, or closes the drawer. It listens on the document in the capture
 * phase, ahead of React's own listener on the app's root, and both prevents
 * the click's default and stops it from going any further. Passed to
 * Playwright's evaluate, so it can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * page.evaluate(cliBloFun) // => void
 * ```
 *
*/

function cliBloFun () : void {


	document.addEventListener( 'click', ( cliEveObj ) => { // What: Click Block Listener. Why: A press during a check shouldn't do anything. How: This cancels every click in the capture phase, before the page or React sees it.


		cliEveObj.preventDefault(); // What: Default Prevention Call. Why: A link shouldn't navigate mid-check. How: This cancels the click's default.

		cliEveObj.stopPropagation(); // What: Propagation Stop Call. Why: React's handlers, such as the drawer link closing the drawer, shouldn't run either. How: This keeps the click from reaching the app's root.


	}, true ); // What: Capture Phase Flag. Why: The block has to run before anything else sees the click. How: This registers the listener for the capture phase.


}

// #endregion cliBloFun



// #region conLisFun

/**
 * conLisFun = Control List Function
 *
 * @summary
 * Collects every control a visitor can reach on the page as it stands: each
 * link and button that's visible, not taken out of the tab order with
 * tabindex -1 (the hidden logo link), and not inside inert content (the page
 * behind the open drawer). Handles are taken once, so restyling while the
 * checks scroll (the nav bar's scrolled look) can't shift the list.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to collect from.
 *
 * @returns Every reachable control.
 * @see {@link conHanArr}
 *
 * @example
 * ```ts
 * conLisFun(page) // => [ ElementHandle, ... ]
 * ```
 *
*/

async function conLisFun ( curPagObj : Page ) : Promise< ElementHandle< Element >[] > {


	const conHanArr : ElementHandle< Element >[] = []; // What: Control Handle Array. Why: The reachable controls are gathered one by one. How: This collects them.


	for ( const conCurObj of await curPagObj.$$( 'a, button' ) ) { // What: Control Loop. Why: Every link and button is judged on its own. How: This keeps each one a visitor can reach.


		const conReaBoo = await conCurObj.evaluate( ( conCurEle ) => conCurEle.getAttribute( 'tabindex' ) !== '-1' && !conCurEle.closest( '[inert]' ) ); // What: Control Reachable Boolean. Why: A control outside the tab order or inside inert content can't be reached. How: This checks both inside the page.


		if ( conReaBoo && await conCurObj.isVisible() ) conHanArr.push( conCurObj ); // What: Reachable Control Record. Why: Only controls a visitor can see and reach are checked. How: This keeps the control when it's both.


	}



	return conHanArr; // What: Control Handle Return. Why: The probes run on the controls a visitor can reach. How: This hands back their handles.


}

// #endregion conLisFun



// #region sigEleFun

/**
 * sigEleFun = Signature Element Function
 *
 * @summary
 * Runs inside the page and describes how a control looks right now, as one
 * string of the styles feedback usually changes (color, background, border
 * color, transform, and opacity) for the control and every element inside
 * it, so a change to its arrow or its label counts as the control's own.
 * Passed to Playwright's evaluate, so it can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param eleCurEle - Element Current Element: The control to describe.
 *
 * @returns The control's look, as one string to compare.
 *
 * @example
 * ```ts
 * handle.evaluate(sigEleFun) // => 'rgb(...),rgba(...),rgb(...),none,1|...'
 * ```
 *
*/

function sigEleFun ( eleCurEle : Element ) : string {


	const sigStyFun = ( sigCurEle : Element ) => { // What: Signature Style Function. Why: Each element's look is read the same way. How: This joins one element's feedback styles into one string.


		const styCurObj = getComputedStyle( sigCurEle ); // What: Style Current Object. Why: The element's styles are read as they're drawn now. How: This reads its computed styles.



		return [ styCurObj.color, styCurObj.backgroundColor, styCurObj.borderColor, styCurObj.transform, styCurObj.opacity ].join( ',' ); // What: Element Signature Return. Why: One element's look compares as one string. How: This joins its feedback styles.


	};



	return [ eleCurEle, ...eleCurEle.querySelectorAll( '*' ) ].map( sigStyFun ).join( '|' ); // What: Signature Return. Why: Two looks compare as one string. How: This joins the signatures of the control and everything inside it.


}

// #endregion sigEleFun



// #region feeProFun

/**
 * feeProFun = Feedback Problems Function
 *
 * @summary
 * Probes every reachable control and returns a problem for each one that gives
 * no feedback. Each control is scrolled into view, read at rest with the
 * pointer away, read again while hovered, and again while the mouse button is
 * held on it, every look read once its transition has settled. A control that
 * looks the same at rest and hovered, or hovered and pressed, is a problem.
 * Normally its transition list must include both of the focus ring's outline
 * properties, offset and width, so the ring eases in; under reduced motion
 * every transition duration on it, every element inside it, and their before
 * and after pseudo-elements must be zero instead. Outside reduced motion, a
 * control whose every transition duration is zero is a problem too.
 * The caller blocks real clicks first, so releasing the mouse does nothing.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to probe.
 * @param redMotBoo - Reduced Motion Boolean: Whether the page is emulating
 *                    reduced motion.
 *
 * @returns Every feedback problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * feeProFun(page, false) // => [ 'a "Home" looks the same pressed' ]
 * ```
 *
*/

async function feeProFun ( curPagObj : Page, redMotBoo : boolean ) : Promise< string[] > {


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.


	for ( const conCurObj of await conLisFun( curPagObj ) ) { // What: Control Probe Loop. Why: Every reachable control has to respond. How: This reads each one at rest, hovered, and pressed.


		const conDesStr = await conCurObj.evaluate( ( conCurEle ) => `${ conCurEle.tagName.toLowerCase() } "${ ( conCurEle.getAttribute( 'aria-label' ) || conCurEle.textContent || '' ).trim().slice( 0, 30 ) }"` ); // What: Control Description String. Why: A problem should name the control a person would recognize. How: This joins its tag with its label or text.


		await conCurObj.scrollIntoViewIfNeeded(); // What: Control Scroll Call. Why: A control has to be on screen to hover or press. How: This scrolls it into view.

		await curPagObj.mouse.move( 0, 0 ); // What: Pointer Away Call. Why: The resting look is read with nothing hovered. How: This moves the pointer to the corner of the bar.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Rest Settle Wait. Why: Any earlier hover has to finish fading. How: This pauses for the settle time.


		const resSigStr = await conCurObj.evaluate( sigEleFun ); // What: Rest Signature String. Why: The resting look is what hover is compared with. How: This reads it.


		await conCurObj.hover(); // What: Control Hover Call. Why: Hover feedback is the first thing checked. How: This moves the pointer onto the control.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Hover Settle Wait. Why: The hover look is read once it has eased in. How: This pauses for the settle time.


		const hovSigStr = await conCurObj.evaluate( sigEleFun ); // What: Hover Signature String. Why: The hovered look is compared with rest and with pressed. How: This reads it.


		await curPagObj.mouse.down(); // What: Mouse Down Call. Why: A press shows while the button is held. How: This holds the mouse button down on the control.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Press Settle Wait. Why: The pressed look is read once it has eased in. How: This pauses for the settle time.


		const allDurStr = await conCurObj.evaluate( ( conCurEle ) => [ conCurEle, ...conCurEle.querySelectorAll( '*' ) ].flatMap( ( eleCurEle ) => [ null, '::before', '::after' ].map( ( pseCurStr ) => getComputedStyle( eleCurEle, pseCurStr ).transitionDuration ) ).join( ', ' ) ); // What: All Duration String. Why: A control often moves through its own parts, such as an arrow, a label, or an underline drawn by a pseudo-element, each with its own transition. How: This reads the transition durations of the control, every element inside it, and their before and after pseudo-elements.
		const preSigStr = await conCurObj.evaluate( sigEleFun );                                                         // What: Press Signature String. Why: The pressed look is compared with hovered. How: This reads it.
		const traLisStr = await conCurObj.evaluate( ( conCurEle ) => getComputedStyle( conCurEle ).transitionProperty ); // What: Transition List String. Why: The focus ring's ease depends on the control listing its outline. How: This reads the control's transitioned properties.
		const traDurStr = await conCurObj.evaluate( ( conCurEle ) => getComputedStyle( conCurEle ).transitionDuration ); // What: Transition Duration String. Why: Normal motion should ease every change of the control itself. How: This reads the control's own transition durations.


		await curPagObj.mouse.up(); // What: Mouse Up Call. Why: The press has to end before the next control. How: This releases the button, whose click the caller has blocked.



		if ( resSigStr === hovSigStr ) proLisArr.push( `${ conDesStr } looks the same hovered` ); // What: Hover Check. Why: A hovered control has to respond. How: This records one that doesn't change.



		if ( hovSigStr === preSigStr ) proLisArr.push( `${ conDesStr } looks the same pressed` ); // What: Press Check. Why: A press has to register before anything happens. How: This records one that doesn't change.



		if ( redMotBoo && !/^0s(, 0s)*$/.test( allDurStr ) ) proLisArr.push( `${ conDesStr } still transitions under reduced motion (${ allDurStr })` ); // What: Reduced Motion Check. Why: Asking for less motion should stop every transition. How: This records a control with any duration above zero on itself, an element inside it, or their pseudo-elements.

		else if ( !redMotBoo && !( traLisStr.includes( 'outline-offset' ) && traLisStr.includes( 'outline-width' ) ) ) proLisArr.push( `${ conDesStr } doesn't transition its focus ring` ); // What: Focus Ease Check. Why: The focus ring should ease in rather than snap. How: This records a control whose transition list leaves out either outline property.



		if ( !redMotBoo && /^0s(, 0s)*$/.test( traDurStr ) ) proLisArr.push( `${ conDesStr } has no transition` ); // What: Transition Duration Check. Why: Every hover, press, and focus change should ease rather than snap. How: This records a control whose every transition duration is zero outside reduced motion.


	}



	return proLisArr; // What: Problem List Return. Why: The feedback tests fail on any recorded problem. How: This hands back every control whose feedback fell short.


}

// #endregion feeProFun



// #region fieProFun

/**
 * fieProFun = Field Problems Function
 *
 * @summary
 * Probes every form field a visitor can reach for the feedback the rule asks
 * of a field, a visible change when it takes focus, and returns what's
 * missing. Each field is read at rest, then focused and read again once its
 * transition has had time to finish, along with its transition durations, then
 * blurred. A field that looks the same focused is a problem, and so is one
 * with no transition at all outside reduced motion, or any transition under
 * it. Fields aren't held to the hover and press checks, which the rule asks of
 * links, buttons, and cards. A field that's hidden, or inert behind the open
 * drawer, is skipped.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page whose fields are probed.
 * @param redMotBoo - Reduced Motion Boolean: Whether the page is emulating
 *                    reduced motion, which decides whether a field should
 *                    ease.
 *
 * @returns Every field focus problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * fieProFun(page, false) // => [ 'input "conNamInp" looks the same focused' ]
 * ```
 *
*/

async function fieProFun ( curPagObj : Page, redMotBoo : boolean ) : Promise< string[] > {


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.


	for ( const fieCurObj of await curPagObj.$$( 'input, select, textarea' ) ) { // What: Field Probe Loop. Why: Every field has to show it took focus. How: This reads each one at rest and focused.


		const fieReaBoo = await fieCurObj.evaluate( ( fieCurEle ) => fieCurEle.getClientRects().length > 0 && !fieCurEle.closest( '[inert]' ) ); // What: Field Reachable Boolean. Why: A hidden or inert field can't take focus. How: This is true when the field is rendered outside inert content.


		if ( !fieReaBoo ) continue; // What: Unreachable Field Guard. Why: Only fields a visitor can reach are judged. How: This skips the rest.



		const fieDesStr = await fieCurObj.evaluate( ( fieCurEle ) => `${ fieCurEle.tagName.toLowerCase() } "${ fieCurEle.id }"` );                              // What: Field Description String. Why: A problem should name the field. How: This joins its tag and its id.
		const resSigStr = await fieCurObj.evaluate( sigEleFun ) + await fieCurObj.evaluate( ( fieCurEle ) => getComputedStyle( fieCurEle ).borderBottomColor ); // What: Rest Signature String. Why: The focused look is compared with the field at rest. How: This reads its signature plus its underline color, which a field's focus changes.


		await fieCurObj.focus(); // What: Field Focus Call. Why: The focused look is the one being checked. How: This moves focus onto the field.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Focus Settle Wait. Why: The focused look is read once its transition has finished. How: This pauses for the settle time.


		const focSigStr = await fieCurObj.evaluate( sigEleFun ) + await fieCurObj.evaluate( ( fieCurEle ) => getComputedStyle( fieCurEle ).borderBottomColor ); // What: Focus Signature String. Why: The field should look different once it has focus. How: This reads the same signature while it's focused.
		const traDurStr = await fieCurObj.evaluate( ( fieCurEle ) => getComputedStyle( fieCurEle ).transitionDuration );                                        // What: Transition Duration String. Why: The change should ease, or switch at once under reduced motion. How: This reads the field's transition durations.


		await fieCurObj.evaluate( ( fieCurEle ) => ( fieCurEle as HTMLElement ).blur() ); // What: Field Blur Call. Why: The next field starts from a page with nothing focused. How: This takes focus off the field. // What: Type Assertion Note. Why: The handle types as a plain Element. How: Every element the selector matches is a form field, an HTMLElement.



		if ( resSigStr === focSigStr ) proLisArr.push( `${ fieDesStr } looks the same focused` ); // What: Focus Change Check. Why: A focused field has to show it. How: This records one that doesn't change.



		if ( redMotBoo && !/^0s(, 0s)*$/.test( traDurStr ) ) proLisArr.push( `${ fieDesStr } still transitions under reduced motion (${ traDurStr })` ); // What: Reduced Motion Check. Why: Asking for less motion should stop every transition. How: This records a field with any duration above zero.

		else if ( !redMotBoo && /^0s(, 0s)*$/.test( traDurStr ) ) proLisArr.push( `${ fieDesStr } has no transition` ); // What: Field Ease Check. Why: A field's focus change should ease rather than snap. How: This records a field whose every transition duration is zero.


	}



	return proLisArr; // What: Problem List Return. Why: The feedback tests fail on any recorded problem. How: This hands back every field whose focus feedback fell short.


}

// #endregion fieProFun

// #endregion Helpers



// #region Module Init

for ( const staRecObj of STA_REC_ARR ) { // What: State Test Loop. Why: Every page state is checked. How: This declares each check once per state.


	test( `${ staRecObj.ideStr } gives every control hover, press, and focus feedback`, async ( { page : curPagObj } ) => { // What: Feedback Test. Why: Every interaction should visibly register. How: This opens the state, blocks clicks, and probes every field and control.


		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The controls are probed with the state settled. How: This loads and settles it.

		await curPagObj.evaluate( cliBloFun ); // What: Click Block Call. Why: Pressing a control shouldn't navigate or close anything. How: This cancels every click from here on.


		expect( await fieProFun( curPagObj, false ) ).toEqual( [] ); // What: No Field Problems Assertion. Why: Every field has to show it took focus and have a transition longer than zero. How: This compares the field problems with an empty list.
		expect( await feeProFun( curPagObj, false ) ).toEqual( [] ); // What: No Feedback Problems Assertion. Why: The state passes only when every control responds. How: This compares the problems with an empty list, so a failure prints each one.


	} );



	test( `${ staRecObj.ideStr } draws its focus ring at full width`, async ( { browserName : engNamStr, page : curPagObj } ) => { // What: Focus Ring Test. Why: A keyboard user has to see where focus lands. How: This tabs to the first stop, or back onto the control the state's action left focused, and reads its ring once it has eased in.


		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The walk starts from the state settled. How: This loads and settles it.


		const staFocBoo = await curPagObj.evaluate( () => document.activeElement !== document.body ); // What: Start Focused Boolean. Why: A state's action can leave a control focused by a click, such as the drawer's toggle, which a plain Tab would step past unchecked. How: This is true when something other than the body holds focus.
		const tabKeyStr = engNamStr === 'webkit' ? 'Alt+Tab' : 'Tab';                                 // What: Tab Key String. Why: WebKit skips links on a plain Tab, the way Safari does. How: This holds Alt with Tab in WebKit and a plain Tab elsewhere.


		if ( staFocBoo ) await curPagObj.keyboard.press( tabKeyStr ); // What: Focused Start Step. Why: A control focused by a click shows no focus ring, so the test has to reach it by keyboard. How: This tabs one stop past it, so the press below can come back.



		await curPagObj.keyboard.press( staFocBoo ? `Shift+${ tabKeyStr }` : tabKeyStr ); // What: First Stop Press Call. Why: The ring shows only for keyboard focus. How: This tabs to the first stop, or with Shift lands back on the control the state's action left focused.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Ring Settle Wait. Why: The ring is read once it has grown in. How: This pauses for the settle time.


		expect( await curPagObj.evaluate( () => getComputedStyle( document.activeElement! ).outlineWidth ) ).toBe( '2px' ); // What: Full Ring Assertion. Why: The ring has to reach its full width. How: This reads the focused stop's outline width, which the large border width token snaps to 2px. // What: Non-Null Note. Why: activeElement types as possibly null. How: The press just put focus on a stop.


	} );



	test( `${ staRecObj.ideStr } keeps feedback without motion under reduced motion`, async ( { page : curPagObj } ) => { // What: Reduced Motion Feedback Test. Why: Visitors who ask for less motion still need to see their actions register. How: This probes every field and control with reduced motion on.


		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The preference has to be set before the page loads. How: This makes the page match prefers-reduced-motion: reduce.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The controls are probed with the state settled. How: This loads and settles it.

		await curPagObj.evaluate( cliBloFun ); // What: Click Block Call. Why: Pressing a control shouldn't navigate or close anything. How: This cancels every click from here on.


		expect( await fieProFun( curPagObj, true ) ).toEqual( [] ); // What: No Reduced Motion Field Problems Assertion. Why: Every field has to show it took focus without easing. How: This compares the field problems with an empty list.
		expect( await feeProFun( curPagObj, true ) ).toEqual( [] ); // What: No Reduced Motion Problems Assertion. Why: Every control has to respond without moving. How: This compares the problems with an empty list, so a failure prints each one.


	} );


}


for ( const redMotBoo of [ false, true ] ) { // What: Brand Motion Loop. Why: The brand link's feedback has to hold with and without reduced motion. How: This declares the brand check once for each preference.


	test( `the brand link responds to hover and press${ redMotBoo ? ' under reduced motion' : '' }`, async ( { page : curPagObj } ) => { // What: Brand Feedback Test. Why: The brand link is hidden from screen readers and out of the Tab order, so the control checks never reach it, though a pointer still can. How: This hovers and presses the brand link on the home page and checks its look changes each time, easing normally and switching at once under reduced motion.


		const homRecObj = STA_REC_ARR.find( ( staCurObj ) => staCurObj.ideStr === 'home-desktop' )!; // What: Home Record Object. Why: The brand link sits in the bar on every page, and the home page is its usual one. How: This finds the home desktop state's row. // What: Non-Null Note. Why: find types its result as possibly undefined. How: STA_REC_ARR always lists the home-desktop state.


		if ( redMotBoo ) await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The reduced-motion run needs the preference before the page loads. How: This makes the page match prefers-reduced-motion: reduce.



		await opeStaFun( curPagObj, homRecObj ); // What: Home State Open Call. Why: The brand link is probed with the page settled. How: This loads the home page at desktop size.

		await curPagObj.evaluate( cliBloFun ); // What: Click Block Call. Why: Pressing the brand link shouldn't load the home page mid-check. How: This cancels every click from here on.


		const braAncObj = curPagObj.locator( 'header a[aria-hidden="true"]' ); // What: Brand Anchor Object. Why: The brand link is the one link the bar hides from screen readers. How: This finds it by that attribute.


		await curPagObj.mouse.move( 700, 600 ); // What: Pointer Away Call. Why: The resting look is read with nothing hovered. How: This moves the pointer into the page, away from the bar.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Rest Settle Wait. Why: The resting look is read once any transition has finished. How: This pauses for the settle time.


		const resSigStr = await braAncObj.evaluate( sigEleFun ); // What: Rest Signature String. Why: The hovered look is compared with this one. How: This reads the brand link's look at rest.


		await braAncObj.hover(); // What: Hover Call. Why: This is the first action under test. How: This moves the pointer onto the brand link.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Hover Settle Wait. Why: The hovered look is read once it has eased in. How: This pauses for the settle time.


		const hovSigStr = await braAncObj.evaluate( sigEleFun ); // What: Hover Signature String. Why: The pressed look is compared with this one. How: This reads the brand link's hovered look.


		await curPagObj.mouse.down(); // What: Mouse Down Call. Why: A press shows while the button is held. How: This holds the mouse button down on the brand link.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Press Settle Wait. Why: The pressed look is read once it has eased in. How: This pauses for the settle time.


		const allDurStr = await braAncObj.evaluate( ( braCurEle ) => [ braCurEle, ...braCurEle.querySelectorAll( '*' ) ].map( ( eleCurEle ) => getComputedStyle( eleCurEle ).transitionDuration ).join( ', ' ) ); // What: All Duration String. Why: The brand link changes through its mark and name as well as itself. How: This reads the transition durations of the link and every element inside it.
		const preSigStr = await braAncObj.evaluate( sigEleFun ); // What: Press Signature String. Why: The pressed look is compared with the hovered one. How: This reads the brand link's pressed look.


		await curPagObj.mouse.up(); // What: Mouse Up Call. Why: The press has to end. How: This releases the button, whose click is blocked.


		expect( hovSigStr ).not.toBe( resSigStr ); // What: Hover Change Assertion. Why: A hovered link has to respond. How: This checks the hovered look differs from the resting one.

		expect( preSigStr ).not.toBe( hovSigStr ); // What: Press Change Assertion. Why: A press has to register before anything happens. How: This checks the pressed look differs from the hovered one.

		expect( /^0s(, 0s)*$/.test( allDurStr ) ).toBe( redMotBoo ); // What: Motion Assertion. Why: The changes should ease normally and switch at once under reduced motion. How: This checks every duration is zero exactly when reduced motion is on.


	} );


}

// #endregion Module Init



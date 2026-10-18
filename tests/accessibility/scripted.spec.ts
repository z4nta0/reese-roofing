


// #region Imports

import { expect      } from '@playwright/test';     // What: Expect. Why: Each check passes only with no problems found. How: This asserts each problem list is empty.
import { opeStaFun   } from '../support/states.ts'; // What: Open State Function. Why: Each check opens and settles its state first. How: This loads it and waits for it.
import { STA_REC_ARR } from '../support/states.ts'; // What: State Record Array. Why: Every page state is checked. How: This lists them, and the drawer close, sent label motion, and sent announcement tests find their starting rows in it.
import { test        } from '@playwright/test';     // What: Test. Why: Each check of each state is its own test. How: This declares them.


import type { Page } from '@playwright/test'; // What: Page. Why: Every helper drives a Playwright page. How: This types their page parameters.

// #endregion Imports



/**
 * scripted.spec.ts = Scripted Spec
 *
 * @summary
 * The accessibility checks axe-core can't make, run on every page state in
 * whichever engine the project runs. Names: every link and button in the
 * accessibility tree has a name, and no name carries a decorative glyph such
 * as an arrow. Keyboard: a Tab walk from the top of the page, or from the
 * control a state's action left focused, reaches its end without getting
 * trapped, never moves backwards through the document, and lands only on stops
 * that are on screen, not covered by anything else, and visibly changed by
 * focus. Reflow: at 320px wide, WCAG's narrowest reflow width, nothing scrolls
 * sideways. Motion: with reduced motion requested, no animation or transition
 * longer than 1ms starts while the state opens, or is still held once it has,
 * and the same holds while the drawer closes and while the sent form's label
 * swaps in. Announcement: sending the form fills a status region that sat in
 * the page, empty, from the start, so screen readers are told the email is
 * opening. The name and keyboard checks list every problem found, by element
 * (the positive tabindex check as a count), the motion check lists each one it
 * finds, and the reflow check reports how far the page reaches past the
 * viewport.
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

const GLY_DEC_REG = /[←↑→↓·•]/; // What: Glyph Decorative Regular Expression. Why: A decorative glyph inside a name is read aloud as noise, such as right arrow. How: This matches the arrows and dots the site draws as decoration.
const REF_WID_NUM = 320;        // What: Reflow Width Number. Why: WCAG's reflow criterion asks for no sideways scrolling at 320 CSS pixels, the width of 1,280px at 400% zoom. How: This is the viewport width the reflow check opens each state at.
const TAB_MAX_NUM = 80;         // What: Tab Maximum Number. Why: A keyboard trap would otherwise keep the walk going forever. How: This caps the walk at far more Tab presses than the site has stops.

// #endregion Constants



// #region Helpers

// #region lonAniFun

/**
 * lonAniFun = Long Animations Function
 *
 * @summary
 * Runs inside the page and lists every animation or transition the page
 * still holds that lasts longer than 1ms, naming each by its CSS animation
 * name or transitioned property, or as a script animation when it has
 * neither. Passed to Playwright's evaluate, so it can't read anything from
 * this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The names of the long animations the page still holds.
 *
 * @example
 * ```ts
 * page.evaluate(lonAniFun) // => [ 'max-height' ]
 * ```
 *
*/

function lonAniFun () : string[] {


	return document.getAnimations().filter( ( aniCurObj ) => ( Number( aniCurObj.effect?.getTiming().duration ) || 0 ) > 1 ).map( ( aniCurObj ) => ( aniCurObj as CSSAnimation ).animationName || ( aniCurObj as CSSTransition ).transitionProperty || 'script animation' ); // What: Long Animations Return. Why: The check needs the name of each motion still running. How: This keeps the animations and transitions longer than 1ms and maps each to its name. // What: Type Assertion Note. Why: getAnimations returns plain Animation objects, which don't type their CSS names. How: Each one is read as a CSS animation, then a CSS transition, falling back to a generic label when neither name exists.


}

// #endregion lonAniFun



// #region motRecFun

/**
 * motRecFun = Motion Recorder Function
 *
 * @summary
 * Runs inside the page from the moment it loads, as an init script, and
 * records every animation or transition that starts with a duration over 1ms
 * on window.motLisArr, naming each by its element's tag and its event's kind.
 * A transition an action sets off can finish before the check reads the page,
 * and a finished one drops out of getAnimations, so the recorder listens for
 * each motion as it starts instead. It listens in the capture phase, so
 * nothing on the page can stop it hearing one, and reads a pseudo-element's
 * own duration when the motion runs on one. Passed to Playwright's
 * addInitScript, so it can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * page.addInitScript(motRecFun) // => void
 * ```
 *
*/

function motRecFun () : void {


	const motLisArr : string[] = []; // What: Motion List Array. Why: Each motion that starts has to be kept until the check reads it. How: This collects one name per motion.


	Reflect.set( window, 'motLisArr', motLisArr ); // What: Motion List Global Set. Why: The check reads the list from outside the page. How: This puts the array on the window.


	for ( const eveTypStr of [ 'animationstart', 'transitionrun' ] ) window.addEventListener( eveTypStr, ( motEveObj ) => { // What: Motion Event Loop. Why: Animations and transitions announce themselves with different events. How: This listens for each on the window in the capture phase, catching every element's events before they reach it.


		const tarEleObj = motEveObj.target as Element;                                                                                       // What: Target Element Object. Why: The motion's duration is read from the element running it. How: This reads the event's target. // What: Type Assertion Note. Why: Event targets type as EventTarget. How: Both events only fire on elements.
		const motStyObj = getComputedStyle( tarEleObj, ( motEveObj as AnimationEvent ).pseudoElement || null );                              // What: Motion Style Object. Why: The event doesn't carry the motion's duration. How: This reads the computed styles of the element, or of its pseudo-element when the motion runs on one. // What: Type Assertion Note. Why: The listener types its event as a plain Event. How: Both animation and transition events carry pseudoElement, read here through the animation event's type.
		const durStrArr = ( motEveObj.type === 'transitionrun' ? motStyObj.transitionDuration : motStyObj.animationDuration ).split( ',' );  // What: Duration String Array. Why: An element can list several durations. How: This splits the duration that matches the event's kind.
		const lonDurBoo = durStrArr.some( ( durCurStr ) => parseFloat( durCurStr ) * ( durCurStr.trim().endsWith( 'ms' ) ? 1 : 1000 ) > 1 ); // What: Long Duration Boolean. Why: Only motion longer than 1ms counts. How: This converts each duration to milliseconds and checks for one over 1ms.


		if ( lonDurBoo ) motLisArr.push( `${ tarEleObj.tagName.toLowerCase() } ${ motEveObj.type }` ); // What: Long Motion Push. Why: Each long motion should be named in the failure. How: This records the element's tag and the event's kind.


	}, true ); // What: Capture Phase Flag. Why: The recorder has to see each motion event before anything on the page can stop it. How: This registers the listener for the capture phase.


}

// #endregion motRecFun



// #region namProFun

/**
 * namProFun = Name Problems Function
 *
 * @summary
 * Reads the page's accessibility tree, the same tree a screen reader reads,
 * and returns a problem for every link or button with no name, and for every
 * one whose name contains a decorative glyph that should have been hidden.
 * Elements hidden from assistive technology don't appear in the tree, so the
 * hidden logo link and the hidden arrows are never counted.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to read.
 *
 * @returns Every naming problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * namProFun(page) // => [ '- link "Home →" has a decorative glyph ...' ]
 * ```
 *
*/

async function namProFun ( curPagObj : Page ) : Promise< string[] > {


	const ariSnaStr = await curPagObj.locator( 'body' ).ariaSnapshot();    // What: ARIA Snapshot String. Why: The accessibility tree shows each control's role and announced name. How: This reads the body's tree as text, one node per line.
	const conLinArr = ariSnaStr.match( /- (link|button)\b[^\n]*/g ) || []; // What: Control Line Array. Why: Only links and buttons are checked here. How: This keeps every tree line for one of those roles.

	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.


	for ( const conLinStr of conLinArr ) { // What: Control Line Loop. Why: Each link and button is judged on its own. How: This reads each line's name and records what's wrong with it.


		const conNamStr = ( conLinStr.match( /"([^"]*)"/ ) || [] )[ 1 ] || ''; // What: Control Name String. Why: The announced name sits in quotes after the role. How: This takes the quoted text, or an empty name when there's none.


		if ( !conNamStr.trim() ) proLisArr.push( `${ conLinStr } has no name` ); // What: Missing Name Check. Why: A control with no name is announced as just its role. How: This records the line when its name is empty.

		else if ( GLY_DEC_REG.test( conNamStr ) ) proLisArr.push( `${ conLinStr } has a decorative glyph in its name` ); // What: Glyph Name Check. Why: A decorative arrow in a name is read aloud. How: This records the line when its name contains one.


	}



	return proLisArr; // What: Problem List Return. Why: The names test fails on any recorded problem. How: This hands back every badly named control found.


}

// #endregion namProFun



// #region scrSetFun

/**
 * scrSetFun = Scroll Settled Function
 *
 * @summary
 * Runs inside the page and resolves once the page has stopped scrolling,
 * meaning its scroll position hasn't changed for 15 frames in a row (about a
 * quarter of a second), or after 2 seconds at most. WebKit scrolls a focused
 * text field into view a few frames after focusing it rather than at once,
 * so measuring a stop straight after the Tab press would find it still off
 * screen. Passed to Playwright's evaluate, so it can't read anything from
 * this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns A promise that settles once scrolling has stopped, with no value.
 *
 * @example
 * ```ts
 * page.evaluate(scrSetFun) // => Promise<void>
 * ```
 *
*/

function scrSetFun () : Promise< void > {


	return new Promise( ( resSetFun ) => { // What: Settle Promise Return. Why: The walk waits on the page's frames. How: This resolves from inside a frame loop once scrolling has stopped.


		const staTimNum = performance.now(); // What: Start Time Number. Why: A page that never stops scrolling shouldn't hang the walk. How: This records when the wait began.

		let preScrNum = scrollY; // What: Previous Scroll Number. Why: Each frame is compared with the one before. How: This holds the last frame's scroll position.
		let staFraNum = 0;       // What: Stable Frame Number. Why: Scrolling has settled only after several unchanged frames. How: This counts them in a row.


		const fraCheFun = () => { // What: Frame Check Function. Why: Scrolling is judged once per frame. How: This counts unchanged frames and resolves after 15 of them or 2 seconds.


			staFraNum = scrollY === preScrNum ? staFraNum + 1 : 0; // What: Stable Frame Update. Why: Any movement restarts the count. How: This adds one for an unchanged frame and resets it otherwise.

			preScrNum = scrollY; // What: Previous Scroll Update. Why: The next frame is compared with this one. How: This stores this frame's position.



			if ( staFraNum >= 15 || performance.now() - staTimNum > 2000 ) { resSetFun(); return; } // What: Settled Guard. Why: The wait ends once scrolling has stopped, or after 2 seconds. How: This resolves the promise and stops the loop.



			requestAnimationFrame( fraCheFun ); // What: Next Frame Call. Why: Scrolling is checked again next frame. How: This schedules the check.


		};


		requestAnimationFrame( fraCheFun ); // What: First Frame Call. Why: The loop starts on the next frame. How: This schedules the first check.


	} );


}

// #endregion scrSetFun



type StoInfTyp = { // What: Stop Information Type. Why: The keyboard walk judges each stop outside the page. How: This describes what the page reports about one stop.


	covBoo : boolean, // What: Covered Boolean. Why: A stop hidden behind another element can't be seen while focused. How: This is true when something else sits on top of the stop's center.
	desStr : string,  // What: Description String. Why: A problem should name the element a person would recognize. How: This joins the stop's tag and its label or text.
	indBoo : boolean, // What: Indicator Boolean. Why: A keyboard user has to see where focus is. How: This is true when focusing the stop changes how it looks.
	ordNum : number,  // What: Order Number. Why: Focus order is compared with document order. How: This is the stop's position among every element in the page.
	visBoo : boolean  // What: Visible Boolean. Why: A stop off screen leaves a keyboard user lost. How: This is true when the stop has a size and overlaps the viewport.


};

// #region stoInfFun

/**
 * stoInfFun = Stop Information Function
 *
 * @summary
 * Runs inside the page after each Tab press and describes the focused stop, or
 * returns null once focus has left the page: onto the body, to nothing, or out
 * of the document entirely. (Firefox does none of these after its last stop;
 * keyProFun catches it there instead, when focus stays on the same stop.) The
 * focus indicator is judged by blurring the stop for a moment and comparing
 * the styles a focus indicator usually changes (outline, shadow, border,
 * background, color, and underline), then focusing it again so the walk
 * continues from it. Coverage is judged by asking which element sits at the
 * stop's center: anything other than the stop or one of its own descendants
 * means the stop is hidden behind it. Passed to Playwright's evaluate, so it
 * can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The stop's description, or null when the walk has ended.
 *
 * @example
 * ```ts
 * page.evaluate(stoInfFun) // => { covBoo, desStr, indBoo, ordNum, visBoo }
 * ```
 *
*/

function stoInfFun () : StoInfTyp | null {


	const actCurEle = document.activeElement as HTMLElement | null; // What: Active Current Element. Why: The stop is whatever holds focus after the press. How: This reads the focused element. // What: Type Assertion Note. Why: activeElement types as Element, which has no blur or focus. How: Every element that can hold focus on this site is an HTMLElement.

	const actBodBoo = actCurEle === document.body; // What: Active Body Boolean. Why: Focus resting on the body means no stop holds it. How: This compares the focused element with the body.
	const actMisBoo = !actCurEle;                  // What: Active Missing Boolean. Why: Some engines report no focused element at all once focus leaves. How: This is true when there is none.
	const docBluBoo = !document.hasFocus();        // What: Document Blurred Boolean. Why: Focus can leave for the browser's own interface. How: This is true when the document no longer has focus.

	const walDonBoo = actMisBoo || actBodBoo || docBluBoo; // What: Walk Done Boolean. Why: Any of the three means the walk has left the page. How: This combines them.


	if ( walDonBoo ) return null; // What: Walk End Guard. Why: Focus on the body, nowhere, or outside the document means the walk has left the page. How: This returns null to end the walk.



	const sigStyFun = () => { // What: Signature Style Function. Why: A focus indicator is any visible change between focused and unfocused. How: This reads the stop's styles as one string to compare.


		const styCurObj = getComputedStyle( actCurEle ); // What: Style Current Object. Why: The stop's styles are compared as they're drawn now. How: This reads its computed styles.



		return [ styCurObj.outlineStyle, styCurObj.outlineWidth, styCurObj.outlineColor, styCurObj.boxShadow, styCurObj.borderColor, styCurObj.backgroundColor, styCurObj.color, styCurObj.textDecorationLine ].join( '|' ); // What: Signature Return. Why: Two looks compare as one string. How: This joins every style a focus indicator usually changes.


	};


	const focSigStr = sigStyFun(); // What: Focused Signature String. Why: The stop's look while focused is the first half of the comparison. How: This reads it before anything changes.


	actCurEle.blur(); // What: Stop Blur Call. Why: The unfocused look is the other half of the comparison. How: This removes focus for a moment.


	const bluSigStr = sigStyFun(); // What: Blurred Signature String. Why: The stop's unfocused look completes the comparison. How: This reads the same styles after the blur.


	actCurEle.focus(); // What: Stop Refocus Call. Why: The walk continues from this stop. How: This puts focus back where the Tab press left it.


	const recCurObj = actCurEle.getBoundingClientRect();                                                                       // What: Rect Current Object. Why: A focused stop has to be on screen and uncovered. How: This measures the stop.
	const topCurEle = document.elementFromPoint( recCurObj.left + recCurObj.width / 2, recCurObj.top + recCurObj.height / 2 ); // What: Top Current Element. Why: Whatever is drawn on top at the stop's center is what a person sees there. How: This asks the page which element sits at that point.



	const ariLabStr = actCurEle.getAttribute( 'aria-label' ); // What: ARIA Label String. Why: A stop's own label names it best. How: This reads its aria-label, or null.
	const eleIdeStr = actCurEle.id;                           // What: Element Identifier String. Why: A form field without a label is still recognizable by its id. How: This reads the stop's id, empty when it has none.
	const eleTexStr = actCurEle.textContent;                  // What: Element Text String. Why: A link or button is usually named by its text. How: This reads the stop's text.

	const stoLabStr = ariLabStr || eleIdeStr || eleTexStr || ''; // What: Stop Label String. Why: A problem should name the stop the way a person would recognize it. How: This takes the label, then the id, then the text, then nothing.


	const botBelBoo = recCurObj.bottom > 0;        // What: Bottom Below Boolean. Why: A stop entirely above the viewport is off screen. How: This is true when its bottom edge sits below the viewport's top.
	const heiPosBoo = recCurObj.height > 0;        // What: Height Positive Boolean. Why: A stop with no height can't be seen. How: This is true when it has some height.
	const lefInsBoo = recCurObj.left < innerWidth; // What: Left Inside Boolean. Why: A stop entirely right of the viewport is off screen. How: This is true when its left edge sits inside the viewport's width.
	const rigInsBoo = recCurObj.right > 0;         // What: Right Inside Boolean. Why: A stop entirely left of the viewport is off screen. How: This is true when its right edge sits past the viewport's left.
	const topAboBoo = recCurObj.top < innerHeight; // What: Top Above Boolean. Why: A stop entirely below the viewport is off screen. How: This is true when its top edge sits above the viewport's bottom.
	const widPosBoo = recCurObj.width > 0;         // What: Width Positive Boolean. Why: A stop with no width can't be seen. How: This is true when it has some width.

	const visStoBoo = botBelBoo && heiPosBoo && lefInsBoo && rigInsBoo && topAboBoo && widPosBoo; // What: Visible Stop Boolean. Why: A focused stop has to be on screen. How: This is true when it has a size and overlaps the viewport.



	return { // What: Stop Information Return. Why: The walk judges each stop outside the page. How: This hands back the stop's coverage, description, indicator, position, and visibility.


		covBoo : !!topCurEle && !actCurEle.contains( topCurEle ),                               // What: Covered Boolean. Why: The stop is hidden when something else is on top of it. How: This is true when the top element at its center is neither the stop nor inside it.
		desStr : `${ actCurEle.tagName.toLowerCase() } "${ stoLabStr.trim().slice( 0, 40 ) }"`, // What: Description String. Why: A problem should name the element a person would recognize. How: This joins the tag with the first 40 characters of its label, id, or text.
		indBoo : focSigStr !== bluSigStr,                                                       // What: Indicator Boolean. Why: A keyboard user has to see where focus is. How: This is true when focusing the stop changes how it looks.
		ordNum : Array.prototype.indexOf.call( document.querySelectorAll( '*' ), actCurEle ),   // What: Order Number. Why: Focus order is compared with document order. How: This is the stop's position among every element in the page.
		visBoo : visStoBoo                                                                      // What: Visible Boolean. Why: A stop off screen leaves a keyboard user lost. How: This reads whether the stop has a size and overlaps the viewport.


	};


}

// #endregion stoInfFun



// #region keyProFun

/**
 * keyProFun = Keyboard Problems Function
 *
 * @summary
 * Walks the page with the Tab key from the top, or from the control a state's
 * action left focused, which it first moves onto by keyboard so its focus ring
 * shows and it's checked like any stop, and returns every problem: a count of
 * the elements with a positive tabindex, which overrides the document order,
 * and every stop that comes earlier in the document than the stop before it,
 * sits off screen, is covered by something else, or looks the same focused and
 * unfocused. The walk ends when focus leaves the page, comes back to the first
 * stop, or stays on the same stop after a press, which is how Firefox leaves
 * its last stop; one that hasn't ended within TAB_MAX_NUM presses counts as a
 * keyboard trap. WebKit only tabs to links with Alt held, the way Safari does
 * by default, so the walk presses Alt+Tab there. The caller requests reduced
 * motion first, so the page jumps to each stop instead of gliding and focus
 * styles appear at once, and each press waits for scrolling to settle, so
 * every stop is measured where and how it ends up.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to walk.
 * @param engNamStr - Engine Name String: The browser the project runs in.
 *
 * @returns Every keyboard problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * keyProFun(page, 'webkit') // => [ 'input "conEmaInp" has no visible ...' ]
 * ```
 *
*/

async function keyProFun ( curPagObj : Page, engNamStr : string ) : Promise< string[] > {


	const tabKeyStr = engNamStr === 'webkit' ? 'Alt+Tab' : 'Tab'; // What: Tab Key String. Why: WebKit skips links on a plain Tab, the way Safari does by default. How: This picks Alt+Tab there and Tab everywhere else.



	const posTabNum = await curPagObj.locator( '[tabindex]' ).evaluateAll( ( tabEleArr ) => tabEleArr.filter( ( tabCurEle ) => Number( tabCurEle.getAttribute( 'tabindex' ) ) > 0 ).length ); // What: Positive Tabindex Number. Why: A positive tabindex pulls an element ahead of the document order. How: This counts every element carrying one.

	const proLisArr : string[] = posTabNum ? [ `${ posTabNum } element(s) use a positive tabindex` ] : []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This starts with the positive tabindex count, when there is one, and collects the rest during the walk.

	let firOrdNum = -1; // What: First Order Number. Why: Focus coming back to the first stop means the walk went all the way around. How: This holds the first stop's position among every element, so a different stop with the same description can't end the walk early.
	let preOrdNum = -1; // What: Previous Order Number. Why: Each stop must come later in the document than the last. How: This holds the previous stop's position among every element.

	const staFocBoo = await curPagObj.evaluate( () => document.activeElement !== document.body ); // What: Start Focused Boolean. Why: A state's action can leave a control focused by a click, such as the drawer's toggle, which a plain Tab would step past unchecked. How: This is true when something other than the body holds focus before the walk.


	for ( let tabCouNum = 0; tabCouNum < TAB_MAX_NUM; tabCouNum++ ) { // What: Tab Walk Loop. Why: Every stop is checked in the order a keyboard user meets it. How: This presses Tab once per pass, up to the cap.


		if ( tabCouNum === 0 && staFocBoo ) await curPagObj.keyboard.press( tabKeyStr ); // What: Focused Start Step. Why: A control focused by a click shows no focus ring, so the walk has to reach it by keyboard. How: On the first pass only, this tabs one stop past it, so the press below can come back.



		await curPagObj.keyboard.press( tabCouNum === 0 && staFocBoo ? `Shift+${ tabKeyStr }` : tabKeyStr ); // What: Tab Press Call. Why: Each pass moves focus to the next stop. How: This presses the engine's Tab key, or on a focused start's first pass, Shift with it, landing back on the control the action left focused.

		await curPagObj.evaluate( scrSetFun ); // What: Scroll Settled Wait. Why: Some engines scroll a focused field into view a few frames late. How: This waits until the page has stopped scrolling.


		const stoInfObj = await curPagObj.evaluate( stoInfFun );                                          // What: Stop Information Object. Why: The stop is described and measured inside the page. How: This runs stoInfFun there.
		const walEndBoo = !stoInfObj || stoInfObj.ordNum === firOrdNum || stoInfObj.ordNum === preOrdNum; // What: Walk Ended Boolean. Why: Focus leaving the page, coming back around, or staying put means every stop was visited. How: This checks each in turn, the later two only once a stop exists, so the chain stays inline. // What: Firefox Walk End Note. Why: Firefox moves focus out to its own interface after the last stop but still reports that stop as focused. How: Focus staying on the same stop after a press is read as the walk leaving the page.


		if ( walEndBoo ) return proLisArr; // What: Walk End Guard. Why: A walk that reaches its end has found every problem there is. How: This returns them, ending the walk.



		if ( firOrdNum < 0 ) firOrdNum = stoInfObj.ordNum; // What: First Stop Record. Why: The walk ends if focus comes back to it. How: This remembers the first stop's position.



		if ( stoInfObj.ordNum <= preOrdNum ) proLisArr.push( `${ stoInfObj.desStr } comes before the previous stop in the document` ); // What: Order Check. Why: Focus should move forward through the page. How: This records a stop that jumps backwards.



		if ( !stoInfObj.visBoo ) proLisArr.push( `${ stoInfObj.desStr } is focused but not on screen` ); // What: On Screen Check. Why: A keyboard user can't act on what they can't see. How: This records a stop with no size or outside the viewport.

		else if ( stoInfObj.covBoo ) proLisArr.push( `${ stoInfObj.desStr } is focused but covered by another element` ); // What: Covered Check. Why: A stop hidden behind something else can't be seen either. How: This records an on-screen stop with another element on top of it.



		if ( !stoInfObj.indBoo ) proLisArr.push( `${ stoInfObj.desStr } has no visible focus indicator` ); // What: Indicator Check. Why: A keyboard user has to see where focus is. How: This records a stop that looks the same focused and unfocused.



		preOrdNum = stoInfObj.ordNum; // What: Previous Order Update. Why: The next stop is compared with this one. How: This stores this stop's position.


	}



	proLisArr.push( `focus never left the page within ${ TAB_MAX_NUM } presses, a likely keyboard trap` ); // What: Trap Record Call. Why: A keyboard user must always be able to Tab away. How: The loop returns as soon as the walk ends, so reaching this line means it never did.



	return proLisArr; // What: Problem List Return. Why: The keyboard test fails on any recorded problem. How: This hands back every problem the walk found.


}

// #endregion keyProFun

// #endregion Helpers



// #region Module Init

for ( const staRecObj of STA_REC_ARR ) { // What: State Test Loop. Why: Every check runs on every page state. How: This declares each check once per state.


	test( `${ staRecObj.ideStr } names every link and button cleanly`, async ( { page : curPagObj } ) => { // What: Names Test. Why: Every control must be announced by a clean name. How: This opens the state and checks its accessibility tree.


		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The tree should be read with the state settled. How: This loads and settles it.


		expect( await namProFun( curPagObj ) ).toEqual( [] ); // What: No Name Problems Assertion. Why: The state passes only with clean names. How: This compares the problems with an empty list, so a failure prints each one.


	} );



	test( `${ staRecObj.ideStr } walks cleanly with the keyboard`, async ( { browserName : engNamStr, page : curPagObj } ) => { // What: Keyboard Test. Why: Everything has to be usable without a mouse. How: This opens the state under reduced motion and walks it with Tab.


		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: A smooth scroll or a focus transition still running would be measured halfway. How: This makes the page match prefers-reduced-motion, which turns both off.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The walk should start from the state settled. How: This loads and settles it.


		expect( await keyProFun( curPagObj, engNamStr ) ).toEqual( [] ); // What: No Keyboard Problems Assertion. Why: The state passes only when every stop is reachable, in order, on screen, uncovered, and visibly focused. How: This compares the problems with an empty list, so a failure prints each one.


	} );



	test( `${ staRecObj.ideStr } reflows at ${ REF_WID_NUM }px without scrolling sideways`, async ( { page : curPagObj } ) => { // What: Reflow Test. Why: Zoomed-in visitors read in one column without scrolling sideways. How: This opens the state at the reflow width and compares the page's scroll width with its visible width.


		await opeStaFun( curPagObj, { ...staRecObj, widNum : REF_WID_NUM } ); // What: Narrow State Open Call. Why: Reflow is judged at WCAG's narrowest width. How: This opens the state with its width replaced by the reflow width.


		expect( await curPagObj.evaluate( () => document.documentElement.scrollWidth - document.documentElement.clientWidth ) ).toBeLessThanOrEqual( 0 ); // What: No Sideways Scroll Assertion. Why: The page passes only when nothing reaches past the viewport's width. How: This subtracts the visible width from the scrollable width, which stays at zero without sideways scrolling.


	} );



	test( `${ staRecObj.ideStr } plays no motion under reduced motion`, async ( { page : curPagObj } ) => { // What: Reduced Motion Test. Why: Visitors who ask for less motion shouldn't see the page animate. How: This requests reduced motion, records any animation or transition over 1ms that starts while the state opens, and lists any the page still holds once it has.


		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The preference has to be set before the page loads. How: This makes the page match prefers-reduced-motion: reduce.

		await curPagObj.addInitScript( motRecFun ); // What: Motion Recorder Install Call. Why: A transition the state's action sets off can finish before the page settles, and a finished one drops out of getAnimations. How: This runs motRecFun in the page before it loads, recording every motion over 1ms that starts.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: Entrance animations and the state's own action are the motion being checked. How: This loads the state and runs its action.


		expect( await curPagObj.evaluate( () => Reflect.get( window, 'motLisArr' ) ) ).toEqual( [] ); // What: No Motion Started Assertion. Why: Nothing should have moved while the state opened, including transitions that already finished. How: This checks the recorder caught no motion longer than 1ms.
		expect( await curPagObj.evaluate( lonAniFun ) ).toEqual( [] );                                // What: No Motion Assertion. Why: The state passes only when no animation or transition it still holds lasts longer than 1ms. How: This lists every one through lonAniFun, which should find none.


	} );


}



test( 'closing the drawer plays no motion under reduced motion', async ( { page : curPagObj } ) => { // What: Drawer Close Motion Test. Why: The state checks only see the drawer open, and closing runs its own transitions, which need their own reduced-motion rules. How: This opens the drawer under reduced motion, clears what the recorder heard, closes it, and checks it closed with nothing moving.


	const draRecObj = STA_REC_ARR.find( ( staCurObj ) => staCurObj.ideStr === 'drawer-phone' )!; // What: Drawer Record Object. Why: The drawer opens the same way its state does. How: This finds the drawer state's row. // What: Non-Null Note. Why: find types its result as possibly undefined. How: STA_REC_ARR always lists the drawer-phone state.


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The preference has to be set before the page loads. How: This makes the page match prefers-reduced-motion: reduce.

	await curPagObj.addInitScript( motRecFun ); // What: Motion Recorder Install Call. Why: The drawer's closing transitions can finish before the check reads the page. How: This runs motRecFun in the page before it loads.

	await opeStaFun( curPagObj, draRecObj ); // What: Drawer State Open Call. Why: The drawer has to be open before it can close. How: This loads the home page at phone size and opens the drawer.

	await curPagObj.evaluate( () => { ( Reflect.get( window, 'motLisArr' ) as string[] ).length = 0; } ); // What: Motion List Clear Call. Why: Opening is the state check's job, so only motion from closing should count here. How: This empties the recorder's list. // What: Type Assertion Note. Why: Reflect.get types the global as unknown. How: motRecFun stores a string array there.

	await curPagObj.getByRole( 'button', { name : 'Toggle menu' } ).click(); // What: Toggle Click Call. Why: This is the action under test. How: This clicks the toggle to close the drawer.


	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Drawer Closed Assertion. Why: The check only means something once the drawer has closed. How: This waits until the toggle reports it collapsed.
	expect( await curPagObj.evaluate( () => Reflect.get( window, 'motLisArr' ) ) ).toEqual( [] );                          // What: No Motion Started Assertion. Why: Nothing should have moved while the drawer closed, including transitions that already finished. How: This checks the recorder heard nothing.
	expect( await curPagObj.evaluate( lonAniFun ) ).toEqual( [] );                                                         // What: No Motion Assertion. Why: Nothing should still be moving once the drawer has closed. How: This lists every animation or transition longer than 1ms the page still holds, which should be none.


} );



test( 'sending the form plays no motion under reduced motion', async ( { page : curPagObj } ) => { // What: Sent Label Motion Test. Why: The sent label's rise only plays once the form is sent, which no state does. How: This opens the home page under reduced motion, clears what the recorder heard, sends the form, and checks the label swapped with nothing moving.


	const homRecObj = STA_REC_ARR.find( ( staCurObj ) => staCurObj.ideStr === 'home-desktop' )!; // What: Home Record Object. Why: The form sits on the home page. How: This finds the home desktop state's row. // What: Non-Null Note. Why: find types its result as possibly undefined. How: STA_REC_ARR always lists the home-desktop state.


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The preference has to be set before the page loads. How: This makes the page match prefers-reduced-motion: reduce.

	await curPagObj.addInitScript( motRecFun ); // What: Motion Recorder Install Call. Why: The sent label's rise can finish before the check reads the page. How: This runs motRecFun in the page before it loads.

	await opeStaFun( curPagObj, homRecObj ); // What: Home State Open Call. Why: The form is sent from the home page. How: This loads it at desktop size.

	await curPagObj.evaluate( () => { ( Reflect.get( window, 'motLisArr' ) as string[] ).length = 0; } ); // What: Motion List Clear Call. Why: Loading is the state check's job, so only motion from sending should count here. How: This empties the recorder's list. // What: Type Assertion Note. Why: Reflect.get types the global as unknown. How: motRecFun stores a string array there.

	await curPagObj.locator( '#conNamInp' ).fill( 'Pat Doe' );         // What: Name Fill Call. Why: A real request carries a name. How: This types one into the name field.
	await curPagObj.locator( '#conEmaInp' ).fill( 'pat@example.com' ); // What: Email Fill Call. Why: A real request carries an email. How: This types one into the email field.

	await curPagObj.getByRole( 'button', { name : 'Send request' } ).click(); // What: Send Click Call. Why: This is the action under test. How: This clicks the submit button.


	await expect( curPagObj.locator( 'form button[type="submit"]' ) ).toHaveText( /Opening your email/ ); // What: Sent Label Assertion. Why: The check only means something once the label has swapped. How: This waits until the button's text has changed.
	expect( await curPagObj.evaluate( () => Reflect.get( window, 'motLisArr' ) ) ).toEqual( [] );         // What: No Motion Started Assertion. Why: Nothing should have moved while the label swapped, including an animation that already finished. How: This checks the recorder heard nothing.
	expect( await curPagObj.evaluate( lonAniFun ) ).toEqual( [] );                                        // What: No Motion Assertion. Why: Nothing should still be moving once the label has swapped. How: This lists every animation or transition longer than 1ms the page still holds, which should be none.


} );



test( 'sending the form announces the email app opening to screen readers', async ( { page : curPagObj } ) => { // What: Sent Announcement Test. Why: A screen reader isn't told when the focused button's label changes, so the sent request needs a live region of its own. How: This opens the home page, checks the status region is already in the page and empty, sends the form, and checks the region now holds the message.


	const homRecObj = STA_REC_ARR.find( ( staCurObj ) => staCurObj.ideStr === 'home-desktop' )!; // What: Home Record Object. Why: The form sits on the home page. How: This finds the home desktop state's row. // What: Non-Null Note. Why: find types its result as possibly undefined. How: STA_REC_ARR always lists the home-desktop state.
	const staRegObj = curPagObj.locator( '#contact form [role="status"]' );                      // What: Status Region Object. Why: The announcement lives in the form's live region. How: This finds the status role inside the contact form.


	await opeStaFun( curPagObj, homRecObj ); // What: Home State Open Call. Why: The form is sent from the home page. How: This loads it at desktop size.

	await expect( staRegObj ).toHaveCount( 1 ); // What: Region Present Assertion. Why: A live region added at the moment it speaks is often missed, so it has to be there before the form is sent. How: This checks the form holds exactly one status region on load.
	await expect( staRegObj ).toHaveText( '' ); // What: Region Empty Assertion. Why: The region's change is what gets announced, so it must start silent. How: This checks it holds no text before the form is sent.

	await curPagObj.locator( '#conNamInp' ).fill( 'Pat Doe' );         // What: Name Fill Call. Why: A real request carries a name. How: This types one into the name field.
	await curPagObj.locator( '#conEmaInp' ).fill( 'pat@example.com' ); // What: Email Fill Call. Why: A real request carries an email. How: This types one into the email field.

	await curPagObj.getByRole( 'button', { name : 'Send request' } ).click(); // What: Send Click Call. Why: This is the action under test. How: This clicks the submit button.


	await expect( staRegObj ).toHaveText( /email app is opening/ ); // What: Region Message Assertion. Why: Screen readers should hear that the email is opening. How: This waits for the region to hold the sent message.


} );

// #endregion Module Init



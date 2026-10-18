


// #region Imports

import cssModObj from './nav.module.css';        // What: CSS Module Object. Why: The bar's layout, scrolled state, and drawer are styled in its own module. How: Each element reads its hashed class name from this object.
import lomSvgUrl from '../assets/logo-mark.svg'; // What: Logo-Mark SVG URL. Why: The bar's brand link shows the simple logo mark. How: Vite resolves the import to a URL for the image's src, inlining this small file into the bundle as a data URI in the build.
import React     from 'react';                   // What: React. Why: The bar tracks its scroll and drawer state with React's hooks. How: This is read for its hooks, React.useState, React.useEffect, and React.useRef.


import { useSecCliFun } from './section-link.ts'; // What: Use Section Click Function. Why: Every section link in the bar and drawer reaches its section the same way, leaving no hash in the address. How: This returns secCliFun, the shared click handler.

// #endregion Imports



/**
 * nav.tsx = Navigation Bar
 *
 * @summary
 * The site's top navigation bar, shared by every page. It holds the brand
 * link, the section links, the phone number, and the estimate button. At 880px
 * wide and below, the links, the phone number, and the button give way to a
 * menu toggle that opens a drawer repeating all three. It switches to its
 * scrolled style once the page moves past the top.
 *
 * Sections:
 *  - Constants
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

// #region NAV_LIN_ARR

/**
 * NAV_LIN_ARR = Nav Link Array
 *
 * @summary
 * The section links the bar and its drawer both list, in the order the bar
 * shows them and the drawer numbers them. Every row shares one shape, so its
 * fields carry no comments of their own:
 * - `ideStr` (String): Identifier String, the home page section's id, which
 *   the link's address names after the root path.
 * - `labStr` (String): Label String, the link's visible text.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const NAV_LIN_ARR = [ // What: Nav Link Array. Why: The bar and its drawer list the same section links. How: Each row pairs a home page section's id, which its link's address names with the root path so a Ctrl, Cmd, or middle click opens it from any page, with its label, and both lists map over it, the drawer numbering the rows in order to match the sections' own numbered labels.


	{ ideStr : 'top',      labStr : 'Home'     }, // What: Home Link Row. Why: Not every visitor knows the logo leads home, so the bar spells it out. How: This names the hero's top anchor.
	{ ideStr : 'services', labStr : 'Services' }, // What: Services Link Row. Why: The services section is the first stop for most visitors. How: This names its anchor.
	{ ideStr : 'about',    labStr : 'About'    }, // What: About Link Row. Why: Visitors check who they'd be hiring. How: This names its anchor.
	{ ideStr : 'contact',  labStr : 'Contact'  }  // What: Contact Link Row. Why: The contact section is where an estimate is requested. How: This names its anchor.


];

// #endregion NAV_LIN_ARR

// #endregion Constants



// #region Components

// #region NavBarCom

/**
 * NavBarCom = Navigation Bar Component
 *
 * @summary
 * Renders the site's top bar. It listens to the window's scroll position and
 * switches the bar to its scrolled style once the page is more than 24px down,
 * checking once on mount so a page reloaded mid-scroll starts in the right
 * style. At 880px wide and below, the bar's links, phone number, and estimate
 * button give way to a toggle button that opens and closes a drawer holding
 * the same links, numbered like the sections they lead to, then a contact
 * block with the phone number, the hours, and the estimate button; a plain
 * click on a link or the button closes it again, while a Ctrl, Cmd, or middle
 * click leaves it open. While the drawer is open the bar takes a solid
 * background, so the two read as one panel, and a scrim dims the page below;
 * clicking the scrim closes the drawer. The open drawer also acts as a modal
 * layer: the page's content beside the bar turns inert, so Tab and screen
 * readers stay in the bar and drawer, Escape closes it and returns focus to
 * the toggle, and widening the screen until the toggle disappears closes it
 * too. Every section link and estimate button goes through secCliFun,
 * scrolling to its section, or navigating home to it from another page,
 * without leaving a hash in the address, while a Ctrl, Cmd, or middle click
 * still opens it in a new tab.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The site's top bar, with its drawer and the scrim behind it.
 *
 * @example
 * ```tsx
 * NavBarCom() // => <NavBarCom />
 * ```
 *
*/

function NavBarCom () : React.JSX.Element {


	const [ draOpeBoo, setDraOpeBoo ] = React.useState( false ); // What: Drawer Open Boolean And Setter. Why: The drawer opens and closes from the toggle button. How: This starts closed and drives the toggle's aria-expanded, the open attribute on the scrim, the bar, and the drawer, and the modal drawer effect.
	const [ scrPasBoo, setScrPasBoo ] = React.useState( false ); // What: Scroll Past Boolean And Setter. Why: The bar takes its scrolled style once the page moves past the top. How: This starts false and is set by the scroll listener below.

	const heaBarRef = React.useRef< HTMLElement >( null );       // What: Header Bar Reference. Why: The open drawer makes everything beside the bar inert. How: This points at the bar, whose parent holds the page's other content.
	const sciDivRef = React.useRef< HTMLDivElement >( null );    // What: Scrim Div Reference. Why: The scrim has to stay clickable while the rest of the page is inert. How: This points at the scrim, so it's left out.
	const togButRef = React.useRef< HTMLButtonElement >( null ); // What: Toggle Button Reference. Why: Escape hands focus back to the button that opened the drawer, and a hidden toggle means the drawer no longer applies. How: This points at the menu toggle.



	const secCliFun = useSecCliFun(); // What: Section Click Function. Why: Every section link in the bar and drawer reaches its section the same way. How: This leaves a modified click to the browser and otherwise scrolls to the section, or navigates home to it from another page, without a hash.



	React.useEffect( () => { // What: Scroll Listener Effect. Why: The bar's style depends on the window's scroll position. How: This checks the position once, then again on every scroll until unmount.


		const onScrWinFun = () => setScrPasBoo( window.scrollY > 24 ); // What: On Scroll Window Function. Why: The scrolled style should apply only once the page is past the very top. How: This sets scrPasBoo whenever the page is more than 24px down.


		onScrWinFun(); // What: Initial Scroll Check Call. Why: A page reloaded mid-scroll should start in the scrolled style without waiting for the next scroll. How: This runs the check once on mount.


		window.addEventListener( 'scroll', onScrWinFun, { passive : true } ); // What: Scroll Listener Registration. Why: The check has to rerun as the page scrolls. How: This registers it as a passive listener, since it never cancels scrolling.



		return () => window.removeEventListener( 'scroll', onScrWinFun ); // What: Scroll Listener Cleanup. Why: An unmounted bar shouldn't keep reacting to scrolls. How: This removes the listener.


	}, [] ); // What: Effect Dependency Array. Why: The listener should be registered exactly once per mount, never re-run. How: An empty array means there is no dependency that could ever change to trigger a re-run.



	React.useEffect( () => { // What: Modal Drawer Effect. Why: The open drawer sits over a dimmed page, so keyboard and screen reader users should stay in the bar and drawer until it closes, rather than landing on links hidden under the scrim. How: While the drawer is open, this makes the bar's sibling content inert, closes the drawer on Escape with focus back on the toggle, and closes it if a wider screen hides the toggle.


		if ( !draOpeBoo ) return; // What: Closed Drawer Guard. Why: Only the open drawer changes the rest of the page. How: This leaves everything alone while the drawer is closed.



		const heaBarEle = heaBarRef.current!; // What: Header Bar Element. Why: The bar and its drawer stay usable. How: This reads the bar. // What: Non-Null Note. Why: TypeScript can't see the ref is attached. How: Effects run after the bar has mounted.
		const sciDivEle = sciDivRef.current!; // What: Scrim Div Element. Why: The scrim stays clickable to close the drawer. How: This reads the scrim. // What: Non-Null Note. Why: TypeScript can't see the ref is attached. How: Effects run after the scrim has mounted.
		const sibEleArr = Array.from( heaBarEle.parentElement!.children ).filter( ( sibCurEle ) => sibCurEle !== heaBarEle && sibCurEle !== sciDivEle ); // What: Sibling Element Array. Why: The page's main content and footer sit beside the bar. How: This lists every element sharing the bar's parent except the bar and its scrim. // What: Non-Null Note. Why: TypeScript can't see the bar has a parent. How: A mounted bar always has a parent element: the app container on the home page, and the page's own column on the 404 page.
		const togButEle = togButRef.current!; // What: Toggle Button Element. Why: Escape returns focus here, and its visibility says whether the drawer still applies. How: This reads the toggle. // What: Non-Null Note. Why: TypeScript can't see the ref is attached. How: Effects run after the toggle has mounted.


		const onKeyDowFun = ( keyEveObj : KeyboardEvent ) => { // What: On Key Down Function. Why: Escape is the expected way out of a layer over the page. How: This closes the drawer and puts focus back on the toggle when Escape is pressed.


			if ( keyEveObj.key !== 'Escape' ) return; // What: Escape Key Guard. Why: Only Escape closes the drawer. How: This ignores every other key.



			setDraOpeBoo( false ); // What: Drawer Close Call. Why: Escape closes the drawer. How: This sets the drawer state to closed.

			togButEle.focus(); // What: Toggle Focus Call. Why: Focus would otherwise be left inside the closing drawer. How: This moves it to the toggle, where the visitor opened the drawer.


		};


		const onResWinFun = () => { if ( !togButEle.getClientRects().length ) setDraOpeBoo( false ); }; // What: On Resize Window Function. Why: A screen widened past the drawer's breakpoint hides the toggle, which would leave the page inert with no way to close it. How: This closes the drawer once the toggle no longer renders.


		for ( const sibCurEle of sibEleArr ) sibCurEle.setAttribute( 'inert', '' ); // What: Sibling Inert Loop. Why: Content under the scrim shouldn't take focus or be read while the drawer is open. How: This marks each sibling inert, removing it from the tab order, the accessibility tree, and pointer input.



		document.addEventListener( 'keydown', onKeyDowFun ); // What: Key Down Listener Registration. Why: Escape should close the drawer wherever focus is. How: This listens on the whole document.
		window.addEventListener( 'resize', onResWinFun );    // What: Resize Listener Registration. Why: Widening the screen can hide the toggle. How: This rechecks on every resize.



		return () => { // What: Modal Drawer Cleanup. Why: Closing the drawer gives the page back. How: This removes the inert marks and both listeners.


			for ( const sibCurEle of sibEleArr ) sibCurEle.removeAttribute( 'inert' ); // What: Sibling Restore Loop. Why: The page has to be usable again once the drawer closes. How: This removes each sibling's inert mark.



			document.removeEventListener( 'keydown', onKeyDowFun ); // What: Key Down Listener Cleanup. Why: Escape should do nothing once the drawer is closed. How: This removes the listener.
			window.removeEventListener( 'resize', onResWinFun );    // What: Resize Listener Cleanup. Why: Resizing doesn't matter once the drawer is closed. How: This removes the listener.


		};


	}, [ draOpeBoo ] ); // What: Effect Dependency Array. Why: The page's inert state and the listeners have to follow the drawer opening and closing. How: draOpeBoo changing reruns the effect, which applies them while it's true and its cleanup removes them.



	return (


		<>{ /* What: Navigation Fragment Element. Why: The scrim and the bar render as siblings, the scrim first so the bar, at the same stack level, paints above it. How: This groups them without adding a wrapper element. */ }


			<div
				ref={ sciDivRef }

				className={ cssModObj.navSciDiv }

				data-drawer-menu-open={ draOpeBoo || undefined } // What: Drawer Menu Open Attribute. Why: The scrim fades in only while the drawer is open. How: This is set only while draOpeBoo is true, and React drops it otherwise.

				aria-hidden='true'

				onClick={ () => setDraOpeBoo( false ) }
			/>{ /* What: Navigation Scrim Div Element. Why: The open drawer should stand apart from the dimmed page, and a tap anywhere on the page should close it. How: This covers the page under the bar at 880px wide and below, staying out of the page above that width, dimmed while the drawer is open, and closes the drawer when clicked; it's hidden from screen readers, which close the drawer with the toggle. */ }



			<header
				ref={ heaBarRef }

				className={ cssModObj.navBarHed }

				data-drawer-menu-open={ draOpeBoo || undefined } // What: Drawer Menu Open Attribute. Why: The bar takes a solid background while the drawer is open, so the two read as one panel. How: This is set only while draOpeBoo is true, and React drops it otherwise.
				data-page-scroll-past={ scrPasBoo || undefined } // What: Page Scroll Past Attribute. Why: The bar takes its scrolled style once the page moves past the top, and state is an attribute rather than a class. How: This is set only while scrPasBoo is true, and React drops it otherwise.
			>{ /* What: Navigation Bar Header Element. Why: This is the site's top bar landmark. How: This takes its scrolled style once scrPasBoo is true. */ }


				<div className={ cssModObj.navInnDiv }>{ /* What: Navigation Inner Div Element. Why: The bar's contents should line up with the page's content width. How: This holds the brand, links, actions, and toggle in one row, where the links and actions give way to the toggle at 880px wide and below. */ }


					<a
						className={ cssModObj.navBraAnc }

						href='/'

						aria-hidden='true' // What: Hidden Brand Link Attribute. Why: The nav's Home link already leads to the same place, and two links to one address read as a redundant pair to screen reader users. How: This hides the logo link from screen readers, leaving the labeled Home link as the one they hear.
						tabIndex={ -1 } // What: Unfocusable Brand Link Index. Why: A link hidden from screen readers must not take keyboard focus, or a keyboard user would land on something that announces nothing. How: This takes it out of the tab order, so Tab moves straight to the Home link.
					>{ /* What: Navigation Brand Anchor Element. Why: The logo and name should take mouse and touch visitors back to the top. How: This links to the site's root address, loading the home page at its top from any page, while staying hidden from screen readers and the keyboard in favor of the nav's Home link, which points at the top anchor instead so the two never share an address. */ }


						<img
							className={ cssModObj.navMarIma }

							height='36'
							src={ lomSvgUrl }
							width='40'

							alt=''
						/>{ /* What: Navigation Mark Image Element. Why: The bar shows the simple logo mark beside the name. How: Its empty alt marks it decorative, since the link around it is hidden from screen readers in favor of the nav's Home link. */ }

						<span className={ cssModObj.navNamSpa }>{ /* What: Navigation Name Span Element. Why: The company's name sits beside the mark. How: The second word takes a lighter, italic, muted style. */ }
							Reese <span className={ cssModObj.namLigSpa }>Roofing</span>
						</span>


					</a>

					<nav
						className={ cssModObj.navLinNav }

						aria-label='Primary'
					>{ /* What: Navigation Links Nav Element. Why: The section links form the site's primary navigation landmark. How: This lists a link for each row of NAV_LIN_ARR, and hides at 880px wide and below, where the drawer repeats the links. */ }


						{ NAV_LIN_ARR.map( ( navLinObj ) => ( // What: Nav Link Map. Why: The bar lists every section link. How: This renders an anchor for each row.


							<a
								key={ navLinObj.ideStr }

								className={ cssModObj.navLinAnc }

								href={ `/#${ navLinObj.ideStr }` }

								onClick={ ( cliEveObj ) => secCliFun( cliEveObj, navLinObj.ideStr ) }
							>{ /* What: Navigation Link Anchor Element. Why: Each link takes the visitor to its section. How: Its address points at the home page's section, which a Ctrl, Cmd, or middle click opens in a new tab, while a plain click scrolls there, or navigates home to it from another page, without a hash, and it hides with the links at 880px wide and below, where the drawer repeats it. */ }
								{ navLinObj.labStr }
							</a>


						))}


					</nav>

					<div className={ cssModObj.navCtaDiv }>{ /* What: Navigation Call-To-Action Div Element. Why: The bar's two ways to reach the company sit together. How: This holds the phone link and the estimate button, and hides at 880px wide and below, where the drawer's contact block repeats them. */ }


						<a
							className={ cssModObj.navPhoAnc }

							href='tel:+17855550199'

							aria-label='Call (785) 555-0199'
						>{ /* What: Navigation Phone Anchor Element. Why: Visitors should be able to call straight from the bar. How: This dials the company's number, and hides at 880px wide and below, where the drawer repeats it. */ }
							(785) 555-0199
						</a>

						<a
							className={ cssModObj.navEstAnc }

							href='/#contact'

							onClick={ ( cliEveObj ) => secCliFun( cliEveObj, 'contact' ) }
						>{ /* What: Navigation Estimate Anchor Element. Why: The bar's main action is requesting an estimate. How: Its address points at the home page's contact section, which a Ctrl, Cmd, or middle click opens in a new tab, while a plain click scrolls there, or navigates home to it from another page, without a hash, and it hides with its row at 880px wide and below, where the drawer repeats it. */ }
							Get an estimate
							<span
								className={ cssModObj.arrIcoSpa }

								aria-hidden='true'
							>{ /* What: Arrow Icon Span Element. Why: The arrow marks the bar's estimate button as moving the visitor onward. How: This sits right after the button's label and nudges right when it's hovered, hidden from screen readers since it only decorates the label, and hidden with the button at 880px wide and below. */ }
								→
							</span>
						</a>


					</div>

					<button
						ref={ togButRef }

						className={ cssModObj.navTogBut }

						aria-expanded={ draOpeBoo }
						aria-label='Toggle menu'

						onClick={ () => setDraOpeBoo( ( preOpeBoo ) => !preOpeBoo ) }
					>{ /* What: Navigation Toggle Button Element. Why: At 880px wide and below the links, the phone number, and the estimate button hide behind a menu button. How: This shows only at 880px wide and below, flips the drawer open or closed, and its aria-expanded both reports the state to screen readers and styles the open icon. */ }


						<span className={ cssModObj.togLinSpa } />{ /* What: Toggle Line Span Element. Why: The button draws its icon from two lines, and this is the top one. How: Its stylesheet drops it to the middle and turns it 45 degrees while the drawer is open, forming one stroke of the cross, and shows with the button only at 880px wide and below. */ }

						<span className={ cssModObj.togLinSpa } />{ /* What: Toggle Line Span Element. Why: The button draws its icon from two lines, and this is the bottom one. How: Its stylesheet lifts it to the middle and turns it the other way while the drawer is open, forming the cross's other stroke, and shows with the button only at 880px wide and below. */ }


					</button>


				</div>


				<div
					className={ cssModObj.navDraDiv }

					data-drawer-menu-open={ draOpeBoo || undefined } // What: Drawer Menu Open Attribute. Why: The drawer's stylesheet opens it while this is present. How: This is set only while draOpeBoo is true, and React drops it otherwise.
				>{ /* What: Navigation Drawer Div Element. Why: At 880px wide and below the links, the phone number, and the estimate button show in a drawer below the bar. How: This holds the links and the contact block, and opens while draOpeBoo is true. */ }


					{ NAV_LIN_ARR.map( ( navLinObj, linIndNum ) => ( // What: Drawer Link Map. Why: The drawer repeats every section link, numbered like the sections. How: This renders one numbered anchor per row, handing each its position for the staggered entrance.


						<a
							key={ navLinObj.ideStr }

							className={ cssModObj.draLinAnc }

							style={ { '--dra-ite-ind' : linIndNum } as React.CSSProperties } // What: Drawer Item Index Style. Why: Each row enters a beat after the one above it. How: This hands the row its position, which its stylesheet multiplies into an animation delay. // What: Type Assertion Note. Why: React's CSSProperties type has no entry for custom properties. How: The object holds one custom property and nothing else, so reading it as CSSProperties is safe.

							href={ `/#${ navLinObj.ideStr }` }

							onClick={ ( cliEveObj ) => { if ( secCliFun( cliEveObj, navLinObj.ideStr ) ) setDraOpeBoo( false ); } } // What: Drawer Link Click Handler. Why: A chosen link should close the drawer on the way to its section, but a link opened in a new tab leaves the drawer as it was. How: This closes the drawer only when secCliFun handled the click.
						>{ /* What: Drawer Link Anchor Element. Why: Each link takes the visitor to its section. How: Its address points at the home page's section, which a Ctrl, Cmd, or middle click opens in a new tab, while a plain click scrolls there, or navigates home to it from another page, without a hash, and closes the drawer behind it, drawn only in the drawer, which opens only at 880px wide and below. */ }


							<span
								className={ cssModObj.draNumSpa }

								aria-hidden='true'
							>{ /* What: Drawer Number Span Element. Why: The rows are numbered like the sections they lead to. How: This shows the row's position, padded to two digits, hidden from screen readers since the number is only visual and the row's label names it, drawn only in the drawer, which opens only at 880px wide and below. */ }
								{ String( linIndNum + 1 ).padStart( 2, '0' ) }{ /* What: Padded Row Number. Why: Each row shows its position as two digits, matching the sections' numbered labels. How: This adds 1 to the zero-based index and pads it with a leading zero. */ }
							</span>

							<span className={ cssModObj.draLabSpa }>{ navLinObj.labStr }</span>{ /* What: Drawer Label Span Element. Why: The section's name is the row's main text. How: This prints the row's label, drawn only in the drawer, which opens only at 880px wide and below. */ }

							<span
								className={ cssModObj.arrIcoSpa }

								aria-hidden='true'
							>{ /* What: Arrow Icon Span Element. Why: The arrow marks the row as moving the visitor onward. How: This sits at the row's far end and slides when the row is hovered, pressed, or focused, hidden from screen readers since it only decorates the label, drawn only in the drawer, which opens only at 880px wide and below. */ }
								→
							</span>


						</a>


					))}

					<div
						className={ cssModObj.draConDiv }

						style={ { '--dra-ite-ind' : NAV_LIN_ARR.length } as React.CSSProperties } // What: Drawer Item Index Style. Why: The contact block enters after the last link. How: This hands it the position after the links, which its stylesheet multiplies into an animation delay. // What: Type Assertion Note. Why: React's CSSProperties type has no entry for custom properties. How: The object holds one custom property and nothing else, so reading it as CSSProperties is safe.
					>{ /* What: Drawer Contact Div Element. Why: The drawer ends with every way to reach the company, since the bar's phone link and estimate button are hidden at 880px wide and below. How: This stacks a label, the phone number, the hours, and the estimate button, drawn only in the drawer, which opens only at 880px wide and below. */ }


						<span className={ cssModObj.eyeLabSpa }>Call us</span>{ /* What: Eyebrow Label Span Element. Why: A small label introduces the contact block like the sections' labels. How: This reads in tracked, muted capitals with a leading line, drawn only in the drawer, which opens only at 880px wide and below. */ }

						<a
							className={ cssModObj.draPhoAnc }

							href='tel:+17855550199'

							aria-label='Call (785) 555-0199'
						>{ /* What: Drawer Phone Anchor Element. Why: Phone visitors should be able to call in one tap. How: This dials the company's number, drawn only in the drawer, which opens only at 880px wide and below. */ }
							(785) 555-0199
						</a>

						<p className={ cssModObj.draHouPar }>Mon–Fri, 7:00 AM – 5:00 PM · 24/7 emergency response</p>{ /* What: Drawer Hours Paragraph Element. Why: Visitors want to know when someone will answer. How: This repeats the contact section's hours in one paragraph, joined by a dot, drawn only in the drawer, which opens only at 880px wide and below. */ }

						<a
							className={ cssModObj.draEstAnc }

							href='/#contact'

							onClick={ ( cliEveObj ) => { if ( secCliFun( cliEveObj, 'contact' ) ) setDraOpeBoo( false ); } } // What: Drawer Estimate Click Handler. Why: The estimate button should close the drawer on the way to the form, but a button opened in a new tab leaves the drawer as it was. How: This closes the drawer only when secCliFun handled the click.
						>{ /* What: Drawer Estimate Anchor Element. Why: Requesting an estimate is the site's main action, and the bar's button is hidden at 880px wide and below. How: This takes the visitor to the contact section as a full-width pill, without a hash, and closes the drawer behind it, while a Ctrl, Cmd, or middle click opens it in a new tab, drawn only in the drawer, which opens only at 880px wide and below. */ }
							Get an estimate
							<span
								className={ cssModObj.arrIcoSpa }

								aria-hidden='true'
							>{ /* What: Arrow Icon Span Element. Why: The arrow marks the drawer's estimate button as moving the visitor onward. How: This sits right after the button's label and nudges right when it's hovered, hidden from screen readers since it only decorates the label, drawn only in the drawer, which opens only at 880px wide and below. */ }
								→
							</span>
						</a>


					</div>


				</div>


			</header>


		</>


	);


}

// #endregion NavBarCom

// #endregion Components



// #region Exports

export { NavBarCom }; // What: Named Export. Why: Every page renders the shared navigation bar. How: This exports NavBarCom.

// #endregion Exports






// #region Imports

import lomSvgUrl from '../assets/logo-mark.svg'; // What: Logo-Mark Svg Url. Why: The bar's brand link shows the simple logo mark. How: Vite resolves the import to the file's fingerprinted URL, used as the image's src.
import React     from 'react';                    // What: React. Why: The bar tracks its scroll and drawer state with React's hooks. How: This is read as React.useState and React.useEffect.


import './nav.css'; // What: Nav Stylesheet Import. Why: The bar's layout, scrolled state, and mobile drawer are styled in its own stylesheet. How: This is imported purely for its side effect.

// #endregion Imports



/**
 * nav.tsx = Navigation Bar
 *
 * @summary
 * The site's top navigation bar, shared by every page. It holds the brand
 * link, the section links, the phone number and estimate button, and on small
 * screens a menu toggle that opens a drawer repeating the links. It switches
 * to its scrolled style once the page moves past the top.
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

const NAV_LIN_ARR = [ // What: Nav Link Array. Why: The bar and its mobile drawer list the same section links. How: Each row pairs a section's anchor with its label, and both lists map over it.


	{ hreStr : '#services', labStr : 'Services' }, // What: Services Link Row. Why: The services section is the first stop for most visitors. How: This links to its anchor.
	{ hreStr : '#about',    labStr : 'About' },    // What: About Link Row. Why: Visitors check who they'd be hiring. How: This links to its anchor.
	{ hreStr : '#contact',  labStr : 'Contact' }   // What: Contact Link Row. Why: The contact section is where an estimate is requested. How: This links to its anchor.


];

// #endregion Constants



// #region Components

// #region NavBarCom

/**
 * NavBarCom = Navigation Bar Component
 *
 * @summary
 * Renders the site's top bar. It listens to the window's scroll position and
 * switches the bar to its scrolled style once the page is more than 24px
 * down, checking once on mount so a page reloaded mid-scroll starts in the
 * right style. On small screens a toggle button opens and closes a drawer
 * holding the same section links plus the phone number; picking a link in
 * the drawer closes it again.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The site's top bar, with its mobile drawer.
 *
 * @example
 * ```tsx
 * NavBarCom() // => <NavBarCom />
 * ```
 *
*/

function NavBarCom () : React.JSX.Element {


	const [ draOpeBoo, setDraOpeBoo ] = React.useState( false ); // What: Drawer Open Boolean And Setter. Why: The mobile drawer opens and closes from the toggle button. How: This starts closed and drives the toggle's and drawer's open classes.
	const [ scrPasBoo, setScrPasBoo ] = React.useState( false ); // What: Scroll Past Boolean And Setter. Why: The bar takes its scrolled style once the page moves past the top. How: This starts false and is set by the scroll listener below.


	React.useEffect( () => { // What: Scroll Listener Effect. Why: The bar's style depends on the window's scroll position. How: This checks the position once, then again on every scroll until unmount.


		const onScrWinFun = () => setScrPasBoo( window.scrollY > 24 ); // What: On Scroll Window Function. Why: The scrolled style should apply only once the page is past the very top. How: This sets scrPasBoo whenever the page is more than 24px down.


		onScrWinFun(); // What: Initial Scroll Check Call. Why: A page reloaded mid-scroll should start in the scrolled style without waiting for the next scroll. How: This runs the check once on mount.


		window.addEventListener( 'scroll', onScrWinFun, { passive : true } ); // What: Scroll Listener Registration. Why: The check has to rerun as the page scrolls. How: This registers it as a passive listener, since it never cancels scrolling.



		return () => window.removeEventListener( 'scroll', onScrWinFun ); // What: Scroll Listener Cleanup. Why: An unmounted bar shouldn't keep reacting to scrolls. How: This removes the listener.


	}, [] ); // What: Effect Dependency Array. Why: The listener should be registered exactly once per mount, never re-run. How: An empty array means there is no dependency that could ever change to trigger a re-run.



	return (


		<header className={ ` nav   ${ scrPasBoo ? 'nav--scrolled' : '' } ` }>{ /* What: Navigation Header Element. Why: This is the site's top bar landmark. How: This takes its scrolled style once scrPasBoo is true. */ }


			<div className='nav__inner container'>{ /* What: Navigation Inner Div Element. Why: The bar's contents should line up with the page's content width. How: This holds the brand, links, actions, and toggle in one row. */ }


				<a
					className='nav__brand'

					href='#top'

					aria-label='Reese Roofing, home'
				>{ /* What: Navigation Brand Anchor Element. Why: The logo and name should take visitors back to the top. How: This links to the page's top anchor. */ }


					<img
						className='nav__mark'

						height='36'
						src={ lomSvgUrl }
						width='40'

						alt=''
					/>{ /* What: Navigation Mark Image Element. Why: The bar shows the simple logo mark beside the name. How: Its empty alt leaves the link's aria-label to name it, since the image is decorative. */ }

					<span className='nav__name'>{ /* What: Navigation Name Span Element. Why: The company's name sits beside the mark. How: The second word takes a lighter weight. */ }
						Reese <span className='nav__name-light'>Roofing</span>
					</span>


				</a>

				<nav
					className='nav__links'

					aria-label='Primary'
				>{ /* What: Navigation Links Nav Element. Why: The section links form the site's primary navigation landmark. How: This lists one link per row of NAV_LIN_ARR. */ }


					{ NAV_LIN_ARR.map( ( navLinObj ) => ( // What: Nav Link Map. Why: The bar lists every section link. How: This renders one anchor per row.


						<a
							key={ navLinObj.hreStr }

							className='nav__link'

							href={ navLinObj.hreStr }
						>{ /* What: Navigation Link Anchor Element. Why: Each link jumps to its section. How: This links to the row's anchor. */ }
							{ navLinObj.labStr }
						</a>


					))}


				</nav>

				<div className='nav__cta'>{ /* What: Navigation Call-To-Action Div Element. Why: The bar's two ways to reach the company sit together. How: This holds the phone link and the estimate button. */ }


					<a
						className='nav__phone'

						href='tel:+17855550199'

						aria-label='Call Reese Roofing'
					>{ /* What: Navigation Phone Anchor Element. Why: Phone visitors should be able to call in one tap. How: This dials the company's number. */ }
						(785) 555-0199
					</a>

					<a
						className='btn btn-primary nav__btn'

						href='#contact'
					>{ /* What: Navigation Button Anchor Element. Why: The bar's main action is requesting an estimate. How: This links to the contact section. */ }


						Get an estimate
						<span className='arrow'>→</span>{ /* What: Arrow Span Element. Why: The arrow marks the button as moving the visitor onward. How: This sits right after the label. */ }


					</a>


				</div>

				<button
					className={ ` nav__toggle   ${ draOpeBoo ? 'is-open' : '' } ` }

					aria-expanded={ draOpeBoo }
					aria-label='Toggle menu'

					onClick={ () => setDraOpeBoo( ( preOpeBoo ) => !preOpeBoo ) }
				>{ /* What: Navigation Toggle Button Element. Why: Small screens hide the links behind a menu button. How: This flips the drawer open or closed and reports its state to screen readers. */ }


					<span />{ /* What: Toggle Line Span Element. Why: The button draws its icon from two lines. How: Its stylesheet turns the pair into a cross while the drawer is open. */ }

					<span />{ /* What: Toggle Line Span Element. Why: The button draws its icon from two lines. How: Its stylesheet turns the pair into a cross while the drawer is open. */ }


				</button>


			</div>


			<div className={ ` nav__drawer   ${ draOpeBoo ? 'is-open' : '' } ` }>{ /* What: Navigation Drawer Div Element. Why: Small screens show the links in a drawer below the bar. How: This opens while draOpeBoo is true. */ }


				{ NAV_LIN_ARR.map( ( navLinObj ) => ( // What: Drawer Link Map. Why: The drawer repeats every section link. How: This renders one anchor per row.


					<a
						key={ navLinObj.hreStr }

						className='nav__drawer-link'

						href={ navLinObj.hreStr }

						onClick={ () => setDraOpeBoo( false ) }
					>{ /* What: Drawer Link Anchor Element. Why: Each link jumps to its section. How: This links to the row's anchor and closes the drawer behind it. */ }
						{ navLinObj.labStr }
					</a>


				))}

				<a
					className='nav__drawer-link nav__drawer-link--muted'

					href='tel:+17855550199'
				>{ /* What: Drawer Phone Anchor Element. Why: The drawer keeps the phone number reachable on small screens. How: This dials the company's number. */ }
					(785) 555-0199
				</a>


			</div>


		</header>


	);


}

// #endregion NavBarCom

// #endregion Components



// #region Exports

export { NavBarCom }; // What: Named Exports. Why: Every page renders the shared navigation bar. How: This exports NavBarCom.

// #endregion Exports



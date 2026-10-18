


// #region Imports

import cssModObj from './not-found.module.css'; // What: CSS Module Object. Why: The page's layout and its label, heading, paragraph, and buttons are styled in its own module. How: Each element reads its hashed class name from this object.


import { Link         } from 'react-router';             // What: Link. Why: The way home should navigate inside the site without a full page load. How: This renders the return button.
import { NavBarCom    } from '../../ui/nav.tsx';         // What: Navigation Bar Component. Why: The 404 page keeps the site's top bar, so every section stays one tap away. How: This is rendered first inside the page.
import { SitFooCom    } from '../../ui/footer.tsx';      // What: Site Footer Component. Why: The 404 page ends with the site's footer like every page. How: This is rendered last inside the page.
import { useSecCliFun } from '../../ui/section-link.ts'; // What: Use Section Click Function. Why: The estimate button reaches the contact section the same way the bar's does. How: This returns secCliFun, the shared click handler that navigates home to a section without leaving a hash in the address.

// #endregion Imports



/**
 * not-found.tsx = Not Found Page
 *
 * @summary
 * The page every unknown path falls through to. Between the shared
 * navigation bar and footer, it says the page doesn't exist and offers two
 * ways onward: back to the home page, or straight to the estimate form. The
 * page fills at least the screen's height, so the footer sits at the bottom
 * of a short window rather than floating halfway up it.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

// #region NotFouCom

/**
 * NotFouCom = Not Found Component
 *
 * @summary
 * Renders the 404 page: its own title, which React moves into the head, the
 * navigation bar, then a main element holding a centered column with an
 * error label, the heading, a short explanation, and two buttons, then the
 * footer. The return button navigates home inside the site; the estimate
 * button goes through secCliFun, which navigates home inside the site to the
 * contact section, where the home page scrolls to the form and clears the
 * hash, while a Ctrl, Cmd, or middle click opens its /#contact address in a
 * new tab. The main element carries the
 * top anchor, so the footer's back-to-top link works here too. app.tsx
 * renders it for every path no other route claims.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The 404 page.
 *
 * @example
 * ```tsx
 * NotFouCom() // => <NotFouCom />
 * ```
 *
*/

function NotFouCom () : React.JSX.Element {


	const secCliFun = useSecCliFun(); // What: Section Click Function. Why: The estimate button reaches its section the same way the bar's does. How: This leaves a modified click to the browser and otherwise navigates home to the section without a hash.



	return (


		<div className={ cssModObj.nofPagDiv }>{ /* What: Not-Found Page Div Element. Why: The footer should sit at the bottom of the screen on a page this short. How: This stacks the bar, main content, and footer in a column at least the screen's height. */ }


			<title>Page Not Found | Reese Roofing Portfolio Demo</title>{ /* What: Page Title Element. Why: A visitor's tab and history should say the address they tried doesn't exist. How: React 19 moves this title into the head ahead of index.html's own, and takes it out again when the page leaves, so the home page's title applies once more. */ }



			<NavBarCom />{ /* What: Navigation Bar Component. Why: The page starts with the shared top bar. How: This renders it above the content. */ }



			<main
				id='top'

				className={ cssModObj.nofConMai }
			>{ /* What: Not-Found Content Main Element. Why: The page's one message is its main content. How: This centers a single column in the space between the bar and the footer, and its id, kept as top since it's a navigation target, is where the footer's back-to-top link lands. */ }


				<span className={ cssModObj.eyeLabSpa }>Error 404</span>{ /* What: Eyebrow Label Span Element. Why: A small label names the error before the heading. How: This is the page's error label, set in the site's eyebrow style. */ }

				<h1 className={ cssModObj.nofTitHea }>{ /* What: Not-Found Title Heading Element. Why: The page's heading states the problem plainly. How: This sets it in the display style, sized to the viewport between two bounds by its module class. */ }
					Page not <em className={ cssModObj.titAccEmp }>found</em>.
				</h1>

				<p className={ cssModObj.secLedPar }>The page you're looking for doesn't exist. Let's get you back home.</p>{ /* What: Section Lede Paragraph Element. Why: Visitors should know what happened and what to do next. How: This uses the site's lede style. */ }

				<div className={ cssModObj.nofActDiv }>{ /* What: Not-Found Actions Div Element. Why: The page's two ways onward sit together. How: This holds the return and estimate buttons side by side, wrapping if needed. */ }


					<Link
						className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncPrimary } `}

						to='/'
					>{ /* What: Return Home Link. Why: The page's main action is going back home. How: This navigates to the root path inside the site. */ }
						Return home <span className={ cssModObj.arrIcoSpa } aria-hidden='true'>→</span>
					</Link>



					<a
						className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncGhost } `}

						href='/#contact'

						onClick={ ( cliEveObj ) => secCliFun( cliEveObj, 'contact' ) }
					>{ /* What: Ghost Button Base Anchor Element. Why: A visitor who came looking for a service can still request an estimate in one step. How: This is the estimate button, which navigates home to the contact section without a hash, while a Ctrl, Cmd, or middle click opens it in a new tab. */ }
						Get an estimate
					</a>


				</div>


			</main>



			<SitFooCom />{ /* What: Site Footer Component. Why: The page ends with the shared footer. How: This renders it below the content. */ }


		</div>


	);


}

// #endregion NotFouCom

// #endregion Components



// #region Exports

export { NotFouCom }; // What: Named Exports. Why: app.tsx renders the 404 page for unknown paths. How: This exports NotFouCom.

// #endregion Exports



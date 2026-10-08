



// #region Imports

import cssModObj from './not-found.module.css'; // What: CSS Module Object. Why: The page's layout and its label, heading, paragraph, and buttons are styled in its own module. How: Each element reads its hashed class name from this object.


import { Link      } from 'react-router';         // What: Link. Why: The way home should navigate inside the site without a full page load. How: This renders the return button.
import { NavBarCom } from '../../ui/nav.tsx';     // What: Navigation Bar Component. Why: The 404 page keeps the site's top bar, so every section stays one tap away. How: This is rendered first inside the page.
import { SitFooCom } from '../../ui/footer.tsx';  // What: Site Footer Component. Why: The 404 page ends with the site's footer like every page. How: This is rendered last inside the page.

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
 * Renders the 404 page: the navigation bar, then a main element holding a
 * centered column with an error label, the heading, a short explanation, and
 * two buttons, then the footer. The return button navigates home inside the
 * site; the estimate button is a plain link to the home page's contact
 * anchor, so the browser loads the home page and scrolls to the form. The
 * main element carries the top anchor, so the footer's back-to-top link
 * works here too. app.tsx renders it for every path no other route claims.
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


	return (


		<div className={ cssModObj.nofPagDiv }>{ /* What: Not-Found Page Div Element. Why: The footer should sit at the bottom of the screen on a page this short. How: This stacks the bar, main content, and footer in a column at least the screen's height. */ }


			<NavBarCom />{ /* What: Navigation Bar Component. Why: The page starts with the shared top bar. How: This renders it above the content. */ }



			<main
				id='top'

				className={ cssModObj.notFouMai }
			>{ /* What: Not Found Main Element. Why: The page's one message is its main content. How: This centers a single column in the space between the bar and the footer, and its id, kept as top since it's a navigation target, is where the footer's back-to-top link lands. */ }


				<span className={ cssModObj.eyeLabSpa }>Error 404</span>{ /* What: Error Label Span Element. Why: A small label names the error before the heading. How: This uses the site's eyebrow style. */ }

				<h1 className={ cssModObj.notFouHea }>{ /* What: Not Found Heading Element. Why: The page's heading states the problem plainly. How: This sets it in the display style, sized to the viewport between two bounds by its module class. */ }
					Page not <em className={ cssModObj.titAccEmp }>found</em>.
				</h1>

				<p className={ cssModObj.nofLedPar }>The page you're looking for doesn't exist. Let's get you back home.</p>{ /* What: Explanation Paragraph Element. Why: Visitors should know what happened and what to do next. How: This uses the site's lede style. */ }

				<div className={ cssModObj.nofActDiv }>{ /* What: Not-Found Actions Div Element. Why: The page's two ways onward sit together. How: This holds the return and estimate buttons side by side, wrapping if needed. */ }


					<Link
						className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncPrimary } `}

						to='/'
					>{ /* What: Link. Why: The page's main action is going back home. How: This navigates to the root path inside the site. */ }
						Return home <span className={ cssModObj.arrIcoSpa }>→</span>
					</Link>

					<a
						className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncGhost } `}

						href='/#contact'
					>{ /* What: Estimate Button Anchor Element. Why: A visitor who came looking for a service can still request an estimate in one step. How: This links to the home page's contact section, loading the home page and scrolling to the form. */ }
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



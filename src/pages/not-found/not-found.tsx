


// #region Imports

import cssModObj from './not-found.module.css'; // What: CSS Module Object. Why: The page's centered layout and its label, heading, paragraph, and button are styled in its own module. How: Each element reads its hashed class name from this object.


import { Link } from 'react-router'; // What: Link. Why: The way home should navigate inside the site without a full page load. How: This renders the return button.

// #endregion Imports



/**
 * not-found.tsx = Not Found Page
 *
 * @summary
 * The page every unknown path falls through to. It says the page doesn't
 * exist and offers one way back to the home page. The page is rebuilt around
 * the shared navigation bar and footer once the CSS passes are done.
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
 * Renders the 404 page: a full-height, centered column with an error label,
 * the heading, a short explanation, and a button linking back to the home
 * page. app.tsx renders it for every path no other route claims.
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


		<main className={ cssModObj.notFouMai }>{ /* What: Not Found Main Element. Why: The page's one message is its main content. How: This centers a single column in the full viewport height. */ }


			<span className={ cssModObj.eyeLabSpa }>Error 404</span>{ /* What: Error Label Span Element. Why: A small label names the error before the heading. How: This uses the site's eyebrow style. */ }

			<h1 className={ cssModObj.notFouHea }>{ /* What: Not Found Heading Element. Why: The page's heading states the problem plainly. How: This sets it in the display style, sized to the viewport between two bounds by its module class. */ }
				Page not <em className={ cssModObj.titAccEmp }>found</em>.
			</h1>

			<p className={ cssModObj.nofLedPar }>The page you're looking for doesn't exist. Let's get you back home.</p>{ /* What: Explanation Paragraph Element. Why: Visitors should know what happened and what to do next. How: This uses the site's lede style. */ }



			<Link
				className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncPrimary } `}

				to='/'
			>{ /* What: Link. Why: The page's one action is going back home. How: This navigates to the root path inside the site. */ }
				Return home <span className={ cssModObj.arrIcoSpa }>→</span>
			</Link>


		</main>


	);


}

// #endregion NotFouCom

// #endregion Components



// #region Exports

export { NotFouCom }; // What: Named Exports. Why: app.tsx renders the 404 page for unknown paths. How: This exports NotFouCom.

// #endregion Exports






// #region Imports

import Home     from './pages/home/home.tsx';           // What: Home. Why: The home page holds every section of the site. How: This is rendered by the root path's route.
import NotFound from './pages/not-found/not-found.tsx'; // What: Not Found. Why: An unknown path should show a 404 page rather than nothing. How: This is rendered by the catch-all route.


import { Route  } from 'react-router'; // What: Route. Why: Each page is tied to the URL path that shows it. How: This declares the two routes below.
import { Routes } from 'react-router'; // What: Routes. Why: Only the first route matching the current path should render. How: This wraps the routes below.

// #endregion Imports



/**
 * app.tsx = App
 *
 * @summary
 * The site's root component and its route table. The root path renders the
 * home page, and every other path falls through to the 404 page. A new page
 * gets its own route here and its own folder under src/pages/.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

// #region AppRooCom

/**
 * AppRooCom = App Root Component
 *
 * @summary
 * Renders the site's route table, so whichever page matches the current URL
 * path is the one on screen: the home page at the root path, and the 404 page
 * for anything else. main.tsx renders it once, inside BrowserRouter, which
 * supplies the URL the routes match against.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The page matching the current URL path.
 *
 * @example
 * ```tsx
 * AppRooCom() // => <AppRooCom />
 * ```
 *
*/

function AppRooCom () : React.JSX.Element {


	return (


		<Routes>{ /* What: Routes. Why: Only one page should render for any path. How: This renders the first route below whose path matches. */ }


			<Route
				element={ <Home /> }
				path='/'
			/>{ /* What: Home Route. Why: The site's root address is its home page. How: This renders Home at the root path. */ }



			<Route
				element={ <NotFound /> }
				path='*' // What: Catch-All Path. Why: Any address the site doesn't have should land on the 404 page. How: The asterisk matches every path no earlier route claimed.
			/>{ /* What: Not Found Route. Why: Unknown paths need a page of their own. How: This renders NotFound for every other path. */ }


		</Routes>


	);


}

// #endregion AppRooCom

// #endregion Components



// #region Exports

export { AppRooCom }; // What: Named Exports. Why: main.tsx is the sole consumer, mounting this as the site's root. How: This exports AppRooCom.

// #endregion Exports



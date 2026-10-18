


// #region Imports

import { execFileSync  } from 'node:child_process'; // What: Exec File Sync. Why: Each engine's run checks a fresh production build. How: This runs Vite's build and waits for it to finish.
import { existsSync    } from 'node:fs';            // What: Exists Sync. Why: A request for a file the build doesn't have falls back to the page. How: This checks whether a built file exists.
import { expect        } from '@playwright/test';   // What: Expect. Why: The build passes only with no violations and a compacted page. How: This asserts each check.
import { fileURLToPath } from 'node:url';           // What: File URL To Path. Why: The build runs from the repo root, two folders above this file. How: This turns that folder's URL into a path.
import { readFileSync  } from 'node:fs';            // What: Read File Sync. Why: Built files and the headers file are read from disk. How: This reads each one.
import { statSync      } from 'node:fs';            // What: Stat Sync. Why: A path the build has as a folder isn't a file to serve. How: This reads whether a path is a file.
import { test          } from '@playwright/test';   // What: Test. Why: Each check of the build is its own test. How: This declares them.


import type { Page } from '@playwright/test'; // What: Page. Why: The serving helper drives a Playwright page. How: This types its page parameter.

// #endregion Imports



/**
 * build.spec.ts = Build Spec
 *
 * @summary
 * Checks the production build, in whichever engine the project runs, where
 * the other suites only ever see the dev server. Each engine builds the site
 * into its own folder under tests/output, then serves those built files to
 * the browser through Playwright's request routing, sending every header
 * Netlify's _headers file sets for the whole site, the Content-Security-Policy
 * included, and answering any path without a file of its own with the page,
 * as _redirects does. The home page and the 404 page at desktop size, and the
 * home page at phone size with the drawer open, must each render without a
 * single security policy violation, which catches a new inline style or
 * script, or a file from another origin, that the policy would block on the
 * live site. The built index.html must also arrive compacted, as vite.config's
 * page minifier promises: no HTML comments, no indentation, no blank lines,
 * and its JSON-LD valid and on one line.
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

const ROO_DIR_STR = fileURLToPath( new URL( '../..', import.meta.url ) ); // What: Root Directory String. Why: Vite builds from the repo root, where vite.config.ts lives. How: This resolves the folder two levels above this spec.
const SIT_URL_STR = 'https://reese.test';                               // What: Site URL String. Why: The built files are served under an address no real server answers, so every request reaches the routing helper. How: This is the origin each page opens on.



/**
 * TYP_MAP_OBJ = Type Map Object
 *
 * @summary
 * The media type each built file is served with, keyed by its extension,
 * the same types Netlify sends. Every row is one extension and its type, so
 * the rows carry no comments of their own.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const TYP_MAP_OBJ : Record< string, string > = { // What: Type Map Object. Why: Each built file has to be served with its own content type, as Netlify would. How: Each key is a file extension and each value its media type.


	css         : 'text/css',
	html        : 'text/html',
	ico         : 'image/x-icon',
	js          : 'text/javascript',
	json        : 'application/json',
	png         : 'image/png',
	svg         : 'image/svg+xml',
	txt         : 'text/plain',
	webmanifest : 'application/manifest+json',
	woff2       : 'font/woff2'


};

// #endregion Constants



// #region Helpers

// #region sitHeaFun

/**
 * sitHeaFun = Site Headers Function
 *
 * @summary
 * Reads Netlify's _headers file from public/ and returns every header its
 * site-wide /* blocks set, by name, so a built file can be served with the
 * same headers Netlify sends with every response. Headers under any other
 * path are left out, since they wouldn't reach every file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The site-wide headers, keyed by name.
 * @see {@link heaRecObj}
 *
 * @example
 * ```ts
 * sitHeaFun() // => { 'Content-Security-Policy' : "default-src 'self'; ..." }
 * ```
 *
*/

function sitHeaFun () : Record< string, string > {


	const heaRecObj : Record< string, string > = {}; // What: Header Record Object. Why: Each site-wide header is collected by name. How: This starts empty.

	const heaTexStr = readFileSync( `${ ROO_DIR_STR }public/_headers`, 'utf8' ); // What: Headers Text String. Why: The headers come from the file Netlify reads. How: This reads it from public/.


	for ( const matCurObj of heaTexStr.matchAll( /^\/\*\n((?:\t.*\n?)+)/gm ) ) for ( const [ , heaNamStr, heaValStr ] of matCurObj[ 1 ].matchAll( /^\t([^:]+): (.*)$/gm ) ) heaRecObj[ heaNamStr ] = heaValStr; // What: Site Header Loop. Why: Only a /* block's headers reach every response. How: This reads each header line of every site-wide block into the record.



	return heaRecObj; // What: Header Record Return. Why: The serving helper sends these headers with every response. How: This hands back every site-wide header, keyed by name.


}

// #endregion sitHeaFun



// #region serBuiFun

/**
 * serBuiFun = Serve Build Function
 *
 * @summary
 * Serves a production build to the page through Playwright's request
 * routing, the way Netlify would serve it. A request under the site's
 * address gets the built file at that path, typed by its extension, while a
 * path with no file of its own gets the built index.html with a 200, as the
 * _redirects fallback does. Every response carries the site-wide headers,
 * so the browser enforces the real Content-Security-Policy.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to serve the build to.
 * @param outDirStr - Output Directory String: The folder the build was
 *                    written to.
 *
 * @returns A promise that settles once the route is in place, with no value.
 *
 * @example
 * ```ts
 * serBuiFun(page, outDirStr) // => Promise<void>
 * ```
 *
*/

async function serBuiFun ( curPagObj : Page, outDirStr : string ) : Promise< void > {


	const sitHeaObj = sitHeaFun(); // What: Site Headers Object. Why: Every response carries the site-wide headers. How: This reads them once from _headers.


	await curPagObj.route( `${ SIT_URL_STR }/**`, ( rouCurObj ) => { // What: Build Route Call. Why: Every request under the site's address is answered from the build. How: This serves the matching built file, or the page for any other path.


		const filPatStr = `${ outDirStr }${ new URL( rouCurObj.request().url() ).pathname }`; // What: File Path String. Why: A request names a file by its path under the build. How: This joins the build folder with the request's path.
		const filFouBoo = existsSync( filPatStr ) && statSync( filPatStr ).isFile();          // What: File Found Boolean. Why: A path without a file of its own falls back to the page. How: This checks the path names a built file.
		const serPatStr = filFouBoo ? filPatStr : `${ outDirStr }/index.html`;                // What: Served Path String. Why: The fallback is the page itself, as _redirects says. How: This picks the file, or index.html when there's none.


		void rouCurObj.fulfill({ // What: Fulfill Call. Why: The browser should get the file the way Netlify sends it. How: This answers with the file's bytes, its content type, and every site-wide header; void marks the returned promise as deliberately unawaited.


			body        : readFileSync( serPatStr ),                                                       // What: Body. Why: The browser gets the built file itself. How: This reads its bytes.
			contentType : TYP_MAP_OBJ[ serPatStr.split( '.' ).pop() ?? '' ] ?? 'application/octet-stream', // What: Content Type. Why: The browser reads each file by its type. How: This looks the type up by extension, falling back to a generic binary type.
			headers     : sitHeaObj,                                                                       // What: Headers. Why: Every response carries the site-wide headers, the policy included. How: This sends the ones read from _headers.
			status      : 200                                                                              // What: Status. Why: Every path answers, the fallback included, as _redirects says. How: This sends a success status.


		});


	} );


}

// #endregion serBuiFun

// #endregion Helpers



// #region Module Init

test.describe( 'the production build', () => { // What: Build Group. Why: The build runs once per engine, before either check. How: This groups both checks under one build step.


	let outDirStr = ''; // What: Output Directory String. Why: Each engine builds into its own folder, so parallel runs never write over each other. How: This holds the folder the build step chose.


	test.beforeAll( ( { browserName : engNamStr } ) => { // What: Build Step. Why: Both checks need a fresh production build. How: This builds the site into a folder named for the engine.


		outDirStr = `${ ROO_DIR_STR }tests/output/build-${ engNamStr }`; // What: Output Directory Assignment. Why: Each engine needs its own build folder. How: This names it after the engine under tests/output, which git ignores.


		execFileSync( 'npx', [ 'vite', 'build', '--emptyOutDir', '--logLevel', 'warn', '--outDir', outDirStr ], { cwd : ROO_DIR_STR, stdio : 'inherit' } ); // What: Build Call. Why: The checks have to see what visitors download. How: This runs Vite's production build into the engine's folder, from the repo root.


	} );



	for ( const [ rouPatStr, vieWidNum, vieHeiNum, draOpeBoo ] of [ [ '/', 1440, 900, false ], [ '/missing', 1440, 900, false ], [ '/', 390, 844, true ] ] as const ) { // What: Page Loop. Why: The policy has to hold on every page and with the drawer open. How: Each row names a path, a viewport width and height, and whether to open the drawer.


		test( `${ rouPatStr } at ${ vieWidNum.toLocaleString( 'en-US' ) }px${ draOpeBoo ? ' with the drawer open' : '' } runs under the security policy`, async ( { page : curPagObj } ) => { // What: Security Policy Test. Why: A style, script, or file the policy blocks would quietly break the live site, where the dev server never sends the policy. How: This serves the build with the real headers, opens the page, and checks nothing broke the policy.


			await curPagObj.setViewportSize( { height : vieHeiNum, width : vieWidNum } ); // What: Viewport Size Call. Why: The page is checked at the size its row names. How: This sizes the viewport to the row's width and height.

			await serBuiFun( curPagObj, outDirStr ); // What: Build Serve Call. Why: The page has to come from the build, with Netlify's headers. How: This routes every request under the site's address to the built files.

			await curPagObj.addInitScript( () => { // What: Violation Recorder. Why: A blocked style or script only reports itself through an event. How: This records every security policy violation from the moment the page loads.


				const vioLisArr : string[] = []; // What: Violation List Array. Why: Each violation has to be kept until the check reads it. How: This collects one description per violation.


				Reflect.set( window, 'vioLisArr', vioLisArr ); // What: Violation List Global Set. Why: The check reads the list from outside the page. How: This puts the array on the window.

				document.addEventListener( 'securitypolicyviolation', ( vioEveObj ) => vioLisArr.push( `${ vioEveObj.effectiveDirective } blocked ${ vioEveObj.blockedURI || 'inline content' }` ) ); // What: Violation Listener. Why: Each violation should be named in the failure. How: This records the directive it broke and what it blocked.


			} );

			await curPagObj.goto( `${ SIT_URL_STR }${ rouPatStr }` ); // What: Page Load Call. Why: The page is checked as a visitor first loads it. How: This opens the path on the site's address.

			await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toBeVisible(); // What: Render Wait. Why: A page the policy stopped from rendering would also show no violations if nothing ran. How: This waits until the page's heading is on screen.



			if ( draOpeBoo ) await curPagObj.getByRole( 'button', { name : 'Toggle menu' } ).click(); // What: Drawer Open Call. Why: The open drawer sets its own styles, which the policy has to allow too. How: This clicks the toggle on the row that asks for it.



			await curPagObj.evaluate( () => document.fonts.ready ); // What: Fonts Ready Wait. Why: The fonts load from their own files, which the policy has to allow. How: This waits until every font face has loaded or failed.


			expect( await curPagObj.evaluate( () => Reflect.get( window, 'vioLisArr' ) ) ).toEqual( [] ); // What: No Violation Assertion. Why: The live site should break none of its own policy. How: This checks the recorder heard no violations.


		} );


	}



	test( 'the built page ships compacted', () => { // What: Compacted Page Test. Why: The page's comments and indentation are for its source, not for visitors to download, and vite.config's minifier only runs in a build. How: This reads the built index.html and checks the minifier's work.


		const pagTexStr = readFileSync( `${ outDirStr }/index.html`, 'utf8' );                                           // What: Page Text String. Why: The checks read the page as it ships. How: This reads the built index.html.
		const jsoTexStr = pagTexStr.match( /<script type=['"]application\/ld\+json['"]>(.*?)<\/script>/s )?.[ 1 ] ?? ''; // What: JSON Text String. Why: The structured data is compacted onto one line, and has to stay valid. How: This reads the JSON-LD script's contents.


		expect( pagTexStr ).not.toContain( '<!--' );                                                          // What: No Comment Assertion. Why: HTML comments are for the source. How: This checks none survived the build.
		expect( pagTexStr ).not.toMatch( /^[ \t]/m );                                                         // What: No Indentation Assertion. Why: Indentation is for the source. How: This checks no line starts with a space or tab.
		expect( pagTexStr ).not.toMatch( /\n\s*\n/ );                                                         // What: No Blank Line Assertion. Why: Blank lines are for the source. How: This checks no two line breaks sit with only whitespace between them.
		expect( pagTexStr ).toContain( '<title>Reese Roofing | Portfolio Demo by techgeek.support</title>' ); // What: Title Kept Assertion. Why: Compacting must not lose the page's content. How: This checks the full title still ships.
		expect( jsoTexStr ).not.toContain( '\n' );                                                            // What: One Line JSON Assertion. Why: The structured data's whitespace is for the source. How: This checks it ships on one line.
		expect( () => JSON.parse( jsoTexStr ) ).not.toThrow();                                                // What: Valid JSON Assertion. Why: Compacting must not break the structured data. How: This checks it still parses.


	} );


} );

// #endregion Module Init



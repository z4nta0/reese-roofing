



// #region Imports

import { expect } from '@playwright/test'; // What: Expect. Why: Each check passes only when the page says what it should. How: This asserts on the page's head, files, and footer.
import { test   } from '@playwright/test'; // What: Test. Why: Each route and each file is its own test. How: This declares them.

// #endregion Imports



/**
 * head.spec.ts = Head Spec
 *
 * @summary
 * Checks the site's SEO setup in whichever engine the project runs. The site
 * is a portfolio demo for a fictional company, so beyond the usual title,
 * description, canonical, and social tags, every check confirms it stays out
 * of search and never passes as a real business: each route carries a
 * noindex robots meta and says it's a demo, the structured data describes a
 * demo website rather than a local business, the footer says the company is
 * fictional, robots.txt lets search crawlers read the noindex while keeping
 * AI crawlers out, Netlify's _headers sends noindex with every file, and the
 * social preview image is the 1200x630 card the tags promise.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const LIV_URL_STR = 'https://reese-roofing.netlify.app/'; // What: Live Url String. Why: The canonical and social tags must name the live address. How: This is the address they're compared with.



/**
 * ROU_RCD_ARR = Route Record Array
 *
 * @summary
 * Every route the head checks visit, each with the title it must show. Every
 * row shares one shape, so its fields carry no comments of their own:
 * - `patStr` (String): Path String, the route loaded from the dev server.
 * - `titStr` (String): Title String, the exact title the route must show.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const ROU_RCD_ARR = [ // What: Route Record Array. Why: Each route has its own title to check. How: Each row pairs a path with its expected title.


	{ patStr : '/',        titStr : 'Reese Roofing | Portfolio Demo by techgeek.support' }, // What: Home Route Row. Why: The home page carries index.html's own title. How: This expects it unchanged.
	{ patStr : '/missing', titStr : 'Page Not Found | Reese Roofing Portfolio Demo'      }  // What: Not Found Route Row. Why: The 404 page sets its own title. How: This expects the title the page renders.


];

// #endregion Constants



// #region Module Init

for ( const rouRcdObj of ROU_RCD_ARR ) { // What: Route Test Loop. Why: Every route gets the same head checks. How: This declares one test per route.


	test( `${ rouRcdObj.patStr } has a demo-only head`, async ( { page : curPagObj } ) => { // What: Head Test. Why: Every route has to describe itself honestly and stay out of search. How: This loads the route and checks its title, meta tags, structured data, and footer.


		await curPagObj.goto( rouRcdObj.patStr ); // What: Route Load Call. Why: The head is read as a browser builds it. How: This opens the route on the suite's dev server.


		await expect( curPagObj ).toHaveTitle( rouRcdObj.titStr );                                                                     // What: Title Assertion. Why: Each route names itself, saying it's a demo. How: This waits for the route's exact title.
		await expect( curPagObj.locator( 'meta[name="robots"]' ) ).toHaveAttribute( 'content', /noindex/ );                            // What: Robots Assertion. Why: A fictional company must stay out of search results. How: This checks the robots meta asks for noindex.
		await expect( curPagObj.locator( 'meta[name="description"]' ) ).toHaveAttribute( 'content', /fictional/ );                     // What: Description Assertion. Why: Any summary of the page should say the company isn't real. How: This checks the description calls it fictional.
		await expect( curPagObj.locator( 'link[rel="canonical"]' ) ).toHaveAttribute( 'href', LIV_URL_STR );                           // What: Canonical Assertion. Why: Every address the site answers at should point at the live one. How: This checks the canonical link names it.
		await expect( curPagObj.locator( 'meta[property="og:url"]' ) ).toHaveAttribute( 'content', LIV_URL_STR );                      // What: Open Graph Url Assertion. Why: Shared links should count as one page. How: This checks the social URL names the live address.
		await expect( curPagObj.locator( 'meta[property="og:image"]' ) ).toHaveAttribute( 'content', `${ LIV_URL_STR }og-image.png` ); // What: Open Graph Image Assertion. Why: Link previews need an absolute image address. How: This checks it points at the live preview card.
		await expect( curPagObj.locator( 'meta[name="twitter:card"]' ) ).toHaveAttribute( 'content', 'summary_large_image' );          // What: Twitter Card Assertion. Why: The preview card should show at its full size. How: This checks the large image layout is asked for.
		await expect( curPagObj.getByRole( 'contentinfo' ) ).toContainText( 'Reese Roofing is a fictional company.' );                 // What: Footer Notice Assertion. Why: Visitors and AI agents reading the page itself should learn the company isn't real. How: This checks the footer's demo line.


		const jsoScrArr = await curPagObj.locator( 'script[type="application/ld+json"]' ).allTextContents(); // What: Json Script Array. Why: The structured data decides what search engines and agents think the page is. How: This reads every JSON-LD script's text.


		expect( jsoScrArr.map( ( jsoTexStr ) => JSON.parse( jsoTexStr )[ '@type' ] ) ).toEqual( [ 'WebSite' ] ); // What: Website Type Assertion. Why: The page should describe exactly one demo website. How: This parses each script, which also fails on invalid JSON, and checks there's one, typed WebSite.

		expect( jsoScrArr.join( '' ) ).not.toMatch( /LocalBusiness|RoofingContractor|PostalAddress|telephone/ ); // What: No Business Data Assertion. Why: Structured data must never present the fictional company as a real business. How: This checks no local business type, address, or phone appears in it.


	} );


}



test( 'robots.txt and _headers keep the demo out of search', async ( { page : curPagObj } ) => { // What: Crawler Files Test. Why: The page's own noindex only works when crawlers can read it, and AI crawlers should stay away. How: This reads both files from the dev server and checks their rules.


	const robTexStr = await ( await curPagObj.request.get( '/robots.txt' ) ).text(); // What: Robots Text String. Why: Crawlers read robots.txt before the page. How: This fetches it.
	const heaTexStr = await ( await curPagObj.request.get( '/_headers' ) ).text();   // What: Headers Text String. Why: Netlify reads its header rules from this file. How: This fetches it, which Vite serves as a plain file from public/.


	expect( robTexStr ).toMatch( /User-agent: \*\nAllow: \// );                // What: Search Crawlers Assertion. Why: Search engines must reach the page to read its noindex. How: This checks the wildcard group allows the site.
	expect( robTexStr ).toMatch( /User-agent: GPTBot\n[\s\S]*?Disallow: \// ); // What: AI Crawlers Assertion. Why: AI training crawlers shouldn't learn the fictional company. How: This checks a named AI crawler's group disallows the site.
	expect( robTexStr ).not.toMatch( /Sitemap:/i );                            // What: No Sitemap Assertion. Why: A site kept out of search has nothing to list. How: This checks robots.txt names no sitemap.
	expect( heaTexStr ).toMatch( /\/\*\n\tX-Robots-Tag: noindex/ );            // What: Robots Header Assertion. Why: Every file, the preview image included, should carry noindex. How: This checks the site-wide header rule.


} );



test( 'the social preview image is a 1200x630 png', async ( { page : curPagObj } ) => { // What: Preview Image Test. Why: The social tags promise a 1200x630 card. How: This fetches the image and reads its size from the PNG header.


	const resImaObj = await curPagObj.request.get( '/og-image.png' ); // What: Response Image Object. Why: The image has to exist where the tags point. How: This fetches it from the dev server.
	const pngBufObj = await resImaObj.body();                         // What: Png Buffer Object. Why: The image's size is written in its header. How: This reads the response bytes.


	expect( resImaObj.headers()[ 'content-type' ] ).toBe( 'image/png' );                               // What: Png Type Assertion. Why: The tags promise a PNG. How: This checks the served type.
	expect( [ pngBufObj.readUInt32BE( 16 ), pngBufObj.readUInt32BE( 20 ) ] ).toEqual( [ 1200, 630 ] ); // What: Png Size Assertion. Why: The tags promise 1200 by 630 pixels. How: This reads the width and height a PNG stores at bytes 16 and 20.


} );

// #endregion Module Init



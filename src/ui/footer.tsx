


// #region Imports

import cssModObj from './footer.module.css';     // What: CSS Module Object. Why: The footer's layout and type are styled in its own module. How: Each element reads its hashed class name from this object.
import lomSvgUrl from '../assets/logo-mark.svg'; // What: Logo-Mark SVG URL. Why: The footer's brand shows the simple logo mark. How: Vite resolves the import to a URL for the image's src, inlining this small file into the bundle as a data URI in the build.


import { modCliFun } from './section-link.ts';  // What: Modified Click Function. Why: A Ctrl or Cmd click on back to top should still open the page in a new tab, the way a middle click does without reaching the handler. How: The link's handler steps aside when this reports a modified click.
import { redMotFun } from '../utils/motion.ts'; // What: Reduce Motion Function. Why: The smooth scroll back up has to respect the reduced-motion preference. How: The link's handler asks it before choosing the scroll behavior.

// #endregion Imports



/**
 * footer.tsx = Site Footer
 *
 * @summary
 * The site's footer, shared by every page. It repeats the brand, gives the
 * copyright year and the company's licensing and location, says the company is
 * fictional and the site a portfolio demo, linking to its builder, and links
 * back to the top of the page.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

// #region SitFooCom

/**
 * SitFooCom = Site Footer Component
 *
 * @summary
 * Renders the site's footer: the logo mark and name, the copyright line with
 * the current year read from the visitor's clock on each render, so it never
 * needs a yearly edit, the licensing and location line, the line saying the
 * company is fictional and the site a portfolio demo by techgeek.dev, linking
 * to that site, and a link back to the top of the page, which scrolls up
 * without leaving a hash in the address, while a Ctrl, Cmd, or middle click
 * opens it in a new tab. It scrolls to whichever page's top anchor is showing,
 * the hero's or the 404 page's, rather than through the section links' shared
 * handler, which always heads for the home page.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The site's footer.
 *
 * @example
 * ```tsx
 * SitFooCom() // => <SitFooCom />
 * ```
 *
*/

function SitFooCom () : React.JSX.Element {


	const curYeaNum = new Date().getFullYear(); // What: Current Year Number. Why: The copyright line should always show this year. How: This reads the year from the visitor's clock on each render.



	const topCliFun = ( cliEveObj : React.MouseEvent< HTMLAnchorElement > ) => { // What: Top Click Function. Why: Back to top should scroll up without leaving a hash in the address. How: This leaves a modified click to the browser and otherwise cancels the browser's own scroll and scrolls the page's top anchor into view.


		if ( modCliFun( cliEveObj ) ) return; // What: Modified Click Guard. Why: A Ctrl, Cmd, Shift, or Alt click asks the browser to handle the link its own way, and a middle click never reaches this handler at all. How: This leaves the click alone.



		cliEveObj.preventDefault(); // What: Default Navigation Cancel. Why: The browser would otherwise scroll to the hash itself and leave it in the address. How: This stops the link's own navigation.

		document.getElementById( 'top' )?.scrollIntoView( { behavior : redMotFun() ? 'auto' : 'smooth' } ); // What: Top Scroll Call. Why: The visitor should be taken back up to the start of the page. How: This scrolls the page's top anchor into view, jumping instead of gliding under reduced motion.


	};



	return (


		<footer className={ cssModObj.sitFooFoo }>{ /* What: Site Footer Footer Element. Why: This is the page's footer landmark. How: This holds the footer's inner content block, a row that stacks at 880px wide and below. */ }


			<div className={ cssModObj.fooInnDiv }>{ /* What: Footer Inner Div Element. Why: The footer's contents should line up with the page's content width. How: This holds the brand, the meta lines, and the back-to-top link in one row, stacking them, left-aligned, at 880px wide and below. */ }


				<div className={ cssModObj.fooBraDiv }>{ /* What: Footer Brand Div Element. Why: The footer repeats the company's mark and name. How: This sets them side by side. */ }


					<span className={ cssModObj.fooMarSpa }>{ /* What: Footer Mark Span Element. Why: The dark logo mark needs a light tile to show against the dark footer. How: This is drawn as a small rounded paper square holding the mark's image. */ }


						<img
							className={ cssModObj.fooMarIma }

							height='25'
							src={ lomSvgUrl }
							width='28'

							alt=''
						/>{ /* What: Footer Mark Image Element. Why: The footer shows the simple logo mark beside the name. How: Its empty alt marks it decorative, since the name beside it says the same thing. */ }


					</span>

					<span>{ /* What: Footer Name Span Element. Why: The company's name sits beside the mark. How: The second word takes a lighter, italic, faded style. */ }
						Reese <span className={ cssModObj.namLigSpa }>Roofing</span>
					</span>


				</div>

				<div className={ cssModObj.fooMetDiv }>{ /* What: Footer Meta Div Element. Why: The legal and location details sit together. How: This stacks the copyright, licensing, and demo lines, centered, or left-aligned at 880px wide and below. */ }


					<span>© { curYeaNum } Reese Roofing, LLC</span>{ /* What: Footer Copyright Span Element. Why: The footer states the company's copyright. How: This pairs the current year with the company's legal name. */ }

					<span>Licensed & insured · Lawrence, KS</span>{ /* What: Footer Licensing Span Element. Why: Visitors look for proof a roofer is licensed and local. How: This states both on one line. */ }

					<span className={ cssModObj.fooDemSpa }>Reese Roofing is a fictional company. This site is a portfolio demo by <a className={ cssModObj.fooDemAnc } href='https://techgeek.dev/'>techgeek.dev</a>.</span>{ /* What: Footer Demo Span Element. Why: The site is a portfolio piece, and no visitor or AI agent reading it should take Reese Roofing for a real roofer. How: This says so on every page, linking to the site's builder. */ }


				</div>

				<a
					className={ cssModObj.fooTopAnc }

					href='#top'

					aria-label='Back to top'

					onClick={ topCliFun }
				>{ /* What: Footer Top Anchor Element. Why: A long page should offer a quick way back up. How: This scrolls to the page's top anchor through topCliFun, leaving no hash in the address, while its own address still opens the page's top in a new tab on a Ctrl, Cmd, or middle click. */ }
					Back to top <span className={ cssModObj.arrIcoSpa } aria-hidden='true'>↑</span>
				</a>


			</div>


		</footer>


	);


}

// #endregion SitFooCom

// #endregion Components



// #region Exports

export { SitFooCom }; // What: Named Export. Why: Every page renders the shared site footer. How: This exports SitFooCom.

// #endregion Exports



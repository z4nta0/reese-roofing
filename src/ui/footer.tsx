


// #region Imports

import cssModObj from './footer.module.css';     // What: CSS Module Object. Why: The footer's layout and type are styled in its own module. How: Each element reads its hashed class name from this object.
import lomSvgUrl from '../assets/logo-mark.svg'; // What: Logo-Mark Svg Url. Why: The footer's brand shows the simple logo mark. How: Vite resolves the import to the file's fingerprinted URL, used as the image's src.

// #endregion Imports



/**
 * footer.tsx = Site Footer
 *
 * @summary
 * The site's footer, shared by every page. It repeats the brand, gives the
 * copyright year and the company's licensing and location, says the company
 * is fictional and the site a portfolio demo, and links back to the top of
 * the page.
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
 * company is fictional and the site a portfolio demo by techgeek.support, and
 * a link back to the top of the page.
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



	return (


		<footer className={ cssModObj.sitFooFoo }>{ /* What: Site Footer Element. Why: This is the page's footer landmark. How: This holds the footer's single content row. */ }


			<div className={ cssModObj.fooInnDiv }>{ /* What: Footer Inner Div Element. Why: The footer's contents should line up with the page's content width. How: This holds the brand, the meta lines, and the back-to-top link in one row. */ }


				<div className={ cssModObj.fooBraDiv }>{ /* What: Footer Brand Div Element. Why: The footer repeats the company's mark and name. How: This sets them side by side. */ }


					<span className={ cssModObj.fooMarSpa }>{ /* What: Footer Mark Span Element. Why: The logo mark sits in its own sized box. How: This holds the mark's image. */ }


						<img
							className={ cssModObj.fooMarIma }

							height='26'
							src={ lomSvgUrl }
							width='28'

							alt=''
						/>{ /* What: Footer Mark Image Element. Why: The footer shows the simple logo mark beside the name. How: Its empty alt marks it decorative, since the name beside it says the same thing. */ }


					</span>

					<span>{ /* What: Footer Name Span Element. Why: The company's name sits beside the mark. How: The second word takes its own style. */ }
						Reese <span className={ cssModObj.namLigSpa }>Roofing</span>
					</span>


				</div>

				<div className={ cssModObj.fooMetDiv }>{ /* What: Footer Meta Div Element. Why: The legal and location details sit together. How: This stacks the copyright, licensing, and demo lines. */ }


					<span>© { curYeaNum } Reese Roofing, LLC</span>{ /* What: Copyright Span Element. Why: The footer states the company's copyright. How: This pairs the current year with the company's legal name. */ }

					<span>Licensed & insured · Lawrence, KS</span>{ /* What: Licensing Span Element. Why: Visitors look for proof a roofer is licensed and local. How: This states both on one line. */ }

					<span className={ cssModObj.fooDemSpa }>Reese Roofing is a fictional company. This site is a portfolio demo by <a className={ cssModObj.fooDemAnc } href='https://techgeek.support/'>techgeek.support</a>.</span>{ /* What: Footer Demo Span Element. Why: The site is a portfolio piece, and no visitor or AI agent reading it should take Reese Roofing for a real roofer. How: This says so on every page, linking to the site's builder. */ }


				</div>

				<a
					className={ cssModObj.fooTopAnc }

					href='#top'

					aria-label='Back to top'
				>{ /* What: Footer Top Anchor Element. Why: A long page should offer a quick way back up. How: This links to the page's top anchor. */ }
					Back to top <span className={ cssModObj.arrIcoSpa } aria-hidden='true'>↑</span>
				</a>


			</div>


		</footer>


	);


}

// #endregion SitFooCom

// #endregion Components



// #region Exports

export { SitFooCom }; // What: Named Exports. Why: Every page renders the shared site footer. How: This exports SitFooCom.

// #endregion Exports






// #region Imports

import cssModObj from './hero.module.css'; // What: CSS Module Object. Why: The hero's grid background, two-row layout, and stats are styled in its own module. How: Each element reads its hashed class name from this object.
import lofSvgUrl from './logo-full.svg';   // What: Logo-Full Svg Url. Why: The hero's main visual is the full logo. How: Vite resolves the import to the file's fingerprinted URL, used as the image's src.

// #endregion Imports



/**
 * hero.tsx = Hero Section
 *
 * @summary
 * The home page's opening section, and the target of every link back to the
 * top. It pairs the headline with the full logo over a faint grid, follows
 * with the company's pitch and its two calls to action, and ends with a row
 * of four headline numbers.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

// #region HerSecCom

/**
 * HerSecCom = Hero Section Component
 *
 * @summary
 * Renders the hero: a decorative grid drawn as a repeating SVG pattern
 * behind everything, the location label and headline beside the full logo,
 * the pitch paragraph with the estimate and services buttons, and the stats
 * row. The section carries the page's top anchor, so the navigation bar's
 * brand link and the footer's back-to-top link both land here.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The home page's hero section.
 *
 * @example
 * ```tsx
 * HerSecCom() // => <HerSecCom />
 * ```
 *
*/

function HerSecCom () : React.JSX.Element {


	return (


		<section
			id='top'

			className={ cssModObj.homHerSec }
		>{ /* What: Hero Section Element. Why: This opens the home page. How: Its top id is the anchor every back-to-top link targets, kept as is since it appears in the page's URL. */ }


			<div
				className={ cssModObj.herBacDiv }

				aria-hidden='true'
			>{ /* What: Hero Background Div Element. Why: The hero sits over a faint architectural grid. How: This holds the grid's SVG and hides it from screen readers, since it's decorative. */ }


				<svg
					className={ cssModObj.herGriSvg }

					preserveAspectRatio='xMidYMid slice'
					viewBox='0 0 1440 800'
				>{ /* What: Hero Grid Svg Element. Why: The grid is drawn as a vector so it stays crisp at any size. How: Its slice aspect ratio fills the section, cropping rather than letterboxing. */ }


					<defs>{ /* What: Grid Definitions Element. Why: The grid's tile is defined once and repeated. How: This holds the pattern the rectangle below fills with. */ }


						<pattern
							id='herGriPat'

							height='80'
							patternUnits='userSpaceOnUse'
							width='80'
						>{ /* What: Hero Grid Pattern Element. Why: One 80-unit tile repeats to make the whole grid. How: Its user-space units keep the tile the same size across the drawing. */ }


							<path
								d='M 80 0 L 0 0 0 80'
								fill='none'
								stroke='currentColor'
								strokeWidth='0.5'
							/>{ /* What: Grid Tile Path Element. Why: Each tile draws its top and left edges, so the tiles together form the grid. How: This strokes the two edges in the section's text color. */ }


						</pattern>


					</defs>

					<rect
						fill='url(#herGriPat)'
						height='800'
						width='1440'
					/>{ /* What: Grid Fill Rect Element. Why: The pattern needs a shape to fill. How: This covers the whole drawing with the grid tile. */ }


				</svg>


			</div>



			<div className={ cssModObj.pagConDiv }>{ /* What: Page Container Div Element. Why: The hero's content should line up with the page's content width. How: This stacks the top row, the bottom row, and the stats. */ }


				<div className={ cssModObj.herTopDiv }>{ /* What: Hero Top Div Element. Why: The headline and logo share the first row. How: This sets the copy on the left and the logo on the right. */ }


					<div className={ cssModObj.herCopDiv }>{ /* What: Hero Copy Div Element. Why: The location label sits directly above the headline. How: This stacks the two. */ }


						<span className={ cssModObj.eyeLabSpa }>Lawrence, Kansas · Est. 2008</span>{ /* What: Location Label Span Element. Why: Visitors should see where the company works and how long it's been there. How: This uses the site's eyebrow style. */ }

						<h1 className={ cssModObj.herTitHea }>{ /* What: Hero Title Heading Element. Why: The headline is the page's main heading. How: Its line breaks set the three-line shape, with one word in italic. */ }
							Commercial roofing,<br />
							built to <em className={ cssModObj.titAccEmp }>weather</em><br />
							every season.
						</h1>


					</div>


					<div className={ cssModObj.herLogDiv }>{ /* What: Hero Logo Div Element. Why: The full logo is the hero's main visual. How: This frames it with its decorative ring. */ }


						<img
							className={ cssModObj.herLogIma }

							height='515'
							src={ lofSvgUrl }
							width='500'

							alt='Reese Roofing: Commercial & Residential'
						/>{ /* What: Hero Logo Image Element. Why: The logo introduces the brand. How: Its alt text reads the logo's wording for screen readers. */ }


					</div>


				</div>



				<div className={ cssModObj.herBotDiv }>{ /* What: Hero Bottom Div Element. Why: The pitch and the calls to action share the second row. How: This sets them side by side. */ }


					<p className={ cssModObj.secLedPar }>{ /* What: Section Lede Paragraph Element. Why: The pitch says who the company serves and what it promises. How: This uses the site's lede style. */ }
						Reese Roofing serves businesses, property managers, and homeowners across
						Lawrence and the surrounding region, delivering installations and repairs
						that hold up to Kansas wind, sun, and storm.
					</p>

					<div className={ cssModObj.herActDiv }>{ /* What: Hero Actions Div Element. Why: The hero's two next steps sit together. How: This holds the estimate and services buttons. */ }


						<a
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncPrimary } `}

							href='#contact'
						>{ /* What: Estimate Button Anchor Element. Why: The page's main action is requesting an estimate. How: This links to the contact section. */ }
							Request an estimate
							<span
								className={ cssModObj.arrIcoSpa }

								aria-hidden='true'
							>{ /* What: Arrow Icon Span Element. Why: The arrow marks the button as moving the visitor onward. How: This sits right after the label, hidden from screen readers since it only decorates the label. */ }
								→
							</span>
						</a>

						<a
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncGhost } `}

							href='#services'
						>{ /* What: Services Button Anchor Element. Why: Visitors not ready for an estimate can browse first. How: This links to the services section. */ }
							Explore services
						</a>


					</div>


				</div>



				<div className={ cssModObj.herStaDiv }>{ /* What: Hero Stats Div Element. Why: A few numbers make the company's track record concrete. How: This lays out four stats in a row. */ }


					<div className={ cssModObj.staIteDiv }>{ /* What: Years Stat Div Element. Why: Longevity is a reason to trust a roofer. How: This pairs the number with its label. */ }


						<div className={ cssModObj.staNumDiv }>17+</div>{ /* What: Stat Number Div Element. Why: The number leads each stat. How: This sets it in the display style. */ }

						<div className={ cssModObj.staLabDiv }>Years serving Douglas County</div>{ /* What: Stat Label Div Element. Why: Each number needs to say what it counts. How: This sits below the number. */ }


					</div>


					<div className={ cssModObj.staIteDiv }>{ /* What: Roofs Stat Div Element. Why: Volume of finished work shows experience. How: This pairs the number with its label. */ }


						<div className={ cssModObj.staNumDiv }>400<span className={ cssModObj.staSufSpa }>+</span></div>{ /* What: Stat Number Div Element. Why: The number leads each stat. How: Its plus sign takes a separate style. */ }

						<div className={ cssModObj.staLabDiv }>Commercial roofs completed</div>{ /* What: Stat Label Div Element. Why: Each number needs to say what it counts. How: This sits below the number. */ }


					</div>


					<div className={ cssModObj.staIteDiv }>{ /* What: Emergency Stat Div Element. Why: Storm damage can't wait for business hours. How: This pairs the number with its label. */ }


						<div className={ cssModObj.staNumDiv }>24<span className={ cssModObj.staSufSpa }>/7</span></div>{ /* What: Stat Number Div Element. Why: The number leads each stat. How: Its suffix takes a separate style. */ }

						<div className={ cssModObj.staLabDiv }>Emergency response available</div>{ /* What: Stat Label Div Element. Why: Each number needs to say what it counts. How: This sits below the number. */ }


					</div>


					<div className={ cssModObj.staIteDiv }>{ /* What: Rating Stat Div Element. Why: Accreditation and insurance are the usual checks before hiring. How: This pairs the rating with its label. */ }


						<div className={ cssModObj.staNumDiv }>A<span className={ cssModObj.staPluSpa }>+</span></div>{ /* What: Stat Number Div Element. Why: The rating leads this stat. How: Its plus sign takes its own class. */ }

						<div className={ cssModObj.staLabDiv }>BBB accredited & fully insured</div>{ /* What: Stat Label Div Element. Why: Each number needs to say what it counts. How: This sits below the number. */ }


					</div>


				</div>


			</div>


		</section>


	);


}

// #endregion HerSecCom

// #endregion Components



// #region Exports

export { HerSecCom }; // What: Named Exports. Why: The home page renders the hero first. How: This exports HerSecCom.

// #endregion Exports



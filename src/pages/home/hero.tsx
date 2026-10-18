


// #region Imports

import cssModObj from './hero.module.css'; // What: CSS Module Object. Why: The hero's grid background, two-row layout, and stats are styled in its own module. How: Each element reads its hashed class name from this object.
import lofSvgUrl from './logo-full.svg';   // What: Logo-Full SVG URL. Why: The hero's main visual is the full logo. How: Vite resolves the import to the file's fingerprinted URL, used as the image's src.


import { useSecCliFun } from '../../ui/section-link.ts'; // What: Use Section Click Function. Why: The hero's buttons reach their sections the same way the bar does. How: This returns secCliFun, the shared click handler that scrolls to a section without leaving a hash in the address.

// #endregion Imports



/**
 * hero.tsx = Hero Section
 *
 * @summary
 * The home page's opening section, and the target of every link to the home
 * page's top anchor. It pairs the headline with the full logo over a faint
 * grid, follows with the company's pitch and its two calls to action, and ends
 * with a row of four headline numbers.
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
 * Renders the hero: a decorative grid drawn as a repeating SVG pattern behind
 * everything, the location label and headline beside the full logo, the pitch
 * paragraph with the estimate and services buttons, and the stats row. The
 * section carries the page's top anchor, so the navigation bar's and
 * drawer's Home links, the home page footer's back-to-top link, and the 404
 * page's Return home button all land here.
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


	const secCliFun = useSecCliFun(); // What: Section Click Function. Why: The hero's buttons reach their sections the same way the bar does. How: This leaves a modified click to the browser and otherwise scrolls to the section without a hash.



	return (


		<section
			id='top'

			className={ cssModObj.homHerSec }
		>{ /* What: Home Hero Section Element. Why: This opens the home page. How: Its top id is the anchor every /#top link and the home page's own #top link target (the bar's brand link opens / instead), kept as is since it appears in the page's URL. */ }


			<div
				className={ cssModObj.herBacDiv }

				aria-hidden='true'
			>{ /* What: Hero Background Div Element. Why: The hero sits over a faint architectural grid. How: This holds the grid's SVG and hides it from screen readers, since it's decorative. */ }


				<svg
					className={ cssModObj.herGriSvg }

					preserveAspectRatio='xMidYMid slice'
					viewBox='0 0 1440 800'
				>{ /* What: Hero Grid SVG Element. Why: The grid is drawn as a vector so it stays crisp at any size. How: Its slice aspect ratio fills the section, cropping rather than letterboxing. */ }


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
							/>{ /* What: Grid Tile Path Element. Why: Each tile draws its top and left edges, so the tiles together form the grid. How: This strokes the two edges in the background div's main text color, which the div's opacity fades. */ }


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


				<div className={ cssModObj.herTopDiv }>{ /* What: Hero Top Div Element. Why: The headline and logo share the first row. How: This sets the copy on the left and the logo on the right, stacking them, logo first, at 960px wide and below. */ }


					<div className={ cssModObj.herCopDiv }>{ /* What: Hero Copy Div Element. Why: The location label sits directly above the headline. How: This stacks the two. */ }


						<span className={ cssModObj.eyeLabSpa }>Lawrence, Kansas · Est. 2008</span>{ /* What: Eyebrow Label Span Element. Why: Visitors should see where the company works and how long it's been there. How: This is the hero's location label, set in the site's eyebrow style. */ }

						<h1 className={ cssModObj.herTitHea }>{ /* What: Hero Title Heading Element. Why: The headline is the page's main heading. How: Its line breaks start each new line, so it reads as three lines wherever the first one fits, with one word in light accent italic. */ }
							Commercial roofing,<br />
							built to <em className={ cssModObj.titAccEmp }>weather</em><br />
							every season.
						</h1>


					</div>


					<div className={ cssModObj.herLogDiv }>{ /* What: Hero Logo Div Element. Why: The full logo is the hero's main visual. How: This frames it with its decorative ring. */ }


						<img
							className={ cssModObj.herLogIma }

							height='536' // What: Intrinsic Size Note. Why: The page shouldn't shift while the logo loads. How: This matches the SVG's 518 by 536 viewBox, which the stylesheet scales to the logo's capped width.
							src={ lofSvgUrl }
							width='518' // What: Intrinsic Size Note. Why: The page shouldn't shift while the logo loads. How: This matches the SVG's 518 by 536 viewBox, which the stylesheet scales to the logo's capped width.

							alt='Reese Roofing: Commercial & Residential'
						/>{ /* What: Hero Logo Image Element. Why: The logo introduces the brand. How: Its alt text reads the logo's wording for screen readers. */ }


					</div>


				</div>



				<div className={ cssModObj.herBotDiv }>{ /* What: Hero Bottom Div Element. Why: The pitch and the calls to action share the second row. How: This sets them side by side, stacking them at 960px wide and below. */ }


					<p className={ cssModObj.secLedPar }>{ /* What: Section Lede Paragraph Element. Why: The pitch says who the company serves and what it promises. How: This uses the site's lede style. */ }
						Reese Roofing serves businesses, property managers, and homeowners across
						Lawrence and the surrounding region, delivering installations and repairs
						that hold up to Kansas wind, sun, and storm.
					</p>

					<div className={ cssModObj.herActDiv }>{ /* What: Hero Actions Div Element. Why: The hero's two next steps sit together. How: This holds the estimate and services buttons. */ }


						<a
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncPrimary } `}

							href='/#contact'

							onClick={ ( cliEveObj ) => secCliFun( cliEveObj, 'contact' ) }
						>{ /* What: Button Base Anchor Primary Element. Why: The page's main action is requesting an estimate. How: This is the estimate button, which scrolls to the contact section without a hash, while a Ctrl, Cmd, or middle click opens it in a new tab. */ }
							Request an estimate
							<span
								className={ cssModObj.arrIcoSpa }

								aria-hidden='true'
							>{ /* What: Arrow Icon Span Element. Why: The arrow marks the button as moving the visitor onward. How: This sits right after the label and nudges right when the button is hovered, hidden from screen readers since it only decorates the label. */ }
								→
							</span>
						</a>

						<a
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncGhost } `}

							href='/#services'

							onClick={ ( cliEveObj ) => secCliFun( cliEveObj, 'services' ) }
						>{ /* What: Button Base Anchor Ghost Element. Why: Visitors not ready for an estimate can browse first. How: This is the services button, which scrolls to the services section without a hash, while a Ctrl, Cmd, or middle click opens it in a new tab. */ }
							Explore services
						</a>


					</div>


				</div>



				<div className={ cssModObj.herStaDiv }>{ /* What: Hero Stats Div Element. Why: A few numbers make the company's track record concrete. How: This lays out four stats in a row, two to a row at 960px wide and below. */ }


					<div className={ cssModObj.staIteDiv }>{ /* What: Stat Item Div Element. Why: Longevity is a reason to trust a roofer. How: This is the years stat, pairing the number with its label. */ }


						<div className={ cssModObj.staNumDiv }>17<span className={ cssModObj.staSufSpa }>+</span></div>{ /* What: Stat Number Div Element. Why: The number leads each stat. How: This is the years stat's number, whose plus sign takes a separate style. */ }

						<div className={ cssModObj.staLabDiv }>Years serving Douglas County</div>{ /* What: Stat Label Div Element. Why: Each number needs to say what it counts. How: This is the years stat's label, below its number. */ }


					</div>


					<div className={ cssModObj.staIteDiv }>{ /* What: Stat Item Div Element. Why: Volume of finished work shows experience. How: This is the roofs stat, pairing the number with its label. */ }


						<div className={ cssModObj.staNumDiv }>400<span className={ cssModObj.staSufSpa }>+</span></div>{ /* What: Stat Number Div Element. Why: The number leads each stat. How: This is the roofs stat's number, whose plus sign takes a separate style. */ }

						<div className={ cssModObj.staLabDiv }>Commercial roofs completed</div>{ /* What: Stat Label Div Element. Why: Each number needs to say what it counts. How: This is the roofs stat's label, below its number. */ }


					</div>


					<div className={ cssModObj.staIteDiv }>{ /* What: Stat Item Div Element. Why: Storm damage can't wait for business hours. How: This is the emergency stat, pairing the number with its label. */ }


						<div className={ cssModObj.staNumDiv }>24<span className={ cssModObj.staSufSpa }>/7</span></div>{ /* What: Stat Number Div Element. Why: The number leads each stat. How: This is the emergency stat's number, whose suffix takes a separate style. */ }

						<div className={ cssModObj.staLabDiv }>Emergency response available</div>{ /* What: Stat Label Div Element. Why: Each number needs to say what it counts. How: This is the emergency stat's label, below its number. */ }


					</div>


					<div className={ cssModObj.staIteDiv }>{ /* What: Stat Item Div Element. Why: Accreditation and insurance are the usual checks before hiring. How: This is the rating stat, pairing the rating with its label. */ }


						<div className={ cssModObj.staNumDiv }>A<span className={ cssModObj.staPluSpa }>+</span></div>{ /* What: Stat Number Div Element. Why: The number leads each stat. How: This is the rating stat's number, whose plus sign is set smaller and raised like the other suffixes, but in accent italic. */ }

						<div className={ cssModObj.staLabDiv }>BBB accredited & fully insured</div>{ /* What: Stat Label Div Element. Why: Each number needs to say what it counts. How: This is the rating stat's label, below its number. */ }


					</div>


				</div>


			</div>


		</section>


	);


}

// #endregion HerSecCom

// #endregion Components



// #region Exports

export { HerSecCom }; // What: Named Export. Why: The home page renders the hero first. How: This exports HerSecCom.

// #endregion Exports



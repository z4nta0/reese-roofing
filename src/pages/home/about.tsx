


// #region Imports

import cssModObj from './about.module.css'; // What: CSS Module Object. Why: The section's story, seal, quote, and principles grid are styled in its own module. How: Each element reads its hashed class name from this object.
import lofSvgUrl from './logo-full.svg';    // What: Logo-Full SVG URL. Why: The section's seal is the full logo. How: Vite resolves the import to the file's fingerprinted URL, used as the image's src.

// #endregion Imports



/**
 * about.tsx = About Section
 *
 * @summary
 * The home page's third section, telling the company's story. The label,
 * heading, and logo seal sit beside three paragraphs and a quote from the
 * family above 960px wide, staying in view as the story scrolls; at 960px and
 * below the seal is hidden, the story stacks below the label and heading, and
 * they scroll away with the page. The numbered principles follow underneath,
 * four across, two at 960px wide and below, and one at 540px and below, driven
 * by PRI_REC_ARR.
 *
 * Sections:
 *  - Constants
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

// #region PRI_REC_ARR

/**
 * PRI_REC_ARR = Principle Record Array
 *
 * @summary
 * The four principles, in the order they're numbered. Every row shares the
 * same two fields, documented here once instead of on every row:
 *
 * - `bodStr` (String): Body String is the sentence explaining the
 *   principle.
 *
 * - `titStr` (String): Title String is the principle's short name, also
 *   used as its React key.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const PRI_REC_ARR = [ // What: Principle Record Array. Why: The principles are data, not markup, so a principle changes in one place. How: AboSecCom maps over it, numbering each principle by its position.


	{ bodStr : 'Every project is led by an owner-operator who walks the roof, signs the proposal, and stays reachable from kickoff to close-out.',      titStr : 'Local, accountable, on-site' }, // What: Local Principle Row. Why: Clients want one accountable person. How: This is principle 01.
	{ bodStr : "Our systems are spec'd for what this region actually delivers: high winds, hail, freeze-thaw cycles, and brutal summer UV.",            titStr : 'Built for Kansas weather'    }, // What: Weather Principle Row. Why: Kansas weather is hard on roofs. How: This is principle 02.
	{ bodStr : 'You get a line-itemed estimate, a real schedule, and direct answers, not change-order surprises buried in fine print.',                 titStr : 'Honest scopes & timelines'   }, // What: Honesty Principle Row. Why: Surprise costs are the common complaint about contractors. How: This is principle 03.
	{ bodStr : 'Manufacturer-certified on TPO, EPDM, and metal systems, which means material and workmanship warranties that actually mean something.', titStr : 'Warranty-backed installs'    }  // What: Warranty Principle Row. Why: A warranty is only as good as the installer behind it. How: This is principle 04.


];

// #endregion PRI_REC_ARR

// #endregion Constants



// #region Components

// #region AboSecCom

/**
 * AboSecCom = About Section Component
 *
 * @summary
 * Renders the about section: on the left, the numbered label, heading, and a
 * decorative logo seal; on the right, the company's story in three paragraphs
 * and a pull quote from the family, stacking at 960px wide and below, where
 * the seal is hidden. Below, the principles, four across, two at 960px wide
 * and below, and one at 540px and below, are each numbered by their position
 * in PRI_REC_ARR, padded to two digits. The section carries the about anchor
 * the navigation links lead to.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The home page's about section.
 *
 * @example
 * ```tsx
 * AboSecCom() // => <AboSecCom />
 * ```
 *
*/

function AboSecCom () : React.JSX.Element {


	return (


		<section
			id='about'

			className={ cssModObj.homAboSec }
		>{ /* What: Home About Section Element. Why: This tells the company's story. How: Its about id is the anchor the navigation links lead to, kept as is since it appears in the page's URL. */ }


			<div className={ cssModObj.aboStoDiv }>{ /* What: About Story Div Element. Why: The story should line up with the page's content width. How: This sets the left and right columns side by side, stacking them at 960px wide and below. */ }


				<div className={ cssModObj.aboLefDiv }>{ /* What: About Left Div Element. Why: The heading anchors the story, with the seal under it where there's room. How: This stacks the label, heading, and seal, staying in view as the story beside it scrolls, while at 960px wide and below the seal is hidden and the column scrolls away with the page. */ }


					<span className={ cssModObj.eyeLabSpa }>03 · About</span>{ /* What: Eyebrow Label Span Element. Why: Each section is numbered in order down the page. How: This is the section's numbered label, set in the site's eyebrow style. */ }

					<h2 className={ cssModObj.aboTitHea }>{ /* What: About Title Heading Element. Why: The heading names the section. How: Its line breaks start each new line, so it reads as three lines at 960px wide and below, and as four above 960px, where the first line wraps after Lawrence, with one word in light accent italic. */ }
						A Lawrence company<br />
						with <em className={ cssModObj.titAccEmp }>roots</em> in<br />
						the work.
					</h2>

					<div
						className={ cssModObj.aboSeaDiv }

						aria-hidden='true'
					>{ /* What: About Seal Div Element. Why: The full logo works as a seal beside the story. How: This holds it at a capped size, slightly faded, and hides it from screen readers, since it's decorative, and the seal is hidden entirely at 960px wide and below. */ }


						<img
							className={ cssModObj.aboSeaIma }

							height='536' // What: Intrinsic Size Note. Why: The page shouldn't shift while the logo loads. How: This matches the SVG's 518 by 536 viewBox, which the stylesheet scales to the seal's capped width.
							loading='lazy' // What: Lazy Loading Attribute. Why: The image starts below the fold. How: This holds the image back until it nears the screen, though the hero has already fetched the same file, so it saves no download.
							src={ lofSvgUrl }
							width='518' // What: Intrinsic Size Note. Why: The page shouldn't shift while the logo loads. How: This matches the SVG's 518 by 536 viewBox, which the stylesheet scales to the seal's capped width.

							alt=''
						/>{ /* What: About Seal Image Element. Why: The seal shows the full logo. How: Its empty alt matches its container's hidden, decorative role, and it hides with the seal at 960px wide and below. */ }


					</div>


				</div>


				<div>{ /* What: About Right Div Element. Why: The story itself sits beside the heading, or below it at 960px wide and below. How: This stacks the paragraphs and the quote. */ }


					<p className={` ${ cssModObj.aboStoPar }   ${ cssModObj.aboStoParLead } `}>{ /* What: About Story Paragraph Lead Element. Why: The first paragraph states the founding idea. How: This is the story's first paragraph, whose lead modifier sets it larger, in the display font and full ink. */ }
						Reese Roofing was founded on a simple idea: commercial roofing should be a
						straightforward business. A clear scope, a fair price, a roof installed by
						people who care whether it holds up.
					</p>

					<p className={ cssModObj.aboStoPar }>{ /* What: About Story Paragraph Element. Why: The company's track record backs up its claims. How: This is the story's history paragraph, which lists the kinds of buildings the company has worked on and where its work comes from. */ }
						We've worked on warehouses, churches, retail centers, office buildings, and
						municipal facilities across Douglas County and the surrounding counties for
						more than a decade and a half. Most of our work comes from referrals, from
						building owners and property managers who appreciated that we showed up when
						we said we would and stood behind the work after the crew packed up.
					</p>

					<p className={ cssModObj.aboStoPar }>{ /* What: About Story Paragraph Element. Why: Visitors check that a roofer is licensed and insured. How: This is the story's credentials paragraph, which states both, then names trust as what matters most. */ }
						We're licensed, fully insured, and manufacturer-certified on the systems we
						install. But the most important credential we carry is the trust of the
						businesses we've roofed in this town.
					</p>

					<blockquote className={ cssModObj.aboQuoBlo }>{ /* What: About Quote Blockquote Element. Why: A line from the family puts the company's approach in its own words. How: This holds the quote mark, the quote, and its attribution. */ }


						<span className={ cssModObj.quoMarSpa }>“</span>{ /* What: Quote Mark Span Element. Why: An oversized opening quote mark sets the quote apart. How: This draws it as its own styled character beside the quote, or on its own line above it at 540px wide and below. */ }

						<p className={ cssModObj.aboQuoPar }>{ /* What: About Quote Paragraph Element. Why: This is the quote itself. How: This sets it in large display italic, indented past the quote mark, or unindented under it at 540px wide and below. */ }
							The roof above your operation is not the place to cut corners, and
							it's not the place to overspend. Our job is to find the line.
						</p>

						<footer className={ cssModObj.aboQuoFoo }>The Reese family</footer>{ /* What: About Quote Footer Element. Why: The quote names who said it. How: This sets it in tracked, muted capitals at body size, lined up with the quote, indented with it above 540px wide and unindented with it at 540px and below. */ }


					</blockquote>


				</div>


			</div>



			<div className={ cssModObj.pagConDiv }>{ /* What: Page Container Div Element. Why: The principles should line up with the page's content width. How: This holds their grid. */ }


				<div className={ cssModObj.aboPriDiv }>{ /* What: About Principles Div Element. Why: The company's four principles read best side by side where there's room. How: This lays out a block for each row of PRI_REC_ARR, four across, two across at 960px wide and below, and one at 540px and below. */ }


					{ PRI_REC_ARR.map( ( priRecObj, priIndNum ) => ( // What: Principle Map. Why: Every principle gets its own block. How: This renders a block for each row of PRI_REC_ARR, passing along its position for numbering.


						<div
							key={ priRecObj.titStr }

							className={ cssModObj.priIteDiv }
						>{ /* What: Principle Item Div Element. Why: Each principle is a self-contained block. How: This holds its number, title, and body. */ }


							<span className={ cssModObj.priNumSpa }>{ String( priIndNum + 1 ).padStart( 2, '0' ) }</span>{ /* What: Principle Number Span Element. Why: The principles are numbered in order. How: This turns the principle's zero-based position in PRI_REC_ARR into a two-digit number starting at 01. */ }

							<h3 className={ cssModObj.priTitHea }>{ priRecObj.titStr }</h3>{ /* What: Principle Title Heading Element. Why: Each principle has a short name. How: This shows the principle's title. */ }

							<p className={ cssModObj.priBodPar }>{ priRecObj.bodStr }</p>{ /* What: Principle Body Paragraph Element. Why: Each principle is explained in a sentence. How: This shows the principle's body. */ }


						</div>


					))}


				</div>


			</div>


		</section>


	);


}

// #endregion AboSecCom

// #endregion Components



// #region Exports

export { AboSecCom }; // What: Named Export. Why: The home page renders the about section third. How: This exports AboSecCom.

// #endregion Exports






// #region Imports

import cssModObj from './about.module.css'; // What: CSS Module Object. Why: The section's two-column story, seal, quote, and principles row are styled in its own module. How: Each element reads its hashed class name from this object.
import lofSvgUrl from './logo-full.svg';    // What: Logo-Full Svg URL. Why: The section's sticky seal is the full logo. How: Vite resolves the import to the file's fingerprinted URL, used as the image's src.

// #endregion Imports



/**
 * about.tsx = About Section
 *
 * @summary
 * The home page's third section, telling the company's story. The heading
 * and a sticky logo seal sit beside three paragraphs and a quote from the
 * family, and a row of four numbered principles follows underneath, driven
 * by PRI_RCD_ARR.
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

// #region PRI_RCD_ARR

/**
 * PRI_RCD_ARR = Principle Record Array
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

const PRI_RCD_ARR = [ // What: Principle Record Array. Why: The principles row is data, not markup, so a principle changes in one place. How: AboSecCom maps over it, numbering each row by its position.


	{ bodStr : 'Every project is led by an owner-operator who walks the roof, signs the proposal, and stays reachable from kickoff to close-out.',      titStr : 'Local, accountable, on-site' }, // What: Local Principle Row. Why: Clients want one accountable person. How: This is principle 01.
	{ bodStr : 'Our systems are spec\'d for what this region actually delivers: high winds, hail, freeze-thaw cycles, and brutal summer UV.',           titStr : 'Built for Kansas weather'    }, // What: Weather Principle Row. Why: Kansas weather is hard on roofs. How: This is principle 02.
	{ bodStr : 'You get a line-itemed estimate, a real schedule, and direct answers, not change-order surprises buried in fine print.',                 titStr : 'Honest scopes & timelines'   }, // What: Honesty Principle Row. Why: Surprise costs are the common complaint about contractors. How: This is principle 03.
	{ bodStr : 'Manufacturer-certified on TPO, EPDM, and metal systems, which means material and workmanship warranties that actually mean something.', titStr : 'Warranty-backed installs'    }  // What: Warranty Principle Row. Why: A warranty is only as good as the installer behind it. How: This is principle 04.


];

// #endregion PRI_RCD_ARR

// #endregion Constants



// #region Components

// #region AboSecCom

/**
 * AboSecCom = About Section Component
 *
 * @summary
 * Renders the about section: on the left, the numbered label, heading, and a
 * decorative logo seal; on the right, the company's story in three
 * paragraphs and a pull quote from the family. Below, the principles row
 * numbers each row of PRI_RCD_ARR by its position, padded to two digits. The
 * section carries the about anchor the navigation links jump to.
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
		>{ /* What: About Section Element. Why: This tells the company's story. How: Its about id is the anchor the navigation links jump to, kept as is since it appears in the page's URL. */ }


			<div className={ cssModObj.aboStoDiv }>{ /* What: About Container Div Element. Why: The story's two columns should line up with the page's content width. How: This sets the left and right columns side by side. */ }


				<div className={ cssModObj.aboLefDiv }>{ /* What: About Left Div Element. Why: The heading and seal anchor the story. How: This stacks the label, heading, and seal. */ }


					<span className={ cssModObj.eyeLabSpa }>03 · About</span>{ /* What: Section Label Span Element. Why: Each section is numbered in order down the page. How: This uses the site's eyebrow style. */ }

					<h2 className={ cssModObj.aboTitHea }>{ /* What: About Title Heading Element. Why: The heading names the section. How: Its line breaks set the three-line shape, with one word in italic. */ }
						A Lawrence company<br />
						with <em className={ cssModObj.titAccEmp }>roots</em> in<br />
						the work.
					</h2>

					<div
						className={ cssModObj.aboSeaDiv }

						aria-hidden='true'
					>{ /* What: About Seal Div Element. Why: The full logo works as a seal beside the story. How: This frames it and hides it from screen readers, since it's decorative. */ }


						<img
							className={ cssModObj.aboSeaIma }

							src={ lofSvgUrl }

							alt=''
						/>{ /* What: About Seal Image Element. Why: The seal shows the full logo. How: Its empty alt matches its container's hidden, decorative role. */ }


					</div>


				</div>


				<div>{ /* What: About Right Div Element. Why: The story itself sits beside the heading. How: This stacks the paragraphs and the quote. */ }


					<p className={` ${ cssModObj.aboStoPar }   ${ cssModObj.aboStoParLead } `}>{ /* What: Lead Paragraph Element. Why: The first paragraph states the founding idea. How: Its lead modifier sets it larger than the rest. */ }
						Reese Roofing was founded on a simple idea: commercial roofing should be a
						straightforward business. A clear scope, a fair price, a roof installed by
						people who care whether it holds up.
					</p>

					<p className={ cssModObj.aboStoPar }>{ /* What: History Paragraph Element. Why: The company's track record backs up its claims. How: This lists the kinds of buildings it has worked on and where its work comes from. */ }
						We've worked on warehouses, churches, retail centers, office buildings, and
						municipal facilities across Douglas County and the surrounding counties for
						more than a decade and a half. Most of our work comes from referrals, from
						building owners and property managers who appreciated that we showed up when
						we said we would and stood behind the work after the crew packed up.
					</p>

					<p className={ cssModObj.aboStoPar }>{ /* What: Credentials Paragraph Element. Why: Visitors check that a roofer is licensed and insured. How: This states both, then names trust as what matters most. */ }
						We're licensed, fully insured, and manufacturer-certified on the systems we
						install. But the most important credential we carry is the trust of the
						businesses we've roofed in this town.
					</p>

					<blockquote className={ cssModObj.aboQuoBlo }>{ /* What: About Quote Blockquote Element. Why: A line from the family puts the company's approach in its own words. How: This holds the quote mark, the quote, and its attribution. */ }


						<span className={ cssModObj.quoMarSpa }>&ldquo;</span>{ /* What: Quote Mark Span Element. Why: An oversized opening quote mark sets the quote apart. How: This draws it as its own styled character. */ }

						<p className={ cssModObj.aboQuoPar }>{ /* What: Quote Paragraph Element. Why: This is the quote itself. How: Its text sits inside the blockquote's styling. */ }
							The roof above your operation is not the place to cut corners, and
							it&apos;s not the place to overspend. Our job is to find the line.
						</p>

						<footer className={ cssModObj.aboQuoFoo }>The Reese family</footer>{ /* What: Quote Attribution Footer Element. Why: The quote names who said it. How: Its own uppercase, indented style sets it apart. */ }


					</blockquote>


				</div>


			</div>



			<div className={ cssModObj.pagConDiv }>{ /* What: Principles Container Div Element. Why: The principles row should line up with the page's content width. How: This holds the row. */ }


				<div className={ cssModObj.aboPriDiv }>{ /* What: About Principles Div Element. Why: The company's four principles read best side by side. How: This lays out one principle per row of PRI_RCD_ARR. */ }


					{ PRI_RCD_ARR.map( ( priRcdObj, priIndNum ) => ( // What: Principle Map. Why: Every principle gets its own block. How: This renders one block per row, passing along its position for numbering.


						<div
							key={ priRcdObj.titStr }

							className={ cssModObj.priIteDiv }
						>{ /* What: Principle Div Element. Why: Each principle is a self-contained block. How: This holds its number, title, and body. */ }


							<span className={ cssModObj.priNumSpa }>{ String( priIndNum + 1 ).padStart( 2, '0' ) }</span>{ /* What: Principle Number Span Element. Why: The principles are numbered in order. How: This turns the row's zero-based position into a two-digit number starting at 01. */ }

							<h3 className={ cssModObj.priTitHea }>{ priRcdObj.titStr }</h3>{ /* What: Principle Title Heading Element. Why: Each principle has a short name. How: This shows the row's title. */ }

							<p className={ cssModObj.priBodPar }>{ priRcdObj.bodStr }</p>{ /* What: Principle Body Paragraph Element. Why: Each principle is explained in a sentence. How: This shows the row's body. */ }


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

export { AboSecCom }; // What: Named Exports. Why: The home page renders the about section third. How: This exports AboSecCom.

// #endregion Exports



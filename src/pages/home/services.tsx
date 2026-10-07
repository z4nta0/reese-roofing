


// #region Imports

import cssModObj from './services.module.css'; // What: CSS Module Object. Why: The section's heading block and service card grid are styled in its own module. How: Each element reads its hashed class name from this object.

// #endregion Imports



/**
 * services.tsx = Services Section
 *
 * @summary
 * The home page's second section, listing the company's six commercial
 * roofing services. Each service is a card with its number, title, a short
 * description, and a list of what it covers, all driven by SER_RCD_ARR, so
 * adding or editing a service only touches that array.
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

type SerRcdTyp = { desStr : string, detArr : string[], ideStr : string, titStr : string }; // What: Service Record Type. Why: Every service card reads the same four fields. How: This types each row of SER_RCD_ARR.

// #region SER_RCD_ARR

/**
 * SER_RCD_ARR = Service Record Array
 *
 * @summary
 * The six services, in the order their cards appear. Every row shares the
 * same four fields, documented here once instead of on every row:
 *
 * - `desStr` (String): Description String is the card's one-sentence
 *   summary of the service.
 *
 * - `detArr` (Array): Detail Array lists the specific work the service
 *   covers, one bullet per entry.
 *
 * - `ideStr` (String): Identifier String is the card's two-digit number,
 *   shown on the card and used as its React key.
 *
 * - `titStr` (String): Title String is the service's name.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const SER_RCD_ARR : SerRcdTyp[] = [ // What: Service Record Array. Why: The section's cards are data, not markup, so a service changes in one place. How: SerSecCom maps over it, rendering one card per row.


	{ // What: Single-Ply Membrane Service. Why: Most flat commercial roofs are single-ply membranes. How: This is the first card.


		desStr : 'Energy-efficient TPO, EPDM, and PVC roofing engineered for flat and low-slope commercial buildings.',
		detArr : [ 'TPO installation', 'EPDM rubber roofing', 'PVC membrane systems' ],
		ideStr : '01',
		titStr : 'Single-ply membrane systems'


	},

	{ // What: Metal Roofing Service. Why: Metal roofs are the company's long-life option. How: This is the second card.


		desStr : 'Standing-seam and architectural metal roofs that perform for decades, installed new or retrofitted over existing systems.',
		detArr : [ 'Standing seam', 'Through-fastened panels', 'Metal-over-metal retrofits' ],
		ideStr : '02',
		titStr : 'Metal roofing & retrofits'


	},

	{ // What: Built-Up Roofing Service. Why: Built-up and bitumen roofs suit buildings that need layered waterproofing. How: This is the third card.


		desStr : 'Multi-ply BUR and modified bitumen assemblies for proven, redundant waterproofing on flat commercial roofs.',
		detArr : [ 'Hot-applied BUR', 'SBS & APP modified bitumen', 'Cold-applied systems' ],
		ideStr : '03',
		titStr : 'Built-up & modified bitumen'


	},

	{ // What: Repair And Restoration Service. Why: Many roofs need repair rather than replacement. How: This is the fourth card.


		desStr : 'Targeted repairs and full restoration coatings that extend the service life of your existing roof without a full tear-off.',
		detArr : [ 'Leak diagnostics', 'Silicone & acrylic coatings', 'Flashing & seam repair' ],
		ideStr : '04',
		titStr : 'Repair & restoration'


	},

	{ // What: Preventative Maintenance Service. Why: Regular upkeep heads off bigger repairs. How: This is the fifth card.


		desStr : 'Scheduled inspection and upkeep programs that catch small issues before they become claims, downtime, or tear-offs.',
		detArr : [ 'Bi-annual inspections', 'Drain & gutter clearing', 'Documentation for warranties' ],
		ideStr : '05',
		titStr : 'Preventative maintenance'


	},

	{ // What: Storm And Emergency Service. Why: Kansas storms bring urgent damage. How: This is the sixth card.


		desStr : 'Rapid hail and wind damage assessments with direct insurance coordination, plus emergency tarping when you need it now.',
		detArr : [ 'Storm damage inspections', 'Insurance documentation', '24/7 emergency tarping' ],
		ideStr : '06',
		titStr : 'Storm & emergency response'


	}


];

// #endregion SER_RCD_ARR

// #endregion Constants



// #region Components

// #region SerSecCom

/**
 * SerSecCom = Services Section Component
 *
 * @summary
 * Renders the services section: the numbered label, heading, and lede, then
 * a grid with one card per row of SER_RCD_ARR, each listing its details as
 * bullets. The section carries the services anchor the navigation links and
 * the hero's services button jump to.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The home page's services section.
 *
 * @example
 * ```tsx
 * SerSecCom() // => <SerSecCom />
 * ```
 *
*/

function SerSecCom () : React.JSX.Element {


	return (


		<section
			id='services'

			className={ cssModObj.homSerSec }
		>{ /* What: Services Section Element. Why: This lists what the company does. How: Its services id is the anchor the navigation links jump to, kept as is since it appears in the page's URL. */ }


			<div className={ cssModObj.pagConDiv }>{ /* What: Services Container Div Element. Why: The section's content should line up with the page's content width. How: This holds the heading block and the card grid. */ }


				<div className={ cssModObj.serHeaDiv }>{ /* What: Services Head Div Element. Why: The label, heading, and lede introduce the cards. How: This stacks the three. */ }


					<span className={ cssModObj.eyeLabSpa }>02 · What we do</span>{ /* What: Section Label Span Element. Why: Each section is numbered in order down the page. How: This uses the site's eyebrow style. */ }

					<h2 className={ cssModObj.serTitHea }>{ /* What: Services Title Heading Element. Why: The heading names the section. How: Its line break sets the two-line shape, with one word in italic. */ }
						A full range of commercial<br />
						roofing <em className={ cssModObj.titAccEmp }>specialties</em>.
					</h2>

					<p className={ cssModObj.serLedPar }>{ /* What: Services Lede Paragraph Element. Why: The lede says how every project starts. How: This uses the site's lede style. */ }
						From new construction to emergency repair, every project starts with an
						on-site assessment and a clear, line-itemed proposal, so you know exactly
						what's being installed and why.
					</p>


				</div>



				<div className={ cssModObj.serGriDiv }>{ /* What: Services Grid Div Element. Why: The services read best as a grid of cards. How: This lays out one card per service. */ }


					{ SER_RCD_ARR.map( ( serRcdObj ) => ( // What: Service Card Map. Why: Every service gets its own card. How: This renders one article per row of SER_RCD_ARR.


						<article
							key={ serRcdObj.ideStr }

							className={ cssModObj.serCarArt }
						>{ /* What: Service Article Element. Why: Each service is a self-contained card. How: This holds the card's head, description, and detail list. */ }


							<div className={ cssModObj.carHeaDiv }>{ /* What: Service Head Div Element. Why: The number and title lead each card. How: This sets them together. */ }


								<span className={ cssModObj.carIdeSpa }>{ serRcdObj.ideStr }</span>{ /* What: Service Identifier Span Element. Why: The cards are numbered in order. How: This shows the row's two-digit number. */ }

								<h3 className={ cssModObj.carTitHea }>{ serRcdObj.titStr }</h3>{ /* What: Service Title Heading Element. Why: Each card names its service. How: This shows the row's title. */ }


							</div>

							<p className={ cssModObj.carDesPar }>{ serRcdObj.desStr }</p>{ /* What: Service Description Paragraph Element. Why: Each card summarizes its service in a sentence. How: This shows the row's description. */ }

							<ul className={ cssModObj.carDetUno }>{ /* What: Service List Unordered Element. Why: The specific work a service covers reads best as bullets. How: This lists the row's details. */ }


								{ serRcdObj.detArr.map( ( detIteStr ) => ( // What: Detail Item Map. Why: Every detail gets its own bullet. How: This renders one list item per entry.


									<li
										key={ detIteStr }

										className={ cssModObj.serDetIte }
									>{ /* What: Detail Item Element. Why: Each bullet names one piece of work. How: Its text doubles as its React key, since a card's details never repeat. */ }
										{ detIteStr }
									</li>


								))}


							</ul>


						</article>


					))}


				</div>


			</div>


		</section>


	);


}

// #endregion SerSecCom

// #endregion Components



// #region Exports

export { SerSecCom }; // What: Named Exports. Why: The home page renders the services section second. How: This exports SerSecCom.

// #endregion Exports



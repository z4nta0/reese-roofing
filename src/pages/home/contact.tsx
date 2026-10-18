


// #region Imports

import cssModObj from './contact.module.css'; // What: CSS Module Object. Why: The section's details list, signature card, and estimate form are styled in its own module. How: Each element reads its hashed class name from this object.
import lofSvgUrl from './logo-full.svg';      // What: Logo-Full SVG URL. Why: The section's signature card shows the full logo. How: Vite resolves the import to the file's fingerprinted URL, used as the image's src.
import React     from 'react';                // What: React. Why: The form tracks its fields and sent state with React's hooks and types its events with React's types. How: This is read as React.useState, React.ChangeEvent, React.FormEvent, and React.JSX.Element.

// #endregion Imports



/**
 * contact.tsx = Contact Section
 *
 * @summary
 * The home page's last section, where visitors reach the company. The left
 * column gives the office, phone, email, hours, and service area, with a
 * signature card carrying the full logo below them; the right column is an
 * estimate request form. The site has no backend, so submitting the form opens
 * the visitor's own email app with a message built from the fields, addressed
 * to the company.
 *
 * Sections:
 *  - Types
 *  - Constants
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Types

type ConForTyp = { comStr : string, emaStr : string, mesStr : string, namStr : string, phoStr : string, serStr : string }; // What: Contact Form Type. Why: The form's six fields are read and written together as one record. How: This types the initial values, the form's state, and the field key each input updates.

// #endregion Types



// #region Constants

const INI_FOR_OBJ : ConForTyp = { comStr : '', emaStr : '', mesStr : '', namStr : '', phoStr : '', serStr : '' }; // What: Initial Form Object. Why: The form starts with every field empty. How: This seeds the form's state on mount.

// #endregion Constants



// #region Components

// #region ConSecCom

/**
 * ConSecCom = Contact Section Component
 *
 * @summary
 * Renders the contact section and owns its estimate form. Every field is
 * controlled by one record in state, each input updating its own key through
 * updFieFun. Submitting builds an email from the fields and hands it to the
 * visitor's email app through a mailto link, then switches the submit
 * button's label to say the email is opening. The section carries the
 * contact anchor the navigation links and estimate buttons lead to.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The home page's contact section.
 *
 * @example
 * ```tsx
 * ConSecCom() // => <ConSecCom />
 * ```
 *
*/

function ConSecCom () : React.JSX.Element {


	const [ forValObj, setForValObj ] = React.useState< ConForTyp >( INI_FOR_OBJ ); // What: Form Value Object And Setter. Why: Every field's current text lives in one record. How: This starts from INI_FOR_OBJ and is updated one key at a time by updFieFun.
	const [ senReqBoo, setSenReqBoo ] = React.useState( false );                    // What: Sent Request Boolean And Setter. Why: The submit button should confirm the email is on its way. How: This flips true once the form is submitted.


	// #region updFieFun

	/**
	 * updFieFun = Update Field Function
	 *
	 * @summary
	 * Builds the change handler for one form field. Calling it with a field's
	 * key returns a handler that copies the event's new value into that key of
	 * forValObj, leaving every other field as it was. Each input, the select,
	 * and the textarea pass their own key, so one function serves them all.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param fieKeyStr - Field Key String: The key in forValObj this handler
	 *                    writes to.
	 *
	 * @returns The change handler for that field.
	 *
	 * @example
	 * ```ts
	 * updFieFun('namStr') // => a change handler that writes forValObj.namStr
	 * ```
	 *
	*/

	const updFieFun = ( fieKeyStr : keyof ConForTyp ) : ( chaEveObj : React.ChangeEvent< HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement > ) => void => ( chaEveObj ) => setForValObj( ( preForObj ) => ({ ...preForObj, [ fieKeyStr ] : chaEveObj.target.value }) ); // What: Update Field Function. Why: Every field writes to its own key in the same record. How: This returns a handler that copies the event's value into that key.

	// #endregion updFieFun


	// #region subForFun

	/**
	 * subForFun = Submit Form Function
	 *
	 * @summary
	 * Handles the form's submit. It stops the browser's own submit, since the
	 * site has no server to post to, builds an email subject from the
	 * visitor's name (or a generic inquiry label when it's blank) and a body
	 * listing every field, and sends the browser to a mailto link carrying
	 * both, which opens the visitor's email app. It then marks the request
	 * sent so the button's label changes.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param subEveObj - Submit Event Object: The form's submit event.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * subForFun(subEveObj) // => void
	 * ```
	 *
	*/

	const subForFun = ( subEveObj : React.FormEvent< HTMLFormElement > ) : void => { // What: Submit Form Function. Why: The form's submit has to become an email, since the site has no backend. How: This builds the message and opens it in the visitor's email app.


		subEveObj.preventDefault(); // What: Default Submit Prevention Call. Why: The browser would otherwise try to post the form and reload the page. How: This cancels its own submit.



		const bodEncStr = encodeURIComponent( `Name: ${ forValObj.namStr }\nCompany: ${ forValObj.comStr }\nEmail: ${ forValObj.emaStr }\nPhone: ${ forValObj.phoStr }\nService: ${ forValObj.serStr }\n\nMessage:\n${ forValObj.mesStr }` ); // What: Body Encoded String. Why: The email should list every field so nothing is lost. How: This writes one labeled line per field, then the message, encoded for a URL.
		const subEncStr = encodeURIComponent( `Estimate request: ${ forValObj.namStr || 'Reese Roofing inquiry' }` ); // What: Subject Encoded String. Why: The company should see who's asking at a glance. How: This names the visitor, falling back to a generic label when the name is blank, encoded for a URL.


		window.location.href = `mailto:hello@reeseroofing.example?subject=${ subEncStr }&body=${ bodEncStr }`; // What: Mailto Navigation Assignment. Why: The visitor's email app sends the request. How: This opens a new email to the company with the subject and body filled in.


		setSenReqBoo( true ); // What: Sent Request Set Call. Why: The button should confirm the email is opening. How: This switches its label.


	};

	// #endregion subForFun



	return (


		<section
			id='contact'

			className={ cssModObj.homConSec }
		>{ /* What: Home Contact Section Element. Why: This is where visitors reach the company. How: Its contact id is the anchor the navigation links and estimate buttons lead to, kept as is since it appears in the page's URL. */ }


			<div className={ cssModObj.conLayDiv }>{ /* What: Contact Layout Div Element. Why: The section's two columns should line up with the page's content width. How: This sets the intro and the form side by side. */ }


				<div>{ /* What: Contact Intro Div Element. Why: The company's details sit beside the form. How: This stacks the label, heading, lede, details, and signature. */ }


					<span className={ cssModObj.eyeLabSpa }>04 · Get in touch</span>{ /* What: Eyebrow Label Span Element. Why: Each section is numbered in order down the page. How: This is the section's numbered label, set in the site's eyebrow style. */ }

					<h2 className={ cssModObj.conTitHea }>{ /* What: Contact Title Heading Element. Why: The heading invites the visitor in. How: Its line break sets the two-line shape, with one word in light italic in the soft accent. */ }
						Let's talk about<br />
						your <em className={ cssModObj.titAccEmp }>roof</em>.
					</h2>

					<p className={ cssModObj.secLedPar }>{ /* What: Section Lede Paragraph Element. Why: Visitors should know what happens after they reach out. How: This promises an assessment and a reply within a business day. */ }
						Tell us a bit about your project. We'll schedule an on-site assessment and
						get back to you within one business day with next steps.
					</p>



					<dl className={ cssModObj.conDetDes }>{ /* What: Contact Details Description List Element. Why: The company's contact details read as labeled pairs. How: This holds one row per detail. */ }


						<div className={ cssModObj.conRowDiv }>{ /* What: Contact Row Div Element. Why: Visitors want to know where the company is. How: This is the office row, which pairs the label with the address. */ }


							<dt className={ cssModObj.rowLabTer }>Office</dt>{ /* What: Row Label Term Element. Why: Each row is labeled. How: This names the office row's detail. */ }

							<dd className={ cssModObj.rowValDet }>{ /* What: Row Value Details Element. Why: The office row's value is the company's location. How: Its line break puts the city on its own line. */ }
								Reese Roofing<br />
								Lawrence, Kansas 66044
							</dd>


						</div>


						<div className={ cssModObj.conRowDiv }>{ /* What: Contact Row Div Element. Why: Many visitors would rather call. How: This is the phone row, which pairs the label with the number. */ }


							<dt className={ cssModObj.rowLabTer }>Phone</dt>{ /* What: Row Label Term Element. Why: Each row is labeled. How: This names the phone row's detail. */ }

							<dd className={ cssModObj.rowValDet }>{ /* What: Row Value Details Element. Why: The phone row's value holds the company's number. How: The number is a link that dials it. */ }


								<a
									className={ cssModObj.rowValAnc }

									href='tel:+17855550199'
								>{ /* What: Row Value Anchor Element. Why: Phone visitors should be able to call in one tap. How: This is the phone link, which dials the company's number. */ }
									(785) 555-0199
								</a>


							</dd>


						</div>


						<div className={ cssModObj.conRowDiv }>{ /* What: Contact Row Div Element. Why: Some visitors would rather write. How: This is the email row, which pairs the label with the address. */ }


							<dt className={ cssModObj.rowLabTer }>Email</dt>{ /* What: Row Label Term Element. Why: Each row is labeled. How: This names the email row's detail. */ }

							<dd className={ cssModObj.rowValDet }>{ /* What: Row Value Details Element. Why: The email row's value holds the company's email address. How: The address is a link that starts an email. */ }


								<a
									className={ cssModObj.rowValAnc }

									href='mailto:hello@reeseroofing.example'
								>{ /* What: Row Value Anchor Element. Why: Visitors should be able to start an email in one click. How: This is the email link, which opens a new email to the company. */ }
									hello@reeseroofing.example
								</a>


							</dd>


						</div>


						<div className={ cssModObj.conRowDiv }>{ /* What: Contact Row Div Element. Why: Visitors want to know when someone will answer. How: This is the hours row, which pairs the label with the hours. */ }


							<dt className={ cssModObj.rowLabTer }>Hours</dt>{ /* What: Row Label Term Element. Why: Each row is labeled. How: This names the hours row's detail. */ }

							<dd className={ cssModObj.rowValDet }>{ /* What: Row Value Details Element. Why: The hours row's value gives the office hours and the emergency exception. How: Its line break puts the emergency note on its own line. */ }
								Mon–Fri, 7:00 AM – 5:00 PM<br />
								<span className={ cssModObj.rowNotSpa }>24/7 emergency response</span>{ /* What: Row Note Span Element. Why: Storm damage can't wait for office hours. How: This notes the round-the-clock response in faded paper. */ }
							</dd>


						</div>


						<div className={ cssModObj.conRowDiv }>{ /* What: Contact Row Div Element. Why: Visitors check whether the company works where they are. How: This is the service area row, which pairs the label with the area. */ }


							<dt className={ cssModObj.rowLabTer }>Service area</dt>{ /* What: Row Label Term Element. Why: Each row is labeled. How: This names the service area row's detail. */ }

							<dd className={ cssModObj.rowValDet }>{ /* What: Row Value Details Element. Why: The service area row's value lists the towns the company covers. How: This names them in one sentence. */ }
								Lawrence, Eudora, Baldwin City, Tonganoxie, Topeka, Kansas City metro,
								and surrounding counties.
							</dd>


						</div>


					</dl>



					<div className={ cssModObj.conSigDiv }>{ /* What: Contact Signature Div Element. Why: The full logo signs off the company's details. How: This sets it on a paper-colored card. */ }


						<img
							className={ cssModObj.conSigIma }

							height='536' // What: Intrinsic Size Note. Why: The page shouldn't shift while the logo loads. How: This matches the SVG's 518 by 536 viewBox, which the stylesheet scales to the column.
							loading='lazy' // What: Lazy Loading Attribute. Why: The image starts below the fold. How: This lets the browser fetch it only as it nears the screen.
							src={ lofSvgUrl }
							width='518' // What: Intrinsic Size Note. Why: The page shouldn't shift while the logo loads. How: This matches the SVG's 518 by 536 viewBox, which the stylesheet scales to the column.

							alt='Reese Roofing: Commercial & Residential'
						/>{ /* What: Contact Signature Image Element. Why: The card shows the full logo. How: Its alt text reads the logo's wording for screen readers. */ }


					</div>


				</div>



				<div className={ cssModObj.conForDiv }>{ /* What: Contact Form Div Element. Why: The form sits in its own framed column. How: This holds the form. */ }


					<form
						className={ cssModObj.estReqFor }

						noValidate // What: No Validate Attribute. Why: The browser's built-in validation popups would interrupt the form's own styling. How: This turns them off, so required fields don't block the mailto handoff.

						onSubmit={ subForFun }
					>{ /* What: Estimate Request Form Element. Why: Visitors request an estimate here. How: This hands the fields to subForFun on submit. */ }


						<div className={ cssModObj.forFieDiv }>{ /* What: Form Field Div Element. Why: The company needs to know who's asking. How: This is the name field, which pairs the label with its input. */ }


							<label
								className={ cssModObj.forFieLab }

								htmlFor='conNamInp'
							>{ /* What: Form Field Label Element. Why: The name field's input needs a visible, clickable label. How: This points at conNamInp. */ }
								Full name
							</label>

							<input
								id='conNamInp'

								className={ cssModObj.forFieInp }

								autoComplete='name'
								placeholder='Jane Smith'
								required
								type='text'
								value={ forValObj.namStr }

								onChange={ updFieFun( 'namStr' ) }
							/>{ /* What: Form Field Input Element. Why: This takes the visitor's name. How: Its value lives in forValObj.namStr, and the browser can fill it in, with a sample name as its placeholder. */ }


						</div>

						<div className={ cssModObj.forFieDiv }>{ /* What: Form Field Div Element. Why: Commercial jobs are usually tied to a business or property. How: This is the company field, which pairs the label with its input. */ }


							<label
								className={ cssModObj.forFieLab }

								htmlFor='conComInp'
							>{ /* What: Form Field Label Element. Why: The company field's input needs a visible, clickable label. How: This points at conComInp. */ }
								Company / property
							</label>

							<input
								id='conComInp'

								className={ cssModObj.forFieInp }

								autoComplete='organization'
								placeholder='Smith Property Management'
								type='text'
								value={ forValObj.comStr }

								onChange={ updFieFun( 'comStr' ) }
							/>{ /* What: Form Field Input Element. Why: This takes the business or property name. How: Its value lives in forValObj.comStr, and the browser can fill it in, with a sample property name as its placeholder. */ }


						</div>


						<div className={ cssModObj.forRowDiv }>{ /* What: Form Row Div Element. Why: Email and phone are short enough to share a row. How: This sets the two fields side by side. */ }


							<div className={ cssModObj.forFieDiv }>{ /* What: Form Field Div Element. Why: The company replies by email. How: This is the email field, which pairs the label with its input. */ }


								<label
									className={ cssModObj.forFieLab }

									htmlFor='conEmaInp'
								>{ /* What: Form Field Label Element. Why: The email field's input needs a visible, clickable label. How: This points at conEmaInp. */ }
									Email
								</label>

								<input
									id='conEmaInp'

									className={ cssModObj.forFieInp }

									autoComplete='email'
									placeholder='jane@company.example'
									required
									type='email'
									value={ forValObj.emaStr }

									onChange={ updFieFun( 'emaStr' ) }
								/>{ /* What: Form Field Input Element. Why: This takes the visitor's email address. How: Its value lives in forValObj.emaStr, and the browser can fill it in, with an email keyboard on phones and a sample address on the reserved example domain as its placeholder. */ }


							</div>

							<div className={ cssModObj.forFieDiv }>{ /* What: Form Field Div Element. Why: Some visitors would rather get a call back. How: This is the phone field, which pairs the label with its input. */ }


								<label
									className={ cssModObj.forFieLab }

									htmlFor='conPhoInp'
								>{ /* What: Form Field Label Element. Why: The phone field's input needs a visible, clickable label. How: This points at conPhoInp. */ }
									Phone
								</label>

								<input
									id='conPhoInp'

									className={ cssModObj.forFieInp }

									autoComplete='tel'
									placeholder='(785) 555-0100'
									type='tel'
									value={ forValObj.phoStr }

									onChange={ updFieFun( 'phoStr' ) }
								/>{ /* What: Form Field Input Element. Why: This takes the visitor's phone number. How: Its value lives in forValObj.phoStr, and the browser can fill it in, with a number pad on phones and a reserved 555-01xx sample number as its placeholder. */ }


							</div>


						</div>


						<div className={ cssModObj.forFieDiv }>{ /* What: Form Field Div Element. Why: Knowing the kind of job helps the company prepare. How: This is the service field, which pairs the label with its dropdown. */ }


							<label
								className={ cssModObj.forFieLab }

								htmlFor='conSerSel'
							>{ /* What: Form Field Label Element. Why: The service field's dropdown needs a visible, clickable label. How: This points at conSerSel. */ }
								Service of interest
							</label>

							<select
								id='conSerSel'

								className={ cssModObj.forFieSel }

								value={ forValObj.serStr }

								onChange={ updFieFun( 'serStr' ) }
							>{ /* What: Form Field Select Element. Why: Visitors pick the kind of work they need. How: Its value lives in forValObj.serStr. */ }


								<option
									className={ cssModObj.forSelOpt }

									value=''
								>{ /* What: Form Select Option Element. Why: The dropdown should start without a choice made. How: This is the empty placeholder option, whose empty value matches the field's empty start. */ }
									Select one…
								</option>

								<option className={ cssModObj.forSelOpt }>New installation</option>{ /* What: Form Select Option Element. Why: Each option is one kind of job. How: This is the new installation option, whose text is also its value. */ }

								<option className={ cssModObj.forSelOpt }>Repair / leak</option>{ /* What: Form Select Option Element. Why: Each option is one kind of job. How: This is the repair option, whose text is also its value. */ }

								<option className={ cssModObj.forSelOpt }>Restoration & coatings</option>{ /* What: Form Select Option Element. Why: Each option is one kind of job. How: This is the restoration option, whose text is also its value. */ }

								<option className={ cssModObj.forSelOpt }>Inspection</option>{ /* What: Form Select Option Element. Why: Each option is one kind of job. How: This is the inspection option, whose text is also its value. */ }

								<option className={ cssModObj.forSelOpt }>Storm / hail damage</option>{ /* What: Form Select Option Element. Why: Each option is one kind of job. How: This is the storm damage option, whose text is also its value. */ }

								<option className={ cssModObj.forSelOpt }>Maintenance program</option>{ /* What: Form Select Option Element. Why: Each option is one kind of job. How: This is the maintenance option, whose text is also its value. */ }

								<option className={ cssModObj.forSelOpt }>Not sure yet</option>{ /* What: Form Select Option Element. Why: Each option is one kind of job. How: This is the not sure yet option, whose text is also its value. */ }


							</select>


						</div>

						<div className={ cssModObj.forFieDiv }>{ /* What: Form Field Div Element. Why: The details of the job help the company quote it. How: This is the message field, which pairs the label with its text area. */ }


							<label
								className={ cssModObj.forFieLab }

								htmlFor='conMesTex'
							>{ /* What: Form Field Label Element. Why: The message field's text area needs a visible, clickable label. How: This points at conMesTex. */ }
								Project details
							</label>

							<textarea
								id='conMesTex'

								className={ cssModObj.forFieTex }

								placeholder='Building type, approximate square footage, timing, anything else we should know…'
								rows={ 5 }
								value={ forValObj.mesStr }

								onChange={ updFieFun( 'mesStr' ) }
							/>{ /* What: Form Field Textarea Element. Why: This takes the project's details. How: Its value lives in forValObj.mesStr, with a placeholder suggesting what to include. */ }


						</div>

						<button
							className={ cssModObj.forSubBut }

							type='submit'
						>{ /* What: Form Submit Button Element. Why: This sends the request. How: It submits the form, which runs subForFun. */ }
							{ senReqBoo ? <span className={ cssModObj.subLabSpa }>Opening your email…</span> : 'Send request' }{ /* What: Submit Label Text. Why: The button should confirm the email is opening once it's pressed. How: This switches its label when senReqBoo turns true, the new label in a span that rises in so the change registers. */ }
							<span
								className={ cssModObj.arrIcoSpa }

								aria-hidden='true'
							>{ /* What: Arrow Icon Span Element. Why: The arrow marks the button as moving the visitor onward. How: This sits right after the label and nudges right when the button is hovered, hidden from screen readers since it only decorates the label. */ }
								→
							</span>
						</button>

						<p className={ cssModObj.forFinPar }>{ /* What: Form Fine Paragraph Element. Why: Visitors should know they'll be contacted. How: This states it under the button. */ }
							By submitting, you agree to be contacted by Reese Roofing regarding your inquiry.
						</p>


					</form>


				</div>


			</div>


		</section>


	);


}

// #endregion ConSecCom

// #endregion Components



// #region Exports

export { ConSecCom }; // What: Named Exports. Why: The home page renders the contact section last. How: This exports ConSecCom.

// #endregion Exports



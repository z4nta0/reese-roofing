


// #region Imports

import cssModObj from './contact.module.css'; // What: CSS Module Object. Why: The section's details list, signature card, and estimate form are styled in its own module. How: Each element reads its hashed class name from this object.
import lofSvgUrl from './logo-full.svg';      // What: Logo-Full Svg URL. Why: The section's signature card shows the full logo. How: Vite resolves the import to the file's fingerprinted URL, used as the image's src.
import React from 'react';                    // What: React. Why: The form tracks its fields and sent state with React's hooks and types its events with React's types. How: This is read as React.useState, React.ChangeEvent, React.FormEvent, and React.JSX.Element.

// #endregion Imports



/**
 * contact.tsx = Contact Section
 *
 * @summary
 * The home page's last section, where visitors reach the company. The left
 * column gives the office, phone, email, hours, and service area beside a
 * signature card with the full logo; the right column is an estimate request
 * form. The site has no backend, so submitting the form opens the visitor's
 * own email app with a message built from the fields, addressed to the
 * company.
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
 * contact anchor the navigation links and estimate buttons jump to.
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
		>{ /* What: Contact Section Element. Why: This is where visitors reach the company. How: Its contact id is the anchor the navigation links and estimate buttons jump to, kept as is since it appears in the page's URL. */ }


			<div className={ cssModObj.conLayDiv }>{ /* What: Contact Container Div Element. Why: The section's two columns should line up with the page's content width. How: This sets the intro and the form side by side. */ }


				<div>{ /* What: Contact Intro Div Element. Why: The company's details sit beside the form. How: This stacks the label, heading, lede, details, and signature. */ }


					<span className={ cssModObj.eyeLabSpa }>04 · Get in touch</span>{ /* What: Section Label Span Element. Why: Each section is numbered in order down the page. How: This uses the site's eyebrow style. */ }

					<h2 className={ cssModObj.conTitHea }>{ /* What: Contact Title Heading Element. Why: The heading invites the visitor in. How: Its line break sets the two-line shape, with one word in italic. */ }
						Let's talk about<br />
						your <em className={ cssModObj.titAccEmp }>roof</em>.
					</h2>

					<p className={ cssModObj.secLedPar }>{ /* What: Section Lede Paragraph Element. Why: Visitors should know what happens after they reach out. How: This promises an assessment and a reply within a business day. */ }
						Tell us a bit about your project. We'll schedule an on-site assessment and
						get back to you within one business day with next steps.
					</p>



					<dl className={ cssModObj.conDetDes }>{ /* What: Contact Details Description List Element. Why: The company's contact details read as labeled pairs. How: This holds one row per detail. */ }


						<div className={ cssModObj.conRowDiv }>{ /* What: Office Row Div Element. Why: Visitors want to know where the company is. How: This pairs the label with the address. */ }


							<dt className={ cssModObj.rowLabTer }>Office</dt>{ /* What: Detail Term Element. Why: Each row is labeled. How: This names the detail. */ }

							<dd className={ cssModObj.rowValDet }>{ /* What: Office Detail Element. Why: This is the company's location. How: Its line break puts the city on its own line. */ }
								Reese Roofing<br />
								Lawrence, Kansas 66044
							</dd>


						</div>


						<div className={ cssModObj.conRowDiv }>{ /* What: Phone Row Div Element. Why: Many visitors would rather call. How: This pairs the label with the number. */ }


							<dt className={ cssModObj.rowLabTer }>Phone</dt>{ /* What: Detail Term Element. Why: Each row is labeled. How: This names the detail. */ }

							<dd className={ cssModObj.rowValDet }>{ /* What: Phone Detail Element. Why: This holds the company's number. How: The number is a link that dials it. */ }


								<a
									className={ cssModObj.rowValAnc }

									href='tel:+17855550199'
								>{ /* What: Phone Anchor Element. Why: Phone visitors should be able to call in one tap. How: This dials the company's number. */ }
									(785) 555-0199
								</a>


							</dd>


						</div>


						<div className={ cssModObj.conRowDiv }>{ /* What: Email Row Div Element. Why: Some visitors would rather write. How: This pairs the label with the address. */ }


							<dt className={ cssModObj.rowLabTer }>Email</dt>{ /* What: Detail Term Element. Why: Each row is labeled. How: This names the detail. */ }

							<dd className={ cssModObj.rowValDet }>{ /* What: Email Detail Element. Why: This holds the company's email address. How: The address is a link that starts an email. */ }


								<a
									className={ cssModObj.rowValAnc }

									href='mailto:hello@reeseroofing.example'
								>{ /* What: Email Anchor Element. Why: Visitors should be able to start an email in one click. How: This opens a new email to the company. */ }
									hello@reeseroofing.example
								</a>


							</dd>


						</div>


						<div className={ cssModObj.conRowDiv }>{ /* What: Hours Row Div Element. Why: Visitors want to know when someone will answer. How: This pairs the label with the hours. */ }


							<dt className={ cssModObj.rowLabTer }>Hours</dt>{ /* What: Detail Term Element. Why: Each row is labeled. How: This names the detail. */ }

							<dd className={ cssModObj.rowValDet }>{ /* What: Hours Detail Element. Why: This gives the office hours and the emergency exception. How: Its line break puts the emergency note on its own line. */ }
								Mon–Fri, 7:00 AM – 5:00 PM<br />
								<span className={ cssModObj.rowNotSpa }>24/7 emergency response</span>{ /* What: Emergency Note Span Element. Why: Storm damage can't wait for office hours. How: This notes the round-the-clock response in a muted style. */ }
							</dd>


						</div>


						<div className={ cssModObj.conRowDiv }>{ /* What: Service-Area Row Div Element. Why: Visitors check whether the company works where they are. How: This pairs the label with the area. */ }


							<dt className={ cssModObj.rowLabTer }>Service area</dt>{ /* What: Detail Term Element. Why: Each row is labeled. How: This names the detail. */ }

							<dd className={ cssModObj.rowValDet }>{ /* What: Service-Area Detail Element. Why: This lists the towns the company covers. How: This names them in one sentence. */ }
								Lawrence, Eudora, Baldwin City, Tonganoxie, Topeka, Kansas City metro,
								and surrounding counties.
							</dd>


						</div>


					</dl>



					<div className={ cssModObj.conSigDiv }>{ /* What: Contact Signature Div Element. Why: The full logo signs off the company's details. How: This sets it on a paper-colored card. */ }


						<img
							className={ cssModObj.conSigIma }

							src={ lofSvgUrl }

							alt='Reese Roofing: Commercial & Residential'
						/>{ /* What: Signature Image Element. Why: The card shows the full logo. How: Its alt text reads the logo's wording for screen readers. */ }


					</div>


				</div>



				<div className={ cssModObj.conForDiv }>{ /* What: Contact Form Div Element. Why: The form sits in its own framed column. How: This holds the form. */ }


					<form
						className={ cssModObj.estReqFor }

						noValidate // What: No Validate Attribute. Why: The browser's built-in validation popups would interrupt the form's own styling. How: This turns them off, so required fields don't block the mailto handoff.

						onSubmit={ subForFun }
					>{ /* What: Contact Form Element. Why: Visitors request an estimate here. How: This hands the fields to subForFun on submit. */ }


						<div className={ cssModObj.forFieDiv }>{ /* What: Name Field Div Element. Why: The company needs to know who's asking. How: This pairs the label with its input. */ }


							<label
								className={ cssModObj.forFieLab }

								htmlFor='conNamInp'
							>{ /* What: Name Label Element. Why: The input needs a visible, clickable label. How: This points at conNamInp. */ }
								Full name
							</label>

							<input
								id='conNamInp'

								className={ cssModObj.forFieInp }

								autoComplete='name'
								required
								type='text'
								value={ forValObj.namStr }

								onChange={ updFieFun( 'namStr' ) }
							/>{ /* What: Contact Name Input Element. Why: This takes the visitor's name. How: Its value lives in forValObj.namStr, and the browser can fill it in. */ }


						</div>

						<div className={ cssModObj.forFieDiv }>{ /* What: Company Field Div Element. Why: Commercial jobs are usually tied to a business or property. How: This pairs the label with its input. */ }


							<label
								className={ cssModObj.forFieLab }

								htmlFor='conComInp'
							>{ /* What: Company Label Element. Why: The input needs a visible, clickable label. How: This points at conComInp. */ }
								Company / property
							</label>

							<input
								id='conComInp'

								className={ cssModObj.forFieInp }

								autoComplete='organization'
								type='text'
								value={ forValObj.comStr }

								onChange={ updFieFun( 'comStr' ) }
							/>{ /* What: Contact Company Input Element. Why: This takes the business or property name. How: Its value lives in forValObj.comStr, and the browser can fill it in. */ }


						</div>


						<div className={ cssModObj.forRowDiv }>{ /* What: Field Row Div Element. Why: Email and phone are short enough to share a row. How: This sets the two fields side by side. */ }


							<div className={ cssModObj.forFieDiv }>{ /* What: Email Field Div Element. Why: The company replies by email. How: This pairs the label with its input. */ }


								<label
									className={ cssModObj.forFieLab }

									htmlFor='conEmaInp'
								>{ /* What: Email Label Element. Why: The input needs a visible, clickable label. How: This points at conEmaInp. */ }
									Email
								</label>

								<input
									id='conEmaInp'

									className={ cssModObj.forFieInp }

									autoComplete='email'
									required
									type='email'
									value={ forValObj.emaStr }

									onChange={ updFieFun( 'emaStr' ) }
								/>{ /* What: Contact Email Input Element. Why: This takes the visitor's email address. How: Its value lives in forValObj.emaStr, with an email keyboard on phones. */ }


							</div>

							<div className={ cssModObj.forFieDiv }>{ /* What: Phone Field Div Element. Why: Some visitors would rather get a call back. How: This pairs the label with its input. */ }


								<label
									className={ cssModObj.forFieLab }

									htmlFor='conPhoInp'
								>{ /* What: Phone Label Element. Why: The input needs a visible, clickable label. How: This points at conPhoInp. */ }
									Phone
								</label>

								<input
									id='conPhoInp'

									className={ cssModObj.forFieInp }

									autoComplete='tel'
									type='tel'
									value={ forValObj.phoStr }

									onChange={ updFieFun( 'phoStr' ) }
								/>{ /* What: Contact Phone Input Element. Why: This takes the visitor's phone number. How: Its value lives in forValObj.phoStr, with a number pad on phones. */ }


							</div>


						</div>


						<div className={ cssModObj.forFieDiv }>{ /* What: Service Field Div Element. Why: Knowing the kind of job helps the company prepare. How: This pairs the label with its dropdown. */ }


							<label
								className={ cssModObj.forFieLab }

								htmlFor='conSerSel'
							>{ /* What: Service Label Element. Why: The dropdown needs a visible, clickable label. How: This points at conSerSel. */ }
								Service of interest
							</label>

							<select
								id='conSerSel'

								className={ cssModObj.forFieSel }

								value={ forValObj.serStr }

								onChange={ updFieFun( 'serStr' ) }
							>{ /* What: Contact Service Select Element. Why: Visitors pick the kind of work they need. How: Its value lives in forValObj.serStr. */ }


								<option
									className={ cssModObj.forSelOpt }

									value=''
								>{ /* What: Placeholder Option Element. Why: The dropdown should start without a choice made. How: Its empty value matches the field's empty start. */ }
									Select one…
								</option>

								<option className={ cssModObj.forSelOpt }>New installation</option>{ /* What: Service Option Element. Why: Each option is one kind of job. How: Its text is also its value. */ }

								<option className={ cssModObj.forSelOpt }>Repair / leak</option>{ /* What: Service Option Element. Why: Each option is one kind of job. How: Its text is also its value. */ }

								<option className={ cssModObj.forSelOpt }>Restoration & coatings</option>{ /* What: Service Option Element. Why: Each option is one kind of job. How: Its text is also its value. */ }

								<option className={ cssModObj.forSelOpt }>Inspection</option>{ /* What: Service Option Element. Why: Each option is one kind of job. How: Its text is also its value. */ }

								<option className={ cssModObj.forSelOpt }>Storm / hail damage</option>{ /* What: Service Option Element. Why: Each option is one kind of job. How: Its text is also its value. */ }

								<option className={ cssModObj.forSelOpt }>Maintenance program</option>{ /* What: Service Option Element. Why: Each option is one kind of job. How: Its text is also its value. */ }

								<option className={ cssModObj.forSelOpt }>Not sure yet</option>{ /* What: Service Option Element. Why: Each option is one kind of job. How: Its text is also its value. */ }


							</select>


						</div>

						<div className={ cssModObj.forFieDiv }>{ /* What: Message Field Div Element. Why: The details of the job help the company quote it. How: This pairs the label with its text area. */ }


							<label
								className={ cssModObj.forFieLab }

								htmlFor='conMesTex'
							>{ /* What: Message Label Element. Why: The text area needs a visible, clickable label. How: This points at conMesTex. */ }
								Project details
							</label>

							<textarea
								id='conMesTex'

								className={ cssModObj.forFieTex }

								placeholder='Building type, approximate square footage, timing, anything else we should know…'
								rows={ 5 }
								value={ forValObj.mesStr }

								onChange={ updFieFun( 'mesStr' ) }
							/>{ /* What: Contact Message Textarea Element. Why: This takes the project's details. How: Its value lives in forValObj.mesStr, with a placeholder suggesting what to include. */ }


						</div>

						<button
							className={ cssModObj.forSubBut }

							type='submit'
						>{ /* What: Contact Submit Button Element. Why: This sends the request. How: It submits the form, which runs subForFun. */ }
							{ senReqBoo ? 'Opening your email…' : 'Send request' }{ /* What: Submit Label Text. Why: The button should confirm the email is opening once it's pressed. How: This switches its label when senReqBoo turns true. */ }
							<span
								className={ cssModObj.arrIcoSpa }

								aria-hidden='true'
							>{ /* What: Arrow Icon Span Element. Why: The arrow marks the button as moving the visitor onward. How: This sits right after the label, hidden from screen readers since it only decorates the label. */ }
								→
							</span>
						</button>

						<p className={ cssModObj.forFinPar }>{ /* What: Contact Fine-Print Paragraph Element. Why: Visitors should know they'll be contacted. How: This states it under the button. */ }
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



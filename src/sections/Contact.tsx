import { useState } from 'react';
import './Contact.css';

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const initial: FormState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  service: '',
  message: '',
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(initial);
  const [sent, setSent] = useState(false);

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Estimate request — ${form.name || 'Reese Roofing inquiry'}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nCompany: ${form.company}\nEmail: ${form.email}\nPhone: ${form.phone}\nService: ${form.service}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:hello@reeseroofing.example?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" className="contact section">
      <div className="container contact__container">
        <div className="contact__intro">
          <span className="eyebrow">04 — Get in touch</span>
          <h2 className="display contact__title">
            Let's talk about<br />
            your <em>roof</em>.
          </h2>
          <p className="lede contact__lede">
            Tell us a bit about your project. We'll schedule an on-site assessment and
            get back to you within one business day with next steps.
          </p>

          <dl className="contact__details">
            <div className="contact__row">
              <dt>Office</dt>
              <dd>
                Reese Roofing<br />
                Lawrence, Kansas 66044
              </dd>
            </div>
            <div className="contact__row">
              <dt>Phone</dt>
              <dd>
                <a href="tel:+17855550199">(785) 555-0199</a>
              </dd>
            </div>
            <div className="contact__row">
              <dt>Email</dt>
              <dd>
                <a href="mailto:hello@reeseroofing.example">hello@reeseroofing.example</a>
              </dd>
            </div>
            <div className="contact__row">
              <dt>Hours</dt>
              <dd>
                Mon–Fri, 7:00 AM – 5:00 PM<br />
                <span className="muted">24/7 emergency response</span>
              </dd>
            </div>
            <div className="contact__row">
              <dt>Service area</dt>
              <dd>
                Lawrence, Eudora, Baldwin City, Tonganoxie, Topeka, Kansas City metro,
                and surrounding counties.
              </dd>
            </div>
          </dl>

          <div className="contact__signature">
            <img src="/logo-full.png" alt="Reese Roofing — Commercial & Residential" />
          </div>
        </div>

        <div className="contact__form-wrap">
          <form className="contact__form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={update('name')}
                required
                autoComplete="name"
              />
            </div>

            <div className="field">
              <label htmlFor="company">Company / property</label>
              <input
                id="company"
                type="text"
                value={form.company}
                onChange={update('company')}
                autoComplete="organization"
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="service">Service of interest</label>
              <select id="service" value={form.service} onChange={update('service')}>
                <option value="">Select one…</option>
                <option>New installation</option>
                <option>Repair / leak</option>
                <option>Restoration & coatings</option>
                <option>Inspection</option>
                <option>Storm / hail damage</option>
                <option>Maintenance program</option>
                <option>Not sure yet</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="message">Project details</label>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={update('message')}
                placeholder="Building type, approximate square footage, timing, anything else we should know…"
              />
            </div>

            <button type="submit" className="btn btn-primary contact__submit">
              {sent ? 'Opening your email…' : 'Send request'}
              <span className="arrow">→</span>
            </button>

            <p className="contact__fineprint">
              By submitting, you agree to be contacted by Reese Roofing regarding your inquiry.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

import './About.css';
import logoFull from '../assets/logo-full.svg';

const principles = [
  {
    title: 'Local, accountable, on-site',
    body: 'Every project is led by an owner-operator who walks the roof, signs the proposal, and stays reachable from kickoff to close-out.',
  },
  {
    title: 'Built for Kansas weather',
    body: 'Our systems are spec\'d for what this region actually delivers — high winds, hail, freeze-thaw cycles, and brutal summer UV.',
  },
  {
    title: 'Honest scopes & timelines',
    body: 'You get a line-itemed estimate, a real schedule, and direct answers — not change-order surprises buried in fine print.',
  },
  {
    title: 'Warranty-backed installs',
    body: 'Manufacturer-certified on TPO, EPDM, and metal systems — meaning material and workmanship warranties that actually mean something.',
  },
];

export default function About() {
  return (
    <section id="about" className="about section">
      <div className="container about__container">
        <div className="about__left">
          <span className="eyebrow">03 — About</span>
          <h2 className="display about__title">
            A Lawrence company<br />
            with <em>roots</em> in<br />
            the work.
          </h2>
          <div className="about__seal" aria-hidden="true">
            <img src={logoFull} alt="" />
          </div>
        </div>

        <div className="about__right">
          <p className="about__para about__para--lead">
            Reese Roofing was founded on a simple idea: commercial roofing should be a
            straightforward business. A clear scope, a fair price, a roof installed by
            people who care whether it holds up.
          </p>
          <p className="about__para">
            We've worked on warehouses, churches, retail centers, office buildings, and
            municipal facilities across Douglas County and the surrounding counties for
            more than a decade and a half. Most of our work comes from referrals — from
            building owners and property managers who appreciated that we showed up when
            we said we would and stood behind the work after the crew packed up.
          </p>
          <p className="about__para">
            We're licensed, fully insured, and manufacturer-certified on the systems we
            install. But the most important credential we carry is the trust of the
            businesses we've roofed in this town.
          </p>

          <blockquote className="about__quote">
            <span className="about__quote-mark">&ldquo;</span>
            <p>
              The roof above your operation is not the place to cut corners — and
              it&apos;s not the place to overspend. Our job is to find the line.
            </p>
            <footer>— The Reese family</footer>
          </blockquote>
        </div>
      </div>

      <div className="container">
        <div className="about__principles">
          {principles.map((p, i) => (
            <div key={p.title} className="principle">
              <span className="principle__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="principle__title">{p.title}</h3>
              <p className="principle__body">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

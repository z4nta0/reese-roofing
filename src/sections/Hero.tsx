import './Hero.css';

export default function Hero() {
  return (
    <section id="top" className="hero section">
      <div className="hero__bg" aria-hidden="true">
        <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="1440" height="800" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container hero__inner">
        <div className="hero__top">
          <div className="hero__copy">
            <span className="eyebrow">Lawrence, Kansas — Est. 2008</span>

            <h1 className="display hero__title">
              Commercial roofing,<br />
              built to <em>weather</em><br />
              every season.
            </h1>
          </div>

          <div className="hero__logo">
            <img
              src="/logo-full.png"
              alt="Reese Roofing — Commercial & Residential"
              width="500"
              height="515"
            />
          </div>
        </div>

        <div className="hero__bottom">
          <p className="lede hero__lede">
            Reese Roofing serves businesses, property managers, and homeowners across
            Lawrence and the surrounding region — delivering installations and repairs
            that hold up to Kansas wind, sun, and storm.
          </p>

          <div className="hero__actions">
            <a href="#contact" className="btn btn-primary">
              Request an estimate
              <span className="arrow">→</span>
            </a>
            <a href="#services" className="btn btn-ghost">
              Explore services
            </a>
          </div>
        </div>

        <div className="hero__stats">
          <div className="stat">
            <div className="stat__num display">17+</div>
            <div className="stat__label">Years serving Douglas County</div>
          </div>
          <div className="stat">
            <div className="stat__num display">400<span>+</span></div>
            <div className="stat__label">Commercial roofs completed</div>
          </div>
          <div className="stat">
            <div className="stat__num display">24<span>/7</span></div>
            <div className="stat__label">Emergency response available</div>
          </div>
          <div className="stat">
            <div className="stat__num display">
              A<span className="stat__plus">+</span>
            </div>
            <div className="stat__label">BBB accredited & fully insured</div>
          </div>
        </div>
      </div>
    </section>
  );
}

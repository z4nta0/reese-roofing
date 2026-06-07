import { useEffect, useState } from 'react';
import './Nav.css';
import logoMark from '../assets/logo-mark.svg';

const links = [
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <a href="#top" className="nav__brand" aria-label="Reese Roofing, home">
          <img src={logoMark} alt="" className="nav__mark" width="40" height="36" />
          <span className="nav__name">
            Reese <span className="nav__name-light">Roofing</span>
          </span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav__link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__cta">
          <a href="tel:+17855550199" className="nav__phone" aria-label="Call Reese Roofing">
            (785) 555-0199
          </a>
          <a href="#contact" className="btn btn-primary nav__btn">
            Get an estimate
            <span className="arrow">→</span>
          </a>
        </div>

        <button
          className={`nav__toggle ${open ? 'is-open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`nav__drawer ${open ? 'is-open' : ''}`}>
        {links.map((l) => (
          <a key={l.href} href={l.href} className="nav__drawer-link" onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="tel:+17855550199" className="nav__drawer-link nav__drawer-link--muted">
          (785) 555-0199
        </a>
      </div>
    </header>
  );
}

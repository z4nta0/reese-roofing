import './Footer.css';
import logoMark from '../assets/logo-mark.svg';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__mark">
            <img src={logoMark} alt="" width="28" height="26" />
          </span>
          <span className="footer__name">
            Reese <span>Roofing</span>
          </span>
        </div>
        <div className="footer__meta">
          <span>© {year} Reese Roofing, LLC</span>
          <span>Licensed & insured · Lawrence, KS</span>
        </div>
        <a href="#top" className="footer__top" aria-label="Back to top">
          Back to top <span className="arrow">↑</span>
        </a>
      </div>
    </footer>
  );
}

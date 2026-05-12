import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        gap: '1.5rem',
      }}
    >
      <span className="eyebrow">Error 404</span>
      <h1 className="display" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
        Page not <em>found</em>.
      </h1>
      <p className="lede">The page you're looking for doesn't exist. Let's get you back home.</p>
      <Link to="/" className="btn btn-primary">
        Return home <span className="arrow">→</span>
      </Link>
    </main>
  );
}

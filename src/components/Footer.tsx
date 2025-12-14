import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-12 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted">
        <p>SafeNet — protecting dignity online.</p>
        <div className="flex items-center gap-4">
          <Link to="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link to="/safety-policy" className="hover:text-white transition-colors">
            Safety Policy
          </Link>
          <Link to="/about" className="hover:text-white transition-colors">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}

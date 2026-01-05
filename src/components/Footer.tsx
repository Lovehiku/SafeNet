import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-12 py-6 bg-white">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted">
        <p>SafeNet — protecting dignity online.</p>
        <div className="flex items-center gap-4">
          <Link to="/terms" className="hover:text-primary-600 transition-colors">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-primary-600 transition-colors">
            Privacy
          </Link>
          <Link to="/safety-policy" className="hover:text-primary-600 transition-colors">
            Safety Policy
          </Link>
          <Link to="/about" className="hover:text-primary-600 transition-colors">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}

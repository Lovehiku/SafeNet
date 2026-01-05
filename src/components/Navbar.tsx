import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/alert-center', label: 'Alert Center' },
  { to: '/analyzer', label: 'Analyzer' },
  { to: '/awareness', label: 'Awareness' },
  { to: '/extension', label: 'Extension' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAppStore();

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary-500 flex items-center justify-center font-bold text-white">
            S
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">SafeNet</p>
            <p className="text-xs text-muted -mt-1">Cyber safety for all</p>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? 'bg-primary-500 text-white' : 'text-muted hover:text-primary-600 hover:bg-orange-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {!user && (
            <Link to="/login" className="btn-ghost">
              Log in
            </Link>
          )}
          {user && (
            <button
              className="btn-ghost"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Logout
            </button>
          )}
        </div>
        <button
          className="md:hidden text-gray-900"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden border-t border-gray-200 bg-white"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="px-4 py-3 flex flex-col gap-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isActive ? 'bg-primary-500 text-white' : 'text-muted hover:text-primary-600 hover:bg-orange-50'
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              {!user && (
                <Link to="/login" className="btn-primary text-center" onClick={() => setOpen(false)}>
                  Log in
                </Link>
              )}
              {user && (
                <button
                  className="btn-ghost text-center"
                  onClick={() => {
                    logout();
                    setOpen(false);
                    navigate('/login');
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

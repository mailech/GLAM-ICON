import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const NavLink = ({ to, children, mobile = false }) => {
    const isActive = location.pathname === to;
    const baseClasses = "text-xs font-bold uppercase tracking-widest transition duration-300";
    const activeClasses = "text-white";
    const inactiveClasses = "text-gray-400 hover:text-white";
    const mobileClasses = "block py-4 text-center text-sm border-b border-white/5 w-full";

    return (
      <Link
        to={to}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${mobile ? mobileClasses : ''}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 font-sans relative">
      <header className="fixed top-0 left-0 w-full z-50">
        <nav className="bg-dark-900/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">

            <Link to="/" className="text-2xl font-display font-bold text-white tracking-widest uppercase flex items-center gap-2 z-50 relative">
              <span className="w-2 h-8 bg-secondary-500 block"></span>
              Glam Icon
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/events">Events</NavLink>
              {token ? (
                <>
                  <NavLink to="/profile">Profile</NavLink>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 transition text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <Link
                    to="/register"
                    className="px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-secondary-600 hover:bg-secondary-500 text-white transition shadow-lg shadow-secondary-900/20"
                  >
                    Get Pass
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden z-50 relative p-2 text-white focus:outline-none"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`h-0.5 w-full bg-white transform transition duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`h-0.5 w-full bg-white transition duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`h-0.5 w-full bg-white transform transition duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-dark-900 border-b border-white/10 shadow-2xl md:hidden flex flex-col items-center py-6"
            >
              <NavLink to="/events" mobile>Events</NavLink>
              {token ? (
                <>
                  <NavLink to="/profile" mobile>Profile</NavLink>
                  <button
                    onClick={handleLogout}
                    className="mt-6 px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 transition text-white w-3/4 mx-auto"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" mobile>Login</NavLink>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-4 px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest bg-secondary-600 hover:bg-secondary-500 text-white transition shadow-lg shadow-secondary-900/20 w-3/4 text-center mx-auto"
                  >
                    Get Pass
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-0">
        <Outlet />
      </main>

      <footer className="bg-dark-950 border-t border-white/5 py-12 text-center text-gray-600 text-xs uppercase tracking-widest px-4">
        <p>&copy; 2026 Glam Icon India. The Epitome of Luxury.</p>
      </footer>
    </div>
  );
};

export default Layout;

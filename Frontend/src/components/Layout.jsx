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
    <div className="min-h-screen bg-dark-900 text-gray-100 font-sans relative flex flex-col">
      <header className="fixed top-0 left-0 w-full z-50">
        <nav className="bg-dark-900/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">

            <Link to="/" className="text-2xl font-display font-bold text-white tracking-widest uppercase flex items-center gap-2 z-50 relative">
              <span className="w-2 h-8 bg-secondary-500 block"></span>
              GLAM ICON INDIA
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/events">Events</NavLink>
              {token ? (
                <>
                  <NavLink to="/profile">Profile</NavLink>
                  <NavLink to="/admin">Admin</NavLink>
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

      <main className="relative z-0 grow">
        <Outlet />
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-dark-950 border-t border-white/5 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-display font-bold text-white tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-6 bg-secondary-500 block"></span>
              GLAM ICON INDIA
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              India's premier digital platform for the fashion elite.
              Bridging the gap between aspiring models, designers, and the world stage.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Twitter', 'LinkedIn'].map(social => (
                <a key={social} href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-secondary-600 hover:text-white transition text-xs">
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Explore</h4>
            <ul className="space-y-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <li><Link to="/events" className="hover:text-secondary-400 transition">Fashion Weeks</Link></li>
              <li><Link to="/events" className="hover:text-secondary-400 transition">Model Hunts</Link></li>
              <li><a href="#" className="hover:text-secondary-400 transition">Designers</a></li>
              <li><a href="#" className="hover:text-secondary-400 transition">Gallery</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <li><a href="#" className="hover:text-secondary-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-secondary-400 transition">Carrers</a></li>
              <li><a href="#" className="hover:text-secondary-400 transition">Contact</a></li>
              <li><a href="#" className="hover:text-secondary-400 transition">Partners</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Insiders</h4>
            <p className="text-gray-500 text-xs mb-4">Subscribe for exclusive invites and updates.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="bg-white/5 border border-white/10 border-r-0 rounded-l-lg px-4 py-3 text-xs text-white w-full outline-none focus:bg-white/10 transition"
              />
              <button className="bg-secondary-600 text-white px-4 py-3 rounded-r-lg text-xs font-bold uppercase tracking-widest hover:bg-secondary-500 transition">
                Join
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 uppercase tracking-wider">
          <p>&copy; 2026 Glam Icon India. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

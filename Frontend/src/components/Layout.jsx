import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Scroll to Top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const NavLink = ({ to, children, mobile = false }) => {
    const isActive = location.pathname === to;
    const baseClasses = "text-xs font-bold uppercase tracking-widest transition duration-300 relative group";
    const activeClasses = "text-text-primary scale-105";
    const inactiveClasses = "text-text-secondary hover:text-text-primary";
    const mobileClasses = "block py-4 text-center text-sm border-b border-white/5 w-full";

    return (
      <Link
        to={to}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${mobile ? mobileClasses : ''}`}
      >
        {children}
        {!mobile && (
          <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary-500 transition-all duration-300 group-hover:w-full ${isActive ? 'w-full' : ''}`}></span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans relative flex flex-col transition-colors duration-300">
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border py-4 shadow-lg' : 'bg-transparent py-6'}`}>
        <nav className="px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">

            <Link to="/" className="font-display font-bold text-text-primary tracking-widest uppercase flex items-center gap-3 z-50 relative group">
              <span className="w-1 h-8 md:w-1.5 md:h-10 bg-secondary-500 block transition-all group-hover:bg-secondary-600 shadow-[0_0_10px_rgba(234,179,8,0.3)]"></span>
              <div className="flex flex-col justify-center">
                <span className="text-lg md:text-2xl leading-none">GLAM ICONIC</span>
                <span className="text-[10px] md:text-xs text-secondary-600 tracking-[0.35em] font-sans font-bold leading-none mt-1">INDIA</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/events">Events</NavLink>
              {token ? (
                <>
                  <NavLink to="/profile">Profile</NavLink>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-surface hover:bg-surface-highlight border border-border transition text-text-primary"
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
              {/* Theme Toggle in Desktop */}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={toggleMenu}
                className="z-50 relative p-2 text-text-primary focus:outline-none"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`h-0.5 w-full bg-current transform transition duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`h-0.5 w-full bg-current transition duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`h-0.5 w-full bg-current transform transition duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                </div>
              </button>
            </div>
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
              className="absolute top-full left-0 w-full bg-surface border-b border-border shadow-2xl md:hidden flex flex-col items-center py-6"
            >
              <NavLink to="/events" mobile>Events</NavLink>
              {token ? (
                <>
                  <NavLink to="/profile" mobile>Profile</NavLink>
                  <button
                    onClick={handleLogout}
                    className="mt-6 px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest bg-surface-highlight hover:bg-gray-200 border border-border transition text-text-primary w-3/4 mx-auto"
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

      {/* Enhanced Footer (Mobile Optimized) */}
      <footer className="bg-surface border-t border-border mt-auto relative">

        {/* --- SPONSORS STATIC SECTION --- */}
        <div className="border-y border-white/10 py-12 bg-black relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-secondary-500 font-bold tracking-[0.3em] uppercase mb-8 text-xs">Official Sponsors</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-80">
              <span className="text-xl md:text-3xl font-display font-medium text-white hover:text-secondary-400 transition-colors cursor-default">VOGUE</span>
              <span className="text-xl md:text-3xl font-display font-medium text-white hover:text-secondary-400 transition-colors cursor-default">ELLE</span>
              <span className="text-xl md:text-3xl font-display font-medium text-white hover:text-secondary-400 transition-colors cursor-default">HARPER'S BAZAAR</span>
              <span className="text-xl md:text-3xl font-display font-medium text-white hover:text-secondary-400 transition-colors cursor-default">COSMOPOLITAN</span>
              <span className="text-xl md:text-3xl font-display font-medium text-white hover:text-secondary-400 transition-colors cursor-default">FEMINA</span>
              <span className="text-xl md:text-3xl font-display font-medium text-white hover:text-secondary-400 transition-colors cursor-default">GRAZIA</span>
            </div>
          </div>
        </div>

        <div className="pt-12 md:pt-20 pb-8 md:pb-10 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-12 mb-12 md:mb-16">

            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1 space-y-4 md:space-y-6">
              <Link to="/" className="text-xl md:text-2xl font-display font-bold text-text-primary tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-5 md:h-6 bg-secondary-500 block"></span>
                GLAM ICONIC INDIA
              </Link>
              <p className="text-text-secondary text-sm leading-relaxed font-light max-w-sm">
                India's premier digital platform for the fashion elite.
                Bridging the gap between aspiring models, designers, and the world stage.
              </p>
              <div className="flex gap-4">
                {['Instagram', 'Twitter', 'LinkedIn'].map(social => (
                  <a key={social} href="#" className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center text-text-secondary hover:bg-secondary-600 hover:text-white transition text-xs">
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Links 1 */}
            <div className="col-span-1">
              <h4 className="text-text-primary font-bold text-xs md:text-sm uppercase tracking-widest mb-4 md:mb-6">Explore</h4>
              <ul className="space-y-3 md:space-y-4 text-xs font-medium text-text-secondary uppercase tracking-wide">
                <li><Link to="/events" className="hover:text-secondary-400 transition">Fashion Weeks</Link></li>
                <li><Link to="/coming-soon" className="hover:text-secondary-400 transition">Model Hunts</Link></li>
                <li><Link to="/coming-soon" className="hover:text-secondary-400 transition">Designers</Link></li>
                <li><Link to="/coming-soon" className="hover:text-secondary-400 transition">Gallery</Link></li>
              </ul>
            </div>

            {/* Links 2 */}
            <div className="col-span-1">
              <h4 className="text-text-primary font-bold text-xs md:text-sm uppercase tracking-widest mb-4 md:mb-6">Company</h4>
              <ul className="space-y-3 md:space-y-4 text-xs font-medium text-text-secondary uppercase tracking-wide">
                <li><Link to="/coming-soon" className="hover:text-secondary-400 transition">About Us</Link></li>
                <li><Link to="/coming-soon" className="hover:text-secondary-400 transition">Careers</Link></li>
                <li><Link to="/coming-soon" className="hover:text-secondary-400 transition">Contact</Link></li>
                <li><Link to="/coming-soon" className="hover:text-secondary-400 transition">Sponsors</Link></li>
                {/* <li><Link to="/coming-soon" className="hover:text-secondary-400 transition">Chutiya</Link></li> */}

              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-text-primary font-bold text-xs md:text-sm uppercase tracking-widest mb-4 md:mb-6">Insiders</h4>
              <p className="text-text-secondary text-xs mb-4">Subscribe for exclusive invites and updates.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="bg-background border border-border border-r-0 rounded-l-lg px-4 py-3 text-xs text-text-primary w-full outline-none focus:bg-surface-highlight transition"
                />
                <button className="bg-secondary-600 text-white px-4 py-3 rounded-r-lg text-xs font-bold uppercase tracking-widest hover:bg-secondary-500 transition">
                  Join
                </button>
              </div>
            </div>

          </div>

          <div className="max-w-7xl mx-auto border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-text-secondary uppercase tracking-wider text-center md:text-left">
            <p>&copy; 2026 Glam Iconic India. All rights reserved.</p>
            <div className="flex gap-6 md:gap-8">
              <Link to="/coming-soon" className="hover:text-text-primary transition">Privacy Policy</Link>
              <Link to="/coming-soon" className="hover:text-text-primary transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

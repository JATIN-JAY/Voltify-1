import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { ModalContext } from '../context/ModalContext';
import { useScrolled } from '../hooks';
import { NAV_CATEGORIES } from '../constants/navigation';
import SearchOverlay from './SearchOverlay';

/**
 * Navigation Menu Item Component
 * Reusable menu item with dropdown support
 */
const NavMenuItem = ({ category, isOpen, onMouseEnter, onMouseLeave }) => {
  return (
    <div className="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <button className="text-sm font-normal tracking-[0.01em] text-voltify-light/70 hover:text-voltify-gold transition-colors relative group">
        {category.name}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-voltify-gold rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-voltify-dark/95 rounded-2xl shadow-2xl border border-voltify-border min-w-max py-6 px-2 z-40"
          >
            {category.items.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-6 py-2 text-sm font-medium text-voltify-light hover:text-voltify-gold hover:bg-voltify-dark rounded-lg transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * User Navigation Actions
 * Account, wishlist, orders links with profile dropdown
 */
const NavUserActions = ({ user, cartCount, onSearchClick, onLogout, onOpenLogin, onOpenSignup }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <button
        onClick={onSearchClick}
        className="text-voltify-light/60 hover:text-voltify-gold transition-colors p-2.5 sm:p-2 rounded-lg hover:bg-voltify-light/5 min-h-11 min-w-11 sm:min-h-auto sm:min-w-auto flex items-center justify-center"
        aria-label="Search"
      >
        <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {user ? (
        <div className="relative" ref={menuRef}>
          <motion.button
            onClick={() => setShowUserMenu(!showUserMenu)}
            whileHover={{ scale: 1.08 }}
            className="w-9 h-9 sm:w-7 sm:h-7 bg-gradient-to-br from-voltify-gold to-voltify-gold/70 rounded-full flex items-center justify-center text-voltify-dark text-xs sm:text-xs font-semibold hover:shadow-[0_0_12px_rgba(232,160,32,0.5)] transition-all cursor-pointer min-h-11 min-w-11 sm:min-h-auto sm:min-w-auto"
          >
            {user.name?.[0]?.toUpperCase() || 'U'}
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-3 w-60 bg-[#1e1e1e] rounded-xl shadow-xl border border-voltify-border/20 z-50"
              >
                {/* User Info Header */}
                <div className="p-4 border-b border-voltify-border/10">
                  <p className="text-sm font-semibold text-voltify-light">{user.name}</p>
                  <p className="text-xs text-[#888] mt-1.5">{user.email}</p>
                </div>

                {/* Menu Items */}
                <div className="p-4 space-y-0.5">
                  {/* Profile */}
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-voltify-light transition-colors group hover:text-voltify-gold"
                  >
                    <svg className="w-4 h-4 text-[#888] group-hover:text-voltify-gold transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span>Profile</span>
                  </Link>

                  {/* Orders */}
                  <Link
                    to="/orders"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-voltify-light transition-colors group hover:text-voltify-gold"
                  >
                    <svg className="w-4 h-4 text-[#888] group-hover:text-voltify-gold transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.66V18a2.25 2.25 0 002.25 2.25h10.5m-16.5 0h18.75m-18.75-2.75a.75.75 0 001.5 0m16.5 0a.75.75 0 001.5 0m-18.75-11.881a3 3 0 015.364 0l-30 36m33-12.881h2.25m-1.5-1.5h1.5m2.25 0h1.5" />
                    </svg>
                    <span>Orders</span>
                  </Link>

                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-voltify-light transition-colors group hover:text-voltify-gold"
                  >
                    <svg className="w-4 h-4 text-[#888] group-hover:text-voltify-gold transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-1.085-.45-2.084-1.175-2.792m0 0c-.913-.929-2.205-1.461-3.597-1.461-1.537 0-2.921.604-3.907 1.578M5.175 5.458c-.913.929-1.465 2.144-1.465 3.542 0 1.193.31 2.325.844 3.285m19.5 0A24.01 24.01 0 0112 15m-11.445 0c.844.977 1.845 1.83 2.954 2.504" />
                    </svg>
                    <span>Wishlist</span>
                  </Link>

                  {/* Addresses */}
                  <Link
                    to="/addresses"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-voltify-light transition-colors group hover:text-voltify-gold"
                  >
                    <svg className="w-4 h-4 text-[#888] group-hover:text-voltify-gold transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span>Addresses</span>
                  </Link>

                  {/* Admin Panel */}
                  {user.isAdmin && (
                    <>
                      <div className="border-t border-voltify-border/10 my-2.5"></div>
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-voltify-light transition-colors group hover:text-voltify-gold"
                      >
                        <svg className="w-4 h-4 text-[#888] group-hover:text-voltify-gold transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94m-9.474 0a.75.75 0 00-.735.735m0 0A.75.75 0 003.75 3h16.5a.75.75 0 010 1.5H3.75A.75.75 0 003 3.75zm0 0A.75.75 0 013.75 3h16.5a.75.75 0 011 .75M9.75 6.75v6.75m0 0v3m0-3h6m-6 3v3m6-3v3m3-6v6m0 0v3m0-3h3m-3 3v3" />
                        </svg>
                        <span>Admin Panel</span>
                      </Link>
                    </>
                  )}
                </div>

                {/* Logout */}
                <div className="border-t border-voltify-border/10 p-4">
                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#c97878] transition-colors group hover:text-[#ff9999]"
                  >
                    <svg className="w-4 h-4 text-[#888] group-hover:text-[#ff9999] transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m-3 0l3-3m0 0l3 3m-3-3v12" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLogin}
            className="px-4 py-2 text-sm font-bold text-voltify-light hover:text-voltify-gold transition-colors tracking-wide"
          >
            Login
          </button>
          <button
            onClick={onOpenSignup}
            className="px-5 py-2.5 text-sm font-bold text-voltify-dark bg-voltify-gold hover:bg-yellow-500 rounded-lg transition-all duration-300 uppercase tracking-wide"
          >
            Sign Up
          </button>
        </div>
      )}

      <Link to="/cart" className="relative p-1 min-h-11 min-w-11 flex items-center justify-center">
        <svg className="w-4 h-4 text-voltify-light/60 hover:text-voltify-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>

      <Link to="/become-seller" className="hidden lg:block px-3 py-1.5 text-xs font-normal text-voltify-light/70 border border-voltify-gold/30 rounded-lg hover:text-voltify-gold hover:border-voltify-gold/60 transition-all tracking-[0.01em]">
        Sell
      </Link>
    </div>
  );
};

/**
 * Mobile Navigation Menu - Slide-down drawer for mobile screens
 */
const MobileNavMenu = ({ isOpen, onClose, user, onOpenLogin, onOpenSignup, categories }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
            style={{ top: '56px' }}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 left-0 right-0 w-full bg-[#1a1a1a] border-b border-voltify-border z-50 shadow-xl"
          >
            <div className="px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto">
              {/* Close Button */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={onClose}
                  className="text-voltify-light/60 hover:text-voltify-light transition-colors text-2xl w-8 h-8 flex items-center justify-center"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>

              {/* Home Link */}
              <Link
                to="/"
                onClick={onClose}
                className="block px-4 py-3 text-voltify-light hover:text-voltify-gold hover:bg-voltify-dark/50 rounded-lg transition-all font-medium"
              >
                Home
              </Link>

              {/* Category Links */}
              {categories.map((category) => (
                <div key={category.name}>
                  <div className="px-4 py-2 text-xs font-bold uppercase tracking-[0.05em] text-voltify-light/50">
                    {category.name}
                  </div>
                  {category.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={onClose}
                      className="block px-4 py-2.5 ml-2 text-sm text-voltify-light hover:text-voltify-gold hover:bg-voltify-dark/50 rounded-lg transition-all"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              ))}

              {/* Sell Button */}
              <Link
                to="/become-seller"
                onClick={onClose}
                className="block px-4 py-3 mt-4 text-voltify-light border border-voltify-gold/30 rounded-lg hover:text-voltify-gold hover:border-voltify-gold/60 transition-all font-medium text-center text-sm uppercase tracking-wide"
              >
                Become a Seller
              </Link>

              {/* Auth Actions - Mobile Only */}
              {!user && (
                <div className="space-y-2 mt-4 border-t border-voltify-border pt-4">
                  <button
                    onClick={() => {
                      onOpenLogin();
                      onClose();
                    }}
                    className="block w-full px-4 py-3 text-center text-sm font-semibold text-voltify-light hover:text-voltify-gold hover:bg-voltify-dark/50 rounded-lg transition-all"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onOpenSignup();
                      onClose();
                    }}
                    className="block w-full px-4 py-3 text-center text-sm font-bold text-voltify-dark bg-voltify-gold hover:bg-yellow-500 rounded-lg transition-all uppercase tracking-wide"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * Navbar Component - Refactored with composition patterns
 * Separates concerns into smaller, reusable components
 */
export default function Navbar() {
  const { user, logoutUser, getTotalItems } = useContext(CartContext);
  const { openModal } = useContext(ModalContext);
  const isScrolled = useScrolled();
  const cartCount = getTotalItems();
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const hoverTimeout = useRef(null);

  // Close menu on navigation
  useEffect(() => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  // Handle menu hover with delay to prevent flicker
  const handleMouseEnter = useCallback((menuName) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setActiveMenu(menuName);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeout.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 w-full z-50 bg-voltify-dark border-b border-voltify-border/10"
      >
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center h-14 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group relative z-50 flex-shrink-0">
              <div className="relative">
                <div className="w-9 h-9 bg-voltify-gold rounded-lg flex items-center justify-center text-voltify-dark font-black text-base group-hover:shadow-[0_0_20px_rgba(232,160,32,0.4)] transition-all duration-500 shadow-lg">
                  V
                </div>
                <span className="absolute inset-0 rounded-lg bg-voltify-gold opacity-0 group-hover:opacity-30 transition-opacity blur-lg"></span>
              </div>
              <div className="flex flex-col hidden sm:flex">
                <span className="text-base sm:text-lg font-black tracking-tight text-voltify-light">Voltify</span>
                <span className="text-[8px] font-normal tracking-[0.05em] text-voltify-gold/80 -mt-0.5">Premium tech</span>
              </div>
            </Link>

            {/* Desktop Center Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center justify-center absolute inset-0 pointer-events-none">
              <div className="flex items-center gap-10 pointer-events-auto">
                <Link
                  to="/"
                  className="text-sm font-normal tracking-[0.01em] text-voltify-light/70 hover:text-voltify-gold transition-colors relative group"
                >
                  Home
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-voltify-gold rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span>
                </Link>

                {NAV_CATEGORIES.map((category) => (
                  <NavMenuItem
                    key={category.name}
                    category={category}
                    isOpen={activeMenu === category.name}
                    onMouseEnter={() => handleMouseEnter(category.name)}
                    onMouseLeave={handleMouseLeave}
                  />
                ))}
              </div>
            </div>

            {/* Right Section - Icons and Hamburger */}
            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
              {/* Right Navigation Actions */}
              <NavUserActions
                user={user}
                cartCount={cartCount}
                onSearchClick={() => setSearchOpen(true)}
                onLogout={logoutUser}
                onOpenLogin={() => openModal('login')}
                onOpenSignup={() => openModal('signup')}
              />

              {/* Hamburger Menu Button - Mobile Only (below lg/1024px) */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-voltify-light/60 hover:text-voltify-gold transition-colors min-h-11 min-w-11 flex items-center justify-center"
                aria-label="Toggle navigation menu"
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer - Visible only on mobile */}
      <MobileNavMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onOpenLogin={() => openModal('login')}
        onOpenSignup={() => openModal('signup')}
        categories={NAV_CATEGORIES}
      />

      {/* Search Overlay */}
      {searchOpen && (
        <SearchOverlay open={true} onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}
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
      <button className="text-sm font-normal tracking-[0.02em] text-voltify-light/70 hover:text-voltify-gold transition-colors relative group">
        {category.name}
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-voltify-gold rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span>
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
    <div className="flex items-center gap-4">
      <button
        onClick={onSearchClick}
        className="text-voltify-light/70 hover:text-voltify-gold transition-colors"
        aria-label="Search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {user ? (
        <div className="relative" ref={menuRef}>
          <motion.button
            onClick={() => setShowUserMenu(!showUserMenu)}
            whileHover={{ scale: 1.1 }}
            className="w-8 h-8 bg-gradient-to-br from-voltify-gold to-voltify-gold/70 rounded-full flex items-center justify-center text-voltify-dark text-xs font-bold hover:shadow-lg transition-all cursor-pointer"
          >
            {user.name?.[0]?.toUpperCase() || 'U'}
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-3 w-56 bg-[#1e1e1e] rounded-3xl shadow-xl border border-voltify-border/40 z-50"
              >
                {/* User Info Header */}
                <div className="px-4 py-4 border-b border-voltify-border/20">
                  <p className="text-sm font-semibold text-voltify-light">{user.name}</p>
                  <p className="text-xs text-[#888] mt-1">{user.email}</p>
                </div>

                {/* Menu Items */}
                <div className="py-2 px-2">
                  {/* Profile */}
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-voltify-light transition-colors group hover:text-voltify-gold"
                  >
                    <svg className="w-5 h-5 text-[#888] group-hover:text-voltify-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span>Profile</span>
                  </Link>

                  {/* Orders */}
                  <Link
                    to="/orders"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-voltify-light transition-colors group hover:text-voltify-gold"
                  >
                    <svg className="w-5 h-5 text-[#888] group-hover:text-voltify-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.66V18a2.25 2.25 0 002.25 2.25h10.5m-16.5 0h18.75m-18.75-2.75a.75.75 0 001.5 0m16.5 0a.75.75 0 001.5 0m-18.75-11.881a3 3 0 015.364 0l-30 36m33-12.881h2.25m-1.5-1.5h1.5m2.25 0h1.5" />
                    </svg>
                    <span>Orders</span>
                  </Link>

                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-voltify-light transition-colors group hover:text-voltify-gold"
                  >
                    <svg className="w-5 h-5 text-[#888] group-hover:text-voltify-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-1.085-.45-2.084-1.175-2.792m0 0c-.913-.929-2.205-1.461-3.597-1.461-1.537 0-2.921.604-3.907 1.578M5.175 5.458c-.913.929-1.465 2.144-1.465 3.542 0 1.193.31 2.325.844 3.285m19.5 0A24.01 24.01 0 0012 15m-11.445 0c.844.977 1.845 1.83 2.954 2.504" />
                    </svg>
                    <span>Wishlist</span>
                  </Link>

                  {/* Addresses */}
                  <Link
                    to="/addresses"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-voltify-light transition-colors group hover:text-voltify-gold"
                  >
                    <svg className="w-5 h-5 text-[#888] group-hover:text-voltify-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span>Addresses</span>
                  </Link>

                  {/* Admin Panel */}
                  {user.isAdmin && (
                    <>
                      <div className="border-t border-voltify-border/20 my-2"></div>
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-voltify-light transition-colors group hover:text-voltify-gold"
                      >
                        <svg className="w-5 h-5 text-[#888] group-hover:text-voltify-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94m-9.474 0a.75.75 0 00-.735.735m0 0A.75.75 0 003.75 3h16.5a.75.75 0 010 1.5H3.75A.75.75 0 003 3.75zm0 0A.75.75 0 013.75 3h16.5a.75.75 0 011 .75M9.75 6.75v6.75m0 0v3m0-3h6m-6 3v3m6-3v3m3-6v6m0 0v3m0-3h3m-3 3v3" />
                        </svg>
                        <span>Admin Panel</span>
                      </Link>
                    </>
                  )}
                </div>

                {/* Logout */}
                <div className="border-t border-voltify-border/20 px-2 py-2">
                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors group hover:text-red-400"
                  >
                    <svg className="w-5 h-5 text-[#888] group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m-3 0l3-3m0 0l3 3m-3-3v12" />
                    </svg>
                    <span className="text-[#b8636e]">Logout</span>
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

      <Link to="/cart" className="relative">
        <svg className="w-5 h-5 text-voltify-light/70 hover:text-voltify-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>

      <Link to="/become-seller" className="hidden sm:block px-3 py-1.5 text-xs font-bold text-voltify-light border border-voltify-gold/50 rounded-lg hover:bg-voltify-gold/10 transition-all uppercase tracking-wide">
        Sell
      </Link>
    </div>
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
  const location = useLocation();
  const hoverTimeout = useRef(null);

  // Close menu on navigation
  useEffect(() => {
    setActiveMenu(null);
  }, [location.pathname]);

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
        className={`fixed top-4 left-4 right-4 rounded-2xl z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-voltify-dark backdrop-blur-xl border border-voltify-border/50 shadow-lg'
            : 'bg-voltify-dark/95 border border-voltify-border/30'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12 md:h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group relative z-50">
              <div className="relative">
                <div className="w-10 h-10 bg-voltify-gold rounded-lg flex items-center justify-center text-voltify-dark font-black text-lg group-hover:shadow-[0_0_20px_rgba(232,160,32,0.4)] transition-all duration-500 shadow-lg">
                  V
                </div>
                <span className="absolute inset-0 rounded-lg bg-voltify-gold opacity-0 group-hover:opacity-30 transition-opacity blur-lg"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-narrow text-voltify-light">Voltify</span>
                <span className="text-[9px] font-bold tracking-widest text-voltify-gold uppercase -mt-1">Premium Tech</span>
              </div>
            </Link>

            {/* Desktop Center Navigation */}
            <div className="hidden lg:flex items-center justify-center absolute inset-0 pointer-events-none">
              <div className="flex items-center gap-12 pointer-events-auto">
                <Link
                  to="/"
                  className="text-sm font-normal tracking-[0.02em] text-voltify-light hover:text-voltify-gold transition-colors relative group"
                >
                  Home
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-voltify-gold rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span>
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

            {/* Right Navigation Actions */}
            <NavUserActions
              user={user}
              cartCount={cartCount}
              onSearchClick={() => setSearchOpen(true)}
              onLogout={logoutUser}
              onOpenLogin={() => openModal('login')}
              onOpenSignup={() => openModal('signup')}
            />
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <SearchOverlay open={true} onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}



import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import SearchOverlay from './SearchOverlay';

export default function Navbar() {
  const { user, logoutUser, getTotalItems } = useContext(CartContext);
  const cartCount = getTotalItems();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
    <nav className="
      fixed top-0 left-0 right-0 z-50
      bg-white/20 backdrop-blur-2xl backdrop-saturate-150
      border-b border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)]
      transition-all duration-500
    ">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="
              w-9 h-9 bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-500 
              rounded-xl flex items-center justify-center 
              shadow-lg group-hover:shadow-2xl group-hover:scale-105 
              transition-all duration-400 backdrop-blur-sm bg-opacity-90
            ">
              <span className="text-white font-black text-lg tracking-tight drop-shadow-lg">⚡</span>
            </div>
            <span className="
              font-extrabold text-xl tracking-tight 
              text-gray-900 group-hover:text-gray-800 transition-colors duration-300
            ">
              Voltify
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            <Link 
              to="/" 
              className="
                relative text-gray-900 font-medium text-base tracking-wide 
                hover:text-indigo-700 transition-colors duration-300 group
              "
            >
              Home
              <span className="
                absolute -bottom-1 left-0 h-[2px] w-0 
                bg-gradient-to-r from-indigo-600 to-purple-600 
                rounded-full group-hover:w-full transition-all duration-400 ease-out
              "></span>
            </Link>

            {/* top-level My Orders removed - available inside account dropdown */}

            {/* Admin Link - Only visible to admins */}
            {user && (user.isAdmin || user.email === 'admin@voltify.com') && (
              <Link 
                to="/admin" 
                className="
                  relative px-4 py-2 text-sm font-semibold text-white 
                  bg-gradient-to-r from-orange-500 to-red-500 
                  hover:from-orange-600 hover:to-red-600 
                  rounded-full transition-all duration-300
                "
              >
                Admin Dashboard
              </Link>
            )}

            {/* Mobiles Category */}
            <div className="relative group">
              <button 
                className="
                  relative text-gray-900 font-medium text-sm tracking-wide 
                  hover:text-indigo-700 transition-colors duration-300
                "
              >
                Mobiles
                <span className="
                  absolute -bottom-1 left-0 h-[2px] w-full 
                  bg-gradient-to-r from-indigo-600 to-purple-600 
                  rounded-full group-hover:w-full group-hover:opacity-100 opacity-0 transition-all duration-400 ease-out
                "></span>
              </button>
              <div className="
                absolute left-0 mt-2 w-40 bg-white/95 backdrop-blur-xl 
                rounded-2xl shadow-2xl border border-white/30 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-200 py-3 z-50
              ">
                <Link to="/category/Mobiles?brand=Apple" className="block px-5 py-2.5 text-gray-900 hover:text-indigo-700 hover:bg-indigo-50/50 transition-all duration-200 font-medium text-sm">Apple</Link>
                <Link to="/category/Mobiles?brand=Samsung" className="block px-5 py-2.5 text-gray-900 hover:text-indigo-700 hover:bg-indigo-50/50 transition-all duration-200 font-medium text-sm">Samsung</Link>
                <Link to="/category/Mobiles?brand=Google Pixel" className="block px-5 py-2.5 text-gray-900 hover:text-indigo-700 hover:bg-indigo-50/50 transition-all duration-200 font-medium text-sm">Google Pixel</Link>
                <Link to="/category/Mobiles?brand=OnePlus" className="block px-5 py-2.5 text-gray-900 hover:text-indigo-700 hover:bg-indigo-50/50 transition-all duration-200 font-medium text-sm">OnePlus</Link>
                <Link to="/category/Mobiles?brand=Xiaomi" className="block px-5 py-2.5 text-gray-900 hover:text-indigo-700 hover:bg-indigo-50/50 transition-all duration-200 font-medium text-sm">Xiaomi</Link>
                <Link to="/category/Mobiles?brand=iQOO" className="block px-5 py-2.5 text-gray-900 hover:text-indigo-700 hover:bg-indigo-50/50 transition-all duration-200 font-medium text-sm">iQOO</Link>
              </div>
            </div>

            {/* TV Category */}
            <div className="relative group">
              <button 
                className="
                  relative text-gray-900 font-medium text-sm tracking-wide 
                  hover:text-blue-700 transition-colors duration-300
                "
              >
                Tablets
                <span className="
                  absolute -bottom-1 left-0 h-[2px] w-full 
                  bg-gradient-to-r from-blue-600 to-cyan-600 
                  rounded-full group-hover:w-full group-hover:opacity-100 opacity-0 transition-all duration-400 ease-out
                "></span>
              </button>
              <div className="
                absolute left-0 mt-2 w-40 bg-white/95 backdrop-blur-xl 
                rounded-2xl shadow-2xl border border-white/30 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-200 py-3 z-50
              ">
                <Link to="/category/Tablets?brand=Apple" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">Apple iPad</Link>
                <Link to="/category/Tablets?brand=Samsung" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">Samsung Tab</Link>
                <Link to="/category/Tablets?brand=OnePlus" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">OnePlus Pad</Link>
                <Link to="/category/Tablets?brand=Lenovo" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">Lenovo</Link>
              </div>
            </div>

            {/* Audio Category - Earbuds & Headsets */}
            <div className="relative group">
              <button 
                className="
                  relative text-gray-900 font-medium text-sm tracking-wide 
                  hover:text-blue-700 transition-colors duration-300
                "
              >
                Audio
                <span className="
                  absolute -bottom-1 left-0 h-[2px] w-full 
                  bg-gradient-to-r from-blue-600 to-cyan-600 
                  rounded-full group-hover:w-full group-hover:opacity-100 opacity-0 transition-all duration-400 ease-out
                "></span>
              </button>
              <div className="
                absolute left-0 mt-2 w-40 bg-white/95 backdrop-blur-xl 
                rounded-2xl shadow-2xl border border-white/30 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-200 py-3 z-50
              ">
                <div className="px-5 py-2 text-xs font-semibold text-gray-700 uppercase">Earbuds</div>
                <Link to="/category/Audio?brand=Apple" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">Apple AirPods</Link>
                <Link to="/category/Audio?brand=Samsung" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">Samsung Galaxy</Link>
                <Link to="/category/Audio?brand=Sony" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">Sony WF</Link>
                <Link to="/category/Audio?brand=Boat" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">Boult Audio</Link>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="px-5 py-2 text-xs font-semibold text-gray-700 uppercase">Headsets</div>
                <Link to="/category/Audio?brand=Sony" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">Sony</Link>
                <Link to="/category/Audio?brand=JBL" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">JBL</Link>
                <Link to="/category/Audio?brand=Beats" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">Beats</Link>
                <Link to="/category/Audio?brand=Sennheiser" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">Sennheiser</Link>
              </div>
            </div>

            {/* Phone Case Category */}
            <div className="relative group">
              <button 
                className="
                  relative text-gray-900 font-medium text-sm tracking-wide 
                  hover:text-blue-700 transition-colors duration-300
                "
              >
                Phone Case
                <span className="
                  absolute -bottom-1 left-0 h-[2px] w-full 
                  bg-gradient-to-r from-blue-600 to-cyan-600 
                  rounded-full group-hover:w-full group-hover:opacity-100 opacity-0 transition-all duration-400 ease-out
                "></span>
              </button>
              <div className="
                absolute left-0 mt-2 w-40 bg-white/95 backdrop-blur-xl 
                rounded-2xl shadow-2xl border border-white/30 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-200 py-3 z-50
              ">
                <Link to="/category/Phone Case?brand=Spigen" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">Protective Cases</Link>
                <Link to="/category/Phone Case?brand=OtterBox" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">Screen Guards</Link>
              </div>
            </div>

            {/* Accessories Category */}
            <div className="relative group">
              <button 
                className="
                  relative text-gray-900 font-medium text-sm tracking-wide 
                  hover:text-blue-700 transition-colors duration-300
                "
              >
                Accessories
                <span className="
                  absolute -bottom-1 left-0 h-[2px] w-full 
                  bg-gradient-to-r from-blue-600 to-cyan-600 
                  rounded-full group-hover:w-full group-hover:opacity-100 opacity-0 transition-all duration-400 ease-out
                "></span>
              </button>
              <div className="
                absolute left-0 mt-2 w-40 bg-white/95 backdrop-blur-xl 
                rounded-2xl shadow-2xl border border-white/30 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-200 py-3 z-50
              ">
                <Link to="/category/Accessories?type=Chargers" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">Chargers</Link>
                <Link to="/category/Accessories?type=Power Banks" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">Power Banks</Link>
                <Link to="/category/Accessories?type=Cables & Adapters" className="block px-5 py-2.5 text-gray-900 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 font-medium text-sm">Cables & Adapters</Link>
              </div>
            </div>
          </div>

          {/* Right side - Auth & Cart */}
          <div className="flex items-center gap-6">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-3 text-gray-800 hover:text-indigo-700 transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Open search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </button>
            <Link 
              to="/cart" 
              className="
                relative p-3 text-gray-800 hover:text-indigo-700 
                transition-all duration-300 hover:scale-110 active:scale-95
              "
              aria-label="View cart"
            >
              <svg className="w-7 h-7 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="
                  absolute -top-0.5 -right-0.5 bg-gradient-to-br from-red-500 to-rose-600 
                  text-white text-xs font-bold rounded-full min-w-[20px] h-5 
                  flex items-center justify-center px-1.5 shadow-md ring-2 ring-white/80
                ">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <UserDropdown user={user} logoutUser={logoutUser} />
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className="
                    px-5 py-2.5 text-sm font-medium text-gray-800 
                    hover:text-gray-900 bg-white/40 hover:bg-white/60 
                    border border-gray-300/50 rounded-full 
                    transition-all duration-300 hover:shadow-md backdrop-blur-sm
                  "
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="
                    px-6 py-2.5 text-sm font-semibold text-white 
                    bg-gradient-to-r from-indigo-600 to-purple-600 
                    hover:from-indigo-700 hover:to-purple-700 
                    border border-indigo-200/30 rounded-full shadow-xl 
                    hover:shadow-2xl transition-all duration-300 active:scale-95 backdrop-blur-sm
                  "
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
    {/* Search overlay rendered at top-level of Navbar component */}
    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

// UserDropdown subcomponent
function UserDropdown({ user, logoutUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="
          w-9 h-9 bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-500 
          rounded-xl flex items-center justify-center 
          shadow-lg group-hover:shadow-2xl group-hover:scale-105 
          transition-all duration-400 backdrop-blur-sm bg-opacity-90
        ">
          <span className="text-white font-black text-xl tracking-tight drop-shadow-lg">{(user.name || 'U')[0]}</span>
        </div>
        <span className="hidden sm:inline text-sm font-semibold text-gray-900 tracking-wide">{user.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 py-3 z-50">
          <Link to="/profile" className="block px-5 py-3 hover:bg-gray-50">
            <div className="font-medium text-gray-800">My Profile</div>
            <div className="text-xs text-gray-500">Edit your basic details</div>
          </Link>

          <Link to="/addresses" className="block px-5 py-3 hover:bg-gray-50">
            <div className="font-medium text-gray-800">My Address</div>
            <div className="text-xs text-gray-500">Manage and edit your saved addresses</div>
          </Link>

              <Link to="/orders" className="block px-5 py-3 hover:bg-gray-50">
                <div className="font-medium text-gray-800">My Orders</div>
                <div className="text-xs text-gray-500">View, track and manage your orders</div>
              </Link>

          <Link to="/wishlist" className="block px-5 py-3 hover:bg-gray-50">
            <div className="font-medium text-gray-800">My Wishlist</div>
            <div className="text-xs text-gray-500">View and edit your favourite products</div>
          </Link>

          <div className="mt-2 border-t border-gray-100" />
          <button
            onClick={() => { setOpen(false); logoutUser(); }}
            className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
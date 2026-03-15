import React, { useEffect, useRef, useState, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

/**
 * SearchOverlay Component - Dark Amber Theme
 * Premium search experience with live results, trending searches, and quick explore links
 */
const SearchOverlay = memo(function SearchOverlay({ open, onClose }) {
  const [visible, setVisible] = useState(false);
  const backdropRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const productsCache = useRef(null);

  // Call the search hook
  useProductSearch(query, open, productsCache, setResults, setLoadingResults);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      setVisible(false);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!open) return null;

  const exploreLinks = [
    { label: 'Top Deals', to: '/category/Mobiles' },
    { label: 'New Arrivals', to: '/category/Mobiles' },
    { label: 'Best Sellers', to: '/category/Accessories' },
    { label: 'Premium Brands', to: '/category/Tablets' },
  ];

  const trendingSearches = [
    'iPhone 17',
    'AirPods Pro',
    'Galaxy S25',
    'Pixel 9 Pro',
    'iPad Pro',
  ];

  const handleTrendingClick = (term) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      className={`fixed inset-0 z-50 flex items-start justify-center transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Dark semi-transparent backdrop at 70% opacity */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Centered modal panel - max-width 680px, positioned ~80px from top */}
      <div className="relative z-50 mt-20 w-full px-4 max-w-[680px]">
        {/* Modal panel - floating card with dark surface and subtle amber border */}
        <div className="bg-[#1a1a1a] border border-voltify-gold/30 rounded-2xl p-6 shadow-2xl">
          {/* Close button - Minimal X, no circle border */}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="absolute -right-4 -top-4 z-50 p-2 text-voltify-light/60 hover:text-voltify-light transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-6">
            {/* Search Bar */}
            <label className="relative block group">
              <span className="sr-only">Search</span>
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-voltify-light/50 group-focus-within:text-voltify-gold transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border-2 border-voltify-border bg-[#1e1e1e] py-4 pl-12 pr-5 text-lg sm:text-xl text-voltify-light placeholder-white/60 focus:outline-none focus:border-voltify-gold focus:ring-0 transition-colors"
                placeholder="Search for phones, accessories, brands and more..."
                aria-label="Search"
              />
            </label>

            {/* Live Results Section */}
            {(query.trim() || loadingResults) && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loadingResults ? (
                  <div className="py-12 text-center">
                    <div className="inline-block">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-voltify-gold"></div>
                    </div>
                    <p className="text-voltify-light/60 mt-2 text-sm">Searching...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-2">
                    {results.map((r) => (
                      <button
                        key={r._id}
                        onClick={() => { onClose(); navigate(`/product/${r._id}`); }}
                        className="w-full text-left px-3 py-3 hover:bg-voltify-dark/40 flex items-center gap-3 rounded-lg transition-colors group"
                      >
                        <img 
                          src={r.image} 
                          alt={`${r.brand || 'Product'} ${r.name} ${r.color || ''} - Buy on Voltify`}
                          width={48}
                          height={48}
                          loading="lazy"
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          onError={(e)=>{e.target.src='https://via.placeholder.com/60'}} 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-normal text-sm text-voltify-light truncate">{r.name}</div>
                          <div className="text-xs text-voltify-light/50">{r.brand || r.category}</div>
                        </div>
                        <div className="text-sm font-semibold text-voltify-gold whitespace-nowrap">₹{r.price?.toLocaleString('en-IN')}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-voltify-light/60">No results for "{query}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Trending Searches & Explore */}
            {!query && (
              <div className="space-y-6">
                {/* Trending Searches */}
                <div>
                  <p className="text-xs font-bold text-voltify-gold uppercase tracking-widest mb-3">Trending Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleTrendingClick(term)}
                        className="text-sm text-voltify-gold hover:text-yellow-300 transition-colors font-normal"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Explore Section */}
                <div>
                  <p className="text-xs font-bold text-voltify-gold uppercase tracking-widest mb-3">EXPLORE</p>
                  <div className="flex flex-wrap gap-2">
                    {exploreLinks.map((link) => (
                      <Link
                        key={link.label}
                        to={link.to}
                        onClick={onClose}
                        className="px-3 py-1.5 rounded-full bg-voltify-dark/30 border border-voltify-gold/20 text-voltify-light text-xs font-normal hover:bg-voltify-dark/50 hover:border-voltify-gold/50 hover:text-voltify-gold transition-all"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

SearchOverlay.displayName = 'SearchOverlay';

export default SearchOverlay;

// Fetch & filter logic
function useProductSearch(query, open, productsCache, setResults, setLoadingResults) {
  useEffect(() => {
    let cancelled = false;
    
    async function ensureProducts() {
      if (!productsCache.current) {
        try {
          console.log('Fetching products for search...');
          const res = await api.get('/products');
          productsCache.current = res.data || [];
          console.log('✓ Products loaded:', productsCache.current.length);
        } catch (err) {
          console.error('❌ Error fetching products:', err.message);
          productsCache.current = [];
        }
      }
    }

    async function doSearch() {
      setLoadingResults(true);
      try {
        await ensureProducts();
        
        if (cancelled) return;
        
        const q = query.trim().toLowerCase();
        if (!q) {
          setResults([]);
          setLoadingResults(false);
          return;
        }
        
        console.log('Searching for:', q);
        
        const matches = productsCache.current.filter(p => (
          (p.name || '').toLowerCase().includes(q) ||
          (p.brand || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
        )).slice(0, 10);
        
        console.log('Found matches:', matches.length);
        setResults(matches);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoadingResults(false);
      }
    }

    if (open) {
      const id = setTimeout(() => {
        doSearch();
      }, 220);

      return () => { 
        cancelled = true; 
        clearTimeout(id); 
      };
    }
  }, [query, open, setResults, setLoadingResults]);
}

import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function SearchOverlay({ open, onClose }) {
  const [visible, setVisible] = useState(false);
  const backdropRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const productsCache = useRef(null);
  const debounceRef = useRef(null);

  // Call the search hook
  useProductSearch(query, open, productsCache, setResults, setLoadingResults);

  useEffect(() => {
    if (open) {
      // small delay to trigger fade-in
      requestAnimationFrame(() => setVisible(true));
      // focus input after render
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      setVisible(false);
      document.body.style.overflow = '';
    }

    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!open) return null;

  const quickLinks = [
    { label: 'Top Deals', to: '/category/Mobiles' },
    { label: 'New Arrivals', to: '/category/Mobiles' },
    { label: 'Best Sellers', to: '/category/Accessories' },
    { label: 'Offers', to: '/offers' },
    { label: 'Help Center', to: '/help' },
  ];

  return (
    <div
      ref={backdropRef}
      onMouseDown={(e) => { if (e.target === backdropRef.current) onClose(); }}
      className={`fixed left-0 right-0 top-16 bottom-0 z-50 flex items-start justify-center p-6 sm:p-12 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* backdrop covers area below navbar only */}
      <div className="absolute inset-0 bg-gray-100/95 backdrop-blur-sm" />

      <button
        onClick={onClose}
        aria-label="Close search"
        className="absolute right-6 top-6 sm:right-12 sm:top-12 z-50 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow text-gray-700 hover:bg-gray-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative z-50 w-full max-w-3xl">
        <div className="px-4 sm:px-6">
          <div className="mx-auto w-full">
            <label className="relative block">
              <span className="sr-only">Search</span>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-full border border-white/30 bg-white/40 backdrop-blur-md py-4 pl-12 pr-6 text-lg sm:text-xl placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search for phones, accessories, brands and more..."
                aria-label="Search"
              />
            </label>

            {/* Live results */}
            <div className="mt-4">
              <div className="bg-white/40 backdrop-blur-sm border border-white/20 rounded-lg shadow-sm">
                {loadingResults ? (
                  <div className="p-6 text-center">Searching...</div>
                ) : results.length > 0 ? (
                  <div className="divide-y divide-white/30">
                    {results.map((r) => (
                      <button
                        key={r._id}
                        onClick={() => { onClose(); navigate(`/product/${r._id}`); }}
                        className="w-full text-left px-4 py-3 hover:bg-white/30 flex items-center gap-4"
                      >
                        <img src={r.image} alt={r.name} className="w-12 h-12 object-cover rounded" onError={(e)=>{e.target.src='https://via.placeholder.com/80'}} />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{r.name}</div>
                          <div className="text-sm text-gray-600">{r.brand || r.category}</div>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">₹{r.price?.toLocaleString('en-IN')}</div>
                      </button>
                    ))}
                  </div>
                ) : query.trim() !== '' ? (
                  <div className="p-6 text-center text-gray-600">No results for "{query}"</div>
                ) : null}
              </div>
            </div>

            <div className="mt-6 bg-transparent">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Quick Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {quickLinks.map((q) => (
                  <Link
                    key={q.label}
                    to={q.to}
                    onClick={onClose}
                    className="block rounded-lg px-4 py-3 bg-white border border-gray-100 shadow-sm hover:shadow-md text-sm text-gray-700"
                  >
                    {q.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// fetch + filter logic
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

    // debounce - only search if overlay is open
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

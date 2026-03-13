import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('wishlist');
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(parsed);
    } catch (err) {
      console.error(err);
      setItems([]);
    }
  }, []);

  const handleRemove = (idx) => {
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    localStorage.setItem('wishlist', JSON.stringify(next));
  };

  return (
    <div className="min-h-screen bg-voltify-dark py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.h1 
          className="text-4xl font-display font-bold text-voltify-light mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          My Wishlist
        </motion.h1>

        {items.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg text-voltify-light/60 mb-8">Your wishlist is empty.</p>
            <motion.div 
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <a href="/" className="px-8 py-3 bg-voltify-gold text-voltify-dark font-bold rounded-lg hover:bg-yellow-500 transition">Browse Products</a>
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {items.map((p, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-[#1f1c19] p-6 rounded-2xl border border-voltify-border/20 hover:border-voltify-gold/40 transition duration-300 flex items-center gap-6"
                >
                  <img src={p.image || '/images/products/placeholder.png'} alt={p.name} className="w-24 h-24 object-cover rounded-xl shadow-md" />
                  <div className="flex-grow">
                    <Link to={`/product/${p._id}`} className="font-semibold text-voltify-light hover:text-voltify-gold transition text-lg">{p.name}</Link>
                    <div className="text-voltify-light/60 mt-2">₹{p.price?.toLocaleString('en-IN') || '—'}</div>
                  </div>
                  <motion.button 
                    onClick={() => handleRemove(idx)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="px-4 py-2 text-red-400 hover:bg-red-950/20 rounded-lg font-semibold transition duration-300"
                  >
                    Remove
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

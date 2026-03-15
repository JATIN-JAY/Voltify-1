

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product, index }) {
  const { addToCart, cartItems, updateQuantity, removeFromCart, user } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const existingItem = cartItems.find((item) => item._id === product._id);

  // Check if product is in wishlist on mount
  useEffect(() => {
    if (user) {
      checkWishlist();
    }
  }, [user, product._id]);

  const checkWishlist = async () => {
    try {
      const response = await api.get('/auth/wishlist');
      const isInWishlist = response.data.wishlist.some((item) => item._id === product._id);
      setInWishlist(isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }

    setLoading(true);
    try {
      if (inWishlist) {
        await api.delete(`/auth/wishlist/${product._id}`);
        setInWishlist(false);
      } else {
        await api.post(`/auth/wishlist/${product._id}`);
        setInWishlist(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  const handleDecrease = () => {
    if (!existingItem) return;
    const newQty = existingItem.quantity - 1;
    if (newQty <= 0) {
      removeFromCart(product._id);
    } else {
      updateQuantity(product._id, newQty);
    }
  };

  const handleIncrease = () => {
    if (!existingItem) {
      addToCart(product);
      return;
    }
    updateQuantity(product._id, existingItem.quantity + 1);
  };

  const sellingPrice = Math.round(Number(product?.price ?? 0));
  const originalPrice = Math.round(Number(product?.originalPrice ?? product?.mrp ?? sellingPrice));
  const hasDiscount = originalPrice > sellingPrice && sellingPrice > 0;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100) : 0;

  // Extract model name and color variant from product name
  const getModelAndVariant = () => {
    const name = product.name || '';
    // Remove brand name and get model (e.g., "Samsung Galaxy A55 5G" → "Galaxy A55 5G")
    const brands = ['Samsung', 'Apple', 'OnePlus', 'Google', 'Xiaomi', 'Motorola', 'Realme', 'iQOO', 'OPPO', 'Vivo'];
    let modelName = name;
    for (const brand of brands) {
      if (name.startsWith(brand)) {
        modelName = name.substring(brand.length).trim();
        break;
      }
    }
    // Extract color if available (usually in parentheses)
    const colorMatch = name.match(/\((.*?)\)/);
    const color = colorMatch ? colorMatch[1].split(',')[0].trim() : 'Onyx';
    return { modelName, color };
  };

  const { modelName, color } = getModelAndVariant();
  const rating = product.rating || 4.8;
  const reviewCount = product.reviewCount || 214;



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-voltify-border bg-voltify-dark/80 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-voltify-gold/60 hover:shadow-voltify-gold/10 w-full"
    >
      <Link to={`/product/${product._id}`} className="relative overflow-hidden aspect-square block w-full">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 max-w-full"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Product';
          }}
        />
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
            {discountPercent}% OFF
          </span>
        )}
        {/* Wishlist Button - Subtle */}
        <button
          onClick={handleWishlistToggle}
          disabled={loading}
          className="absolute right-3 top-3 rounded-full p-2 transition-all duration-200 disabled:opacity-50 hover:scale-110"
          aria-label="Add to wishlist"
        >
          <svg
            className={`h-5 w-5 transition-all duration-200 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-voltify-light/40 hover:text-voltify-light/70'}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </Link>

      <div className="flex flex-grow flex-col p-4 space-y-3">
        {/* Title - Editorial */}
        <Link to={`/product/${product._id}`} className="block">
          <h3 className="text-sm font-semibold text-voltify-light leading-tight">
            {modelName}
          </h3>
        </Link>

        {/* Color Variant Tag */}
        <span className="text-xs text-voltify-light/50 font-medium">
          {color}
        </span>

        {/* Rating Line */}
        <div className="text-xs text-voltify-light/60">
          ★ {rating} · {reviewCount.toLocaleString()} reviews
        </div>

        <div className="flex-grow" />

        {/* Price - Premium */}
        <div>
          <p className="text-lg font-bold text-voltify-gold">
            ₹{sellingPrice.toLocaleString('en-IN')}
          </p>
          {hasDiscount && (
            <p className="text-xs font-medium text-emerald-500 mt-0.5">
              Save {discountPercent}%
            </p>
          )}
        </div>

        {/* CTA - Small Icon Button */}
        <div className="flex items-center justify-between pt-1">
          <div />
          {existingItem ? (
            <div className="flex items-center gap-2 bg-voltify-border/50 rounded-full px-2 py-1">
              <button
                onClick={handleDecrease}
                className="text-voltify-gold hover:text-voltify-gold/70 transition-colors p-1"
              >
                −
              </button>
              <span className="text-xs font-bold text-voltify-gold w-6 text-center">
                {existingItem.quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="text-voltify-gold hover:text-voltify-gold/70 transition-colors p-1"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`rounded-full p-2.5 transition-all duration-300 active:scale-95 ${
                isAdded
                  ? 'bg-emerald-600/20 text-emerald-400'
                  : 'bg-voltify-gold/10 text-voltify-gold hover:bg-voltify-gold/20 border border-voltify-gold/40 hover:border-voltify-gold/60'
              }`}
              title="Add to cart"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-voltify-gold"></div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-voltify-light/60">No products available yet.</p>
      </div>
    );
  }

  return (
    <section id="products" className="bg-voltify-dark px-4 py-14 sm:px-6 sm:py-16 lg:px-0 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-left">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-voltify-light/50">Explore catalogue</p>
          <h2 className="mb-2 text-3xl font-bold text-voltify-light sm:text-4xl">Top Deals For You</h2>
          <p className="max-w-2xl text-voltify-light/60">Handpicked products with transparent pricing and fast fulfillment</p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

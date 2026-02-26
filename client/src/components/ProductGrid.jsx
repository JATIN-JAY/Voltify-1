

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product, index }) {
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState(false);

  const existingItem = cartItems.find((item) => item._id === product._id);

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

  const sellingPrice = Number(product?.price ?? 0);
  const originalPrice = Number(product?.originalPrice ?? product?.mrp ?? sellingPrice);
  const hasDiscount = originalPrice > sellingPrice && sellingPrice > 0;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100) : 0;
  const ratingValue = Number(product?.rating ?? 0);
  const reviewCount = Number(product?.reviewCount ?? product?.numReviews ?? 0);

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, starIndex) => {
      const active = ratingValue >= starIndex + 1;
      return (
        <svg
          key={`${product._id}-star-${starIndex}`}
          className={`h-4 w-4 ${active ? 'text-amber-400' : 'text-slate-300'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.036 3.189a1 1 0 00.95.69h3.352c.969 0 1.371 1.24.588 1.81l-2.712 1.97a1 1 0 00-.364 1.118l1.036 3.19c.3.921-.755 1.688-1.539 1.118l-2.711-1.97a1 1 0 00-1.176 0l-2.711 1.97c-.784.57-1.838-.197-1.539-1.118l1.036-3.19a1 1 0 00-.364-1.118L2.123 8.616c-.783-.57-.38-1.81.588-1.81h3.352a1 1 0 00.95-.69l1.036-3.189z" />
        </svg>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-xl"
    >
      <Link to={`/product/${product._id}`} className="relative overflow-hidden aspect-square block">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Product';
          }}
        />
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
            {discountPercent}% OFF
          </span>
        )}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-between rounded-lg bg-black/45 px-3 py-2 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="text-xs font-medium text-white/90">View details</span>
          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </div>
      </Link>

      <div className="flex flex-grow flex-col space-y-3.5 p-5">
        <Link to={`/product/${product._id}`} className="block">
          <h3 className="line-clamp-2 text-base font-semibold text-slate-900 transition-colors group-hover:text-blue-700">
            {product.name}
          </h3>
        </Link>

        <p className="line-clamp-2 flex-grow text-sm text-slate-600">
          {product.description}
        </p>

        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
          {renderStars()}
          <span className="text-xs font-medium text-slate-600">
            {ratingValue > 0 ? ratingValue.toFixed(1) : '0.0'} ({reviewCount})
          </span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-2xl font-extrabold text-slate-900">
              ₹{sellingPrice.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-500">
              MRP{' '}
              <span className="line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            </p>
          </div>
          {hasDiscount && <span className="text-xs font-semibold text-emerald-600">Save ₹{(originalPrice - sellingPrice).toLocaleString('en-IN')}</span>}
        </div>

        {existingItem ? (
          <div className="flex w-full items-center justify-between gap-2 rounded-xl bg-slate-900 p-1 shadow-sm">
            <button
              onClick={handleDecrease}
              className="flex-1 rounded-lg bg-white/15 px-4 py-2.5 text-lg font-bold text-white transition-colors duration-200 hover:bg-white/25"
            >
              −
            </button>
            <div className="flex-1 rounded-lg bg-white/15 px-4 py-2.5 text-center text-lg font-bold text-white">
              {existingItem.quantity}
            </div>
            <button
              onClick={handleIncrease}
              className="flex-1 rounded-lg bg-white/15 px-4 py-2.5 text-lg font-bold text-white transition-colors duration-200 hover:bg-white/25"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`w-full rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.99] ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
            }`}
          >
            {isAdded ? '✓ Added' : 'Add to Cart'}
          </button>
        )}
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">No products available yet.</p>
      </div>
    );
  }

  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mb-10 text-left lg:ml-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Explore catalogue</p>
        <h2 className="mb-2 text-3xl font-bold text-slate-900 sm:text-4xl">Top Deals For You</h2>
        <p className="max-w-2xl text-slate-600">Handpicked products with transparent pricing and fast fulfillment</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}

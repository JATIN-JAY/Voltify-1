

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';

/**
 * Generate product URL based on category and slug
 * Falls back to ID-based URL for backward compatibility
 */
function getProductUrl(product) {
  if (!product) return '/';
  
  // If product has a slug, use the new category-based slug URL
  if (product.slug && product.category) {
    const categorySlug = product.category.toLowerCase().replace(/\s+/g, '-');
    return `/${categorySlug}/${product.slug}`;
  }
  
  // Fallback to old ID-based URL for backward compatibility
  return `/product/${product._id}`;
}

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
  const productUrl = getProductUrl(product);
  
  // Generate SEO-optimized alt text: "{brand} {productName} {color} - Buy on Voltify"
  const altText = `${product.brand} ${product.name} ${product.color || color} - Buy on Voltify`;
  
  // Determine if image should be lazy loaded
  // Only the first 8 products (initial viewport) should NOT be lazy loaded
  const shouldLazyLoad = index >= 8;



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-voltify-light/10 bg-voltify-dark/80 shadow-sm transition-all duration-300 hover:shadow-2xl hover:border-voltify-gold/40 hover:shadow-voltify-gold/15 hover:bg-voltify-dark/90 w-full"
    >
      {/* Product Image Container */}
      <Link to={productUrl} className="relative overflow-hidden aspect-square block w-full bg-voltify-dark/50">
        <img
          src={product.image}
          alt={altText}
          width={400}
          height={400}
          loading={shouldLazyLoad ? 'lazy' : 'eager'}
          className="h-full w-full object-contain mix-blend-mode: screen transition-transform duration-500 ease-out group-hover:scale-105 max-w-full"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Product';
          }}
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute left-3 top-3 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
            {discountPercent}% OFF
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={loading}
          className="absolute right-3 top-3 rounded-full p-2.5 bg-voltify-dark/60 backdrop-blur-sm transition-all duration-200 disabled:opacity-50 hover:scale-110 hover:bg-voltify-dark/80"
          aria-label="Add to wishlist"
        >
          <svg
            className={`h-5 w-5 transition-all duration-200 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-voltify-light/60 hover:text-red-500'}`}
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

      {/* Card Content */}
      <div className="flex flex-grow flex-col p-4 sm:p-5 space-y-2.5 sm:space-y-3">
        {/* Product Name */}
        <Link to={productUrl} className="block group/title">
          <h3 className="text-sm sm:text-base font-semibold text-voltify-light leading-snug group-hover/title:text-voltify-gold transition-colors line-clamp-2">
            {modelName}
          </h3>
        </Link>

        {/* Color/Variant */}
        <p className="text-xs sm:text-xs text-voltify-light/50 font-medium">
          {color}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 text-xs text-voltify-light/60">
          <span>★</span>
          <span>{rating}</span>
          <span>·</span>
          <span>{reviewCount.toLocaleString()}</span>
        </div>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Price */}
        <div>
          <p className="text-lg sm:text-xl font-bold text-voltify-gold">
            ₹{sellingPrice.toLocaleString('en-IN')}
          </p>
          {hasDiscount && (
            <p className="text-xs text-voltify-light/40 line-through mt-1">
              ₹{originalPrice.toLocaleString('en-IN')}
            </p>
          )}
        </div>
      </div>

      {/* Floating Add to Cart Button - Bottom Right */}
      <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5">
        {existingItem ? (
          <div className="flex items-center gap-2 bg-voltify-dark/80 backdrop-blur-sm border border-voltify-gold/40 rounded-full px-3 py-2">
            <button
              onClick={handleDecrease}
              className="text-voltify-gold hover:text-voltify-gold/70 transition-colors text-sm font-bold"
              title="Decrease quantity"
            >
              −
            </button>
            <span className="text-xs font-bold text-voltify-gold w-5 text-center">
              {existingItem.quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="text-voltify-gold hover:text-voltify-gold/70 transition-colors text-sm font-bold"
              title="Increase quantity"
            >
              +
            </button>
          </div>
        ) : (
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-lg ${
              isAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-voltify-gold text-voltify-dark hover:shadow-xl hover:bg-yellow-400'
            }`}
            title="Add to cart"
          >
            {isAdded ? (
              <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </motion.button>
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

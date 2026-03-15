import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductGrid';

/**
 * Custom hook for fetching product data in parallel
 * Implements async-parallel pattern: independent operations run concurrently
 * Reduces total load time by running product fetch and suggested products fetch in parallel
 */
function useProductData(id) {
  const [product, setProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    /**
     * Parallel data fetching pattern (CRITICAL optimization)
     * Both fetchProduct and fetchSuggestedProducts start immediately
     * instead of waiting for one to finish before the other starts
     */
    const loadProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Start both requests immediately (no await yet)
        const productPromise = api.get(`/products/${id}`);
        const suggestedPromise = api.get('/products');

        // Use Promise.all to wait for both in parallel (2× faster than sequential)
        const [productRes, suggestedRes] = await Promise.all([
          productPromise,
          suggestedPromise
        ]);

        setProduct(productRes.data);

        // Filter out current product and get up to 4 random products
        const filtered = suggestedRes.data.filter(p => p._id !== id);
        const suggested = filtered.sort(() => Math.random() - 0.5).slice(0, 4);
        setSuggestedProducts(suggested);
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError(err.message || 'Failed to load product');
        setProduct(null);
        setSuggestedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [id]);

  return { product, suggestedProducts, loading, error };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useContext(CartContext);

  // Use custom hook for optimized data fetching
  const { product, suggestedProducts, loading, error } = useProductData(id);

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Space Black');
  const [selectedStorage, setSelectedStorage] = useState('512GB');
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [pincode, setPincode] = useState('');
  const [pincodeValid, setPincodeValid] = useState(null);

  const cartItem = cartItems.find((item) => item._id === id);

  // Sync quantity with cart item
  useEffect(() => {
    window.scrollTo(0, 0);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItem, id]);

  /**
   * Memoized callback to prevent re-renders in child components
   * Updates cart with new quantity
   */
  const syncCartWithQuantity = useCallback(
    (nextQuantity) => {
      if (!product) return;

      if (cartItem) {
        updateQuantity(product._id, nextQuantity);
        return;
      }

      for (let i = 0; i < nextQuantity; i++) {
        addToCart(product);
      }
    },
    [product, cartItem, addToCart, updateQuantity]
  );

  /**
   * Memoized handlers to prevent unnecessary re-renders
   * These callbacks only update when syncCartWithQuantity changes
   */
  const handleIncrementQuantity = useCallback(() => {
    setQuantity(prev => {
      const nextQuantity = prev + 1;
      syncCartWithQuantity(nextQuantity);
      return nextQuantity;
    });
  }, [syncCartWithQuantity]);

  const handleDecrementQuantity = useCallback(() => {
    setQuantity(prev => {
      const nextQuantity = Math.max(1, prev - 1);
      syncCartWithQuantity(nextQuantity);
      return nextQuantity;
    });
  }, [syncCartWithQuantity]);

  const handleAddToCart = useCallback(() => {
    syncCartWithQuantity(quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }, [quantity, syncCartWithQuantity]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart();
    navigate('/cart');
  }, [handleAddToCart, navigate]);

  const handlePincodeCheck = () => {
    // Mock validation - in production, call actual API
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeValid(true);
    } else {
      setPincodeValid(false);
    }
  };

  // Mock thumbnail images (in production, these would come from product data)
  const thumbnailImages = [
    product?.image,
    'https://via.placeholder.com/600x600?text=View+2',
    'https://via.placeholder.com/600x600?text=View+3',
    'https://via.placeholder.com/600x600?text=View+4'
  ];

  // EMI calculation (mock - 12 months at 0% interest)
  const emiAmount = product ? Math.round(Number(product.price) / 12) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-display font-bold text-voltify-light mb-6">Product Not Found</h1>
          <p className="text-voltify-light/60 mb-8">Sorry, we couldn't find the product you're looking for.</p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-voltify-gold text-voltify-dark font-semibold rounded-full hover:shadow-lg transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-voltify-dark pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div 
          className="mb-8 flex items-center gap-2 text-xs text-voltify-light/50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/" className="hover:text-voltify-gold transition font-semibold">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-voltify-gold transition font-semibold">{product.category}</Link>
          <span>/</span>
          <span className="text-voltify-light font-medium">{product.name}</span>
        </motion.div>

        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Product Image Gallery - Sticky Left Column */}
          <motion.div 
            className="flex flex-col items-start justify-start sticky top-20 h-fit gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Main Image */}
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl bg-voltify-dark/50">
              <img
                src={thumbnailImages[mainImageIndex] || product?.image}
                alt={product?.name}
                className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x600?text=Product+Image';
                }}
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3 w-full">
              {thumbnailImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImageIndex(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    mainImageIndex === idx
                      ? 'border-voltify-gold shadow-lg'
                      : 'border-voltify-light/20 hover:border-voltify-light/40'
                  }`}
                >
                  <img
                    src={img || 'https://via.placeholder.com/100x100'}
                    alt={`View ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100';
                    }}
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            className="flex flex-col justify-start space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div>
              <p className="text-xs font-semibold text-voltify-light/50 mb-3 uppercase tracking-wider">{product.category}</p>
              <h1 className="text-2xl font-display font-semibold text-voltify-light mb-2">
                {product.name}
              </h1>
              <p className="text-xs text-voltify-light/60 mb-5">512GB · Desert Titanium</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-voltify-gold fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-voltify-light/50 font-medium">4.8 · 124 Reviews</span>
              </div>

              <div className="text-3xl font-bold text-voltify-gold mb-2">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </div>
              
              <p className="text-voltify-light/40 text-sm line-through mb-2">
                ₹{(Number(product.price) * 1.2).toLocaleString('en-IN')}
              </p>

              <p className="text-xs text-voltify-gold/70 font-medium mb-6">
                No Cost EMI from ₹{emiAmount.toLocaleString('en-IN')}/month
              </p>

              <div className="inline-block bg-emerald-600/20 text-emerald-400 px-4 py-2 rounded-full font-semibold text-sm mb-6 border border-emerald-500/40">
                ✓ In Stock (12 available)
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-2 py-4 border-y border-voltify-border">
              <div className="flex items-start gap-3">
                <span className="text-voltify-gold font-bold mt-0.5">•</span>
                <p className="text-xs text-voltify-light/70 font-medium">Advanced display technology</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-voltify-gold font-bold mt-0.5">•</span>
                <p className="text-xs text-voltify-light/70 font-medium">Premium build quality</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-voltify-gold font-bold mt-0.5">•</span>
                <p className="text-xs text-voltify-light/70 font-medium">All-day battery life</p>
              </div>
            </div>

            {/* Color Selector */}
            <div className="py-3">
              <p className="text-xs font-semibold text-voltify-light/50 mb-3 uppercase tracking-wide">Colors Available</p>
              <div className="flex items-center gap-3">
                {['Space Black', 'Sierra Blue', 'Desert Titanium', 'White Titanium'].map((color, idx) => {
                  const colorMap = {
                    'Space Black': '#1f2937',
                    'Sierra Blue': '#60a5fa',
                    'Desert Titanium': '#D4A574',
                    'White Titanium': '#f5f5f5'
                  };
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-3 hover:scale-110 transition-all ${
                        selectedColor === color
                          ? 'border-voltify-gold shadow-lg scale-110'
                          : 'border-voltify-light/30 hover:border-voltify-light/60'
                      }`}
                      style={{ backgroundColor: colorMap[color] }}
                      title={color}
                    ></button>
                  );
                })}
              </div>
            </div>

            {/* Storage Selector */}
            <div className="py-3">
              <p className="text-xs font-semibold text-voltify-light/50 mb-3 uppercase tracking-wide">Storage</p>
              <div className="flex items-center gap-3">
                {['128GB', '256GB', '512GB'].map((storage) => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                      selectedStorage === storage
                        ? 'border-voltify-gold bg-voltify-gold/10 text-voltify-gold'
                        : 'border-voltify-light/30 text-voltify-light/70 hover:border-voltify-light/60 hover:text-voltify-light'
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-voltify-light/70 uppercase tracking-wide">Quantity:</span>
                <div className="flex items-center gap-3 bg-voltify-border rounded-full px-4 py-2">
                  <button
                    onClick={handleDecrementQuantity}
                    className="text-voltify-light hover:text-voltify-gold font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold text-voltify-light">{quantity}</span>
                  <button
                    onClick={handleIncrementQuantity}
                    className="text-voltify-light hover:text-voltify-gold font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Key Specs Strip */}
              <div className="grid grid-cols-4 gap-3 py-4 border-y border-voltify-border">
                <div className="flex flex-col items-center gap-2 text-center">
                  <svg className="w-6 h-6 text-voltify-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2c0 .955.682 1.748 1.585 1.938A6.996 6.996 0 0010 13a6.996 6.996 0 005.415-2.062C15.318 10.748 16 9.955 16 9V5a2 2 0 00-2-2H5zm0 2h10v2c0 .476-.268.901-.684 1.109a5.998 5.998 0 01-8.632 0C5.268 8.901 5 8.476 5 8V5z" />
                  </svg>
                  <p className="text-[10px] font-semibold text-voltify-light/70">48MP Camera</p>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <svg className="w-6 h-6 text-voltify-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <p className="text-[10px] font-semibold text-voltify-light/70">6" Display</p>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <svg className="w-6 h-6 text-voltify-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.3 12.98a9.99 9.99 0 0011.4 0M2 12.857V10a8 8 0 1116 0v2.857M16 16H4v-2.857h12v2.857z" />
                  </svg>
                  <p className="text-[10px] font-semibold text-voltify-light/70">5000mAh</p>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <svg className="w-6 h-6 text-voltify-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9.88 16.121a1 1 0 011.415 0 .5.5 0 11-.707.707 1 1 0 01-.708-.707z" clipRule="evenodd" />
                  </svg>
                  <p className="text-[10px] font-semibold text-voltify-light/70">5G</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    isAdded
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-voltify-gold text-voltify-dark hover:shadow-2xl hover:bg-yellow-500'
                  }`}
                >
                  {isAdded ? '✓ Added to Cart' : 'Add to Cart'}
                </motion.button>

                <motion.button
                  onClick={handleBuyNow}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-4 border-2 border-voltify-light/30 text-voltify-light rounded-xl font-semibold hover:border-voltify-gold hover:text-voltify-gold hover:bg-voltify-dark/50 transition-all duration-300"
                >
                  Buy Now
                </motion.button>
              </div>
            </div>

            {/* Pincode Delivery Checker */}
            <div className="py-3 border-y border-voltify-border">
              <p className="text-xs font-semibold text-voltify-light/50 mb-3 uppercase tracking-wide">Check Delivery</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                    setPincodeValid(null);
                  }}
                  placeholder="Enter pincode"
                  maxLength="6"
                  className="flex-1 px-4 py-2 rounded-lg bg-voltify-dark/50 border border-voltify-light/20 text-voltify-light placeholder-voltify-light/40 focus:border-voltify-gold focus:outline-none focus:ring-2 focus:ring-voltify-gold/30"
                />
                <button
                  onClick={handlePincodeCheck}
                  className="px-6 py-2 rounded-lg bg-voltify-gold/20 text-voltify-gold border border-voltify-gold/50 font-semibold hover:bg-voltify-gold/30 transition-all"
                >
                  Check
                </button>
              </div>
              {pincodeValid === true && (
                <p className="text-sm text-emerald-400 mt-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Delivery available in this area
                </p>
              )}
              {pincodeValid === false && (
                <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Delivery not available
                </p>
              )}
            </div>
            <div className="bg-voltify-dark/50 rounded-2xl p-6 space-y-3 border border-voltify-border">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-voltify-gold flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-voltify-light">Free Shipping</p>
                  <p className="text-sm text-voltify-light/60">On orders over ₹500</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-voltify-gold flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1V3a1 1 0 011-1h5a1 1 0 011 1v1h1V3a1 1 0 011 1v1h1V3a2 2 0 00-2-2h-3V1a1 1 0 10-2 0v1H7V1a1 1 0 00-1 1v1H5V3a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1 1v1H5V3a1 1 0 00-1-1zm0 5h10v7H5V7z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-voltify-light">30-Day Return</p>
                  <p className="text-sm text-voltify-light/60">No questions asked</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-voltify-gold flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <div>
                  <p className="font-semibold text-voltify-light">24/7 Support</p>
                  <p className="text-sm text-voltify-light/60">Dedicated customer service</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-display font-bold text-voltify-light mb-8">You Might Also Like</h2>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-voltify-gold"></div>
            </div>
          ) : suggestedProducts.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
              {suggestedProducts.map((prod, index) => (
                <motion.div
                  key={prod._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={prod} index={index} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-200 rounded-2xl">
              <p className="text-slate-600">No other products available.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

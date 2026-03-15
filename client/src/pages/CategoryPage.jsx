import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { CartContext } from '../context/CartContext';

function ProductCard({ product }) {
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

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
      <Link to={`/product/${product._id}`} className="relative overflow-hidden aspect-square block">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Product';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Link>

      <div className="p-5 flex flex-col flex-grow space-y-4">
        <Link to={`/product/${product._id}`} className="block">
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-2 hover:underline">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-slate-600 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-extrabold text-slate-900">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="text-sm font-medium text-slate-700">4.8</span>
          </div>
        </div>

        {existingItem ? (
          <div className="w-full flex items-center justify-between gap-2 bg-gradient-to-r from-slate-900 to-slate-800 p-1 rounded-xl shadow-md">
            <button
              onClick={handleDecrease}
              className="flex-1 py-2.5 px-4 bg-white/20 hover:bg-white/30 text-white font-bold text-lg rounded-lg transition-all duration-200"
            >
              −
            </button>
            <div className="flex-1 py-2.5 px-4 bg-white/20 text-white text-center font-bold text-lg rounded-lg">
              {existingItem.quantity}
            </div>
            <button
              onClick={handleIncrease}
              className="flex-1 py-2.5 px-4 bg-white/20 hover:bg-white/30 text-white font-bold text-lg rounded-lg transition-all duration-200"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-base transition-all duration-300 shadow-md ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 hover:shadow-xl hover:scale-[1.02]'
            }`}
          >
            {isAdded ? '✓ Added' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const brand = searchParams.get('brand');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryTitles = {
    Mobiles: 'Mobiles',
    TV: 'Televisions',
    'Phone Covers': 'Phone Covers & Accessories',
    Accessories: 'Accessories',
  };

  useEffect(() => {
    fetchProductsByCategory();
  }, [category, brand]);

  const fetchProductsByCategory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      let filtered = response.data.filter(
        (product) => product.category === category
      );
      
      // Filter by brand if brand query parameter exists
      if (brand) {
        filtered = filtered.filter(
          (product) => product.brand === brand
        );
      }
      
      setProducts(filtered);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 pt-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Header */}
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-display font-bold text-slate-900 mb-4">
            {brand ? `${brand} ${categoryTitles[category] || category}` : (categoryTitles[category] || category)}
          </h1>
          <p className="text-lg text-slate-600">
            {brand 
              ? `Browse ${brand}'s premium collection of ${category.toLowerCase()}` 
              : `Browse our premium collection of ${category.toLowerCase()}`}
          </p>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-slate-600 mb-6">
              No products available in this category yet.
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 btn-primary font-semibold"
            >
              Back to Home
            </a>
          </div>
        ) : (
          <motion.div 
            className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {products.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

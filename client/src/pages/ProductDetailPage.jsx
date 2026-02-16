import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductGrid';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [suggestedLoading, setSuggestedLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
    fetchSuggestedProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedProducts = async () => {
    try {
      setSuggestedLoading(true);
      const response = await api.get('/products');
      // Filter out current product and get up to 4 random products
      const filtered = response.data.filter(p => p._id !== id);
      const suggested = filtered.sort(() => Math.random() - 0.5).slice(0, 4);
      setSuggestedProducts(suggested);
    } catch (err) {
      console.error('Error fetching suggested products:', err);
      setSuggestedProducts([]);
    } finally {
      setSuggestedLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    setQuantity(1);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Product Not Found</h1>
          <p className="text-gray-600 mb-8">Sorry, we couldn't find the product you're looking for.</p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-indigo-600 transition">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-16 overflow-hidden">
          {/* Product Image */}
          <div className="flex items-start justify-center md:sticky md:top-24 overflow-hidden">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:brightness-110 transition-all duration-500"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x600?text=Product+Image';
                }}
              />
              <div className="absolute top-4 left-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full font-semibold text-sm">
                {product.brand}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-start space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 font-medium">(4.8) 124 Reviews</span>
              </div>

              <div className="text-5xl font-extrabold text-gray-900 mb-2">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </div>
              
              <p className="text-gray-500 text-sm line-through mb-6">
                ₹{(Number(product.price) * 1.2).toLocaleString('en-IN')}
              </p>

              <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-semibold text-sm mb-6">
                ✓ In Stock (12 available)
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">About this product</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-200">
              <div>
                <p className="text-gray-600 text-sm mb-1">Brand</p>
                <p className="font-semibold text-gray-900">{product.brand}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Category</p>
                <p className="font-semibold text-gray-900">{product.category}</p>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-semibold">Quantity:</span>
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-600 hover:text-gray-900 font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-gray-600 hover:text-gray-900 font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                    isAdded
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {isAdded ? '✓ Added to Cart' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 border-2 border-indigo-600 text-indigo-600 rounded-full font-semibold text-lg hover:bg-indigo-50 transition-all duration-300"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-indigo-50 rounded-2xl p-6 space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over ₹500</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1V3a1 1 0 011-1h5a1 1 0 011 1v1h1V3a1 1 0 011 1v1h1V3a2 2 0 00-2-2h-3V1a1 1 0 10-2 0v1H7V1a1 1 0 00-1 1v1H5V3a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1 1v1H5V3a1 1 0 00-1-1zm0 5h10v7H5V7z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">30-Day Return</p>
                  <p className="text-sm text-gray-600">No questions asked</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">24/7 Support</p>
                  <p className="text-sm text-gray-600">Dedicated customer service</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
          {suggestedLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : suggestedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedProducts.map((prod, index) => (
                <ProductCard key={prod._id} product={prod} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-gray-600">No other products available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

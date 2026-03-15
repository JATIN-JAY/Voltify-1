import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { getCategorySocialMeta } from '../utils/socialMetaTags';
import { Breadcrumb } from '../components/Breadcrumb';
import { getCategoryBreadcrumbs, generateBreadcrumbSchema } from '../utils/breadcrumbUtils';

// SEO Content Blocks Configuration
const SEO_CONTENT_CONFIG = {
  Mobiles: {
    heading: 'Latest Smartphones in India',
    description: 'Shop the finest collection of latest smartphones from top brands including Apple, Samsung, OnePlus, and Google Pixel. Find the best 5G phones with exceptional camera capabilities and premium features. Our carefully curated selection features flagship models delivering superior performance and innovation. Whether you\'re seeking the latest iPhone, Galaxy S series, or cutting-edge Android devices, Voltify offers authentic smartphones at competitive prices with genuine warranty and hassle-free returns.',
    faqs: [
      {
        question: 'Which is the best smartphone under ₹50,000?',
        answer: 'Top options under ₹50,000 include OnePlus 12, Samsung Galaxy A54, and Xiaomi 14. These deliver excellent performance with flagship cameras and fast processors. Compare specs and read reviews to find the perfect match for your needs.'
      },
      {
        question: 'What are the latest 5G phones available?',
        answer: 'Popular 5G smartphones include iPhone 15 series, Samsung Galaxy S24, OnePlus 12, and Google Pixel 8. All these devices support 5G connectivity and offer premium features. Availability may vary by region, so check current stock for real-time updates.'
      },
      {
        question: 'Which phones have the best camera quality?',
        answer: 'iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, and Google Pixel 8 Pro are renowned for exceptional camera quality. Each excels in low-light photography, zoom capabilities, and video recording. Your choice depends on your specific photography preferences.'
      },
      {
        question: 'What\'s the difference between flagship and mid-range phones?',
        answer: 'Flagship phones offer cutting-edge processors, premium displays, superior cameras, and longer battery life. Mid-range phones provide excellent value with solid performance for everyday use. Choose based on your budget and usage requirements.'
      }
    ]
  },
  Tablets: {
    heading: 'Premium Tablets for Work and Entertainment',
    description: 'Explore our curated selection of premium tablets from Apple, Samsung, and Lenovo. Find the perfect iPad Pro or Samsung Galaxy Tab for productivity, entertainment, and creative work. Our collection features high-performance tablets with stunning displays and powerful processors. Whether you\'re a professional seeking a productivity powerhouse or someone looking for immersive media consumption, Voltify offers the latest models with authentic warranties and certified authenticity.',
    faqs: [
      {
        question: 'Which is the best tablet for productivity?',
        answer: 'iPad Pro with Apple Pencil is excellent for professional work. Samsung Galaxy Tab S9 Ultra and Lenovo Tab P12 Pro are also outstanding options. Consider screen size, keyboard compatibility, and software for productivity tasks.'
      },
      {
        question: 'Should I choose iPad or Android tablets?',
        answer: 'iPad offers excellent ecosystem integration, while Android tablets provide more flexibility. iPad excels for creative work and professional apps. Android tablets offer better customization and Google services integration. Choose based on your existing devices and software preferences.'
      },
      {
        question: 'What size tablet should I get?',
        answer: 'Smaller tablets (8-10 inches) are portable for reading and casual use. Larger tablets (11-13 inches) suit productivity and entertainment better. Consider your primary use case when choosing between 256GB and 512GB storage options.'
      }
    ]
  },
  Audio: {
    heading: 'Premium Audio Equipment & Accessories',
    description: 'Discover premium audio equipment from leading brands including Apple AirPods, Sony, JBL, Beats, and Bose. Find the perfect earbuds, headphones, and speakers for music lovers and audiophiles. Our selection includes wireless earbuds with noise cancellation, gaming headsets, and premium sound systems. Whether you\'re seeking portable audio for commuting or studio-quality sound for professionals, Voltify offers authentic products with complete warranty coverage.',
    faqs: [
      {
        question: 'What\'s the best option for noise-cancelling earbuds?',
        answer: 'Apple AirPods Pro, Sony WF-1000XM5, and Bose QuietComfort Earbuds all offer excellent active noise cancellation. AirPods Pro integrates seamlessly with Apple devices, while Sony and Bose work well across platforms. Choose based on device compatibility and sound preference.'
      },
      {
        question: 'Which headphones are best for gaming?',
        answer: 'Gaming-specific options include Sony Inzone, Corsair, and SteelSeries headphones with low-latency wireless. They offer surround sound, comfortable fits for long sessions, and boom microphones. Check compatibility with your gaming platform before purchasing.'
      },
      {
        question: 'What\'s the battery life of wireless earbuds?',
        answer: 'Most modern earbuds offer 6-10 hours of playback, with charging cases extending total battery to 24-40 hours. Premium models like Sony WF-1000XM5 deliver exceptional battery performance. Battery life depends on usage and audio settings like noise cancellation.'
      }
    ]
  },
  Accessories: {
    heading: 'Essential Tech Accessories for Every Device',
    description: 'Enhance your tech experience with our comprehensive range of quality accessories from trusted brands like Anker, Belkin, and Samsung. Find protective phone cases, power banks, chargers, cables, and screen protectors for all devices. Our carefully selected accessories combine durability with style, ensuring your devices stay protected while maintaining their premium look. Shop authentic products with guaranteed compatibility and manufacturer warranties.',
    faqs: [
      {
        question: 'What\'s the difference between fast chargers?',
        answer: 'Fast chargers vary by wattage (18W to 140W+). Higher wattage charges devices faster but requires compatible devices. Check your device specifications to ensure compatibility. Brands like Anker and Belkin offer certified fast chargers with overcharge protection.'
      },
      {
        question: 'Which power bank capacity do I need?',
        answer: 'For one full phone charge, a 10,000mAh power bank suffices. For multiple charges, choose 20,000-30,000mAh. Heavier capacity packs are bulkier. Consider your daily usage and portability needs when selecting capacity.'
      },
      {
        question: 'How do I choose the right phone case?',
        answer: 'Consider protection level (slim, rugged, or hybrid), material (silicone, leather, TPU), and design preferences. Brands like Spigen and OtterBox offer reliable protection. Check drop-test results and reviews for durability before purchasing.'
      }
    ]
  }
};

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="group relative bg-voltify-dark/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-voltify-gold/40 hover:shadow-voltify-gold/15 transition-all duration-300 flex flex-col h-full border border-voltify-light/10"
    >
      {/* Image Container */}
      <Link to={product.slug && product.category 
        ? `/${product.category.toLowerCase().replace(/\s+/g, '-')}/${product.slug}`
        : `/product/${product._id}`
      } className="relative overflow-hidden aspect-square block w-full bg-voltify-dark/50 flex-shrink-0">
        <img
          src={product.image}
          alt={`${product.brand || 'Product'} ${product.name} ${product.color || ''} - Buy on Voltify`}
          width={400}
          height={400}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Product';
          }}
        />
      </Link>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow space-y-2.5">
        {/* Product Name */}
        <Link to={product.slug && product.category 
          ? `/${product.category.toLowerCase().replace(/\s+/g, '-')}/${product.slug}`
          : `/product/${product._id}`
        } className="block">
          <h3 className="font-semibold text-sm sm:text-base text-voltify-light group-hover:text-voltify-gold transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Color if available */}
        <p className="text-xs text-voltify-light/50 font-medium">
          {product.color || product.category}
        </p>

        {/* Rating if available */}
        {product.rating && (
          <div className="flex items-center gap-2 text-xs text-voltify-light/60">
            <span>★</span>
            <span>{product.rating}</span>
            <span>·</span>
            <span>{product.reviewCount || 0}</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Price */}
        <div>
          <span className="text-lg sm:text-xl font-bold text-voltify-gold">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Floating Add to Cart Button - Bottom Right */}
      <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5">
        {existingItem ? (
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 bg-voltify-dark/80 backdrop-blur-sm border border-voltify-gold/40 rounded-full px-3 py-2"
          >
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
          </motion.div>
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

export default function CategoryPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const brand = searchParams.get('brand');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine category from either :category param or URL path
  // E.g., /mobiles -> 'mobiles', /tablets -> 'tablets', /category/Mobiles -> 'Mobiles'
  const categoryParam = params.category;

  // Map URL slug to proper category name
  const categoryMap = {
    'mobiles': 'Mobiles',
    'tablets': 'Tablets',
    'audio': 'Audio',
    'accessories': 'Accessories',
    'phone-case': 'Phone Case',
    'phone-cases': 'Phone Case'
  };

  const categoryTitles = {
    Mobiles: 'Mobiles',
    Tablets: 'Tablets',
    Audio: 'Audio',
    Accessories: 'Accessories',
    TV: 'Televisions',
    'Phone Covers': 'Phone Covers & Accessories',
    'Phone Case': 'Phone Cases & Accessories',
  };

  // Get the normalized category name
  const normalizedCategory = categoryMap[categoryParam?.toLowerCase()] || categoryParam;

  useEffect(() => {
    fetchProductsByCategory();
  }, [categoryParam, brand]);

  const fetchProductsByCategory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      let filtered = response.data.filter(
        (product) => product.category === normalizedCategory
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
    <>
      <Helmet>
        <title>Buy {categoryTitles[normalizedCategory] || normalizedCategory} Online at Best Price | Voltify Premium Tech</title>
        <meta name="description" content={`Explore premium ${normalizedCategory?.toLowerCase() || ''} at Voltify. Best prices, verified authentic brands, and fast delivery across India. Shop ${categoryTitles[normalizedCategory] || normalizedCategory} online.`} />
        <meta name="keywords" content={`${normalizedCategory?.toLowerCase() || ''}, buy online, best price, India, premium`} />
        
        {/* Open Graph & Twitter Card Meta Tags for Category Sharing */}
        {getCategorySocialMeta(
          categoryTitles[normalizedCategory] || normalizedCategory,
          `Shop premium ${normalizedCategory?.toLowerCase() || ''} at the best prices on Voltify. Free express delivery across India.`,
          `https://voltify.in/images/categories/${normalizedCategory?.toLowerCase() || 'category'}.png`
        ).map((meta, idx) => (
          meta.name ? (
            <meta key={idx} name={meta.name} content={meta.content} />
          ) : (
            <meta key={idx} property={meta.property} content={meta.content} />
          )
        ))}
        
        {/* JSON-LD BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${window.location.origin}/`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": categoryTitles[normalizedCategory] || normalizedCategory,
                "item": window.location.href
              }
            ]
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-[#0f0f0f] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb 
          items={getCategoryBreadcrumbs(
            categoryTitles[normalizedCategory] || normalizedCategory,
            categoryParam
          )}
          showMobileAbbreviated={true}
          className="mb-8 -mx-4 px-4 text-[#888]"
        />
        {/* SEO Content Block */}
        {SEO_CONTENT_CONFIG[normalizedCategory] && (
          <motion.div 
            className="mb-16 bg-[#1a1a1a] rounded-2xl shadow-sm border border-[#2a2a2a] p-8 border-l-4 border-l-[#f5a623]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              {SEO_CONTENT_CONFIG[normalizedCategory].heading}
            </h2>
            <p className="text-base text-[#aaaaaa] leading-relaxed">
              {SEO_CONTENT_CONFIG[normalizedCategory].description}
            </p>
          </motion.div>
        )}

        {/* Category Header */}
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-display font-bold text-white mb-4">
            {brand ? `${brand} ${categoryTitles[normalizedCategory] || normalizedCategory}` : (categoryTitles[normalizedCategory] || normalizedCategory)}
          </h1>
          <p className="text-lg text-[#888]">
            {brand 
              ? `Browse ${brand}'s premium collection of ${normalizedCategory?.toLowerCase() || ''}` 
              : `Browse our premium collection of ${normalizedCategory?.toLowerCase() || ''}`}
          </p>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-[#888] mb-6">
              No products available in this category yet.
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-[#f5a623] text-[#0f0f0f] font-semibold rounded-lg hover:bg-[#f5b833] transition-colors"
            >
              Back to Home
            </a>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4"
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

        {/* FAQ Section */}
        {SEO_CONTENT_CONFIG[normalizedCategory] && SEO_CONTENT_CONFIG[normalizedCategory].faqs && (
          <motion.div 
            className="mt-20 bg-[#1a1a1a] rounded-2xl shadow-sm border border-[#2a2a2a] p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6 max-w-4xl mx-auto">
              {SEO_CONTENT_CONFIG[normalizedCategory].faqs.map((faq, idx) => (
                <motion.div 
                  key={idx}
                  className="border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#f5a623]/50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                >
                  <details className="group cursor-pointer">
                    <summary className="flex items-center justify-between p-6 bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-colors">
                      <h3 className="font-semibold text-white text-lg pr-4">
                        {faq.question}
                      </h3>
                      <span className="text-[#888] group-open:text-[#f5a623] transition-colors">
                        <svg className="w-6 h-6 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 py-4 bg-[#0f0f0f] border-t border-[#2a2a2a]">
                      <p className="text-[#aaaaaa] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
}

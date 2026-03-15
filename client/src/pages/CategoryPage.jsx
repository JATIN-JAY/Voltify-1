import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { getCategorySocialMeta } from '../utils/socialMetaTags';
import { Breadcrumb } from '../components/Breadcrumb';
import { getCategoryBreadcrumbs, generateBreadcrumbSchema } from '../utils/breadcrumbUtils';

// Base SEO Content Blocks Configuration
const SEO_CONTENT_CONFIG = {
  Mobiles: {
    heading: 'Latest Smartphones in India',
    baseDescription: 'Shop the finest collection of latest smartphones from top brands. Find the best phones with exceptional camera capabilities and premium features. Our carefully curated selection features flagship models delivering superior performance and innovation. Whether you\'re seeking the latest flagship or cutting-edge Android devices, Voltify offers authentic smartphones at competitive prices with genuine warranty and hassle-free returns.',
    faqs: [
      {
        question: 'Which is the best smartphone under ₹50,000?',
        answer: 'Options under ₹50,000 deliver excellent performance with flagship cameras and fast processors. Compare specs and read reviews to find the perfect match for your needs.'
      },
      {
        question: 'What are the latest 5G phones available?',
        answer: 'Popular 5G smartphones offer 5G connectivity and premium features. Availability may vary by region, so check current stock for real-time updates.'
      },
      {
        question: 'Which phones have the best camera quality?',
        answer: 'Premium phones are renowned for exceptional camera quality, excelling in low-light photography, zoom capabilities, and video recording. Your choice depends on your specific photography preferences.'
      },
      {
        question: 'What\'s the difference between flagship and mid-range phones?',
        answer: 'Flagship phones offer cutting-edge processors, premium displays, superior cameras, and longer battery life. Mid-range phones provide excellent value with solid performance for everyday use. Choose based on your budget and usage requirements.'
      }
    ]
  },
  Tablets: {
    heading: 'Premium Tablets for Work and Entertainment',
    baseDescription: 'Explore our curated selection of premium tablets. Find the perfect tablet for productivity, entertainment, and creative work. Our collection features high-performance tablets with stunning displays and powerful processors. Whether you\'re a professional seeking productivity or someone looking for immersive media consumption, Voltify offers the latest models with authentic warranties and certified authenticity.',
    faqs: [
      {
        question: 'Which is the best tablet for productivity?',
        answer: 'Premium tablets are excellent for professional work. Consider screen size, keyboard compatibility, and software for productivity tasks.'
      },
      {
        question: 'Should I choose iPad or Android tablets?',
        answer: 'iPad offers excellent ecosystem integration, while Android tablets provide more flexibility. Choose based on your existing devices and software preferences.'
      },
      {
        question: 'What size tablet should I get?',
        answer: 'Smaller tablets (8-10 inches) are portable for reading. Larger tablets (11-13 inches) suit productivity and entertainment better. Consider your primary use case.'
      }
    ]
  },
  Audio: {
    heading: 'Premium Audio Equipment & Accessories',
    baseDescription: 'Discover premium audio equipment from leading brands. Find the perfect earbuds, headphones, and speakers for music lovers and audiophiles. Our selection includes wireless earbuds with noise cancellation, gaming headsets, and premium sound systems. Whether you\'re seeking portable audio for commuting or studio-quality sound for professionals, Voltify offers authentic products with complete warranty coverage.',
    faqs: [
      {
        question: 'What\'s the best option for noise-cancelling earbuds?',
        answer: 'Premium earbuds offer excellent active noise cancellation. Choose based on your device compatibility and sound preference.'
      },
      {
        question: 'Which headphones are best for gaming?',
        answer: 'Gaming-specific options offer low-latency wireless with surround sound and comfortable fits for long sessions. Check compatibility with your gaming platform.'
      },
      {
        question: 'What\'s the battery life of wireless earbuds?',
        answer: 'Most modern earbuds offer 6-10 hours of playback, with charging cases extending total battery to 24-40 hours. Battery life depends on usage and audio settings.'
      }
    ]
  },
  Accessories: {
    heading: 'Essential Tech Accessories for Every Device',
    baseDescription: 'Enhance your tech experience with our comprehensive range of quality accessories from trusted brands. Find protective cases, power banks, chargers, cables, and screen protectors for all devices. Our carefully selected accessories combine durability with style, ensuring your devices stay protected. Shop authentic products with guaranteed compatibility and manufacturer warranties.',
    faqs: [
      {
        question: 'What\'s the difference between fast chargers?',
        answer: 'Fast chargers vary by wattage (18W to 140W+). Check your device specifications to ensure compatibility for the fastest charging.'
      },
      {
        question: 'Which power bank capacity do I need?',
        answer: 'For one full phone charge, a 10,000mAh power bank suffices. For multiple charges, choose 20,000-30,000mAh. Consider your daily usage and portability.'
      },
      {
        question: 'How do I choose the right phone case?',
        answer: 'Consider protection level, material, and design preferences. Check drop-test results and reviews for durability before purchasing.'
      }
    ]
  },
  'Phone Case': {
    heading: 'Premium Phone Cases & Screen Protectors',
    baseDescription: 'Protect your device with premium phone cases and screen protectors from trusted brands. Our selection combines style with durability, offering protection for all popular phone models. Choose from slim designs, rugged protection, or hybrid options. All products come with guaranteed compatibility and warranty coverage.',
    faqs: [
      {
        question: 'What\'s the best protection level for my phone?',
        answer: 'Slim cases offer minimal bulk, rugged cases provide maximum drop protection, and hybrid cases balance both. Choose based on your daily usage and protection needs.'
      },
      {
        question: 'Do I need both a case and screen protector?',
        answer: 'A case protects from drops and impacts. A screen protector guards against scratches and cracks. Using both provides comprehensive protection for your device.'
      },
      {
        question: 'Which materials are most durable?',
        answer: 'TPU (thermoplastic polyurethane) offers shock absorption, hard plastic provides drop protection, and leather adds style. Choose based on your preferences.'
      }
    ]
  }
};

// Function to generate brand-specific SEO content
function generateBrandSEOContent(category, brand, categoryTitle) {
  const baseConfig = SEO_CONTENT_CONFIG[category];
  if (!baseConfig) return null;

  const brandDescriptions = {
    'Apple': {
      Mobiles: `Discover the complete range of ${brand} iPhones at Voltify. From the latest flagship models to premium devices, find authentic ${brand} smartphones with official warranty. Experience innovative technology, exceptional cameras, and seamless ecosystem integration. ${brand} devices are known for their premium build quality, powerful performance, and exclusive features.`,
      Tablets: `Shop ${brand} iPad models at unbeatable prices. From iPad Pro with M-series chips to iPad Air, find the perfect tablet for work and creativity. All ${brand} tablets come with official warranty and verified authenticity. Experience the powerful iPadOS ecosystem and exceptional performance.`,
      Audio: `Explore ${brand} AirPods and audio products at Voltify. From AirPods Pro with active noise cancellation to AirPods Max, discover premium audio solutions. All products are authentic with official warranty. Experience superior sound quality and seamless Apple ecosystem integration.`,
      Accessories: `Find premium ${brand} accessories including cases, chargers, and cables. All ${brand} accessories are certified authentic with official warranty. Protect your devices while maintaining ${brand}'s premium aesthetic and build quality.`
    },
    'Samsung': {
      Mobiles: `Browse the complete ${brand} Galaxy smartphone lineup. From flagship Galaxy S series to budget-friendly options, find authentic ${brand} phones at competitive prices. Experience Samsung's AMOLED displays, innovative features, and reliable performance. All products come with official warranty.`,
      Tablets: `Shop ${brand} Galaxy Tab series tablets. From powerful Tab S Ultra to portable Tab A models, find the perfect tablet. ${brand} tablets offer stunning displays and productivity features. All products are authentic with official warranty coverage.`,
      Audio: `Discover ${brand} audio products and headphones. Find wireless earbuds, noise-cancelling headphones, and speakers. All ${brand} audio products deliver excellent sound quality with seamless smartphone integration.`,
      Accessories: `Browse ${brand} accessories including protective cases, chargers, and charging pads. All ${brand} accessories are certified authentic and perfect for protecting your devices.`
    },
    'OnePlus': {
      Mobiles: `Explore ${brand} flagship killers at Voltify. Experience cutting-edge performance, smooth OxygenOS, and competitive pricing. ${brand} phones deliver flagship features at mid-range prices. All devices come with official warranty and verified authenticity.`,
      Tablets: `Discover ${brand} tablet offerings with premium specifications. Find high refresh rate displays and powerful processors designed for gaming and productivity.`
    },
    'Google': {
      Mobiles: `Shop ${brand} Pixel phones for the ultimate Android experience. Experience computational photography, pure Android, and exclusive Pixel features. All ${brand} phones come with authentic warranty and support.`,
      Audio: `Browse ${brand} audio products designed for seamless Android integration. From earbuds to smart speakers, experience ${brand}'s audio technology.`
    },
    'Sony': {
      Audio: `Discover ${brand} premium audio equipment. From noise-cancelling earbuds to gaming headsets, find professional-grade audio solutions. ${brand} delivers exceptional sound quality trusted by audio professionals.`
    },
    'JBL': {
      Audio: `Explore ${brand} speakers and audio equipment. From portable Bluetooth speakers to premium audio systems, find solutions for every need. ${brand} is known for powerful sound and durability.`
    },
    'Beats': {
      Audio: `Shop ${brand} premium audio products. Find studio-quality headphones and earbuds designed for music professionals. ${brand} combines premium design with exceptional sound quality.`
    },
    'Anker': {
      Accessories: `Browse ${brand} charging solutions and accessories. From fast chargers to power banks, find reliable products designed for durability. ${brand} offers excellent warranty and customer support.`
    }
  };

  const brandSpecificDesc = brandDescriptions[brand]?.[category];
  
  return {
    heading: `${brand} ${categoryTitle} - Premium Collection at Best Prices`,
    description: brandSpecificDesc || `Shop the complete range of ${brand} ${category?.toLowerCase() || ''} at Voltify. Find authentic ${brand} products with official warranty coverage. ${baseConfig.baseDescription}`,
    faqs: baseConfig.faqs.map(faq => ({
      ...faq,
      answer: faq.answer.replace(/Premium/g, `${brand}`)
    }))
  };
}

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
      className="group relative bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-voltify-gold/40 hover:shadow-voltify-gold/15 transition-all duration-300 flex flex-col h-full border border-voltify-light/10"
    >
      {/* Image Container */}
      <Link to={product.slug && product.category 
        ? `/${product.category.toLowerCase().replace(/\s+/g, '-')}/${product.slug}`
        : `/product/${product._id}`
      } className="relative overflow-hidden aspect-square block w-full bg-[#1e1e1e] flex-shrink-0">
        <img
          src={product.image}
          alt={`${product.brand || 'Product'} ${product.name} ${product.color || ''} - Buy on Voltify`}
          width={400}
          height={400}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out mix-blend-mode-screen"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Product';
          }}
          style={{ mixBlendMode: 'screen' }}
        />
      </Link>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow space-y-2.5">
        {/* Product Name */}
        <Link to={product.slug && product.category 
          ? `/${product.category.toLowerCase().replace(/\s+/g, '-')}/${product.slug}`
          : `/product/${product._id}`
        } className="block">
          <h3 className="font-semibold text-sm sm:text-base text-voltify-light group-hover:text-voltify-gold transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
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
        <div className="min-w-0">
          <span className="text-base sm:text-lg font-bold text-voltify-gold break-words">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Full-Width Add to Cart Button */}
        <div className="w-[calc(100%+2rem)] -mx-4 mt-3">
          {existingItem ? (
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center gap-2 bg-voltify-gold hover:bg-yellow-500 transition-colors text-voltify-dark font-bold h-9 text-sm rounded-lg mx-3"
            >
              <button
                onClick={handleDecrease}
                className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
                title="Decrease quantity"
              >
                −
              </button>
              <span className="w-6 text-center text-xs font-bold">
                {existingItem.quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
                title="Increase quantity"
              >
                +
              </button>
            </motion.div>
          ) : (
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-[calc(100%-1.5rem)] h-9 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-md mx-3 ${
                isAdded
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#f5a623] text-voltify-dark hover:bg-yellow-500 hover:shadow-lg'
              }`}
              title="Add to cart"
            >
              {isAdded ? (
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Added</span>
                </div>
              ) : (
                'Add to Cart'
              )}
            </motion.button>
          )}
        </div>
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
        {(() => {
          let seoContent;
          if (brand) {
            seoContent = generateBrandSEOContent(normalizedCategory, brand, categoryTitles[normalizedCategory] || normalizedCategory);
          } else {
            seoContent = SEO_CONTENT_CONFIG[normalizedCategory];
          }
          
          return seoContent ? (
            <motion.div 
              className="mb-16 bg-[#1a1a1a] rounded-2xl shadow-sm border border-[#2a2a2a] p-4 md:p-8 border-l-4 border-l-[#f5a623]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4">
                {seoContent.heading}
              </h2>
              <p className="text-sm md:text-base text-[#aaaaaa] leading-relaxed">
                {seoContent.description || seoContent.baseDescription}
              </p>
            </motion.div>
          ) : null;
        })()}

        {/* Category Header */}
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            {brand ? `${brand} ${categoryTitles[normalizedCategory] || normalizedCategory}` : (categoryTitles[normalizedCategory] || normalizedCategory)}
          </h1>
          <p className="text-sm md:text-lg text-[#888]">
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
        {(() => {
          let seoContent;
          if (brand) {
            seoContent = generateBrandSEOContent(normalizedCategory, brand, categoryTitles[normalizedCategory] || normalizedCategory);
          } else {
            seoContent = SEO_CONTENT_CONFIG[normalizedCategory];
          }
          
          return seoContent && seoContent.faqs ? (
            <motion.div 
              className="mt-20 bg-[#1a1a1a] rounded-2xl shadow-sm border border-[#2a2a2a] p-4 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
                {seoContent.faqs.map((faq, idx) => (
                  <motion.div 
                    key={idx}
                    className="border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#f5a623]/50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                  >
                    <details className="group cursor-pointer">
                      <summary className="flex items-center justify-between p-4 md:p-6 bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-colors">
                        <h3 className="font-semibold text-white text-sm md:text-lg pr-4">
                          {faq.question}
                        </h3>
                        <span className="text-[#888] group-open:text-[#f5a623] transition-colors">
                          <svg className="w-5 md:w-6 h-5 md:h-6 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-4 py-3 md:px-6 md:py-4 bg-[#0f0f0f] border-t border-[#2a2a2a]">
                        <p className="text-xs md:text-sm text-[#aaaaaa] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </details>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : null;
        })()}
      </div>
    </div>
    </>
  );
}

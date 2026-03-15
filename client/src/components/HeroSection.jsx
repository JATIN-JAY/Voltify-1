import React, { useContext, useEffect, useRef, useState, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ModalContext } from "../context/ModalContext";
import api from "../api";
import { normalizeProducts } from "../utils/productDataUtils";
import ProductImagePlaceholder from "./ProductImagePlaceholder";
import "../styles/hero-animations.css";

/**
 * HeroSection Component - Memoized to prevent unnecessary re-renders
 * Only re-renders if CartContext.user changes or props change
 */
const HeroSection = memo(function HeroSection() {
  const { user } = useContext(CartContext);
  const { openModal } = useContext(ModalContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const edgeText = "edge.";

  const handleBrowseProducts = useCallback(() => {
    const productsSection = document.getElementById('products');
    productsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Typing effect for "edge." text - ensures completion + fallback
  useEffect(() => {
    const edgeText = "edge.";
    let charIndex = 0;
    let typingInterval = null;
    let restartTimeout = null;
    let fallbackTimeout = null;

    const performTyping = () => {
      charIndex = 0;
      
      typingInterval = setInterval(() => {
        // Always update typed text progressively
        setTypedText(edgeText.substring(0, charIndex + 1));
        setShowCursor(charIndex < edgeText.length);
        charIndex++;

        // When complete
        if (charIndex > edgeText.length) {
          clearInterval(typingInterval);
          setShowCursor(false);
          setTypedText(edgeText); // Ensure full text is set
          
          // Schedule restart
          restartTimeout = setTimeout(() => {
            performTyping();
          }, 2000);
        }
      }, 150);
    };

    // Start typing after 500ms
    const initialTimeout = setTimeout(() => {
      performTyping();
    }, 500);

    // Fallback: Force full text display after 2 seconds if animation hasn't completed
    fallbackTimeout = setTimeout(() => {
      setTypedText(edgeText);
      setShowCursor(false);
      if (typingInterval) clearInterval(typingInterval);
      console.warn('Typewriter animation fallback triggered - forced display of full text');
    }, 2000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(fallbackTimeout);
      clearTimeout(restartTimeout);
      if (typingInterval) clearInterval(typingInterval);
    };
  }, []);

  // Memoized fetch function for featured products
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoadingFeatured(true);
      const response = await api.get('/products/featured/list');
      const rawProducts = Array.isArray(response.data) ? response.data : [];
      
      // Normalize product data (clean names, strip trailing pipes and special chars)
      const normalizedProducts = normalizeProducts(rawProducts);
      
      // Ensure max 3 products
      const limitedProducts = normalizedProducts.slice(0, 3);

      console.log('✓ Flagship carousel loaded:', {
        count: limitedProducts.length,
        maxProducts: 3,
        timestamp: new Date().toISOString(),
        products: limitedProducts.map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          hasImage: !!p.image,
          featured: p.featured,
        })),
      });

      setFeaturedProducts(limitedProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setFeaturedProducts([]);
    } finally {
      setLoadingFeatured(false);
    }
  }, []);

  // Initial load of featured products
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  // Listen for featured products changes from admin dashboard
  useEffect(() => {
    const handleFeaturedProductsChanged = (event) => {
      console.log('📢 Featured products changed event received:', event.detail);
      // Refetch featured products to reflect changes
      fetchFeaturedProducts();
    };

    window.addEventListener('featuredProductsChanged', handleFeaturedProductsChanged);

    return () => {
      window.removeEventListener('featuredProductsChanged', handleFeaturedProductsChanged);
    };
  }, [fetchFeaturedProducts]);

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#0f0f0f' }}>
      {/* Minimalist Background - Just Color and Subtle Geometry */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        {/* Warm gold accent top-right */}
        <div className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-voltify-gold/15 rounded-full blur-3xl"></div>
        {/* Subtle warm accent bottom-left */}
        <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-voltify-gold/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-0 pb-20 lg:pt-24 lg:pb-24 mt-0">
        
        <div className="grid items-stretch gap-14 lg:grid-cols-2 lg:gap-24">
          
          {/* LEFT COLUMN - Content */}
          <div className="flex flex-col justify-between">
            {/* Pre-headline - Fade in at 0ms */}
            <div
              className="inline-flex items-center gap-3 mb-8 w-fit hero-label-fade"
            >
              <div className="w-2 h-2 rounded-full bg-voltify-gold"></div>
              <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-voltify-light/70">
                Engineered for Perfectionists
              </span>
            </div>

            {/* Main Headline - Editorial Treatment */}
            <div className="relative mb-8">
              <h1 className="text-left leading-[0.95] tracking-tighter text-voltify-light font-black">
                {/* "Gear up your" - Slide up and fade at 200ms */}
                <span className="block text-5xl sm:text-6xl xl:text-7xl 2xl:text-8xl hero-headline-slideup">
                  Gear up
                </span>
                {/* "your" with underline */}
                <span className="block text-5xl sm:text-6xl xl:text-7xl 2xl:text-8xl hero-headline-slideup">
                  <span className="relative inline-block">
                    your
                    <span className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-voltify-gold via-voltify-gold to-transparent opacity-50"></span>
                  </span>
                </span>
                {/* "edge." - Type out at 500ms */}
                <span className="block text-5xl sm:text-6xl xl:text-7xl 2xl:text-8xl -mt-6 relative">
                  <span className="text-voltify-gold hero-text-typing">
                    {typedText}
                    {showCursor && <span className="cursor-blink" />}
                  </span>
                </span>
              </h1>
              {/* Subheadline - Fade in at 800ms */}
              <p className="mt-6 text-base text-voltify-light/70 font-medium leading-relaxed max-w-md hero-subtitle-fade">
                Curated tech for creators, builders, and visionaries. Zero compromises. Zero fluff.
              </p>
            </div>

            {/* CTA Buttons - Fade + slide at 1000ms */}
            <div 
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14 hero-cta-fade"
            >
              <button
                type="button"
                onClick={handleBrowseProducts}
                className="group relative w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-voltify-gold text-voltify-dark font-black text-sm sm:text-base uppercase tracking-widest rounded-lg transition-all duration-300 hover:shadow-[0_20px_40px_rgba(232,160,32,0.3)] hover:-translate-y-1 active:translate-y-0 touch-target"
              >
                <span className="flex items-center justify-center sm:justify-start gap-3">
                  Explore Picks
                  <svg className="w-4 sm:w-5 h-4 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>

              {!user && (
                <button
                  onClick={() => openModal('signup')}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3 border-2 border-voltify-light/30 text-voltify-light font-semibold text-xs uppercase tracking-wide rounded-lg hover:bg-voltify-light/5 transition-colors touch-target">
                  Create Account
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Featured Product - Fade from right at 300ms */}
          <div className="relative mt-8 sm:mt-0 lg:-mr-8 lg:mt-0 hero-featured-fade-right w-full">
            <div className="relative">
              {/* Clean Product Card Container - Mobile Optimized */}
              <div className="bg-voltify-dark/80 rounded-xl border border-voltify-border shadow-[0_15px_45px_rgba(0,0,0,0.3)] overflow-hidden max-h-96 sm:max-h-none lg:max-h-none">
                {/* Top Section - Subtle Featured Label */}
                <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-2 sm:pb-3 border-b border-voltify-border">
                  <span className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-voltify-light/50">
                    ✓ Flagship Item
                  </span>
                </div>

                {/* Product Carousel */}
                <div className="px-3 sm:px-6 py-1 sm:py-2">
                  <FeaturedCarousel products={featuredProducts} loading={loadingFeatured} onActiveIndexChange={setActiveProductIndex} activeIndex={activeProductIndex} />
                </div>

                {/* Product Details Section */}
                <div className="px-4 sm:px-6 pb-5 sm:pb-6 border-t border-voltify-border">
                  <FeaturedProductDetails products={featuredProducts} activeIndex={activeProductIndex} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;

function TrustBadge({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-voltify-border bg-voltify-dark/60 p-4 transition-colors hover:bg-voltify-dark/80">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-voltify-gold/15">
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-bold tracking-tight text-voltify-light">{title}</p>
        <p className="mt-0.5 text-[12px] font-medium text-voltify-light/60 leading-snug">{subtitle}</p>
      </div>
    </div>
  );
}

function FeaturedProductDetails({ products, activeIndex }) {
  if (!products.length) return null;
  
  // Ensure activeIndex is valid and synchronized with displayed product
  const validIndex = Math.min(Math.max(0, activeIndex), products.length - 1);
  const product = products[validIndex];
  const price = Number(product.price || 0);

  console.log('Product details updated:', {
    activeIndex,
    validIndex,
    productId: product._id,
    productName: product.name,
    price,
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-voltify-light/50 font-medium">Premium Selection</p>
        <h3 className="text-lg font-bold text-voltify-light mt-1 line-clamp-2">{product.name}</h3>
      </div>
      <div className="flex items-end gap-3 justify-between">
        <p className="text-2xl font-black text-voltify-gold">₹{Math.round(price).toLocaleString('en-IN')}</p>
        <Link
          to={`/product/${product._id}`}
          className="group inline-flex items-center justify-center w-9 h-9 rounded-full bg-voltify-gold text-voltify-dark hover:bg-voltify-gold/90 transition-colors flex-shrink-0 mb-1"
          aria-label="View product"
        >
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function FeaturedCarousel({ products, loading, onActiveIndexChange, activeIndex }) {
  const scrollRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Update active product index based on scroll position
  const handleScroll = () => {
    const node = scrollRef.current;
    if (!node || !products.length) return;
    
    const scrollLeft = node.scrollLeft;
    const containerWidth = node.clientWidth * 0.8;
    const index = Math.round(scrollLeft / containerWidth);
    const clampedIndex = Math.min(index, products.length - 1);
    onActiveIndexChange(clampedIndex);
  };

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    
    node.addEventListener('scroll', handleScroll);
    return () => node.removeEventListener('scroll', handleScroll);
  }, [products.length, onActiveIndexChange]);

  useEffect(() => {
    if (isHovering || !products.length || loading) return;

    const interval = setInterval(() => {
      const node = scrollRef.current;
      if (!node) return;

      const maxScrollLeft = node.scrollWidth - node.clientWidth;
      if (node.scrollLeft >= maxScrollLeft - 8) {
        node.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      // Approximately scroll by one card width
      node.scrollBy({ left: node.clientWidth * 0.8, behavior: 'smooth' });
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovering, products.length, loading]);

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-voltify-dark/50 flex items-center justify-center h-[240px] sm:h-[280px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-[2px] border-slate-200 border-t-slate-800" />
          <span className="text-xs font-medium text-voltify-light/50">Loading</span>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="relative overflow-hidden bg-voltify-dark/50 flex items-center justify-center h-[240px] sm:h-[280px]">
        <p className="text-sm text-voltify-light/50 font-medium">No products</p>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden bg-transparent"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >

      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto h-[240px] sm:h-[280px] items-stretch"
      >
        {products.map((product, idx) => {
          const price = Number(product.price || 0);
          const imageUrl = product.image || product.imageUrl || '';
          const hasImage = !!imageUrl;
          
          // Detect image-product mismatch in development
          if (process.env.NODE_ENV === 'development') {
            // Extract product ID from image URL for mismatch detection
            const imageFilename = imageUrl.split('/').pop()?.toLowerCase() || '';
            const productIdStr = String(product._id).toLowerCase();
            
            // Check if image filename contains product-related identifier
            // Allow common image patterns: product-name, product-id, or generic patterns
            const isImageMatch = 
              !imageUrl || // No image is ok (we show placeholder)
              imageFilename.includes(productIdStr) ||
              imageFilename.includes(product.name?.toLowerCase().substring(0, 3)) ||
              imageFilename.includes('product') ||
              imageUrl.includes('cloudinary') ||
              imageUrl.includes('placeholder') ||
              imageUrl.includes('unsplash') ||
              imageUrl.includes('imgur');
            
            if (!isImageMatch && imageUrl) {
              console.warn(
                `⚠️ Carousel image-product mismatch detected at index ${idx}:`,
                {
                  productId: product._id,
                  productName: product.name,
                  imageUrl: imageUrl,
                  imageFilename: imageFilename,
                  expectedImagePattern: `*${productIdStr}* or *${product.name?.split(' ')[0].toLowerCase()}*`,
                }
              );
            }
          }

          return (
            <div
              key={product._id}
              className="relative w-full flex-none snap-start"
              data-product-id={product._id}
              data-image-url={imageUrl}
            >
              {/* Clean Product Image Cutout on Dark Background */}
              {hasImage ? (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-voltify-dark/80 to-voltify-dark">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full object-contain transition-transform duration-700 hover:scale-105"
                    data-product-id={product._id}
                    onError={(e) => {
                      console.error(`Image load error for product ${product._id}:`, {
                        attempts: (e.target.dataset.attempts || 0) + 1,
                        imageUrl: imageUrl,
                        fallbackUrl: 'https://via.placeholder.com/400x400?text=No+Image',
                      });
                      
                      // Try placeholder once
                      if (!e.target.src.includes('placeholder')) {
                        e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                        e.target.dataset.attempts = (e.target.dataset.attempts || 0) + 1;
                      }
                    }}
                    onLoad={() => {
                      if (process.env.NODE_ENV === 'development' && idx === 0) {
                        console.log(`✓ Carousel image loaded for product ${product._id}`);
                      }
                    }}
                  />
                </div>
              ) : (
                // Show placeholder for products with no image
                <ProductImagePlaceholder />
              )}
            </div>
          );
        })}
      </div>

      {/* Carousel Dot Indicators */}
      <div className="flex gap-1.5 justify-center mt-3 pb-1">
        {products.slice(0, 3).map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              const node = scrollRef.current;
              if (node) {
                const scrollAmount = (node.clientWidth * 0.8) * idx;
                node.scrollTo({ left: scrollAmount, behavior: 'smooth' });
              }
            }}
            className={`transition-all duration-300 rounded-full ${
              idx === activeIndex
                ? 'bg-voltify-gold w-2 h-2'
                : 'bg-voltify-light/25 w-1.5 h-1.5 hover:bg-voltify-light/40'
            }`}
            aria-label={`Go to product ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

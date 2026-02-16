

// import React, { useRef } from 'react';
// import { Link } from 'react-router-dom';
// // import { Spotlight } from 'reactbits/animations'
// export default function HeroSection() {
//   const scrollRef = useRef(null);

//   const scrollLeft = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
//     }
//   };

//   const latestProducts = [
//     {
//       name: "Pro Laptop",
//       desc: "Supercharged by next-gen processor.",
//       price: "From ₹169900.00*",
//       img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
//       bgColor: "bg-black",
//     },
//     {
//       name: "Flagship Phone",
//       desc: "Ultimate camera system. Titanium design.",
//       price: "From ₹99900.00*",
//       img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80",
//       bgColor: "bg-gradient-to-br from-gray-900 to-black",
//     },
//     {
//       name: "Smart Watch Series",
//       desc: "The ultimate way to track your health.",
//       price: "From ₹46900.00*",
//       img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80",
//       bgColor: "bg-black",
//     },
//     {
//       name: "Wireless Earbuds Pro",
//       desc: "Spatial Audio. Adaptive EQ. Noise cancellation.",
//       price: "From ₹24900.00*",
//       img: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=1200&q=80",
//       bgColor: "bg-gradient-to-br from-orange-900 to-black",
//     },
//     {
//       name: "Gaming Headset",
//       desc: "Immersive sound. RGB lighting.",
//       price: "From ₹17900.00*",
//       img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
//       bgColor: "bg-black",
//     },
//   ];

//   return (
//     <section className="relative bg-white overflow-hidden">
//       {/* Hero main content (unchanged) */}
//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
//         <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 leading-tight">
//           Premium Electronics
//           <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Made Simple
//           </span>
//         </h1>

//         <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
//           Discover the latest gadgets handpicked for performance and style.
//         </p>

//         <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
//           <Link to="/register" className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300">
//             Get Started
//           </Link>
//           <Link to="/products" className="px-10 py-4 border-2 border-gray-300 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition-all duration-300">
//             Browse Products
//           </Link>
//         </div>

//         <div className="mt-12 flex justify-center gap-12 text-gray-700">
//           <div className="text-center">
//             <div className="text-3xl font-bold">5000+</div>
//             <p className="text-sm">Gadgets</p>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl font-bold">4.9★</div>
//             <p className="text-sm">Avg. Rating</p>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl font-bold">24/7</div>
//             <p className="text-sm">Support</p>
//           </div>
//         </div>
//       </div>

//       {/* Full-width "The latest" carousel with transparent arrows */}
//       <div className="mt-16 sm:mt-24 w-full relative">
//         <div className="text-center mb-8 px-4">
//           <h2 className="text-4xl sm:text-5xl font-bold text-red-600">
//             The latest. All-new and loveable.
//           </h2>
//         </div>

//         {/* Carousel container */}
//         <div className="relative">
//           {/* Left Arrow - transparent, only on desktop */}
//           <button
//             onClick={scrollLeft}
//             className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-black/50 hover:border-white/40 transition-all duration-300 shadow-lg"
//             aria-label="Scroll left"
//           >
//             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>

//           {/* Right Arrow - transparent, only on desktop */}
//           <button
//             onClick={scrollRight}
//             className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-black/50 hover:border-white/40 transition-all duration-300 shadow-lg"
//             aria-label="Scroll right"
//           >
//             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </button>

//           {/* Scrollable area */}
//           <div 
//             ref={scrollRef}
//             className="overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory"
//           >
//             <div className="flex gap-6 sm:gap-8 px-4 sm:px-8 min-w-max">
//               {latestProducts.map((product, index) => (
//                 <div
//                   key={index}
//                   className={`group relative w-[85vw] sm:w-[45vw] lg:w-[35vw] xl:w-[30vw] flex-shrink-0 snap-center overflow-hidden rounded-3xl ${product.bgColor} shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:shadow-black/50`}
//                 >
//                   <img
//                     src={product.img}
//                     alt={product.name}
//                     className="w-full h-[60vh] sm:h-[70vh] object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
//                   />
//                   <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
//                     <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
//                       {product.name}
//                     </h3>
//                     <p className="text-base sm:text-lg text-gray-300 mb-1">
//                       {product.desc}
//                     </p>
//                     <p className="text-lg sm:text-xl font-semibold text-white">
//                       {product.price}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="text-center mt-6 text-gray-500 text-sm hidden sm:block">
//           ← Drag or use arrows to explore →
//         </div>
//       </div>
//     </section>
//   );
// }


import React, { useRef, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from '../api';
import { motion } from "framer-motion";
import { CartContext } from "../context/CartContext";
import { Spotlight } from "../context/Spotlight";

export default function HeroSection() {
  const scrollRef = useRef(null);
  const { user } = useContext(CartContext);
  const [isHovering, setIsHovering] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  };

  // Fetch featured products on mount
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/products/featured/list');
        const products = response.data.map(product => ({
          name: product.name,
          desc: product.description,
          price: `₹${product.price.toLocaleString('en-IN')}`,
          img: product.image,
          bgColor: "bg-black",
        }));
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Fallback to empty array if no featured products
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Duplicate products for infinite carousel effect
  const latestProducts = featuredProducts.length > 0 ? [...featuredProducts, ...featuredProducts] : [];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const singleSetWidth = scrollWidth / 2;
    
    // If scrolled past halfway, reset to beginning seamlessly
    if (scrollLeft >= singleSetWidth - 50) {
      scrollRef.current.scrollLeft = 0;
    }
  };

  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      scrollRight();
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Spotlight background */}
      <Spotlight />

      {/* faded hero background image (stops before the product gallery) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[520px] sm:h-[680px] bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/products/image.png')",
          opacity: 0.18,
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        }}
      />

      {/* HERO CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            <div>Top-Tier Smartphones</div>
            <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent mt-1">
              & Essentials
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 80 }}
          className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Explore cutting-edge devices and high-quality accessories from trusted global brands.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 80 }}
          className="mt-6 flex flex-col sm:flex-row justify-center gap-4"
        >
          {!user && (
            <Link
              to="/register"
              className="px-8 py-3 rounded-full text-white font-semibold 
              bg-gradient-to-r from-blue-600 to-cyan-600 
              hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </Link>
          )}

          <Link
            to="/"
            className="px-8 py-3 rounded-full text-white font-semibold 
            bg-gradient-to-r from-blue-600 to-cyan-600 
            hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Browse Products
          </Link>
        </motion.div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 80 }}
          className="mt-8 flex justify-center gap-8 sm:gap-12 text-gray-700"
        >
          <Stat value="5000+" label="Gadgets" />
          <Stat value="4.9★" label="Avg. Rating" />
          <Stat value="24/7" label="Support" />
        </motion.div>
      </div>

      {/* PRODUCT CAROUSEL */}
      <div 
        className="relative mt-8 sm:mt-12"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : latestProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No featured products available yet.</p>
          </div>
        ) : (
          <>
            {/* Arrows */}
            <Arrow direction="left" onClick={scrollLeft} />
            <Arrow direction="right" onClick={scrollRight} />

            {/* Scroll container */}
            <div
              ref={scrollRef}
              className="overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide"
              onScroll={handleScroll}
            >
              <div className="flex gap-8 px-6 min-w-max">
                {latestProducts.map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                    viewport={{ once: false, amount: 0.5 }}
                    className={`group relative w-[85vw] sm:w-[45vw] lg:w-[30vw] 
                    flex-shrink-0 snap-center overflow-hidden rounded-3xl 
                    ${p.bgColor} shadow-2xl transition`}
                  >
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-[60vh] object-cover opacity-90 group-hover:opacity-100 transition"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/600x600?text=Product';
                      }}
                    />

                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
                      <h3 className="text-2xl font-bold text-white">{p.name}</h3>
                      <p className="text-gray-300">{p.desc}</p>
                      <p className="text-white font-semibold mt-1">{p.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <p className="text-center text-gray-500 text-sm hidden sm:block">
              ← Drag or use arrows →
            </p>
          </>
        )}
      </div>
    </section>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold">{value}</div>
      <p className="text-sm">{label}</p>
    </div>
  );
}

function Arrow({ direction, onClick }) {
  const isLeft = direction === "left";

  return (
    <button
      onClick={onClick}
      className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 z-20 
      ${isLeft ? "left-4" : "right-4"} 
      w-14 h-14 items-center justify-center rounded-full 
      bg-black/30 backdrop-blur-md border border-white/20 text-white 
      hover:bg-black/50 transition`}
    >
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isLeft ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}


import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CartContext } from "../context/CartContext";
import { Spotlight } from "../context/Spotlight";
import api from "../api";

export default function HeroSection() {
  const { user } = useContext(CartContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  const handleBrowseProducts = () => {
    const productsSection = document.getElementById('products');
    productsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/products/featured/list');
        setFeaturedProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-50/70">
      <Spotlight />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.12),transparent_42%),radial-gradient(circle_at_10%_90%,rgba(14,165,233,0.08),transparent_35%)]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 lg:pt-14">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.45 }}
          whileHover={{ y: -1 }}
          className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700 shadow-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          Limited Time Sale – Up to 40% OFF
        </motion.div>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="lg:col-span-7 lg:pr-8"
          >
            <h1 className="max-w-3xl text-left text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              India’s fastest way to buy premium tech without overpaying.
            </h1>

            <p className="mt-6 max-w-2xl text-left text-base leading-7 text-slate-600 sm:text-lg">
              Voltify brings flagship phones, tablets and daily accessories with practical pricing, faster delivery and hassle-free support designed for Indian shoppers.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={handleBrowseProducts}
                className="rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg active:translate-y-0"
              >
                Browse Products
              </button>

              {!user && (
                <Link
                  to="/register"
                  className="rounded-xl border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm"
                >
                  Create Account
                </Link>
              )}
            </div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="mt-10 grid max-w-2xl grid-cols-1 gap-3.5 sm:grid-cols-3"
            >
              <TrustBadge title="Free Delivery" subtitle="Across major cities" />
              <TrustBadge title="7-Day Replacement" subtitle="Easy pickup support" />
              <TrustBadge title="Secure Payment" subtitle="UPI, cards & wallets" />
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-5 lg:mt-8"
          >
            <FeaturedCarousel products={featuredProducts} loading={loadingFeatured} />
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-12 border-t border-slate-200 pt-6 lg:ml-6"
        >
          <p className="mb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            Trusted brands available on Voltify
          </p>
          <div className="flex flex-wrap gap-2.5 sm:gap-3.5">
            {['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'iQOO', 'Sony'].map((brand) => (
              <motion.span
                key={brand}
                whileHover={{ y: -2 }}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors duration-300 hover:border-slate-300 hover:bg-slate-100"
              >
                {brand}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function TrustBadge({ title, subtitle }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors duration-300 hover:border-slate-300 hover:bg-slate-50"
    >
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </motion.div>
  );
}

function FeaturedCarousel({ products, loading }) {
  const scrollRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const scrollByAmount = (direction) => {
    const node = scrollRef.current;
    if (!node) return;

    node.scrollBy({
      left: direction === 'right' ? 340 : -340,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (isHovering || !products.length) return;

    const interval = setInterval(() => {
      const node = scrollRef.current;
      if (!node) return;

      const maxScrollLeft = node.scrollWidth - node.clientWidth;
      if (node.scrollLeft >= maxScrollLeft - 8) {
        node.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      node.scrollBy({ left: 320, behavior: 'smooth' });
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovering, products.length]);

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/70">
        <div className="flex h-[360px] items-center justify-center rounded-2xl bg-slate-100 sm:h-[420px]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-b-slate-800" />
        </div>
      </div>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/70"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex justify-end">
        <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          Featured
        </span>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-2xl"
      >
        {products.map((product) => {
          const price = Number(product.price || 0);
          return (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="group relative block h-[360px] min-w-full snap-start overflow-hidden rounded-2xl sm:h-[420px]"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/640x800?text=Featured+Product';
                }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 pt-20">
                <p className="line-clamp-2 text-sm font-semibold text-white">{product.name}</p>
                <p className="mt-1 text-sm font-bold text-white">₹{price.toLocaleString('en-IN')}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 rounded-2xl bg-gradient-to-t from-black/65 via-transparent to-transparent p-4" />

    </motion.div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus(''), 3000);
    }
  };

  return (
    <footer className="bg-voltify-dark text-voltify-light">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Brand Section */}
        <div className="mb-12 pb-8 border-b border-voltify-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-voltify-gold rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-voltify-dark">V</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-voltify-light">Voltify</h1>
          </div>
          <p className="text-voltify-light/50 max-w-sm">
            Premium tech commerce designed for the refined modern professional. 
            Skip the overpricing, embrace the elegant.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Shop Section */}
          <nav aria-labelledby="shop-heading">
            <h2 id="shop-heading" className="text-xs font-display font-bold text-voltify-light mb-6 uppercase tracking-widest">
              Shop
            </h2>
            <ul className="space-y-4 text-sm">
              <li>
                <Link 
                  to="/category/Mobiles" 
                  className="text-voltify-light/60 hover:text-voltify-gold transition duration-300"
                >
                  Mobiles
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/Tablets" 
                  className="text-voltify-light/60 hover:text-voltify-gold transition duration-300"
                >
                  Tablets
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/Audio" 
                  className="text-voltify-light/60 hover:text-voltify-gold transition duration-300"
                >
                  Audio
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/Accessories" 
                  className="text-voltify-light/60 hover:text-voltify-gold transition duration-300"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company Section */}
          <nav aria-labelledby="company-heading">
            <h2 id="company-heading" className="text-xs font-display font-bold text-voltify-light mb-6 uppercase tracking-widest">
              Company
            </h2>
            <ul className="space-y-4 text-sm">
              <li>
                <a 
                  href="#about" 
                  className="text-voltify-light/60 hover:text-voltify-gold transition duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#blog" 
                  className="text-voltify-light/60 hover:text-voltify-gold transition duration-300"
                >
                  Blog
                </a>
              </li>
              <li>
                <a 
                  href="#careers" 
                  className="text-voltify-light/60 hover:text-voltify-gold transition duration-300"
                >
                  Careers
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-voltify-light/60 hover:text-voltify-gold transition duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Seller Section */}
          <nav aria-labelledby="seller-heading">
            <h2 id="seller-heading" className="text-xs font-display font-bold text-voltify-light mb-6 uppercase tracking-widest">
              For Sellers
            </h2>
            <ul className="space-y-4 text-sm">
              <li>
                <Link 
                  to="/become-seller" 
                  className="text-voltify-light/60 hover:text-voltify-gold transition duration-300"
                >
                  Become a Seller
                </Link>
              </li>
              <li>
                <a 
                  href="#seller-faq" 
                  className="text-voltify-light/60 hover:text-voltify-gold transition duration-300"
                >
                  Seller FAQ
                </a>
              </li>
              <li>
                <a 
                  href="#seller-guide" 
                  className="text-voltify-light/60 hover:text-voltify-gold transition duration-300"
                >
                  Seller Guide
                </a>
              </li>
            </ul>
          </nav>

          {/* Legal Section */}
          <nav aria-labelledby="legal-heading">
            <h2 id="legal-heading" className="text-xs font-display font-bold text-voltify-light mb-6 uppercase tracking-widest">
              Legal
            </h2>
            <ul className="space-y-4 text-sm">
              <li>
                <a 
                  href="#terms" 
                  className="text-voltify-light/60 hover:text-voltify-gold transition duration-300"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a 
                  href="#privacy" 
                  className="text-voltify-light/60 hover:text-voltify-gold transition duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#returns" 
                  className="text-voltify-light/60 hover:text-voltify-gold transition duration-300"
                >
                  Returns & Refunds
                </a>
              </li>
            </ul>
          </nav>

          {/* Newsletter Section */}
          <section aria-labelledby="newsletter-heading">
            <h2 id="newsletter-heading" className="text-xs font-display font-bold text-voltify-light mb-6 uppercase tracking-widest">
              Stay Updated
            </h2>
            <p className="text-sm text-voltify-light/60 mb-4">
              Get exclusive offers and tech insights. <span className="text-xs text-voltify-light/40">No spam—unsubscribe anytime.</span>
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Email for newsletter subscription"
                  className="input-field flex-1 bg-voltify-dark border-voltify-border placeholder-voltify-light/40 text-voltify-light focus:ring-voltify-gold"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 bg-voltify-gold text-voltify-dark text-sm font-semibold rounded-xl hover:shadow-lg transition duration-300 whitespace-nowrap"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </motion.button>
              </div>
              {subscribeStatus === 'success' && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-emerald-400"
                >
                  ✓ Thanks for subscribing!
                </motion.p>
              )}
            </form>
          </section>
        </div>

        {/* Contact & Creators Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12 border-t border-voltify-border">
          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-display font-bold text-voltify-light mb-4 uppercase tracking-widest">Contact</h3>
            <ul className="space-y-3 text-sm text-voltify-light/60">
              <li>
                <a 
                  href="mailto:support@voltify.in"
                  className="hover:text-voltify-gold transition duration-300"
                >
                  📧 support@voltify.in
                </a>
              </li>
              <li>
                <a 
                  href="tel:+919889488918"
                  className="hover:text-voltify-gold transition duration-300"
                >
                  📱 +91-9889488918
                </a>
              </li>
              <li className="text-voltify-light/40">
                Mon – Sat, 10:00 AM – 6:00 PM IST
              </li>
            </ul>
          </div>

          {/* Creators Section */}
          <div>
            <h3 className="text-xs font-display font-bold text-voltify-light mb-4 uppercase tracking-widest">Creator</h3>
            <ul className="space-y-3 text-sm text-voltify-light/60">
              <li>
                <strong className="text-voltify-light">Jatin Singh</strong>
                <p className="text-xs text-voltify-light/40 mt-1">Backend & Deployment</p>
                <p className="text-xs text-voltify-light/40 mt-1">Frontend & UI/UX</p>
                <p className="text-xs text-voltify-light/40 mt-1">Product & Testing</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-voltify-border bg-voltify-dark/80 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-voltify-light/50">
          <p>© {new Date().getFullYear()} Voltify. Crafted with precision.</p>
          <div className="flex items-center gap-6">
            <a href="#terms" className="hover:text-voltify-gold transition duration-300">Terms</a>
            <a href="#privacy" className="hover:text-voltify-gold transition duration-300">Privacy</a>
            <a href="#accessibility" className="hover:text-voltify-gold transition duration-300">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

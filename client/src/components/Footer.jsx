import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
    <footer className="mt-24 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Brand Section */}
        <div className="mb-12 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Voltify</h1>
          </div>
          <p className="text-gray-600 max-w-sm">
            A modern online destination for premium electronics and smart gadgets focused on quality, 
            fair pricing, and a smooth shopping experience.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Shop Section */}
          <nav aria-labelledby="shop-heading">
            <h2 id="shop-heading" className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wide">
              Shop
            </h2>
            <ul className="space-y-4 text-sm">
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-600 hover:text-gray-900 transition duration-200"
                >
                  All Products
                </Link>
              </li>
              <li>
                <a 
                  href="#best-sellers" 
                  className="text-gray-600 hover:text-gray-900 transition duration-200"
                >
                  Best Sellers
                </a>
              </li>
            </ul>
          </nav>

          {/* Company Section */}
          <nav aria-labelledby="company-heading">
            <h2 id="company-heading" className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wide">
              Company
            </h2>
            <ul className="space-y-4 text-sm">
              <li>
                <a 
                  href="#about" 
                  className="text-gray-600 hover:text-gray-900 transition duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#press" 
                  className="text-gray-600 hover:text-gray-900 transition duration-200"
                >
                  Press
                </a>
              </li>
              <li>
                <a 
                  href="#careers" 
                  className="text-gray-600 hover:text-gray-900 transition duration-200"
                >
                  Careers
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-gray-600 hover:text-gray-900 transition duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Legal Section */}
          <nav aria-labelledby="legal-heading">
            <h2 id="legal-heading" className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wide">
              Legal
            </h2>
            <ul className="space-y-4 text-sm">
              <li>
                <a 
                  href="#terms" 
                  className="text-gray-600 hover:text-gray-900 transition duration-200"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a 
                  href="#privacy" 
                  className="text-gray-600 hover:text-gray-900 transition duration-200"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#sitemap" 
                  className="text-gray-600 hover:text-gray-900 transition duration-200"
                >
                  Sitemap
                </a>
              </li>
            </ul>
          </nav>

          {/* Newsletter Section */}
          <section aria-labelledby="newsletter-heading">
            <h2 id="newsletter-heading" className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wide">
              Newsletter
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Get updates about exclusive offers and popular tech. <span className="text-xs text-gray-500">No spam — unsubscribe anytime.</span>
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  aria-label="Email for newsletter subscription"
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-200"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </button>
              </div>
              {subscribeStatus === 'success' && (
                <p className="text-xs text-green-600">Thanks for subscribing!</p>
              )}
            </form>
          </section>
        </div>

        {/* Contact & Creators Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12 border-t border-gray-100">
          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a 
                  href="mailto:support@voltify.in"
                  className="hover:text-gray-900 transition duration-200"
                >
                  Email: support@voltify.in
                </a>
              </li>
              <li>
                <a 
                  href="tel:+919889488918"
                  className="hover:text-gray-900 transition duration-200"
                >
                  Phone: +91-9889488918
                </a>
              </li>
              <li className="text-gray-500">
                Support Hours: Monday – Saturday, 10:00 AM – 6:00 PM
              </li>
            </ul>
          </div>

          {/* Creators Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Creators</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <strong className="text-gray-900">Jatin Singh</strong>
                <p className="text-xs text-gray-500">Full-stack development, backend architecture, and deployment</p>
              </li>
              <li>
                <strong className="text-gray-900">Om Gupta</strong>
                <p className="text-xs text-gray-500">Frontend design, UI/UX, and responsiveness</p>
              </li>
              <li>
                <strong className="text-gray-900">Ankit Kumar</strong>
                <p className="text-xs text-gray-500">Product management, testing, and content handling</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-100 bg-white px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Voltify. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#terms" className="hover:text-gray-700 transition duration-200">Terms & Conditions</a>
            <a href="#privacy" className="hover:text-gray-700 transition duration-200">Privacy Policy</a>
            <a href="#sitemap" className="hover:text-gray-700 transition duration-200">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

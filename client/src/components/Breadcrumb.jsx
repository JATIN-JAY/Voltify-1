import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Breadcrumb Component
 * Displays hierarchical navigation with optional mobile abbreviation
 * @param {Array} items - Array of breadcrumb items with label, href (optional for last item)
 * @param {boolean} showMobileAbbreviated - Show abbreviated breadcrumbs on mobile (default: true)
 * @param {string} className - Additional CSS classes
 */
export const Breadcrumb = ({ items = [], showMobileAbbreviated = true, className = '' }) => {
  const [displayItems, setDisplayItems] = useState(items);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const containerRef = useRef(null);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate abbreviated breadcrumbs for mobile
  useEffect(() => {
    if (isMobile && showMobileAbbreviated && items.length > 2) {
      // Show: ... > Category > Product (ellipsis > 2nd last > last)
      const abbreviated = [
        { label: '...', href: null, isEllipsis: true },
        ...items.slice(-2),
      ];
      setDisplayItems(abbreviated);
    } else {
      setDisplayItems(items);
    }
  }, [items, isMobile, showMobileAbbreviated]);

  if (!displayItems || displayItems.length === 0) {
    return null;
  }

  return (
    <nav
      ref={containerRef}
      className={`py-3 px-4 md:px-8 ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-1 flex-wrap text-xs md:text-sm">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          
          return (
            <li key={index} className="flex items-center gap-1">
              {/* Chevron Separator (not shown before first item) */}
              {index > 0 && (
                <span className="text-[#888888] mx-1 md:mx-2 font-light">›</span>
              )}

              {/* Breadcrumb Item */}
              {item.isEllipsis ? (
                // Ellipsis (non-link)
                <motion.span
                  className="text-[#888888] hover:text-[#FDB022] transition-colors cursor-default px-1"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.label}
                </motion.span>
              ) : isLast ? (
                // Last item (non-link, active breadcrumb)
                <motion.span
                  className="text-[#666666] font-medium truncate px-1 max-w-[150px] md:max-w-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.label}
                </motion.span>
              ) : (
                // Clickable breadcrumb items
                <Link
                  to={item.href}
                  className="text-[#888888] hover:text-[#FDB022] transition-colors duration-200 truncate px-1 max-w-[150px] md:max-w-none"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                  >
                    {item.label}
                  </motion.span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

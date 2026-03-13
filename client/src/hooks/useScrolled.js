import { useState, useEffect } from 'react';

/**
 * Custom hook that detects if user has scrolled down the page
 * Useful for dynamic navbar/header styling based on scroll position
 */
export const useScrolled = (threshold = 20) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
};

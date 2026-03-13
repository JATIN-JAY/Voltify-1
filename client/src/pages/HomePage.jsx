import React, { memo } from 'react';
import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/HeroSection';
import { ProductGrid } from '../components/ProductGrid';

/**
 * HomePage Component
 * Displays hero section and featured products
 * Memoized to prevent unnecessary re-renders
 */
const HomePage = memo(() => {
  return (
    <MainLayout>
      <div className="relative">
        <HeroSection />
        <div className="lg:pr-6">
          <ProductGrid />
        </div>
      </div>
    </MainLayout>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;

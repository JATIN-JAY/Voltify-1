import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/HeroSection';
import { ProductGrid } from '../components/ProductGrid';
import { getHomePageSocialMeta } from '../utils/socialMetaTags';

/**
 * HomePage Component
 * Displays hero section and featured products
 * Memoized to prevent unnecessary re-renders
 */
const HomePage = memo(() => {
  const homePageTitle = "Voltify - Premium Tech Store | Phones, Tablets & Audio India";
  const homePageDescription = "Shop premium phones, tablets and audio gear at Voltify. Curated tech for creators and professionals. Free express delivery across India. Verified authentic brands.";
  const logoUrl = "https://voltify.in/images/voltify-logo.png";
  const socialMeta = getHomePageSocialMeta(homePageTitle, homePageDescription, logoUrl);

  return (
    <>
      <Helmet>
        <title>{homePageTitle}</title>
        <meta name="description" content={homePageDescription} />
        <meta name="keywords" content="phones, tablets, audio, tech store, India, premium electronics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f0f0f" />
        
        {/* Open Graph & Twitter Card Meta Tags */}
        {socialMeta.map((meta, idx) => (
          meta.name ? (
            <meta key={idx} name={meta.name} content={meta.content} />
          ) : (
            <meta key={idx} property={meta.property} content={meta.content} />
          )
        ))}
        
        {/* JSON-LD Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Voltify",
            "description": "Premium tech store for phones, tablets, audio gear, and accessories. Curated products for creators and professionals with fast delivery across India.",
            "url": "https://voltify.in",
            "logo": "https://voltify.in/logo.png",
            "sameAs": [
              "https://facebook.com/voltify",
              "https://twitter.com/voltify",
              "https://instagram.com/voltify",
              "https://youtube.com/voltify"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-XXXXXXXXXX",
              "contactType": "Customer Service"
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IN",
              "addressRegion": "India"
            }
          })}
        </script>

        {/* JSON-LD BreadcrumbList Schema for Homepage */}
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
              }
            ]
          })}
        </script>
      </Helmet>
      <MainLayout>
        <div className="relative">
          <HeroSection />
          <div className="lg:pr-6">
            <ProductGrid />
          </div>
        </div>
      </MainLayout>
    </>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;

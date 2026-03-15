/**
 * Utility functions for generating Open Graph and Twitter Card meta tags
 * Ensures consistent social media sharing previews across Voltify
 * All pages must include: og:site_name, og:locale, twitter:card, twitter:title, twitter:description
 */

/**
 * Generate base social meta tags used on all pages
 * Required on every page for consistency
 * @returns {Array} Array of meta tag objects for Helmet
 */
export const getBaseSocialMeta = () => {
  return [
    // Open Graph - Common to all pages
    { property: 'og:site_name', content: 'Voltify' },
    { property: 'og:locale', content: 'en_IN' },
    
    // Twitter - Common to all pages
    { name: 'twitter:site', content: '@Voltify' },
    { name: 'twitter:creator', content: '@Voltify' },
  ];
};

/**
 * Generate homepage social meta tags
 * Homepage is og:type 'website' with logo as og:image
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {string} imageUrl - Image URL for OG and Twitter (Voltify logo recommended)
 * @returns {Array} Array of meta tag objects
 */
export const getHomePageSocialMeta = (title, description, imageUrl) => {
  const baseUrl = window.location.origin || 'https://voltify.in';
  const logoUrl = imageUrl || `${baseUrl}/images/voltify-logo.png`;

  return [
    ...getBaseSocialMeta(),
    // Open Graph - Homepage specific
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title || 'Voltify - Premium Tech Store' },
    { property: 'og:description', content: description || 'Shop premium phones, tablets and audio gear at Voltify' },
    { property: 'og:image', content: logoUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:url', content: baseUrl },
    
    // Twitter Card - Homepage specific
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title || 'Voltify - Premium Tech Store' },
    { name: 'twitter:description', content: description || 'Shop premium phones, tablets and audio gear at Voltify' },
    { name: 'twitter:image', content: logoUrl },
    { name: 'twitter:image:alt', content: 'Voltify - Premium Electronics Store' },
  ];
};

/**
 * Generate product page social meta tags with schema.org/Product type
 * Product pages use og:type 'product' with product-specific price and availability
 * @param {Object} product - Product object with name, price, image, description
 * @param {string} product.name - Product name
 * @param {string} product.brand - Product brand
 * @param {number} product.price - Product price in INR
 * @param {string} product.image - First product image URL
 * @param {string} product.description - Product description
 * @param {string} product.category - Product category
 * @returns {Array} Array of meta tag objects
 */
export const getProductSocialMeta = (product) => {
  if (!product) return getBaseSocialMeta();

  const baseUrl = window.location.origin || 'https://voltify.in';
  const productUrl = window.location.href;
  const productImage = product.image || `${baseUrl}/images/products/placeholder.png`;
  
  // Extract key features for Twitter description (limit to 160 chars)
  const description = product.description 
    ? product.description.substring(0, 160) 
    : `${product.category} - ₹${Number(product.price).toLocaleString('en-IN')} on Voltify`;

  const productTitle = `${product.brand && product.brand !== 'Voltify' ? product.brand + ' ' : ''}${product.name || product.category}`.trim();

  return [
    ...getBaseSocialMeta(),
    // Open Graph - Product Type
    { property: 'og:type', content: 'product' },
    { property: 'og:title', content: `${productTitle} - Buy on Voltify` },
    { property: 'og:description', content: description },
    { property: 'og:image', content: productImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:type', content: 'image/jpeg' },
    { property: 'og:url', content: productUrl },
    
    // Product-specific OG tags (Facebook recognizes these)
    { property: 'product:category', content: product.category || 'Electronics' },
    { property: 'product:price:amount', content: String(product.price) },
    { property: 'product:price:currency', content: 'INR' },
    { property: 'product:brand', content: product.brand || 'Voltify' },
    { property: 'product:availability', content: product.stock && product.stock > 0 ? 'in_stock' : 'out_of_stock' },
    
    // Twitter Card - Product specific
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${productTitle} - Buy on Voltify` },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: productImage },
    { name: 'twitter:image:alt', content: `${productTitle} product image` },
  ];
};

/**
 * Generate category page social meta tags
 * Categories are og:type 'website' with category-specific images
 * @param {string} categoryName - Category name (e.g., 'Mobiles', 'Tablets')
 * @param {string} description - Category description
 * @param {string} imageUrl - Category image URL
 * @returns {Array} Array of meta tag objects
 */
export const getCategorySocialMeta = (categoryName, description, imageUrl) => {
  const baseUrl = window.location.origin || 'https://voltify.in';
  const categoryUrl = window.location.href;
  const categoryImage = imageUrl || `${baseUrl}/images/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}.png`;

  const ctgDesc = description || `Browse ${categoryName} on Voltify. Shop the latest ${categoryName.toLowerCase()} with premium quality and fast delivery across India.`;

  return [
    ...getBaseSocialMeta(),
    // Open Graph - Category page
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: `Buy ${categoryName} | Voltify` },
    { property: 'og:description', content: ctgDesc },
    { property: 'og:image', content: categoryImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:url', content: categoryUrl },
    
    // Twitter Card - Category specific
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${categoryName} | Voltify` },
    { name: 'twitter:description', content: ctgDesc },
    { name: 'twitter:image', content: categoryImage },
    { name: 'twitter:image:alt', content: `${categoryName} on Voltify` },
  ];
};

/**
 * Generate generic page social meta tags for other pages (Auth, Profile, Orders, etc)
 * Generic pages are og:type 'website' with Voltify logo as og:image
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {string} imageUrl - Image URL (optional, defaults to Voltify logo)
 * @returns {Array} Array of meta tag objects
 */
export const getGenericSocialMeta = (title, description, imageUrl = null) => {
  const baseUrl = window.location.origin || 'https://voltify.in';
  const pageUrl = window.location.href;
  const image = imageUrl || `${baseUrl}/images/voltify-logo.png`;

  return [
    ...getBaseSocialMeta(),
    // Open Graph - Generic page
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title || 'Voltify' },
    { property: 'og:description', content: description || 'Premium Electronics Store' },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:url', content: pageUrl },
    
    // Twitter Card - Generic page
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title || 'Voltify' },
    { name: 'twitter:description', content: description || 'Premium Electronics Store' },
    { name: 'twitter:image', content: image },
    { name: 'twitter:image:alt', content: title || 'Voltify' },
  ];
};

/**
 * Breadcrumb utility functions for Voltify
 * Generates breadcrumb items and JSON-LD BreadcrumbList schema
 */

/**
 * Generate breadcrumb items for home page
 * Items: Home
 * @returns {Array} Breadcrumb items array
 */
export const getHomeBreadcrumbs = () => {
  return [
    { label: 'Home', href: '/' },
  ];
};

/**
 * Generate breadcrumb items for category page
 * Items: Home > Category
 * @param {string} categoryName - Category name (e.g., 'Mobiles', 'Tablets')
 * @param {string} categorySlug - URL-friendly category slug
 * @returns {Array} Breadcrumb items array
 */
export const getCategoryBreadcrumbs = (categoryName, categorySlug) => {
  return [
    { label: 'Home', href: '/' },
    { label: categoryName, href: `/${categorySlug}` },
  ];
};

/**
 * Generate breadcrumb items for product detail page
 * Items: Home > Category > Brand > ProductName
 * @param {Object} product - Product object
 * @param {string} product.name - Product name
 * @param {string} product.brand - Product brand
 * @param {string} product.category - Product category
 * @param {string} product.slug - Product slug for URL
 * @returns {Array} Breadcrumb items array
 */
export const getProductBreadcrumbs = (product) => {
  if (!product) return getHomeBreadcrumbs();

  const categorySlug = product.category.toLowerCase().replace(/\s+/g, '-');

  return [
    { label: 'Home', href: '/' },
    { label: product.category, href: `/${categorySlug}` },
    { label: product.brand || 'Brand', href: null }, // Brand may not have separate route
    { label: product.name, href: null }, // Current page - non-link
  ];
};

/**
 * Generate breadcrumb items for cart page
 * Items: Home > Cart
 * @returns {Array} Breadcrumb items array
 */
export const getCartBreadcrumbs = () => {
  return [
    { label: 'Home', href: '/' },
    { label: 'Cart', href: null }, // Current page - non-link
  ];
};

/**
 * Generate breadcrumb items for checkout page
 * Items: Home > Checkout
 * @returns {Array} Breadcrumb items array
 */
export const getCheckoutBreadcrumbs = () => {
  return [
    { label: 'Home', href: '/' },
    { label: 'Checkout', href: null }, // Current page - non-link
  ];
};

/**
 * Generate JSON-LD BreadcrumbList schema matching visible breadcrumbs
 * Required for rich snippets in search results
 * @param {Array} breadcrumbItems - Array of breadcrumb items
 * @param {string} currentUrl - Current page URL (defaults to window.location.href)
 * @returns {Object} JSON-LD BreadcrumbList schema
 */
export const generateBreadcrumbSchema = (breadcrumbItems, currentUrl = null) => {
  const baseUrl = window.location.origin || 'https://voltify.in';
  const url = currentUrl || window.location.href;

  // Filter out ellipsis items for schema
  const validItems = breadcrumbItems.filter(item => !item.isEllipsis);

  const itemListElement = validItems.map((item, index) => {
    const itemUrl = item.href ? `${baseUrl}${item.href}` : url;

    return {
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: itemUrl,
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
};

/**
 * Get category slug from category name
 * Converts "Mobiles" -> "mobiles", "Phone Cases" -> "phone-cases"
 * @param {string} categoryName - Category name
 * @returns {string} URL-friendly slug
 */
export const getCategorySlug = (categoryName) => {
  return categoryName.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Helper to build complete breadcrumb path with all necessary info
 * Useful for pages that need breadcrumbs with schema
 * @param {Array} items - Breadcrumb items
 * @returns {Object} Object with items and schema
 */
export const buildBreadcrumbData = (items) => {
  return {
    items,
    schema: generateBreadcrumbSchema(items),
  };
};

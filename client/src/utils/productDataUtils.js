/**
 * Product Data Utilities
 * Normalize and clean product data across the application
 */

/**
 * Strip trailing pipe characters from product names
 * @param {string} name - Product name potentially with trailing pipes
 * @returns {string} Cleaned product name
 */
export function cleanProductName(name) {
  if (!name || typeof name !== 'string') return '';
  return name.replace(/\s*\|\s*$/, '').trim();
}

/**
 * Normalize product data by cleaning all text fields
 * @param {Object} product - Raw product object
 * @returns {Object} Normalized product object
 */
export function normalizeProduct(product) {
  if (!product) return null;
  
  return {
    ...product,
    name: cleanProductName(product.name),
    brand: cleanProductName(product.brand),
    category: cleanProductName(product.category),
    description: cleanProductName(product.description),
  };
}

/**
 * Normalize array of products
 * @param {Array} products - Array of product objects
 * @returns {Array} Array of normalized products
 */
export function normalizeProducts(products) {
  if (!Array.isArray(products)) return [];
  return products.map(normalizeProduct);
}

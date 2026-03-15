/**
 * Server-side Product Data Utilities
 * Normalize and clean product data at the data layer
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
 * Normalize product document - clean all text fields
 * @param {Object} product - Product document from MongoDB
 * @returns {Object} Normalized product object
 */
export function normalizeProduct(product) {
  if (!product) return null;
  
  // Create a plain object from Mongoose document
  const plain = product.toObject ? product.toObject() : product;
  
  return {
    ...plain,
    name: cleanProductName(plain.name),
    brand: cleanProductName(plain.brand),
    category: cleanProductName(plain.category),
    description: cleanProductName(plain.description),
  };
}

/**
 * Normalize array of products
 * @param {Array} products - Array of product documents
 * @returns {Array} Array of normalized products
 */
export function normalizeProducts(products) {
  if (!Array.isArray(products)) return [];
  return products.map(normalizeProduct);
}

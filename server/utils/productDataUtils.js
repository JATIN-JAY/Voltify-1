/**
 * Server-side Product Data Utilities
 * Normalize and clean product data at the data layer
 */

/**
 * Strip trailing pipe characters and special characters from product names
 * Removes: trailing pipes, extra spaces, control characters
 * @param {string} name - Product name potentially with trailing pipes/special chars
 * @returns {string} Cleaned product name
 */
export function cleanProductName(name) {
  if (!name || typeof name !== 'string') return '';
  
  return (
    name
      .replace(/\s*\|\s*$/g, '')  // Remove trailing pipe and surrounding spaces
      .replace(/[\x00-\x1F\x7F]/g, '')  // Remove control characters
      .replace(/\s+/g, ' ')  // Collapse multiple spaces
      .trim()
  );
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

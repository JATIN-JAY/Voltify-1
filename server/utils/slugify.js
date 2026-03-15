/**
 * Convert a string into a URL-friendly slug
 * Example: 'Apple iPhone 17 Pro 512GB' -> 'apple-iphone-17-pro-512gb'
 * 
 * Rules:
 * - Convert to lowercase
 * - Remove special characters (keep alphanumeric, hyphens, spaces)
 * - Replace spaces with hyphens
 * - Remove consecutive hyphens
 * - Trim hyphens from start/end
 */
export function slugify(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()                    // Convert to lowercase
    .trim()                           // Remove leading/trailing whitespace
    .replace(/[^\w\s-]/g, '')         // Remove special characters (keep alphanumeric, spaces, hyphens)
    .replace(/\s+/g, '-')             // Replace spaces with hyphens
    .replace(/-+/g, '-')              // Replace consecutive hyphens with single hyphen
    .replace(/^-+|-+$/g, '');         // Remove hyphens from start and end
}

/**
 * Generate a unique slug by appending a counter to ensure uniqueness
 * This is called during saves when slug conflicts are detected
 */
export function generateUniqueSlug(baseSlug, existingSlugs) {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  
  let counter = 1;
  let newSlug = `${baseSlug}-${counter}`;
  
  while (existingSlugs.includes(newSlug)) {
    counter++;
    newSlug = `${baseSlug}-${counter}`;
  }
  
  return newSlug;
}

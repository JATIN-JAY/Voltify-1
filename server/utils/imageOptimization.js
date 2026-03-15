import sharp from 'sharp';

/**
 * Optimize image by resizing and converting to WebP format
 * - Max width: 800px (preserves aspect ratio)
 * - Format: WebP (modern format with better compression)
 * - Quality: 80 (good balance between quality and file size)
 * 
 * @param {Buffer} imageBuffer - The image file buffer
 * @returns {Promise<Buffer>} - Optimized image buffer in WebP format
 * @throws {Error} - If image processing fails
 */
export const optimizeImage = async (imageBuffer) => {
  try {
    const optimizedBuffer = await sharp(imageBuffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    return optimizedBuffer;
  } catch (error) {
    console.error('Image optimization error:', error);
    throw new Error(`Failed to optimize image: ${error.message}`);
  }
};

/**
 * Get image dimensions without loading entire image into memory
 * Useful for generating width/height attributes for HTML img tags
 * 
 * @param {Buffer} imageBuffer - The image file buffer
 * @returns {Promise<{width: number, height: number}>} - Image dimensions
 * @throws {Error} - If unable to read image dimensions
 */
export const getImageDimensions = async (imageBuffer) => {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
    };
  } catch (error) {
    console.error('Error reading image dimensions:', error);
    throw new Error(`Failed to read image dimensions: ${error.message}`);
  }
};

/**
 * Process image buffer: optimize and get metadata
 * Combines optimization with dimension extraction
 * 
 * @param {Buffer} imageBuffer - The image file buffer
 * @returns {Promise<{buffer: Buffer, dimensions: {width: number, height: number}}>}
 */
export const processImage = async (imageBuffer) => {
  try {
    // Get original dimensions for aspect ratio preservation
    const originalMetadata = await sharp(imageBuffer).metadata();
    
    // Optimize the image
    const optimizedBuffer = await optimizeImage(imageBuffer);
    
    // Get optimized dimensions
    const optimizedMetadata = await sharp(optimizedBuffer).metadata();

    return {
      buffer: optimizedBuffer,
      dimensions: {
        original: {
          width: originalMetadata.width,
          height: originalMetadata.height,
        },
        optimized: {
          width: optimizedMetadata.width,
          height: optimizedMetadata.height,
        },
      },
    };
  } catch (error) {
    console.error('Image processing error:', error);
    throw error;
  }
};

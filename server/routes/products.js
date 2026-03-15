import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';
import { verifyToken, checkAdmin } from '../middleware/auth.js';
import { normalizeProducts, normalizeProduct } from '../utils/productDataUtils.js';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const ensureDatabaseReady = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'Database unavailable. Please try again shortly.' });
    return false;
  }
  return true;
};

// Get featured products only - MUST be before /:id route
// Filters: featured flag + minimum price ₹10,000 + excludes accessories/cases
// Limit to 3 products, sorted by most recently added
router.get('/featured/list', async (req, res) => {
  if (!isDatabaseReady()) {
    return res.json([]);
  }

  try {
    const excludedCategories = [
      'Accessories',
      'Cases',
      'Phone Covers',
      'Screen Protector',
      'USB Cable',
      'Charger',
      'Cable',
      'Stand'
    ];

    const products = await Product.find({
      featured: true,
      price: { $gte: 10000 },
      category: { $nin: excludedCategories }
    })
      .sort({ createdAt: -1 })  // Most recently added first
      .limit(3);                 // Maximum 3 products for carousel

    // Normalize product data at the server layer
    const normalizedProducts = normalizeProducts(products);
    
    res.json(normalizedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  if (!isDatabaseReady()) {
    return res.json([]);
  }

  try {
    const products = await Product.find();
    const normalizedProducts = normalizeProducts(products);
    res.json(normalizedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  if (!ensureDatabaseReady(res)) return;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const normalizedProduct = normalizeProduct(product);
    res.json(normalizedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (admin only)
router.post('/', verifyToken, checkAdmin, async (req, res) => {
  if (!ensureDatabaseReady(res)) return;

  try {
    const { name, price, category, brand, description, imageUrl, featured } = req.body;

    // Validate required fields
    if (!name || !price || !category || !brand || !description || !imageUrl) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new product
    const product = new Product({
      name,
      price: parseFloat(price),
      category,
      brand,
      description,
      image: imageUrl,
      featured: featured ?? false,
    });

    await product.save();

    const normalizedProduct = normalizeProduct(product);
    res.status(201).json({
      message: 'Product created successfully',
      product: normalizedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', verifyToken, checkAdmin, async (req, res) => {
  if (!ensureDatabaseReady(res)) return;

  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product (admin only)
router.put('/:id', verifyToken, checkAdmin, async (req, res) => {
  if (!ensureDatabaseReady(res)) return;

  try {
    const { name, price, category, brand, description, imageUrl, featured } = req.body;

    // Build update object dynamically with provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category !== undefined) updateData.category = category;
    if (brand !== undefined) updateData.brand = brand;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.image = imageUrl;
    if (featured !== undefined) updateData.featured = featured;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const normalizedProduct = normalizeProduct(product);
    res.json({ message: 'Product updated successfully', product: normalizedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Partial update product (admin only) - e.g. toggle featured status
router.patch('/:id', verifyToken, checkAdmin, async (req, res) => {
  if (!ensureDatabaseReady(res)) return;

  try {
    const { featured } = req.body;

    // Build update object for provided fields only
    const updateData = {};
    if (featured !== undefined) updateData.featured = featured;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const normalizedProduct = normalizeProduct(product);
    res.json({ message: 'Product updated successfully', product: normalizedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle featured status with 5-product limit validation (admin only)
router.patch('/:id/featured', verifyToken, checkAdmin, async (req, res) => {
  if (!ensureDatabaseReady(res)) return;

  try {
    const { featured } = req.body;

    if (featured === undefined) {
      return res.status(400).json({ message: 'Featured status required' });
    }

    // If trying to set featured to true, check the 5-product limit
    if (featured === true) {
      const currentlyFeaturedCount = await Product.countDocuments({ featured: true });
      
      if (currentlyFeaturedCount >= 5) {
        return res.status(400).json({ 
          message: 'Maximum 5 featured products allowed. Unfeature another product first.',
          currentCount: currentlyFeaturedCount,
          maxAllowed: 5
        });
      }
    }

    // Update only the featured field
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { featured },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const normalizedProduct = normalizeProduct(product);
    res.status(200).json({ 
      message: `Product ${featured ? 'featured' : 'unfeatured'} successfully`, 
      product: normalizedProduct
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload image to Cloudinary (admin only)
router.post('/upload/image', verifyToken, checkAdmin, async (req, res) => {
  const multer = (await import('multer')).default;
  const upload = multer({ storage: multer.memoryStorage() });

  // Handle file upload
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload failed' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    try {
      // Upload to Cloudinary from buffer
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'voltify_products', resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      res.json({ 
        message: 'Image uploaded successfully',
        imageUrl: result.secure_url 
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload image: ' + error.message });
    }
  });
});

export default router;

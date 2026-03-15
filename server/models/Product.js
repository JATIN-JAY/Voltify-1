import mongoose from 'mongoose';
import { slugify, generateUniqueSlug } from '../utils/slugify.js';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Mobiles', 'Tablets', 'Audio', 'Phone Case', 'Accessories'],
  },
  brand: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to auto-generate slug from name
productSchema.pre('save', async function (next) {
  if (!this.isModified('name') && this.slug) {
    return next();
  }

  try {
    const baseSlug = slugify(this.name);
    
    // Check for existing slugs to ensure uniqueness
    const existingSlugs = await mongoose.model('Product')
      .find({ slug: { $regex: `^${baseSlug}(-\\d+)?$` } }, { slug: 1 })
      .exec();

    const existingSlugsArray = existingSlugs.map(doc => doc.slug);
    this.slug = generateUniqueSlug(baseSlug, existingSlugsArray);

    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Product', productSchema);

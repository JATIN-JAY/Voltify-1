import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['storage', 'color'],
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  priceModifier: {
    type: Number,
    default: 0, // Price difference from base price
  },
});

const sellerProductSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Basic Info
  name: {
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
  description: {
    type: String,
    required: true,
  },

  // Pricing
  price: {
    type: Number,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },

  // Stock
  stock: {
    type: Number,
    required: true,
    default: 0,
  },

  // Images (support multiple)
  images: [{
    type: String, // Cloudinary URLs
    required: true,
  }],

  // Key Specifications
  keySpecs: [{
    key: String,
    value: String,
  }],

  // Variants (storage, color, etc.)
  variants: [variantSchema],

  // Status & Approval
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: {
    type: String,
    default: '',
  },

  // Metrics
  totalSold: {
    type: Number,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },

  // Admin Fields
  commissionRate: {
    type: Number,
    default: 10, // 10% by default
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('SellerProduct', sellerProductSchema);

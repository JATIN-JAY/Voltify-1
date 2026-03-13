import mongoose from 'mongoose';

const sellerEarningsSchema = new mongoose.Schema({
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

  // Transaction Info
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SellerProduct',
    required: true,
  },

  // Amount Breakdown
  grossAmount: {
    type: Number,
    required: true, // Total order value for this product
  },
  commissionRate: {
    type: Number,
    required: true, // Commission percentage at time of order
  },
  commissionAmount: {
    type: Number,
    required: true, // Amount deducted as commission
  },
  netAmount: {
    type: Number,
    required: true, // grossAmount - commissionAmount
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'failed'],
    default: 'pending',
  },

  // Payout Info
  payoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SellerPayout',
    default: null,
  },
  paidAt: {
    type: Date,
    default: null,
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create index for faster queries
sellerEarningsSchema.index({ sellerId: 1, createdAt: -1 });
sellerEarningsSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('SellerEarnings', sellerEarningsSchema);

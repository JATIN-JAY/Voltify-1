import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  
  // Step 1: Business Details
  storeName: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    enum: ['Individual', 'Partnership', 'Private Limited', 'LLP', 'Public Limited'],
    required: true,
  },
  gstNumber: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },

  // Step 2: Bank Details
  bankName: {
    type: String,
    required: true,
  },
  accountHolderName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  ifscCode: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ['Savings', 'Current'],
    required: true,
  },

  // Step 3: Documents
  gstCertificate: {
    type: String, // URL to Cloudinary
    required: true,
  },
  idProof: {
    type: String, // URL to Cloudinary
    required: true,
  },
  idProofType: {
    type: String,
    enum: ['Aadhaar', 'PAN', 'Passport', 'Voter ID'],
    required: true,
  },

  // Status & Review
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: {
    type: String,
    default: '',
  },

  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: {
    type: Date,
    default: null,
  },
  rejectedAt: {
    type: Date,
    default: null,
  },

  // Additional Info
  commissionRate: {
    type: Number,
    default: 10, // 10% commission by default
  },
  totalListings: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('Seller', sellerSchema);

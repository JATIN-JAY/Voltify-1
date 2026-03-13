import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    default: null,
    unique: true,
    sparse: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    default: '',
  },
  addresses: [
    {
      fullName: {
        type: String,
        default: '',
      },
      address: {
        type: String,
        default: '',
      },
      city: {
        type: String,
        default: '',
      },
      zipCode: {
        type: String,
        default: '',
      },
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    category: {
      type: String,
      enum: ['Bug Report', 'Feature Request', 'UI/UX', 'Performance', 'Other'],
      default: 'Other'
    },
    message: {
      type: String,
      required: [true, 'Feedback message is required'],
      trim: true,
      minlength: [10, 'Feedback must be at least 10 characters long'],
      maxlength: [2000, 'Feedback cannot exceed 2000 characters']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    status: {
      type: String,
      enum: ['New', 'Reviewed', 'In Progress', 'Resolved'],
      default: 'New'
    },
    adminNotes: {
      type: String,
      trim: true,
      default: ''
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Ensure email index for quick lookups
feedbackSchema.index({ email: 1 });
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ createdAt: -1 });

export default mongoose.model('Feedback', feedbackSchema);

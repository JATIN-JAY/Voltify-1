import express from 'express';
import Feedback from '../models/Feedback.js';
import { verifyToken, checkAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * Submit feedback (public route)
 * POST /api/feedback
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, category, message, rating } = req.body;

    // Validation
    if (!name || !email || !message || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (message.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Feedback must be at least 10 characters long'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const feedback = new Feedback({
      name,
      email,
      category: category || 'Other',
      message,
      rating
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! We appreciate your input.',
      feedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback. Please try again.'
    });
  }
});

/**
 * Get all feedbacks (admin only)
 * GET /api/feedback/admin/all
 */
router.get('/admin/all', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { status, sortBy } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'rating') {
      sort = { rating: -1 };
    } else if (sortBy === 'newest') {
      sort = { createdAt: -1 };
    } else if (sortBy === 'oldest') {
      sort = { createdAt: 1 };
    }

    const feedbacks = await Feedback.find(query).sort(sort);

    // Mark as read
    await Feedback.updateMany(query, { isRead: true });

    res.json({
      success: true,
      count: feedbacks.length,
      feedbacks
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedbacks'
    });
  }
});

/**
 * Get feedback by ID and update (admin only)
 * PUT /api/feedback/admin/:id
 */
router.put('/admin/:id', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        status: status || undefined,
        adminNotes: adminNotes || undefined,
        isRead: true
      },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating feedback'
    });
  }
});

/**
 * Delete feedback (admin only)
 * DELETE /api/feedback/admin/:id
 */
router.delete('/admin/:id', verifyToken, checkAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting feedback'
    });
  }
});

/**
 * Get feedback stats (admin only)
 * GET /api/feedback/admin/stats
 */
router.get('/admin/stats', verifyToken, checkAdmin, async (req, res) => {
  try {
    const totalFeedbacks = await Feedback.countDocuments();
    const unreadCount = await Feedback.countDocuments({ isRead: false });
    const averageRating = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    
    const statusCounts = await Feedback.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalFeedbacks,
        unreadCount,
        averageRating: averageRating[0]?.avgRating?.toFixed(2) || 0,
        statusCounts
      }
    });
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback stats'
    });
  }
});

export default router;

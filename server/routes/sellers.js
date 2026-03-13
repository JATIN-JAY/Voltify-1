import express from 'express';
import mongoose from 'mongoose';
import Seller from '../models/Seller.js';
import User from '../models/User.js';
import { verifyToken, checkAdmin } from '../middleware/auth.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Register as Seller
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { 
      storeName, 
      businessType, 
      gstNumber, 
      description,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      accountType,
      gstCertificate,
      idProof,
      idProofType,
    } = req.body;

    // Validate required fields
    if (!storeName || !businessType || !gstNumber || !bankName || !accountHolderName || 
        !accountNumber || !ifscCode || !accountType || !gstCertificate || !idProof || !idProofType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already has a seller account
    const existingSeller = await Seller.findOne({ userId: req.userId });
    if (existingSeller) {
      return res.status(400).json({ message: 'You already have a seller account' });
    }

    // Check if GST number is already registered
    const gstExists = await Seller.findOne({ gstNumber });
    if (gstExists) {
      return res.status(400).json({ message: 'This GST number is already registered' });
    }

    // Create seller account
    const seller = new Seller({
      userId: req.userId,
      storeName,
      businessType,
      gstNumber,
      description,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      accountType,
      gstCertificate,
      idProof,
      idProofType,
      status: 'pending',
    });

    await seller.save();

    // Send confirmation email to seller
    const user = await User.findById(req.userId);
    if (user && user.email) {
      try {
        await transporter.sendMail({
          to: user.email,
          subject: 'Seller Application Received - Voltify',
          html: `
            <h2>Welcome to Voltify Seller Network!</h2>
            <p>Hi ${user.name},</p>
            <p>Your seller application has been received and is under review.</p>
            <p><strong>Estimated approval time: 48 hours</strong></p>
            <p>We'll notify you via email once your application is reviewed.</p>
            <p>Store Name: <strong>${storeName}</strong></p>
            <p>Thank you for joining Voltify!</p>
            <p>Best regards,<br/>Voltify Team</p>
          `,
        });
      } catch (emailError) {
        console.log('Email sending failed:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      message: 'Seller application submitted successfully',
      seller: {
        _id: seller._id,
        storeName: seller.storeName,
        status: seller.status,
        submittedAt: seller.submittedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seller status
router.get('/status', verifyToken, async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.userId }).select('-bankName -accountNumber -ifscCode');

    if (!seller) {
      return res.status(404).json({ message: 'Seller account not found' });
    }

    res.json({
      seller,
      approvalEstimate: '48 hours',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single seller (for admin review)
router.get('/admin/seller/:id', verifyToken, checkAdmin, async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).populate('userId', 'name email phone');

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.json({ seller });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all pending sellers (admin only)
router.get('/admin/pending', verifyToken, checkAdmin, async (req, res) => {
  try {
    const sellers = await Seller.find({ status: 'pending' })
      .populate('userId', 'name email')
      .sort({ submittedAt: -1 });

    res.json({ sellers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve seller (admin only)
router.post('/admin/approve/:id', verifyToken, checkAdmin, async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email');

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Send approval email
    if (seller.userId && seller.userId.email) {
      try {
        await transporter.sendMail({
          to: seller.userId.email,
          subject: '✓ Seller Account Approved - Voltify',
          html: `
            <h2>Congratulations! Your Seller Account is Approved</h2>
            <p>Hi ${seller.userId.name},</p>
            <p>Your seller application for <strong>${seller.storeName}</strong> has been approved!</p>
            <p>You can now start uploading products and selling on Voltify marketplace.</p>
            <p><a href="https://voltify.com/seller/dashboard" style="background-color: #e8a020; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Go to Seller Dashboard</a></p>
            <p>Best regards,<br/>Voltify Team</p>
          `,
        });
      } catch (emailError) {
        console.log('Email sending failed:', emailError);
      }
    }

    res.json({ message: 'Seller approved successfully', seller });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject seller (admin only)
router.post('/admin/reject/:id', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason, rejectedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email');

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Send rejection email
    if (seller.userId && seller.userId.email) {
      try {
        await transporter.sendMail({
          to: seller.userId.email,
          subject: 'Seller Application Status - Voltify',
          html: `
            <h2>Your Seller Application Status</h2>
            <p>Hi ${seller.userId.name},</p>
            <p>Unfortunately, your seller application for <strong>${seller.storeName}</strong> has been rejected.</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p>Please review the feedback and reapply with corrected information.</p>
            <p>If you have any questions, please contact our support team.</p>
            <p>Best regards,<br/>Voltify Team</p>
          `,
        });
      } catch (emailError) {
        console.log('Email sending failed:', emailError);
      }
    }

    res.json({ message: 'Seller rejected successfully', seller });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

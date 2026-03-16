import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify Google token and create/login user
router.post('/signin', async (req, res) => {
  try {
    const { token } = req.body;

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user via Google
      user = new User({
        googleId: sub,
        email,
        name,
        avatar: picture,
        password: null, // No password for Google auth
        isVerified: true // Auto-verify Google users
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = sub;
      user.avatar = user.avatar || picture;
      await user.save();
    }

    // Generate JWT
    const authToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Google authentication successful',
      token: authToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Google auth error:', error.message);
    
    // Better error handling for debugging
    if (error.message.includes('Invalid value for audience')) {
      res.status(401).json({ 
        error: 'Invalid Google Client ID. Check GOOGLE_CLIENT_ID in .env',
        details: 'GOOGLE_CLIENT_ID might not match Google Console credentials'
      });
    } else if (error.message.includes('Audience mismatch')) {
      res.status(401).json({ 
        error: 'Google token audience mismatch',
        details: 'Token was issued for different client'
      });
    } else {
      res.status(401).json({ 
        error: 'Google authentication failed',
        details: error.message 
      });
    }
  }
});

export default router;

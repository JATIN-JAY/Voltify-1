import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@voltify.com';
    const adminPassword = 'admin123'; // Change this in production!

    console.log(`Checking if admin user exists with email: ${adminEmail}`);
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Updating existing user...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      existingAdmin.password = hashedPassword;
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.log('✓ Admin user updated with new password and admin privileges');
    } else {
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const admin = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      });
      await admin.save();
      console.log('✓ Admin user created successfully');
    }

    console.log('\n--- Admin Account Details ---');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('⚠️  IMPORTANT: Change this password immediately after first login!');
    console.log('--- End Details ---\n');

    await mongoose.disconnect();
    console.log('✓ Database connection closed');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();

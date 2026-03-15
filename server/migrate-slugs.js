/**
 * Migration script to add slugs to existing products
 * Run this once after updating the Product schema
 * 
 * Usage: node migrate-slugs.js
 */

import mongoose from 'mongoose';
import Product from './models/Product.js';
import { slugify, generateUniqueSlug } from './utils/slugify.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrateProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ Connected to MongoDB');

    // Get all products without slugs
    const products = await Product.find({ $or: [{ slug: null }, { slug: { $exists: false } }] });
    console.log(`Found ${products.length} products without slugs`);

    let migratedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        // Generate slug from name
        const baseSlug = slugify(product.name);

        // Check for existing slugs to ensure uniqueness
        const existingSlugs = await Product.find(
          { slug: { $regex: `^${baseSlug}(-\\d+)?$` } },
          { slug: 1 }
        );

        const existingSlugsArray = existingSlugs.map(doc => doc.slug).filter(s => s);
        const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugsArray);

        // Update the product with the new slug
        product.slug = uniqueSlug;
        await product.save();

        migratedCount++;
        console.log(`✓ [${migratedCount}] ${product.name} -> ${uniqueSlug}`);
      } catch (error) {
        errorCount++;
        console.error(`✗ Error migrating product ${product.name}:`, error.message);
      }
    }

    console.log(`\n✓ Migration complete!`);
    console.log(`  - Migrated: ${migratedCount}`);
    console.log(`  - Errors: ${errorCount}`);

    await mongoose.connection.close();
    console.log('✓ Database connection closed');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

migrateProducts();

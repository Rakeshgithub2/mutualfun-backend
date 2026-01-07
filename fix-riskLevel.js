/**
 * Fix enum field values in database
 * Converts capitalized to lowercase for category and riskLevel
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Connect directly without using model to bypass validation
async function fixEnumFields() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.DATABASE_URL || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collection = db.collection('funds');

    // Find all funds with capitalized category or riskLevel
    const fundsToFix = await collection
      .find({
        $or: [
          {
            category: {
              $in: [
                'Equity',
                'Debt',
                'Hybrid',
                'Solution Oriented',
                'Other',
                'Commodity',
              ],
            },
          },
          {
            riskLevel: {
              $in: [
                'Low',
                'Moderate',
                'High',
                'Very High',
                'Low to Moderate',
                'Moderately High',
              ],
            },
          },
        ],
      })
      .toArray();

    console.log(
      `📊 Found ${fundsToFix.length} funds with capitalized enum values\n`
    );

    let fixed = 0;
    for (const fund of fundsToFix) {
      const updates = {};

      // Fix category
      if (fund.category) {
        const oldCategory = fund.category;
        if (oldCategory === 'Equity') updates.category = 'equity';
        else if (oldCategory === 'Debt') updates.category = 'debt';
        else if (oldCategory === 'Hybrid') updates.category = 'hybrid';
        else if (oldCategory === 'Solution Oriented')
          updates.category = 'solution oriented';
        else if (oldCategory === 'Other') updates.category = 'other';
        else if (oldCategory === 'Commodity') updates.category = 'commodity';
      }

      // Fix riskLevel
      if (fund.riskLevel) {
        const oldRisk = fund.riskLevel;
        if (oldRisk === 'Low') updates.riskLevel = 'low';
        else if (oldRisk === 'Low to Moderate')
          updates.riskLevel = 'low to moderate';
        else if (oldRisk === 'Moderate') updates.riskLevel = 'moderate';
        else if (oldRisk === 'Moderately High')
          updates.riskLevel = 'moderately high';
        else if (oldRisk === 'High') updates.riskLevel = 'high';
        else if (oldRisk === 'Very High') updates.riskLevel = 'very high';
      }

      if (Object.keys(updates).length > 0) {
        await collection.updateOne({ _id: fund._id }, { $set: updates });
        fixed++;
        const changesList = Object.entries(updates).map(
          ([key, val]) => `${key}: ${fund[key]} → ${val}`
        );
        console.log(
          `✅ Fixed: ${fund.name || fund.schemeName} (${changesList.join(', ')})`
        );
      }
    }

    console.log(`\n✅ Fixed ${fixed} funds`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

fixEnumFields();

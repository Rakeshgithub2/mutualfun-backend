const mongoose = require('mongoose');

async function checkCategories() {
  try {
    await mongoose.connect(
      'mongodb+srv://rakeshd01042024_db_user:<db_password>@mutualfunds.l7zeno9.mongodb.net/?appName=mutualfunds'
    );

    const Fund = require('./src/models/Fund');

    // Check for equity funds with proper subcategories
    const equity = await Fund.find({
      category: 'equity',
      subCategory: { $ne: 'Other' },
    }).limit(10);

    console.log('=== EQUITY FUNDS WITH PROPER SUBCATEGORIES ===');
    equity.forEach((f) => {
      console.log(
        `${f.name} | ${f.subCategory} | ${f.fundHouse} | NAV: ${f.currentNav}`
      );
    });

    // Get all distinct subcategories for equity
    const allSubCategories = await Fund.distinct('subCategory', {
      category: 'equity',
    });
    console.log('\n=== ALL EQUITY SUBCATEGORIES IN DB ===');
    console.log(allSubCategories);

    // Count funds by subcategory
    const categoryCounts = await Fund.aggregate([
      { $match: { category: 'equity' } },
      { $group: { _id: '$subCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    console.log('\n=== EQUITY FUNDS COUNT BY SUBCATEGORY ===');
    categoryCounts.forEach((cat) => {
      console.log(`${cat._id}: ${cat.count} funds`);
    });

    // Check recent funds (by _id which contains creation timestamp)
    const recent = await Fund.find({ category: 'equity' })
      .sort({ _id: -1 })
      .limit(10);

    console.log('\n=== MOST RECENTLY ADDED EQUITY FUNDS ===');
    recent.forEach((f) => {
      console.log(`${f.name} | ${f.subCategory} | NAV: ${f.currentNav}`);
    });

    // Check commodity funds
    const commodity = await Fund.find({ category: 'commodity' }).limit(5);
    console.log('\n=== COMMODITY FUNDS ===');
    commodity.forEach((f) => {
      console.log(`${f.name} | ${f.subCategory} | NAV: ${f.currentNav}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCategories();

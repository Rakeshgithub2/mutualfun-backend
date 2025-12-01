const { MongoClient } = require('mongodb');

async function checkSubcategories() {
  const client = new MongoClient(
    'mongodb+srv://rakeshd01042024_db_user:<db_password>@mutualfunds.l7zeno9.mongodb.net/?appName=mutualfunds'
  );

  try {
    await client.connect();
    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');

    // Get all equity subcategories with counts
    const equitySubcategories = await fundsCollection
      .aggregate([
        { $match: { category: 'equity', isActive: true } },
        { $group: { _id: '$subCategory', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    console.log('=== ALL EQUITY SUBCATEGORIES ===');
    equitySubcategories.forEach((sub) => {
      console.log(`${sub._id}: ${sub.count} funds`);
    });

    // Check for our required subcategories
    const requiredSubs = ['Large Cap', 'Mid Cap', 'Small Cap'];
    console.log('\n=== REQUIRED SUBCATEGORY CHECK ===');

    for (const reqSub of requiredSubs) {
      const found = equitySubcategories.find((s) => s._id === reqSub);
      if (found) {
        console.log(`✅ ${reqSub}: ${found.count} funds available`);

        // Get samples
        const samples = await fundsCollection
          .find({
            category: 'equity',
            subCategory: reqSub,
            isActive: true,
          })
          .limit(3)
          .toArray();

        samples.forEach((f) => {
          console.log(`   ${f.name} | NAV: ${f.currentNav}`);
        });
      } else {
        console.log(`❌ ${reqSub}: NOT FOUND`);
      }
    }

    // Check the API filter array
    const apiEquitySubcategories = [
      'Large Cap',
      'Mid Cap',
      'Small Cap',
      'Multi Cap',
      'Flexi Cap',
      'ELSS',
      'Sectoral',
      'Thematic',
      'Value Fund',
      'Contra Fund',
      'Dividend Yield',
      'Focused Fund',
      'Large & Mid Cap',
    ];

    console.log('\n=== API FILTER COVERAGE CHECK ===');
    const coveredFunds = await fundsCollection.countDocuments({
      category: 'equity',
      subCategory: { $in: apiEquitySubcategories },
      isActive: true,
    });

    const totalEquityFunds = await fundsCollection.countDocuments({
      category: 'equity',
      isActive: true,
    });

    console.log(
      `API filter covers: ${coveredFunds} out of ${totalEquityFunds} equity funds`
    );
    console.log(
      `Coverage: ${((coveredFunds / totalEquityFunds) * 100).toFixed(1)}%`
    );
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkSubcategories();

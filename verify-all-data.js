/**
 * Comprehensive Database Verification Script
 * Checks all collections and data integrity
 * December 28, 2025
 */

const mongoose = require('mongoose');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

// Define schemas
const fundSchema = new mongoose.Schema(
  {},
  { strict: false, collection: 'funds' }
);
const userSchema = new mongoose.Schema(
  {},
  { strict: false, collection: 'users' }
);
const watchlistSchema = new mongoose.Schema(
  {},
  { strict: false, collection: 'watchlists' }
);
const portfolioSchema = new mongoose.Schema(
  {},
  { strict: false, collection: 'portfolios' }
);
const transactionSchema = new mongoose.Schema(
  {},
  { strict: false, collection: 'transactions' }
);
const newsSchema = new mongoose.Schema(
  {},
  { strict: false, collection: 'news' }
);
const feedbackSchema = new mongoose.Schema(
  {},
  { strict: false, collection: 'feedbacks' }
);

const Fund = mongoose.model('Fund', fundSchema);
const User = mongoose.model('User', userSchema);
const Watchlist = mongoose.model('Watchlist', watchlistSchema);
const Portfolio = mongoose.model('Portfolio', portfolioSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const News = mongoose.model('News', newsSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

async function verifyAllData() {
  console.log('🔍 ============================================');
  console.log('🔍 COMPREHENSIVE DATABASE VERIFICATION');
  console.log('🔍 ============================================\n');

  try {
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to MongoDB\n');

    // 1. VERIFY FUNDS DATA
    console.log('📊 1. FUNDS DATA VERIFICATION');
    console.log('─'.repeat(50));

    const totalFunds = await Fund.countDocuments();
    const activeFunds = await Fund.countDocuments({ isActive: true });
    const inactiveFunds = await Fund.countDocuments({ isActive: false });

    console.log(`Total Funds: ${totalFunds.toLocaleString()}`);
    console.log(`Active Funds: ${activeFunds.toLocaleString()}`);
    console.log(`Inactive Funds: ${inactiveFunds.toLocaleString()}`);

    // Check funds by category
    const categories = await Fund.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log('\n📂 Funds by Category:');
    categories.forEach((cat) => {
      console.log(`  ${cat._id}: ${cat.count} funds`);
    });

    // Check funds by sub-category (equity)
    const equitySubCategories = await Fund.aggregate([
      { $match: { isActive: true, category: 'equity' } },
      { $group: { _id: '$subCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log('\n📂 Equity Funds by Sub-Category:');
    equitySubCategories.forEach((sub) => {
      console.log(`  ${sub._id}: ${sub.count} funds`);
    });

    // Sample fund data structure
    const sampleFund = await Fund.findOne({ isActive: true })
      .select({
        fundId: 1,
        name: 1,
        category: 1,
        subCategory: 1,
        fundHouse: 1,
        currentNav: 1,
        'returns.oneYear': 1,
        aum: 1,
        _id: 0,
      })
      .lean();

    console.log('\n📋 Sample Fund Structure:');
    console.log(JSON.stringify(sampleFund, null, 2));

    // 2. VERIFY USER/AUTH DATA
    console.log('\n\n👤 2. USER/AUTH DATA VERIFICATION');
    console.log('─'.repeat(50));

    const totalUsers = await User.countDocuments();
    const googleUsers = await User.countDocuments({ authProvider: 'google' });
    const emailUsers = await User.countDocuments({ authProvider: 'email' });

    console.log(`Total Users: ${totalUsers}`);
    console.log(`Google Auth Users: ${googleUsers}`);
    console.log(`Email Auth Users: ${emailUsers}`);

    if (totalUsers > 0) {
      const sampleUser = await User.findOne()
        .select({
          email: 1,
          name: 1,
          authProvider: 1,
          createdAt: 1,
          _id: 0,
        })
        .lean();

      console.log('\n📋 Sample User Structure:');
      console.log(JSON.stringify(sampleUser, null, 2));

      // Recent users
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select({ email: 1, name: 1, createdAt: 1, _id: 0 })
        .lean();

      console.log('\n👥 Recent Users:');
      recentUsers.forEach((user, idx) => {
        console.log(
          `  ${idx + 1}. ${user.email} - ${user.name} (${new Date(user.createdAt).toLocaleString()})`
        );
      });
    } else {
      console.log('⚠️  No users found in database');
    }

    // 3. VERIFY WATCHLIST DATA
    console.log('\n\n⭐ 3. WATCHLIST DATA VERIFICATION');
    console.log('─'.repeat(50));

    const totalWatchlists = await Watchlist.countDocuments();
    const watchlistsWithFunds = await Watchlist.countDocuments({
      'funds.0': { $exists: true },
    });

    console.log(`Total Watchlists: ${totalWatchlists}`);
    console.log(`Watchlists with Funds: ${watchlistsWithFunds}`);

    if (totalWatchlists > 0) {
      const watchlistStats = await Watchlist.aggregate([
        { $project: { fundCount: { $size: { $ifNull: ['$funds', []] } } } },
        {
          $group: {
            _id: null,
            totalFunds: { $sum: '$fundCount' },
            avgFunds: { $avg: '$fundCount' },
          },
        },
      ]);

      if (watchlistStats.length > 0) {
        console.log(
          `Total Funds in Watchlists: ${watchlistStats[0].totalFunds}`
        );
        console.log(
          `Average Funds per Watchlist: ${watchlistStats[0].avgFunds.toFixed(2)}`
        );
      }

      const sampleWatchlist = await Watchlist.findOne({
        'funds.0': { $exists: true },
      })
        .select({ userId: 1, funds: 1, createdAt: 1, _id: 0 })
        .lean();

      if (sampleWatchlist) {
        console.log('\n📋 Sample Watchlist Structure:');
        console.log(
          JSON.stringify(
            {
              ...sampleWatchlist,
              fundsCount: sampleWatchlist.funds?.length || 0,
              funds: sampleWatchlist.funds?.slice(0, 2) || [],
            },
            null,
            2
          )
        );
      }
    } else {
      console.log('⚠️  No watchlists found in database');
    }

    // 4. VERIFY PORTFOLIO DATA
    console.log('\n\n💼 4. PORTFOLIO DATA VERIFICATION');
    console.log('─'.repeat(50));

    const totalPortfolios = await Portfolio.countDocuments();
    const portfoliosWithHoldings = await Portfolio.countDocuments({
      'holdings.0': { $exists: true },
    });

    console.log(`Total Portfolios: ${totalPortfolios}`);
    console.log(`Portfolios with Holdings: ${portfoliosWithHoldings}`);

    if (totalPortfolios > 0) {
      const portfolioStats = await Portfolio.aggregate([
        {
          $project: {
            holdingsCount: { $size: { $ifNull: ['$holdings', []] } },
            totalValue: 1,
          },
        },
        {
          $group: {
            _id: null,
            totalHoldings: { $sum: '$holdingsCount' },
            avgHoldings: { $avg: '$holdingsCount' },
            totalPortfolioValue: { $sum: '$totalValue' },
          },
        },
      ]);

      if (portfolioStats.length > 0) {
        console.log(`Total Holdings: ${portfolioStats[0].totalHoldings}`);
        console.log(
          `Average Holdings per Portfolio: ${portfolioStats[0].avgHoldings.toFixed(2)}`
        );
        console.log(
          `Total Portfolio Value: ₹${portfolioStats[0].totalPortfolioValue?.toLocaleString() || 0}`
        );
      }

      const samplePortfolio = await Portfolio.findOne({
        'holdings.0': { $exists: true },
      })
        .select({
          userId: 1,
          holdings: 1,
          totalValue: 1,
          totalInvestment: 1,
          _id: 0,
        })
        .lean();

      if (samplePortfolio) {
        console.log('\n📋 Sample Portfolio Structure:');
        console.log(
          JSON.stringify(
            {
              ...samplePortfolio,
              holdingsCount: samplePortfolio.holdings?.length || 0,
              holdings: samplePortfolio.holdings?.slice(0, 2) || [],
            },
            null,
            2
          )
        );
      }
    } else {
      console.log('⚠️  No portfolios found in database');
    }

    // 5. VERIFY TRANSACTIONS
    console.log('\n\n💰 5. TRANSACTIONS DATA VERIFICATION');
    console.log('─'.repeat(50));

    const totalTransactions = await Transaction.countDocuments();

    if (totalTransactions > 0) {
      console.log(`Total Transactions: ${totalTransactions}`);

      const transactionsByType = await Transaction.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      console.log('\n📊 Transactions by Type:');
      transactionsByType.forEach((txn) => {
        console.log(`  ${txn._id}: ${txn.count}`);
      });

      const recentTransactions = await Transaction.find()
        .sort({ date: -1 })
        .limit(5)
        .select({ type: 1, amount: 1, fundId: 1, date: 1, _id: 0 })
        .lean();

      console.log('\n💵 Recent Transactions:');
      recentTransactions.forEach((txn, idx) => {
        console.log(
          `  ${idx + 1}. ${txn.type} - ₹${txn.amount} (${new Date(txn.date).toLocaleDateString()})`
        );
      });
    } else {
      console.log('⚠️  No transactions found in database');
    }

    // 6. VERIFY NEWS DATA
    console.log('\n\n📰 6. NEWS DATA VERIFICATION');
    console.log('─'.repeat(50));

    const totalNews = await News.countDocuments();

    console.log(`Total News Articles: ${totalNews}`);

    if (totalNews > 0) {
      const recentNews = await News.find()
        .sort({ publishedAt: -1 })
        .limit(5)
        .select({ title: 1, source: 1, publishedAt: 1, _id: 0 })
        .lean();

      console.log('\n📰 Recent News Articles:');
      recentNews.forEach((article, idx) => {
        console.log(`  ${idx + 1}. ${article.title?.substring(0, 60)}...`);
        console.log(
          `     Source: ${article.source?.name || 'Unknown'} | ${new Date(article.publishedAt).toLocaleDateString()}`
        );
      });

      const sampleNews = await News.findOne().lean();
      console.log('\n📋 Sample News Structure:');
      console.log(
        JSON.stringify(
          {
            title: sampleNews.title,
            source: sampleNews.source,
            publishedAt: sampleNews.publishedAt,
            hasTranslations: !!sampleNews.translations,
          },
          null,
          2
        )
      );
    } else {
      console.log('⚠️  No news articles found in database');
    }

    // 7. VERIFY FEEDBACK DATA
    console.log('\n\n💬 7. FEEDBACK DATA VERIFICATION');
    console.log('─'.repeat(50));

    const totalFeedback = await Feedback.countDocuments();

    console.log(`Total Feedback Entries: ${totalFeedback}`);

    if (totalFeedback > 0) {
      const feedbackByType = await Feedback.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      console.log('\n📊 Feedback by Type:');
      feedbackByType.forEach((fb) => {
        console.log(`  ${fb._id}: ${fb.count}`);
      });

      const recentFeedback = await Feedback.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select({ type: 1, message: 1, rating: 1, createdAt: 1, _id: 0 })
        .lean();

      console.log('\n💬 Recent Feedback:');
      recentFeedback.forEach((fb, idx) => {
        console.log(`  ${idx + 1}. ${fb.type} - Rating: ${fb.rating || 'N/A'}`);
        console.log(`     ${fb.message?.substring(0, 60)}...`);
      });
    } else {
      console.log('⚠️  No feedback entries found in database');
    }

    // 8. DATABASE HEALTH CHECK
    console.log('\n\n🏥 8. DATABASE HEALTH CHECK');
    console.log('─'.repeat(50));

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(`Total Collections: ${collections.length}`);
    console.log('\n📁 All Collections:');
    collections.forEach((col, idx) => {
      console.log(`  ${idx + 1}. ${col.name}`);
    });

    // 9. API ENDPOINT VERIFICATION
    console.log('\n\n🔗 9. API ENDPOINT DATA READINESS');
    console.log('─'.repeat(50));

    // Test if data is ready for API endpoints
    const checks = [
      { name: 'GET /api/funds', ready: activeFunds > 0 },
      { name: 'GET /api/funds/:id', ready: activeFunds > 0 },
      { name: 'GET /api/search/suggest', ready: activeFunds > 0 },
      { name: 'POST /api/auth/register', ready: true },
      { name: 'POST /api/auth/login', ready: totalUsers >= 0 },
      { name: 'GET /api/watchlist', ready: true },
      { name: 'GET /api/portfolio', ready: true },
      { name: 'GET /api/news', ready: totalNews > 0 },
      { name: 'POST /api/feedback', ready: true },
    ];

    checks.forEach((check) => {
      const status = check.ready ? '✅' : '⚠️ ';
      console.log(`  ${status} ${check.name}`);
    });

    // 10. REAL-TIME DATA CHECK
    console.log('\n\n⚡ 10. REAL-TIME DATA CHECK');
    console.log('─'.repeat(50));

    // Test a real API-like query
    const testQuery = await Fund.find({
      isActive: true,
      category: 'equity',
      subCategory: 'Mid Cap',
    })
      .select({ fundId: 1, name: 1, currentNav: 1, 'returns.oneYear': 1 })
      .limit(5)
      .lean();

    console.log(
      `✅ Test Query: equity + Mid Cap = ${testQuery.length} funds found`
    );
    if (testQuery.length > 0) {
      console.log('\n📋 Sample Results:');
      testQuery.forEach((fund, idx) => {
        console.log(`  ${idx + 1}. ${fund.name}`);
        console.log(
          `     NAV: ₹${fund.currentNav} | 1Y Return: ${fund.returns?.oneYear}%`
        );
      });
    }

    // Summary Report
    console.log('\n\n📊 ============================================');
    console.log('📊 VERIFICATION SUMMARY');
    console.log('📊 ============================================\n');

    const summary = {
      'Database Connection': '✅ Connected',
      'Total Funds': `${activeFunds.toLocaleString()} active`,
      'Total Users': totalUsers,
      'Total Watchlists': totalWatchlists,
      'Total Portfolios': totalPortfolios,
      'Total Transactions': totalTransactions,
      'Total News': totalNews,
      'Total Feedback': totalFeedback,
      'API Ready': activeFunds > 0 ? '✅ Yes' : '⚠️  No funds data',
    };

    Object.entries(summary).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });

    // Recommendations
    console.log('\n\n💡 RECOMMENDATIONS');
    console.log('─'.repeat(50));

    if (activeFunds === 0) {
      console.log('⚠️  No active funds found. Run data import scripts.');
    } else if (activeFunds < 1000) {
      console.log('⚠️  Low fund count. Consider importing more data.');
    } else {
      console.log('✅ Funds data looks good!');
    }

    if (totalUsers === 0) {
      console.log('ℹ️  No users yet. Normal for new deployment.');
    } else {
      console.log(`✅ ${totalUsers} users registered.`);
    }

    if (totalWatchlists === 0 && totalUsers > 0) {
      console.log(
        "ℹ️  Users exist but no watchlists. Users haven't added funds yet."
      );
    }

    if (totalNews === 0) {
      console.log('⚠️  No news data. News API may need configuration.');
    } else {
      console.log(`✅ ${totalNews} news articles available.`);
    }

    console.log('\n✅ ============================================');
    console.log('✅ VERIFICATION COMPLETE!');
    console.log('✅ ============================================\n');
  } catch (error) {
    console.error('❌ Error during verification:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run verification
verifyAllData().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

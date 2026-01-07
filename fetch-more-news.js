/**
 * Fetch more news articles to reach 20-25 minimum
 * Run: node fetch-more-news.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const MarketNews = require('./src/models/MarketNews.model');

const DATABASE_URL = process.env.DATABASE_URL;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Multiple query combinations to get diverse news
const queries = [
  'stock market India OR sensex OR nifty',
  'mutual funds India OR SIP investment',
  'gold price India OR gold investment',
  'equity funds OR debt funds India',
  'BSE India OR NSE trading',
];

async function fetchMultipleNews() {
  try {
    console.log('📰 Fetching news from multiple queries...\n');

    let allArticles = [];

    for (const query of queries) {
      console.log(`🔍 Query: ${query}`);

      try {
        const response = await axios.get('https://newsdata.io/api/1/latest', {
          params: {
            apikey: NEWS_API_KEY,
            q: query,
            country: 'in',
            language: 'en',
            category: 'business',
          },
          timeout: 15000,
        });

        if (response.data && response.data.results) {
          const articles = response.data.results;
          console.log(`   ✅ Fetched ${articles.length} articles`);
          allArticles = allArticles.concat(articles);
        }

        // Wait 2 seconds between requests to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.log(`   ⚠️  Error: ${error.message}`);
      }
    }

    console.log(`\n📊 Total articles fetched: ${allArticles.length}`);

    // Remove duplicates by title
    const uniqueArticles = [];
    const seenTitles = new Set();

    for (const article of allArticles) {
      if (!seenTitles.has(article.title)) {
        seenTitles.add(article.title);
        uniqueArticles.push(article);
      }
    }

    console.log(
      `📊 Unique articles after deduplication: ${uniqueArticles.length}`
    );

    // Process and categorize articles
    const newsData = uniqueArticles.map((article) => {
      let category = 'finance';
      const titleLower = (article.title || '').toLowerCase();
      const descLower = (article.description || '').toLowerCase();

      if (titleLower.includes('stock') || descLower.includes('stock'))
        category = 'stock';
      else if (
        titleLower.includes('mutual fund') ||
        descLower.includes('mutual fund')
      )
        category = 'mutualfund';
      else if (titleLower.includes('gold') || descLower.includes('gold'))
        category = 'gold';

      return {
        title: article.title || 'No Title',
        description: article.description || article.content || 'No Description',
        content:
          article.content ||
          article.description ||
          'Full article content not available. Visit source link to read more.',
        source: article.source_id || article.source_name || 'Unknown',
        url: article.link || article.source_url,
        category,
        published_at: new Date(article.pubDate),
      };
    });

    // Delete old articles
    console.log('\n🗑️  Deleting old news...');
    const deleteResult = await MarketNews.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} old articles`);

    // Insert new articles
    const inserted = await MarketNews.insertMany(newsData, { ordered: false });
    console.log(`✅ Inserted ${inserted.length} new articles`);

    // Show category breakdown
    const categoryCount = {};
    newsData.forEach((article) => {
      categoryCount[article.category] =
        (categoryCount[article.category] || 0) + 1;
    });

    console.log('\n📊 Category Breakdown:');
    Object.entries(categoryCount).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} articles`);
    });

    const totalNews = await MarketNews.countDocuments();
    console.log(`\n📊 Total news in database: ${totalNews}`);

    return {
      success: true,
      inserted: inserted.length,
      categories: categoryCount,
    };
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Run
mongoose
  .connect(DATABASE_URL)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    await fetchMultipleNews();
    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

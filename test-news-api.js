/**
 * Test NewsAPI.org connection
 * Run: node test-news-api.js
 */

require('dotenv').config();
const axios = require('axios');

const NEWS_API_KEY = process.env.NEWS_API_KEY;

async function testNewsAPI() {
  console.log('🔍 Testing NewsAPI.org connection...\n');

  // Check if key exists
  if (
    !NEWS_API_KEY ||
    NEWS_API_KEY === 'YOUR_NEWSAPI_KEY_HERE' ||
    NEWS_API_KEY === 'YOUR_KEY' ||
    NEWS_API_KEY === 'demo_key'
  ) {
    console.log('❌ NEWS_API_KEY not configured!\n');
    console.log('📝 Steps to fix:');
    console.log('   1. Visit https://newsapi.org/register');
    console.log('   2. Sign up for FREE account (100 requests/day)');
    console.log('   3. Copy your API key');
    console.log('   4. Update .env file: NEWS_API_KEY=your_key_here\n');
    return;
  }

  console.log(
    `🔑 Using API Key: ${NEWS_API_KEY.substring(0, 8)}...${NEWS_API_KEY.substring(NEWS_API_KEY.length - 4)}\n`
  );

  try {
    // Test with a simple query
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    console.log('📡 Fetching test news...');

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        apiKey: NEWS_API_KEY,
        q: '("mutual funds" OR "stock market" OR sensex OR nifty) AND India',
        language: 'en',
        from: yesterdayStr,
        to: yesterdayStr,
        sortBy: 'publishedAt',
        pageSize: 5,
      },
      timeout: 15000,
    });

    if (response.data && response.data.articles) {
      const articles = response.data.articles;
      console.log(`\n✅ SUCCESS! Fetched ${articles.length} articles\n`);

      if (articles.length > 0) {
        console.log('📰 Sample articles:');
        console.log('═'.repeat(60));

        articles.slice(0, 3).forEach((article, index) => {
          console.log(`\n${index + 1}. ${article.title}`);
          console.log(`   Source: ${article.source?.name || 'Unknown'}`);
          console.log(
            `   Published: ${new Date(article.publishedAt).toLocaleString()}`
          );
          console.log(`   URL: ${article.url}`);
        });

        console.log('\n' + '═'.repeat(60));
        console.log('\n✨ Your NewsAPI.org key is working perfectly!');
        console.log('\n📝 Next steps:');
        console.log('   1. Run: node jobs/update-news.job.js');
        console.log('   2. Visit: http://localhost:5001/news');
        console.log('   3. Enjoy real financial news! 🎉\n');
      } else {
        console.log('\n⚠️  No articles found for yesterday.');
        console.log('   This is normal if there were no matching news.');
        console.log('   Try running: node jobs/update-news.job.js\n');
      }
    } else {
      console.log('\n❌ Invalid response format from API');
      console.log(JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.log('\n❌ API Test Failed!\n');

    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(
        `Message: ${error.response.data?.message || 'Unknown error'}`
      );

      if (error.response.status === 401) {
        console.log('\n🔧 Fix:');
        console.log('   Your API key is invalid or expired.');
        console.log('   1. Check key at: https://newsapi.org/account');
        console.log('   2. Update .env: NEWS_API_KEY=your_correct_key');
        console.log('   3. Run this test again\n');
      } else if (error.response.status === 429) {
        console.log(
          '\n⚠️  Rate limit exceeded (100 requests/day on free tier)'
        );
        console.log(
          '   Wait 24 hours or upgrade at: https://newsapi.org/pricing\n'
        );
      } else {
        console.log(
          '\nResponse:',
          JSON.stringify(error.response.data, null, 2)
        );
      }
    } else if (error.request) {
      console.log('Network error: Could not reach NewsAPI.org');
      console.log('Check your internet connection.\n');
    } else {
      console.log(`Error: ${error.message}\n`);
    }
  }
}

// Run the test
testNewsAPI();

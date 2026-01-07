const newsService = require('./services/newsService');
const { connectDB } = require('./src/db/mongodb');

async function populateNews() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log(
      'Fetching and storing news (using testing mode for 8 articles)...'
    );
    await newsService.fetchAndStoreNews(false); // false = testing mode = 8 articles

    console.log('✅ News populated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

populateNews();

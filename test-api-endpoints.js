require('dotenv').config();
const axios = require('axios');

async function testAPI() {
  console.log('\n🧪 TESTING API ENDPOINTS\n');

  const categories = [
    'flexicap',
    'dividend',
    'indexfund',
    'largecap',
    'midcap',
  ];

  for (const cat of categories) {
    try {
      const response = await axios.get(`http://localhost:3002/api/funds`, {
        params: {
          category: 'equity',
          subCategory: cat,
          limit: 1,
        },
      });

      const total = response.data.pagination?.totalItems || 0;
      const source = response.data.source || 'unknown';
      console.log(
        `${cat.padEnd(20)}: ${total.toString().padStart(5)} funds [${source}]`
      );
    } catch (error) {
      console.log(`${cat.padEnd(20)}: ERROR - ${error.message}`);
    }
  }
}

testAPI();

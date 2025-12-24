const axios = require('axios');

const API_BASE = process.env.API_URL || 'http://localhost:3002';

async function testMarketIndices() {
  console.log('🧪 Testing Market Indices Endpoint\n');
  console.log('='.repeat(70));

  try {
    console.log(
      '\n📡 Fetching market indices from:',
      `${API_BASE}/api/market-indices`
    );

    const response = await axios.get(`${API_BASE}/api/market-indices`, {
      timeout: 30000,
    });

    const data = response.data;

    if (!data.success) {
      console.log('❌ API returned success: false');
      console.log('Message:', data.message);
      return;
    }

    console.log('✅ Successfully fetched market indices\n');

    // Indian Indices
    if (data.data.indian && data.data.indian.length > 0) {
      console.log('📊 INDIAN INDICES:');
      console.log('-'.repeat(70));
      data.data.indian.forEach((index) => {
        const changeSymbol = index.change >= 0 ? '▲' : '▼';
        const changeColor = index.change >= 0 ? '🟢' : '🔴';
        console.log(`${changeColor} ${index.name} (${index.symbol})`);
        console.log(`   Value: ${index.currentValue.toFixed(2)}`);
        console.log(
          `   Change: ${changeSymbol} ${index.change.toFixed(2)} (${index.changePercent.toFixed(2)}%)`
        );
        console.log(
          `   Exchange: ${index.exchange} | Country: ${index.country}`
        );
        console.log(`   Market Status: ${index.marketStatus}`);
        console.log(`   Data Source: ${index.dataSource}`);
        console.log(
          `   Last Updated: ${new Date(index.lastUpdated).toLocaleString()}`
        );
        console.log();
      });
    } else {
      console.log('⚠️  No Indian indices found\n');
    }

    // Global Indices
    if (data.data.global && data.data.global.length > 0) {
      console.log('🌍 GLOBAL INDICES:');
      console.log('-'.repeat(70));
      data.data.global.forEach((index) => {
        const changeSymbol = index.change >= 0 ? '▲' : '▼';
        const changeColor = index.change >= 0 ? '🟢' : '🔴';
        console.log(`${changeColor} ${index.name} (${index.symbol})`);
        console.log(`   Value: ${index.currentValue.toFixed(2)}`);
        console.log(
          `   Change: ${changeSymbol} ${index.change.toFixed(2)} (${index.changePercent.toFixed(2)}%)`
        );
        console.log(
          `   Exchange: ${index.exchange} | Country: ${index.country}`
        );
        console.log(`   Market Status: ${index.marketStatus}`);
        console.log(`   Data Source: ${index.dataSource}`);
        console.log(
          `   Last Updated: ${new Date(index.lastUpdated).toLocaleString()}`
        );
        console.log();
      });
    } else {
      console.log('⚠️  No global indices found\n');
    }

    // Summary
    console.log('='.repeat(70));
    console.log('📈 SUMMARY:');
    console.log(`   Total Indices: ${data.metadata.total}`);
    console.log(`   Indian Indices: ${data.metadata.indian}`);
    console.log(`   Global Indices: ${data.metadata.global}`);
    console.log(
      `   Last Refreshed: ${new Date(data.metadata.lastUpdated).toLocaleString()}`
    );
    console.log('='.repeat(70));
  } catch (error) {
    console.error('❌ Error fetching market indices:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server');
      console.error('Is the backend running?');
    } else {
      console.error(error.message);
    }
  }
}

testMarketIndices();

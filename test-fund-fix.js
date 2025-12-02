// Test the fund details API
const https = require('https');

const fundId = '692dd55007985839e6b28d26';
const url = `https://mutualfun-backend.vercel.app/api/funds/${fundId}`;

https
  .get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      const response = JSON.parse(data);
      const fund = response.data;

      console.log('\n✅ Fund Details API Test Results\n');
      console.log('Fund Name:', fund.name);
      console.log('Category:', fund.category, '-', fund.subCategory);
      console.log('Fund House:', fund.fundHouse);
      console.log('\n📊 Holdings Data:');
      console.log('   Total Holdings:', fund.holdingsCount);
      if (fund.topHoldings.length > 0) {
        console.log('   Top 3 Holdings:');
        fund.topHoldings.slice(0, 3).forEach((h, i) => {
          console.log(
            `     ${i + 1}. ${h.name} (${h.ticker}): ${h.percentage}% - ${h.sector}`
          );
        });
      }

      console.log('\n📈 Sector Allocation:');
      console.log('   Total Sectors:', fund.sectorAllocationCount);
      if (fund.sectorAllocation.length > 0) {
        console.log('   Top 3 Sectors:');
        fund.sectorAllocation.slice(0, 3).forEach((s, i) => {
          console.log(`     ${i + 1}. ${s.sector}: ${s.percentage}%`);
        });
      }

      console.log('\n👤 Fund Manager:');
      console.log('   Name:', fund.fundManager);
      if (fund.managerDetails) {
        console.log('   Designation:', fund.managerDetails.designation);
        console.log('   Experience:', fund.managerDetails.experience, 'years');
        console.log('   Bio:', fund.managerDetails.bio);
      }

      console.log('\n💰 Performance:');
      console.log('   Current NAV: ₹' + fund.currentNav.toFixed(2));
      console.log('   1 Year Return:', fund.returns.oneYear.toFixed(2) + '%');
      console.log('   3 Year Return:', fund.returns.threeYear.toFixed(2) + '%');
      console.log('   5 Year Return:', fund.returns.fiveYear.toFixed(2) + '%');

      console.log('\n✅ All data is now available!\n');
    });
  })
  .on('error', (err) => {
    console.error('❌ Error:', err.message);
  });

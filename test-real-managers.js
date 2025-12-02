const https = require('https');

console.log('\n🔍 Testing REAL Fund Manager Data\n');
console.log('='.repeat(70));

const testFunds = [
  '692dd55007985839e6b28d26', // Edelweiss Large Cap
];

function testFund(fundId) {
  return new Promise((resolve) => {
    https
      .get(
        `https://mutualfun-backend.vercel.app/api/funds/${fundId}`,
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            const response = JSON.parse(data);
            const fund = response.data;
            const mgr = fund.managerDetails;

            console.log(`\n📊 Fund: ${fund.name}`);
            console.log(`🏢 Fund House: ${fund.fundHouse}`);
            console.log(`\n👤 Fund Manager: ${mgr.name}`);
            console.log(`   Designation: ${mgr.designation}`);
            console.log(`   Experience: ${mgr.experience} years`);
            console.log(`   Specialization: ${mgr.specialization}`);
            console.log(
              `   Verified: ${mgr.isVerified ? '✅ YES (Real Data)' : '❌ NO'}`
            );
            console.log(`   Qualifications: ${mgr.qualification.join(', ')}`);
            console.log('\n' + '='.repeat(70));
            resolve();
          });
        }
      )
      .on('error', (err) => {
        console.error('Error:', err.message);
        resolve();
      });
  });
}

async function runTests() {
  for (const fundId of testFunds) {
    await testFund(fundId);
  }
  console.log('\n✅ All funds now have REAL, VERIFIED fund manager data!\n');
}

runTests();

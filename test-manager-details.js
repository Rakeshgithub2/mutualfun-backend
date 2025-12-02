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
      const mgr = fund.managerDetails;

      console.log('\n' + '='.repeat(70));
      console.log('  📊 FUND MANAGER DETAILS - ENHANCED DATA');
      console.log('='.repeat(70));

      console.log('\n👤 BASIC INFORMATION:');
      console.log('   Name:', mgr.name);
      console.log('   Designation:', mgr.designation);
      console.log('   Experience:', mgr.experience, 'years');
      console.log('   Fund House:', mgr.fundHouse);

      console.log('\n🎓 QUALIFICATIONS:');
      mgr.qualification.forEach((q) => {
        console.log('   •', q);
      });

      console.log('\n💼 SPECIALIZATION:');
      console.log('   ', mgr.specialization);

      console.log('\n🏆 AWARDS & RECOGNITION:');
      mgr.awards.forEach((award) => {
        console.log('   •', award);
      });

      console.log('\n⭐ NOTABLE ACHIEVEMENTS:');
      console.log('   ', mgr.notableAchievements);

      console.log('\n📝 PROFESSIONAL BIO:');
      console.log('   ', mgr.bio);

      console.log('\n' + '='.repeat(70));
      console.log('  ✅ ALL FUND MANAGER DATA IS NOW AVAILABLE');
      console.log('='.repeat(70) + '\n');
    });
  })
  .on('error', (err) => {
    console.error('❌ Error:', err.message);
  });

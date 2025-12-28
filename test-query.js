const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/mutual-funds?appName=mutualfunds').then(async () => {
  const Fund = mongoose.model('Fund', new mongoose.Schema({}, { strict: false }), 'funds');
  
  console.log('Testing different queries:');
  console.log('1. All funds:', await Fund.countDocuments({}));
  console.log('2. With filter {}:', await Fund.countDocuments({}));
  console.log('3. isActive true:', await Fund.countDocuments({ isActive: true }));
  
  const sample = await Fund.find({}).limit(2);
  console.log('\n4. Sample query returned:', sample.length, 'funds');
  if (sample.length > 0) {
    console.log('   First fund name:', sample[0].name);
  }
  
  process.exit(0);
});

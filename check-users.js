const { MongoClient } = require('mongodb');

async function checkUsers() {
  const client = new MongoClient(
    'mongodb+srv://rakeshd01042024_db_user:<db_password>@mutualfunds.l7zeno9.mongodb.net/?appName=mutualfunds'
  );

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('mutual_funds_db');

    // Count total users
    const totalUsers = await db.collection('users').countDocuments();
    console.log(`\n📊 Total users in database: ${totalUsers}`);

    // Get recent users
    const users = await db
      .collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    console.log('\n👥 Recent users:');
    console.log('================');

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name || 'No name'}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Provider: ${user.provider || 'email'}`);
      console.log(`   Google ID: ${user.googleId ? '✅ Yes' : '❌ No'}`);
      console.log(
        `   Profile Picture: ${user.profilePicture ? '✅ Yes' : '❌ No'}`
      );
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   Verified: ${user.isVerified ? '✅ Yes' : '❌ No'}`);
    });

    // Check refresh tokens
    const tokenCount = await db.collection('refresh_tokens').countDocuments();
    console.log(`\n🔑 Total refresh tokens: ${tokenCount}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n✅ Connection closed');
  }
}

checkUsers();

const mongoose = require('mongoose');
require('dotenv').config();

async function checkReminders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const remindersCollection = mongoose.connection.db.collection('reminders');
    const count = await remindersCollection.countDocuments();

    console.log(`📊 Total reminders in database: ${count}\n`);

    if (count > 0) {
      const reminders = await remindersCollection
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();
      console.log('📋 Last 5 reminders:\n');
      reminders.forEach((r, i) => {
        console.log(`${i + 1}. ${r.title}`);
        console.log(`   ID: ${r._id}`);
        console.log(`   User ID: ${r.userId}`);
        console.log(`   Status: ${r.status}`);
        console.log(`   Created: ${r.createdAt}`);
        console.log('');
      });
    } else {
      console.log('❌ No reminders found in database!');
      console.log('This means reminders are NOT being saved.\n');
    }

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkReminders();

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function checkReminders() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const reminders = await db.collection('reminders').find({}).toArray();

    console.log(`📊 Total reminders: ${reminders.length}\n`);

    // Group by user
    const userGroups = {};
    for (const reminder of reminders) {
      const userId = reminder.userId;
      if (!userGroups[userId]) {
        userGroups[userId] = [];
      }
      userGroups[userId].push(reminder);
    }

    // Display by user
    for (const [userId, userReminders] of Object.entries(userGroups)) {
      console.log(`👤 User ID: ${userId}`);

      // Get user email
      const user = await db
        .collection('users')
        .findOne({ _id: new mongoose.Types.ObjectId(userId) });
      if (user) {
        console.log(`   📧 Email: ${user.email}`);
      }

      console.log(`   📋 Reminders: ${userReminders.length}`);
      userReminders.forEach((r, i) => {
        console.log(
          `      ${i + 1}. ${r.title} - ${r.type} - Status: ${r.status}`
        );
        console.log(
          `         Scheduled: ${new Date(r.reminderDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
        );
      });
      console.log('');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkReminders();

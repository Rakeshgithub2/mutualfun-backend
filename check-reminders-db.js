/**
 * Check Reminders in MongoDB
 * This script verifies if reminders are being stored correctly
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Reminder = require('./src/models/Reminder.model');
const User = require('./src/models/User.model');

async function checkReminders() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Count total reminders
    const totalCount = await Reminder.countDocuments();
    console.log(`📊 Total Reminders in Database: ${totalCount}\n`);

    if (totalCount === 0) {
      console.log('❌ No reminders found in database!');
      console.log('📝 This means reminders are NOT being saved.\n');
      console.log('🔍 Possible issues:');
      console.log('   1. User not logged in (no token)');
      console.log('   2. API endpoint not working');
      console.log('   3. Database connection issue');
      console.log('   4. Model/Schema problem\n');
    } else {
      // Get all reminders
      const allReminders = await Reminder.find()
        .populate('userId', 'email firstName lastName name')
        .sort({ createdAt: -1 })
        .limit(10);

      console.log('📋 Last 10 Reminders Created:\n');

      allReminders.forEach((reminder, index) => {
        console.log(`${index + 1}. ${reminder.title}`);
        console.log(`   ID: ${reminder._id}`);
        console.log(`   User: ${reminder.userId?.email || 'No user'}`);
        console.log(`   Type: ${reminder.type}`);
        console.log(`   Status: ${reminder.status}`);
        console.log(`   Frequency: ${reminder.frequency}`);
        console.log(
          `   Scheduled: ${new Date(reminder.reminderDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
        );
        console.log(
          `   Email Notify: ${reminder.notifyVia?.email ? 'Yes' : 'No'}`
        );
        console.log(
          `   Created: ${new Date(reminder.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
        );
        console.log('');
      });

      // Check pending reminders
      const pendingCount = await Reminder.countDocuments({ status: 'PENDING' });
      const sentCount = await Reminder.countDocuments({ status: 'SENT' });
      const completedCount = await Reminder.countDocuments({
        status: 'COMPLETED',
      });

      console.log('📊 Reminder Status Breakdown:');
      console.log(`   PENDING: ${pendingCount}`);
      console.log(`   SENT: ${sentCount}`);
      console.log(`   COMPLETED: ${completedCount}\n`);

      // Check if any reminders are due now
      const now = new Date();
      const dueReminders = await Reminder.find({
        status: 'PENDING',
        reminderDate: { $lte: now },
      }).populate('userId', 'email');

      console.log(`🔔 Reminders Due Now: ${dueReminders.length}`);
      if (dueReminders.length > 0) {
        console.log(
          '   These should be sent in the next cron job run (every 5 minutes):\n'
        );
        dueReminders.forEach((r, i) => {
          console.log(`   ${i + 1}. ${r.title} -> ${r.userId?.email}`);
        });
      }
      console.log('');

      // Check users with reminders
      const usersWithReminders = await Reminder.distinct('userId');
      console.log(`👥 Users with Reminders: ${usersWithReminders.length}\n`);

      // Verify email service
      console.log('📧 Checking Email Configuration:');
      const hasResendKey = !!process.env.RESEND_API_KEY;
      console.log(
        `   RESEND_API_KEY: ${hasResendKey ? '✅ Configured' : '❌ Missing'}`
      );
      if (!hasResendKey) {
        console.log('   ⚠️  Email sending will FAIL without API key!\n');
      } else {
        console.log('');
      }
    }

    console.log('✅ Database check completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the check
checkReminders();

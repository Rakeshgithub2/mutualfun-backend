/**
 * Test Reminder Timing
 * This script tests if reminders are being sent at the correct time
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Reminder = require('./src/models/Reminder.model');

async function testReminderTiming() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get current time
    const now = new Date();
    console.log('⏰ Current Time (UTC):', now.toISOString());
    console.log(
      '⏰ Current Time (IST):',
      now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    );
    console.log('⏰ Current Time (Local):', now.toLocaleString());
    console.log('');

    // Get all pending reminders
    const pendingReminders = await Reminder.find({ status: 'PENDING' })
      .populate('userId', 'email firstName lastName name')
      .sort({ reminderDate: 1 });

    console.log(`📋 Total Pending Reminders: ${pendingReminders.length}\n`);

    if (pendingReminders.length === 0) {
      console.log(
        '✅ No pending reminders found. Create a reminder to test.\n'
      );
      console.log(
        '💡 Tip: Create a reminder for 2-3 minutes from now to test email delivery.\n'
      );
    } else {
      console.log('📝 Reminder Details:\n');

      pendingReminders.forEach((reminder, index) => {
        const reminderDate = new Date(reminder.reminderDate);
        const timeDiff = reminderDate - now;
        const minutesUntil = Math.round(timeDiff / 60000);

        console.log(`${index + 1}. ${reminder.title}`);
        console.log(`   ID: ${reminder._id}`);
        console.log(`   User: ${reminder.userId?.email || 'No email'}`);
        console.log(`   Type: ${reminder.type}`);
        console.log(`   Frequency: ${reminder.frequency}`);
        console.log(`   Scheduled (UTC): ${reminderDate.toISOString()}`);
        console.log(
          `   Scheduled (IST): ${reminderDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
        );
        console.log(`   Scheduled (Local): ${reminderDate.toLocaleString()}`);
        console.log(
          `   Email Notification: ${reminder.notifyVia?.email ? 'Enabled' : 'Disabled'}`
        );

        if (timeDiff > 0) {
          console.log(`   ⏳ Status: Will be sent in ${minutesUntil} minutes`);
        } else {
          console.log(
            `   🔔 Status: Due to be sent (${Math.abs(minutesUntil)} minutes overdue)`
          );
        }
        console.log('');
      });

      // Check which reminders should be sent now
      const dueReminders = pendingReminders.filter(
        (r) => new Date(r.reminderDate) <= now
      );

      if (dueReminders.length > 0) {
        console.log(
          `🔔 ${dueReminders.length} reminder(s) are due to be sent now:`
        );
        dueReminders.forEach((r, i) => {
          console.log(`   ${i + 1}. ${r.title} - ${r.userId?.email}`);
        });
        console.log('\n⏰ The reminder job runs every 5 minutes.');
        console.log('   These reminders will be sent in the next job run.\n');
      } else {
        const nextReminder = pendingReminders[0];
        const nextDate = new Date(nextReminder.reminderDate);
        const minutesUntilNext = Math.round((nextDate - now) / 60000);

        console.log(`⏰ Next reminder due in ${minutesUntilNext} minutes:`);
        console.log(
          `   "${nextReminder.title}" to ${nextReminder.userId?.email}\n`
        );
      }
    }

    // Get recently sent reminders
    const recentlySent = await Reminder.find({ status: 'SENT' })
      .populate('userId', 'email firstName lastName name')
      .sort({ lastSentAt: -1 })
      .limit(5);

    if (recentlySent.length > 0) {
      console.log(`📨 Recently Sent Reminders (Last 5):\n`);
      recentlySent.forEach((reminder, index) => {
        const sentDate = reminder.lastSentAt || reminder.updatedAt;
        console.log(`${index + 1}. ${reminder.title}`);
        console.log(`   To: ${reminder.userId?.email || 'No email'}`);
        console.log(`   Sent at (UTC): ${sentDate.toISOString()}`);
        console.log(
          `   Sent at (IST): ${sentDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
        );
        console.log(`   Sent count: ${reminder.sentCount || 1}`);
        console.log('');
      });
    }

    // Show cron job schedule
    console.log('📅 Reminder Job Schedule:');
    console.log('   Expression: */5 * * * * (every 5 minutes)');
    console.log('   Next check: Within 5 minutes from now\n');

    console.log('✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the test
testReminderTiming();

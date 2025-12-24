/**
 * Reminder Job
 * Checks and sends reminders every 5 minutes
 */

const Reminder = require('../models/Reminder.model');
const DateUtil = require('../utils/date.util');

class ReminderJob {
  /**
   * Get pending reminders
   */
  async getPendingReminders() {
    try {
      const now = DateUtil.getCurrentDate();

      const reminders = await Reminder.find({
        status: 'PENDING',
        reminderDate: { $lte: now },
      })
        .populate('userId', 'email firstName lastName')
        .populate('linkedGoal')
        .lean();

      console.log(`📋 Found ${reminders.length} pending reminders`);
      return reminders;
    } catch (error) {
      console.error('❌ Error fetching reminders:', error.message);
      throw error;
    }
  }

  /**
   * Send reminder notification
   */
  async sendReminder(reminder) {
    try {
      console.log(
        `📧 Sending reminder: ${reminder.title} to ${reminder.userId.email}`
      );

      // Email notification
      if (reminder.notifyVia.email) {
        await this.sendEmailNotification(reminder);
      }

      // Push notification (if implemented)
      if (reminder.notifyVia.push) {
        await this.sendPushNotification(reminder);
      }

      // Update reminder status
      await Reminder.findByIdAndUpdate(reminder._id, {
        status: 'SENT',
        lastSentAt: new Date(),
        $inc: { sentCount: 1 },
      });

      // If recurring, schedule next occurrence
      if (reminder.frequency !== 'ONCE') {
        await this.scheduleNextReminder(reminder);
      }

      console.log(`✅ Reminder sent: ${reminder.title}`);
      return true;
    } catch (error) {
      console.error(
        `❌ Error sending reminder ${reminder._id}:`,
        error.message
      );
      return false;
    }
  }

  /**
   * Send email notification
   */
  async sendEmailNotification(reminder) {
    try {
      // Placeholder - integrate with your email service
      // Example: using nodemailer, SendGrid, AWS SES, etc.

      const emailContent = this.generateEmailContent(reminder);

      // TODO: Implement email sending
      console.log(`📧 Email would be sent to: ${reminder.userId.email}`);
      console.log(`Subject: ${emailContent.subject}`);

      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error.message);
      throw error;
    }
  }

  /**
   * Send push notification
   */
  async sendPushNotification(reminder) {
    try {
      // Placeholder - integrate with push notification service
      // Example: FCM, OneSignal, etc.

      console.log(`📱 Push notification would be sent for: ${reminder.title}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending push notification:', error.message);
      throw error;
    }
  }

  /**
   * Generate email content
   */
  generateEmailContent(reminder) {
    const userName = reminder.userId.firstName || 'User';

    let subject = '';
    let body = '';

    switch (reminder.type) {
      case 'SIP':
        subject = `SIP Reminder: ${reminder.sipDetails?.fundSchemeCode || 'Your Investment'}`;
        body = `Hi ${userName},\n\nThis is a reminder for your SIP investment of ₹${reminder.sipDetails?.amount || '0'} scheduled for today.\n\n`;
        break;

      case 'GOAL_REVIEW':
        subject = `Goal Review: ${reminder.title}`;
        body = `Hi ${userName},\n\nTime to review your investment goal: ${reminder.title}\n\n`;
        if (reminder.linkedGoal) {
          body += `Target Amount: ₹${reminder.linkedGoal.targetAmount}\n`;
          body += `Target Date: ${DateUtil.formatDate(reminder.linkedGoal.targetDate)}\n\n`;
        }
        break;

      case 'REBALANCE':
        subject = `Portfolio Rebalancing Reminder`;
        body = `Hi ${userName},\n\nIt's time to review and rebalance your portfolio.\n\n`;
        break;

      default:
        subject = reminder.title;
        body = `Hi ${userName},\n\n${reminder.description}\n\n`;
    }

    body += `Best regards,\nMutual Funds Platform`;

    return { subject, body };
  }

  /**
   * Schedule next reminder for recurring reminders
   */
  async scheduleNextReminder(reminder) {
    try {
      const nextDate = this.calculateNextDate(
        reminder.reminderDate,
        reminder.frequency
      );

      await Reminder.findByIdAndUpdate(reminder._id, {
        status: 'PENDING',
        reminderDate: nextDate,
        nextScheduledAt: nextDate,
      });

      console.log(
        `📅 Next reminder scheduled for: ${DateUtil.formatDate(nextDate)}`
      );
    } catch (error) {
      console.error('❌ Error scheduling next reminder:', error.message);
    }
  }

  /**
   * Calculate next reminder date
   */
  calculateNextDate(currentDate, frequency) {
    const current = new Date(currentDate);

    switch (frequency) {
      case 'DAILY':
        current.setDate(current.getDate() + 1);
        break;
      case 'WEEKLY':
        current.setDate(current.getDate() + 7);
        break;
      case 'MONTHLY':
        current.setMonth(current.getMonth() + 1);
        break;
      case 'QUARTERLY':
        current.setMonth(current.getMonth() + 3);
        break;
      case 'YEARLY':
        current.setFullYear(current.getFullYear() + 1);
        break;
    }

    return current;
  }

  /**
   * Main job execution
   */
  async execute() {
    const startTime = Date.now();
    console.log('🚀 Starting reminder job...');
    console.log(`⏰ Time: ${DateUtil.formatDateTime(new Date())}`);

    try {
      // Get pending reminders
      const reminders = await this.getPendingReminders();

      if (reminders.length === 0) {
        console.log('✅ No pending reminders');
        return {
          success: true,
          remindersSent: 0,
        };
      }

      // Send reminders
      let sent = 0;
      let failed = 0;

      for (const reminder of reminders) {
        const success = await this.sendReminder(reminder);
        if (success) {
          sent++;
        } else {
          failed++;
        }
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      console.log('✅ Reminder job completed');
      console.log(`📊 Stats: ${sent} sent, ${failed} failed`);
      console.log(`⏱️ Duration: ${duration}s`);

      return {
        success: true,
        remindersSent: sent,
        remindersFailed: failed,
        duration: duration,
      };
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      console.error('❌ Reminder job failed');
      console.error(`Error: ${error.message}`);
      console.error(`⏱️ Duration: ${duration}s`);

      return {
        success: false,
        error: error.message,
        duration: duration,
      };
    }
  }
}

// Export singleton instance
const reminderJob = new ReminderJob();

module.exports = reminderJob;

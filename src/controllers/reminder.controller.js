/**
 * Reminder Controller
 * Handles user reminders
 */

const Reminder = require('../models/Reminder.model');

class ReminderController {
  /**
   * Get all user reminders
   * GET /api/reminders?status=PENDING
   */
  static async getReminders(req, res) {
    try {
      const userId = req.user.userId;
      const { status } = req.query;

      const query = { userId };
      if (status) query.status = status;

      const reminders = await Reminder.find(query)
        .populate('linkedGoal')
        .sort({ reminderDate: 1 })
        .lean();

      res.json({
        success: true,
        data: reminders,
      });
    } catch (error) {
      console.error('Error fetching reminders:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reminders',
        message: error.message,
      });
    }
  }

  /**
   * Get reminder by ID
   * GET /api/reminders/:id
   */
  static async getReminderById(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const reminder = await Reminder.findOne({ _id: id, userId })
        .populate('linkedGoal')
        .lean();

      if (!reminder) {
        return res.status(404).json({
          success: false,
          error: 'Reminder not found',
        });
      }

      res.json({
        success: true,
        data: reminder,
      });
    } catch (error) {
      console.error('Error fetching reminder:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reminder',
        message: error.message,
      });
    }
  }

  /**
   * Create new reminder
   * POST /api/reminders
   */
  static async createReminder(req, res) {
    try {
      const userId = req.user.userId;
      const {
        type,
        title,
        description,
        reminderDate,
        frequency = 'ONCE',
        notifyVia,
        linkedGoal,
        linkedFunds,
        sipDetails,
      } = req.body;

      // Validate required fields
      if (!type || !title || !reminderDate) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'Type, title, and reminder date are required',
        });
      }

      // Create reminder
      const reminder = new Reminder({
        userId,
        type,
        title,
        description,
        reminderDate: new Date(reminderDate),
        frequency,
        notifyVia: notifyVia || { email: true, push: false },
        linkedGoal,
        linkedFunds: linkedFunds || [],
        sipDetails,
        status: 'PENDING',
      });

      await reminder.save();

      res.status(201).json({
        success: true,
        message: 'Reminder created successfully',
        data: reminder,
      });
    } catch (error) {
      console.error('Error creating reminder:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create reminder',
        message: error.message,
      });
    }
  }

  /**
   * Update reminder
   * PUT /api/reminders/:id
   */
  static async updateReminder(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const updates = req.body;

      // Remove fields that shouldn't be updated directly
      delete updates.userId;
      delete updates._id;
      delete updates.createdAt;

      const reminder = await Reminder.findOneAndUpdate(
        { _id: id, userId },
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!reminder) {
        return res.status(404).json({
          success: false,
          error: 'Reminder not found',
        });
      }

      res.json({
        success: true,
        message: 'Reminder updated successfully',
        data: reminder,
      });
    } catch (error) {
      console.error('Error updating reminder:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update reminder',
        message: error.message,
      });
    }
  }

  /**
   * Mark reminder as completed
   * PATCH /api/reminders/:id/complete
   */
  static async completeReminder(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const reminder = await Reminder.findOne({ _id: id, userId });

      if (!reminder) {
        return res.status(404).json({
          success: false,
          error: 'Reminder not found',
        });
      }

      await reminder.markAsCompleted();

      res.json({
        success: true,
        message: 'Reminder marked as completed',
        data: reminder,
      });
    } catch (error) {
      console.error('Error completing reminder:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to complete reminder',
        message: error.message,
      });
    }
  }

  /**
   * Delete reminder
   * DELETE /api/reminders/:id
   */
  static async deleteReminder(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const reminder = await Reminder.findOneAndDelete({ _id: id, userId });

      if (!reminder) {
        return res.status(404).json({
          success: false,
          error: 'Reminder not found',
        });
      }

      res.json({
        success: true,
        message: 'Reminder deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting reminder:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete reminder',
        message: error.message,
      });
    }
  }

  /**
   * Get upcoming reminders
   * GET /api/reminders/upcoming?days=7
   */
  static async getUpcomingReminders(req, res) {
    try {
      const userId = req.user.userId;
      const days = parseInt(req.query.days) || 7;

      const reminders = await Reminder.getUpcomingReminders(userId, days);

      res.json({
        success: true,
        data: reminders,
        meta: {
          days,
          count: reminders.length,
        },
      });
    } catch (error) {
      console.error('Error fetching upcoming reminders:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch upcoming reminders',
        message: error.message,
      });
    }
  }
}

module.exports = ReminderController;

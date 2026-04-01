import express from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Reservation from '../models/Reservation.js';

const router = express.Router();

// Middleware to protect routes
import { protect } from '../middleware/auth.js';
router.use(protect);

// GET /api/notifications - Get user's notifications
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const query = { recipient: req.user._id };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }
    
    const notifications = await Notification.find(query)
      .populate('reservation', 'reservationNumber hotel checkInDate checkOutDate')
      .populate('hotel', 'name image')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      recipient: req.user._id, 
      isRead: false 
    });
    
    res.json({
      notifications,
      total: count,
      unread: unreadCount,
      page: parseInt(page),
      pages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// GET /api/notifications/unread-count - Get unread count
router.get('/unread-count', async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      recipient: req.user._id, 
      isRead: false 
    });
    
    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Error fetching unread count' });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findOne({ 
      _id: req.params.id, 
      recipient: req.user._id 
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    await notification.markAsRead();
    
    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error updating notification' });
  }
});

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ message: 'Error updating notifications' });
  }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ 
      _id: req.params.id, 
      recipient: req.user._id 
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
});

// GET /api/notifications/stats - Get notification statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Notification.countDocuments({ recipient: req.user._id });
    const unread = await Notification.countDocuments({ 
      recipient: req.user._id, 
      isRead: false 
    });
    const read = total - unread;
    
    const byCategory = await Notification.aggregate([
      { $match: { recipient: new mongoose.Types.ObjectId(req.user._id) } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    res.json({
      total,
      unread,
      read,
      byCategory: byCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

export default router;

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Recipient (who receives the notification)
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Type of notification
  type: {
    type: String,
    enum: [
      'reservation_new',           // New reservation (admin)
      'reservation_confirmed',     // Reservation confirmed (client)
      'reservation_cancelled',     // Reservation cancelled (both)
      'reservation_pending',       // Reservation pending confirmation (client)
      'payment_received',          // Payment confirmed (client)
      'payment_pending',           // Payment pending (client)
      'checkin_reminder',          // Check-in reminder (client)
      'checkout_reminder',         // Check-out reminder (client)
      'special_offer',             // Special offer/promotion (client)
      'hotel_announcement',        // Hotel announcement (client)
      'room_available',            // Room available notification (client)
      'review_request',            // Review request after stay (client)
      'welcome',                   // Welcome message (client)
      'system',                    // System notification (both)
    ],
    required: true
  },
  
  // Category for grouping
  category: {
    type: String,
    enum: ['reservation', 'payment', 'promotion', 'system', 'reminder'],
    default: 'system'
  },
  
  // Title of notification
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  
  // Message content
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  // Related reservation (optional)
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
  },
  
  // Related hotel (optional)
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  
  // Read status
  isRead: {
    type: Boolean,
    default: false
  },
  
  // Read timestamp
  readAt: {
    type: Date
  },
  
  // Priority level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Action URL (optional)
  actionUrl: {
    type: String
  },
  
  // Action button text (optional)
  actionText: {
    type: String
  },
  
  // Icon/emoji for notification
  icon: {
    type: String,
    default: '📢'
  },
  
  // Expiry date (for promotions)
  expiresAt: {
    type: Date
  },
  
  // Metadata for extra data
  metadata: {
    type: Object,
    default: {}
  }
  
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ type: 1, createdAt: -1 });

// Mark as read method
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  await notification.save();
  return notification;
};

// Static method to send to multiple users
notificationSchema.statics.broadcast = async function(userIds, data) {
  const notifications = userIds.map(userId => ({
    ...data,
    recipient: userId
  }));
  return await this.insertMany(notifications);
};

export default mongoose.model('Notification', notificationSchema);

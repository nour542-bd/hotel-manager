import Notification from '../models/Notification.js';
import User from '../models/User.js';

// Notification templates
const templates = {
  // Admin Notifications
  admin_new_reservation: {
    title: 'Nouvelle Réservation',
    message: (data) => `${data.clientName} a réservé une chambre à ${data.hotelName} du ${data.checkIn} au ${data.checkOut}.`,
    icon: '📅',
    priority: 'high',
    category: 'reservation',
    type: 'reservation_new',
    actionUrl: '/admin/reservations',
    actionText: 'Voir la réservation'
  },
  
  admin_reservation_cancelled: {
    title: 'Réservation Annulée',
    message: (data) => `${data.clientName} a annulé la réservation ${data.reservationNumber} à ${data.hotelName}.`,
    icon: '❌',
    priority: 'medium',
    category: 'reservation',
    type: 'reservation_cancelled',
    actionUrl: '/admin/reservations',
    actionText: 'Voir les détails'
  },
  
  // Client Notifications
  client_reservation_confirmed: {
    title: 'Réservation Confirmée ✅',
    message: (data) => `Votre réservation ${data.reservationNumber} à ${data.hotelName} a été confirmée!`,
    icon: '✅',
    priority: 'high',
    category: 'reservation',
    type: 'reservation_confirmed',
    actionUrl: '/client/reservations',
    actionText: 'Voir ma réservation'
  },
  
  client_reservation_pending: {
    title: 'Réservation en Attente',
    message: (data) => `Votre réservation ${data.reservationNumber} est en attente de confirmation.`,
    icon: '⏳',
    priority: 'medium',
    category: 'reservation',
    type: 'reservation_pending',
    actionUrl: '/client/reservations',
    actionText: 'Voir le statut'
  },
  
  client_reservation_cancelled: {
    title: 'Réservation Annulée',
    message: (data) => `Votre réservation ${data.reservationNumber} a été annulée.`,
    icon: '❌',
    priority: 'medium',
    category: 'reservation',
    type: 'reservation_cancelled',
    actionUrl: '/client/reservations',
    actionText: 'Voir les détails'
  },
  
  client_payment_received: {
    title: 'Paiement Reçu ✅',
    message: (data) => `Nous avons bien reçu votre paiement de ${data.amount} TND pour la réservation ${data.reservationNumber}.`,
    icon: '💰',
    priority: 'high',
    category: 'payment',
    type: 'payment_received',
    actionUrl: '/client/reservations',
    actionText: 'Voir le reçu'
  },
  
  client_payment_pending: {
    title: 'Paiement en Attente',
    message: (data) => `Votre paiement de ${data.amount} TND pour la réservation ${data.reservationNumber} est en attente.`,
    icon: '⏰',
    priority: 'high',
    category: 'payment',
    type: 'payment_pending',
    actionUrl: '/client/reservations',
    actionText: 'Payer maintenant'
  },
  
  client_checkin_reminder: {
    title: 'Rappel Check-in',
    message: (data) => `N'oubliez pas! Votre check-in à ${data.hotelName} est demain à partir de 14h.`,
    icon: '🔑',
    priority: 'urgent',
    category: 'reminder',
    type: 'checkin_reminder',
    actionUrl: '/client/reservations',
    actionText: 'Voir les détails'
  },
  
  client_checkout_reminder: {
    title: 'Rappel Check-out',
    message: (data) => `Votre check-out à ${data.hotelName} est prévu demain avant 12h.`,
    icon: '👋',
    priority: 'high',
    category: 'reminder',
    type: 'checkout_reminder',
    actionUrl: '/client/reservations',
    actionText: 'Voir les détails'
  },
  
  client_special_offer: {
    title: 'Offre Spéciale 🎉',
    message: (data) => `Profitez de ${data.discount}% de réduction à ${data.hotelName}! Valable jusqu'au ${data.validUntil}.`,
    icon: '🎁',
    priority: 'medium',
    category: 'promotion',
    type: 'special_offer',
    actionUrl: '/client/hotels',
    actionText: 'Profiter de l\'offre'
  },
  
  client_hotel_announcement: {
    title: 'Annonce Importante',
    message: (data) => `${data.hotelName}: ${data.announcement}`,
    icon: '📢',
    priority: 'high',
    category: 'system',
    type: 'hotel_announcement',
    actionUrl: '/client/hotels',
    actionText: 'Voir l\'annonce'
  },
  
  client_room_available: {
    title: 'Chambre Disponible 🏨',
    message: (data) => `Une chambre ${data.roomType} est maintenant disponible à ${data.hotelName} pour vos dates!`,
    icon: '🛎️',
    priority: 'medium',
    category: 'promotion',
    type: 'room_available',
    actionUrl: '/client/hotels',
    actionText: 'Réserver maintenant'
  },
  
  client_welcome: {
    title: 'Bienvenue! 🎉',
    message: (data) => `Bienvenue ${data.userName}! Merci de nous avoir rejoints. Découvrez nos hôtels d'exception en Tunisie.`,
    icon: '👋',
    priority: 'medium',
    category: 'system',
    type: 'welcome',
    actionUrl: '/client/hotels',
    actionText: 'Explorer les hôtels'
  },
  
  client_review_request: {
    title: 'Votre Avis Nous Intéresse ⭐',
    message: (data) => `Comment s'est passé votre séjour à ${data.hotelName}? Partagez votre expérience!`,
    icon: '⭐',
    priority: 'low',
    category: 'system',
    type: 'review_request',
    actionUrl: '/client/reservations',
    actionText: 'Laisser un avis'
  }
};

// Create a notification
export const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Send notification to admin users
export const notifyAdmins = async (type, data) => {
  try {
    const template = templates[type];
    if (!template) {
      throw new Error(`Notification template ${type} not found`);
    }
    
    const adminUsers = await User.find({ role: 'admin', isActive: true });
    
    const notifications = adminUsers.map(admin => ({
      recipient: admin._id,
      title: template.title,
      message: template.message(data),
      icon: template.icon,
      priority: template.priority,
      category: template.category,
      type: template.type,
      actionUrl: template.actionUrl,
      actionText: template.actionText,
      metadata: data
    }));
    
    return await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Error notifying admins:', error);
    throw error;
  }
};

// Send notification to a specific user
export const notifyUser = async (userId, type, data) => {
  try {
    const template = templates[type];
    if (!template) {
      throw new Error(`Notification template ${type} not found`);
    }
    
    return await createNotification({
      recipient: userId,
      title: template.title,
      message: template.message(data),
      icon: template.icon,
      priority: template.priority,
      category: template.category,
      type: template.type,
      actionUrl: template.actionUrl,
      actionText: template.actionText,
      metadata: data
    });
  } catch (error) {
    console.error('Error notifying user:', error);
    throw error;
  }
};

// Broadcast notification to multiple users
export const broadcastNotification = async (userIds, type, data) => {
  try {
    const template = templates[type];
    if (!template) {
      throw new Error(`Notification template ${type} not found`);
    }
    
    const notifications = userIds.map(userId => ({
      recipient: userId,
      title: template.title,
      message: template.message(data),
      icon: template.icon,
      priority: template.priority,
      category: template.category,
      type: template.type,
      actionUrl: template.actionUrl,
      actionText: template.actionText,
      metadata: data
    }));
    
    return await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    throw error;
  }
};

// Send welcome notification to new user
export const sendWelcomeNotification = async (user) => {
  return notifyUser(user._id, 'client_welcome', { userName: user.name });
};

// Notify admins of new reservation
export const notifyNewReservation = async (reservation) => {
  const data = {
    clientName: reservation.client?.name,
    hotelName: reservation.hotel?.name,
    checkIn: new Date(reservation.checkInDate).toLocaleDateString('fr-FR'),
    checkOut: new Date(reservation.checkOutDate).toLocaleDateString('fr-FR'),
    reservationNumber: reservation.reservationNumber,
    reservationId: reservation._id
  };
  
  return notifyAdmins('admin_new_reservation', data);
};

// Notify admins of cancelled reservation
export const notifyCancelledReservation = async (reservation) => {
  const data = {
    clientName: reservation.client?.name,
    hotelName: reservation.hotel?.name,
    reservationNumber: reservation.reservationNumber,
    reservationId: reservation._id
  };
  
  return notifyAdmins('admin_reservation_cancelled', data);
};

// Notify client of reservation status change
export const notifyReservationStatus = async (reservation, status) => {
  const clientId = reservation.client;
  const data = {
    reservationNumber: reservation.reservationNumber,
    hotelName: reservation.hotel?.name,
    reservationId: reservation._id
  };
  
  if (status === 'confirmed') {
    return notifyUser(clientId, 'client_reservation_confirmed', data);
  } else if (status === 'pending') {
    return notifyUser(clientId, 'client_reservation_pending', data);
  } else if (status === 'cancelled') {
    return notifyUser(clientId, 'client_reservation_cancelled', data);
  }
};

// Notify client of payment status
export const notifyPaymentStatus = async (reservation, paymentStatus) => {
  const clientId = reservation.client;
  const data = {
    reservationNumber: reservation.reservationNumber,
    amount: reservation.totalPrice,
    reservationId: reservation._id
  };
  
  if (paymentStatus === 'completed') {
    return notifyUser(clientId, 'client_payment_received', data);
  } else if (paymentStatus === 'pending') {
    return notifyUser(clientId, 'client_payment_pending', data);
  }
};

// Send check-in reminder
export const sendCheckinReminder = async (reservation) => {
  const clientId = reservation.client;
  const data = {
    hotelName: reservation.hotel?.name,
    checkInDate: new Date(reservation.checkInDate).toLocaleDateString('fr-FR'),
    reservationId: reservation._id
  };
  
  return notifyUser(clientId, 'client_checkin_reminder', data);
};

// Send check-out reminder
export const sendCheckoutReminder = async (reservation) => {
  const clientId = reservation.client;
  const data = {
    hotelName: reservation.hotel?.name,
    checkOutDate: new Date(reservation.checkOutDate).toLocaleDateString('fr-FR'),
    reservationId: reservation._id
  };
  
  return notifyUser(clientId, 'client_checkout_reminder', data);
};

// Send special offer to all clients
export const sendSpecialOffer = async (hotel, discount, validUntil) => {
  const clients = await User.find({ role: 'client', isActive: true });
  const clientIds = clients.map(c => c._id);
  
  const data = {
    hotelName: hotel.name,
    discount,
    validUntil: new Date(validUntil).toLocaleDateString('fr-FR'),
    hotelId: hotel._id
  };
  
  return broadcastNotification(clientIds, 'client_special_offer', data);
};

// Send hotel announcement
export const sendHotelAnnouncement = async (hotel, announcement, targetClients = null) => {
  const data = {
    hotelName: hotel.name,
    announcement,
    hotelId: hotel._id
  };
  
  if (targetClients) {
    return broadcastNotification(targetClients, 'client_hotel_announcement', data);
  } else {
    const clients = await User.find({ role: 'client', isActive: true });
    const clientIds = clients.map(c => c._id);
    return broadcastNotification(clientIds, 'client_hotel_announcement', data);
  }
};

// Notify about available room
export const notifyRoomAvailable = async (room, hotel, dates) => {
  const clients = await User.find({ role: 'client', isActive: true }).limit(100);
  const clientIds = clients.map(c => c._id);
  
  const data = {
    roomType: room.type,
    hotelName: hotel.name,
    price: room.price,
    dates,
    roomId: room._id,
    hotelId: hotel._id
  };
  
  return broadcastNotification(clientIds, 'client_room_available', data);
};

// Request review from client
export const requestReview = async (reservation) => {
  const clientId = reservation.client;
  const data = {
    hotelName: reservation.hotel?.name,
    reservationId: reservation._id
  };
  
  return notifyUser(clientId, 'client_review_request', data);
};

export default {
  createNotification,
  notifyAdmins,
  notifyUser,
  broadcastNotification,
  sendWelcomeNotification,
  notifyNewReservation,
  notifyCancelledReservation,
  notifyReservationStatus,
  notifyPaymentStatus,
  sendCheckinReminder,
  sendCheckoutReminder,
  sendSpecialOffer,
  sendHotelAnnouncement,
  notifyRoomAvailable,
  requestReview
};

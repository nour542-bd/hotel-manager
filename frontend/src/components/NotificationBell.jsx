import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Calendar, DollarSign, AlertCircle, Info, Gift, Star, X } from 'lucide-react';
import api from '../lib/api';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    fetchUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications', { params: { limit: 5 } });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/api/notifications/unread-count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getIcon = (type) => {
    const icons = {
      reservation_new: Calendar,
      reservation_confirmed: Check,
      reservation_cancelled: X,
      reservation_pending: AlertCircle,
      payment_received: DollarSign,
      payment_pending: DollarSign,
      checkin_reminder: Info,
      checkout_reminder: Info,
      special_offer: Gift,
      hotel_announcement: Info,
      room_available: Star,
      welcome: Info,
      system: Info,
      review_request: Star,
    };
    const Icon = icons[type] || Info;
    return <Icon size={18} className="text-secondary" />;
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-40 max-h-[500px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Bell className="text-secondary" size={20} />
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-secondary hover:text-amber-400 transition-colors"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-slate-400">
                  Chargement...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Bell size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune notification</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {notifications.map(notif => (
                    <div
                      key={notif._id}
                      className={`p-4 hover:bg-slate-800 transition-colors ${
                        !notif.isRead ? 'bg-slate-800/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          !notif.isRead ? 'bg-secondary/20' : 'bg-slate-800'
                        }`}>
                          {getIcon(notif.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className={`font-semibold text-sm ${!notif.isRead ? 'text-white' : 'text-slate-400'}`}>
                                {notif.title}
                              </h4>
                              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                                {notif.message}
                              </p>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              {!notif.isRead && (
                                <button
                                  onClick={() => markAsRead(notif._id)}
                                  className="p-1 text-green-400 hover:bg-green-900/30 rounded transition-colors"
                                  title="Marquer comme lu"
                                >
                                  <Check size={14} />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notif._id)}
                                className="p-1 text-red-400 hover:bg-red-900/30 rounded transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Time */}
                          <div className="mt-2">
                            <span className="text-xs text-slate-500">
                              {new Date(notif.createdAt).toLocaleString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          {/* Action Link */}
                          {notif.actionUrl && (
                            <a
                              href={notif.actionUrl}
                              className="inline-block mt-2 text-xs text-secondary hover:text-amber-400 font-medium transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                window.location.href = notif.actionUrl;
                              }}
                            >
                              {notif.actionText} →
                            </a>
                          )}
                        </div>

                        {/* Unread Dot */}
                        {!notif.isRead && (
                          <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700">
              <a
                href="/notifications"
                className="block w-full text-center text-sm text-secondary hover:text-amber-400 font-medium transition-colors"
              >
                Voir toutes les notifications →
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

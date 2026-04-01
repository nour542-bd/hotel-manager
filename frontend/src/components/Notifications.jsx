import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, X, Calendar, DollarSign, AlertCircle, Info, Gift, Star } from 'lucide-react';
import api from '../lib/api';

export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const params = filter === 'unread' ? { unreadOnly: true } : {};
      const response = await api.get('/api/notifications', { params });
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread);
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
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      fetchNotifications();
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
    return <Icon size={20} />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'border-slate-600',
      medium: 'border-blue-600',
      high: 'border-orange-600',
      urgent: 'border-red-600',
    };
    return colors[priority] || 'border-slate-600';
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  if (loading) {
    return (
      <div className="p-4 text-center text-slate-400">
        Chargement des notifications...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bell className="text-secondary" size={24} />
          Notifications
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-secondary hover:text-amber-400 transition-colors"
          >
            Tout marquer comme lu ({unreadCount})
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'Toutes' },
          { id: 'unread', label: 'Non lues', count: unreadCount },
          { id: 'read', label: 'Lues' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-secondary text-primary'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {f.label} {f.count && `(${f.count})`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p>Aucune notification</p>
          </div>
        ) : (
          filteredNotifications.map(notif => (
            <div
              key={notif._id}
              className={`relative bg-slate-800 border-l-4 ${getPriorityColor(notif.priority)} rounded-lg p-4 transition-all hover:bg-slate-750 ${
                !notif.isRead ? 'bg-slate-800/80' : 'opacity-70'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  !notif.isRead ? 'bg-secondary/20 text-secondary' : 'bg-slate-700 text-slate-400'
                }`}>
                  {getIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-semibold ${!notif.isRead ? 'text-white' : 'text-slate-400'}`}>
                        {notif.title}
                      </h3>
                      <p className="text-sm text-slate-300 mt-1">{notif.message}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif._id)}
                          className="p-1.5 text-green-400 hover:bg-green-900/30 rounded transition-colors"
                          title="Marquer comme lu"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif._id)}
                        className="p-1.5 text-red-400 hover:bg-red-900/30 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-slate-500">
                      {new Date(notif.createdAt).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {notif.actionUrl && notif.actionText && (
                      <a
                        href={notif.actionUrl}
                        className="text-xs text-secondary hover:text-amber-400 font-medium transition-colors"
                      >
                        {notif.actionText} →
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Unread Indicator */}
              {!notif.isRead && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-secondary rounded-full"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

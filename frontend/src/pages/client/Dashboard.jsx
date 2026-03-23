import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export function ClientDashboard() {
  const { user } = useAuthStore();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reservations/my-reservations').then(res => {
      setReservations(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const total = reservations.length;
  const confirmed = reservations.filter(r => r.status === 'confirmed').length;
  const pending = reservations.filter(r => r.status === 'pending').length;
  const totalSpent = reservations.filter(r => r.paymentStatus === 'completed')
    .reduce((sum, r) => sum + r.totalPrice, 0);

  if (loading) return <div className="text-white">Chargement...</div>;

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-2">
        👋 Bonjour, {user?.name} !
      </h1>
      <p className="text-slate-400 mb-8">Bienvenue sur votre espace client</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Total Réservations</p>
          <p className="text-3xl font-bold text-yellow-400">{total}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Confirmées</p>
          <p className="text-3xl font-bold text-green-400">{confirmed}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">En Attente</p>
          <p className="text-3xl font-bold text-orange-400">{pending}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Total Dépensé</p>
          <p className="text-3xl font-bold text-blue-400">{totalSpent} TND</p>
        </div>
      </div>

      {/* Réservations récentes */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4">📋 Mes Réservations Récentes</h2>
        {reservations.length === 0 ? (
          <p className="text-slate-400">Aucune réservation pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {reservations.slice(0, 5).map(res => (
              <div key={res._id} className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                <div>
                  <p className="font-semibold text-yellow-400">{res.reservationNumber}</p>
                  <p className="text-slate-300 text-sm">{res.hotel?.name}</p>
                  <p className="text-slate-400 text-xs">
                    {new Date(res.checkInDate).toLocaleDateString()} → {new Date(res.checkOutDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{res.totalPrice} TND</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    res.status === 'confirmed' ? 'bg-green-900 text-green-400' :
                    res.status === 'pending' ? 'bg-yellow-900 text-yellow-400' :
                    res.status === 'cancelled' ? 'bg-red-900 text-red-400' :
                    'bg-slate-600 text-slate-300'
                  }`}>
                    {res.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
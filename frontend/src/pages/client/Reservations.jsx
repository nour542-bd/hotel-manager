import { useState, useEffect } from 'react';
import api from '../../lib/api';

export function ClientReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reservations/my-reservations').then(res => {
      setReservations(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statusColor = {
    pending: 'text-yellow-400',
    confirmed: 'text-green-400',
    'checked-in': 'text-blue-400',
    'checked-out': 'text-slate-400',
    cancelled: 'text-red-400',
  };

  if (loading) return <div className="text-white">Chargement...</div>;

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">📋 Mes Réservations</h1>
      {reservations.length === 0 ? (
        <p className="text-slate-400">Aucune réservation trouvée.</p>
      ) : (
        <div className="grid gap-4">
          {reservations.map(res => (
            <div key={res._id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-bold text-yellow-400">{res.reservationNumber}</h2>
                <span className={`font-semibold ${statusColor[res.status]}`}>
                  {res.status.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-300">🏨 {res.hotel?.name}</p>
              <p className="text-slate-300">🛏️ Chambre {res.room?.roomNumber}</p>
              <p className="text-slate-300">📅 Check-in: {new Date(res.checkInDate).toLocaleDateString()}</p>
              <p className="text-slate-300">📅 Check-out: {new Date(res.checkOutDate).toLocaleDateString()}</p>
              <p className="text-slate-300">👥 {res.numberOfGuests} guest(s)</p>
              <p className="text-yellow-400 font-bold mt-2">💰 {res.totalPrice} TND</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
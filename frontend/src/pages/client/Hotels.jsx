import { useState, useEffect } from 'react';
import api from '../../lib/api';

export function ClientHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/hotels').then(res => {
      setHotels(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white">Chargement...</div>;

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">🏨 Hôtels Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map(hotel => (
          <div key={hotel._id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-yellow-400 mb-2">{hotel.name}</h2>
            <p className="text-slate-400 mb-3">{hotel.description}</p>
            <p className="text-slate-300 mb-1">📍 {hotel.address?.city}, {hotel.address?.country}</p>
            <p className="text-slate-300 mb-1">📞 {hotel.phone}</p>
            <p className="text-slate-300 mb-3">🛏️ {hotel.totalRooms} chambres</p>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities?.map((a, i) => (
                <span key={i} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">{a}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
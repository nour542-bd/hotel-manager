import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export function ClientHotels() {
  const { user } = useAuthStore();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: '',
    paymentMethod: 'carte',
  });

  useEffect(() => {
    api.get('/hotels').then(res => {
      setHotels(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSelectHotel = async (hotel) => {
    setSelectedHotel(hotel);
    setLoadingRooms(true);
    setShowReservationForm(false);
    setSelectedRoom(null);
    setSuccess('');
    setError('');
    try {
      const res = await api.get('/rooms/hotel/' + hotel._id);
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setShowReservationForm(true);
    setSuccess('');
    setError('');
    window.scrollTo(0, 400);
  };

  const calculateTotal = () => {
    if (!formData.checkInDate || !formData.checkOutDate || !selectedRoom) return 0;
    const start = new Date(formData.checkInDate);
    const end = new Date(formData.checkOutDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights * selectedRoom.price : 0;
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    setError('');
    const total = calculateTotal();
    if (total <= 0) {
      setError('Dates invalides !');
      return;
    }
    try {
      await api.post('/reservations', {
        client: user._id,
        hotel: selectedHotel._id,
        room: selectedRoom._id,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfGuests: formData.numberOfGuests,
        specialRequests: formData.specialRequests,
        paymentMethod: formData.paymentMethod,
        totalPrice: total,
        status: 'pending',
        paymentStatus: 'pending',
      });
      setSuccess('Reservation confirmee ! Vous pouvez la voir dans "Mes Reservations"');
      setShowReservationForm(false);
      setSelectedRoom(null);
      setFormData({ checkInDate: '', checkOutDate: '', numberOfGuests: 1, specialRequests: '', paymentMethod: 'carte' });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la reservation');
    }
  };

  const inputClass = "w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-yellow-400";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1";

  if (loading) return <div className="text-white text-xl">Chargement...</div>;

  return (
    <div className="text-white space-y-6">
      <h1 className="text-3xl font-bold">Hotels Disponibles</h1>

      {/* Liste des hotels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map(hotel => (
          <div key={hotel._id}
            className={"bg-slate-800 rounded-xl p-6 border-2 transition-all cursor-pointer " +
              (selectedHotel?._id === hotel._id ? 'border-yellow-400' : 'border-slate-700 hover:border-slate-500')}>
            <h2 className="text-xl font-bold text-yellow-400 mb-2">{hotel.name}</h2>
            <p className="text-slate-400 mb-3 text-sm">{hotel.description}</p>
            <p className="text-slate-300 mb-1 text-sm">📍 {hotel.address?.city}, {hotel.address?.country}</p>
            <p className="text-slate-300 mb-1 text-sm">📞 {hotel.phone}</p>
            <p className="text-slate-300 mb-3 text-sm">🛏️ {hotel.totalRooms} chambres</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {hotel.amenities?.map((a, i) => (
                <span key={i} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">{a}</span>
              ))}
            </div>
            <button
              onClick={() => handleSelectHotel(hotel)}
              className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors">
              Voir les chambres
            </button>
          </div>
        ))}
      </div>

      {/* Chambres de l'hotel selectionne */}
      {selectedHotel && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-2xl font-bold mb-2">Chambres - {selectedHotel.name}</h2>
          <p className="text-slate-400 mb-4">Selectionnez une chambre pour faire une reservation</p>

          {success && (
            <div className="bg-green-900 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-4">
              ✅ {success}
            </div>
          )}

          {loadingRooms ? (
            <p className="text-slate-400">Chargement des chambres...</p>
          ) : rooms.length === 0 ? (
            <p className="text-slate-400">Aucune chambre disponible</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map(room => (
                <div key={room._id}
                  className={"rounded-xl p-5 border-2 transition-all " +
                    (room.status !== 'available' ? 'border-slate-700 opacity-50' :
                     selectedRoom?._id === room._id ? 'border-yellow-400 bg-slate-700' :
                     'border-slate-600 bg-slate-700 hover:border-yellow-400 cursor-pointer')}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold">Chambre {room.roomNumber}</h3>
                    <span className={"text-xs px-2 py-1 rounded-full " +
                      (room.status === 'available' ? 'bg-green-900 text-green-300' :
                       room.status === 'occupied' ? 'bg-red-900 text-red-300' :
                       'bg-orange-900 text-orange-300')}>
                      {room.status}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm capitalize mb-1">Type: {room.type}</p>
                  <p className="text-slate-300 text-sm mb-1">Capacite: {room.capacity} personnes</p>
                  <p className="text-slate-300 text-sm mb-1">Etage: {room.floor}</p>
                  <p className="text-yellow-400 font-bold text-lg mb-3">{room.price} TND / nuit</p>
                  {room.status === 'available' ? (
                    <button
                      onClick={() => handleSelectRoom(room)}
                      className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors">
                      Reserver
                    </button>
                  ) : (
                    <button disabled
                      className="w-full py-2 bg-slate-600 text-slate-400 rounded-lg cursor-not-allowed">
                      Non disponible
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Formulaire de reservation */}
      {showReservationForm && selectedRoom && (
        <div className="bg-slate-800 rounded-xl p-6 border-2 border-yellow-400">
          <h2 className="text-2xl font-bold mb-1">Confirmer la Reservation</h2>
          <p className="text-slate-400 mb-4">
            Hotel: {selectedHotel.name} - Chambre {selectedRoom.roomNumber} ({selectedRoom.type}) - {selectedRoom.price} TND/nuit
          </p>

          {error && (
            <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleReservation} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date Check-in</label>
                <input type="date" className={inputClass}
                  value={formData.checkInDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setFormData({ ...formData, checkInDate: e.target.value })}
                  required />
              </div>
              <div>
                <label className={labelClass}>Date Check-out</label>
                <input type="date" className={inputClass}
                  value={formData.checkOutDate}
                  min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                  onChange={e => setFormData({ ...formData, checkOutDate: e.target.value })}
                  required />
              </div>
              <div>
                <label className={labelClass}>Nombre de personnes</label>
                <input type="number" className={inputClass}
                  value={formData.numberOfGuests}
                  min="1" max={selectedRoom.capacity}
                  onChange={e => setFormData({ ...formData, numberOfGuests: e.target.value })}
                  required />
              </div>
              <div>
                <label className={labelClass}>Methode de paiement</label>
                <select className={inputClass} value={formData.paymentMethod}
                  onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}>
                  <option value="carte">Carte bancaire</option>
                  <option value="especes">Especes</option>
                  <option value="virement">Virement bancaire</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Demandes speciales (optionnel)</label>
                <textarea className={inputClass} rows="2"
                  value={formData.specialRequests}
                  onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Ex: chambre non-fumeur, lit bebe..." />
              </div>
            </div>

            {/* Prix total */}
            {calculateTotal() > 0 && (
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Prix par nuit:</span>
                  <span className="text-white font-semibold">{selectedRoom.price} TND</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-slate-300">Nombre de nuits:</span>
                  <span className="text-white font-semibold">
                    {Math.ceil((new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-600">
                  <span className="text-lg font-bold text-yellow-400">Total:</span>
                  <span className="text-2xl font-bold text-yellow-400">{calculateTotal()} TND</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit"
                className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors text-lg">
                Confirmer la Reservation
              </button>
              <button type="button"
                onClick={() => { setShowReservationForm(false); setSelectedRoom(null); }}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
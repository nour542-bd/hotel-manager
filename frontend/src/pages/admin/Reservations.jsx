import { useEffect, useState } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import api from '../../lib/api';

export function ReservationsAdmin() {
  const [reservations, setReservations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    client: '',
    hotel: '',
    room: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    status: 'pending',
    totalPrice: 0,
    paymentStatus: 'pending',
    specialRequests: '',
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [resRes, hotelsRes, clientsRes] = await Promise.all([
        api.get('/reservations'),
        api.get('/hotels'),
        api.get('/clients'),
      ]);

      setReservations(resRes.data);
      setHotels(hotelsRes.data);
      setClients(clientsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomsByHotel = async (hotelId) => {
    try {
      const res = await api.get('/rooms/hotel/' + hotelId);
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleHotelChange = (hotelId) => {
    setFormData({ ...formData, hotel: hotelId, room: '' });
    if (hotelId) fetchRoomsByHotel(hotelId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put('/reservations/' + editingId, formData);
      } else {
        await api.post('/reservations', formData);
      }

      resetForm();
      fetchAll();
    } catch (err) {
      alert('Erreur: ' + (err.response?.data?.message || 'Erreur serveur'));
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer cette réservation ?')) {
      try {
        await api.delete('/reservations/' + id);
        fetchAll();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (res) => {
    setFormData({
      client: res.client?._id || '',
      hotel: res.hotel?._id || '',
      room: res.room?._id || '',
      checkInDate: res.checkInDate?.split('T')[0] || '',
      checkOutDate: res.checkOutDate?.split('T')[0] || '',
      numberOfGuests: res.numberOfGuests || 1,
      status: res.status || 'pending',
      totalPrice: res.totalPrice || 0,
      paymentStatus: res.paymentStatus || 'pending',
      specialRequests: res.specialRequests || '',
    });

    if (res.hotel?._id) fetchRoomsByHotel(res.hotel._id);

    setEditingId(res._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setFormData({
      client: '',
      hotel: '',
      room: '',
      checkInDate: '',
      checkOutDate: '',
      numberOfGuests: 1,
      status: 'pending',
      totalPrice: 0,
      paymentStatus: 'pending',
      specialRequests: '',
    });

    setEditingId(null);
    setShowForm(false);
    setRooms([]);
  };

  const filteredReservations =
    filter === 'all'
      ? reservations
      : reservations.filter((r) => r.status === filter);

  const statusColors = {
    pending: 'bg-yellow-900 text-yellow-200',
    confirmed: 'bg-green-900 text-green-200',
    'checked-in': 'bg-blue-900 text-blue-200',
    'checked-out': 'bg-slate-700 text-slate-200',
    cancelled: 'bg-red-900 text-red-200',
  };

  const inputClass =
    "w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-yellow-400";

  const labelClass =
    "block text-sm font-medium text-slate-300 mb-1";

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reservations</h1>
          <p className="text-slate-400">
            Gestion de toutes les reservations
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg"
        >
          <Plus size={20} />
          Nouvelle Reservation
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">

          <h2 className="text-white font-bold text-lg mb-4">
            {editingId ? 'Modifier' : 'Ajouter'} une Reservation
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className={labelClass}>Client</label>

                <select
                  className={inputClass}
                  value={formData.client}
                  onChange={(e) =>
                    setFormData({ ...formData, client: e.target.value })
                  }
                  required
                >
                  <option value="">Selectionner un client</option>

                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} - {c.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Hotel</label>

                <select
                  className={inputClass}
                  value={formData.hotel}
                  onChange={(e) =>
                    handleHotelChange(e.target.value)
                  }
                  required
                >
                  <option value="">Selectionner un hotel</option>

                  {hotels.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Chambre</label>

                <select
                  className={inputClass}
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({ ...formData, room: e.target.value })
                  }
                  required
                >
                  <option value="">Selectionner une chambre</option>

                  {rooms.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.roomNumber} - {r.type} - {r.price} TND/nuit
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Nombre de guests</label>

                <input
                  type="number"
                  className={inputClass}
                  value={formData.numberOfGuests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numberOfGuests: e.target.value,
                    })
                  }
                  min="1"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Date Check-in</label>

                <input
                  type="date"
                  className={inputClass}
                  value={formData.checkInDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      checkInDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Date Check-out</label>

                <input
                  type="date"
                  className={inputClass}
                  value={formData.checkOutDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      checkOutDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              Enregistrer
            </button>

          </form>
        </div>
      )}

    </div>
  );
}

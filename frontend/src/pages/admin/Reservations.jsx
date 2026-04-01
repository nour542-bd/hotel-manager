import { useEffect, useState } from 'react';
import { Calendar, Clock, Users, DollarSign, Check, X, Edit2, Trash2, Plus, Search, Filter, TrendingUp, Eye, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import api from '../../lib/api';

export function ReservationsAdmin() {
  const [reservations, setReservations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

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
    const interval = setInterval(fetchAll, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
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
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomsByHotel = async (hotelId) => {
    try {
      const res = await api.get(`/rooms/hotel/${hotelId}`);
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleHotelChange = (hotelId) => {
    setFormData({ ...formData, hotel: hotelId, room: '' });
    if (hotelId) fetchRoomsByHotel(hotelId);
  };

  const calculateTotal = () => {
    const { room, checkInDate, checkOutDate } = formData;
    if (!room || !checkInDate || !checkOutDate) return 0;
    
    const selectedRoom = rooms.find(r => r._id === room);
    if (!selectedRoom) return 0;
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights * selectedRoom.price;
  };

  useEffect(() => {
    const total = calculateTotal();
    if (total > 0 && formData.totalPrice !== total) {
      setFormData(prev => ({ ...prev, totalPrice: total }));
    }
  }, [formData.room, formData.checkInDate, formData.checkOutDate, rooms]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/reservations/${editingId}`, formData);
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
        await api.delete(`/reservations/${id}`);
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

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      await api.put(`/reservations/${reservationId}`, {
        ...reservations.find(r => r._id === reservationId),
        status: newStatus
      });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
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

  // Stats
  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    checkedIn: reservations.filter(r => r.status === 'checked-in').length,
    revenue: reservations
      .filter(r => r.paymentStatus === 'completed')
      .reduce((sum, r) => sum + r.totalPrice, 0),
  };

  // Filter & Search
  const filteredReservations = reservations.filter(res => {
    const matchesFilter = filter === 'all' || res.status === filter;
    const matchesSearch = searchTerm === '' || 
      res.reservationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.hotel?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusConfig = {
    pending: { color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700', label: 'En attente' },
    confirmed: { color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700', label: 'Confirmée' },
    'checked-in': { color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-700', label: 'Check-in' },
    'checked-out': { color: 'text-slate-400', bg: 'bg-slate-900/30', border: 'border-slate-700', label: 'Check-out' },
    cancelled: { color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700', label: 'Annulée' },
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors";
  const labelClass = "block text-sm font-medium text-slate-300 mb-2";

  if (loading && reservations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Calendar className="text-secondary" size={32} />
            Réservations
          </h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            Gérez toutes les réservations
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="text-slate-500 text-xs">• {lastUpdated.toLocaleTimeString()}</span>
          </p>
        </div>
        <Button 
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700"
        >
          <Plus size={20} className="mr-2" />
          Nouvelle Réservation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                <Calendar className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">En Attente</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-600 to-yellow-700">
                <Clock className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Confirmées</p>
                <p className="text-3xl font-bold text-green-400 mt-1">{stats.confirmed}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-600 to-green-700">
                <Check className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Check-in</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">{stats.checkedIn}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                <Users className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Revenus</p>
                <p className="text-3xl font-bold text-secondary mt-1">{stats.revenue} TND</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-secondary to-amber-600">
                <DollarSign className="text-primary" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Edit2 className="text-secondary" size={20} />
              {editingId ? 'Modifier' : 'Ajouter'} une Réservation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Client</label>
                  <select
                    className={inputClass}
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    required
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} - {c.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Hôtel</label>
                  <select
                    className={inputClass}
                    value={formData.hotel}
                    onChange={(e) => handleHotelChange(e.target.value)}
                    required
                  >
                    <option value="">Sélectionner un hôtel</option>
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
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    required
                  >
                    <option value="">Sélectionner une chambre</option>
                    {rooms.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.roomNumber} - {r.type} - {r.price} TND
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Check-in</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={formData.checkInDate}
                    onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Check-out</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={formData.checkOutDate}
                    onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Voyageurs</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={formData.numberOfGuests}
                    onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
                    min="1"
                    max="10"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Statut</label>
                  <select
                    className={inputClass}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="checked-in">Check-in</option>
                    <option value="checked-out">Check-out</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Paiement</label>
                  <select
                    className={inputClass}
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  >
                    <option value="pending">En attente</option>
                    <option value="completed">Payé</option>
                    <option value="refunded">Remboursé</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Prix Total (TND)</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={formData.totalPrice}
                    onChange={(e) => setFormData({ ...formData, totalPrice: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Demandes Spéciales</label>
                <textarea
                  className={inputClass}
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Chambre avec vue, lit king size..."
                  rows="3"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700">
                  {editingId ? 'Mettre à jour' : 'Créer'} la réservation
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                  className="bg-slate-700 hover:bg-slate-600"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'Toutes', count: reservations.length },
            { id: 'pending', label: 'En attente', count: stats.pending },
            { id: 'confirmed', label: 'Confirmées', count: stats.confirmed },
            { id: 'checked-in', label: 'Check-in', count: stats.checkedIn },
            { id: 'cancelled', label: 'Annulées', count: reservations.filter(r => r.status === 'cancelled').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-secondary text-primary'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700"
          />
        </div>
      </div>

      {/* Reservations List */}
      <div className="grid gap-4">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto mb-4 text-slate-600" size={48} />
            <p className="text-slate-400">Aucune réservation trouvée</p>
          </div>
        ) : (
          filteredReservations.map(res => {
            const config = statusConfig[res.status] || statusConfig.pending;
            return (
              <Card key={res._id} className="bg-slate-800 border-slate-700 hover:border-secondary/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} border ${config.border}`}>
                          {config.label}
                        </span>
                        <span className="text-secondary font-bold">{res.reservationNumber}</span>
                        <span className="text-slate-500 text-sm flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(res.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      {/* Client & Hotel */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-700 rounded-lg">
                            <Users className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{res.client?.name}</p>
                            <p className="text-slate-400 text-sm">{res.client?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-700 rounded-lg">
                            <Calendar className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{res.hotel?.name}</p>
                            <p className="text-slate-400 text-sm">{res.room?.roomNumber} - {res.room?.type}</p>
                          </div>
                        </div>
                      </div>

                      {/* Dates & Guests */}
                      <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                        <div>
                          <p className="text-slate-500 text-sm">Check-in</p>
                          <p className="text-white font-medium">{new Date(res.checkInDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm">Check-out</p>
                          <p className="text-white font-medium">{new Date(res.checkOutDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm">Voyageurs</p>
                          <p className="text-white font-medium">{res.numberOfGuests} personne(s)</p>
                        </div>
                      </div>

                      {/* Price & Payment */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                        <div>
                          <p className="text-slate-500 text-sm">Prix Total</p>
                          <p className="text-2xl font-bold text-secondary">{res.totalPrice} TND</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            res.paymentStatus === 'completed' 
                              ? 'bg-green-900/30 text-green-400 border border-green-700'
                              : res.paymentStatus === 'refunded'
                              ? 'bg-blue-900/30 text-blue-400 border border-blue-700'
                              : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                          }`}>
                            {res.paymentStatus === 'completed' ? 'Payé' : res.paymentStatus === 'refunded' ? 'Remboursé' : 'En attente'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-4 border-t border-slate-700 flex-wrap">
                        {res.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(res._id, 'confirmed')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check size={16} className="mr-1" />
                              Confirmer
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(res._id, 'cancelled')}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <X size={16} className="mr-1" />
                              Annuler
                            </Button>
                          </>
                        )}
                        {res.status === 'confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(res._id, 'checked-in')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Users size={16} className="mr-1" />
                            Check-in
                          </Button>
                        )}
                        {res.status === 'checked-in' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(res._id, 'checked-out')}
                            className="bg-slate-600 hover:bg-slate-700 text-white"
                          >
                            Check-out
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(res)}
                          className="bg-slate-700 hover:bg-slate-600"
                        >
                          <Edit2 size={16} className="mr-1" />
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(res._id)}
                          className="bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-700"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

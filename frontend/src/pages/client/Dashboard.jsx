import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, DollarSign, Plus, Edit2, Trash2, X, Check, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export function ClientDashboard() {
  const { user } = useAuthStore();
  const [reservations, setReservations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const [bookingData, setBookingData] = useState({
    hotel: '',
    room: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 2,
    specialRequests: '',
  });

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resRes, hotelsRes] = await Promise.all([
        api.get('/reservations/my-reservations'),
        api.get('/hotels'),
      ]);
      setReservations(resRes.data);
      setHotels(hotelsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleHotelChange = async (hotelId) => {
    setBookingData({ ...bookingData, hotel: hotelId, room: '' });
    if (hotelId) {
      try {
        const res = await api.get(`/rooms/hotel/${hotelId}`);
        setRooms(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const calculateTotal = () => {
    if (!bookingData.room || !bookingData.checkInDate || !bookingData.checkOutDate) return 0;
    const room = rooms.find(r => r._id === bookingData.room);
    if (!room) return 0;
    
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights * room.price;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    try {
      const total = calculateTotal();
      const room = rooms.find(r => r._id === bookingData.room);
      const hotel = hotels.find(h => h._id === bookingData.hotel);
      
      await api.post('/reservations', {
        client: user._id,
        hotel: bookingData.hotel,
        room: bookingData.room,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfGuests: bookingData.numberOfGuests,
        totalPrice: total,
        specialRequests: bookingData.specialRequests,
        status: 'pending',
        paymentStatus: 'pending',
      });

      alert('Réservation créée avec succès! Elle sera bientôt confirmée par l\'admin.');
      setShowBookingForm(false);
      resetBookingForm();
      fetchData();
    } catch (err) {
      alert('Erreur: ' + (err.response?.data?.message || 'Erreur lors de la réservation'));
    }
  };

  const handleCancel = async () => {
    if (!selectedReservation) return;
    
    try {
      await api.put(`/reservations/${selectedReservation._id}/cancel`);
      alert('Réservation annulée avec succès');
      setShowCancelModal(false);
      setSelectedReservation(null);
      fetchData();
    } catch (err) {
      alert('Erreur lors de l\'annulation');
    }
  };

  const resetBookingForm = () => {
    setBookingData({
      hotel: '',
      room: '',
      checkInDate: '',
      checkOutDate: '',
      numberOfGuests: 2,
      specialRequests: '',
    });
    setRooms([]);
  };

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
    totalSpent: reservations
      .filter(r => r.paymentStatus === 'completed')
      .reduce((sum, r) => sum + r.totalPrice, 0),
  };

  const filteredReservations = activeTab === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === activeTab);

  const statusConfig = {
    pending: { color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700', label: 'En attente' },
    confirmed: { color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700', label: 'Confirmée' },
    'checked-in': { color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-700', label: 'Check-in' },
    'checked-out': { color: 'text-slate-400', bg: 'bg-slate-900/30', border: 'border-slate-700', label: 'Check-out' },
    cancelled: { color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700', label: 'Annulée' },
  };

  if (loading) {
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
            Bonjour, {user?.name}! 👋
          </h1>
          <p className="text-slate-400 mt-1">Gérez vos réservations en toute simplicité</p>
        </div>
        <Button 
          onClick={() => setShowBookingForm(true)}
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
                <p className="text-slate-400 text-sm">Dépensé</p>
                <p className="text-3xl font-bold text-secondary mt-1">{stats.totalSpent} TND</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-secondary to-amber-600">
                <DollarSign className="text-primary" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Taux Confirmation</p>
                <p className="text-3xl font-bold text-purple-400 mt-1">
                  {stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700">
                <TrendingUp className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Plus className="text-secondary" size={24} />
                Nouvelle Réservation
              </h2>
              <button
                onClick={() => {
                  setShowBookingForm(false);
                  resetBookingForm();
                }}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="text-slate-400" size={24} />
              </button>
            </div>

            <form onSubmit={handleBooking} className="p-6 space-y-6">
              {/* Hotel Selection with Photos */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-secondary" />
                    Choisissez votre hôtel
                  </span>
                </label>
                <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                  {hotels.map(hotel => (
                    <button
                      key={hotel._id}
                      type="button"
                      onClick={() => handleHotelChange(hotel._id)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-xl ${
                        bookingData.hotel === hotel._id
                          ? 'border-secondary shadow-lg shadow-secondary/20'
                          : 'border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="aspect-video relative">
                        <img
                          src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop'}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-lg">{hotel.name}</h3>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-slate-300 text-sm flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {hotel.address?.city || 'Tunisie'}
                            </p>
                            {hotel.starRating && (
                              <div className="flex gap-0.5">
                                {[...Array(hotel.starRating)].map((_, i) => (
                                  <span key={i} className="text-yellow-500 text-xs">★</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {bookingData.hotel === hotel._id && (
                        <div className="absolute top-2 right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Selection */}
              {bookingData.hotel && rooms.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-4">
                    <span className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-secondary" />
                      Choisissez votre chambre
                    </span>
                  </label>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map(room => (
                      <button
                        key={room._id}
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, room: room._id })}
                        className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                          bookingData.room === room._id
                            ? 'border-secondary bg-secondary/10 shadow-lg shadow-secondary/20'
                            : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-bold">{room.roomNumber}</span>
                          <span className="text-secondary font-bold text-lg">{room.price} TND</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {room.capacity} pers.
                          </span>
                          <span className="capitalize">{room.type}</span>
                        </div>
                        {bookingData.room === room._id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={bookingData.checkInDate}
                    onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={bookingData.checkOutDate}
                    onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
                    required
                    min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Users className="inline w-4 h-4 mr-1" />
                  Nombre de voyageurs
                </label>
                <input
                  type="number"
                  value={bookingData.numberOfGuests}
                  onChange={(e) => setBookingData({ ...bookingData, numberOfGuests: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
                  min="1"
                  max="10"
                  required
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Demandes Spéciales (optionnel)
                </label>
                <textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  placeholder="Chambre avec vue, lit king size, etc."
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
                  rows="3"
                />
              </div>

              {/* Total Price Display */}
              {bookingData.room && bookingData.checkInDate && bookingData.checkOutDate && (
                <div className="bg-gradient-to-r from-secondary/20 to-amber-600/20 border border-secondary/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="text-secondary" size={24} />
                      <span className="text-slate-300">Prix Total:</span>
                    </div>
                    <span className="text-3xl font-bold text-secondary">{calculateTotal()} TND</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-slate-700">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700">
                  Confirmer la Réservation
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowBookingForm(false);
                    resetBookingForm();
                  }}
                  className="bg-slate-700 hover:bg-slate-600"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-400" size={32} />
              <h2 className="text-xl font-bold text-white">Annuler la Réservation</h2>
            </div>
            <p className="text-slate-300 mb-6">
              Êtes-vous sûr de vouloir annuler la réservation <span className="text-secondary font-bold">{selectedReservation.reservationNumber}</span> ?
              Cette action est irréversible.
            </p>
            <div className="flex gap-4">
              <Button onClick={handleCancel} className="flex-1 bg-red-600 hover:bg-red-700">
                Oui, Annuler
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedReservation(null);
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600"
              >
                Non, Garder
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-4 overflow-x-auto">
        {[
          { id: 'all', label: 'Toutes', count: reservations.length },
          { id: 'pending', label: 'En attente', count: stats.pending },
          { id: 'confirmed', label: 'Confirmées', count: stats.confirmed },
          { id: 'checked-in', label: 'Check-in', count: reservations.filter(r => r.status === 'checked-in').length },
          { id: 'cancelled', label: 'Annulées', count: stats.cancelled },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-secondary text-primary'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Reservations List */}
      <div className="grid gap-4">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto mb-4 text-slate-600" size={48} />
            <p className="text-slate-400">Aucune réservation {activeTab !== 'all' ? `(${statusConfig[activeTab]?.label.toLowerCase()})` : ''}</p>
          </div>
        ) : (
          filteredReservations.map(res => {
            const config = statusConfig[res.status] || statusConfig.pending;
            return (
              <Card key={res._id} className="bg-slate-800 border-slate-700 hover:border-secondary/50 transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} border ${config.border}`}>
                          {config.label}
                        </span>
                        <span className="text-secondary font-bold">{res.reservationNumber}</span>
                      </div>

                      {/* Hotel & Room */}
                      <div className="flex items-center gap-4 text-slate-300">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-slate-700 rounded-lg">
                            <Users className="w-4 h-4 text-secondary" />
                          </div>
                          <span>{res.hotel?.name || 'Hôtel'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-slate-700 rounded-lg">
                            <Calendar className="w-4 h-4 text-secondary" />
                          </div>
                          <span>
                            {new Date(res.checkInDate).toLocaleDateString('fr-FR')} → {new Date(res.checkOutDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                        <div>
                          <p className="text-slate-500 text-sm">Chambre</p>
                          <p className="text-white font-medium">{res.room?.roomNumber || 'N/A'} - {res.room?.type || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm">Voyageurs</p>
                          <p className="text-white font-medium">{res.numberOfGuests} personne(s)</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm">Prix Total</p>
                          <p className="text-secondary font-bold text-xl">{res.totalPrice} TND</p>
                        </div>
                      </div>

                      {/* Special Requests */}
                      {res.specialRequests && (
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <p className="text-slate-400 text-sm">
                            <span className="text-secondary font-semibold">Demande spéciale: </span>
                            {res.specialRequests}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {res.status === 'pending' && (
                        <Button
                          onClick={() => {
                            setSelectedReservation(res);
                            setShowCancelModal(true);
                          }}
                          variant="destructive"
                          size="sm"
                          className="bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-700"
                        >
                          <X size={18} />
                          Annuler
                        </Button>
                      )}
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

import { useState, useEffect } from 'react';
import { MapPin, Star, Wifi, Coffee, Car, Dumbbell, Sparkles, Users, Calendar, DollarSign, Check, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export function ClientHotels() {
  const { user } = useAuthStore();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');

  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await api.get('/hotels');
      setHotels(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHotel = async (hotel) => {
    setSelectedHotel(hotel);
    setLoadingRooms(true);
    try {
      const res = await api.get(`/rooms/hotel/${hotel._id}`);
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setShowReservationModal(true);
    setFormData({
      checkInDate: '',
      checkOutDate: '',
      numberOfGuests: 1,
      specialRequests: '',
      paymentMethod: 'card',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
    });
  };

  const calculateTotal = () => {
    if (!formData.checkInDate || !formData.checkOutDate || !selectedRoom) return 0;
    const start = new Date(formData.checkInDate);
    const end = new Date(formData.checkOutDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights * selectedRoom.price : 0;
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    const total = calculateTotal();
    if (total <= 0) {
      alert('Dates invalides !');
      return;
    }
    setReservationData({ ...formData, total });
    setShowReservationModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async () => {
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
        totalPrice: reservationData.total,
        status: 'pending',
        paymentStatus: 'pending',
      });
      alert('✅ Réservation confirmée ! Vous pouvez la voir dans "Mes Réservations"');
      setShowPaymentModal(false);
      setSelectedRoom(null);
      setSelectedHotel(null);
      setRooms([]);
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la réservation');
    }
  };

  const amenityIcons = {
    wifi: Wifi,
    restaurant: Coffee,
    parking: Car,
    gym: Dumbbell,
    spa: Sparkles,
    pool: Sparkles,
  };

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = searchTerm === '' || 
      hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = filterCity === '' || hotel.address?.city === filterCity;
    return matchesSearch && matchesCity;
  });

  const cities = [...new Set(hotels.map(h => h.address?.city).filter(Boolean))];

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
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <MapPin className="text-secondary" size={32} />
          Hôtels Disponibles
        </h1>
        <p className="text-slate-400 mt-1">Découvrez nos hôtels d'exception en Tunisie</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un hôtel ou une ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
        >
          <option value="">Toutes les villes</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map(hotel => (
          <Card 
            key={hotel._id} 
            className="bg-slate-800 border-slate-700 overflow-hidden hover:border-secondary/50 transition-all cursor-pointer group"
            onClick={() => handleSelectHotel(hotel)}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop'}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                {[...(hotel.starRating ? Array(hotel.starRating) : [])].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              {selectedHotel?._id === hotel._id && (
                <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
                  <div className="bg-secondary text-primary px-6 py-3 rounded-full font-bold flex items-center gap-2">
                    <Check size={20} />
                    Sélectionné
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-xl font-bold text-white group-hover:text-secondary transition-colors">{hotel.name}</h3>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{hotel.address?.city || 'Tunisie'}</span>
              </div>
              <p className="text-slate-400 text-sm line-clamp-2">{hotel.description}</p>
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-700">
                  {hotel.amenities.slice(0, 4).map((amenityId, i) => {
                    const AmenityIcon = amenityIcons[amenityId] || Users;
                    return (
                      <div key={i} className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center" title={amenityId}>
                        <AmenityIcon className="w-4 h-4 text-secondary" />
                      </div>
                    );
                  })}
                  {hotel.amenities.length > 4 && (
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-xs text-slate-400">
                      +{hotel.amenities.length - 4}
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                <div className="text-sm text-slate-400">
                  <span className="text-white font-semibold">{hotel.totalRooms || 0}</span> chambres
                </div>
                <Button 
                  className="bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectHotel(hotel);
                  }}
                >
                  Voir les chambres
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Hotel Rooms */}
      {selectedHotel && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Users className="text-secondary" size={28} />
                  Chambres - {selectedHotel.name}
                </h2>
                <p className="text-slate-400 mt-1">Sélectionnez une chambre pour réserver</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedHotel(null)}
                className="border-slate-700 text-slate-400 hover:bg-slate-700"
              >
                <X size={20} className="mr-2" />
                Changer d'hôtel
              </Button>
            </div>

            {loadingRooms ? (
              <div className="text-center py-12">
                <div className="text-slate-400">Chargement des chambres...</div>
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto mb-4 text-slate-600" size={48} />
                <p className="text-slate-400">Aucune chambre disponible</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.filter(r => r.status === 'available').map(room => (
                  <Card 
                    key={room._id} 
                    className="bg-slate-900 border-slate-700 hover:border-secondary/50 transition-all cursor-pointer group"
                    onClick={() => handleSelectRoom(room)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white">Chambre {room.roomNumber}</h3>
                          <p className="text-slate-400 text-sm capitalize">{room.type}</p>
                        </div>
                        <span className="bg-green-900/30 text-green-400 border border-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                          Disponible
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {room.capacity} pers.
                        </span>
                        <span>Étage {room.floor}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                        <div className="text-2xl font-bold text-secondary">{room.price} TND</div>
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700"
                        >
                          Réserver
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reservation Modal */}
      {showReservationModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="text-secondary" size={28} />
                Réserver cette chambre
              </h2>
              <button
                onClick={() => setShowReservationModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="text-slate-400" size={24} />
              </button>
            </div>

            <form onSubmit={handleReservationSubmit} className="p-6 space-y-6">
              {/* Room Info */}
              <div className="bg-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold">{selectedHotel.name}</h3>
                    <p className="text-slate-400 text-sm">Chambre {selectedRoom.roomNumber} - {selectedRoom.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary">{selectedRoom.price} TND</p>
                    <p className="text-slate-400 text-xs">par nuit</p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={formData.checkInDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setFormData({ ...formData, checkInDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={formData.checkOutDate}
                    min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                    onChange={e => setFormData({ ...formData, checkOutDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
                    required
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
                  value={formData.numberOfGuests}
                  min="1"
                  max={selectedRoom.capacity}
                  onChange={e => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
                  required
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Demandes Spéciales (optionnel)
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Chambre non-fumeur, lit bébé..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
                  rows="3"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  Méthode de Paiement
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
                >
                  <option value="card">Carte Bancaire</option>
                  <option value="cash">Espèces</option>
                  <option value="transfer">Virement Bancaire</option>
                </select>
              </div>

              {/* Total Price */}
              {calculateTotal() > 0 && (
                <div className="bg-gradient-to-r from-secondary/20 to-amber-600/20 border border-secondary/50 rounded-xl p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Prix par nuit:</span>
                      <span className="text-white">{selectedRoom.price} TND</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Nombre de nuits:</span>
                      <span className="text-white">
                        {Math.ceil((new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-secondary/50">
                      <span className="text-lg font-semibold text-white">Total à payer:</span>
                      <span className="text-3xl font-bold text-secondary">{calculateTotal()} TND</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-slate-700">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700">
                  Continuer vers le paiement
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowReservationModal(false)}
                  className="bg-slate-700 hover:bg-slate-600"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && reservationData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-primary" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">Paiement Sécurisé</h2>
              <p className="text-slate-400 mt-2">Montant à payer: <span className="text-secondary font-bold">{reservationData.total} TND</span></p>
            </div>

            {formData.paymentMethod === 'card' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Numéro de carte</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Date d'expiration</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-2">Récapitulatif:</h3>
              <div className="space-y-1 text-sm text-slate-400">
                <p>Hôtel: {selectedHotel.name}</p>
                <p>Chambre: {selectedRoom.roomNumber}</p>
                <p>Dates: {new Date(formData.checkInDate).toLocaleDateString()} → {new Date(formData.checkOutDate).toLocaleDateString()}</p>
                <p>Voyageurs: {formData.numberOfGuests}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handlePaymentConfirm}
                className="flex-1 bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700"
              >
                <Check className="mr-2" size={20} />
                Confirmer le Paiement
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowPaymentModal(false);
                  setShowReservationModal(true);
                }}
                className="bg-slate-700 hover:bg-slate-600"
              >
                Retour
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

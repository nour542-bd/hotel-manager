import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Wifi, Coffee, Car, Dumbbell, Sparkles, Search, Filter, Calendar, Users, DollarSign, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../lib/api';

export function HotelsListing() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await api.get('/hotels');
      setHotels(response.data);
    } catch (err) {
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
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

  // Filter and sort hotels
  const filteredHotels = hotels
    .filter(hotel => {
      const matchesSearch = searchTerm === '' || 
        hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.address?.city?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === '' || hotel.address?.city === selectedCity;
      const matchesRating = selectedRating === '' || hotel.starRating === parseInt(selectedRating);
      return matchesSearch && matchesCity && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return (b.starRating || 0) - (a.starRating || 0);
      if (sortBy === 'rooms') return (b.totalRooms || 0) - (a.totalRooms || 0);
      return 0;
    });

  const cities = [...new Set(hotels.map(h => h.address?.city).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Chargement des hôtels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-secondary to-amber-400 bg-clip-text text-transparent">
            HotelManager Pro
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white">Connexion</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700">
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-12 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Nos Hôtels <span className="bg-gradient-to-r from-secondary to-amber-400 bg-clip-text text-transparent">Exceptionnels</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
            Découvrez notre sélection des meilleurs hôtels en Tunisie. Luxe, confort et services d'exception pour un séjour inoubliable.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-secondary">{hotels.length}</div>
              <p className="text-slate-400">Hôtels</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">{hotels.filter(h => h.starRating === 5).length}</div>
              <p className="text-slate-400">5 Étoiles</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">{cities.length}</div>
              <p className="text-slate-400">Villes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un hôtel ou une ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
            >
              <option value="">Toutes les villes</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* Rating Filter */}
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
            >
              <option value="">Toutes classifications</option>
              <option value="5">5 Étoiles ★★★★★</option>
              <option value="4">4 Étoiles ★★★★</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
            <p className="text-slate-400 text-sm">
              {filteredHotels.length} hôtel{filteredHotels.length > 1 ? 's' : ''} trouvé{filteredHotels.length > 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <Filter className="text-slate-400" size={18} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-secondary transition-colors"
              >
                <option value="name">Nom (A-Z)</option>
                <option value="rating">Meilleures notes</option>
                <option value="rooms">Plus grand</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {filteredHotels.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="mx-auto mb-4 text-slate-600" size={64} />
            <p className="text-slate-400 text-xl">Aucun hôtel ne correspond à votre recherche</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('');
                setSelectedRating('');
              }}
              className="mt-4 border-secondary text-secondary hover:bg-secondary hover:text-primary"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map(hotel => (
              <div 
                key={hotel._id} 
                className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-secondary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-2"
              >
                {/* Hotel Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop'}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1">
                    {[...(hotel.starRating ? Array(hotel.starRating) : [])].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-gradient-to-r from-secondary to-amber-600 px-3 py-1.5 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span className="text-primary font-bold text-xs">{hotel.address?.city}</span>
                  </div>
                </div>

                {/* Hotel Info */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-secondary transition-colors mb-2">
                      {hotel.name}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {hotel.description}
                    </p>
                  </div>

                  {/* Amenities */}
                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.slice(0, 5).map((amenityId, i) => {
                        const AmenityIcon = amenityIcons[amenityId] || Users;
                        return (
                          <div 
                            key={i} 
                            className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center"
                            title={amenityId}
                          >
                            <AmenityIcon className="w-4 h-4 text-secondary" />
                          </div>
                        );
                      })}
                      {hotel.amenities.length > 5 && (
                        <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-400">
                          +{hotel.amenities.length - 5}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hotel Details */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Users className="w-4 h-4 text-secondary" />
                      <span>{hotel.totalRooms || 0} chambres</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Calendar className="w-4 h-4 text-secondary" />
                      <span>Dispo 24/7</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 pt-4 border-t border-slate-800">
                    {hotel.phone && (
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <DollarSign className="w-3 h-3 text-secondary" />
                        <span>{hotel.phone}</span>
                      </div>
                    )}
                    {hotel.email && (
                      <div className="flex items-center gap-2 text-slate-400 text-sm truncate">
                        <ArrowRight className="w-3 h-3 text-secondary" />
                        <span className="truncate">{hotel.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link to="/client/hotels">
                    <Button className="w-full bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700 group/btn">
                      Voir les chambres
                      <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-secondary via-amber-500 to-secondary bg-[length:200%_100%] animate-gradient rounded-3xl p-8 md:p-12 text-center shadow-2xl shadow-secondary/30">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Prêt à réserver votre séjour?
          </h2>
          <p className="text-xl text-primary/90 mb-8 max-w-2xl mx-auto">
            Créez un compte maintenant et profitez de nos meilleurs tarifs pour découvrir la Tunisie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-primary text-secondary hover:bg-slate-900 font-bold px-8 py-4 text-lg shadow-xl shadow-primary/20">
                Créer un compte gratuit
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8 py-4 text-lg">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          <p>&copy; 2024 HotelManager Pro. Tous droits réservés.</p>
          <p className="mt-2">Découvrez les plus beaux hôtels de Tunisie</p>
        </div>
      </footer>
    </div>
  );
}

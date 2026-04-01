import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Plus, Trash2, Edit2, Image, MapPin, Star, Wifi, Coffee, Car, Dumbbell, Sparkles } from 'lucide-react';
import api from '../../lib/api';

export function HotelsAdmin() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    address: {
      street: '',
      city: '',
      country: 'Tunisie',
      zipCode: ''
    },
    amenities: [],
    image: '',
    totalRooms: '',
    starRating: 4
  });

  const amenityOptions = [
    { id: 'wifi', label: 'WiFi Gratuit', icon: Wifi },
    { id: 'restaurant', label: 'Restaurant', icon: Coffee },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'gym', label: 'Centre de Fitness', icon: Dumbbell },
    { id: 'spa', label: 'Spa & Bien-être', icon: Sparkles },
    { id: 'pool', label: 'Piscine', icon: Image },
  ];

  const hotelImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&auto=format&fit=crop',
  ];

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await api.get('/hotels');
      setHotels(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const hotelData = {
        ...formData,
        totalRooms: parseInt(formData.totalRooms) || 0,
        starRating: parseInt(formData.starRating) || 4
      };
      
      if (editingId) {
        await api.put(`/hotels/${editingId}`, hotelData);
      } else {
        await api.post('/hotels', hotelData);
      }
      
      resetForm();
      fetchHotels();
    } catch (err) {
      console.error('Erreur', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      phone: '',
      email: '',
      website: '',
      address: { street: '', city: '', country: 'Tunisie', zipCode: '' },
      amenities: [],
      image: '',
      totalRooms: '',
      starRating: 4
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet hôtel?')) {
      try {
        await api.delete(`/hotels/${id}`);
        fetchHotels();
      } catch (err) {
        console.error('Erreur', err);
      }
    }
  };

  const handleEdit = (hotel) => {
    setFormData({
      name: hotel.name || '',
      description: hotel.description || '',
      phone: hotel.phone || '',
      email: hotel.email || '',
      website: hotel.website || '',
      address: hotel.address || { street: '', city: '', country: 'Tunisie', zipCode: '' },
      amenities: hotel.amenities || [],
      image: hotel.image || '',
      totalRooms: hotel.totalRooms || '',
      starRating: hotel.starRating || 4
    });
    setEditingId(hotel._id);
    setShowForm(true);
  };

  const toggleAmenity = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const selectImage = (imageUrl) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Image className="text-secondary" size={32} />
            Hôtels
          </h1>
          <p className="text-slate-400 mt-1">Gérez vos propriétés hôtelières avec photos</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700"
        >
          <Plus size={20} className="mr-2" />
          Nouvel Hôtel
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="text-secondary" size={20} />
              {editingId ? 'Modifier' : 'Ajouter'} un Hôtel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nom de l'hôtel *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Laico Tunis Hotel"
                    required
                    className="bg-slate-900 border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nombre de chambres</label>
                  <Input
                    type="number"
                    value={formData.totalRooms}
                    onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                    placeholder="100"
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez votre hôtel..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-secondary transition-colors"
                  rows="4"
                  required
                />
              </div>

              {/* Address */}
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Rue</label>
                  <Input
                    value={formData.address.street}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                    placeholder="Avenue Habib Bourguiba"
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ville *</label>
                  <Input
                    value={formData.address.city}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                    placeholder="Tunis"
                    required
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Code Postal</label>
                  <Input
                    value={formData.address.zipCode}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                    placeholder="1000"
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Pays</label>
                  <Input
                    value={formData.address.country}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                    placeholder="Tunisie"
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Téléphone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+216..."
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@hotel.com"
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Site Web</label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="www.hotel.com"
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Classification (Étoiles)</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, starRating: star })}
                      className={`p-2 rounded-lg transition-all ${
                        formData.starRating >= star
                          ? 'bg-secondary text-primary scale-110'
                          : 'bg-slate-700 text-slate-500 hover:bg-slate-600'
                      }`}
                    >
                      <Star size={24} fill={formData.starRating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Photo de l'hôtel</label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {hotelImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectImage(img)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        formData.image === img
                          ? 'border-secondary ring-2 ring-secondary/50'
                          : 'border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <img src={img} alt={`Hotel ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                {formData.image && (
                  <div className="mt-4">
                    <img src={formData.image} alt="Selected" className="w-full max-w-md rounded-lg border border-slate-700" />
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Équipements</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenityOptions.map((amenity) => {
                    const Icon = amenity.icon;
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          formData.amenities.includes(amenity.id)
                            ? 'bg-secondary/20 border-secondary text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="text-sm">{amenity.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-slate-700">
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700"
                >
                  {editingId ? 'Mettre à jour' : 'Ajouter'} l'hôtel
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

      {/* Hotels Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="text-slate-400">Chargement des hôtels...</div>
          </div>
        ) : hotels.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Image className="mx-auto mb-4 text-slate-600" size={48} />
            <p className="text-slate-400">Aucun hôtel pour le moment</p>
            <p className="text-slate-500 text-sm mt-2">Ajoutez votre premier hôtel ci-dessus</p>
          </div>
        ) : (
          hotels.map((hotel) => (
            <Card key={hotel._id} className="bg-slate-800 border-slate-700 overflow-hidden group hover:border-secondary/50 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/10">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop'}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                  {[...Array(hotel.starRating || 4)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                {hotel.address?.city && (
                  <div className="absolute bottom-3 left-3 bg-secondary/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span className="text-primary font-medium text-xs">{hotel.address.city}</span>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-secondary transition-colors">{hotel.name}</h3>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">{hotel.description}</p>
                </div>

                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, 3).map((amenityId) => {
                      const amenity = amenityOptions.find(a => a.id === amenityId);
                      if (!amenity) return null;
                      const Icon = amenity.icon;
                      return (
                        <div key={amenityId} className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center" title={amenity.label}>
                          <Icon className="w-4 h-4 text-secondary" />
                        </div>
                      );
                    })}
                    {hotel.amenities.length > 3 && (
                      <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-xs text-slate-400">
                        +{hotel.amenities.length - 3}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <div className="text-sm text-slate-400">
                    <span className="text-white font-semibold">{hotel.totalRooms || 0}</span> chambres
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(hotel)}
                      className="p-2 rounded-lg hover:bg-slate-700 transition-colors group/edit"
                      title="Modifier"
                    >
                      <Edit2 size={18} className="text-secondary group-hover/edit:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={() => handleDelete(hotel._id)}
                      className="p-2 rounded-lg hover:bg-slate-700 transition-colors group/delete"
                      title="Supprimer"
                    >
                      <Trash2 size={18} className="text-red-400 group-hover/delete:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

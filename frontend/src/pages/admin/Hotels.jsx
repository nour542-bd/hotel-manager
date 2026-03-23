import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Plus, Trash2, Edit2 } from 'lucide-react';
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
  });

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
      if (editingId) {
        await api.put(`/hotels/${editingId}`, formData);
      } else {
        await api.post('/hotels', formData);
      }
      setFormData({ name: '', description: '', phone: '', email: '', website: '' });
      setEditingId(null);
      setShowForm(false);
      fetchHotels();
    } catch (err) {
      console.error('Erreur', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr?')) {
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
      name: hotel.name,
      description: hotel.description || '',
      phone: hotel.phone || '',
      email: hotel.email || '',
      website: hotel.website || '',
    });
    setEditingId(hotel._id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Hôtels</h1>
          <p className="text-slate-400">Gestion des propriétés</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={20} className="mr-2" />
          Nouvel Hôtel
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Modifier' : 'Ajouter'} Hôtel</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nom</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nom de l'hôtel"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description"
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-secondary"
                  rows="3"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Téléphone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+33..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@hotel.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Site web</label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="www.hotel.com"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit">{editingId ? 'Mettre à jour' : 'Ajouter'}</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', description: '', phone: '', email: '', website: '' });
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div className="grid gap-4">
        {loading ? (
          <p className="text-slate-400">Chargement...</p>
        ) : hotels.length === 0 ? (
          <p className="text-slate-400">Aucun hôtel</p>
        ) : (
          hotels.map((hotel) => (
            <Card key={hotel._id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{hotel.name}</h3>
                    <p className="text-slate-400 mt-1">{hotel.description}</p>
                    <p className="text-slate-500 text-sm mt-2">{hotel.phone} • {hotel.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(hotel)}
                      className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 size={20} className="text-secondary" />
                    </button>
                    <button
                      onClick={() => handleDelete(hotel._id)}
                      className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 size={20} className="text-destructive" />
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

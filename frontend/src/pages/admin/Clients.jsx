import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Trash2 } from 'lucide-react';
import api from '../../lib/api';

export function ClientsAdmin() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (err) {
      console.error('Erreur', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr?')) {
      try {
        await api.delete(`/clients/${id}`);
        fetchClients();
      } catch (err) {
        console.error('Erreur', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Clients</h1>
        <p className="text-slate-400">Gestion des comptes clients</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-slate-400 text-sm">Total Clients</p>
            <p className="text-3xl font-bold text-white mt-2">{clients.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-slate-400 text-sm">Clients Actifs</p>
            <p className="text-3xl font-bold text-green-500 mt-2">{clients.filter(c => c.isActive).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-slate-400 text-sm">Clients Inactifs</p>
            <p className="text-3xl font-bold text-red-500 mt-2">{clients.filter(c => !c.isActive).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {loading ? (
          <p className="text-slate-400">Chargement...</p>
        ) : clients.length === 0 ? (
          <p className="text-slate-400">Aucun client</p>
        ) : (
          clients.map((client) => (
            <Card key={client._id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                        {client.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{client.name}</h3>
                        <p className="text-slate-400 text-sm">{client.email}</p>
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm">
                      {client.phone || 'Pas de téléphone'}
                    </p>
                    <p className="text-slate-600 text-xs mt-2">
                      Inscrit: {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded text-sm ${
                      client.isActive 
                        ? 'bg-green-900 text-green-200' 
                        : 'bg-red-900 text-red-200'
                    }`}>
                      {client.isActive ? 'Actif' : 'Inactif'}
                    </span>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="mt-4 p-2 rounded-lg hover:bg-slate-800 transition-colors block mx-auto"
                    >
                      <Trash2 size={18} className="text-destructive" />
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

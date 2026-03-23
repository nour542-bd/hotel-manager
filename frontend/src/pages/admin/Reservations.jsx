import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Trash2 } from 'lucide-react';
import api from '../../lib/api';

export function ReservationsAdmin() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservations');
      setReservations(response.data);
    } catch (err) {
      console.error('Erreur', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation?')) {
      try {
        await api.delete(`/reservations/${id}`);
        fetchReservations();
      } catch (err) {
        console.error('Erreur', err);
      }
    }
  };

  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filter);

  const statusColors = {
    pending: 'bg-yellow-900 text-yellow-200',
    confirmed: 'bg-green-900 text-green-200',
    'checked-in': 'bg-blue-900 text-blue-200',
    'checked-out': 'bg-slate-700 text-slate-200',
    cancelled: 'bg-red-900 text-red-200',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Réservations</h1>
        <p className="text-slate-400">Gestion de toutes les réservations</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'primary' : 'secondary'}
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      {/* List */}
      <div className="grid gap-4">
        {loading ? (
          <p className="text-slate-400">Chargement...</p>
        ) : filteredReservations.length === 0 ? (
          <p className="text-slate-400">Aucune réservation</p>
        ) : (
          filteredReservations.map((res) => (
            <Card key={res._id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{res.reservationNumber}</h3>
                      <span className={`text-xs px-2 py-1 rounded capitalize ${statusColors[res.status]}`}>
                        {res.status}
                      </span>
                    </div>
                    <p className="text-slate-300">{res.client?.name} • {res.hotel?.name}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Chambre {res.room?.roomNumber} ({res.room?.type})
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(res.checkInDate).toLocaleDateString('fr-FR')} → {new Date(res.checkOutDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary">${res.totalPrice}</p>
                    <p className="text-sm text-slate-400 mt-2">Paiement: {res.paymentStatus}</p>
                    <button
                      onClick={() => handleDelete(res._id)}
                      className="mt-4 p-2 rounded-lg hover:bg-slate-800 transition-colors"
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

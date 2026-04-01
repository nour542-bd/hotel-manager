import { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, X, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import api from '../../lib/api';

export function ClientReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations/my-reservations');
      setReservations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedReservation) return;
    
    try {
      await api.put(`/reservations/${selectedReservation._id}/cancel`);
      alert('Réservation annulée avec succès');
      setShowCancelModal(false);
      setSelectedReservation(null);
      fetchReservations();
    } catch (err) {
      alert('Erreur lors de l\'annulation');
    }
  };

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
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
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Calendar className="text-secondary" size={32} />
          Mes Réservations
        </h1>
        <p className="text-slate-400 mt-1">Consultez et gérez toutes vos réservations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-slate-400 text-sm">Total</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-slate-400 text-sm">Confirmées</p>
              <p className="text-3xl font-bold text-green-400 mt-1">{stats.confirmed}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-slate-400 text-sm">En Attente</p>
              <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-slate-400 text-sm">Annulées</p>
              <p className="text-3xl font-bold text-slate-400 mt-1">{stats.cancelled}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-400" size={32} />
              <h2 className="text-xl font-bold text-white">Annuler la Réservation</h2>
            </div>
            <p className="text-slate-300 mb-6">
              Êtes-vous sûr de vouloir annuler la réservation{' '}
              <span className="text-secondary font-bold">{selectedReservation.reservationNumber}</span> ?
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
          { id: 'checked-out', label: 'Terminées', count: reservations.filter(r => r.status === 'checked-out').length },
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
              <Card key={res._id} className="bg-slate-800 border-slate-700 hover:border-secondary/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} border ${config.border}`}>
                          {config.label}
                        </span>
                        <span className="text-secondary font-bold text-lg">{res.reservationNumber}</span>
                      </div>

                      {/* Hotel Info */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-700 rounded-lg">
                          <Calendar className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{res.hotel?.name}</p>
                          <p className="text-slate-400 text-sm">
                            {res.room?.roomNumber} - {res.room?.type}
                          </p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                        <div>
                          <p className="text-slate-500 text-sm flex items-center gap-1">
                            <Clock size={14} /> Check-in
                          </p>
                          <p className="text-white font-medium">
                            {new Date(res.checkInDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm flex items-center gap-1">
                            <Clock size={14} /> Check-out
                          </p>
                          <p className="text-white font-medium">
                            {new Date(res.checkOutDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm flex items-center gap-1">
                            <DollarSign size={14} /> Prix Total
                          </p>
                          <p className="text-secondary font-bold text-xl">{res.totalPrice} TND</p>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                        <div>
                          <p className="text-slate-500 text-sm">Voyageurs</p>
                          <p className="text-white font-medium">{res.numberOfGuests} personne(s)</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm">Paiement</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
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

                      {/* Special Requests */}
                      {res.specialRequests && (
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <p className="text-slate-400 text-sm">
                            <span className="text-secondary font-semibold">Demande spéciale: </span>
                            {res.specialRequests}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      {res.status === 'pending' && (
                        <div className="pt-4 border-t border-slate-700">
                          <Button
                            variant="destructive"
                            onClick={() => {
                              setSelectedReservation(res);
                              setShowCancelModal(true);
                            }}
                            className="bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-700"
                          >
                            <X size={18} className="mr-2" />
                            Annuler cette réservation
                          </Button>
                        </div>
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

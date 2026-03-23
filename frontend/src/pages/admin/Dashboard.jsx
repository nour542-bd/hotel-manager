import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Building2, Calendar, Users, TrendingUp } from 'lucide-react';
import api from '../../lib/api';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    hotels: 0,
    reservations: 0,
    clients: 0,
  });
  const [recentReservations, setRecentReservations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelsRes, reservationsRes, clientsRes] = await Promise.all([
          api.get('/hotels'),
          api.get('/reservations'),
          api.get('/clients'),
        ]);

        setStats({
          hotels: hotelsRes.data.length,
          reservations: reservationsRes.data.length,
          clients: clientsRes.data.length,
        });

        setRecentReservations(reservationsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Erreur lors du chargement des données', err);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { icon: Building2, label: 'Hôtels', value: stats.hotels, color: 'from-blue-600 to-blue-700' },
    { icon: Calendar, label: 'Réservations', value: stats.reservations, color: 'from-purple-600 to-purple-700' },
    { icon: Users, label: 'Clients', value: stats.clients, color: 'from-green-600 to-green-700' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Tableau de Bord</h1>
        <p className="text-slate-400">Bienvenue dans votre panneau administrateur</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>Réservations Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReservations.length === 0 ? (
              <p className="text-slate-400">Aucune réservation</p>
            ) : (
              recentReservations.map((res) => (
                <div key={res._id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">{res.reservationNumber}</p>
                    <p className="text-slate-400 text-sm">{res.client?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${res.totalPrice}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      res.status === 'confirmed' ? 'bg-green-900 text-green-200' :
                      res.status === 'pending' ? 'bg-yellow-900 text-yellow-200' :
                      'bg-slate-700 text-slate-200'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

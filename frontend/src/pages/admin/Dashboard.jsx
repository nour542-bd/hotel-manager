import { useEffect, useState } from 'react';
import { Building2, Calendar, Users, TrendingUp, DollarSign } from 'lucide-react';
import api from '../../lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];

export function AdminDashboard() {
  const [stats, setStats] = useState({ hotels: 0, reservations: 0, clients: 0, revenue: 0 });
  const [recentReservations, setRecentReservations] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [hotelData, setHotelData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelsRes, reservationsRes, clientsRes] = await Promise.all([
          api.get('/hotels'),
          api.get('/reservations'),
          api.get('/clients'),
        ]);

        const reservations = reservationsRes.data;
        const hotels = hotelsRes.data;

        // Stats générales
        const revenue = reservations
          .filter(r => r.paymentStatus === 'completed')
          .reduce((sum, r) => sum + r.totalPrice, 0);

        setStats({
          hotels: hotels.length,
          reservations: reservations.length,
          clients: clientsRes.data.length,
          revenue,
        });

        // Réservations récentes
        setRecentReservations(reservations.slice(0, 5));

        // Données pour graphique camembert (statuts)
        const statusCount = reservations.reduce((acc, r) => {
          acc[r.status] = (acc[r.status] || 0) + 1;
          return acc;
        }, {});
        setStatusData(Object.entries(statusCount).map(([name, value]) => ({ name, value })));

        // Données par hôtel
        const hotelCount = reservations.reduce((acc, r) => {
          const hotelName = r.hotel?.name || 'Inconnu';
          acc[hotelName] = (acc[hotelName] || 0) + 1;
          return acc;
        }, {});
        setHotelData(Object.entries(hotelCount).map(([name, reservations]) => ({ name: name.substring(0, 15), reservations })));

        // Données mensuelles
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        const monthly = months.map((month, idx) => ({
          month,
          reservations: reservations.filter(r => new Date(r.createdAt).getMonth() === idx).length,
          revenue: reservations
            .filter(r => new Date(r.createdAt).getMonth() === idx && r.paymentStatus === 'completed')
            .reduce((sum, r) => sum + r.totalPrice, 0),
        }));
        setMonthlyData(monthly);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-white text-xl">Chargement...</div>
    </div>
  );

  const statCards = [
    { icon: Building2, label: 'Hôtels', value: stats.hotels, color: 'from-blue-600 to-blue-700', suffix: '' },
    { icon: Calendar, label: 'Réservations', value: stats.reservations, color: 'from-purple-600 to-purple-700', suffix: '' },
    { icon: Users, label: 'Clients', value: stats.clients, color: 'from-green-600 to-green-700', suffix: '' },
    { icon: DollarSign, label: 'Revenus', value: stats.revenue, color: 'from-yellow-600 to-yellow-700', suffix: ' TND' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">📊 Tableau de Bord</h1>
        <p className="text-slate-400">Vue d'ensemble de votre activité hôtelière</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stat.value}{stat.suffix}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphiques row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Graphique barres - Réservations par mois */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-white font-bold text-lg mb-4">📅 Réservations par Mois</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="reservations" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Réservations" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique camembert - Statuts */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-white font-bold text-lg mb-4">🥧 Statuts des Réservations</h2>
          {statusData.length === 0 ? (
            <p className="text-slate-400">Aucune donnée</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Graphiques row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Line chart - Revenus */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-white font-bold text-lg mb-4">💰 Revenus par Mois (TND)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="Revenus" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart - Réservations par hôtel */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-white font-bold text-lg mb-4">🏨 Réservations par Hôtel</h2>
          {hotelData.length === 0 ? (
            <p className="text-slate-400">Aucune donnée</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hotelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="reservations" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Réservations" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Réservations récentes */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-white font-bold text-lg mb-4">🕐 Réservations Récentes</h2>
        <div className="space-y-3">
          {recentReservations.length === 0 ? (
            <p className="text-slate-400">Aucune réservation</p>
          ) : (
            recentReservations.map((res) => (
              <div key={res._id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div>
                  <p className="text-yellow-400 font-semibold">{res.reservationNumber}</p>
                  <p className="text-slate-300 text-sm">{res.client?.name} — {res.hotel?.name}</p>
                  <p className="text-slate-400 text-xs">
                    {new Date(res.checkInDate).toLocaleDateString()} → {new Date(res.checkOutDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{res.totalPrice} TND</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    res.status === 'confirmed' ? 'bg-green-900 text-green-300' :
                    res.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                    res.status === 'checked-out' ? 'bg-slate-600 text-slate-300' :
                    res.status === 'cancelled' ? 'bg-red-900 text-red-300' :
                    'bg-blue-900 text-blue-300'
                  }`}>
                    {res.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
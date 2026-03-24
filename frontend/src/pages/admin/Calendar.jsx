import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../../lib/api';

moment.locale('fr');
const localizer = momentLocalizer(moment);

export function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations');
      const mapped = res.data.map(r => ({
        id: r._id,
        title: (r.client?.name || 'Client') + ' - ' + (r.hotel?.name || 'Hotel'),
        start: new Date(r.checkInDate),
        end: new Date(r.checkOutDate),
        status: r.status,
        totalPrice: r.totalPrice,
        reservationNumber: r.reservationNumber,
        hotel: r.hotel?.name,
        room: r.room?.roomNumber,
        roomType: r.room?.type,
        client: r.client?.name,
        clientEmail: r.client?.email,
        paymentStatus: r.paymentStatus,
        numberOfGuests: r.numberOfGuests,
      }));
      setEvents(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = (event) => {
    const colors = {
      pending: '#d97706',
      confirmed: '#16a34a',
      'checked-in': '#2563eb',
      'checked-out': '#475569',
      cancelled: '#dc2626',
    };
    return {
      style: {
        backgroundColor: colors[event.status] || '#475569',
        borderRadius: '6px',
        border: 'none',
        color: 'white',
        fontSize: '12px',
        padding: '2px 6px',
      }
    };
  };

  const filteredEvents = filter === 'all'
    ? events
    : events.filter(e => e.status === filter);

  const stats = {
    total: events.length,
    pending: events.filter(e => e.status === 'pending').length,
    confirmed: events.filter(e => e.status === 'confirmed').length,
    checkedIn: events.filter(e => e.status === 'checked-in').length,
    cancelled: events.filter(e => e.status === 'cancelled').length,
  };

  if (loading) return <div className="text-white text-xl">Chargement...</div>;

  return (
    <div className="text-white space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calendrier des Reservations</h1>
        <p className="text-slate-400">Vue globale de toutes les reservations</p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'bg-slate-700' },
          { label: 'En attente', value: stats.pending, color: 'bg-yellow-900' },
          { label: 'Confirmees', value: stats.confirmed, color: 'bg-green-900' },
          { label: 'Checked-in', value: stats.checkedIn, color: 'bg-blue-900' },
          { label: 'Annulees', value: stats.cancelled, color: 'bg-red-900' },
        ].map((s, i) => (
          <div key={i} className={"rounded-xl p-4 text-center " + s.color}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-slate-300 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'Tous' },
          { value: 'pending', label: 'En attente' },
          { value: 'confirmed', label: 'Confirmes' },
          { value: 'checked-in', label: 'Checked-in' },
          { value: 'checked-out', label: 'Checked-out' },
          { value: 'cancelled', label: 'Annules' },
        ].map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors " +
              (filter === f.value ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700')}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Detail reservation selectionnee */}
      {selectedEvent && (
        <div className="bg-slate-800 rounded-xl p-5 border border-yellow-400">
          <div className="flex justify-between items-start">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div>
                <h3 className="text-yellow-400 font-bold text-lg mb-2">{selectedEvent.reservationNumber}</h3>
                <p className="text-white">👤 {selectedEvent.client}</p>
                <p className="text-slate-300 text-sm">{selectedEvent.clientEmail}</p>
                <p className="text-white mt-2">🏨 {selectedEvent.hotel}</p>
                <p className="text-slate-300">🛏️ Chambre {selectedEvent.room} ({selectedEvent.roomType})</p>
              </div>
              <div>
                <p className="text-slate-300">📅 Check-in: {selectedEvent.start.toLocaleDateString('fr-FR')}</p>
                <p className="text-slate-300">📅 Check-out: {selectedEvent.end.toLocaleDateString('fr-FR')}</p>
                <p className="text-slate-300">👥 {selectedEvent.numberOfGuests} guest(s)</p>
                <p className="text-yellow-400 font-bold text-lg mt-2">💰 {selectedEvent.totalPrice} TND</p>
                <div className="flex gap-2 mt-2">
                  <span className={"text-xs px-2 py-1 rounded-full " + (
                    selectedEvent.status === 'confirmed' ? 'bg-green-900 text-green-300' :
                    selectedEvent.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                    selectedEvent.status === 'checked-in' ? 'bg-blue-900 text-blue-300' :
                    selectedEvent.status === 'cancelled' ? 'bg-red-900 text-red-300' :
                    'bg-slate-700 text-slate-300'
                  )}>
                    {selectedEvent.status}
                  </span>
                  <span className={"text-xs px-2 py-1 rounded-full " + (
                    selectedEvent.paymentStatus === 'completed' ? 'bg-green-900 text-green-300' : 'bg-orange-900 text-orange-300'
                  )}>
                    💳 {selectedEvent.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedEvent(null)}
              className="text-slate-400 hover:text-white text-xl ml-4">✕</button>
          </div>
        </div>
      )}

      {/* Legende */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: 'En attente', color: 'bg-yellow-600' },
          { label: 'Confirmee', color: 'bg-green-600' },
          { label: 'Checked-in', color: 'bg-blue-600' },
          { label: 'Checked-out', color: 'bg-slate-500' },
          { label: 'Annulee', color: 'bg-red-600' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={"w-4 h-4 rounded " + item.color}></div>
            <span className="text-slate-300 text-sm">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Calendrier */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700" style={{ height: '650px' }}>
        <style>{`
          .rbc-calendar { background: transparent; color: white; }
          .rbc-header { background: #1e293b; color: #94a3b8; border-color: #334155; padding: 8px; }
          .rbc-month-view { border-color: #334155; }
          .rbc-day-bg { border-color: #334155; }
          .rbc-day-bg.rbc-today { background: #1e3a5f; }
          .rbc-off-range-bg { background: #0f172a; }
          .rbc-date-cell { color: #94a3b8; padding: 4px 8px; }
          .rbc-date-cell.rbc-now { color: #f59e0b; font-weight: bold; }
          .rbc-toolbar { margin-bottom: 16px; }
          .rbc-toolbar button { 
            background: #334155; color: white; border: 1px solid #475569; 
            padding: 6px 12px; border-radius: 6px; cursor: pointer; 
          }
          .rbc-toolbar button:hover { background: #475569; }
          .rbc-toolbar button.rbc-active { background: #f59e0b; color: black; }
          .rbc-toolbar-label { color: white; font-size: 18px; font-weight: bold; }
          .rbc-show-more { color: #f59e0b; background: transparent; }
          .rbc-agenda-view table { color: white; }
          .rbc-agenda-date-cell, .rbc-agenda-time-cell { color: #94a3b8; border-color: #334155; }
          .rbc-agenda-event-cell { border-color: #334155; }
          .rbc-time-view { border-color: #334155; }
          .rbc-time-header { border-color: #334155; }
          .rbc-timeslot-group { border-color: #334155; }
          .rbc-time-slot { color: #94a3b8; border-color: #334155; }
        `}</style>
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={event => setSelectedEvent(event)}
          messages={{
            next: 'Suivant',
            previous: 'Precedent',
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
            agenda: 'Agenda',
            noEventsInRange: 'Aucune reservation',
            showMore: total => '+' + total + ' de plus',
          }}
        />
      </div>
    </div>
  );
}
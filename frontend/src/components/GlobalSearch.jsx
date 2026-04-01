import { useState, useEffect } from 'react';
import { Search, Hotel, Calendar, Users, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState({
    hotels: [],
    reservations: [],
    clients: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim()) {
        setResults({ hotels: [], reservations: [], clients: [] });
        return;
      }

      setLoading(true);
      try {
        const [hotelsRes, reservationsRes, clientsRes] = await Promise.all([
          api.get('/hotels'),
          api.get('/reservations'),
          api.get('/clients'),
        ]);

        const term = searchTerm.toLowerCase();

        setResults({
          hotels: hotelsRes.data.filter(h => 
            h.name?.toLowerCase().includes(term) ||
            h.address?.city?.toLowerCase().includes(term)
          ).slice(0, 5),
          reservations: reservationsRes.data.filter(r =>
            r.reservationNumber?.toLowerCase().includes(term) ||
            r.client?.name?.toLowerCase().includes(term) ||
            r.hotel?.name?.toLowerCase().includes(term)
          ).slice(0, 5),
          clients: clientsRes.data.filter(c =>
            c.name?.toLowerCase().includes(term) ||
            c.email?.toLowerCase().includes(term)
          ).slice(0, 5),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const totalResults = results.hotels.length + results.reservations.length + results.clients.length;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-secondary transition-colors"
      >
        <Search size={18} />
        <span className="text-sm">Rechercher...</span>
        <kbd className="hidden md:inline-block px-2 py-0.5 bg-slate-700 rounded text-xs">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-4 p-4 border-b border-slate-700">
          <Search className="text-slate-400" size={24} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un hôtel, une réservation, un client..."
            className="flex-1 bg-transparent text-white text-lg focus:outline-none placeholder:text-slate-500"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="text-slate-400" size={20} />
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-400 transition-colors"
          >
            Échap
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 mt-4">Recherche en cours...</p>
            </div>
          ) : searchTerm.trim() === '' ? (
            <div className="p-8 text-center text-slate-400">
              <Search className="mx-auto mb-4 opacity-50" size={48} />
              <p>Commencez à taper pour rechercher...</p>
              <p className="text-sm mt-2">
                <kbd className="px-2 py-0.5 bg-slate-800 rounded">⌘K</kbd> pour fermer
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Search className="mx-auto mb-4 opacity-50" size={48} />
              <p>Aucun résultat trouvé pour "{searchTerm}"</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {/* Hotels */}
              {results.hotels.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Hotel className="w-4 h-4" />
                    Hôtels ({results.hotels.length})
                  </h3>
                  <div className="space-y-2">
                    {results.hotels.map(hotel => (
                      <Link
                        key={hotel._id}
                        to="/admin/hotels"
                        className="flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden">
                            <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{hotel.name}</p>
                            <p className="text-slate-400 text-sm">{hotel.address?.city}</p>
                          </div>
                        </div>
                        <ArrowRight className="text-slate-600 group-hover:text-secondary transition-colors" size={18} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Reservations */}
              {results.reservations.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Réservations ({results.reservations.length})
                  </h3>
                  <div className="space-y-2">
                    {results.reservations.map(res => (
                      <Link
                        key={res._id}
                        to="/admin/reservations"
                        className="flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group"
                      >
                        <div>
                          <p className="text-white font-medium">{res.reservationNumber}</p>
                          <p className="text-slate-400 text-sm">
                            {res.client?.name} → {res.hotel?.name}
                          </p>
                        </div>
                        <ArrowRight className="text-slate-600 group-hover:text-secondary transition-colors" size={18} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Clients */}
              {results.clients.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Clients ({results.clients.length})
                  </h3>
                  <div className="space-y-2">
                    {results.clients.map(client => (
                      <Link
                        key={client._id}
                        to="/admin/clients"
                        className="flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group"
                      >
                        <div>
                          <p className="text-white font-medium">{client.name}</p>
                          <p className="text-slate-400 text-sm">{client.email}</p>
                        </div>
                        <ArrowRight className="text-slate-600 group-hover:text-secondary transition-colors" size={18} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {totalResults > 0 && (
          <div className="p-4 border-t border-slate-700 bg-slate-800/50">
            <p className="text-slate-400 text-sm text-center">
              {totalResults} résultat{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

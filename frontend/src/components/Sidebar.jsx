import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import clsx from 'clsx';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const menuItems = user?.role === 'admin' ? [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Building2, label: 'Hôtels', path: '/admin/hotels' },
    { icon: Calendar, label: 'Réservations', path: '/admin/reservations' },
    { icon: Users, label: 'Clients', path: '/admin/clients' },
    { icon: Calendar, label: 'Calendrier', path: '/admin/calendar' },
  ] : [
    { icon: LayoutDashboard, label: 'Mon Tableau', path: '/client' },
    { icon: Calendar, label: 'Mes Réservations', path: '/client/reservations' },
    { icon: Building2, label: 'Hôtels', path: '/client/hotels' },
  ];

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed left-0 top-0 h-screen w-64 bg-primary border-r border-slate-700 p-6 overflow-y-auto z-40 transition-transform lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary">HotelManager</h1>
          <p className="text-sm text-muted">Pro</p>
        </div>

        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
                  isActive(item.path)
                    ? 'bg-secondary text-primary'
                    : 'text-slate-300 hover:bg-slate-800'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-destructive hover:bg-red-600 text-white transition-colors"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
}

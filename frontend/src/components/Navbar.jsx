import { Bell, MessageSquare, Settings, User, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import { GlobalSearch } from './GlobalSearch';
import { NotificationBell } from './NotificationBell';

export function Navbar() {
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-slate-900 border-b border-slate-700 px-6 flex items-center justify-between z-30">
      <div className="flex-1 max-w-xl hidden lg:block">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors">
          <MessageSquare size={20} />
        </button>
        <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors">
          <Settings size={20} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-amber-600 flex items-center justify-center text-primary font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <p className="font-semibold text-white">{user?.name}</p>
                <p className="text-sm text-slate-400">{user?.email}</p>
              </div>
              <button className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                <User size={18} />
                Mon Profil
              </button>
              <button className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                <Settings size={18} />
                Paramètres
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

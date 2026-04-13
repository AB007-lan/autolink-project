'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Bell, MessageSquare, User, Menu, X, Search, LogOut, Settings, Package } from 'lucide-react';
import { useAuthStore } from '../../lib/auth-store';
import { authApi } from '../../lib/api';
import { toast } from 'sonner';

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    clearAuth();
    router.push('/');
    toast.success('Déconnexion réussie');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'boutique': return '/boutique/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/profile';
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-blue-600">Autolink</span>
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une pièce, marque, modèle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
              />
            </div>
          </form>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/search"
              className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Catalogue
            </Link>
            <Link
              href="/boutiques"
              className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Boutiques
            </Link>

            {isAuthenticated && user ? (
              <>
                <Link
                  href="/messaging"
                  className="relative p-2 text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <Link
                  href="/orders"
                  className="relative p-2 text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <Package className="w-5 h-5" />
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <span className="text-blue-600 font-semibold text-sm">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden lg:block">
                      {user.firstName}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        href={getDashboardLink()}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        {user.role === 'boutique' ? 'Ma boutique' : user.role === 'admin' ? 'Administration' : 'Mon profil'}
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="w-4 h-4" />
                        Mes commandes
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 rounded-md hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link href="/search" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>Catalogue</Link>
          <Link href="/boutiques" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>Boutiques</Link>
          {isAuthenticated ? (
            <>
              <Link href="/messaging" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>Messages</Link>
              <Link href="/orders" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>Commandes</Link>
              <Link href={getDashboardLink()} className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>Mon espace</Link>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-red-600">Déconnexion</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Connexion</Link>
              <Link href="/register" className="block py-2 text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>S'inscrire</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

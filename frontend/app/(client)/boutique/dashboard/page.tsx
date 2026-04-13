'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package, ShoppingBag, MessageSquare, TrendingUp, Star, Eye,
  Clock, CheckCircle, AlertCircle, ArrowRight, Plus
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { boutiquesApi, ordersApi, messagingApi } from '../../../../lib/api';
import { formatPrice } from '../../../../lib/utils';
import { useAuthStore } from '../../../../lib/auth-store';
import { Header } from '../../../../components/layout/Header';

export default function BoutiqueDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user && user.role !== 'boutique') router.push('/');
  }, [isAuthenticated, user]);

  const { data: myBoutique, isLoading: loadingBoutique } = useQuery({
    queryKey: ['my-boutique'],
    queryFn: () => boutiquesApi.getMy(),
    enabled: isAuthenticated && user?.role === 'boutique',
  });

  const { data: stats } = useQuery({
    queryKey: ['boutique-stats'],
    queryFn: () => boutiquesApi.getMyStats(),
    enabled: isAuthenticated && user?.role === 'boutique',
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['boutique-orders-recent'],
    queryFn: () => ordersApi.getBoutiqueOrders({ limit: 5 }),
    enabled: isAuthenticated && user?.role === 'boutique',
  });

  const { data: unreadMessages } = useQuery({
    queryKey: ['unread-messages'],
    queryFn: () => messagingApi.getUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  if (!isAuthenticated || !user || user.role !== 'boutique') return null;

  const orders = Array.isArray(recentOrders) ? recentOrders : recentOrders?.items ?? [];
  const unread = (unreadMessages as any)?.count ?? 0;

  const statsCards = [
    {
      label: 'Produits actifs',
      value: (stats as any)?.totalProducts ?? myBoutique?._count?.products ?? 0,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      link: '/boutique/catalog',
    },
    {
      label: 'Commandes totales',
      value: (stats as any)?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: 'text-green-600',
      bg: 'bg-green-50',
      link: '/boutique/orders',
    },
    {
      label: 'Revenus du mois',
      value: formatPrice((stats as any)?.monthlyRevenue ?? 0),
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      link: '/boutique/orders',
      isText: true,
    },
    {
      label: 'Messages non lus',
      value: unread,
      icon: MessageSquare,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      link: '/messaging',
    },
  ];

  const STATUS_MAP: Record<string, { label: string; color: string }> = {
    pending: { label: 'En attente', color: 'text-yellow-600 bg-yellow-100' },
    confirmed: { label: 'Confirmée', color: 'text-blue-600 bg-blue-100' },
    processing: { label: 'En traitement', color: 'text-purple-600 bg-purple-100' },
    shipped: { label: 'Expédiée', color: 'text-orange-600 bg-orange-100' },
    delivered: { label: 'Livrée', color: 'text-green-600 bg-green-100' },
    cancelled: { label: 'Annulée', color: 'text-red-600 bg-red-100' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bonjour, {user.firstName} 👋
            </h1>
            <p className="text-gray-500 mt-1">
              {loadingBoutique ? 'Chargement...' : myBoutique?.name ?? 'Votre boutique'}
              {myBoutique?.isVerified && (
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Vérifiée</span>
              )}
            </p>
          </div>
          <Link
            href="/boutique/catalog/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter un produit
          </Link>
        </div>

        {/* Boutique not found / pending approval warning */}
        {!loadingBoutique && !myBoutique && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Boutique en attente d'approbation</p>
              <p className="text-sm text-yellow-700 mt-1">
                Votre boutique est en cours de vérification par notre équipe. Vous serez notifié une fois approuvé.
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((card) => (
            <Link
              key={card.label}
              href={card.link}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all group"
            >
              <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className={`text-2xl font-bold text-gray-900 ${card.isText ? 'text-lg' : ''}`}>
                {card.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Commandes récentes</h2>
              <Link href="/boutique/orders" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Voir tout <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Aucune commande pour le moment</p>
                </div>
              ) : (
                orders.map((order: any) => {
                  const sc = STATUS_MAP[order.status] ?? STATUS_MAP.pending;
                  return (
                    <Link key={order.id} href={`/boutique/orders`} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${sc.color}`}>
                          {sc.label}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Actions rapides</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { label: 'Gérer le catalogue', icon: Package, href: '/boutique/catalog', color: 'bg-blue-50 text-blue-700' },
                { label: 'Voir les commandes', icon: ShoppingBag, href: '/boutique/orders', color: 'bg-green-50 text-green-700' },
                { label: 'Messages', icon: MessageSquare, href: '/messaging', color: 'bg-purple-50 text-purple-700', badge: unread },
                { label: 'Mon profil', icon: Star, href: '/profile', color: 'bg-orange-50 text-orange-700' },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl ${action.color} hover:opacity-90 transition-opacity relative`}
                >
                  <action.icon className="w-6 h-6" />
                  <span className="text-sm font-medium text-center">{action.label}</span>
                  {action.badge > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {action.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

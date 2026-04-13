'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users, Store, Package, ShoppingBag, TrendingUp, AlertCircle,
  CheckCircle, XCircle, Eye, DollarSign, Activity
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, boutiquesApi, productsApi } from '../../../lib/api';
import { formatPrice, formatDate } from '../../../lib/utils';
import { useAuthStore } from '../../../lib/auth-store';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<'boutiques' | 'products'>('boutiques');

  const { data: dashboardData, isLoading: loadingStats } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard(),
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: pendingBoutiques = [] } = useQuery({
    queryKey: ['pending-boutiques'],
    queryFn: () => adminApi.getPendingBoutiques(),
    enabled: isAuthenticated && user?.role === 'admin',
    refetchInterval: 60000,
  });

  const { data: pendingProductsData } = useQuery({
    queryKey: ['pending-products'],
    queryFn: () => adminApi.getPendingProducts({ limit: 10 }),
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const verifyBoutiqueMutation = useMutation({
    mutationFn: ({ id, approve }: { id: string; approve: boolean }) =>
      boutiquesApi.verify(id, { status: approve ? 'verified' : 'rejected' }),
    onSuccess: (_, vars) => {
      toast.success(vars.approve ? '✅ Boutique approuvée' : '❌ Boutique refusée');
      qc.invalidateQueries({ queryKey: ['pending-boutiques'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (err: any) => toast.error(err?.message || 'Erreur'),
  });

  const approveProductMutation = useMutation({
    mutationFn: ({ id, approve }: { id: string; approve: boolean }) =>
      productsApi.approve(id, approve),
    onSuccess: (_, vars) => {
      toast.success(vars.approve ? '✅ Produit approuvé' : '❌ Produit refusé');
      qc.invalidateQueries({ queryKey: ['pending-products'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (err: any) => toast.error(err?.message || 'Erreur'),
  });

  const stats = dashboardData as any;
  const pendingProducts = (pendingProductsData as any)?.items ?? [];
  const boutiques = Array.isArray(pendingBoutiques) ? pendingBoutiques : [];

  const statsCards = [
    {
      label: 'Utilisateurs actifs',
      value: stats?.users?.total ?? 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Boutiques vérifiées',
      value: stats?.boutiques?.verified ?? 0,
      icon: Store,
      color: 'text-green-600',
      bg: 'bg-green-50',
      sub: `${stats?.boutiques?.pending ?? 0} en attente`,
    },
    {
      label: 'Produits actifs',
      value: stats?.products?.active ?? 0,
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      sub: `${stats?.products?.pending ?? 0} en attente`,
    },
    {
      label: 'Commandes totales',
      value: stats?.orders?.total ?? 0,
      icon: ShoppingBag,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      sub: `${stats?.orders?.pending ?? 0} en attente`,
    },
    {
      label: 'Revenu total',
      value: formatPrice(stats?.orders?.totalRevenue ?? 0),
      icon: DollarSign,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      isText: true,
    },
    {
      label: 'Commissions',
      value: formatPrice(stats?.orders?.totalCommissions ?? 0),
      icon: TrendingUp,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      isText: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble de la plateforme Autolink</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {loadingStats
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-28 border border-gray-100" />
            ))
          : statsCards.map((card) => (
              <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
                <p className={`font-bold text-gray-900 ${card.isText ? 'text-lg' : 'text-2xl'}`}>
                  {card.value}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
                {card.sub && (
                  <p className="text-xs text-orange-600 mt-1">{card.sub}</p>
                )}
              </div>
            ))}
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <h2 className="font-semibold text-gray-900">Validations en attente</h2>
              {(boutiques.length + pendingProducts.length) > 0 && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                  {boutiques.length + pendingProducts.length}
                </span>
              )}
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { key: 'boutiques', label: `Boutiques (${boutiques.length})` },
                { key: 'products', label: `Produits (${pendingProducts.length})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeTab === tab.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Boutiques tab */}
        {activeTab === 'boutiques' && (
          boutiques.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucune boutique en attente</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {boutiques.map((boutique: any) => (
                <div key={boutique.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {boutique.logoUrl
                      ? <img src={boutique.logoUrl} alt="" className="w-full h-full object-cover" />
                      : <span className="text-xl">🏪</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{boutique.name}</p>
                    <p className="text-sm text-gray-500">
                      {boutique.quartier && `${boutique.quartier} · `}
                      {boutique.owner?.email}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(boutique.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/boutiques/${boutique.id}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-blue-600 border border-gray-200 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => verifyBoutiqueMutation.mutate({ id: boutique.id, approve: true })}
                      disabled={verifyBoutiqueMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approuver
                    </button>
                    <button
                      onClick={() => verifyBoutiqueMutation.mutate({ id: boutique.id, approve: false })}
                      disabled={verifyBoutiqueMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 disabled:opacity-60 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Products tab */}
        {activeTab === 'products' && (
          pendingProducts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun produit en attente</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {pendingProducts.map((product: any) => (
                <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    {product.thumbnailUrl
                      ? <img src={product.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">🔧</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.boutique?.name} · {formatPrice(product.price)}
                    </p>
                    {product.description && (
                      <p className="text-xs text-gray-400 line-clamp-1">{product.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/products/${product.id}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-blue-600 border border-gray-200 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => approveProductMutation.mutate({ id: product.id, approve: true })}
                      disabled={approveProductMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-60"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approuver
                    </button>
                    <button
                      onClick={() => approveProductMutation.mutate({ id: product.id, approve: false })}
                      disabled={approveProductMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 disabled:opacity-60"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Monthly Chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Activité des 30 derniers jours</h2>
          <Activity className="w-5 h-5 text-blue-500" />
        </div>
        {(stats?.monthlyOrders?.length ?? 0) > 0 ? (
          <div className="flex items-end gap-1 h-32">
            {stats.monthlyOrders.slice(-14).map((day: any, i: number) => {
              const maxCount = Math.max(...stats.monthlyOrders.map((d: any) => Number(d.count)));
              const height = maxCount > 0 ? (Number(day.count) / maxCount) * 100 : 0;
              return (
                <div
                  key={i}
                  className="flex-1 bg-blue-100 hover:bg-blue-300 rounded-t transition-colors relative group cursor-pointer"
                  style={{ height: `${Math.max(4, height)}%` }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    {day.count} commandes
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
            Aucune donnée disponible
          </div>
        )}
      </div>
    </div>
  );
}

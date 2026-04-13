'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users, Store, Package, ShoppingBag, TrendingUp, AlertCircle,
  CheckCircle, XCircle, Eye, Shield, ArrowRight, BarChart3
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, boutiquesApi, productsApi } from '../../../../lib/api';
import { formatPrice } from '../../../../lib/utils';
import { useAuthStore } from '../../../../lib/auth-store';
import { toast } from 'sonner';
import { Header } from '../../../../components/layout/Header';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<'boutiques' | 'products' | 'users'>('boutiques');

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user && user.role !== 'admin') router.push('/');
  }, [isAuthenticated, user]);

  const { data: dashboardData } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard(),
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: pendingBoutiques = [] } = useQuery({
    queryKey: ['pending-boutiques'],
    queryFn: () => adminApi.getPendingBoutiques(),
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: pendingProductsData } = useQuery({
    queryKey: ['pending-products'],
    queryFn: () => adminApi.getPendingProducts({ limit: 10 }),
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: usersData } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers({ limit: 10 }),
    enabled: isAuthenticated && user?.role === 'admin' && activeTab === 'users',
  });

  const verifyBoutiqueMutation = useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) =>
      boutiquesApi.verify(id, { isVerified }),
    onSuccess: (_, vars) => {
      toast.success(vars.isVerified ? 'Boutique approuvée' : 'Boutique refusée');
      qc.invalidateQueries({ queryKey: ['pending-boutiques'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (err: any) => toast.error(err?.message || 'Erreur'),
  });

  const approveProductMutation = useMutation({
    mutationFn: ({ id, approve }: { id: string; approve: boolean }) =>
      productsApi.approve(id, approve),
    onSuccess: (_, vars) => {
      toast.success(vars.approve ? 'Produit approuvé' : 'Produit refusé');
      qc.invalidateQueries({ queryKey: ['pending-products'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (err: any) => toast.error(err?.message || 'Erreur'),
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updateUserStatus(id, status),
    onSuccess: () => {
      toast.success('Statut utilisateur mis à jour');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err: any) => toast.error(err?.message || 'Erreur'),
  });

  if (!isAuthenticated || !user || user.role !== 'admin') return null;

  const stats = dashboardData as any;
  const pendingProducts = pendingProductsData?.items ?? (Array.isArray(pendingProductsData) ? pendingProductsData : []);
  const users = usersData?.items ?? (Array.isArray(usersData) ? usersData : []);

  const statsCards = [
    { label: 'Utilisateurs', value: stats?.totalUsers ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Boutiques', value: stats?.totalBoutiques ?? 0, icon: Store, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Produits', value: stats?.totalProducts ?? 0, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Commandes', value: stats?.totalOrders ?? 0, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Revenu total', value: formatPrice(stats?.totalRevenue ?? 0), icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50', isText: true },
    {
      label: 'En attente',
      value: (Array.isArray(pendingBoutiques) ? pendingBoutiques.length : 0) + pendingProducts.length,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Administration Autolink</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble de la plateforme</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statsCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <p className={`font-bold text-gray-900 ${card.isText ? 'text-sm' : 'text-xl'}`}>
                {card.value}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {([
            { key: 'boutiques', label: `Boutiques (${Array.isArray(pendingBoutiques) ? pendingBoutiques.length : 0})` },
            { key: 'products', label: `Produits (${pendingProducts.length})` },
            { key: 'users', label: 'Utilisateurs' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pending Boutiques */}
        {activeTab === 'boutiques' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Boutiques en attente d'approbation</h2>
            </div>
            {!Array.isArray(pendingBoutiques) || pendingBoutiques.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-gray-500">Aucune boutique en attente</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {(pendingBoutiques as any[]).map((boutique) => (
                  <div key={boutique.id} className="flex items-start gap-4 p-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {boutique.logoUrl ? (
                        <img src={boutique.logoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">🏪</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{boutique.name}</p>
                      <p className="text-sm text-gray-500">{boutique.quartier} · {boutique.owner?.email}</p>
                      {boutique.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{boutique.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        href={`/boutiques/${boutique.id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => verifyBoutiqueMutation.mutate({ id: boutique.id, isVerified: true })}
                        disabled={verifyBoutiqueMutation.isPending}
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-60"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approuver
                      </button>
                      <button
                        onClick={() => verifyBoutiqueMutation.mutate({ id: boutique.id, isVerified: false })}
                        disabled={verifyBoutiqueMutation.isPending}
                        className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 disabled:opacity-60"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pending Products */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Produits en attente de validation</h2>
            </div>
            {pendingProducts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-gray-500">Aucun produit en attente</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {pendingProducts.map((product: any) => (
                  <div key={product.id} className="flex items-start gap-4 p-5">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                      {product.thumbnailUrl ? (
                        <img src={product.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🔧</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.boutique?.name} · {formatPrice(product.price)}
                      </p>
                      {product.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{product.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        href={`/products/${product.id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 border border-gray-200 rounded-lg"
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
            )}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Gestion des utilisateurs</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun utilisateur</p>
                </div>
              ) : (
                users.map((u: any) => (
                  <div key={u.id} className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        u.role === 'admin' ? 'bg-red-100 text-red-700' :
                        u.role === 'boutique' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.status === 'active' ? 'Actif' : 'Bloqué'}
                      </span>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() =>
                            updateUserStatusMutation.mutate({
                              id: u.id,
                              status: u.status === 'active' ? 'blocked' : 'active',
                            })
                          }
                          disabled={updateUserStatusMutation.isPending}
                          className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                        >
                          {u.status === 'active' ? 'Bloquer' : 'Débloquer'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

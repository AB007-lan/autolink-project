'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag, Clock, CheckCircle, XCircle, Truck, Package,
  ChevronDown, Phone, MapPin, Search
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../../../../lib/api';
import { formatPrice } from '../../../../lib/utils';
import { useAuthStore } from '../../../../lib/auth-store';
import { toast } from 'sonner';
import { Header } from '../../../../components/layout/Header';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'En attente', color: 'text-yellow-600 bg-yellow-100', icon: Clock },
  confirmed: { label: 'Confirmée', color: 'text-blue-600 bg-blue-100', icon: CheckCircle },
  processing: { label: 'En traitement', color: 'text-purple-600 bg-purple-100', icon: Package },
  shipped: { label: 'Expédiée', color: 'text-orange-600 bg-orange-100', icon: Truck },
  delivered: { label: 'Livrée', color: 'text-green-600 bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Annulée', color: 'text-red-600 bg-red-100', icon: XCircle },
};

const NEXT_STATUS: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'processing',
  processing: 'shipped',
  shipped: 'delivered',
};

export default function BoutiqueOrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user && user.role !== 'boutique') router.push('/');
  }, [isAuthenticated, user]);

  const { data, isLoading } = useQuery({
    queryKey: ['boutique-orders', statusFilter],
    queryFn: () => ordersApi.getBoutiqueOrders({ status: statusFilter || undefined }),
    enabled: isAuthenticated && user?.role === 'boutique',
    refetchInterval: 30000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateStatus(id, { status }),
    onSuccess: () => {
      toast.success('Statut de commande mis à jour');
      qc.invalidateQueries({ queryKey: ['boutique-orders'] });
    },
    onError: (err: any) => toast.error(err?.message || 'Erreur lors de la mise à jour'),
  });

  const orders = Array.isArray(data) ? data : data?.items ?? [];
  const filtered = orders.filter((o: any) =>
    !search ||
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    (o.user?.firstName + ' ' + o.user?.lastName).toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = orders.filter((o: any) => o.status === 'pending').length;

  if (!isAuthenticated || !user || user.role !== 'boutique') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Commandes reçues</h1>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                {pendingCount} nouvelle{pendingCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-gray-500 mt-1">{orders.length} commande{orders.length > 1 ? 's' : ''} au total</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par numéro ou client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: '', label: 'Toutes' },
              { key: 'pending', label: 'En attente' },
              { key: 'confirmed', label: 'Confirmées' },
              { key: 'shipped', label: 'Expédiées' },
              { key: 'delivered', label: 'Livrées' },
              { key: 'cancelled', label: 'Annulées' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  statusFilter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {statusFilter ? 'Aucune commande avec ce statut' : 'Aucune commande reçue'}
            </h3>
            <p className="text-gray-500">
              {statusFilter ? 'Changer le filtre pour voir d\'autres commandes' : 'Les commandes de vos clients apparaîtront ici'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order: any) => {
              const sc = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
              const StatusIcon = sc.icon;
              const isExpanded = expandedOrder === order.id;
              const nextStatus = NEXT_STATUS[order.status];

              return (
                <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Order header */}
                  <button
                    className="w-full text-left p-5 hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${sc.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {sc.label}
                        </span>
                        <span className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </button>

                  {/* Order details (expanded) */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-5">
                      {/* Customer info */}
                      {order.user && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Client</h4>
                          <p className="font-medium text-gray-900">
                            {order.user.firstName} {order.user.lastName}
                          </p>
                          {order.user.phone && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                              <Phone className="w-3 h-3" />
                              {order.user.phone}
                            </div>
                          )}
                          {order.deliveryAddress && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                              <MapPin className="w-3 h-3" />
                              {order.deliveryAddress}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Items */}
                      {order.items?.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Articles</h4>
                          <div className="space-y-2">
                            {order.items.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-3 py-2">
                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                  {item.product?.thumbnailUrl ? (
                                    <img src={item.product.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xl">🔧</div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {item.product?.name ?? 'Produit'}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Qté: {item.quantity} × {formatPrice(item.unitPrice)}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                                  {formatPrice(item.quantity * item.unitPrice)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Payment method */}
                      {order.paymentMethod && (
                        <p className="text-sm text-gray-500 mb-4">
                          Paiement : <span className="font-medium text-gray-700">{order.paymentMethod}</span>
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 flex-wrap">
                        {nextStatus && order.status !== 'cancelled' && (
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: order.id, status: nextStatus })}
                            disabled={updateStatusMutation.isPending}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Passer à : {STATUS_CONFIG[nextStatus]?.label}
                          </button>
                        )}
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'cancelled' })}
                            disabled={updateStatusMutation.isPending}
                            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 disabled:opacity-60"
                          >
                            <XCircle className="w-4 h-4" />
                            Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

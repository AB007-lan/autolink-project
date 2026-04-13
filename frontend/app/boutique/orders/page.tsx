'use client';

import { useState } from 'react';
import {
  ShoppingBag, Clock, CheckCircle, XCircle, Truck, Package,
  ChevronDown, Phone, MapPin, Search
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../../../lib/api';
import { formatPrice, formatDate } from '../../../lib/utils';
import { useAuthStore } from '../../../lib/auth-store';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'En attente', color: 'text-yellow-600 bg-yellow-100', icon: Clock },
  confirmed: { label: 'Confirmée', color: 'text-blue-600 bg-blue-100', icon: CheckCircle },
  processing: { label: 'En traitement', color: 'text-purple-600 bg-purple-100', icon: Package },
  ready: { label: 'Prête', color: 'text-indigo-600 bg-indigo-100', icon: Package },
  shipped: { label: 'Expédiée', color: 'text-orange-600 bg-orange-100', icon: Truck },
  delivered: { label: 'Livrée', color: 'text-green-600 bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Annulée', color: 'text-red-600 bg-red-100', icon: XCircle },
};

const NEXT_STATUS: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'processing',
  processing: 'ready',
  ready: 'shipped',
  shipped: 'delivered',
};

const STATUS_TABS = [
  { key: '', label: 'Toutes' },
  { key: 'pending', label: 'En attente' },
  { key: 'confirmed', label: 'Confirmées' },
  { key: 'processing', label: 'En traitement' },
  { key: 'shipped', label: 'Expédiées' },
  { key: 'delivered', label: 'Livrées' },
  { key: 'cancelled', label: 'Annulées' },
];

export default function BoutiqueOrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['boutique-orders', statusFilter],
    queryFn: () => ordersApi.getBoutiqueOrders({ status: statusFilter || undefined }),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateStatus(id, { status }),
    onSuccess: () => {
      toast.success('Statut mis à jour');
      qc.invalidateQueries({ queryKey: ['boutique-orders'] });
      qc.invalidateQueries({ queryKey: ['boutique-stats'] });
    },
    onError: (err: any) => toast.error(err?.message || 'Erreur'),
  });

  const orders = Array.isArray(data) ? data : (data as any)?.items ?? [];
  const filtered = orders.filter((o: any) =>
    !search ||
    (o.orderNumber ?? '').toLowerCase().includes(search.toLowerCase()) ||
    `${o.client?.firstName} ${o.client?.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = orders.filter((o: any) => o.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes reçues</h1>
          <p className="text-gray-500 mt-1">{orders.length} commande{orders.length > 1 ? 's' : ''} au total</p>
        </div>
        {pendingCount > 0 && (
          <span className="px-2.5 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
            {pendingCount} nouvelle{pendingCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par numéro ou client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              statusFilter === key
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Orders list */}
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
          <p className="text-gray-500 text-sm">
            {statusFilter ? "Changez le filtre pour voir d'autres commandes" : 'Les commandes de vos clients apparaîtront ici'}
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
                {/* Header row */}
                <button
                  className="w-full text-left p-5 hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-mono text-sm font-medium text-gray-900">
                          {order.orderNumber ?? `#${order.id?.slice(0, 8).toUpperCase()}`}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${sc.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {sc.label}
                      </span>
                      <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-5 space-y-4">
                    {/* Client info */}
                    {order.client && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Client</h4>
                        <p className="font-medium text-gray-900">
                          {order.client.firstName} {order.client.lastName}
                        </p>
                        {order.client.phone && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
                            <Phone className="w-3.5 h-3.5" />
                            {order.client.phone}
                          </div>
                        )}
                        {order.deliveryAddress && (
                          <div className="flex items-start gap-1.5 text-sm text-gray-600 mt-1">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            <span>
                              {order.deliveryAddress.street && `${order.deliveryAddress.street}, `}
                              {order.deliveryAddress.quartier}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Items */}
                    {order.items?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Articles</h4>
                        <div className="space-y-2">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                {item.product?.thumbnailUrl
                                  ? <img src={item.product.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                  : <div className="w-full h-full flex items-center justify-center text-xl">🔧</div>
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.quantity} × {formatPrice(item.productPrice)}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                                {formatPrice(item.lineTotal)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm">
                          <span className="text-gray-500">Total</span>
                          <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    )}

                    {/* Payment info */}
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>Paiement: <span className="font-medium text-gray-700 capitalize">{order.paymentMethod}</span></span>
                      <span>Livraison: <span className="font-medium text-gray-700 capitalize">{order.deliveryMethod === 'pickup' ? 'Retrait' : 'Livraison'}</span></span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 flex-wrap pt-2">
                      {nextStatus && (
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: order.id, status: nextStatus })}
                          disabled={updateStatusMutation.isPending}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          → {STATUS_CONFIG[nextStatus]?.label}
                        </button>
                      )}
                      {!['delivered', 'cancelled'].includes(order.status) && (
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'cancelled' })}
                          disabled={updateStatusMutation.isPending}
                          className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 disabled:opacity-60 transition-colors"
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
  );
}

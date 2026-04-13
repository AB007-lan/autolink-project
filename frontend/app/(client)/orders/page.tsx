'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight, Clock, CheckCircle, XCircle, Truck, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../../../lib/api';
import { formatPrice } from '../../../lib/utils';
import { useAuthStore } from '../../../lib/auth-store';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'En attente', color: 'text-yellow-600 bg-yellow-100', icon: Clock },
  confirmed: { label: 'Confirmée', color: 'text-blue-600 bg-blue-100', icon: CheckCircle },
  processing: { label: 'En traitement', color: 'text-purple-600 bg-purple-100', icon: Package },
  shipped: { label: 'Expédiée', color: 'text-orange-600 bg-orange-100', icon: Truck },
  delivered: { label: 'Livrée', color: 'text-green-600 bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Annulée', color: 'text-red-600 bg-red-100', icon: XCircle },
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated]);

  const { data, isLoading } = useQuery({
    queryKey: ['my-orders', statusFilter],
    queryFn: () => ordersApi.getMyOrders({ status: statusFilter || undefined }),
    enabled: isAuthenticated,
  });

  const orders = Array.isArray(data) ? data : data?.items ?? [];
  const filtered = orders.filter((o: any) =>
    !search ||
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.items?.some((i: any) => i.product?.name?.toLowerCase().includes(search.toLowerCase()))
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mes commandes</h1>
          <p className="text-gray-500 mt-1">Suivez vos achats et leur statut</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par numéro ou produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {statusFilter ? 'Aucune commande avec ce statut' : 'Aucune commande'}
            </h3>
            <p className="text-gray-500 mb-6">
              {statusFilter
                ? 'Essayez de changer le filtre'
                : 'Commencez à acheter des pièces auto'}
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              Parcourir le catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order: any) => {
              const statusConf = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
              const StatusIcon = statusConf.icon;
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Commande #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConf.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConf.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>

                  {/* Items preview */}
                  {order.items?.length > 0 && (
                    <div className="flex gap-3 mb-3">
                      {order.items.slice(0, 3).map((item: any, idx: number) => (
                        <div key={idx} className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {item.product?.thumbnailUrl ? (
                            <img
                              src={item.product.thumbnailUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">🔧</div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-500">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {order.items?.length ?? 0} article{order.items?.length > 1 ? 's' : ''}
                      {order.boutique?.name && ` · ${order.boutique.name}`}
                    </p>
                    <p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

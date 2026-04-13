'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Store, CheckCircle, XCircle, Eye, Clock, Filter } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, boutiquesApi } from '../../../lib/api';
import { formatDate } from '../../../lib/utils';
import { useAuthStore } from '../../../lib/auth-store';
import { toast } from 'sonner';

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'verified', label: 'Vérifiées' },
  { value: 'rejected', label: 'Refusées' },
  { value: 'suspended', label: 'Suspendues' },
];

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  verified: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  suspended: 'bg-gray-100 text-gray-700',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  verified: 'Vérifiée',
  rejected: 'Refusée',
  suspended: 'Suspendue',
};

export default function AdminBoutiquesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-boutiques', search, status, page],
    queryFn: () =>
      adminApi.getAllBoutiques({ search: search || undefined, status: status || undefined, page, limit: 15 }),
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, approve }: { id: string; approve: boolean }) =>
      boutiquesApi.verify(id, { status: approve ? 'verified' : 'rejected' }),
    onSuccess: (_, vars) => {
      toast.success(vars.approve ? 'Boutique approuvée' : 'Boutique refusée');
      qc.invalidateQueries({ queryKey: ['admin-boutiques'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (err: any) => toast.error(err?.message || 'Erreur'),
  });

  const items = (data as any)?.items ?? [];
  const total = (data as any)?.total ?? 0;
  const totalPages = (data as any)?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Boutiques</h1>
          <p className="text-gray-500 mt-1">{total} boutique{total > 1 ? 's' : ''} au total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une boutique..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Store className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">Aucune boutique trouvée</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Boutique</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Propriétaire</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Quartier</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Statut</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Date</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((boutique: any) => (
                  <tr key={boutique.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {boutique.logoUrl
                            ? <img src={boutique.logoUrl} alt="" className="w-full h-full object-cover" />
                            : <span className="text-lg">🏪</span>
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{boutique.name}</p>
                          <p className="text-xs text-gray-500">{boutique.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm text-gray-700">{boutique.owner?.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-sm text-gray-500">{boutique.quartier ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[boutique.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {STATUS_LABELS[boutique.status] ?? boutique.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-xs text-gray-400">{formatDate(boutique.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/boutiques/${boutique.id}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-blue-600 border border-gray-200 rounded-lg transition-colors"
                          title="Voir la boutique"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        {boutique.status === 'pending' && (
                          <>
                            <button
                              onClick={() => verifyMutation.mutate({ id: boutique.id, approve: true })}
                              disabled={verifyMutation.isPending}
                              className="p-1.5 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 disabled:opacity-60 transition-colors"
                              title="Approuver"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => verifyMutation.mutate({ id: boutique.id, approve: false })}
                              disabled={verifyMutation.isPending}
                              className="p-1.5 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60 transition-colors"
                              title="Refuser"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {boutique.status === 'rejected' && (
                          <button
                            onClick={() => verifyMutation.mutate({ id: boutique.id, approve: true })}
                            disabled={verifyMutation.isPending}
                            className="p-1.5 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 disabled:opacity-60 transition-colors"
                            title="Approuver quand même"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Précédent
                </button>
                <span className="px-3 py-1.5 text-sm text-gray-600">
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

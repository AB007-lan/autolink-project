'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Shield, Star, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { boutiquesApi } from '../../../lib/api';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';

const QUARTIERS = [
  'Tevragh-Zeina', 'Ksar', 'Toujounine', 'Dar Naim', 'Arafat',
  'El Mina', 'Sebkha', 'Teyarett', 'Riadh',
];

export default function BoutiquesPage() {
  const [search, setSearch] = useState('');
  const [quartier, setQuartier] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['boutiques', search, quartier, verifiedOnly, page],
    queryFn: () =>
      boutiquesApi.getAll({
        search: search || undefined,
        quartier: quartier || undefined,
        isVerified: verifiedOnly || undefined,
        page,
        limit: 12,
      }),
  });

  const boutiques = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 12);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Boutiques vérifiées</h1>
          <p className="text-blue-200">
            Découvrez les meilleurs vendeurs de pièces auto à Nouakchott
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une boutique..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={quartier}
            onChange={(e) => { setQuartier(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Tous les quartiers</option>
            {QUARTIERS.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 cursor-pointer px-3 py-2">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => { setVerifiedOnly(e.target.checked); setPage(1); }}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700 whitespace-nowrap flex items-center gap-1">
              <Shield className="w-4 h-4 text-green-500" />
              Vérifiées uniquement
            </span>
          </label>
        </div>

        {/* Results count */}
        {!isLoading && (
          <p className="text-sm text-gray-500 mb-4">
            {total} boutique{total > 1 ? 's' : ''} trouvée{total > 1 ? 's' : ''}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : boutiques.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune boutique trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boutiques.map((boutique: any) => (
              <BoutiqueCard key={boutique.id} boutique={boutique} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function BoutiqueCard({ boutique }: { boutique: any }) {
  return (
    <Link
      href={`/boutiques/${boutique.id}`}
      className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {boutique.logoUrl ? (
            <img src={boutique.logoUrl} alt={boutique.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl">🏪</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {boutique.name}
            </h3>
            {boutique.isVerified && (
              <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
            )}
          </div>
          {boutique.quartier && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
              <MapPin className="w-3 h-3" />
              <span>{boutique.quartier}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            {boutique.ratingCount > 0 ? (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{Number(boutique.ratingAverage).toFixed(1)}</span>
                <span className="text-sm text-gray-400">({boutique.ratingCount})</span>
              </div>
            ) : (
              <span className="text-xs text-gray-400">Nouvelle boutique</span>
            )}
            {boutique._count?.products > 0 && (
              <span className="text-xs text-blue-600 font-medium">
                {boutique._count.products} pièce{boutique._count.products > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
      {boutique.description && (
        <p className="text-xs text-gray-500 mt-3 line-clamp-2">{boutique.description}</p>
      )}
    </Link>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, Star, MapPin, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { productsApi } from '../../../lib/api';
import { formatPrice, getStatusLabel, getStatusColor } from '../../../lib/utils';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    brand: searchParams.get('brand') || '',
    model: searchParams.get('model') || '',
    year: searchParams.get('year') || '',
    categoryId: searchParams.get('categoryId') || '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    page: 1,
    limit: 20,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll({
      ...filters,
      year: filters.year ? Number(filters.year) : undefined,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
  });

  const { data: brands } = useQuery({
    queryKey: ['vehicle-brands'],
    queryFn: () => productsApi.getVehicleBrands(),
  });

  const { data: models } = useQuery({
    queryKey: ['vehicle-models', filters.brand],
    queryFn: () => productsApi.getVehicleModels(filters.brand),
    enabled: !!filters.brand,
  });

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      brand: '',
      model: '',
      year: '',
      categoryId: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      page: 1,
      limit: 20,
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

  const products = (data as any)?.items || [];
  const total = (data as any)?.total || 0;
  const totalPages = (data as any)?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une pièce..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
              showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden sm:block">Filtres</span>
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-20 space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Filtres</h3>
                <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700">
                  Effacer
                </button>
              </div>

              {/* Vehicle Search */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Recherche par véhicule</h4>
                <select
                  value={filters.brand}
                  onChange={(e) => { updateFilter('brand', e.target.value); updateFilter('model', ''); }}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes les marques</option>
                  {Array.isArray(brands) && brands.map((b: string) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                <select
                  value={filters.model}
                  onChange={(e) => updateFilter('model', e.target.value)}
                  disabled={!filters.brand}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">Tous les modèles</option>
                  {Array.isArray(models) && models.map((m: string) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <select
                  value={filters.year}
                  onChange={(e) => updateFilter('year', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes les années</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Catégorie</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => updateFilter('categoryId', '')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${!filters.categoryId ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Toutes
                  </button>
                  {Array.isArray(categories) && categories.map((cat: any) => (
                    <button
                      key={cat.id}
                      onClick={() => updateFilter('categoryId', cat.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${filters.categoryId === cat.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">État</h4>
                {[
                  { value: '', label: 'Tous' },
                  { value: 'new', label: 'Neuf' },
                  { value: 'used', label: 'Occasion' },
                  { value: 'reconditioned', label: 'Reconditionné' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updateFilter('condition', value)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${filters.condition === value ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Prix (MRU)</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Results header */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{total}</span> résultats
              </p>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="newest">Plus récents</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="popular">Popularité</option>
              </select>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden">
                    <div className="aspect-square skeleton"></div>
                    <div className="p-3 space-y-2">
                      <div className="h-3 skeleton rounded w-3/4"></div>
                      <div className="h-4 skeleton rounded"></div>
                      <div className="h-4 skeleton rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && products.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group card-hover"
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      {product.thumbnailUrl ? (
                        <img
                          src={product.thumbnailUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🔧</div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-blue-600 font-medium mb-1 truncate">{product.boutique?.name}</p>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(product.condition)}`}>
                          {getStatusLabel(product.condition)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && products.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun résultat</h3>
                <p className="text-gray-500 mb-6">Essayez de modifier vos filtres ou d'élargir votre recherche</p>
                <button onClick={clearFilters} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Effacer les filtres
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => updateFilter('page', Math.max(1, filters.page - 1))}
                  disabled={filters.page === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => updateFilter('page', pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        filters.page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => updateFilter('page', Math.min(totalPages, filters.page + 1))}
                  disabled={filters.page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

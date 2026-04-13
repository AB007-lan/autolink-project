'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Shield, Star, Phone, MessageSquare, Package, ChevronLeft, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { boutiquesApi, productsApi } from '../../../../lib/api';
import { formatPrice } from '../../../../lib/utils';
import { useAuthStore } from '../../../../lib/auth-store';
import { Header } from '../../../../components/layout/Header';
import { Footer } from '../../../../components/layout/Footer';

export default function BoutiqueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [searchProduct, setSearchProduct] = useState('');

  const { data: boutique, isLoading: loadingBoutique } = useQuery({
    queryKey: ['boutique', id],
    queryFn: () => boutiquesApi.getOne(id),
    enabled: !!id,
  });

  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['boutique-products', id, searchProduct],
    queryFn: () =>
      productsApi.getAll({ boutiqueId: id, search: searchProduct || undefined, limit: 20 }),
    enabled: !!id,
  });

  const products = productsData?.items ?? [];

  const handleContact = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push(`/messaging?boutiqueId=${id}`);
  };

  if (loadingBoutique) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-2xl mb-6" />
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!boutique) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Boutique introuvable</h2>
          <Link href="/boutiques" className="text-blue-600 hover:underline">
            Retour aux boutiques
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Accueil</Link>
          <span>/</span>
          <Link href="/boutiques" className="hover:text-blue-600">Boutiques</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{boutique.name}</span>
        </div>

        {/* Boutique Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {boutique.logoUrl ? (
                <img src={boutique.logoUrl} alt={boutique.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">🏪</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{boutique.name}</h1>
                {boutique.isVerified && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <Shield className="w-3 h-3" />
                    Boutique vérifiée
                  </span>
                )}
              </div>

              {boutique.quartier && (
                <div className="flex items-center gap-1 text-gray-500 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{boutique.quartier}, Nouakchott</span>
                </div>
              )}

              {boutique.ratingCount > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(boutique.ratingAverage)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {Number(boutique.ratingAverage).toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-400">
                    ({boutique.ratingCount} avis)
                  </span>
                </div>
              )}

              {boutique.description && (
                <p className="text-gray-600 text-sm leading-relaxed">{boutique.description}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <button
                onClick={handleContact}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Contacter
              </button>
              {boutique.phone && (
                <a
                  href={`tel:${boutique.phone}`}
                  className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {boutique.phone}
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{boutique._count?.products ?? 0}</p>
              <p className="text-xs text-gray-500 mt-1">Produits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{boutique.ratingCount ?? 0}</p>
              <p className="text-xs text-gray-500 mt-1">Avis clients</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {boutique.isVerified ? '✓' : '—'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Vérifié</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              Catalogue ({productsData?.total ?? 0} pièces)
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Chercher dans cette boutique..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3">
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun produit disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
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
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
                      {product.condition === 'new' ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Neuf</span>
                      ) : (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Occasion</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

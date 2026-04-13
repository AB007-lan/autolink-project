'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight, Star, MapPin, Shield, Truck, MessageSquare, Award, ArrowRight, Car } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productsApi, boutiquesApi } from '../../lib/api';
import { formatPrice } from '../../lib/utils';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const { data: featuredProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.getFeatured(),
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
    queryKey: ['vehicle-models', selectedBrand],
    queryFn: () => productsApi.getVehicleModels(selectedBrand),
    enabled: !!selectedBrand,
  });

  const { data: boutiquesData } = useQuery({
    queryKey: ['boutiques-home'],
    queryFn: () => boutiquesApi.getAll({ limit: 6 }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedModel) params.set('model', selectedModel);
    if (selectedYear) params.set('year', selectedYear);
    router.push(`/search?${params.toString()}`);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-700/50 text-blue-200 px-4 py-2 rounded-full text-sm mb-6">
              <Car className="w-4 h-4" />
              <span>Marketplace #1 Pièces Auto en Mauritanie</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Trouvez la pièce auto
              <span className="text-orange-400"> parfaite</span>
              <br />en quelques secondes
            </h1>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-8">
              Accédez à des milliers de pièces détachées auprès de boutiques vérifiées à Nouakchott.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Quelle pièce cherchez-vous ?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap"
                >
                  Rechercher
                </button>
              </div>

              {/* Vehicle Search */}
              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-100">
                <select
                  value={selectedBrand}
                  onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(''); }}
                  className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Marque</option>
                  {Array.isArray(brands) && brands.map((b: string) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedBrand}
                >
                  <option value="">Modèle</option>
                  {Array.isArray(models) && models.map((m: string) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Année</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>

          {/* Quick stats */}
          <div className="flex justify-center gap-8 mt-12 text-center">
            {[
              { value: '5000+', label: 'Pièces disponibles' },
              { value: '50+', label: 'Boutiques vérifiées' },
              { value: '2000+', label: 'Clients satisfaits' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-orange-400">{stat.value}</p>
                <p className="text-blue-300 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Boutiques vérifiées', desc: 'Chaque vendeur est contrôlé et vérifié par nos équipes' },
              { icon: Search, title: 'Recherche par véhicule', desc: 'Trouvez exactement la pièce compatible avec votre voiture' },
              { icon: MessageSquare, title: 'Contact direct', desc: 'Échangez directement avec les boutiques par messagerie' },
              { icon: Award, title: 'Paiement sécurisé', desc: 'Bankily, Masrvi, Sedad ou paiement à la livraison' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {Array.isArray(categories) && categories.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Catégories</h2>
                <p className="text-gray-500 mt-1">Parcourez par type de pièce</p>
              </div>
              <Link href="/search" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium">
                Voir tout <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(0, 12).map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/search?categoryId=${cat.id}`}
                  className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-blue-200 hover:shadow-md transition-all group"
                >
                  <div className="text-3xl mb-2">{cat.icon || '🔧'}</div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{cat.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {Array.isArray(featuredProducts) && featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Produits à la une</h2>
                <p className="text-gray-500 mt-1">Les meilleures offres du moment</p>
              </div>
              <Link href="/search" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium">
                Voir tout <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.slice(0, 8).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Boutiques */}
      {boutiquesData?.items?.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Boutiques vérifiées</h2>
                <p className="text-gray-500 mt-1">Des vendeurs de confiance à Nouakchott</p>
              </div>
              <Link href="/boutiques" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium">
                Voir tout <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boutiquesData.items.slice(0, 6).map((boutique: any) => (
                <BoutiqueCard key={boutique.id} boutique={boutique} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Boutique */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous êtes vendeur de pièces auto ?</h2>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez Autolink et vendez vos pièces à des milliers de clients à travers tout Nouakchott.
          </p>
          <Link
            href="/register?role=boutique"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
          >
            Ouvrir ma boutique gratuitement
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.id}`} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group card-hover">
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
        <p className="text-xs text-blue-600 font-medium mb-1">{product.boutique?.name}</p>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
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
  );
}

function BoutiqueCard({ boutique }: { boutique: any }) {
  return (
    <Link href={`/boutiques/${boutique.id}`} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all group">
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
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{boutique.name}</h3>
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
          {boutique.ratingCount > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{Number(boutique.ratingAverage).toFixed(1)}</span>
              <span className="text-sm text-gray-400">({boutique.ratingCount})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

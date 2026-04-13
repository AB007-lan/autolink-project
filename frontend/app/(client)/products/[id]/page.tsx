'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ArrowLeft, Star, Shield, MapPin, Phone, MessageSquare,
  ShoppingCart, Share2, Heart, ChevronLeft, ChevronRight, Check, AlertCircle
} from 'lucide-react';
import { productsApi, ordersApi, messagingApi } from '../../../../lib/api';
import { formatPrice, formatRelativeDate, getStatusLabel, getStatusColor } from '../../../../lib/utils';
import { useAuthStore } from '../../../../lib/auth-store';
import { Header } from '../../../../components/layout/Header';
import { Footer } from '../../../../components/layout/Footer';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [ordering, setOrdering] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => productsApi.getOne(params.id as string),
  });

  const p = product as any;

  const handleContact = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/products/' + params.id);
      return;
    }

    try {
      await messagingApi.sendMessage({
        boutiqueId: p?.boutiqueId,
        content: `Bonjour, je suis intéressé par votre produit : ${p?.name}`,
        relatedProductId: p?.id,
      });
      router.push('/messaging');
      toast.success('Message envoyé !');
    } catch {
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const handleOrder = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/products/' + params.id);
      return;
    }
    if (user?.role !== 'client') {
      toast.error('Seuls les clients peuvent passer des commandes');
      return;
    }

    setOrdering(true);
    try {
      const order = await ordersApi.create({
        boutiqueId: p?.boutiqueId,
        items: [{ productId: p?.id, quantity }],
        paymentMethod: 'cash',
        deliveryMethod: 'pickup',
      });
      toast.success('Commande passée avec succès !');
      router.push(`/orders/${(order as any).id}`);
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors de la commande');
    } finally {
      setOrdering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square skeleton rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-8 skeleton rounded w-3/4"></div>
              <div className="h-12 skeleton rounded w-1/2"></div>
              <div className="h-32 skeleton rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!p) return null;

  const images = p.images?.length > 0 ? p.images : [p.thumbnailUrl].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Accueil</Link>
          <span>/</span>
          <Link href="/search" className="hover:text-blue-600">Catalogue</Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{p.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-4 relative">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage] || '/placeholder-product.png'}
                  alt={p.name}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">🔧</div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-blue-500' : 'border-gray-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(p.condition)}`}>
                {getStatusLabel(p.condition)}
              </span>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">{p.name}</h1>

            {p.reference && (
              <p className="text-sm text-gray-500 mb-4">Réf: {p.reference}</p>
            )}

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-gray-900">{formatPrice(p.price)}</span>
              {p.priceNegotiable && (
                <span className="text-sm text-green-600 font-medium">Prix négociable</span>
              )}
            </div>

            {/* Stock */}
            <div className={`flex items-center gap-2 p-3 rounded-lg mb-6 ${p.stock > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              {p.stock > 0 ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">{p.stock} en stock</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-700 font-medium">Rupture de stock</span>
                </>
              )}
            </div>

            {/* Compatibility */}
            {p.compatibilities?.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Compatibilité véhicules</h3>
                <div className="space-y-1">
                  {p.compatibilities.slice(0, 3).map((compat: any, i: number) => (
                    <div key={i} className="text-sm text-blue-800">
                      {compat.brand} {compat.model}
                      {compat.yearStart && ` (${compat.yearStart}${compat.yearEnd ? '-' + compat.yearEnd : '+'})`}
                    </div>
                  ))}
                  {p.compatibilities.length > 3 && (
                    <p className="text-sm text-blue-600">+{p.compatibilities.length - 3} autres véhicules</p>
                  )}
                </div>
              </div>
            )}

            {/* Quantity & Order */}
            {p.stock > 0 && (
              <div className="flex gap-3 mb-4">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 text-lg font-medium"
                  >
                    −
                  </button>
                  <span className="px-4 py-3 font-medium min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(p.stock, quantity + 1))}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 text-lg font-medium"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleOrder}
                  disabled={ordering}
                  className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {ordering ? 'Commande...' : 'Commander'}
                </button>
              </div>
            )}

            <button
              onClick={handleContact}
              className="w-full py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Contacter le vendeur
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2 space-y-6">
            {p.description && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{p.description}</p>
              </div>
            )}

            {p.specifications && Object.keys(p.specifications).length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Caractéristiques</h2>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(p.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">{key}</span>
                      <span className="font-medium text-gray-900 text-sm">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Boutique Card */}
          {p.boutique && (
            <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendeur</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {p.boutique.logoUrl ? (
                    <img src={p.boutique.logoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">🏪</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{p.boutique.name}</p>
                    {p.boutique.isVerified && <Shield className="w-4 h-4 text-green-500" />}
                  </div>
                  {p.boutique.quartier && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {p.boutique.quartier}
                    </div>
                  )}
                </div>
              </div>

              {p.boutique.ratingCount > 0 && (
                <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-50 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-900">{Number(p.boutique.ratingAverage).toFixed(1)}</span>
                  <span className="text-gray-500 text-sm">({p.boutique.ratingCount} avis)</span>
                </div>
              )}

              {p.boutique.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${p.boutique.phone}`} className="hover:text-blue-600">{p.boutique.phone}</a>
                </div>
              )}

              <Link
                href={`/boutiques/${p.boutique.id}`}
                className="mt-4 w-full py-2.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                Voir la boutique
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

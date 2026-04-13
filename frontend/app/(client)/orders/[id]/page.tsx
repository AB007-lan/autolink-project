'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Clock, CheckCircle, XCircle, Truck, Package,
  MapPin, Phone, CreditCard, MessageSquare
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../../../../lib/api';
import { formatPrice } from '../../../../lib/utils';
import { useAuthStore } from '../../../../lib/auth-store';
import { Header } from '../../../../components/layout/Header';
import { Footer } from '../../../../components/layout/Footer';

const STATUS_STEPS = [
  { key: 'pending',    label: 'Commande reçue',    icon: Clock },
  { key: 'confirmed',  label: 'Confirmée',          icon: CheckCircle },
  { key: 'processing', label: 'En préparation',     icon: Package },
  { key: 'shipped',    label: 'Expédiée',           icon: Truck },
  { key: 'delivered',  label: 'Livrée',             icon: CheckCircle },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:    { label: 'En attente',    color: 'text-yellow-600 bg-yellow-100' },
  confirmed:  { label: 'Confirmée',    color: 'text-blue-600 bg-blue-100' },
  processing: { label: 'En traitement', color: 'text-purple-600 bg-purple-100' },
  shipped:    { label: 'Expédiée',     color: 'text-orange-600 bg-orange-100' },
  delivered:  { label: 'Livrée',       color: 'text-green-600 bg-green-100' },
  cancelled:  { label: 'Annulée',      color: 'text-red-600 bg-red-100' },
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated]);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOne(id),
    enabled: !!id && isAuthenticated,
  });

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="h-48 bg-gray-200 rounded-2xl mb-4" />
          <div className="h-32 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Commande introuvable</h2>
          <Link href="/orders" className="text-blue-600 hover:underline">
            Retour à mes commandes
          </Link>
        </div>
      </div>
    );
  }

  const sc = STATUS_CONFIG[(order as any).status] ?? STATUS_CONFIG.pending;
  const isCancelled = (order as any).status === 'cancelled';
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === (order as any).status);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à mes commandes
        </Link>

        {/* Order header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Commande #{(order as any).id?.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Passée le{' '}
                {new Date((order as any).createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${sc.color}`}>
              {sc.label}
            </span>
          </div>

          {/* Progress tracker */}
          {!isCancelled && (
            <div className="mt-6">
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
                <div
                  className="absolute top-5 left-0 h-0.5 bg-blue-600 z-0 transition-all duration-500"
                  style={{
                    width: currentStepIndex >= 0
                      ? `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`
                      : '0%',
                  }}
                />

                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const StepIcon = step.icon;
                  return (
                    <div key={step.key} className="flex flex-col items-center z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isDone
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                      >
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <p className={`text-xs mt-2 text-center max-w-16 ${isDone ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">Cette commande a été annulée.</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Products */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:col-span-2">
            <h2 className="font-semibold text-gray-900 mb-4">Articles commandés</h2>
            <div className="space-y-3">
              {((order as any).items ?? []).map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 py-2">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    {item.product?.thumbnailUrl ? (
                      <img src={item.product.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🔧</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                    >
                      {item.product?.name ?? 'Produit'}
                    </Link>
                    <p className="text-sm text-gray-500">
                      Quantité : {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                    {item.product?.condition && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.product.condition === 'new'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {item.product.condition === 'new' ? 'Neuf' : 'Occasion'}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-gray-900 flex-shrink-0">
                    {formatPrice(item.quantity * item.unitPrice)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Sous-total</span>
                <span>{formatPrice((order as any).totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Livraison</span>
                <span>À convenir avec la boutique</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
                <span>Total</span>
                <span>{formatPrice((order as any).totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Boutique info */}
          {(order as any).boutique && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Boutique</h2>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center overflow-hidden">
                  {(order as any).boutique.logoUrl ? (
                    <img src={(order as any).boutique.logoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">🏪</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{(order as any).boutique.name}</p>
                  {(order as any).boutique.quartier && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {(order as any).boutique.quartier}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/boutiques/${(order as any).boutiqueId}`}
                  className="flex-1 text-center py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Voir la boutique
                </Link>
                <Link
                  href={`/messaging?boutiqueId=${(order as any).boutiqueId}`}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contacter
                </Link>
              </div>
            </div>
          )}

          {/* Delivery & Payment */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Livraison & Paiement</h2>
            <div className="space-y-3">
              {(order as any).deliveryAddress && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Adresse de livraison</p>
                    <p className="text-gray-900">{(order as any).deliveryAddress}</p>
                  </div>
                </div>
              )}
              {(order as any).deliveryPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Téléphone</p>
                    <p className="text-gray-900">{(order as any).deliveryPhone}</p>
                  </div>
                </div>
              )}
              {(order as any).paymentMethod && (
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Mode de paiement</p>
                    <p className="text-gray-900 capitalize">{(order as any).paymentMethod}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Statut paiement</p>
                  <p className={`font-medium ${
                    (order as any).paymentStatus === 'paid'
                      ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {(order as any).paymentStatus === 'paid' ? 'Payé' : 'En attente'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {(order as any).notes && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-2">Notes</h2>
            <p className="text-gray-600 text-sm">{(order as any).notes}</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

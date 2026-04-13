'use client';

import { useEffect, useState } from 'react';
import { Store, Phone, Mail, MapPin, Clock, Camera, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boutiquesApi, uploadFile } from '../../../lib/api';
import { useAuthStore } from '../../../lib/auth-store';
import { toast } from 'sonner';

const QUARTIERS = [
  'Tevragh-Zeina', 'Ksar', 'Sebkha', 'El Mina', 'Arafat',
  'Toujounine', 'Dar Naim', 'Riyad', 'Teyarett'
];

const OPEN_DAYS = [
  { key: 'Dim', label: 'Dimanche' },
  { key: 'Lun', label: 'Lundi' },
  { key: 'Mar', label: 'Mardi' },
  { key: 'Mer', label: 'Mercredi' },
  { key: 'Jeu', label: 'Jeudi' },
  { key: 'Ven', label: 'Vendredi' },
  { key: 'Sam', label: 'Samedi' },
];

export default function BoutiqueProfilePage() {
  const { isAuthenticated } = useAuthStore();
  const qc = useQueryClient();
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const { data: boutique, isLoading } = useQuery({
    queryKey: ['my-boutique'],
    queryFn: () => boutiquesApi.getMy(),
    enabled: isAuthenticated,
  });

  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    quartier: '',
    opensAt: '08:00',
    closesAt: '18:00',
    openDays: [] as string[],
    tradeRegister: '',
    nif: '',
  });

  useEffect(() => {
    if (boutique) {
      const b = boutique as any;
      setForm({
        name: b.name ?? '',
        description: b.description ?? '',
        phone: b.phone ?? '',
        email: b.email ?? '',
        address: b.address ?? '',
        quartier: b.quartier ?? '',
        opensAt: b.opensAt ?? '08:00',
        closesAt: b.closesAt ?? '18:00',
        openDays: b.openDays ?? [],
        tradeRegister: b.tradeRegister ?? '',
        nif: b.nif ?? '',
      });
    }
  }, [boutique]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => boutiquesApi.update((boutique as any)?.id, data),
    onSuccess: () => {
      toast.success('Boutique mise à jour');
      qc.invalidateQueries({ queryKey: ['my-boutique'] });
    },
    onError: (err: any) => toast.error(err?.message || 'Erreur'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const toggleDay = (day: string) => {
    setForm((p) => ({
      ...p,
      openDays: p.openDays.includes(day)
        ? p.openDays.filter((d) => d !== day)
        : [...p.openDays, day],
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const url = await uploadFile(file, 'boutiques');
      await boutiquesApi.update((boutique as any)?.id, { logoUrl: url });
      toast.success('Logo mis à jour');
      qc.invalidateQueries({ queryKey: ['my-boutique'] });
    } catch {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  const b = boutique as any;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-32 border border-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ma boutique</h1>
        <p className="text-gray-500 mt-1">Gérer les informations de votre boutique</p>
      </div>

      {/* Status Banner */}
      {b?.status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Boutique en attente de validation</p>
            <p className="text-sm text-yellow-700 mt-0.5">
              Votre boutique est en cours de vérification par notre équipe. Cela prend généralement 24-48h.
            </p>
          </div>
        </div>
      )}
      {b?.status === 'verified' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-green-800 font-medium">Boutique vérifiée et active</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Logo */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Logo de la boutique</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center overflow-hidden border border-gray-200">
              {b?.logoUrl
                ? <img src={b.logoUrl} alt="" className="w-full h-full object-cover" />
                : <span className="text-3xl">🏪</span>
              }
              <label className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-2xl ${uploadingLogo ? 'opacity-100' : ''}`}>
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                />
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{b?.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">Cliquez sur le logo pour le modifier</p>
              <p className="text-xs text-gray-400">PNG, JPG, max 5MB</p>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Store className="w-4 h-4" />
            Informations générales
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la boutique <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Décrivez votre boutique, vos spécialités..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                Téléphone
              </label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+222 XXXX XXXX"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Quartier
              </label>
              <select
                name="quartier"
                value={form.quartier}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Sélectionner...</option>
                {QUARTIERS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                placeholder="Rue, N°..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Hours */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Horaires d'ouverture
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ouverture</label>
              <input
                name="opensAt"
                type="time"
                value={form.opensAt}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fermeture</label>
              <input
                name="closesAt"
                type="time"
                value={form.closesAt}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jours d'ouverture</label>
            <div className="flex flex-wrap gap-2">
              {OPEN_DAYS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleDay(key)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                    form.openDays.includes(key)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Informations légales</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registre de commerce</label>
              <input
                name="tradeRegister"
                type="text"
                value={form.tradeRegister}
                onChange={handleChange}
                placeholder="N° RC"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIF</label>
              <input
                name="nif"
                type="text"
                value={form.nif}
                onChange={handleChange}
                placeholder="Numéro d'identification fiscale"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pb-6">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            <Save className="w-4 h-4" />
            {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}

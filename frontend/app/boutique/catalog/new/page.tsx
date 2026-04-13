'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Upload, X, Plus, Save, Package, Car
} from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { productsApi, uploadFile } from '../../../../lib/api';
import { useAuthStore } from '../../../../lib/auth-store';
import { toast } from 'sonner';

const COMPATIBLE_BRANDS = [
  'Toyota', 'Nissan', 'Hyundai', 'Kia', 'Mercedes', 'BMW',
  'Renault', 'Peugeot', 'Ford', 'Mitsubishi', 'Suzuki', 'Honda',
  'Volkswagen', 'Opel', 'Citroën', 'Mazda'
];

const CONDITIONS = [
  { value: 'new', label: 'Neuf', desc: 'Pièce neuve, jamais utilisée' },
  { value: 'used', label: 'Occasion', desc: "Pièce d'occasion en bon état" },
  { value: 'refurbished', label: 'Reconditionné', desc: 'Pièce révisée et remise en état' },
];

export default function NewBoutiqueProductPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '1',
    condition: 'new',
    categoryId: '',
    reference: '',
    compatibleBrands: [] as string[],
    compatibleModels: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
    enabled: isAuthenticated,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const toggleBrand = (brand: string) => {
    setForm((p) => ({
      ...p,
      compatibleBrands: p.compatibleBrands.includes(brand)
        ? p.compatibleBrands.filter((b) => b !== brand)
        : [...p.compatibleBrands, brand],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images autorisées');
      return;
    }
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadFile(f, 'products')));
      setImages((prev) => [...prev, ...urls]);
      toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} téléchargée${urls.length > 1 ? 's' : ''}`);
    } catch {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Le nom est obligatoire'); return; }
    if (!form.price || Number(form.price) <= 0) { toast.error('Le prix doit être supérieur à 0'); return; }

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: Number(form.price),
        stock: Number(form.stock),
        condition: form.condition,
        categoryId: form.categoryId || undefined,
        reference: form.reference.trim() || undefined,
        images,
        thumbnailUrl: images[0] || undefined,
      };

      const created: any = await productsApi.create(payload);

      if (form.compatibleBrands.length > 0 && created?.id) {
        const models = form.compatibleModels
          .split(',')
          .map((m) => m.trim())
          .filter(Boolean);
        for (const brand of form.compatibleBrands) {
          await productsApi
            .addCompatibility(created.id, { brand, model: models[0], yearStart: undefined, yearEnd: undefined })
            .catch(() => {});
        }
      }

      toast.success('Produit créé ! En attente de validation admin.');
      router.push('/boutique/catalog');
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/boutique/catalog"
          className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau produit</h1>
          <p className="text-gray-500 text-sm mt-0.5">Ajouter une pièce à votre catalogue</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Photos du produit
            <span className="text-xs text-gray-400 font-normal">(max 5)</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {images.map((url, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                <img src={url} alt="" className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 text-center text-xs bg-blue-600 text-white py-0.5">
                    Principale
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setImages((p) => p.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className={`w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors ${uploading ? 'opacity-50' : ''}`}>
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">{uploading ? 'Upload...' : 'Ajouter'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Informations
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la pièce <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Ex : Filtre à huile Toyota Corolla"
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
              placeholder="Décrivez la pièce, ses caractéristiques..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (MRU) <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                type="number"
                required
                min="1"
                step="1"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Sélectionner...</option>
                {Array.isArray(categories) && categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
              <input
                name="reference"
                type="text"
                value={form.reference}
                onChange={handleChange}
                placeholder="Ex : 90915-YZZD4"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">État</label>
            <div className="grid grid-cols-3 gap-3">
              {CONDITIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, condition: c.value }))}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.condition === c.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`text-sm font-medium ${form.condition === c.value ? 'text-blue-700' : 'text-gray-700'}`}>
                    {c.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Compatibility */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Car className="w-4 h-4" />
            Compatibilité véhicules
            <span className="text-xs text-gray-400 font-normal">(optionnel)</span>
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marques compatibles</label>
            <div className="flex flex-wrap gap-2">
              {COMPATIBLE_BRANDS.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => toggleBrand(brand)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    form.compatibleBrands.includes(brand)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modèles spécifiques</label>
            <input
              name="compatibleModels"
              type="text"
              value={form.compatibleModels}
              onChange={handleChange}
              placeholder="Ex : Corolla, Camry, Yaris (séparés par des virgules)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pb-6">
          <Link
            href="/boutique/catalog"
            className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-center transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Publication...' : 'Publier le produit'}
          </button>
        </div>
      </form>
    </div>
  );
}

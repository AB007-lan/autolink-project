'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Car, User, Mail, Phone, Lock, Store } from 'lucide-react';
import { authApi } from '../../../lib/api';
import { useAuthStore } from '../../../lib/auth-store';
import { toast } from 'sonner';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const defaultRole = searchParams.get('role') === 'boutique' ? 'boutique' : 'client';
  const [role, setRole] = useState<'client' | 'boutique'>(defaultRole as any);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    boutiqueName: '',
    boutiqueQuartier: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Le mot de passe doit comporter au moins 8 caractères');
      return;
    }
    setIsLoading(true);
    try {
      const payload: any = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role,
      };
      if (role === 'boutique') {
        payload.boutiqueName = form.boutiqueName;
        payload.boutiqueQuartier = form.boutiqueQuartier;
      }
      const res: any = await authApi.register(payload);
      setAuth(res.user, res.accessToken, res.refreshToken);
      toast.success('Inscription réussie ! Bienvenue sur Autolink');
      if (res.user.role === 'boutique') router.push('/boutique/dashboard');
      else router.push('/');
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  const quartiers = [
    'Tevragh-Zeina', 'Ksar', 'Toujounine', 'Dar Naim', 'Arafat',
    'El Mina', 'Sebkha', 'Teyarett', 'Riadh',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
            <p className="text-gray-500 mt-1">Rejoignez la communauté Autolink</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                role === 'client'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4" />
              Je suis acheteur
            </button>
            <button
              type="button"
              onClick={() => setRole('boutique')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                role === 'boutique'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Store className="w-4 h-4" />
              J'ai une boutique
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="firstName"
                      type="text"
                      required
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Prénom"
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Nom"
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+222 XX XX XX XX"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              {/* Boutique fields */}
              {role === 'boutique' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la boutique</label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="boutiqueName"
                        type="text"
                        required
                        value={form.boutiqueName}
                        onChange={handleChange}
                        placeholder="Ma Boutique Auto"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
                    <select
                      name="boutiqueQuartier"
                      value={form.boutiqueQuartier}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Sélectionner un quartier</option>
                      {quartiers.map((q) => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 caractères"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? 'Inscription en cours...' : "Créer mon compte"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-blue-600 font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

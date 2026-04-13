'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Car, Loader2, User, Store } from 'lucide-react';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../lib/auth-store';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'client';
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: defaultRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
        role: form.role,
      }) as any;
      setAuth(res.user, res.accessToken, res.refreshToken);
      toast.success(`Compte créé avec succès ! Bienvenue, ${res.user.firstName} !`);

      if (res.user.role === 'boutique') router.push('/boutique/dashboard');
      else router.push('/');
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <Car className="w-7 h-7 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-white">Autolink</span>
          </Link>
          <p className="text-blue-200 mt-2">Créer votre compte</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Inscription</h1>
          <p className="text-gray-500 text-sm mb-6">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">Se connecter</Link>
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'client' })}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${form.role === 'client' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.role === 'client' ? 'bg-blue-500' : 'bg-gray-100'}`}>
                <User className={`w-5 h-5 ${form.role === 'client' ? 'text-white' : 'text-gray-500'}`} />
              </div>
              <div className="text-left">
                <p className={`font-semibold text-sm ${form.role === 'client' ? 'text-blue-700' : 'text-gray-700'}`}>Client</p>
                <p className="text-xs text-gray-400">Acheter des pièces</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'boutique' })}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${form.role === 'boutique' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.role === 'boutique' ? 'bg-blue-500' : 'bg-gray-100'}`}>
                <Store className={`w-5 h-5 ${form.role === 'boutique' ? 'text-white' : 'text-gray-500'}`} />
              </div>
              <div className="text-left">
                <p className={`font-semibold text-sm ${form.role === 'boutique' ? 'text-blue-700' : 'text-gray-700'}`}>Boutique</p>
                <p className="text-xs text-gray-400">Vendre des pièces</p>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="Mohamed"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Ould Ahmed"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="votre@email.mr"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone (optionnel)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+222 XX XX XX XX"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimum 8 caractères"
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer le mot de passe</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Création...</> : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-400 text-center">
            En créant un compte, vous acceptez nos{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">Conditions d'utilisation</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

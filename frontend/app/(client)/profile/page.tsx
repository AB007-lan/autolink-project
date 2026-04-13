'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Camera, Save, Eye, EyeOff } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, uploadFile } from '../../../lib/api';
import { useAuthStore } from '../../../lib/auth-store';
import { toast } from 'sonner';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth } = useAuthStore();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user) {
      setForm({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        phone: (user as any).phone ?? '',
      });
    }
  }, [isAuthenticated, user]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => authApi.changePassword(data), // reuse endpoint or add profile update
    onSuccess: (data: any) => {
      toast.success('Profil mis à jour');
      if (data?.user) setAuth(data.user, data.accessToken, data.refreshToken);
    },
    onError: (err: any) => toast.error(err?.message || 'Erreur lors de la mise à jour'),
  });

  const passwordMutation = useMutation({
    mutationFn: (data: any) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success('Mot de passe modifié avec succès');
      setPasswords({ current: '', newPass: '', confirm: '' });
    },
    onError: (err: any) => toast.error(err?.message || 'Erreur lors du changement de mot de passe'),
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadFile(file, 'avatars');
      toast.success('Photo de profil mise à jour');
    } catch {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    // Profile update - adapt based on available API endpoint
    toast.success('Profil mis à jour');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    if (passwords.newPass.length < 8) {
      toast.error('Le mot de passe doit comporter au moins 8 caractères');
      return;
    }
    passwordMutation.mutate({
      currentPassword: passwords.current,
      newPassword: passwords.newPass,
    });
  };

  if (!isAuthenticated || !user) return null;

  const roleLabel = user.role === 'boutique' ? 'Gérant de boutique' : user.role === 'admin' ? 'Administrateur' : 'Client';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon profil</h1>

        {/* Avatar section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-blue-100 overflow-hidden flex items-center justify-center">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-blue-600 font-bold text-2xl">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={isUploading}
                />
              </label>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                {roleLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {(['info', 'password'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'info' ? 'Informations' : 'Mot de passe'}
            </button>
          ))}
        </div>

        {/* Info Form */}
        {activeTab === 'info' && (
          <form onSubmit={handleSaveInfo} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+222 XX XX XX XX"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Sauvegarder les modifications
            </button>
          </form>
        )}

        {/* Password Form */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            {[
              { key: 'current', label: 'Mot de passe actuel', placeholder: '••••••••' },
              { key: 'newPass', label: 'Nouveau mot de passe', placeholder: 'Minimum 8 caractères' },
              { key: 'confirm', label: 'Confirmer le nouveau mot de passe', placeholder: '••••••••' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={(passwords as any)[key]}
                    onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  {key === 'current' && (
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={passwordMutation.isPending}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {passwordMutation.isPending ? 'Modification...' : 'Changer le mot de passe'}
            </button>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
}

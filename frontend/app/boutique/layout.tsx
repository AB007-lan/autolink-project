'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/auth-store';
import { Header } from '../../components/layout/Header';
import { BoutiqueSidebar } from '../../components/boutique/BoutiqueSidebar';

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'boutique' && user.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) return null;
  if (user.role !== 'boutique' && user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <BoutiqueSidebar />
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/auth-store';

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((s) => s.initAuth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initAuth();
    setMounted(true);
  }, [initAuth]);

  if (!mounted) return null;
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <title>Autolink - Pièces Auto Mauritanie</title>
        <meta name="description" content="Marketplace de pièces détachées automobiles en Mauritanie" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <AuthInitializer>
            {children}
          </AuthInitializer>
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
      </body>
    </html>
  );
}

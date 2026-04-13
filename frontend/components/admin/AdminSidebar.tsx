'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3, Store, Package, ShoppingBag, Users, Settings, Shield, ArrowLeft
} from 'lucide-react';

const links = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: BarChart3 },
  { href: '/admin/boutiques', label: 'Boutiques', icon: Store },
  { href: '/admin/products', label: 'Produits', icon: Package },
  { href: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm p-3 h-fit sticky top-24">
      <div className="flex items-center gap-2 px-3 py-2 mb-3">
        <Shield className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-gray-900">Administration</span>
      </div>
      <nav className="space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour au site
        </Link>
      </div>
    </aside>
  );
}

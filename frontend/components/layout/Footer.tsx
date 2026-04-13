import Link from 'next/link';
import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-white">Autolink</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              La marketplace de référence pour les pièces détachées automobiles en Mauritanie.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Acheteurs */}
          <div>
            <h3 className="text-white font-semibold mb-4">Pour les clients</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/search" className="hover:text-white transition-colors">Rechercher une pièce</Link></li>
              <li><Link href="/boutiques" className="hover:text-white transition-colors">Trouver une boutique</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">Mes commandes</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Créer un compte</Link></li>
            </ul>
          </div>

          {/* Vendeurs */}
          <div>
            <h3 className="text-white font-semibold mb-4">Pour les boutiques</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register?role=boutique" className="hover:text-white transition-colors">Ouvrir ma boutique</Link></li>
              <li><Link href="/boutique/dashboard" className="hover:text-white transition-colors">Tableau de bord</Link></li>
              <li><Link href="/boutique/catalog" className="hover:text-white transition-colors">Gérer le catalogue</Link></li>
              <li><Link href="/boutique/orders" className="hover:text-white transition-colors">Commandes reçues</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Nouakchott, Mauritanie</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>+222 XX XX XX XX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>support@autolink.mr</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Autolink - SMART MS. Tous droits réservés.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Confidentialité</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Conditions d'utilisation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

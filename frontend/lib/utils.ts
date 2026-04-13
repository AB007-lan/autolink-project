import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-MR', {
    style: 'currency',
    currency: 'MRU',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy', { locale: fr });
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr });
}

export function formatRelativeDate(date: string | Date): string {
  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
    locale: fr,
  });
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En cours',
    ready: 'Prête',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
    refunded: 'Remboursée',
    active: 'Actif',
    inactive: 'Inactif',
    suspended: 'Suspendu',
    verified: 'Vérifiée',
    rejected: 'Rejetée',
    new: 'Neuf',
    used: 'Occasion',
    reconditioned: 'Reconditionné',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    ready: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-cyan-100 text-cyan-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    new: 'bg-green-100 text-green-800',
    used: 'bg-orange-100 text-orange-800',
    reconditioned: 'bg-blue-100 text-blue-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.substring(0, n) + '...' : str;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur: ajouter le token JWT aux requêtes
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Intercepteur: gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

// API Auth
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  changePassword: (data: any) => api.post('/auth/change-password', data),
};

// API Boutiques
export const boutiquesApi = {
  getAll: (params?: any) => api.get('/boutiques', { params }),
  getOne: (id: string) => api.get(`/boutiques/${id}`),
  getMy: () => api.get('/boutiques/my'),
  getMyStats: () => api.get('/boutiques/my/stats'),
  create: (data: any) => api.post('/boutiques', data),
  update: (id: string, data: any) => api.put(`/boutiques/${id}`, data),
  verify: (id: string, data: any) => api.patch(`/boutiques/${id}/verify`, data),
};

// API Produits
export const productsApi = {
  getAll: (params?: any) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getCategories: () => api.get('/products/categories'),
  // Utilise le module vehicles dédié pour les marques/modèles
  getVehicleBrands: () => api.get('/vehicles/brands'),
  getVehicleModels: (brand: string) => api.get('/vehicles/models', { params: { brand } }),
  getVehicleYears: () => api.get('/vehicles/years'),
  getOne: (id: string) => api.get(`/products/${id}`),
  // Produits de ma boutique (endpoint dédié)
  getMyBoutiqueProducts: (params?: any) => api.get('/products/my', { params }),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  addCompatibility: (id: string, data: any) => api.post(`/products/${id}/compatibility`, data),
  approve: (id: string, approve: boolean) => api.patch(`/products/${id}/approve`, { approve }),
};

// API Commandes
export const ordersApi = {
  create: (data: any) => api.post('/orders', data),
  getMyOrders: (params?: any) => api.get('/orders/my', { params }),
  getBoutiqueOrders: (params?: any) => api.get('/orders/boutique', { params }),
  getAdminOrders: (params?: any) => api.get('/orders/admin', { params }),
  getAdminStats: () => api.get('/orders/admin/stats'),
  getOne: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, data: any) => api.patch(`/orders/${id}/status`, data),
};

// API Paiements
export const paymentsApi = {
  initiate: (data: any) => api.post('/payments/initiate', data),
  confirm: (data: any) => api.post('/payments/confirm', data),
};

// API Messagerie
export const messagingApi = {
  getConversations: () => api.get('/messaging/conversations'),
  getMessages: (conversationId: string, params?: any) =>
    api.get(`/messaging/conversations/${conversationId}/messages`, { params }),
  sendMessage: (data: any) => api.post('/messaging/send', data),
  getUnreadCount: () => api.get('/messaging/unread'),
  markAsRead: (conversationId: string) =>
    api.post(`/messaging/conversations/${conversationId}/read`),
};

// API Admin
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUserStatus: (id: string, status: string) =>
    api.patch(`/admin/users/${id}/status`, { status }),
  // Boutiques
  getAllBoutiques: (params?: any) => api.get('/admin/boutiques', { params }),
  getPendingBoutiques: () => api.get('/admin/boutiques/pending'),
  getTopBoutiques: () => api.get('/admin/boutiques/top'),
  // Products
  getAllProducts: (params?: any) => api.get('/admin/products', { params }),
  getPendingProducts: (params?: any) => api.get('/admin/products/pending', { params }),
  // Orders
  getAllOrders: (params?: any) => api.get('/admin/orders', { params }),
  // Revenue
  getRevenueByMonth: () => api.get('/admin/revenue/monthly'),
};

// Upload
export const uploadFile = async (file: File, folder: string = 'products'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/storage/upload?folder=${folder}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return (response as any).url;
};

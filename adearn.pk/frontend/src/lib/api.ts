import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('access_token='))
    ?.split('=')[1]
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { 
          withCredentials: true 
        })
        return api(originalRequest)
      } catch (refreshError) {
        // Redirect to login if refresh fails
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string; totpCode?: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: { name: string; email: string; phone: string; password: string }) =>
    api.post('/auth/register', userData),
  
  logout: () => api.post('/auth/logout'),
  
  setup2FA: () => api.post('/auth/2fa/setup'),
  
  verify2FA: (code: string) => api.post('/auth/2fa/verify', { code }),
}

// User API
export const userAPI = {
  getDashboardStats: () => api.get('/user/dashboard'),
  
  getEarningsHistory: (days: number = 30) => 
    api.get(`/user/earnings?days=${days}`),
  
  submitPaymentProof: (formData: FormData) =>
    api.post('/user/payment/proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  requestWithdrawal: (data: { amount: number; method: string; accountInfo: string }) =>
    api.post('/user/withdrawal', data),
  
  getAds: () => api.get('/user/ads'),
}

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  
  getUsers: (page: number = 1, search: string = '') =>
    api.get(`/admin/users?page=${page}&search=${search}`),
  
  approvePayment: (paymentId: string) =>
    api.post(`/admin/payments/${paymentId}/approve`),
  
  rejectPayment: (paymentId: string, reason: string) =>
    api.post(`/admin/payments/${paymentId}/reject`, { reason }),
  
  manageAd: (adData: any) => api.post('/admin/ads', adData),
  
  processWithdrawal: (withdrawalId: string) =>
    api.post(`/admin/withdrawals/${withdrawalId}/process`),
}
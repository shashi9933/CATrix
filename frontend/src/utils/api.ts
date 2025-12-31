import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== AUTH API =====
export const authAPI = {
  register: (email: string, password: string, name?: string) =>
    api.post('/auth/register', { email, password, name }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  verify: () =>
    api.post('/auth/verify')
};

// ===== USERS API =====
export const userAPI = {
  getProfile: () =>
    api.get('/users/profile'),
  
  updateProfile: (name: string) =>
    api.patch('/users/profile', { name })
};

// ===== TESTS API =====
export const testAPI = {
  getAll: () =>
    api.get('/tests'),
  
  getById: (id: string) =>
    api.get(`/tests/${id}`),
  
  create: (testData: any) =>
    api.post('/tests', testData),
  
  // Aliases for compatibility
  createAttempt: (testId: string) =>
    api.post('/test-attempts', { testId }),
  
  recordAnswer: (attemptId: string, questionId: string, answer: string) =>
    api.post(`/test-attempts/${attemptId}/answers`, { questionId, answer })
};

// ===== TEST ATTEMPTS API =====
export const testAttemptAPI = {
  create: (testId: string) =>
    api.post('/test-attempts', { testId }),
  
  getById: (id: string) =>
    api.get(`/test-attempts/${id}`),
  
  update: (id: string, data: any) =>
    api.patch(`/test-attempts/${id}`, data),
  
  getUserAttempts: () =>
    api.get('/test-attempts/user/attempts')
};

// ===== ANALYTICS API =====
export const analyticsAPI = {
  get: () =>
    api.get('/analytics'),
  
  getUserAnalytics: () =>
    api.get('/analytics/user'),
  
  getRecentTests: () =>
    api.get('/analytics/recent-tests'),
  
  update: (data: any) =>
    api.post('/analytics/update', data)
};

// ===== COLLEGES API =====
export const collegeAPI = {
  getAll: () =>
    api.get('/colleges'),
  
  getById: (id: string) =>
    api.get(`/colleges/${id}`),
  
  create: (collegeData: any) =>
    api.post('/colleges', collegeData)
};

// ===== STUDY MATERIALS API =====
export const studyMaterialAPI = {
  getAll: () =>
    api.get('/study-materials'),
  
  getBySection: (section: string) =>
    api.get(`/study-materials/section/${section}`),
  
  getById: (id: string) =>
    api.get(`/study-materials/${id}`),
  
  create: (materialData: any) =>
    api.post('/study-materials', materialData)
};

export default api;

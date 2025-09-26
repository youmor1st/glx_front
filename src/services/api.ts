import axios from 'axios';

const API_BASE_URL ='https://dem-p8gd.onrender.com/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TelegramLoginData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  auth_date: number;
  hash: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: string;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  telegram_id?: number;
  role: string;
  class_name?: string;
  points?: number;
  status?: string;
}

export interface AdminCreate {
  username: string;
  password: string;
  first_name: string;
  last_name?: string;
  telegram_id?: number | null;
}

export interface AdminOut {
  id: number;
  username: string;
  first_name: string;
  last_name?: string;
  telegram_id?: number;
}

export interface UsernameCheckResponse {
  username: string;
  available: boolean;
  message: string;
}

export interface PointHistory {
  id: number;
  points_changed: number;
  comment: string;
  rule_name: string;
  created_at: string;
}

export const authAPI = {
  // Login with username and password
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // Login with Telegram data
  telegramLogin: async (telegramData: TelegramLoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/telegram-login', telegramData);
    return response.data;
  },

  // Get current user info
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Register admin
  registerAdmin: async (adminData: AdminCreate): Promise<AdminOut> => {
    const response = await api.post('/admin/register', adminData);
    return response.data;
  },

  // Check username availability
  checkUsernameAvailability: async (username: string): Promise<UsernameCheckResponse> => {
    const response = await api.get(`/admin/check-username/${username}`);
    return response.data;
  },
};

export const studentsAPI = {
  // Get student profile by ID (public)
  getProfile: async (id: number): Promise<User> => {
    const response = await api.get(`/students/profile/${id}`);
    return response.data;
  },

  // Get my profile (authenticated)
  getMyProfile: async (): Promise<User> => {
    const response = await api.get('/students/me');
    return response.data;
  },

  // Get point history
  getHistory: async (): Promise<PointHistory[]> => {
    const response = await api.get('/students/me/history');
    return response.data;
  },

  // Get leaderboard
  getLeaderboard: async (): Promise<User[]> => {
    const response = await api.get('/students/leaderboard');
    return response.data;
  },
};

export const teachersAPI = {
  // Get classes
  getClasses: async (): Promise<string[]> => {
    const response = await api.get('/teachers/classes');
    return response.data;
  },

  // Get students by class
  getStudentsByClass: async (className: string): Promise<User[]> => {
    const response = await api.get(`/teachers/students/by_class/${encodeURIComponent(className)}`);
    return response.data;
  },

  // Search students
  searchStudents: async (query: string): Promise<User[]> => {
    const response = await api.get(`/teachers/students/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Assign points
  assignPoints: async (data: {
    student_id: number;
    rule_id: number;
    comment: string;
  }): Promise<{
    success: boolean;
    message: string;
    points_changed: number;
    new_total: number;
  }> => {
    const response = await api.post('/teachers/points/assign', data);
    return response.data;
  },
};

export default api;

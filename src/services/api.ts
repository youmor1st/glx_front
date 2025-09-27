import axios from 'axios';
import { extractTelegramIdFromInitData } from '@/utils/telegram';

const API_BASE_URL = 'https://dem-p8gd.onrender.com';


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
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  telegram_id: number;
  telegram_linked: boolean;
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
  // First login with username and password (binds Telegram ID)
  login: async (credentials: LoginCredentials, telegramInitData?: string): Promise<AuthResponse> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (telegramInitData) {
      headers['X-Telegram-Init-Data'] = telegramInitData;
      
      // Extract telegram_id from init data and add it to headers
      const telegramId = extractTelegramIdFromInitData(telegramInitData);
      if (telegramId) {
        headers['X-Telegram-User-Id'] = telegramId.toString();
      }
    }
    
    const response = await api.post('/auth/login', credentials, { headers });
    return response.data;
  },

  // Quick login with Telegram Init Data only
  telegramLogin: async (initData: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/telegram-login', {
      init_data: initData
    });
    return response.data;
  },

  // Alternative login with form data (for backward compatibility)
  loginForm: async (credentials: LoginCredentials, telegramInitData?: string): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    
    console.log('🔍 API - Telegram Init Data received:', telegramInitData);
    
    if (telegramInitData) {
      headers['X-Telegram-Init-Data'] = telegramInitData;
      
      // Extract telegram_id from init data and add it to headers
      const telegramId = extractTelegramIdFromInitData(telegramInitData);
      console.log('🔍 API - Extracted Telegram ID:', telegramId);
      
      if (telegramId) {
        headers['X-Telegram-User-Id'] = telegramId.toString();
        headers['telegram_id'] = telegramId.toString();
        headers['X-Telegram-ID'] = telegramId.toString();
        
        // Also add telegram_id to form data
        formData.append('telegram_id', telegramId.toString());
      }
    }
    
    console.log('🔍 API - Headers being sent:', headers);
    console.log('🔍 API - Form data being sent:', formData.toString());
    
    const response = await api.post('/auth/login', formData, { headers });
    return response.data;
  },

  // Get current user info
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Register admin
  registerAdmin: async (adminData: AdminCreate): Promise<AdminOut> => {
    console.log('Registering admin with data:', adminData);
    console.log('Full URL:', `${API_BASE_URL}/admin-registration/register`);
    const response = await api.post('/admin-registration/register', adminData);
    return response.data;
  },

  // Check username availability
  checkUsernameAvailability: async (username: string): Promise<UsernameCheckResponse> => {
    console.log('Checking username availability:', username);
    console.log('Full URL:', `${API_BASE_URL}/admin-registration/check-username/${username}`);
    const response = await api.get(`/admin-registration/check-username/${username}`);
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

export interface StudentCreate {
  username: string;
  password: string;
  first_name: string;
  last_name?: string;
  class_name: string;
  telegram_id?: number | null;
}

export interface StudentProfile {
  id: number;
  username: string;
  first_name: string;
  last_name?: string;
  class_name: string;
  telegram_id?: number;
  points: number;
  status: string;
  created_at: string;
}

export const adminAPI = {
  // Get all students (admin view)
  getAllStudents: async (): Promise<User[]> => {
    const response = await api.get('/admin/students');
    return response.data;
  },

  // Get students by class
  getStudentsByClass: async (className: string): Promise<User[]> => {
    const response = await api.get(`/admin/students/class/${encodeURIComponent(className)}`);
    return response.data;
  },

  // Get all classes
  getClasses: async (): Promise<string[]> => {
    const response = await api.get('/admin/classes');
    return response.data;
  },

  // Get student profile by ID
  getStudentProfile: async (id: number): Promise<StudentProfile> => {
    const response = await api.get(`/admin/students/${id}`);
    return response.data;
  },

  // Create new student
  createStudent: async (studentData: StudentCreate): Promise<StudentProfile> => {
    const response = await api.post('/admin/students', studentData);
    return response.data;
  },

  // Update student
  updateStudent: async (id: number, studentData: Partial<StudentCreate>): Promise<StudentProfile> => {
    const response = await api.put(`/admin/students/${id}`, studentData);
    return response.data;
  },

  // Delete student
  deleteStudent: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/admin/students/${id}`);
    return response.data;
  },

  // Get all point history (admin view)
  getAllPointHistory: async (): Promise<PointHistory[]> => {
    const response = await api.get('/admin/point-history');
    return response.data;
  },

  // Get leaderboard (admin view)
  getLeaderboard: async (): Promise<User[]> => {
    const response = await api.get('/admin/leaderboard');
    return response.data;
  },

  // Get statistics
  getStatistics: async (): Promise<{
    total_students: number;
    total_points: number;
    active_students: number;
  }> => {
    const response = await api.get('/admin/statistics');
    return response.data;
  },
};

export default api;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, type User, type AuthResponse } from '@/services/api';
import { getTelegramInitData, isTelegramWebApp } from '@/utils/telegram';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  telegramId: number | null;
  isTelegramAvailable: boolean;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  quickLogin: () => Promise<void>;
  telegramLogin: () => Promise<void>;
  loginJson: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  setTelegramId: (id: number | null) => void;
  checkTelegramAvailability: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      telegramId: null,
      isTelegramAvailable: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Get Telegram Init Data if available
          const telegramInitData = getTelegramInitData();
          const isTelegram = isTelegramWebApp();
          
          console.log('🔍 === LOGIN DEBUG INFO ===');
          console.log('🔍 Username:', username);
          console.log('🔍 Password:', password);
          console.log('🔍 Is Telegram WebApp:', isTelegram);
          console.log('🔍 Telegram Init Data:', telegramInitData);
          console.log('🔍 Telegram Init Data length:', telegramInitData?.length || 0);
          console.log('🔍 Window.Telegram:', typeof window !== 'undefined' && window.Telegram ? 'Available' : 'Not available');
          console.log('🔍 Window.Telegram.WebApp:', typeof window !== 'undefined' && window.Telegram?.WebApp ? 'Available' : 'Not available');
          if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            console.log('🔍 Window.Telegram.WebApp.initData:', window.Telegram.WebApp.initData);
          }
          console.log('🔍 === END DEBUG INFO ===');
          
          // Use appropriate endpoint based on Telegram availability
          let response: AuthResponse;
          if (telegramInitData && isTelegram) {
            // Use regular login with Telegram data
            console.log('🔍 Using /auth/login with Telegram data');
            response = await authAPI.login(
              { username, password },
              telegramInitData
            );
          } else {
            // Use JSON login without Telegram data
            console.log('⚠️ No Telegram data available - using /auth/login-json');
            response = await authAPI.loginJson({ username, password });
          }
          
          // Store token
          localStorage.setItem('access_token', response.access_token);
          
          // Create user object from response
          const user: User = {
            id: response.user_id,
            username: response.username,
            first_name: response.first_name,
            last_name: response.last_name,
            telegram_id: response.telegram_id,
            role: response.role,
          };
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            telegramId: response.telegram_id,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Ошибка входа',
            isLoading: false,
          });
          throw error;
        }
      },

      quickLogin: async () => {
        set({ isLoading: true, error: null });
        try {
          const telegramInitData = getTelegramInitData();
          if (!telegramInitData) {
            throw new Error('Telegram Init Data не доступен для быстрого входа');
          }
          
          const response: AuthResponse = await authAPI.quickLogin(telegramInitData);
          
          // Store token
          localStorage.setItem('access_token', response.access_token);
          
          // Create user object from response
          const user: User = {
            id: response.user_id,
            username: response.username,
            first_name: response.first_name,
            last_name: response.last_name,
            telegram_id: response.telegram_id,
            role: response.role,
          };
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            telegramId: response.telegram_id,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Ошибка быстрого входа',
            isLoading: false,
          });
          throw error;
        }
      },

      telegramLogin: async () => {
        set({ isLoading: true, error: null });
        try {
          const initData = getTelegramInitData();
          if (!initData) {
            throw new Error('Telegram Init Data не доступен');
          }
          
          const response: AuthResponse = await authAPI.telegramLogin(initData);
          
          // Store token
          localStorage.setItem('access_token', response.access_token);
          
          // Create user object from response
          const user: User = {
            id: response.user_id,
            username: response.username,
            first_name: response.first_name,
            last_name: response.last_name,
            telegram_id: response.telegram_id,
            role: response.role,
          };
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            telegramId: response.telegram_id,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Ошибка входа через Telegram',
            isLoading: false,
          });
          throw error;
        }
      },

      loginJson: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response: AuthResponse = await authAPI.loginJson({ username, password });
          
          // Store token
          localStorage.setItem('access_token', response.access_token);
          
          // Create user object from response
          const user: User = {
            id: response.user_id,
            username: response.username,
            first_name: response.first_name,
            last_name: response.last_name,
            telegram_id: response.telegram_id,
            role: response.role,
          };
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            telegramId: response.telegram_id,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Ошибка входа',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          telegramId: null,
        });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      setTelegramId: (id: number | null) => {
        set({ telegramId: id });
      },

      checkTelegramAvailability: () => {
        const available = isTelegramWebApp();
        set({ isTelegramAvailable: available });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authAPI.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          localStorage.removeItem('access_token');
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

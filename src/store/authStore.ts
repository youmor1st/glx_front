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
  telegramLogin: () => Promise<void>;
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
          console.log('🔍 Telegram Init Data:', telegramInitData);
          console.log('🔍 Is Telegram WebApp available:', isTelegramWebApp());
          
          // If no Telegram data available, show warning but continue
          if (!telegramInitData) {
            console.warn('⚠️ No Telegram Init Data available - login without Telegram binding');
          }
          
          const response: AuthResponse = await authAPI.loginForm(
            { username, password },
            telegramInitData || undefined
          );
          
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

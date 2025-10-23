import { useMemo, useEffect, useState } from "react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { isMiniAppDark, retrieveLaunchParams, useSignal } from "@telegram-apps/sdk-react";
import { useAuthStore } from "@/store/authStore";
import { HomePage } from "@/components/HomePage";
import { AdminRegistration } from "@/components/AdminRegistration";
import { LoginPage } from "@/components/LoginPage";
import { LoginDemo } from "@/components/LoginDemo";
import { TelegramDebug } from "@/components/TelegramDebug";
import { StudentDashboard } from "@/components/StudentDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { initTelegramWebApp } from "@/utils/telegram";

type AppPage = 'home' | 'admin-registration' | 'login' | 'login-demo' | 'telegram-debug' | 'dashboard';

export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const isDark = useSignal(isMiniAppDark);
  const { isAuthenticated, isLoading, checkAuth, user, telegramLogin, checkTelegramAvailability } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  useEffect(() => {
    const initializeAuth = async () => {
      // Initialize Telegram WebApp
      initTelegramWebApp();
      
      // Log Telegram WebApp info for debugging
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        console.log('✅ Telegram WebApp initialized');
        console.log('✅ Telegram initData:', window.Telegram.WebApp.initData);
        console.log('✅ Telegram user:', window.Telegram.WebApp.initDataUnsafe?.user);
      }
      
      // Check Telegram availability
      checkTelegramAvailability();
      
      // First check if user is already authenticated
      await checkAuth();
      
      setIsInitialized(true);
    };
    
    initializeAuth();
  }, [checkAuth, isAuthenticated, telegramLogin, checkTelegramAvailability]);

  // Update current page based on authentication status
  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated) {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('home');
      }
    }
  }, [isAuthenticated, isInitialized]);

  const handleAdminRegistration = () => {
    setCurrentPage('admin-registration');
  };

  const handleLogin = () => {
    setCurrentPage('login');
  };

  const handleLoginDemo = () => {
    setCurrentPage('login-demo');
  };

  const handleTelegramDebug = () => {
    setCurrentPage('telegram-debug');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleLoginSuccess = () => {
    setCurrentPage('dashboard');
  };

  const handleAdminRegistrationSuccess = () => {
    setCurrentPage('login');
  };

  if (!isInitialized || isLoading) {
    return (
      <AppRoot
        appearance={isDark ? "dark" : "light"}
        platform={["macos", "ios"].includes(lp.tgWebAppPlatform) ? "ios" : "base"}
        style={{ minHeight: "100dvh", background: "#0C0B21" }}
      >
        <div
          style={{
            width: "100%",
            minHeight: "100dvh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#0C0B21",
          }}
        >
          <div style={{ color: "#FFFFFF", textAlign: "center" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid rgba(255,255,255,0.3)",
                borderTop: "3px solid #6932EB",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ margin: 0, color: "#C7C7F0" }}>Загрузка...</p>
          </div>
        </div>
      </AppRoot>
    );
  }

  return (
    <AppRoot
      appearance={isDark ? "dark" : "light"}
      platform={["macos", "ios"].includes(lp.tgWebAppPlatform) ? "ios" : "base"}
      style={{ minHeight: "100dvh", background: "#0C0B21" }}
    >
      <div
        style={{
          width: "100%",
          minHeight: "100dvh",
          display: "flex",
          justifyContent: "center",
          background: "#0C0B21",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {currentPage === 'home' && (
            <HomePage 
              onAdminRegistration={handleAdminRegistration}
              onLogin={handleLogin}
              onLoginDemo={handleLoginDemo}
              onTelegramDebug={handleTelegramDebug}
            />
          )}
          {currentPage === 'admin-registration' && (
            <AdminRegistration 
              onSuccess={handleAdminRegistrationSuccess}
              onBackToLogin={handleBackToHome}
            />
          )}
          {currentPage === 'login' && (
            <LoginPage onSuccess={handleLoginSuccess} />
          )}
          {currentPage === 'login-demo' && (
            <LoginDemo />
          )}
          {currentPage === 'telegram-debug' && (
            <TelegramDebug />
          )}
          {currentPage === 'dashboard' && (
            user?.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />
          )}
        </div>
      </div>
    </AppRoot>
  );
}

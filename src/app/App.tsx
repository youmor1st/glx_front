import { useMemo, useEffect, useState } from "react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { isMiniAppDark, retrieveLaunchParams, useSignal } from "@telegram-apps/sdk-react";
import { useAuthStore } from "@/store/authStore";
import { HomePage } from "@/components/HomePage";
import { AdminRegistration } from "@/components/AdminRegistration";
import { LoginPage } from "@/components/LoginPage";
import { StudentDashboard } from "@/components/StudentDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";

type AppPage = 'home' | 'admin-registration' | 'login' | 'dashboard';

export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const isDark = useSignal(isMiniAppDark);
  const { isAuthenticated, isLoading, checkAuth, user, setTelegramId, telegramLogin } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  useEffect(() => {
    const initializeAuth = async () => {
      // First check if user is already authenticated
      await checkAuth();
      
      // If not authenticated, try Telegram login
      if (!isAuthenticated) {
        const launchParams = retrieveLaunchParams();
        const isInTelegram = launchParams.tgWebAppData && typeof launchParams.tgWebAppData === 'string' && (launchParams.tgWebAppData as string).length > 0;
        
        if (isInTelegram && typeof launchParams.tgWebAppData === 'string') {
          try {
            const urlParams = new URLSearchParams(launchParams.tgWebAppData);
            const userParam = urlParams.get('user');
            if (userParam) {
              const telegramUser = JSON.parse(userParam);
              setTelegramId(telegramUser.id);
              
              // Try to login with Telegram
              try {
                await telegramLogin();
              } catch (error) {
                console.log('Telegram login failed, user needs to register or login manually');
              }
            }
          } catch (error) {
            console.error('Error parsing Telegram user data:', error);
          }
        }
      }
      
      setIsInitialized(true);
    };
    
    initializeAuth();
  }, [checkAuth, isAuthenticated, setTelegramId, telegramLogin]);

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
          {currentPage === 'dashboard' && (
            user?.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />
          )}
        </div>
      </div>
    </AppRoot>
  );
}

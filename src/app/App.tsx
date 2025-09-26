import { useMemo, useEffect, useState } from "react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { isMiniAppDark, retrieveLaunchParams, useSignal } from "@telegram-apps/sdk-react";
import { useAuthStore } from "@/store/authStore";
import { HomePage } from "@/components/HomePage";
import { AdminRegistration } from "@/components/AdminRegistration";
import { LoginPage } from "@/components/LoginPage";
import { StudentDashboard } from "@/components/StudentDashboard";

type AppPage = 'home' | 'admin-registration' | 'login' | 'dashboard';

export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const isDark = useSignal(isMiniAppDark);
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setIsInitialized(true);
    };
    
    initializeAuth();
  }, [checkAuth]);

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
            <StudentDashboard />
          )}
        </div>
      </div>
    </AppRoot>
  );
}

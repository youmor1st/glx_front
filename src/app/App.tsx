import { routes } from "@/app/routes";
import AuthErrorScreen from "@/features/auth/components/auth-error-screen";
import LoadingScreen from "@/features/auth/components/loading-screen";
import { useAuth } from "@/features/auth/use-auth";
import Navbar from "@/features/navigation/components/navbar";
import { RouteHandler } from "@/shared/lib/components/route-handler";
import ScrollHandler from "@/shared/lib/components/scroll-handler";

import {
  isMiniAppDark,
  retrieveLaunchParams,
  useSignal,
} from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { useMemo } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), []);

  const isDark = useSignal(isMiniAppDark);
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthErrorScreen />;
  }

  return (
    <AppRoot
      appearance={isDark ? "dark" : "light"}
      platform={["macos", "ios"].includes(lp.tgWebAppPlatform) ? "ios" : "base"}
    >
      <HashRouter>
        <ScrollHandler />
        <RouteHandler />
        <div>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} {...route} />
            ))}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
          <div id="app-portal-root" />
          <Navbar />
        </div>
      </HashRouter>
    </AppRoot>
  );
}

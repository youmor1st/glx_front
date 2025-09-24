import { useMemo } from "react";
import { AppRoot, Button, Section, Title } from "@telegram-apps/telegram-ui";
import { isMiniAppDark, retrieveLaunchParams, useSignal, postEvent } from "@telegram-apps/sdk-react";

export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const isDark = useSignal(isMiniAppDark);

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
            padding: 16,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              marginTop: 16,
              background: "linear-gradient(135deg, #1A1932 0%, #0E0D2A 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              padding: 20,
              color: "#EDEDFD",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div
                aria-hidden
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #6932EB 0%, #9266FF 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 18px rgba(146,102,255,0.35)",
                  fontSize: 22,
                }}
              >
                🚀
              </div>
              <Title style={{ margin: 0, color: "#FFFFFF" }}>Добро пожаловать</Title>
            </div>
            <p style={{ margin: "6px 0 16px", color: "#C7C7F0", lineHeight: 1.45 }}>
              Минимальное Telegram Mini App. Связь с Telegram сохранена и готова к
              использованию.
            </p>
            <Button size="l" onClick={() => postEvent("web_app_close")}>Закрыть</Button>
          </div>

          <Section style={{ marginTop: 16, background: "#121129", borderRadius: 12 }}>
            <p style={{ margin: 0, color: "#9EA0C8" }}>
              Soon project will be updated
            </p>
          </Section>
        </div>
      </div>
    </AppRoot>
  );
}

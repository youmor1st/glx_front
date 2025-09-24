// Include Telegram UI styles first to allow our code override the package CSS.
import "@telegram-apps/telegram-ui/dist/styles.css";

import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

import { App } from "@/app/App.tsx";
import { EnvUnsupported } from "@/app/EnvUnsupported.tsx";
import { init } from "@/init.ts";

import "./index.css";
import { Helmet } from "react-helmet";

// Mock the environment in case, we are outside Telegram.
import "../envs/mockEnv.ts";

const root = ReactDOM.createRoot(document.getElementById("root")!);

try {
  const launchParams = retrieveLaunchParams();
  const { tgWebAppPlatform: platform } = launchParams;
  const debug = (launchParams.tgWebAppStartParam || "").includes("platformer_debug") || import.meta.env.DEV;

  await init({
    debug,
    eruda: debug && ["ios", "android"].includes(platform),
    mockForMacOS: platform === "macos",
  }).then(() => {
    root.render(
      <StrictMode>
        <Helmet>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, viewport-fit=cover, minimum-scale=1.0, maximum-scale=1.0"
          />
        </Helmet>
        <App />
      </StrictMode>
    );
  });
} catch (e) {
  root.render(<EnvUnsupported />);
}

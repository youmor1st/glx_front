import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export function RouteHandler() {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = lp.tgWebAppStartParam;
      if (!raw) return;
      const startParams = JSON.parse(atob(raw));

      if (startParams.path === "swap") {
        const data = startParams.data;

        const query = new URLSearchParams(data).toString();

        navigate(`/swap?${query}`);
      }
    } catch (err) {
      console.warn("Invalid or missing startParam:", err);
    }
  }, [lp, navigate]);

  return null;
}

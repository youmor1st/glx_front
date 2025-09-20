import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContext {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (initData: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

const axiosClient = axios.create({
  baseURL: "https://api.owlidar.com/authservice/v1/",
});

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem("authToken");

      const response = await axiosClient.get("init-data/get-mock");
      const initData = response.data.initData;

      if (initData) {
        await login(initData);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Auth failed:", err);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (initData: string) => {
    const { data } = await axiosClient.post("/login", { initData });
    const token = data?.accessToken as string | undefined;
    const userId = data?.user.id;
    
    if (!token) throw new Error("Server did not return token");

    localStorage.setItem("userId", userId);
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

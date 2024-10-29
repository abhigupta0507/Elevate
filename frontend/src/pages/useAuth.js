import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      handleLogout();
      return false;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/users/token/refresh/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.access);
        setIsAuthenticated(true);
        return true;
      } else {
        handleLogout();
        return false;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      handleLogout();
      return false;
    }
  };

  const checkAuthToken = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setIsAuthenticated(false);
      return;
    }

    const { exp } = jwtDecode(accessToken);
    if (Date.now() >= exp * 1000) {
      const refreshed = await refreshAccessToken();
      setIsAuthenticated(refreshed);
    } else {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  useEffect(() => {
    checkAuthToken();
  }, []);

  return { isAuthenticated, checkAuthToken, handleLogout };
}

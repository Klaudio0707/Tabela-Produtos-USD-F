import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { REACT_APP_API_BACKEND } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verifica se o token é válido
  const verifyToken = async () => {
    try {
      const response = await fetch(`${REACT_APP_API_BACKEND}/auth/verify-token`, {
        method: "GET",
        credentials: "include", // Inclui cookies na requisição
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.isValid);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer logout
  const logout = () => {
    Cookies.remove("authToken");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    verifyToken(); // Verifica o token ao montar o componente
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
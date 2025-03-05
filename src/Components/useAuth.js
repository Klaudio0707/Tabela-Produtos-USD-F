import { useState, useEffect } from "react";
import axios from "axios";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BACKEND}/auth/verify-token`,
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.isValid);
      } catch{
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BACKEND}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Erro ao sair:", error);
    } finally {
      setIsAuthenticated(false); // Garantir que o estado seja atualizado
    }
  };

  return { isAuthenticated, setIsAuthenticated, logout };
};

export default useAuth;


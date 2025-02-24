import { useState, useEffect } from "react";
import axios from "axios";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Tenta autenticar automaticamente com o token no cookie
        const response = await axios.get(
          `${process.env.REACT_APP_API_BACKEND}/auth/verify-token`,
          { withCredentials: true } // Necessário para enviar cookies
        );
        setIsAuthenticated(response.data.isValid);
      } catch (error) {
        setIsAuthenticated(false); // Token inválido ou não autenticado
      }
    };
    checkAuth();
  }, []);

  return { isAuthenticated, setIsAuthenticated };
};

export default useAuth;


import { useState, useEffect } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Função para verificar se o cookie authToken existe
  const checkAuth = () => {
    const authToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (authToken) {
      setIsAuthenticated(true); // Usuário autenticado
    } else {
      setIsAuthenticated(false); // Usuário não autenticado
    }
    setLoading(false); // Finaliza o carregamento
  };

  // Função para fazer logout
  const logout = () => {
    // Remove o cookie authToken
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    setIsAuthenticated(false); // Atualiza o estado de autenticação
  };

  // Verifica a autenticação ao carregar o hook
  useEffect(() => {
    checkAuth();
  }, []);

  return { isAuthenticated, setIsAuthenticated, logout, loading };
};

export default useAuth;
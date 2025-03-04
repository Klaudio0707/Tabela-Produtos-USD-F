import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Menu = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove o token do cookie
    Cookies.remove("authToken");
    // Chama a função onLogout para atualizar o estado de isAuthenticated no App.js
    onLogout();
    // Redireciona o usuário para a página de login
    navigate("/login");
  };

  const goToPage = (page) => {
    navigate(page);
  };

  return (
    <div className="container-menu">
      <button onClick={() => goToPage("/")}>Principal</button>
      <button onClick={() => goToPage("/perfil")}>Perfil</button>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}

export default Menu;

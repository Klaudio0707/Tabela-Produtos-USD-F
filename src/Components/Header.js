import React from "react";
import "../style/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Cadastro e Conversão de Produtos</h1>
        {/* <nav className="nav">
          <a href="#form">Cadastrar Produto</a>
          <a href="#list">Lista de Produtos</a>
          <a href="#conversion">Conversão de Preços</a>
        </nav> */}
      </div>
    </header>
  );
};

export default Header;

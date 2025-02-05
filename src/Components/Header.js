import React from "react";
import "../style/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="title-header">Tabela de Produtos - R$ x USD</h1>
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

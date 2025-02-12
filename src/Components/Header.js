import React from "react";
import "../Styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="title-header">Conversão de Preços de Produtos - (R$) para (USD)</h1>
        <p className="description">
          Este sistema permite cadastrar produtos, visualizar suas informações e converter os preços de Real (R$) para Dólar (USD) com base na cotação do dia.
        </p>
      </div>
    </header>
  );
};

export default Header;

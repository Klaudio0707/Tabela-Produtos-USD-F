import React, { useState } from "react";
import { Typography } from "@mui/material";
import "../Styles/Formulario.css";

const FormularioProdutos = ({ onAddProduct }) => {
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    origin: "",
    package: "",
    currency: "BRL",
    price: "",

  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const REACT_APP_API_BACKEND = process.env.REACT_APP_API_BACKEND;

  // Função para lidar com mudanças nos campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.manufacturer || !formData.price) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Cria um novo produto com os dados formatados
    const newProduct = {
      ...formData,
      price: parseFloat(formData.price.replace(",", ".")).toFixed(
        2
      ),  
    };

    try {
      const response = await fetch(`${REACT_APP_API_BACKEND}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        onAddProduct(addedProduct);
        setFormData({
          name: "",
          manufacturer: "",
          origin: "",
          package: "",
          currency: "BRL",
          price: "",
        });
        setError("");
        setSuccessMessage("Produto salvo com sucesso!");
      } else {
        setError("Erro ao salvar produto no servidor.");
      }
    } catch (error) {
      setError("Erro na requisição. Verifique a conexão com o servidor.");
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <div className="formProducts-container">
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
        Cadastrar Produtos
      </Typography>
      <div className="warning-box">
        Este sistema permite cadastrar produtos, visualizar suas informações e
        converter os preços de Real (R$) para Dólar (USD) com base na cotação do
        dia.
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleChange}
          required
          className="input-field input-name"
        />
        <input
          name="manufacturer"
          placeholder="Fabricante"
          value={formData.manufacturer}
          onChange={handleChange}
          required
          className="input-field input-manufacturer"
        />
        <input
          name="origin"
          placeholder="Origem"
          value={formData.origin}
          onChange={handleChange}
          required
          className="input-field input-origin"
        />
        <input
          name="package"
          placeholder="Embalagem"
          value={formData.package}
          onChange={handleChange}
          required
          className="input-field input-package"
        />
        <input
          name="price"
          type="number"
          placeholder="Preço"
          value={formData.price}
          onChange={handleChange}
          required
          className="input-field input-priceInside"
        />
      
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="select-field"
        >
          <option value="BRL">Real</option>
          <option value="USD">Dólar</option>
        </select>
        <button type="submit" className="submit-button">
          Salvar Produto
        </button>
        <div className="container-msg">

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
      </form>
    </div>
  );
};

export default FormularioProdutos;

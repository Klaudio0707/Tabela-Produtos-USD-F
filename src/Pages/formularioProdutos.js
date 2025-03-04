import React, { useContext, useState } from "react";
import { ProductContext } from "../Context/ProductContext";
import "../Styles/Formulario.css";

const FormularioProdutos = () => {
  const { setProducts, setUpdateTrigger } = useContext(ProductContext);
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    origin: "",
    package: "",
    currency: "BRL",
    priceInside: "",
    priceOutside: "",
  });

  const [error, setError] = useState(""); // Estado para mensagens de erro
  const [successMessage, setSuccessMessage] = useState(""); // Estado para mensagens de sucesso
  const REACT_APP_API_BACKEND = process.env.REACT_APP_API_BACKEND;

  // Função para lidar com mudanças nos campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se os campos obrigatórios foram preenchidos
    if (!formData.name || !formData.manufacturer || !formData.priceInside) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Cria um novo produto com os dados formatados
    const newProduct = {
      ...formData,
      // Converte os preços para números com 2 casas decimais
      priceInside: parseFloat(formData.priceInside.replace(",", ".")).toFixed(2),
      priceOutside: parseFloat(formData.priceOutside.replace(",", ".")).toFixed(2),
     
    };

    try {
      const response = await fetch(`${REACT_APP_API_BACKEND}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        setUpdateTrigger((prev) => !prev); // Dispara atualização
        setFormData({
          name: "",
          manufacturer: "",
          origin: "",
          package: "",
          currency: "BRL",
          priceInside: "",
          priceOutside: "",
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
      <h3 className="title-form">Cadastrar Produto</h3>
      <div className="warning-box">
        Este sistema permite cadastrar produtos, visualizar suas informações e
        converter os preços de Real (R$) para Dólar (USD) com base na cotação do dia.
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
          name="priceInside"
          type="number"
          placeholder="Preço Dentro"
          value={formData.priceInside}
          onChange={handleChange}
          required
          className="input-field input-priceInside"
        />
        <input
          name="priceOutside"
          type="number"
          placeholder="Preço Fora"
          value={formData.priceOutside}
          onChange={handleChange}
          required
          className="input-field input-priceOutside"
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
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default FormularioProdutos;
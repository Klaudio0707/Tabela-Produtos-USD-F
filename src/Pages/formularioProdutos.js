import React, { useState } from "react";
import "../style/Formulario.css";

const FormularioProdutos = ({ onAddProduct }) => {
  const [product, setProduct] = useState({
    name: "",
    manufacturer: "",
    origin: "",
    package: "",
    currency: "BRL",
    priceInside: "",
    priceOutside: "",
    ipi: false,
    ipiRate: 0,
  });

  const [error, setError] = useState(""); // Mantendo o estado de erro
  const [successMessage, setSuccessMessage] = useState("");
  const REACT_APP_API_BACKEND = process.env.REACT_APP_API_BACKEND;


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "ipiRate" || name === "priceInside" || name === "priceOutside"
          ? value // Mantém o valor como string para permitir entrada decimal
          : value,
    }));
  };
  const handleCheckboxChange = () => {
    setProduct((prev) => ({ ...prev, ipi: !prev.ipi }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se os campos obrigatórios foram preenchidos
    if (!product.name || !product.manufacturer || !product.priceInside) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newProduct = {
      ...product,
      // Converte os preços para números com 2 casas decimais
      priceInside: parseFloat(product.priceInside.replace(",", ".")).toFixed(2),
      priceOutside: parseFloat(product.priceOutside.replace(",", ".")).toFixed(
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
        const savedProduct = await response.json();
        onAddProduct(savedProduct);
        setProduct({
          name: "",
          manufacturer: "",
          origin: "",
          package: "",
          currency: "BRL",
          priceInside: "",
          priceOutside: "",
          ipi: false,
          ipiRate: "",
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
    <form onSubmit={handleSubmit} className="form-container">
      <input
        name="name"
        placeholder="Nome"
        value={product.name}
        onChange={handleChange}
        required
        className="input-field input-name"
      />
      <input
        name="manufacturer"
        placeholder="Fabricante"
        value={product.manufacturer}
        onChange={handleChange}
        required
        className="input-field input-manufacturer"
      />
      <input
        name="origin"
        placeholder="Origem"
        value={product.origin}
        onChange={handleChange}
        required
        className="input-field input-origin"
      />
      <input
        name="package"
        placeholder="Embalagem"
        value={product.package}
        onChange={handleChange}
        required
        className="input-field input-package"
      />
      <input
        name="priceInside"
        type="number"
        placeholder="Preço Dentro"
        value={product.priceInside}
        onChange={handleChange}
        required
        className="input-field input-priceInside"
      />
      <input
        name="priceOutside"
        type="number"
        placeholder="Preço Fora"
        value={product.priceOutside}
        required
        onChange={handleChange}
        className="input-field input-priceOutside"
      />
      <select
        name="currency"
        value={product.currency}
        onChange={handleChange}
        className="select-field"
      >
        <option value="BRL">Real</option>
        <option value="USD">Dólar</option>
      </select>
      <label className="checkbox-label">
        IPI?
        <input
          type="checkbox"
          checked={product.ipi}
          onChange={handleCheckboxChange}
          className="checkbox"
        />
      </label>
      {product.ipi && (
        <input
          type="number"
          name="ipiRate"
          placeholder="%"
          value={product.ipiRate}
          onChange={handleChange}
          className="input-field-IPI"
        />
      )}
      <button type="submit" className="submit-button">
      Salvar Produto
      </button>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </form>
  );
};

export default FormularioProdutos;

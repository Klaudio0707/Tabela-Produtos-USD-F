import React, { useState } from "react";

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

  const BASE_URL = "http://localhost:5001";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "ipiRate" || name === "priceInside" || name === "priceOutside"
        ? parseFloat(value) || ""  // Converte para número, mas mantém string vazia se inválido
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
      priceInside: parseFloat(product.priceInside).toFixed(4),
      priceOutside: parseFloat(product.priceOutside).toFixed(4),
    };

    try {
      const response = await fetch(`${BASE_URL}/products`, {
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
          ipiRate: 0,
        });
        setError(""); // Limpa o erro ao salvar com sucesso
      } else {
        setError("Erro ao salvar produto no servidor.");
      }
    } catch (error) {
      setError("Erro na requisição. Verifique a conexão com o servidor.");
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nome" value={product.name} onChange={handleChange} required />
      <input
        name="manufacturer"
        placeholder="Fabricante"
        value={product.manufacturer}
        onChange={handleChange}
        required
      />
      <input name="origin" placeholder="Origem" value={product.origin} onChange={handleChange} />
      <input
        name="package"
        placeholder="Embalagem"
        value={product.package}
        onChange={handleChange}
      />
      <select name="currency" value={product.currency} onChange={handleChange}>
        <option value="BRL">Real</option>
        <option value="USD">Dólar</option>
      </select>
      <input
        name="priceInside"
        placeholder="Preço Dentro"
        value={product.priceInside}
        onChange={handleChange}
        required
      />
      <input
        name="priceOutside"
        placeholder="Preço Fora"
        value={product.priceOutside}
        onChange={handleChange}
      />
      <label>
        <input type="checkbox" checked={product.ipi} onChange={handleCheckboxChange} />
        Tem IPI
      </label>
      {product.ipi && (
        <input
          name="ipiRate"
          placeholder="Alíquota (%)"
          value={product.ipiRate}
          onChange={handleChange}
        />
      )}
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Exibindo o erro aqui */}
      <button type="submit">Salvar</button>
    </form>
  );
};

export default FormularioProdutos;

import React, { useState, useEffect } from "react";


const FormularioProdutos = ({ onAddProduct, onUpdateProduct, editingProduct }) => {
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
  const BASE_URL = "http://localhost:5001";



  useEffect(() => {
    if (editingProduct) {
      setProduct(editingProduct); // Preenche o formulário com os dados do produto em edição
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCheckboxChange = () => {
    setProduct({ ...product, ipi: !product.ipi });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingProduct) {
      // Se estiver editando, chama o método de atualização
      onUpdateProduct(product);
    } else {
      // Caso contrário, chama o método de adição
      try {
        const response = await fetch(`${BASE_URL}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });

        if (response.ok) {
          const newProduct = await response.json();
          onAddProduct(newProduct);
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
        } else {
          console.error("Erro ao adicionar produto");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nome" value={product.name} onChange={handleChange} />
      <input
        name="manufacturer"
        placeholder="Fabricante"
        value={product.manufacturer}
        onChange={handleChange}
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
      <button type="submit">{editingProduct ? "Atualizar" : "Salvar"}</button>
    </form>
  );
};

export default FormularioProdutos;

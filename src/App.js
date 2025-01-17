import React, { useState, useEffect } from 'react';
import FormularioProdutos from "./Pages/formularioProdutos";
import "./App.css";
const App = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const BASE_URL = "http://localhost:5001";

  // Função para obter os produtos do backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data); // Atualiza o estado com os produtos recebidos
      } else {
        console.error("Erro ao obter produtos");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  // Função para adicionar um novo produto à lista
  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]); // Adiciona o novo produto à lista
  };

  // Função para atualizar um produto existente
  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const response = await fetch(`${BASE_URL}/products/${updatedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedData.id ? updatedData : product
          )
        ); // Atualiza o produto na lista
        setEditingProduct(null); // Fecha o formulário de edição
      } else {
        console.error("Erro ao atualizar produto");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`${BASE_URL}/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        ); // Remove o produto da lista
      } else {
        console.error("Erro ao excluir produto");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  // Chama fetchProducts ao carregar o componente
  useEffect(() => {
    fetchProducts();
  }, []);


  return (
    <div className="App-header">
      <h1>Cadastro de Produtos</h1>
      <FormularioProdutos
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct} // Passa a função de atualização para o Formulário
        editingProduct={editingProduct} // Passa o produto em edição
      />
      <div>
        <h1>Lista de Produtos</h1>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name}
              - {product.manufacturer}
              - {product.origin}
              - {product.package}
              - {product.currency}
              - {product.priceInside}
              - {product.priceOutside}
              - {product.ipi}
              - {product.apiRate}
              <button onClick={() => setEditingProduct(product)}>Editar</button>
              <button onClick={() => handleDeleteProduct(product.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
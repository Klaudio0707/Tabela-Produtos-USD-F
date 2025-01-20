import React, { useState, useEffect } from "react";
import FormularioProdutos from "./Pages/formularioProdutos";
import ListaProdutos from "./Pages/listaProdutos";
import ConversaoPrecos from "./Pages/conversaoPrecos";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import "./App.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const BASE_URL = "http://localhost:5001";

  // Função para obter os produtos do backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Erro ao obter produtos");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };


  // Função para adicionar um novo produto
  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  // Atualizar um produto no backend
  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const response = await fetch(`${BASE_URL}/products/${updatedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
      } else {
        console.error("Erro ao atualizar produto");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  // Remover um produto do backend
  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      } else {
        console.error("Erro ao remover produto");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="App-header">
    <Header />
    <main>

      <h1>Cadastro e Conversão de Produtos</h1>
      <FormularioProdutos onAddProduct={handleAddProduct} />
      <ListaProdutos
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        />
      <ConversaoPrecos products={products} />
        </main>
        <Footer />
      
    </div>
  );
};

export default App;

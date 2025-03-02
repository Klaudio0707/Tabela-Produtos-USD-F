import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "ag-grid-community/styles/ag-theme-alpine.css"; // Tema Alpine
import FormularioProdutos from "./Pages/formularioProdutos";
import ListaProdutos from "./Pages/listaProdutos";
import ConversaoPrecos from "./Pages/conversaoPrecos";
import Login from "./Pages/login";
import Register from "./Pages/register";
import Perfil from "./Pages/perfil";
import Footer from "./Components/Footer";
import Header from "./Components/Header";

const REACT_APP_API_BACKEND = process.env.REACT_APP_API_BACKEND;

// Componente combinado para gerenciar produtos e conversão de preços
const ProdutosPage = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  return (
    <div>
      <h2>Gerenciamento de Produtos</h2>

      {/* Formulário de Produtos */}
      <FormularioProdutos
        products={products}
        onAddProduct={onAddProduct}
        onUpdateProduct={onUpdateProduct}
        onDeleteProduct={onDeleteProduct}
      />

      {/* Tabela de Produtos */}
      <ListaProdutos
        products={products}
        onAddProduct={onAddProduct}
        onUpdateProduct={onUpdateProduct}
        onDeleteProduct={onDeleteProduct}
      />

      {/* Conversão de Preços */}
      <ConversaoPrecos products={products} />
    </div>
  );
};

const App = () => {
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Estado inicial: null
  const [loading, setLoading] = useState(true); // Estado de carregamento

  // Função para buscar produtos
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${REACT_APP_API_BACKEND}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Erro ao obter produtos:", response.status);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  // Verificação de autenticação baseada no backend
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(`${REACT_APP_API_BACKEND}/auth/verify-token`, {
          method: "GET",
          credentials: "include", // Inclui cookies na requisição
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        if (data.isValid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Erro ao verificar token:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  // Funções de login e logout
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Funções para manipulação de produtos
  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const response = await fetch(
        `${REACT_APP_API_BACKEND}/products/${updatedProduct._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        }
      );
      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
          )
        );
      } else {
        console.error("Erro ao atualizar produto");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`${REACT_APP_API_BACKEND}/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
      } else {
        console.error("Erro ao remover produto");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  // Se loading estiver true, mostra o loading
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App-header">
      <Header />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={
            <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/formularioProdutos"
          element={
            isAuthenticated ? (
              <ProdutosPage
                products={products}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/perfil"
          element={
            isAuthenticated ? (
              <Perfil />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
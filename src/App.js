import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import FormularioProdutos from "./Pages/formularioProdutos";
import ListaProdutos from "./Pages/listaProdutos";
import ConversaoPrecos from "./Pages/conversaoPrecos";
import Login from "./Pages/login";
import Register from "./Pages/register";
import Perfil from "./Pages/perfil";
import ProtectedRoute from "./Components/ProtectedRoute";
import Footer from "./Components/Footer";
import Header from "./Components/Header";

const App = () => {
  const [product, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const REACT_APP_API_BACKEND = process.env.REACT_APP_API_BACKEND;

  // Função para obter os produtos do backend
  const fetchProducts = useCallback(async () => {
    console.log("Fetching products...");
    try {
      const response = await fetch(`${REACT_APP_API_BACKEND}/products`);
      if (response.ok) {
        const data = await response.json();
        console.log("Produtos recebidos:", data);
        setProducts(data);
      } else {
        console.error("Erro ao obter produtos:", response.status);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }, [REACT_APP_API_BACKEND]);

  // Adicionar produto
  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  // Atualizar produto
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

  // Remover produto
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, fetchProducts]);

  return (
    <Router>
      <div className="App-header">
        <Header />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login onLogin={() => setIsAuthenticated(true)} />}
          />
          <Route
            path="/formularioProdutos"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <div>
                  <FormularioProdutos
                    products={product}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                  <ListaProdutos products={product} 
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Perfil />
              </ProtectedRoute>
            }

          />
          <Route
            path="/conversaoPrecos"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ConversaoPrecos products={product} />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to="/formularioProdutos" replace />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;


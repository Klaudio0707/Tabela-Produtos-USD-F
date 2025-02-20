import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import FormularioProdutos from "./Pages/formularioProdutos";
import ListaProdutos from "./Pages/listaProdutos";
import ConversaoPrecos from "./Pages/conversaoPrecos";
import ProtectedRoute from "./Components/ProtectedRoute";
import Login from "./Pages/login";
import Perfil from "./Pages/perfil";
import Register from "./Pages/register";
import Footer from "./Components/Footer";
import Header from "./Components/Header";

const App = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const REACT_APP_API_BACKEND = process.env.REACT_APP_API_BACKEND;

  // Função para obter os produtos do backend
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${REACT_APP_API_BACKEND}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Erro ao obter produtos");
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
    fetchProducts();
  }, [fetchProducts]);

  return (
    <Router>
      <div className="App-header">
        <main>
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/produtos" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/produtos"
              element={
                <ProtectedRoute>
                  <>
                    <FormularioProdutos onAddProduct={handleAddProduct} />
                    <ListaProdutos
                      products={products}
                      onUpdateProduct={handleUpdateProduct}
                      onDeleteProduct={handleDeleteProduct}
                    />
                    <div className="navigation-buttons">
                      <button
                        className="btn-navigate"
                          onClick={() => navigate("/conversao-precos")}
                      >
                        Conversão de Preços
                      </button>
                      <button
                        className="btn-navigate"
                        onClick={() => navigate("/perfil")}
                      >
                        Perfil
                      </button>
                    </div>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/conversao-precos"
              element={
                <ProtectedRoute>
                  <ConversaoPrecos products={products} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FormularioProdutos from "./Pages/formularioProdutos";
import ListaProdutos from "./Pages/listaProdutos";
import ConversaoPrecos from "./Pages/conversaoPrecos";
import ProtectedRoute  from "./Components/ProtectedRoute"
import Login from "./Pages/login"
import Register from "./Pages/register";
import Footer from "./Components/Footer";
import Header from "./Components/Header";

const App = () => {
  const [products, setProducts] = useState([]);

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

  // Função para adicionar um novo produto
  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  // Atualizar um produto no backend
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

  // Remover um produto do backend
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
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/produtos"
              element={
                <ProtectedRoute>
                  <Header />
                  <>
                    <FormularioProdutos onAddProduct={handleAddProduct} />
                    <ListaProdutos
                      products={products}
                      onUpdateProduct={handleUpdateProduct}
                      onDeleteProduct={handleDeleteProduct}
                    />
                    <ConversaoPrecos products={products} />
                  </>
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
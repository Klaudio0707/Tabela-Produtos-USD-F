import React, { useState, useEffect } from "react";
import "ag-grid-community/styles/ag-theme-alpine.css"; // Tema Alpine
import FormularioProdutos from "./Pages/formularioProdutos";
import ListaProdutos from "./Pages/listaProdutos";
import ConversaoPrecos from "./Pages/conversaoPrecos";
import Footer from "./Components/Footer";
import Header from "./Components/Header";

const REACT_APP_API_BACKEND = process.env.REACT_APP_API_BACKEND;

const ProdutosPage = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  return (
    <div>
      <FormularioProdutos
        products={products}
        onAddProduct={onAddProduct}
        onUpdateProduct={onUpdateProduct}
        onDeleteProduct={onDeleteProduct}
      />

      <ListaProdutos
        products={products}
        onAddProduct={onAddProduct}
        onUpdateProduct={onUpdateProduct}
        onDeleteProduct={onDeleteProduct}
      />
      <ConversaoPrecos products={products} />
    </div>
  );
};

const App = () => {
  const [products, setProducts] = useState([]);

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

  // Buscar produtos ao carregar o componente
  useEffect(() => {
    fetchProducts();
  }, []);

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

  return (
    <div>
      <Header />
      <ProdutosPage
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
      />
      <Footer />
    </div>
  );
};

export default App;

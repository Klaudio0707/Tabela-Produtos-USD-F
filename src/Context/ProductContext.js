import React, { createContext, useState, useCallback } from "react";

// Cria o contexto
export const ProductContext = createContext();

// Define o Provider
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BACKEND}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Erro ao obter produtos:", response.status);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }, []);
  
  const value = {
    products,
    setProducts,
    updateTrigger,
    setUpdateTrigger,
    fetchProducts, 
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

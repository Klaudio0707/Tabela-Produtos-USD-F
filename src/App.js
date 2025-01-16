import React, { useState } from 'react';
import FormularioProdutos from './Pages/formularioProdutos';
import ListaProdutos from './Pages/listaProdutos';

import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  console.log(products);
  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };
  return (
    <div className="App">
      <header className="App-header">
      <h1>Gerenciamento de Produtos</h1>
      <FormularioProdutos  onProductAdded={handleAddProduct} />
      <ListaProdutos  products={products} />
      </header>
    </div>
  );
}

export default App;
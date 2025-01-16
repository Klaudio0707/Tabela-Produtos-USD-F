import React, { useState } from 'react';
import FormularioProdutos from './Pages/formularioProdutos';
import ListaProdutos from './Pages/listaProdutos';

import './App.css';

function App() {
  const [products, setProducts] = useState([]);

  const handleProductAdded = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };
  return (
    <div className="App">
      <header className="App-header">
      <h1>Gerenciamento de Produtos</h1>
      <FormularioProdutos  onProductAdded={handleProductAdded} />
      <ListaProdutos  products={products} />
      </header>
    </div>
  );
}

export default App;
import React from "react";

const ListaProdutos = ({ products, onUpdateProduct, onDeleteProduct }) => {
  const handleUpdateClick = (product) => {
    const updatedProduct = { ...product, name: prompt("Novo nome:", product.name) || product.name };
    onUpdateProduct(updatedProduct);
  };

  const handleDeleteClick = (id) => {
    
      onDeleteProduct(id);
    
  };

  return (
    <div>
      <h1>Lista de Produtos</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.manufacturer} - {product.origin} - {product.package} -{" "}
            {product.currency} - {product.priceInside} - {product.priceOutside} - {product.ipi ? "Com IPI" : "Sem IPI"}
            <button onClick={() => handleUpdateClick(product)}>Editar</button>
            <button onClick={() => handleDeleteClick(product.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaProdutos;

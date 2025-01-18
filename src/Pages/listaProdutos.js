import React, { useState } from "react";

const ListaProdutos = ({ products, onUpdateProduct, onDeleteProduct }) => {
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setEditedProduct({ ...product }); // Carrega os dados do produto no estado de edição
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditedProduct(null);
  };

  const handleSaveEdit = () => {
    onUpdateProduct(editedProduct); // Chama o callback com os dados editados
    setEditingProductId(null);
    setEditedProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteClick = (id) => {
    onDeleteProduct(id);
  };

  return (
    <div>
      <h1>Lista de Produtos</h1>
      <ul>
        {products.map((product) =>
          editingProductId === product.id ? (
            <li key={product.id}>
              <input
                name="name"
                value={editedProduct.name}
                onChange={handleChange}
              />
              <input
                name="manufacturer"
                value={editedProduct.manufacturer}
                onChange={handleChange}
              />
              <input
                name="origin"
                value={editedProduct.origin}
                onChange={handleChange}
              />
              <input
                name="package"
                value={editedProduct.package}
                onChange={handleChange}
              />
              <input
                name="priceInside"
                value={editedProduct.priceInside}
                onChange={handleChange}
              />
              <input
                name="priceOutside"
                value={editedProduct.priceOutside}
                onChange={handleChange}
              />
              <select
                name="currency"
                value={editedProduct.currency}
                onChange={handleChange}
              >
                <option value="BRL">Real</option>
                <option value="USD">Dólar</option>
              </select>
              <label>
                <input
                  type="checkbox"
                  name="ipi"
                  checked={editedProduct.ipi}
                  onChange={(e) =>
                    setEditedProduct((prev) => ({
                      ...prev,
                      ipi: e.target.checked,
                    }))
                  }
                />
                Tem IPI
              </label>
              {editedProduct.ipi && (
                <input
                  name="ipiRate"
                  value={editedProduct.ipiRate}
                  onChange={handleChange}
                />
              )}
              <button onClick={handleSaveEdit}>Salvar</button>
              <button onClick={handleCancelEdit}>Cancelar</button>
            </li>
          ) : (
            <li key={product.id}>
              {product.name} - {product.manufacturer} - {product.origin} -{" "}
              {product.package} - {product.currency} - {product.priceInside} -{" "}
              {product.priceOutside} - {product.ipi ? "Com IPI" : "Sem IPI"}
              <button onClick={() => handleEditClick(product)}>Editar</button>
              <button onClick={() => handleDeleteClick(product.id)}>
                Remover
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default ListaProdutos;

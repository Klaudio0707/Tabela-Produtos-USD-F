import React, { useState } from "react";
import "../style/Lista.css";

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
    <div className="lista-container">
      <h1>Lista de Produtos</h1>
      <table className="product-table">
        <thead>
          <tr className="th-titulo">
            <th>Nome</th>
            <th>Fabricante</th>
            <th>Origem</th>
            <th>Embalagem</th>
            <th>Moeda</th>
            <th>Preço Dentro</th>
            <th>Preço Fora</th>
            <th>IPI</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) =>
            editingProductId === product.id ? (
              <tr key={product.id} className="input-lista" >
                <td>
                  <input
                    name="name"
                    value={editedProduct.name}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    name="manufacturer"
                    value={editedProduct.manufacturer}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    name="origin"
                    value={editedProduct.origin}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    name="package"
                    value={editedProduct.package}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <select
                    name="currency"
                    value={editedProduct.currency}
                    onChange={handleChange}
                  >
                    <option value="BRL">Real</option>
                    <option value="USD">Dólar</option>
                  </select>
                </td>
                <td>
                  <input
                    name="priceInside"
                    value={editedProduct.priceInside}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    name="priceOutside"
                    value={editedProduct.priceOutside}
                    onChange={handleChange}
                  />
                </td>
                <td>
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
                    {editedProduct.ipi && (
                      <input
                        name="ipiRate"
                        value={editedProduct.ipiRate}
                        onChange={handleChange}
                      />
                    )}
                  </label>
                </td>
                <td>
                  <button onClick={handleSaveEdit}>Salvar</button>
                  <button onClick={handleCancelEdit}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={product.id} className="tr-lista">
                <td>{product.name}</td>
                <td>{product.manufacturer}</td>
                <td>{product.origin}</td>
                <td>{product.package}</td>
                <td>{product.currency}</td>
                <td>{product.priceInside}</td>
                <td>{product.priceOutside}</td>
                <td>{product.ipi ? `Sim (${product.ipiRate}%)` : "Não"}</td>
                <td>
                  <button onClick={() => handleEditClick(product)}>Editar</button>
                  <button onClick={() => handleDeleteClick(product.id)}>Remover    </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaProdutos;

  
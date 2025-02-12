import React, { useState } from "react";
import "../Styles/Lista.css";
import { RefreshCw, Trash2, Save } from "lucide-react";
const ListaProdutos = ({ products, onUpdateProduct, onDeleteProduct }) => {
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setEditedProduct({ ...product }); // Carrega os dados do produto no estado de edição
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditedProduct({});

  };

  const handleSaveEdit = () => {
    onUpdateProduct(editedProduct); // Chama o callback com os dados editados
    setEditingProductId(null);
    setEditedProduct({});
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
      <h1>Produtos Cadastrados</h1>
      <p className="description-table-list">Os preços para dentro e fora do estado podem variar devido às diferenças na tributação e encargos fiscais.</p>
      <table className="product-table-list">
        <thead>
          <tr className="th-titulo">
            <th className="th-nome">Nome</th>
            <th className="th-fabricante">Fabricante</th>
            <th className="th-origem">Origem</th>
            <th className="th-embalagem">Embalagem</th>
            <th className="th-moeda">Moeda</th>
            <th className="th-preco-dentro">Preço Dentro</th>
            <th className="th-preco-fora">Preço Fora</th>
            <th className="th-ipi">IPI</th>
            <th className="th-acoes">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) =>
            editingProductId === product._id ? (
              <tr key={product._id} className="input-lista">
                <td className="td-nome" data-label="Nome">
                  <input
                    className="input-edit"
                    name="name"
                    value={editedProduct.name}
                    onChange={handleChange}
                    placeholder="Nome"
                  />
                </td>
                <td className="td-fabricante" data-label="Fabricante">
                  <input
                    className="input-edit"
                    name="manufacturer"
                    value={editedProduct.manufacturer}
                    onChange={handleChange}
                    placeholder="Fabricante"
                  />
                </td>
                <td className="td-origem" data-label="Origem">
                  <input
                    className="input-edit"
                    name="origin"
                    value={editedProduct.origin}
                    onChange={handleChange}
                    placeholder="Origem"
                  />
                </td>
                <td className="td-embalagem" data-label="Embalagem">
                  <input
                    className="input-edit"
                    name="package"
                    value={editedProduct.package}
                    onChange={handleChange}
                    placeholder="Embalagem"
                  />
                </td>
                <td className="td-moeda" data-label="Moeda">
                  <select
                    className="input-edit-select"
                    name="currency"
                    value={editedProduct.currency}
                    onChange={handleChange}
                  >
                    <option value="BRL">Real</option>
                    <option value="USD">Dólar</option>
                  </select>
                </td>
                <td className="td-preco-dentro" data-label="Preço Dentro">
                  <input
                    className="input-edit"
                    name="priceInside"
                    value={String(editedProduct.priceInside).replace(",", ".")}
                    onChange={(e) => {
                      const value = e.target.value.replace(",", "."); // Troca vírgula por ponto
                      setEditedProduct((prev) => ({ ...prev, priceInside: value }));
                    }}
                    placeholder="Preço Dentro"
                  />
                </td>

                <td className="td-preco-fora" data-label="Preço Fora">
                  <input
                    className="input-edit"
                    name="priceOutside"
                    value={String(editedProduct.priceOutside).replace(",", ".")}
                    onChange={(e) => {
                      const value = e.target.value.replace(",", "."); // Troca vírgula por ponto
                      setEditedProduct((prev) => ({ ...prev, priceOutside: value }));
                    }}
                    placeholder="Preço Fora"
                  />
                </td>

                <td className="td-ipi" data-label="IPI">
                  <label className="checkbox-edit">
                    <input
                      className="checkbox-list"
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
                        className="input-edit-ipi"
                        name="ipiRate"
                        value={String(editedProduct.ipiRate).replace(",", ".")}
                        onChange={(e) => {
                          const value = e.target.value.replace(",", "."); // Troca vírgula por ponto
                          setEditedProduct((prev) => ({ ...prev, ipiRate: value }));
                        }}
                        placeholder="%"
                      />
                    )}
                  </label>
                </td>
                <td className="td-acoes" data-label="Ações">
                  <button onClick={handleSaveEdit}> <Save size={9} /></button>
                  <button onClick={handleCancelEdit}> <Trash2 size={9} /></button>
                </td>
              </tr>
            ) : (
              <tr key={product._id} className="tr-lista">
                <td className="td-nome" data-label="Nome">{product.name}</td>
                <td className="td-fabricante" data-label="Fabricante">{product.manufacturer}</td>
                <td className="td-origem" data-label="Origem">{product.origin}</td>
                <td className="td-embalagem" data-label="Embalagem">{product.package}</td>
                <td className="td-moeda" data-label="Moeda">{product.currency}</td>
                <td className="td-preco-dentro" data-label="Preço Dentro">{parseFloat(product.priceInside).toFixed(2)}</td>
                <td className="td-preco-fora" data-label="Preço Fora">{parseFloat(product.priceOutside).toFixed(2)}</td>
                <td className="td-ipi" data-label="IPI">
                  {product.ipi ? `Sim ${product.ipiRate}%` : "Não"}
                </td>
                <td className="td-acoes" data-label="Ações">
                  <button className="btn-list" onClick={() => handleEditClick(product)}>
                    <RefreshCw size={10} /></button>
                  <button className="btn-list" onClick={() => handleDeleteClick(product._id)}>
                    <Trash2 size={10} />
                  </button>
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

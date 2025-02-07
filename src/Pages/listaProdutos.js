import React, { useState } from "react";
import "../style/Lista.css";
import { RefreshCw, Trash2, Save} from "lucide-react";
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
            editingProductId === product._id ? (
              <tr key={product._id} className="input-lista">
                <td data-label="Nome">
                  <input
                    name="name"
                    value={editedProduct.name}
                    onChange={handleChange}
                    placeholder="Nome"
                  />
                </td>
                <td data-label="Fabricante">
                  <input
                    name="manufacturer"
                    value={editedProduct.manufacturer}
                    onChange={handleChange}
                    placeholder="Fabricante"
                  />
                </td>
                <td data-label="Origem">
                  <input
                    name="origin"
                    value={editedProduct.origin}
                    onChange={handleChange}
                    placeholder="Origem"
                  />
                </td>
                <td data-label="Embalagem">
                  <input
                    name="package"
                    value={editedProduct.package}
                    onChange={handleChange}
                    placeholder="Embalagem"
                  />
                </td>
                <td data-label="Moeda">
                  <select
                    name="currency"
                    value={editedProduct.currency}
                    onChange={handleChange}
                  >
                    <option value="BRL">Real</option>
                    <option value="USD">Dólar</option>
                  </select>
                </td>
                <td data-label="Preço Dentro">
                  <input
                    name="priceInside"
                    value={String(editedProduct.priceInside).replace(",", ".")} 
                    onChange={(e) => {
                      const value = e.target.value.replace(",", "."); // Troca vírgula por ponto
                      setEditedProduct((prev) => ({ ...prev, priceInside: value }));
                    }}
                    placeholder="Preço Dentro"
                  />
                </td>

                <td data-label="Preço Fora">
                  <input
                    name="priceOutside"
                    value={String(editedProduct.priceOutside).replace(",", ".")} 
                    onChange={(e) => {
                      const value = e.target.value.replace(",", "."); // Troca vírgula por ponto
                      setEditedProduct((prev) => ({ ...prev, priceOutside: value }));
                    }}
                    placeholder="Preço Fora"
                  />
                </td>

                <td data-label="IPI">
                  <label className="checkbox-container">
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
                        name="ipiRate"
                        value={String(editedProduct.ipiRate).replace(",", ".")} 
                        onChange={(e) => {
                          const value = e.target.value.replace(",", "."); // Troca vírgula por ponto
                          setEditedProduct((prev) => ({ ...prev, ipiRate: value }));
                        }}
                        placeholder="IPI Rate"
                      />
                    )}
                  </label>
                </td>
                <td data-label="Ações">
                  <button onClick={handleSaveEdit}> <Save size={9} /></button>
                  <button onClick={handleCancelEdit}> <RefreshCw size={9}/></button>
                </td>
              </tr>
            ) : (
              <tr key={product._id} className="tr-lista">
                <td data-label="Nome">{product.name}</td>
                <td data-label="Fabricante">{product.manufacturer}</td>
                <td data-label="Origem">{product.origin}</td>
                <td data-label="Embalagem">{product.package}</td>
                <td data-label="Moeda">{product.currency}</td>
                <td data-label="Preço Dentro">{parseFloat(product.priceInside).toFixed(2)}</td>
                <td data-label="Preço Fora">{parseFloat(product.priceOutside).toFixed(2)}</td>
                <td data-label="IPI" className="td-ipi">
                  {product.ipi ? `Sim ${product.ipiRate}%` : "Não"}
                </td>
                <td data-label="Ações">
                  <button className="btn-list" onClick={() => handleEditClick(product)}>
                    <RefreshCw size={9} /></button>
                  <button className="btn-list" onClick={() => handleDeleteClick(product._id)}>
                    <Trash2 size={9} />
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

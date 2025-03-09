import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Autocomplete } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import "../Styles/Lista.css";

const ListaProdutos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [editedProducts, setEditedProducts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BACKEND}/products`
        );
        if (!response.ok) throw new Error("Erro ao buscar produtos.");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtra os produtos com base no texto de busca
  const filteredProducts = products.filter((product) =>
    Object.values(product).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  if (loading) {
    return <div>Carregando...</div>;
  }

  const handleEditClick = (id) => {
    const productToEdit = products.find((product) => product._id === id);
    setEditingProductId(id);

    setEditedProducts((prev) => ({
      ...prev,
      [id]: { ...productToEdit },
    }));
  };

  // Função para salvar as alterações
  const handleSaveClick = async (id) => {
    try {
      const updatedProduct = editedProducts[id];
      const response = await fetch(
        `${process.env.REACT_APP_API_BACKEND}/products/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        }
      );
      if (!response.ok) throw new Error("Erro ao atualizar produto.");
      const data = await response.json();

      setProducts((prevProducts) =>
        prevProducts.map((product) => (product._id === id ? data : product))
      );
      setEditingProductId(null); // Sai do modo de edição
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleCancelClick = () => {
    setEditingProductId(null);
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BACKEND}/products/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Erro ao excluir produto.");

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  return (
    <div className="container-Lista">
      <Box sx={{ mb: 2, textAlign: "center" }} className="container-Box">
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          Lista de Produtos
        </Typography>
        <Autocomplete
          options={products.map((product) => product.name)}
          value={searchText}
          onInputChange={(e, value) => setSearchText(value)}
          renderInput={(params) => (
            <TextField {...params} label="Filtrar Produto" />
          )}
          sx={{
            mb: 2,
            width: "13rem",
            fontSize: "0.7rem",
            textAlign: "center",
          }}
        />
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <table className="product-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Fabricante</th>
                <th>Origem</th>
                <th>Embalagem</th>
                <th>Moeda</th>
                <th>Preço Dentro</th>
                <th>Preço Fora</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    {editingProductId === product._id ? (
                      <input
                        type="text"
                        value={
                          editedProducts[product._id]?.name || product.name
                        }
                        onChange={(e) =>
                          setEditedProducts({
                            ...editedProducts,
                            [product._id]: {
                              ...editedProducts[product._id],
                              name: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td>
                    {editingProductId === product._id ? (
                      <input
                        type="text"
                        value={
                          editedProducts[product._id]?.manufacturer ||
                          product.manufacturer
                        }
                        onChange={(e) =>
                          setEditedProducts({
                            ...editedProducts,
                            [product._id]: {
                              ...editedProducts[product._id],
                              manufacturer: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      product.manufacturer
                    )}
                  </td>
                  <td>
                    {editingProductId === product._id ? (
                      <input
                        type="text"
                        value={
                          editedProducts[product._id]?.origin || product.origin
                        }
                        onChange={(e) =>
                          setEditedProducts({
                            ...editedProducts,
                            [product._id]: {
                              ...editedProducts[product._id],
                              origin: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      product.origin
                    )}
                  </td>
                  <td>
                    {editingProductId === product._id ? (
                      <input
                        type="text"
                        value={
                          editedProducts[product._id]?.package ||
                          product.package
                        }
                        onChange={(e) =>
                          setEditedProducts({
                            ...editedProducts,
                            [product._id]: {
                              ...editedProducts[product._id],
                              package: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      product.package
                    )}
                  </td>
                  <td>
                    {editingProductId === product._id ? (
                      <select
                        value={
                          editedProducts[product._id]?.currency ||
                          product.currency
                        }
                        onChange={(e) =>
                          setEditedProducts({
                            ...editedProducts,
                            [product._id]: {
                              ...editedProducts[product._id],
                              currency: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="BRL">BRL</option>
                        <option value="USD">USD</option>
                      </select>
                    ) : (
                      product.currency
                    )}
                  </td>
                  <td>
                    {editingProductId === product._id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={
                          editedProducts[product._id]?.priceInside ||
                          product.priceInside
                        }
                        onChange={(e) =>
                          setEditedProducts({
                            ...editedProducts,
                            [product._id]: {
                              ...editedProducts[product._id],
                              priceInside: parseFloat(e.target.value),
                            },
                          })
                        }
                      />
                    ) : (
                      product.priceInside
                    )}
                  </td>
                  <td>
                    {editingProductId === product._id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={
                          editedProducts[product._id]?.priceOutside ||
                          product.priceOutside
                        }
                        onChange={(e) =>
                          setEditedProducts({
                            ...editedProducts,
                            [product._id]: {
                              ...editedProducts[product._id],
                              priceOutside: parseFloat(e.target.value),
                            },
                          })
                        }
                      />
                    ) : (
                      product.priceOutside
                    )}
                  </td>
                  <td>
                    {editingProductId === product._id ? (
                      <>
                        <button
                          className="icon-btn save-btn"
                          onClick={() => handleSaveClick(product._id)}
                          title="Salvar"
                        >
                          <SaveIcon />
                        </button>
                        <button
                          className="icon-btn cancel-btn"
                          onClick={handleCancelClick}
                          title="Cancelar"
                        >
                          <CancelIcon />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="icon-btn edit-btn"
                          onClick={() => handleEditClick(product._id)}
                          title="Editar"
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="icon-btn delete-btn"
                          onClick={() => handleDeleteClick(product._id)}
                          title="Excluir"
                        >
                          <DeleteIcon />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </div>
  );
};

export default ListaProdutos;

import React, { useContext, useState, useEffect, useCallback } from "react";
import { DataGrid, GridRowModes, GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Typography, TextField, Autocomplete } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { ProductContext } from "../Context/ProductContext"; // Importa o contexto
import "../Styles/Lista.css";

const ListaProdutos = () => {
  const { products, fetchProducts, setProducts, updateTrigger } =
    useContext(ProductContext); // Usa o contexto
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [rowModesModel, setRowModesModel] = useState({});

  // Função para buscar produtos (com useCallback)
  const fetchData = useCallback(async () => {
    try {
      await fetchProducts(); // Usa a função do contexto para buscar produtos
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  // Busca os produtos ao montar o componente ou quando `updateTrigger` mudar
  useEffect(() => {
    fetchData();
  }, [fetchData, updateTrigger]);

  // Função para atualizar um produto (com useCallback)
  const processRowUpdate = useCallback(async (newRow) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BACKEND}/products/${newRow._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRow),
        }
      );
      if (!response.ok) throw new Error("Erro ao atualizar produto.");
      const updatedProduct = await response.json();

      // Atualiza o estado global no contexto
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );

      return updatedProduct;
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      return newRow;
    }
  }, [setProducts]);

  // Função para excluir um produto (com useCallback)
  const handleDeleteClick = useCallback(
    (id) => async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BACKEND}/products/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          // Remove o produto do estado global no contexto
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== id)
          );
        } else {
          console.error("Erro ao excluir:", response.status);
        }
      } catch (error) {
        console.error("Erro ao excluir:", error);
      }
    },
    [setProducts]
  );

  // Filtra os produtos com base no texto de busca
  const filteredProducts = products.filter((product) =>
    Object.values(product).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  // Definição das colunas da tabela
  const columns = [
    {
      field: "name",
      headerName: "Nome",
      flex: 1,
      editable: true,
      minWidth: 50,
    },
    {
      field: "manufacturer",
      headerName: "Fabricante",
      flex: 1,
      editable: true,
      minWidth: 50,
    },
    {
      field: "origin",
      headerName: "Origem",
      flex: 1,
      editable: true,
      minWidth: 50,
    },
    {
      field: "package",
      headerName: "Embalagem",
      flex: 1,
      editable: true,
      minWidth:50,
    },
    { field: "currency", headerName: "Moeda", flex: 1, editable: true },
    {
      field: "priceInside",
      headerName: "Preço Dentro",
      flex: 1,
      editable: true,
    },
    {
      field: "priceOutside",
      headerName: "Preço Fora",
      flex: 1,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      flex: 1,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Salvar"
              onClick={() => handleSaveClick(id)}
              color="primary"
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancelar"
              onClick={() => handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Editar"
            onClick={() => handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Excluir"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  // Funções para manipular o modo de edição (com useCallback)
  const handleEditClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    },
    [rowModesModel]
  );

  const handleSaveClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    },
    [rowModesModel]
  );

  const handleCancelClick = useCallback(
    (id) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
    },
    [rowModesModel]
  );

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container-Lista">
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          Lista de Produtos
        </Typography>
        <Autocomplete
          options={products.map((product) => product.name)}
          value={searchText}
          onInputChange={(e, value) => setSearchText(value)}
          renderInput={(params) => (
            <TextField {...params} label="Buscar produto" />
          )}
          sx={{ mb: 2, width: "10rem", fontSize: "1rem", textAlign: "center" }}
        />
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={setRowModesModel}
            processRowUpdate={processRowUpdate}
            getRowId={(row) => row._id}
            sx={{
              width: "100%",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                color: "#333",
                fontSize: "0.6rem",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                whiteSpace: "normal", // Permite quebra de linha
                overflow: "visible", // Remove truncamento
                textOverflow: "clip", // Remove os três pontos
              },
              "& .MuiDataGrid-cell--editable": {
                backgroundColor: "#f0f8ff",
              },
              "& .MuiDataGrid-row": {
                cursor: "pointer",
              },
            }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default ListaProdutos;
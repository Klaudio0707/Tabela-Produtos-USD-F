import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { GridRowModes, GridActionsCellItem } from "@mui/x-data-grid";
import "../Styles/Lista.css";

const ListaProdutos = () => {
  const [products, setProducts] = useState([]); // Armazena os produtos
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [searchText, setSearchText] = useState(""); // Estado para a busca
  const [rowModesModel, setRowModesModel] = useState({}); // Controle de modo de edição
  const REACT_APP_API_BACKEND = process.env.REACT_APP_API_BACKEND;

  // Função para buscar os produtos da API
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${REACT_APP_API_BACKEND}/products`);
      if (response.ok) {
        const data = await response.json();
        console.log("Dados recebidos da API:", data); // Log dos dados
        setProducts(data);
      } else {
        console.error("Erro ao obter produtos:", response.status);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  }, [REACT_APP_API_BACKEND]);

  useEffect(() => {
    fetchProducts(); // Chama a função ao montar o componente
  }, [fetchProducts]);

  // Função para lidar com o clique no botão "Editar"
  const processRowUpdate = async (newRow) => {
    try {
      const response = await fetch(`${REACT_APP_API_BACKEND}/products/${newRow._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar produto: ${response.status}`);
      }

      console.log("Alteração salva com sucesso!");

      const updatedProduct = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );

      return updatedProduct; // Retorna a linha atualizada
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      return newRow; // Retorna a linha original em caso de erro
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleDeleteClick = (id) => async () => {
    try {
      const response = await fetch(`${REACT_APP_API_BACKEND}/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Produto excluído com sucesso!");
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
      } else {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  // Função para aplicar filtro rápido
  const onSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Filtra os dados com base no texto de busca
  const filteredProducts = products.filter((product) =>
    Object.values(product).some(
      (value) =>
        typeof value === "string" && value.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  // Definição das colunas da tabela
  const columns = [
    { field: "name", headerName: "Nome", flex: 1, editable: true },
    { field: "manufacturer", headerName: "Fabricante", flex: 1, editable: true },
    { field: "origin", headerName: "Origem", flex: 1, editable: true },
    { field: "package", headerName: "Embalagem", flex: 1, editable: true },
    { field: "currency", headerName: "Moeda", flex: 1, editable: true },
    {
      field: "priceInside",
      headerName: "Preço Dentro",
      flex: 1,
      editable: true,
      valueFormatter: (params) => parseFloat(params.value).toFixed(2),
    },
    {
      field: "priceOutside",
      headerName: "Preço Fora",
      flex: 1,
      editable: true,
      valueFormatter: (params) => parseFloat(params.value).toFixed(2),
    },
   
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      flex: 1,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Salvar"
              onClick={handleSaveClick(id)}
              color="primary"
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancelar"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Editar"
            className="textPrimary"
            onClick={handleEditClick(id)}
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

  // Mensagem de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return <div className="loading-message">Carregando produtos...</div>;
  }

  return (
    <Box className="page-container" sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Typography variant="h4" className="page-title" sx={{ textAlign: "center", mb: 2 }}>
        Produtos Cadastrados
      </Typography>

      {/* Barra de busca */}
      <Box className="search-bar" sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchText}
          onChange={onSearchChange}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </Box>

      {/* Tabela */}
      <Box className="table-container">
        <DataGrid
          rows={filteredProducts}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
          processRowUpdate={processRowUpdate}
          getRowId={(row) => row._id}
          sx={{
            width: "100%",
            height: "auto",
            "& .MuiDataGrid-cell--editable": {
              backgroundColor: "#f0f8ff",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
            },
            "& .MuiDataGrid-row": {
              cursor: "pointer",
            },
          }}
          autoHeight
          hideFooterSelectedRowCount
        />
      </Box>
    </Box>
  );
};

export default ListaProdutos;
import React, { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Estilos base
import "ag-grid-community/styles/ag-theme-alpine.css"; // Tema Alpine
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "../Styles/Lista.css"; // Importa o arquivo CSS personalizado

// Registra os módulos necessários
ModuleRegistry.registerModules(AllCommunityModule);

const ListaProdutos = () => {
  const [products, setProducts] = useState([]); // Armazena os produtos
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const REACT_APP_API_BACKEND = process.env.REACT_APP_API_BACKEND;

  // Função para buscar os produtos da API (usando useCallback)
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
  }, [REACT_APP_API_BACKEND]); // Dependências de fetchProducts

  useEffect(() => {
    fetchProducts(); // Chama a função ao montar o componente
  }, [fetchProducts]); // Inclui fetchProducts como dependência

  // Função para lidar com a edição de células
  const handleCellEdit = async (event) => {
    const { data, oldValue, newValue, colDef } = event;
    console.log("Célula editada:", data, colDef.field, oldValue, newValue);

    // Atualiza os dados no backend
    try {
      const response = await fetch(`${REACT_APP_API_BACKEND}/products/${data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [colDef.field]: newValue }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      console.log("Alteração salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alteração:", error);
    }
  };

  // Definição das colunas da tabela
  const columnDefs = [
    { field: "name", headerName: "Nome", width: 200, editable: true },
    { field: "manufacturer", headerName: "Fabricante", width: 150, editable: true },
    { field: "origin", headerName: "Origem", width: 120, editable: true },
    { field: "package", headerName: "Embalagem", width: 120, editable: true },
    { field: "currency", headerName: "Moeda", width: 100, editable: true },
    {
      field: "priceInside",
      headerName: "Preço Dentro",
      width: 130,
      editable: true,
      valueFormatter: (params) => parseFloat(params.value).toFixed(2),
    },
    {
      field: "priceOutside",
      headerName: "Preço Fora",
      width: 130,
      editable: true,
      valueFormatter: (params) => parseFloat(params.value).toFixed(2),
    },
    {
      field: "ipi",
      headerName: "IPI",
      width: 100,
      editable: true,
      valueFormatter: (params) =>
        params.data.ipi ? `Sim ${params.data.ipiRate}%` : "Não",
    },
  ];

  // Mensagem de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return <div className="loading-message">Carregando produtos...</div>;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Produtos Cadastrados</h1>
      {/* Container da tabela */}
      <div className="table-container ag-theme-alpine">
        <AgGridReact
          rowData={products} // Dados da tabela
          columnDefs={columnDefs} // Definição das colunas
          pagination={true} // Habilita paginação
          paginationPageSize={10} // Número de linhas por página
          rowSelection="single" // Permite seleção de linha única
          onCellValueChanged={(event) => handleCellEdit(event)} // Captura alterações
          onGridReady={(params) => params.api.sizeColumnsToFit()} // Ajusta as colunas ao carregar
        />
      </div>
    </div>
  );
};

export default ListaProdutos;
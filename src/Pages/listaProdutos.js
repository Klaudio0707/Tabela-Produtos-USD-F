import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Estilos base
import "ag-grid-community/styles/ag-theme-alpine.css"; // Tema Alpine
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";

// Registra o módulo necessário
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const ListaProdutos = () => {
  const [products, setProducts] = useState([]); // Armazena os produtos
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const REACT_APP_API_BACKEND = process.env.REACT_APP_API_BACKEND;

  // Função para buscar os produtos da API
  const fetchProducts = async () => {
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
  };

  // Chama a função de busca ao montar o componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Definição das colunas da tabela
  const columnDefs = [
    { field: "name", headerName: "Nome" },
    { field: "manufacturer", headerName: "Fabricante" },
    { field: "origin", headerName: "Origem" },
    { field: "package", headerName: "Embalagem" },
    { field: "currency", headerName: "Moeda" },
    {
      field: "priceInside",
      headerName: "Preço Dentro",
      valueFormatter: (params) => parseFloat(params.value).toFixed(2),
    },
    {
      field: "priceOutside",
      headerName: "Preço Fora",
      valueFormatter: (params) => parseFloat(params.value).toFixed(2),
    },
    {
      field: "ipi",
      headerName: "IPI",
      valueFormatter: (params) =>
        params.data.ipi ? `Sim ${params.data.ipiRate}%` : "Não",
    },
  ];

  // Exibe uma mensagem de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return <div>Carregando produtos...</div>;
  }

  return (
    <div className="lista-container">
      <h1>Produtos Cadastrados</h1>
      {/* Container da tabela */}
      <div className="ag-theme-alpine" style={{ height: "500px", width: "100%" }}>
        <AgGridReact
          rowData={products} // Dados da tabela
          columnDefs={columnDefs} // Definição das colunas
          pagination={true} // Habilita paginação
          paginationPageSize={10} // Número de linhas por página
          rowSelection="single" // Permite seleção de linha única
        />
      </div>
    </div>
  );
};

export default ListaProdutos;
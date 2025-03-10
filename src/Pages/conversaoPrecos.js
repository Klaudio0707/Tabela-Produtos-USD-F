import React, { useState } from "react";
import "../Styles/ConversaoPrecos.css";
import { Typography } from "@mui/material";
import { DollarSign, Trash2 } from "lucide-react";

const ConversaoPrecos = ({ products }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedQuote, setSelectedQuote] = useState("cotacaoVenda");
  const [dollarRate, setDollarRate] = useState(null);
  const [convertedProducts, setConvertedProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${month}-${day}-${year}`;
  };
  const isValidDate = (date) => {
    const today = new Date();
    const selected = new Date(date);
    return (
      selected < today && selected.getDay() !== 0 && selected.getDay() !== 6
    );
  };

  const fetchDollarRate = async (date) => {
    setLoading(true);
    try {
      const formattedDate = formatDate(date);
      const response = await fetch(
        `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${formattedDate}%27&$top=100&$format=json&$select=${selectedQuote}`
      );
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      if (data.value && data.value.length > 0) {
        const rate = data.value[0][selectedQuote];
        setDollarRate(rate);
        setError("");
        return rate;
      } else {
        setError("Cotação do dólar não encontrada para a data selecionada.");
        setDollarRate(null);
        return null;
      }
    } catch (error) {
      setError(
        "Erro ao buscar cotação do dólar. Talvez o Banco Central esteja indisponível no momento. Tente mais tarde."
      );
      console.error("Erro ao buscar cotação do dólar:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleConvertPrices = async () => {
    if (!selectedDate) {
      setError("Por favor, selecione uma data.");
      return;
    }
    if (!isValidDate(selectedDate)) {
      setError("Data inválida. Escolha um dia útil anterior ao dia atual.");
      return;
    }

    const rate = await fetchDollarRate(selectedDate);

    if (rate) {
      const updatedProducts = products.map((product) => ({
        ...product,
        price:
          product.currency === "USD"
            ? (product.price * rate).toFixed(2)
            : product.price,
      }));
      setConvertedProducts(updatedProducts);
    }
  };

  const handleCleanPrices = () => {
    setConvertedProducts([]);
    setDollarRate(null);
    setError("");
  };
  const handleChange = (e) => {
    setSelectedQuote(e.target.value);
  };

  const handlePrintTable = () => {
    const tableContent = document.querySelector(".conversion-table").outerHTML;
    const printWindow = window.open("Tabela de Produtos", "_blank");

    if (printWindow) {
      printWindow.document.write(`
<html>
  <head>
       <title>Tabela de Produtos </title>
    <style>
       body{
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
        margin-top: 100px;
       }
       h1{
        text-align: center;
       }

       .conversion-table {
         width: 100%;
         border-collapse: collapse;
         background-color: white;
       }

       .conversion-table th,
       .conversion-table td {
         border: 1px solid #ddd; 
         padding: 0.425rem;
         padding: 5px;
         text-align: center;
         font-size: 0.7rem;
       }

       .conversion-table th {
         background-color: #4e59ec;
         border-radius: 0.1rem;
         color: white;
         font-weight: bold;
         text-transform: uppercase; /* Transforma o texto em maiúsculas */
         letter-spacing: 0.5px; /* Espaçamento entre letras */
         z-index: 2; /* Mantém os títulos acima dos dados */
       }
    </style>
  </head> 
    <body >
      <div class= "container-print-table">
      <h1> Tabela de Produtos </h1>
          ${tableContent}
      </div>
    <body>
</html>
    `);
      printWindow.document.close(); // Finaliza o conteúdo
      printWindow.print(); // Dispara o comando de impressão
    }
  };

  return (
    <div className="conversion-container">
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
        Conversão de Preços
      </Typography>
      <div className="conversion-controls">
        <div className="warning-box">
          Por favor, selecione uma data anterior à atual e que seja um dia útil.
          Lembre-se de que o Banco Central não realiza fechamento de câmbio nos
          finais de semana ou feriados, portanto, não há cotações disponíveis
          para essas datas.
        </div>
        <div className="conversion-input-select">
          <h3 className="conversion-title-h3">Data do Fechamento do Dólar</h3>
          <input
            type="date"
            className="conversion-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <h3 className="conversion-title-h3">Cotação</h3>
          <select
            name="currency"
            value={selectedQuote}
            onChange={handleChange}
            className="conversion-select"
          >
            <option value="cotacaoVenda">Venda</option>
            <option value="cotacaoCompra">Compra</option>
          </select>
        </div>
        <div className="conversion-buttons">
          <button
            className="btn convert-btn"
            onClick={handleConvertPrices}
            disabled={loading}
          >
            {loading ? (
              "Carregando..."
            ) : (
              <>
                <DollarSign size={12} />
                Exibir Preços Convertidos
              </>
            )}
          </button>
          <button className="btn clean-btn" onClick={handleCleanPrices}>
            <Trash2 size={12} />
            Limpar
          </button>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      {dollarRate && (
        <p className="rate-info">
          Cotação do Dólar: R$ {dollarRate.toFixed(4)}
        </p>
      )}

      {convertedProducts.length > 0 && (
        <>
          <button className="btn print-btn" onClick={handlePrintTable}>
            Imprimir Tabela
          </button>
          <table className="conversion-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Fabricante</th>
                <th>Origem</th>
                <th>Preço</th>
              </tr>
            </thead>
            <tbody className="tbody-convertidos">
              {convertedProducts.map((product) => (
                <tr key={product._id || product.id}>
                  <td>{product.name}</td>
                  <td>{product.manufacturer}</td>
                  <td>{product.origin}</td>
                  <td>R$ {product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ConversaoPrecos;

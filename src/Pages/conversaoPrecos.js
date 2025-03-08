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
    return selected < today && selected.getDay() !== 0 && selected.getDay() !== 6;
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
        priceInside:
          product.currency === "USD"
            ? (product.priceInside * rate).toFixed(2)
            : product.priceInside,
        priceOutside:
          product.currency === "USD"
            ? (product.priceOutside * rate).toFixed(2)
            : product.priceOutside,
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

  return (
    <section className="conversion-container">
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
            {loading ? "Carregando..." : <>
            <DollarSign size={12} />
             Exibir Preços Convertidos</>}
          </button>
          <button className="btn clean-btn"
           onClick={handleCleanPrices}>
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
        <table className="product-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Fabricante</th>
              <th>Origem</th>
              <th>Preço Dentro</th>
              <th>Preço Fora</th>
            </tr>
          </thead>
          <tbody className="tbody-convertidos">
            {convertedProducts.map((product) => (
              <tr key={product._id || product.id}>
                <td>{product.name}</td>
                <td>{product.manufacturer}</td>
                <td>{product.origin}</td>
                <td>R$ {product.priceInside}</td>
                <td>R$ {product.priceOutside}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default ConversaoPrecos;

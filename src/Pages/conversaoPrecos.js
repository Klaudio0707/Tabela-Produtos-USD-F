import React, { useState } from "react";
import "../style/ConversaoPrecos.css";

const ConversaoPrecos = ({ products }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [dollarRate, setDollarRate] = useState(null);
  const [convertedProducts, setConvertedProducts] = useState([]);
  const [error, setError] = useState("");

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${month}-${day}-${year}`;
  };

  const fetchDollarRate = async (date) => {
    try {
      const formattedDate = formatDate(date);
      const response = await fetch(
        `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${formattedDate}%27&$top=100&$format=json&$select=cotacaoVenda`
      );

      const data = await response.json();
      if (data.value && data.value.length > 0) {
        const rate = data.value[0].cotacaoVenda;
        setDollarRate(rate);
        setError("");
        return rate;
      } else {
        setError("Cotação do dólar não encontrada para a data selecionada.");
        setDollarRate(null);
        return null;
      }
    } catch (error) {
      setError("Erro ao buscar cotação do dólar. Verifique a data e tente novamente.");
      console.error("Erro ao buscar cotação do dólar:", error);
      return null;
    }
  };

  const handleConvertPrices = async () => {
    if (!selectedDate) {
      setError("Por favor, selecione uma data.");
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

  return (
    <section className="conversion-container">
      <h1 className="conversion-title">Conversão de Preços</h1>
      <div className="conversion-controls">
        <label className="conversion-label">
          Data do Fechamento do Dólar:
          <input
            type="date"
            className="conversion-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <div className="conversion-buttons">
          <button className="btn convert-btn" onClick={handleConvertPrices}>
            Exibir Preços Convertidos
          </button>
          <button className="btn clean-btn" onClick={handleCleanPrices}>
            Limpar Lista
          </button>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      {dollarRate && (
        <p className="rate-info">Cotação do Dólar: R$ {dollarRate.toFixed(4)}</p>
      )}
      <h2 className="converted-title">Produtos Convertidos</h2>
      <ul className="product-list">
        {convertedProducts.map((product) => (
          <li key={product.id} className="product-item">
            {product.name} - Preço Dentro: R$ {product.priceInside} - Preço Fora: R$ {product.priceOutside}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ConversaoPrecos;

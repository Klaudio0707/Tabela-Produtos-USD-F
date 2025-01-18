import React, { useState } from "react";

const ConversaoPrecos = ({ products }) => {
  const [selectedDate, setSelectedDate] = useState(""); // Data selecionada pelo usuário
  const [dollarRate, setDollarRate] = useState(null); // Cotação do dólar
  const [convertedProducts, setConvertedProducts] = useState([]); // Produtos convertidos
  const [error, setError] = useState(""); // Para exibir erros

  // Função para converter data no formato aceito pela API do Banco Central
  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${month}-${day}-${year}`;
  };

  // Buscar cotação do dólar pela API do Banco Central
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
        setError(""); // Limpa o erro se a cotação for encontrada
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
    setConvertedProducts([]); // Limpa a lista de produtos convertidos
    setDollarRate(null); // Opcional: limpar a cotação exibida
    setError(""); // Opcional: limpar mensagens de erro
  };

  return (
    <div>
      <h1>Conversão de Preços</h1>
      <label>
        Data do Fechamento do Dólar:
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </label>
      <button onClick={handleConvertPrices}>Exibir Preços Convertidos</button>
      <button onClick={handleCleanPrices}>Limpar Lista</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {dollarRate && <p>Cotação do Dólar: R$ {dollarRate.toFixed(4)}</p>}
      <h2>Produtos Convertidos</h2>
      <ul>
        {convertedProducts.map((product) => (
          <li key={product.id}>
            {product.name} - Preço Dentro: R$ {product.priceInside} - Preço Fora: R$ {product.priceOutside}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversaoPrecos;


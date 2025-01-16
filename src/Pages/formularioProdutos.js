import React, { useState } from 'react';

const FormularioProdutos = ({ onSubmit }) => {
  const [product, setProduct] = useState({
    name: '',
    manufacturer: '',
    origin: '',
    package: '',
    currency: 'BRL',
    priceInside: '',
    priceOutside: '',
    ipi: false,
    ipiRate: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCheckboxChange = () => {
    setProduct({ ...product, ipi: !product.ipi });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

  try{
const response = await fetch(`${BASE_URL}/products`, {
method: "POST",
headers: { "Content-Type": "application/json"},
body: JSON.stringify(product),
});
if(response.ok){

  const newProduct = await response.json();
  onaddProduct(newProduct);
  setProduct({

    
  })
}
  }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nome" onChange={handleChange} />
      <input name="manufacturer" placeholder="Fabricante" onChange={handleChange} />
      <input name="origin" placeholder="Origem" onChange={handleChange} />
      <input name="package" placeholder="Embalagem" onChange={handleChange} />
      <select name="currency" onChange={handleChange}>
        <option value="BRL">Real</option>
        <option value="USD">Dólar</option>
      </select>
      <input name="priceInside" placeholder="Preço Dentro" onChange={handleChange} />
      <input name="priceOutside" placeholder="Preço Fora" onChange={handleChange} />
      <label>
        <input type="checkbox" checked={product.ipi} onChange={handleCheckboxChange} />
        Tem IPI
      </label>
      {product.ipi && <input name="ipiRate" placeholder="Alíquota (%)" onChange={handleChange} />}
      <button type="submit">Salvar</button>
    </form>
  );
};

export default FormularioProdutos;

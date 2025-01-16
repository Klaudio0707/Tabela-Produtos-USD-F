import React from 'react'

const listaProdutos = ({products}) => (
        <table>
<thead>
<tr>
    <th>Nome</th>
    <th>Fabricante</th>
    <th>Embalagem</th>
    <th>Moeda</th>
    <th>Preço (Dentro)</th>
    <th>Preço (Fora)</th>
    <th>IPI (%)</th>
    <th>Açoes</th>
</tr>
</thead>
<tbody>
    {products.map((product, index) => (
<tr key={index}>
<td>{product.name}</td>
<td>{product.origin}</td>
<td>{product.package}</td>
<td>{product.currency}</td>
<td>{product.priceInside}</td>
<td>{product.priceOutside}</td>
<td>{product.ipi ? product.ipiRate: 'Isento'}</td>
<td>
<button>Editar</button>
<button>Excluir</button>
</td>
</tr>

    ))}
</tbody>
        </table>
    
)

export default listaProdutos;

const ListaProdutos = ({ products, onDelete }) => (
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
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            {products.map((product, index) => (
                <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.manufacturer}</td> {/* Correção aqui */}
                    <td>{product.package}</td>
                    <td>{product.currency}</td>
                    <td>{product.priceInside}</td>
                    <td>{product.priceOutside}</td>
                    <td>{product.ipi ? product.ipiRate : 'Isento'}</td>
                    <td>
                        <button onClick={() => console.log('Editar', product)}>Editar</button>
                        <button onClick={() => onDelete(product.id)}>Excluir</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default ListaProdutos;

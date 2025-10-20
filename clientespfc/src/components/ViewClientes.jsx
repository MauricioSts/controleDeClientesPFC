function ViewClientes({ clientes }) {
  return (
    <div>
      <h1>Clientes:</h1>
      <ul>
        {clientes.map((cliente, index) => (
          <li key={index}>
            {cliente.nome} {cliente.instagram}
            {cliente.numeroTel} {cliente.produto} {cliente.tamanho}
            {cliente.preco}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewClientes;

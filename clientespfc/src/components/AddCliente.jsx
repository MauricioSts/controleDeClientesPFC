function AddCliente({
  nome,
  setNome,
  instagram,
  setInstagram,
  numero,
  setNumero,
  produto,
  setProduto,
  tamanho,
  setTamanho,
  valor,
  setValor,
  clientes,
  setClientes,
}) {
  function adicionarCliente() {
    if (!nome || !instagram || !numero || !produto || !tamanho || !valor)
      return alert("preencha todos os campos");

    const numeroTel = parseFloat(numero);
    const preco = parseFloat(valor);

    if (isNaN(numeroTel || preco)) return alert("valor invalido");

    const novoCliente = {
      nome,
      instagram,
      numeroTel,
      produto,
      tamanho,
      preco,
    };

    setClientes([...clientes, novoCliente]);

    setNome("");
    setNumero("");
    setInstagram("");
    setProduto("");
    setValor("");
    setTamanho("");
  }

  return (
    <div>
      <h2>Adicionar um novo cliente</h2>
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome"
      ></input>
      <input
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
        placeholder="Instagram"
      ></input>
      <input
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        type="number"
        placeholder="Numero de telefone"
      ></input>
      <input
        value={produto}
        onChange={(e) => setProduto(e.target.value)}
        placeholder="Produto"
      ></input>
      <input
        value={tamanho}
        onChange={(e) => setTamanho(e.target.value)}
        placeholder="Tamanho"
      ></input>
      <input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        type="number"
        placeholder="Valor do produto"
      ></input>
      <button onClick={adicionarCliente}>Adicionar Cliente</button>
    </div>
  );
}

export default AddCliente;

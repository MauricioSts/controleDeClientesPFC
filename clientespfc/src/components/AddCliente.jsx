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
  setData,
}) {
  function adicionarCliente() {
    if (!nome || !instagram || !numero || !produto || !tamanho || !valor)
      return alert("Preencha todos os campos!");

    const numeroTel = parseFloat(numero);
    const preco = parseFloat(valor);

    if (isNaN(numeroTel) || isNaN(preco)) return alert("Valor inválido!");

    const novaData = new Date().toLocaleDateString("pt-BR");
    setData(novaData);
    const novoCliente = {
      nome,
      instagram,
      numeroTel,
      produto,
      tamanho,
      preco,
      novaData,
    };

    setClientes([novoCliente, ...clientes]);

    setNome("");
    setNumero("");
    setInstagram("");
    setProduto("");
    setValor("");
    setTamanho("");
  }

  return (
    <div className="bg-[#2C1660] p-6 rounded-xl shadow-lg border border-[#FF2E63]/40">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        Adicionar Novo Cliente
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
          className="bg-[#1A0841] border border-[#FF2E63]/30 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
        />

        <input
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="Instagram"
          className="bg-[#1A0841] border border-[#FF2E63]/30 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
        />

        <input
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          type="number"
          placeholder="Número de telefone"
          className="bg-[#1A0841] border border-[#FF2E63]/30 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
        />

        <input
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
          placeholder="Produto"
          className="bg-[#1A0841] border border-[#FF2E63]/30 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
        />

        <input
          value={tamanho}
          onChange={(e) => setTamanho(e.target.value)}
          placeholder="Tamanho"
          className="bg-[#1A0841] border border-[#FF2E63]/30 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
        />

        <input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          type="number"
          placeholder="Valor do produto"
          className="bg-[#1A0841] border border-[#FF2E63]/30 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
        />
      </div>

      <button
        onClick={adicionarCliente}
        className="w-full mt-6 bg-[#FF2E63] hover:bg-[#ff4877] text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
      >
        Adicionar Cliente
      </button>
    </div>
  );
}

export default AddCliente;

import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function AddCliente() {
  const [nome, setNome] = useState("");
  const [instagram, setInstagram] = useState("");
  const [numero, setNumero] = useState("");
  const [produto, setProduto] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);

  async function adicionarCliente() {
    if (!nome || !instagram || !numero || !produto || !tamanho || !valor) {
      alert("Preencha todos os campos!");
      return;
    }

    const numeroTel = parseFloat(numero);
    const preco = parseFloat(valor);

    if (isNaN(numeroTel) || isNaN(preco)) {
      alert("Número ou valor inválido!");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "clientes"), {
        nome,
        instagram,
        numeroTel,
        produto,
        tamanho,
        preco,
        data: new Date().toLocaleDateString("pt-BR"),
        createdAt: serverTimestamp(),
      });

      alert("Cliente adicionado com sucesso!");

      // Limpa os campos
      setNome("");
      setNumero("");
      setInstagram("");
      setProduto("");
      setValor("");
      setTamanho("");
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      alert("Erro ao adicionar cliente. Verifique o console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#2C1660] p-4 sm:p-6 rounded-xl shadow-lg border border-[#FF2E63]/40">
      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 text-center">
        Adicionar Novo Cliente
      </h2>

      {/* Campos de entrada */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
          className="bg-[#1A0841] border border-[#FF2E63]/30 text-white text-sm sm:text-base rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63] placeholder-gray-400"
        />

        <input
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="Instagram"
          className="bg-[#1A0841] border border-[#FF2E63]/30 text-white text-sm sm:text-base rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63] placeholder-gray-400"
        />

        <input
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          type="number"
          placeholder="Número de telefone"
          className="bg-[#1A0841] border border-[#FF2E63]/30 text-white text-sm sm:text-base rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63] placeholder-gray-400"
        />

        <input
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
          placeholder="Produto"
          className="bg-[#1A0841] border border-[#FF2E63]/30 text-white text-sm sm:text-base rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63] placeholder-gray-400"
        />

        <input
          value={tamanho}
          onChange={(e) => setTamanho(e.target.value)}
          placeholder="Tamanho"
          className="bg-[#1A0841] border border-[#FF2E63]/30 text-white text-sm sm:text-base rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63] placeholder-gray-400"
        />

        <input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          type="number"
          placeholder="Valor do produto"
          className="bg-[#1A0841] border border-[#FF2E63]/30 text-white text-sm sm:text-base rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63] placeholder-gray-400"
        />
      </div>

      {/* Botão */}
      <button
        onClick={adicionarCliente}
        disabled={loading}
        className={`w-full mt-5 sm:mt-6 text-white font-semibold text-sm sm:text-base py-3 sm:py-3.5 rounded-lg transition duration-200 shadow-md ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-[#FF2E63] hover:bg-[#ff4877]"
        }`}
      >
        {loading ? "Adicionando..." : "Adicionar Cliente"}
      </button>
    </div>
  );
}

export default AddCliente;

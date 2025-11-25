import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, User, Instagram, Phone, ShoppingBag, Ruler, DollarSign, Hash, Tag } from "lucide-react";

function AddCliente({ onAddCliente }) {
  const [nome, setNome] = useState("");
  const [instagram, setInstagram] = useState("");
  const [numero, setNumero] = useState("");
  const [produto, setProduto] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [valor, setValor] = useState("");
  const [versao, setVersao] = useState("fan");
  const [numeroCamisa, setNumeroCamisa] = useState("");
  const [nomeCamisa, setNomeCamisa] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCliente({
      nome,
      instagram,
      numero,
      produto,
      tamanho,
      valor,
      versao,
      numeroCamisa,
      nomeCamisa,
    });
    // Limpar formulário
    setNome("");
    setInstagram("");
    setNumero("");
    setProduto("");
    setTamanho("");
    setValor("");
    setVersao("fan");
    setNumeroCamisa("");
    setNomeCamisa("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-sm rounded-2xl p-6 shadow-2xl"
      style={{ backgroundColor: "#1e293b", border: "1px solid #3B82F6" }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#3B82F6" }}>
          <UserPlus className="inline w-6 h-6 mr-2" />
          Adicionar Cliente
        </h2>
        <p style={{ color: "#FFFFFF" }}>Registre um novo cliente no sistema</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#3B82F6" }}>
              Nome *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#3B82F6" }} />
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ backgroundColor: "#0f172a", border: "1px solid #3B82F6", color: "#FFFFFF" }}
                placeholder="Nome do cliente"
                required
              />
            </div>
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#3B82F6" }}>
              Instagram
            </label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#3B82F6" }} />
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ backgroundColor: "#0f172a", border: "1px solid #3B82F6", color: "#FFFFFF" }}
                placeholder="@usuario"
              />
            </div>
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#3B82F6" }}>
              Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#3B82F6" }} />
              <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ backgroundColor: "#0f172a", border: "1px solid #3B82F6", color: "#FFFFFF" }}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          {/* Produto */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#3B82F6" }}>
              Produto *
            </label>
            <div className="relative">
              <ShoppingBag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#3B82F6" }} />
              <input
                type="text"
                value={produto}
                onChange={(e) => setProduto(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ backgroundColor: "#0f172a", border: "1px solid #3B82F6", color: "#FFFFFF" }}
                placeholder="Nome do produto"
                required
              />
            </div>
          </div>

          {/* Tamanho */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#3B82F6" }}>
              Tamanho
            </label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#3B82F6" }} />
              <select
                value={tamanho}
                onChange={(e) => setTamanho(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ backgroundColor: "#0f172a", border: "1px solid #3B82F6", color: "#FFFFFF" }}
              >
                <option value="">Selecione</option>
                <option value="PP">PP</option>
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
                <option value="XG">XG</option>
                <option value="XXG">XXG</option>
              </select>
            </div>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#3B82F6" }}>
              Valor (R$) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#3B82F6" }} />
              <input
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ backgroundColor: "#0f172a", border: "1px solid #3B82F6", color: "#FFFFFF" }}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Versão */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#3B82F6" }}>
              Versão
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#3B82F6" }} />
              <select
                value={versao}
                onChange={(e) => setVersao(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ backgroundColor: "#0f172a", border: "1px solid #3B82F6", color: "#FFFFFF" }}
              >
                <option value="fan">Fan</option>
                <option value="player">Player</option>
              </select>
            </div>
          </div>

          {/* Número Camisa */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#3B82F6" }}>
              Número Camisa
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#3B82F6" }} />
              <input
                type="text"
                value={numeroCamisa}
                onChange={(e) => setNumeroCamisa(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ backgroundColor: "#0f172a", border: "1px solid #3B82F6", color: "#FFFFFF" }}
                placeholder="Ex: 10"
              />
            </div>
          </div>

          {/* Nome Camisa */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" style={{ color: "#3B82F6" }}>
              Nome na Camisa
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#3B82F6" }} />
              <input
                type="text"
                value={nomeCamisa}
                onChange={(e) => setNomeCamisa(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ backgroundColor: "#0f172a", border: "1px solid #3B82F6", color: "#FFFFFF" }}
                placeholder="Ex: NEYMAR JR"
              />
            </div>
          </div>
        </div>

        {/* Botão Submit */}
        <button
          type="submit"
          className="w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: "#3B82F6", color: "#FFFFFF" }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#14B8A6")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#3B82F6")}
        >
          <UserPlus className="inline w-5 h-5 mr-2" />
          Adicionar Cliente
        </button>
      </form>
    </motion.div>
  );
}

export default AddCliente;


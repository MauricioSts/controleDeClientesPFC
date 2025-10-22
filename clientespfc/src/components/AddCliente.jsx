import { useState } from "react";
import { motion } from "framer-motion";

function AddCliente({ onAddCliente }) {
  const [nome, setNome] = useState("");
  const [instagram, setInstagram] = useState("");
  const [numero, setNumero] = useState("");
  const [produto, setProduto] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!nome || !instagram || !numero || !produto || !tamanho || !valor)
      return;

    setLoading(true);
    await onAddCliente({ nome, instagram, numero, produto, tamanho, valor });
    setLoading(false);

    setNome("");
    setInstagram("");
    setNumero("");
    setProduto("");
    setTamanho("");
    setValor("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#2C1660] p-6 sm:p-8 rounded-xl shadow-lg border border-[#FF2E63]/40"
    >
      <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-white mb-6">
        Adicionar{" "}
        <span className="text-[#FF2E63] drop-shadow-[0_0_8px_#FF2E63]">
          Cliente
        </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {[
          { value: nome, setter: setNome, placeholder: "Nome" },
          { value: instagram, setter: setInstagram, placeholder: "Instagram" },
          {
            value: numero,
            setter: setNumero,
            placeholder: "Número de telefone",
            type: "number",
          },
          { value: produto, setter: setProduto, placeholder: "Produto" },
          { value: tamanho, setter: setTamanho, placeholder: "Tamanho" },
          {
            value: valor,
            setter: setValor,
            placeholder: "Valor do produto",
            type: "number",
          },
        ].map((field, i) => (
          <input
            key={i}
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
            type={field.type || "text"}
            placeholder={field.placeholder}
            className="bg-[#1A0841]/80 border border-[#FF2E63]/20 text-white rounded-xl p-3 sm:p-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]/70 transition-all"
          />
        ))}
      </div>

      <motion.button
        onClick={handleSubmit}
        disabled={loading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`w-full mt-6 text-white font-semibold text-lg py-3.5 rounded-xl shadow-lg transition-all duration-200 ${
          loading
            ? "bg-gray-500/60 cursor-not-allowed"
            : "bg-[#FF2E63] hover:bg-[#ff4877]"
        }`}
      >
        {loading ? "Adicionando..." : "Adicionar Cliente"}
      </motion.button>
    </motion.div>
  );
}

export default AddCliente;

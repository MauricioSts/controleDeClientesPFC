import { useState, useEffect } from "react";

function ViewClientes({ clientes }) {
  const [concluidos, setConcluidos] = useState(() => {
    const stored = localStorage.getItem("concluidos");
    return stored ? JSON.parse(stored) : [];
  });

  // 🔧 Atualiza "concluidos" apenas se o tamanho da lista mudar
  useEffect(() => {
    setConcluidos((prev) => {
      const novos = [...prev];
      // se adicionou novos clientes, adiciona 'false' pra cada novo
      while (novos.length < clientes.length) novos.push(false);
      // se removeu clientes, corta o excesso
      return novos.slice(0, clientes.length);
    });
  }, [clientes]);

  // 🔒 Salva no localStorage apenas quando concluidos mudar
  useEffect(() => {
    localStorage.setItem("concluidos", JSON.stringify(concluidos));
  }, [concluidos]);

  const riscarCliente = (index) => {
    const novosConcluidos = [...concluidos];
    novosConcluidos[index] = !novosConcluidos[index];
    setConcluidos(novosConcluidos);
  };

  return (
    <div className="bg-[#2C1660] p-6 rounded-xl shadow-lg border border-[#FF2E63]/40 text-white">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#FF2E63]">
        Lista de Clientes
      </h2>

      {clientes.length === 0 ? (
        <p className="text-gray-300 text-center">
          Nenhum cliente adicionado ainda.
        </p>
      ) : (
        <ul className="space-y-3">
          {clientes.map((cliente, index) => (
            <li
              key={index}
              className={`flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1A0841] p-4 rounded-lg border border-[#FF2E63]/20 hover:border-[#FF2E63]/50 transition duration-200 ${
                concluidos[index] ? "opacity-60" : "opacity-100"
              }`}
            >
              <div
                className={`flex-1 text-sm md:text-base ${
                  concluidos[index]
                    ? "line-through text-gray-400"
                    : "text-white"
                }`}
              >
                <span className="font-semibold text-[#FF2E63]">
                  {cliente.nome}
                </span>{" "}
                — @{cliente.instagram} • {cliente.numeroTel} •{" "}
                <span className="font-medium">{cliente.produto}</span> (
                {cliente.tamanho}) • R$
                {Number(cliente.preco).toFixed(2)} • {cliente.novaData}
              </div>

              <div className="mt-3 md:mt-0 md:ml-4 flex items-center gap-2">
                <label className="text-sm text-gray-300">Concluído</label>
                <input
                  type="checkbox"
                  checked={!!concluidos[index]}
                  onChange={() => riscarCliente(index)}
                  className="w-5 h-5 accent-[#FF2E63] cursor-pointer"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewClientes;

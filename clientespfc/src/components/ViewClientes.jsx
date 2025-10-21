import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";

function ViewClientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "clientes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(lista);
    });

    return () => unsubscribe();
  }, []);

  const toggleConcluido = async (cliente) => {
    try {
      const ref = doc(db, "clientes", cliente.id);
      await updateDoc(ref, { concluido: !cliente.concluido });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao marcar cliente como concluído");
    }
  };

  return (
    <div className="bg-[#2C1660] p-4 sm:p-6 rounded-xl shadow-lg border border-[#FF2E63]/40 text-white">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center text-[#FF2E63]">
        Lista de Clientes
      </h2>

      {clientes.length === 0 ? (
        <p className="text-gray-300 text-center text-sm sm:text-base">
          Nenhum cliente adicionado ainda.
        </p>
      ) : (
        <ul className="space-y-3 sm:space-y-4">
          {clientes.map((cliente) => (
            <li
              key={cliente.id}
              className={`flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1A0841] p-3 sm:p-4 rounded-lg border border-[#FF2E63]/20 hover:border-[#FF2E63]/50 transition duration-200 ${
                cliente.concluido ? "opacity-60" : "opacity-100"
              }`}
            >
              {/* Dados do cliente */}
              <div
                className={`flex-1 text-sm sm:text-base break-words ${
                  cliente.concluido
                    ? "line-through text-gray-400"
                    : "text-white"
                }`}
              >
                <span className="block sm:inline font-semibold text-[#FF2E63]">
                  {cliente.nome}
                </span>{" "}
                <span className="block sm:inline text-gray-300">
                  @{cliente.instagram}
                </span>{" "}
                • <span>{cliente.numeroTel}</span> •{" "}
                <span className="font-medium">{cliente.produto}</span> (
                {cliente.tamanho}) • R${Number(cliente.preco).toFixed(2)} •{" "}
                {cliente.data}
              </div>

              {/* Checkbox concluído */}
              <div className="mt-3 md:mt-0 md:ml-4 flex items-center gap-2">
                <label className="text-sm text-gray-300">Concluído</label>
                <input
                  type="checkbox"
                  checked={!!cliente.concluido}
                  onChange={() => toggleConcluido(cliente)}
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

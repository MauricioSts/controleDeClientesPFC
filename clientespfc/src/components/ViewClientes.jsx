import { useEffect, useState, useCallback, useMemo } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Eye, Edit3, Save, X } from "lucide-react";
import ClienteDetalhes from "./ClienteDetalhes";

function ViewClientes() {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [editingCliente, setEditingCliente] = useState(null);
  const [editData, setEditData] = useState({});

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

  const toggleConcluido = useCallback(async (cliente) => {
    try {
      const ref = doc(db, "clientes", cliente.id);
      await updateDoc(ref, { concluido: !cliente.concluido });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao marcar cliente como concluído");
    }
  }, []);

  const togglePedidoFeito = useCallback(async (cliente) => {
    try {
      const ref = doc(db, "clientes", cliente.id);
      await updateDoc(ref, { pedidoFeito: !cliente.pedidoFeito });
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      toast.error("Erro ao marcar pedido como feito");
    }
  }, []);


  const startEditing = useCallback((cliente) => {
    setEditingCliente(cliente.id);
    setEditData({
      nome: cliente.nome,
      instagram: cliente.instagram,
      numeroTel: cliente.numeroTel,
      produto: cliente.produto,
      tamanho: cliente.tamanho,
      preco: cliente.preco,
    });
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingCliente(null);
    setEditData({});
  }, []);

  const saveEdit = useCallback(async (cliente) => {
    try {
      const ref = doc(db, "clientes", cliente.id);
      await updateDoc(ref, {
        ...editData,
        preco: parseFloat(editData.preco),
        numeroTel: parseFloat(editData.numeroTel),
      });
      setEditingCliente(null);
      setEditData({});
      toast.success("Cliente atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar cliente");
    }
  }, [editData]);

  const handleUpdate = useCallback(() => {
    // Força a atualização da lista de clientes
    setClientes([...clientes]);
  }, [clientes]);

  // Memoizar a lista de clientes para evitar re-renders desnecessários
  const clientesPendentes = useMemo(() => 
    clientes.filter((c) => !c.concluido).length, 
    [clientes]
  );

  return (
    <div className="bg-[#2C1660] p-4 sm:p-6 rounded-xl shadow-lg border border-[#FF2E63]/40 text-white">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center text-[#FF2E63]">
        Lista de Clientes{" "}
        <span className="ml-2 bg-[#FF2E63] text-white px-2 py-1 rounded-full text-sm font-semibold">
          {clientesPendentes}
        </span>
      </h2>

      {clientes.length === 0 ? (
        <p className="text-gray-300 text-center text-sm sm:text-base">
          Nenhum cliente adicionado ainda.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {clientes.map((cliente) => (
            <motion.div
              key={cliente.id}
              layout
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25, duration: 0.2 }}
              className={`bg-[#1A0841]/90 p-8 rounded-2xl border border-[#FF2E63]/20 hover:border-[#FF2E63]/50 aspect-[3/4] flex flex-col justify-between min-h-[400px] ${
                cliente.concluido ? "opacity-60" : "opacity-100"
              }`}
            >
              {editingCliente === cliente.id ? (
                // Modo de edição - otimizado para cards
                <div className="space-y-2 h-full flex flex-col">
                  <div className="space-y-2 flex-1">
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Nome</label>
                      <input
                        type="text"
                        value={editData.nome}
                        onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                        className="w-full px-2 py-1 bg-[#2C1660] border border-[#FF2E63]/30 rounded text-white text-xs focus:border-[#FF2E63] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Instagram</label>
                      <input
                        type="text"
                        value={editData.instagram}
                        onChange={(e) => setEditData({ ...editData, instagram: e.target.value })}
                        className="w-full px-2 py-1 bg-[#2C1660] border border-[#FF2E63]/30 rounded text-white text-xs focus:border-[#FF2E63] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Produto</label>
                      <input
                        type="text"
                        value={editData.produto}
                        onChange={(e) => setEditData({ ...editData, produto: e.target.value })}
                        className="w-full px-2 py-1 bg-[#2C1660] border border-[#FF2E63]/30 rounded text-white text-xs focus:border-[#FF2E63] focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Tamanho</label>
                        <input
                          type="text"
                          value={editData.tamanho}
                          onChange={(e) => setEditData({ ...editData, tamanho: e.target.value })}
                          className="w-full px-2 py-1 bg-[#2C1660] border border-[#FF2E63]/30 rounded text-white text-xs focus:border-[#FF2E63] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Preço</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editData.preco}
                          onChange={(e) => setEditData({ ...editData, preco: e.target.value })}
                          className="w-full px-2 py-1 bg-[#2C1660] border border-[#FF2E63]/30 rounded text-white text-xs focus:border-[#FF2E63] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-[#FF2E63]/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <label className="text-xs text-gray-300">Concluído</label>
                        <input
                          type="checkbox"
                          checked={!!cliente.concluido}
                          onChange={() => toggleConcluido(cliente)}
                          className="w-3 h-3 accent-[#FF2E63] cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => saveEdit(cliente)}
                          className="p-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded transition-colors"
                          title="Salvar"
                        >
                          <Save className="w-3 h-3" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
                          title="Cancelar"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-300">Pedido Feito</label>
                        <input
                          type="checkbox"
                          checked={!!cliente.pedidoFeito}
                          onChange={() => togglePedidoFeito(cliente)}
                          className="w-4 h-4 accent-[#00ff88] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Modo de visualização - otimizado para cards
                <div className="h-full flex flex-col justify-between">
                  {/* Dados do cliente */}
                  <div className="flex-1 space-y-4">
                    <div className="text-center">
                      <h3 className={`font-bold text-xl mb-2 ${
                        cliente.concluido ? "line-through text-gray-400" : "text-[#FF2E63]"
                      }`}>
                        {cliente.nome}
                      </h3>
                      <p className="text-base text-gray-300 mb-4">@{cliente.instagram}</p>
                    </div>
                    
                    <div className="space-y-3 text-base">
                      <div className="bg-[#2C1660]/50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400 text-sm">Produto</span>
                          <span className={`font-medium ${cliente.concluido ? "line-through text-gray-400" : "text-white"}`}>
                            {cliente.produto}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Tamanho</span>
                          <span className={`font-medium ${cliente.concluido ? "line-through text-gray-400" : "text-white"}`}>
                            {cliente.tamanho}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-[#2C1660]/50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400 text-sm">Telefone</span>
                          <span className={`font-medium ${cliente.concluido ? "line-through text-gray-400" : "text-white"}`}>
                            {cliente.numeroTel}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Data</span>
                          <span className={`text-sm ${cliente.concluido ? "line-through text-gray-400" : "text-white"}`}>
                            {cliente.data}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-3 rounded-lg border border-green-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">Valor Total</span>
                          <span className={`text-lg font-bold ${cliente.concluido ? "line-through text-gray-400" : "text-green-400"}`}>
                            R$ {Number(cliente.preco).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Controles */}
                  <div className="pt-4 border-t border-[#FF2E63]/20">
                    <div className="space-y-3">
                      {/* Status e Ações */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!cliente.concluido}
                              onChange={() => toggleConcluido(cliente)}
                              className="w-5 h-5 accent-[#FF2E63] cursor-pointer"
                            />
                            <label className="text-sm font-medium text-gray-300">Concluído</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!cliente.pedidoFeito}
                              onChange={() => togglePedidoFeito(cliente)}
                              className="w-5 h-5 accent-[#00ff88] cursor-pointer"
                            />
                            <label className="text-sm font-medium text-gray-300">Pedido Feito</label>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCliente(cliente)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => startEditing(cliente)}
                            className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de detalhes */}
      {selectedCliente && (
        <ClienteDetalhes
          cliente={selectedCliente}
          onClose={() => setSelectedCliente(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default ViewClientes;

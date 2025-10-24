import { useState, useEffect } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { X, Save, Trash2, Edit3 } from "lucide-react";

function ClienteDetalhes({ cliente, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCliente, setEditedCliente] = useState({
    nome: cliente.nome || "",
    instagram: cliente.instagram || "",
    numeroTel: cliente.numeroTel || "",
    produto: cliente.produto || "",
    tamanho: cliente.tamanho || "",
    preco: cliente.preco || "",
  });

  const handleSave = async () => {
    try {
      const ref = doc(db, "clientes", cliente.id);
      await updateDoc(ref, {
        ...editedCliente,
        preco: parseFloat(editedCliente.preco),
        numeroTel: parseFloat(editedCliente.numeroTel),
      });
      
      toast.success("Cliente atualizado com sucesso!");
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar cliente");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await deleteDoc(doc(db, "clientes", cliente.id));
        toast.success("Cliente excluído com sucesso!");
        onClose();
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        toast.error("Erro ao excluir cliente");
      }
    }
  };

  const toggleConcluido = async () => {
    try {
      const ref = doc(db, "clientes", cliente.id);
      await updateDoc(ref, { concluido: !cliente.concluido });
      toast.success(cliente.concluido ? "Cliente reaberto" : "Cliente concluído!");
      onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const togglePedidoFeito = async () => {
    try {
      const ref = doc(db, "clientes", cliente.id);
      await updateDoc(ref, { pedidoFeito: !cliente.pedidoFeito });
      toast.success(cliente.pedidoFeito ? "Pedido desmarcado" : "Pedido marcado como feito!");
      onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      toast.error("Erro ao atualizar pedido");
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1A0841] border border-[#FF2E63]/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#FF2E63]/20">
          <h2 className="text-2xl font-bold text-white">
            Detalhes do Cliente
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 bg-[#FF2E63]/20 hover:bg-[#FF2E63]/30 rounded-lg transition-colors"
              title={isEditing ? "Cancelar edição" : "Editar"}
            >
              <Edit3 className="w-5 h-5 text-[#FF2E63]" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status:</span>
              <button
                onClick={toggleConcluido}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  cliente.concluido
                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                }`}
              >
                {cliente.concluido ? "Concluído" : "Pendente"}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Pedido Feito:</span>
              <button
                onClick={togglePedidoFeito}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  cliente.pedidoFeito
                    ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                }`}
              >
                {cliente.pedidoFeito ? "Pedido Feito" : "Pedido Pendente"}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedCliente.nome}
                  onChange={(e) =>
                    setEditedCliente({ ...editedCliente, nome: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#2C1660] border border-[#FF2E63]/30 rounded-lg text-white focus:border-[#FF2E63] focus:outline-none"
                />
              ) : (
                <p className="text-white font-medium">{cliente.nome}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Instagram
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedCliente.instagram}
                  onChange={(e) =>
                    setEditedCliente({
                      ...editedCliente,
                      instagram: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#2C1660] border border-[#FF2E63]/30 rounded-lg text-white focus:border-[#FF2E63] focus:outline-none"
                />
              ) : (
                <p className="text-white">@{cliente.instagram}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Telefone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedCliente.numeroTel}
                  onChange={(e) =>
                    setEditedCliente({
                      ...editedCliente,
                      numeroTel: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#2C1660] border border-[#FF2E63]/30 rounded-lg text-white focus:border-[#FF2E63] focus:outline-none"
                />
              ) : (
                <p className="text-white">{cliente.numeroTel}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Produto
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedCliente.produto}
                  onChange={(e) =>
                    setEditedCliente({
                      ...editedCliente,
                      produto: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#2C1660] border border-[#FF2E63]/30 rounded-lg text-white focus:border-[#FF2E63] focus:outline-none"
                />
              ) : (
                <p className="text-white">{cliente.produto}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tamanho
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedCliente.tamanho}
                  onChange={(e) =>
                    setEditedCliente({
                      ...editedCliente,
                      tamanho: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#2C1660] border border-[#FF2E63]/30 rounded-lg text-white focus:border-[#FF2E63] focus:outline-none"
                />
              ) : (
                <p className="text-white">{cliente.tamanho}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preço
              </label>
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  value={editedCliente.preco}
                  onChange={(e) =>
                    setEditedCliente({
                      ...editedCliente,
                      preco: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#2C1660] border border-[#FF2E63]/30 rounded-lg text-white focus:border-[#FF2E63] focus:outline-none"
                />
              ) : (
                <p className="text-white">R$ {Number(cliente.preco).toFixed(2)}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Data de Cadastro
            </label>
            <p className="text-white">{cliente.data}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#FF2E63]/20">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>

          {isEditing && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-[#FF2E63] hover:bg-[#ff517f] text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Salvar
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ClienteDetalhes;

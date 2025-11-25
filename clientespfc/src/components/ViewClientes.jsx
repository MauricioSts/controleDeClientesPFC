import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  User,
  Instagram,
  Phone,
  ShoppingBag,
  Ruler,
  DollarSign,
  Check,
  Trash2,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import ClienteDetalhes from "./ClienteDetalhes";
import ConfirmModal from "./ConfirmModal";

function ViewClientes() {
  const { currentUser } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos"); // todos, pendentes, concluidos
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "clientes"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filtrar apenas clientes (não incluir pedidos com rastreio)
      const clientesFiltrados = lista.filter((item) => {
        if (item.tipo === "pedido") {
          return false;
        }
        return true;
      });

      // Ordenar por data de criação (mais recentes primeiro)
      clientesFiltrados.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      setClientes(clientesFiltrados);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleToggleConcluido = async (cliente) => {
    try {
      await updateDoc(doc(db, "clientes", cliente.id), {
        concluido: !cliente.concluido,
      });
      toast.success(
        cliente.concluido ? "Marcado como pendente!" : "Marcado como concluído!"
      );
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const handleTogglePedidoFeito = async (cliente) => {
    try {
      await updateDoc(doc(db, "clientes", cliente.id), {
        pedidoFeito: !cliente.pedidoFeito,
      });
      toast.success(
        cliente.pedidoFeito
          ? "Pedido marcado como não feito!"
          : "Pedido marcado como feito!"
      );
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      toast.error("Erro ao atualizar pedido");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "clientes", id));
      toast.success("Cliente removido com sucesso!");
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      toast.error("Erro ao remover cliente");
    }
  };

  // Filtrar clientes
  const filteredClientes = clientes.filter((cliente) => {
    const matchSearch =
      cliente.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.instagram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.produto?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchFilter =
      filterStatus === "todos" ||
      (filterStatus === "pendentes" && !cliente.concluido) ||
      (filterStatus === "concluidos" && cliente.concluido);

    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl animate-spin" style={{ color: "#3B82F6" }}>
          ⚙️
        </div>
        <p style={{ color: "#FFFFFF" }}>Carregando clientes...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Barra de Pesquisa e Filtros */}
      <div
        className="mb-6 p-4 rounded-xl"
        style={{ backgroundColor: "#1e293b", border: "1px solid #3B82F6" }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Pesquisa */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "#3B82F6" }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: "#0f172a",
                border: "1px solid #3B82F6",
                color: "#FFFFFF",
              }}
              placeholder="Buscar por nome, instagram ou produto..."
            />
          </div>

          {/* Filtro */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "#3B82F6" }}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: "#0f172a",
                border: "1px solid #3B82F6",
                color: "#FFFFFF",
              }}
            >
              <option value="todos">Todos</option>
              <option value="pendentes">Pendentes</option>
              <option value="concluidos">Concluídos</option>
            </select>
          </div>
        </div>

        {/* Contador */}
        <div className="mt-3 text-sm" style={{ color: "#94a3b8" }}>
          {filteredClientes.length} cliente(s) encontrado(s)
        </div>
      </div>

      {/* Lista de Clientes */}
      {filteredClientes.length === 0 ? (
        <div
          className="text-center py-12 rounded-xl"
          style={{ backgroundColor: "#1e293b", border: "1px solid #3B82F6" }}
        >
          <User className="w-16 h-16 mx-auto mb-4" style={{ color: "#3B82F6" }} />
          <p className="text-xl" style={{ color: "#FFFFFF" }}>
            Nenhum cliente encontrado
          </p>
          <p style={{ color: "#94a3b8" }}>
            {searchTerm
              ? "Tente uma busca diferente"
              : "Adicione seu primeiro cliente!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredClientes.map((cliente) => (
              <motion.div
                key={cliente.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 rounded-xl transition-all hover:shadow-lg"
                style={{
                  backgroundColor: "#1e293b",
                  border: `1px solid ${cliente.concluido ? "#14B8A6" : "#3B82F6"}`,
                }}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Info do Cliente */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4" style={{ color: "#3B82F6" }} />
                        <span className="font-semibold" style={{ color: "#FFFFFF" }}>
                          {cliente.nome}
                        </span>
                      </div>
                      {cliente.instagram && (
                        <div className="flex items-center gap-2 text-sm" style={{ color: "#94a3b8" }}>
                          <Instagram className="w-3 h-3" />
                          {cliente.instagram}
                        </div>
                      )}
                      {cliente.numeroTel && (
                        <div className="flex items-center gap-2 text-sm" style={{ color: "#94a3b8" }}>
                          <Phone className="w-3 h-3" />
                          {cliente.numeroTel}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ShoppingBag className="w-4 h-4" style={{ color: "#14B8A6" }} />
                        <span style={{ color: "#FFFFFF" }}>{cliente.produto}</span>
                      </div>
                      {cliente.tamanho && (
                        <div className="flex items-center gap-2 text-sm" style={{ color: "#94a3b8" }}>
                          <Ruler className="w-3 h-3" />
                          Tamanho: {cliente.tamanho}
                        </div>
                      )}
                      <div className="text-sm" style={{ color: "#94a3b8" }}>
                        Versão: {cliente.versao || "Fan"}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4" style={{ color: "#22c55e" }} />
                        <span className="font-bold text-lg" style={{ color: "#22c55e" }}>
                          R$ {cliente.preco?.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm" style={{ color: "#94a3b8" }}>
                        {cliente.data}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <span
                          className="px-2 py-0.5 rounded text-xs"
                          style={{
                            backgroundColor: cliente.concluido ? "#14B8A6" : "#ef4444",
                            color: "#FFFFFF",
                          }}
                        >
                          {cliente.concluido ? "Concluído" : "Pendente"}
                        </span>
                        {cliente.pedidoFeito && (
                          <span
                            className="px-2 py-0.5 rounded text-xs"
                            style={{ backgroundColor: "#8b5cf6", color: "#FFFFFF" }}
                          >
                            Pedido Feito
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCliente(cliente)}
                      className="p-2 rounded-lg transition-all"
                      style={{ backgroundColor: "#3B82F6", color: "#FFFFFF" }}
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleTogglePedidoFeito(cliente)}
                      className="p-2 rounded-lg transition-all"
                      style={{
                        backgroundColor: cliente.pedidoFeito ? "#8b5cf6" : "#4b5563",
                        color: "#FFFFFF",
                      }}
                      title={cliente.pedidoFeito ? "Desmarcar pedido" : "Marcar pedido feito"}
                    >
                      📦
                    </button>
                    <button
                      onClick={() => handleToggleConcluido(cliente)}
                      className="p-2 rounded-lg transition-all"
                      style={{
                        backgroundColor: cliente.concluido ? "#14B8A6" : "#4b5563",
                        color: "#FFFFFF",
                      }}
                      title={cliente.concluido ? "Desmarcar concluído" : "Marcar concluído"}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(cliente)}
                      className="p-2 rounded-lg transition-all"
                      style={{ backgroundColor: "#ef4444", color: "#FFFFFF" }}
                      title="Remover cliente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedCliente && (
        <ClienteDetalhes
          cliente={selectedCliente}
          onClose={() => setSelectedCliente(null)}
        />
      )}

      {/* Modal de Confirmação de Delete */}
      {deleteConfirm && (
        <ConfirmModal
          title="Remover Cliente"
          message={`Tem certeza que deseja remover "${deleteConfirm.nome}"?`}
          onConfirm={() => handleDelete(deleteConfirm.id)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

export default ViewClientes;


import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { PackagePlus, Edit3, Trash2, Save, X, CheckCircle } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

function OrdersManager() {
  const { currentUser } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]); // Lista de clientes disponíveis
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    numeroRastreio: "",
    clientesSelecionados: [], // Array de IDs de clientes
    observacoes: ""
  });

  // Buscar clientes
  useEffect(() => {
    if (!currentUser) return;

    // Buscar TODOS os documentos (tanto clientes quanto antigos pedidos que são clientes)
    const q = query(
      collection(db, "clientes"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Se não for pedido (tipo !== "pedido"), é um cliente
          isCustomer: data.isCustomer || (!data.tipo || data.tipo !== "pedido")
        };
      }).filter(item => item.isCustomer); // Filtrar apenas clientes
      
      setClientes(lista);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Buscar pedidos
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "clientes"),
      where("userId", "==", currentUser.uid),
      where("tipo", "==", "pedido")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPedidos(lista);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAdd = async () => {
    if (!formData.numeroRastreio) {
      toast.error("Número de rastreio é obrigatório!");
      return;
    }

    if (formData.clientesSelecionados.length === 0) {
      toast.error("Selecione pelo menos um cliente!");
      return;
    }

    try {
      console.log("Criando pedido com dados:", {
        tipo: "pedido",
        numeroRastreio: formData.numeroRastreio,
        clientesIds: formData.clientesSelecionados,
        observacoes: formData.observacoes,
        userId: currentUser.uid,
        dataCriacao: serverTimestamp(),
        concluido: false
      });

      await addDoc(collection(db, "clientes"), {
        tipo: "pedido",
        numeroRastreio: formData.numeroRastreio,
        clientesIds: formData.clientesSelecionados,
        observacoes: formData.observacoes,
        userId: currentUser.uid,
        dataCriacao: serverTimestamp(),
        concluido: false
      });

      console.log("Pedido criado com sucesso!");
      toast.success("Pedido criado com sucesso!");
      setIsAdding(false);
      setFormData({ numeroRastreio: "", clientesSelecionados: [], observacoes: "" });
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast.error(`Erro ao criar pedido: ${error.message}`);
    }
  };

  const handleEdit = (pedido) => {
    setEditingId(pedido.id);
    setFormData({
      numeroRastreio: pedido.numeroRastreio || "",
      clientesSelecionados: pedido.clientesIds || [],
      observacoes: pedido.observacoes || ""
    });
  };

  const handleSave = async (pedidoId) => {
    try {
      await updateDoc(doc(db, "clientes", pedidoId), {
        numeroRastreio: formData.numeroRastreio,
        clientesIds: formData.clientesSelecionados,
        observacoes: formData.observacoes
      });

      toast.success("Pedido atualizado com sucesso!");
      setEditingId(null);
      setFormData({ numeroRastreio: "", clientesSelecionados: [], observacoes: "" });
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      toast.error("Erro ao atualizar pedido");
    }
  };

  const handleDelete = (pedido) => {
    setPedidoToDelete(pedido);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!pedidoToDelete) return;

    try {
      await deleteDoc(doc(db, "clientes", pedidoToDelete.id));
      toast.success("Pedido removido com sucesso!");
      setShowDeleteModal(false);
      setPedidoToDelete(null);
    } catch (error) {
      console.error("Erro ao remover pedido:", error);
      toast.error("Erro ao remover pedido");
    }
  };

  const toggleConcluido = async (pedido) => {
    try {
      await updateDoc(doc(db, "clientes", pedido.id), {
        concluido: !pedido.concluido
      });
      toast.success(pedido.concluido ? "Pedido reaberto!" : "Pedido concluído!");
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      toast.error("Erro ao atualizar pedido");
    }
  };

  const toggleClienteSelection = (clienteId) => {
    if (formData.clientesSelecionados.includes(clienteId)) {
      setFormData({
        ...formData,
        clientesSelecionados: formData.clientesSelecionados.filter(id => id !== clienteId)
      });
    } else {
      setFormData({
        ...formData,
        clientesSelecionados: [...formData.clientesSelecionados, clienteId]
      });
    }
  };

  const getClientesDoPedido = (pedido) => {
    if (!pedido.clientesIds) return [];
    return clientes.filter(cliente => pedido.clientesIds.includes(cliente.id));
  };

  // Obter clientes que já estão em algum pedido
  const clientesEmPedidos = pedidos.flatMap(pedido => pedido.clientesIds || []);

  // Clientes disponíveis para seleção (não estão em nenhum pedido)
  const clientesDisponiveis = clientes.filter(cliente => {
    // Se estamos editando, incluir os clientes que já estão nesse pedido específico
    if (editingId) {
      const pedidoAtual = pedidos.find(p => p.id === editingId);
      const clientesNoPedidoAtual = pedidoAtual?.clientesIds || [];
      // Cliente disponível se: não está em nenhum pedido OU já está no pedido atual sendo editado
      return !clientesEmPedidos.includes(cliente.id) || clientesNoPedidoAtual.includes(cliente.id);
    }
    // Se estamos adicionando novo, mostrar apenas clientes que não estão em nenhum pedido
    // E também excluir clientes que já foram marcados como concluídos ou com pedido feito
    return !clientesEmPedidos.includes(cliente.id) && !cliente.concluido && !cliente.pedidoFeito;
  });

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ numeroRastreio: "", clientesSelecionados: [], observacoes: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{color: '#3B82F6'}}>Gerenciar Pedidos</h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
              clientesDisponiveis.length === 0 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={clientesDisponiveis.length === 0}
          >
            <PackagePlus className="w-5 h-5" />
            Criar Pedido
          </button>
        )}
      </div>

      {clientes.length === 0 && (
        <div className="p-6 rounded-xl text-center" style={{backgroundColor: '#1e293b', border: '1px solid #ef4444'}}>
          <p style={{color: '#ef4444'}}>
            ⚠️ Você precisa cadastrar clientes primeiro! Acesse a aba "👥 Clientes".
          </p>
        </div>
      )}

      {clientes.length > 0 && clientesDisponiveis.length === 0 && !isAdding && !editingId && (
        <div className="p-6 rounded-xl text-center" style={{backgroundColor: '#1e293b', border: '1px solid #f59e0b'}}>
          <p style={{color: '#f59e0b'}}>
            ⚠️ Todos os clientes já estão associados a pedidos ou marcados como concluídos/pedido feito.
            <br />
            <span className="text-sm" style={{color: '#999'}}>
              Adicione novos clientes ou remova clientes de pedidos existentes para criar novos pedidos.
            </span>
          </p>
        </div>
      )}

      {/* Formulário de adicionar/editar */}
      {(isAdding || editingId) && (
        <div className="p-6 rounded-xl" style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6'}}>
          <h3 className="text-lg font-bold mb-4" style={{color: '#3B82F6'}}>
            {isAdding ? "Novo Pedido" : "Editar Pedido"}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFFFFF'}}>
                Número de Rastreio *
              </label>
              <input
                type="text"
                value={formData.numeroRastreio}
                onChange={(e) => setFormData({...formData, numeroRastreio: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                placeholder="Ex: BR123456789BR"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFFFFF'}}>
                Selecionar Clientes * (múltiplos)
              </label>
              {clientesDisponiveis.length === 0 ? (
                <div className="p-4 rounded-lg text-center" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444'}}>
                  <p style={{color: '#ef4444'}}>
                    ⚠️ Não há clientes disponíveis. Todos os clientes já estão associados a pedidos ou marcados como concluídos.
                  </p>
                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-4 rounded-lg" style={{backgroundColor: 'rgba(55, 65, 81, 0.3)'}}>
                {clientesDisponiveis.map((cliente) => (
                  <label key={cliente.id} className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors" style={{backgroundColor: formData.clientesSelecionados.includes(cliente.id) ? 'rgba(59, 130, 246, 0.2)' : ''}}>
                    <input
                      type="checkbox"
                      checked={formData.clientesSelecionados.includes(cliente.id)}
                      onChange={() => toggleClienteSelection(cliente.id)}
                      className="w-5 h-5 rounded mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold" style={{color: '#FFFFFF'}}>{cliente.nome}</p>
                      {cliente.instagram && (
                        <p className="text-sm" style={{color: '#999'}}>@{cliente.instagram}</p>
                      )}
                      {cliente.produto && (
                        <p className="text-sm mt-1" style={{color: '#14B8A6'}}>
                          Produto: {cliente.produto}
                        </p>
                      )}
                      {cliente.preco && (
                        <p className="text-sm font-bold mt-1" style={{color: '#10B981'}}>
                          R$ {cliente.preco.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              )}
              {formData.clientesSelecionados.length > 0 && (
                <div className="mt-2 p-3 rounded-lg" style={{backgroundColor: 'rgba(20, 184, 166, 0.1)'}}>
                  <p className="text-sm mb-1" style={{color: '#14B8A6'}}>
                    {formData.clientesSelecionados.length} cliente(s) selecionado(s)
                  </p>
                  <p className="text-lg font-bold" style={{color: '#10B981'}}>
                    Valor Total: R$ {clientes
                      .filter(c => formData.clientesSelecionados.includes(c.id))
                      .reduce((total, c) => total + (c.preco || 0), 0).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFFFFF'}}>
                Observações
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                rows="3"
                placeholder="Observações sobre o pedido"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={isAdding ? handleAdd : () => handleSave(editingId)}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Salvar
              </button>
              <button
                onClick={isAdding ? () => setIsAdding(false) : cancelEdit}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de pedidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pedidos.map((pedido) => {
          const clientesDoPedido = getClientesDoPedido(pedido);
          return (
            <div
              key={pedido.id}
              className={`p-6 rounded-xl ${pedido.concluido ? 'opacity-75' : ''}`}
              style={{
                backgroundColor: '#1e293b',
                border: pedido.concluido ? '1px solid #10B981' : '1px solid #3B82F6'
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {pedido.concluido && <CheckCircle className="w-5 h-5" style={{color: '#10B981'}} />}
                    <h3 className="font-bold text-lg" style={{color: pedido.concluido ? '#10B981' : '#3B82F6'}}>
                      {pedido.numeroRastreio || "Sem rastreio"}
                    </h3>
                  </div>
                  <p className="text-sm" style={{color: '#999'}}>
                    {pedido.dataCriacao?.toDate?.()?.toLocaleDateString('pt-BR') || 
                     pedido.dataCriacao?.toLocaleDateString?.('pt-BR') || 
                     "Data não disponível"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleConcluido(pedido)}
                    className="p-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 transition-colors"
                    title={pedido.concluido ? "Reabrir" : "Marcar como concluído"}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(pedido)}
                    className="p-2 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 transition-colors"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pedido)}
                    className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Clientes do pedido */}
              {clientesDoPedido.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium mb-2" style={{color: '#999'}}>
                    Clientes ({clientesDoPedido.length}):
                  </p>
                  <div className="space-y-2">
                    {clientesDoPedido.map((cliente) => (
                      <div key={cliente.id} className="pl-3 border-l-2" style={{borderColor: '#3B82F6'}}>
                        <p className="text-sm font-semibold" style={{color: '#FFFFFF'}}>
                          • {cliente.nome}
                        </p>
                        {cliente.produto && (
                          <p className="text-sm" style={{color: '#999'}}>
                            Produto: {cliente.produto}
                          </p>
                        )}
                        {cliente.preco && (
                          <p className="text-sm font-bold" style={{color: '#14B8A6'}}>
                            R$ {cliente.preco.toFixed(2)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Valor total do pedido */}
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-sm font-semibold" style={{color: '#3B82F6'}}>
                      Valor Total: R$ {clientesDoPedido.reduce((total, c) => total + (c.preco || 0), 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {pedido.observacoes && (
                <div className="pt-3 border-t border-gray-700">
                  <p className="text-sm" style={{color: '#999'}}>
                    <span className="font-medium">Obs:</span> {pedido.observacoes}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pedidos.length === 0 && (
        <div className="text-center py-12 rounded-xl" style={{backgroundColor: '#1e293b'}}>
          <p style={{color: '#999'}}>Nenhum pedido criado</p>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPedidoToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Remover Pedido"
        message={`Tem certeza que deseja remover o pedido ${pedidoToDelete?.numeroRastreio}?`}
        confirmText="Remover"
        cancelText="Cancelar"
      />
    </div>
  );
}

export default OrdersManager;

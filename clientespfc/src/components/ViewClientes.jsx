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
import { Eye, Edit3, Save, X, CheckCircle, Circle } from "lucide-react";
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
    setClientes([...clientes]);
  }, [clientes]);

  // Filtrar clientes por aba ativa
  const clientesFiltrados = useMemo(() => clientes, [clientes]);

  // Memoizar a lista de clientes para evitar re-renders desnecessários
  const clientesACaminho = useMemo(() => 
    clientesFiltrados.filter((c) => c.pedidoFeito && !c.concluido).length, 
    [clientesFiltrados]
  );

  return (
    <div>
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="backdrop-blur-sm rounded-xl p-6 text-center shadow-2xl" style={{backgroundColor: '#FF2D5B', border: '1px solid #FF2D5B'}}>
          <div className="text-3xl font-bold mb-2" style={{color: '#FFFFFF'}}>{clientesFiltrados.length}</div>
          <div style={{color: '#FFFFFF'}}>Total de Pedidos</div>
        </div>
        <div className="backdrop-blur-sm rounded-xl p-6 text-center shadow-2xl" style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B'}}>
          <div className="text-3xl font-bold mb-2" style={{color: '#FF2D5B'}}>{clientesACaminho}</div>
          <div style={{color: '#FFFFFF'}}>A Caminho</div>
        </div>
        <div className="backdrop-blur-sm rounded-xl p-6 text-center shadow-2xl" style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B'}}>
          <div className="text-3xl font-bold mb-2" style={{color: '#FF2D5B'}}>
            {clientesFiltrados.filter(c => c.concluido).length}
          </div>
          <div style={{color: '#FFFFFF'}}>Concluídos</div>
        </div>
        <div className="backdrop-blur-sm rounded-xl p-6 text-center shadow-2xl" style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B'}}>
          <div className="text-3xl font-bold mb-2" style={{color: '#FF2D5B'}}>
            R$ {clientesFiltrados.reduce((total, c) => total + (c.preco || 0), 0).toFixed(2)}
          </div>
          <div style={{color: '#FFFFFF'}}>Valor Total</div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {clientesFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2" style={{color: '#FF2D5B'}}>
            Nenhum pedido encontrado
          </h3>
          <p style={{color: '#FFFFFF'}}>
            Adicione pedidos para vê-los aqui
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientesFiltrados.map((cliente) => (
            <div
              key={cliente.id}
              className="backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                backgroundColor: '#0D0630',
                border: cliente.concluido ? '1px solid #0D0630' : '1px solid #FF2D5B',
                opacity: cliente.concluido ? 0.75 : 1
              }}
              onMouseEnter={(e) => {
                if (!cliente.concluido) {
                  e.target.style.borderColor = '#FF6B8A';
                  e.target.style.boxShadow = '0 0 20px rgba(255, 45, 91, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!cliente.concluido) {
                  e.target.style.borderColor = '#FF2D5B';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {editingCliente === cliente.id ? (
                // Modo de edição
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={editData.nome}
                      onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                      className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B', color: '#FFFFFF'}}
                      onFocus={(e) => e.target.style.borderColor = '#FF6B8A'}
                      onBlur={(e) => e.target.style.borderColor = '#FF2D5B'}
                      placeholder="Nome"
                    />
                    <input
                      value={editData.instagram}
                      onChange={(e) => setEditData({ ...editData, instagram: e.target.value })}
                      className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B', color: '#FFFFFF'}}
                      onFocus={(e) => e.target.style.borderColor = '#FF6B8A'}
                      onBlur={(e) => e.target.style.borderColor = '#FF2D5B'}
                      placeholder="Instagram"
                    />
                    <input
                      value={editData.produto}
                      onChange={(e) => setEditData({ ...editData, produto: e.target.value })}
                      className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B', color: '#FFFFFF'}}
                      onFocus={(e) => e.target.style.borderColor = '#FF6B8A'}
                      onBlur={(e) => e.target.style.borderColor = '#FF2D5B'}
                      placeholder="Produto"
                    />
                    <input
                      value={editData.tamanho}
                      onChange={(e) => setEditData({ ...editData, tamanho: e.target.value })}
                      className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B', color: '#FFFFFF'}}
                      onFocus={(e) => e.target.style.borderColor = '#FF6B8A'}
                      onBlur={(e) => e.target.style.borderColor = '#FF2D5B'}
                      placeholder="Tamanho"
                    />
                    <input
                      value={editData.preco}
                      onChange={(e) => setEditData({ ...editData, preco: e.target.value })}
                      className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B', color: '#FFFFFF'}}
                      onFocus={(e) => e.target.style.borderColor = '#FF6B8A'}
                      onBlur={(e) => e.target.style.borderColor = '#FF2D5B'}
                      placeholder="Preço"
                    />
                    <input
                      value={editData.numeroTel}
                      onChange={(e) => setEditData({ ...editData, numeroTel: e.target.value })}
                      className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B', color: '#FFFFFF'}}
                      onFocus={(e) => e.target.style.borderColor = '#FF6B8A'}
                      onBlur={(e) => e.target.style.borderColor = '#FF2D5B'}
                      placeholder="Telefone"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(cliente)}
                      className="flex-1 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                      style={{backgroundColor: '#FF2D5B', color: '#FFFFFF'}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#FF6B8A'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#FF2D5B'}
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Salvar
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="flex-1 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                      style={{backgroundColor: '#FF2D5B', color: '#FFFFFF'}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#FF6B8A'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#FF2D5B'}
                    >
                      <X className="w-4 h-4 inline mr-2" />
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo de visualização
                <div className="space-y-4">
                  {/* Header do Card */}
                  <div className="text-center">
                    <h3 
                      className={`text-xl font-bold mb-1 ${
                        cliente.concluido ? "line-through" : ""
                      }`}
                      style={{color: cliente.concluido ? '#FFFFFF' : '#FF2D5B'}}
                    >
                  {cliente.nome}
                    </h3>
                    <p className="text-sm" style={{color: '#FFFFFF'}}>@{cliente.instagram}</p>
                  </div>

                  {/* Informações do Produto */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{color: '#FFFFFF'}}>Produto:</span>
                      <span className={`${cliente.concluido ? "line-through" : ""}`} style={{color: cliente.concluido ? '#FFFFFF' : '#FF2D5B'}}>
                        {cliente.produto}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{color: '#FFFFFF'}}>Versão:</span>
                      <span className={`${cliente.concluido ? "line-through" : ""}`} style={{color: cliente.concluido ? '#FFFFFF' : '#FF2D5B'}}>
                        {cliente.versao || "fan"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{color: '#FFFFFF'}}>Tamanho:</span>
                      <span className={`${cliente.concluido ? "line-through" : ""}`} style={{color: cliente.concluido ? '#FFFFFF' : '#FF2D5B'}}>
                        {cliente.tamanho}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{color: '#FFFFFF'}}>Valor:</span>
                      <span className={`font-semibold ${cliente.concluido ? "line-through" : ""}`} style={{color: cliente.concluido ? '#FFFFFF' : '#FF2D5B'}}>
                        R$ {Number(cliente.preco).toFixed(2)}
                      </span>
                    </div>
                    {cliente.nomeCamisa && (
                      <div className="flex justify-between text-sm">
                        <span style={{color: '#FFFFFF'}}>Nome na Camisa:</span>
                        <span className={`${cliente.concluido ? "line-through" : ""}`} style={{color: cliente.concluido ? '#FFFFFF' : '#FF2D5B'}}>
                          {cliente.nomeCamisa}
                        </span>
                      </div>
                    )}
                    {cliente.numeroCamisa && (
                      <div className="flex justify-between text-sm">
                        <span style={{color: '#FFFFFF'}}>Número na Camisa:</span>
                        <span className={`${cliente.concluido ? "line-through" : ""}`} style={{color: cliente.concluido ? '#FFFFFF' : '#FF2D5B'}}>
                          {cliente.numeroCamisa}
                        </span>
                      </div>
                    )}
              </div>

                  {/* Status e Ações */}
                  <div className="pt-4 border-t border-white/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleConcluido(cliente)}
                          className="flex items-center gap-2 text-sm font-medium transition-colors"
                          style={{color: '#FFFFFF'}}
                          onMouseEnter={(e) => e.target.style.color = '#FF2D5B'}
                          onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
                        >
                          {cliente.concluido ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                          Concluído
                        </button>
                        <button
                          onClick={() => togglePedidoFeito(cliente)}
                          className="flex items-center gap-2 text-sm font-medium transition-colors"
                          style={{color: '#FFFFFF'}}
                          onMouseEnter={(e) => e.target.style.color = '#FF2D5B'}
                          onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
                        >
                          {cliente.pedidoFeito ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                          Pedido Feito
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedCliente(cliente)}
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => startEditing(cliente)}
                          className="p-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
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
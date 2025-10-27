import { useEffect, useState, useCallback, useMemo } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Eye, Edit3, Save, X, CheckCircle, Circle, Trash2, List, BarChart3, CreditCard } from "lucide-react";
import ClienteDetalhes from "./ClienteDetalhes";
import EstatisticasMensais from "./EstatisticasMensais";
import Planos from "./Planos";

function ViewClientes() {
  const { currentUser } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [editingCliente, setEditingCliente] = useState(null);
  const [editData, setEditData] = useState({});
  const [abaAtiva, setAbaAtiva] = useState('lista'); // 'lista' ou 'estatisticas'

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
      // Ordenar por createdAt descendentemente
      const listaOrdenada = lista.sort((a, b) => {
        if (b.createdAt && a.createdAt) {
          // Se for um timestamp do Firestore
          if (typeof b.createdAt.toMillis === 'function') {
            return b.createdAt.toMillis() - a.createdAt.toMillis();
          }
          // Se for uma data string ou timestamp numérico
          const timeB = new Date(b.createdAt).getTime();
          const timeA = new Date(a.createdAt).getTime();
          return timeB - timeA;
        }
        return 0;
      });
      setClientes(listaOrdenada);
    });

    return () => unsubscribe();
  }, [currentUser]);

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

  const handleDelete = useCallback(async (cliente) => {
    if (window.confirm(`Tem certeza que deseja excluir o pedido de ${cliente.nome}?`)) {
      try {
        const ref = doc(db, "clientes", cliente.id);
        await deleteDoc(ref);
        toast.success("Pedido excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir pedido:", error);
        toast.error("Erro ao excluir pedido");
      }
    }
  }, []);

  // Filtrar clientes por aba ativa
  const clientesFiltrados = useMemo(() => clientes, [clientes]);

  // Memoizar a lista de clientes para evitar re-renders desnecessários
  const clientesACaminho = useMemo(() => 
    clientesFiltrados.filter((c) => c.pedidoFeito && !c.concluido).length, 
    [clientesFiltrados]
  );

  return (
    <div>
      {/* Abas de Navegação */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setAbaAtiva('lista')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            abaAtiva === 'lista' 
              ? 'shadow-lg' 
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: abaAtiva === 'lista' ? '#3B82F6' : '#1e293b',
            color: '#FFFFFF',
            border: '1px solid #3B82F6'
          }}
          onMouseEnter={(e) => {
            if (abaAtiva !== 'lista') e.target.style.backgroundColor = '#14B8A6';
          }}
          onMouseLeave={(e) => {
            if (abaAtiva !== 'lista') e.target.style.backgroundColor = '#1e293b';
          }}
        >
          <List className="w-5 h-5" />
          Lista de Pedidos
        </button>
        <button
          onClick={() => setAbaAtiva('estatisticas')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            abaAtiva === 'estatisticas' 
              ? 'shadow-lg' 
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: abaAtiva === 'estatisticas' ? '#14B8A6' : '#1e293b',
            color: '#FFFFFF',
            border: '1px solid #14B8A6'
          }}
          onMouseEnter={(e) => {
            if (abaAtiva !== 'estatisticas') e.target.style.backgroundColor = '#3B82F6';
          }}
          onMouseLeave={(e) => {
            if (abaAtiva !== 'estatisticas') e.target.style.backgroundColor = '#1e293b';
          }}
        >
          <BarChart3 className="w-5 h-5" />
          Estatísticas Mensais
        </button>
        <button
          onClick={() => setAbaAtiva('planos')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            abaAtiva === 'planos' 
              ? 'shadow-lg' 
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: abaAtiva === 'planos' ? '#14B8A6' : '#1e293b',
            color: '#FFFFFF',
            border: '1px solid #14B8A6'
          }}
          onMouseEnter={(e) => {
            if (abaAtiva !== 'planos') e.target.style.backgroundColor = '#3B82F6';
          }}
          onMouseLeave={(e) => {
            if (abaAtiva !== 'planos') e.target.style.backgroundColor = '#1e293b';
          }}
        >
          <CreditCard className="w-5 h-5" />
          Planos
        </button>
      </div>

      {/* Estatísticas - Mostrar apenas nas abas Lista e Estatísticas */}
      {abaAtiva !== 'planos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="backdrop-blur-sm rounded-xl p-6 text-center shadow-2xl" style={{backgroundColor: '#3B82F6', border: '1px solid #3B82F6'}}>
          <div className="text-3xl font-bold mb-2" style={{color: '#FFFFFF'}}>{clientesFiltrados.length}</div>
          <div style={{color: '#FFFFFF'}}>Total de Pedidos</div>
        </div>
        <div className="backdrop-blur-sm rounded-xl p-6 text-center shadow-2xl" style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6'}}>
          <div className="text-3xl font-bold mb-2" style={{color: '#3B82F6'}}>{clientesACaminho}</div>
          <div style={{color: '#FFFFFF'}}>A Caminho</div>
        </div>
        <div className="backdrop-blur-sm rounded-xl p-6 text-center shadow-2xl" style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6'}}>
          <div className="text-3xl font-bold mb-2" style={{color: '#3B82F6'}}>
            {clientesFiltrados.filter(c => c.concluido).length}
          </div>
          <div style={{color: '#FFFFFF'}}>Concluídos</div>
        </div>
        <div className="backdrop-blur-sm rounded-xl p-6 text-center shadow-2xl" style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6'}}>
          <div className="text-3xl font-bold mb-2" style={{color: '#3B82F6'}}>
            R$ {clientesFiltrados.reduce((total, c) => total + (c.preco || 0), 0).toFixed(2)}
          </div>
          <div style={{color: '#FFFFFF'}}>Valor Total</div>
        </div>
      </div>
      )}

      {/* Conteúdo baseado na aba ativa */}
      {abaAtiva === 'planos' ? (
        <Planos planoAtual="free" />
      ) : abaAtiva === 'estatisticas' ? (
        <EstatisticasMensais clientes={clientesFiltrados} />
      ) : (
        <>
      {/* Lista de Pedidos */}
      {clientesFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2" style={{color: '#3B82F6'}}>
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
              className="backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
              style={{
                backgroundColor: '#1e293b',
                border: cliente.concluido ? '1px solid rgba(20, 184, 166, 0.3)' : '1px solid #3B82F6',
                opacity: cliente.concluido ? 0.65 : 1
              }}
              onClick={() => {
                if (!cliente.concluido && editingCliente !== cliente.id) {
                  startEditing(cliente);
                }
              }}
              onMouseEnter={(e) => {
                if (!cliente.concluido && editingCliente !== cliente.id) {
                  e.target.style.borderColor = '#14B8A6';
                  e.target.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!cliente.concluido) {
                  e.target.style.borderColor = '#3B82F6';
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
                      style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF'}}
                      onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
                      onBlur={(e) => e.target.style.borderColor = '#3B82F6'}
                      placeholder="Nome"
                    />
                    <input
                      value={editData.instagram}
                      onChange={(e) => setEditData({ ...editData, instagram: e.target.value })}
                      className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF'}}
                      onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
                      onBlur={(e) => e.target.style.borderColor = '#3B82F6'}
                      placeholder="Instagram"
                    />
                    <input
                      value={editData.produto}
                      onChange={(e) => setEditData({ ...editData, produto: e.target.value })}
                      className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF'}}
                      onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
                      onBlur={(e) => e.target.style.borderColor = '#3B82F6'}
                      placeholder="Produto"
                    />
                    <input
                      value={editData.tamanho}
                      onChange={(e) => setEditData({ ...editData, tamanho: e.target.value })}
                      className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF'}}
                      onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
                      onBlur={(e) => e.target.style.borderColor = '#3B82F6'}
                      placeholder="Tamanho"
                    />
                    <input
                      value={editData.preco}
                      onChange={(e) => setEditData({ ...editData, preco: e.target.value })}
                      className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF'}}
                      onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
                      onBlur={(e) => e.target.style.borderColor = '#3B82F6'}
                      placeholder="Preço"
                    />
                    <input
                      value={editData.numeroTel}
                      onChange={(e) => setEditData({ ...editData, numeroTel: e.target.value })}
                      className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF'}}
                      onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
                      onBlur={(e) => e.target.style.borderColor = '#3B82F6'}
                      placeholder="Telefone"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(cliente)}
                      className="flex-1 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                      style={{backgroundColor: '#3B82F6', color: '#FFFFFF'}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#14B8A6'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Salvar
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="flex-1 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                      style={{backgroundColor: '#3B82F6', color: '#FFFFFF'}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#14B8A6'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
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
                      style={{color: cliente.concluido ? '#FFFFFF' : '#3B82F6'}}
                    >
                  {cliente.nome}
                    </h3>
                    <p className="text-sm" style={{color: '#FFFFFF'}}>@{cliente.instagram}</p>
                  </div>

                  {/* Informações do Produto */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{color: '#FFFFFF'}}>Produto:</span>
                      <span className={`${cliente.concluido ? "line-through" : ""}`} style={{color: cliente.concluido ? '#FFFFFF' : '#3B82F6'}}>
                        {cliente.produto}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{color: '#FFFFFF'}}>Versão:</span>
                      <span className={`${cliente.concluido ? "line-through" : ""}`} style={{color: cliente.concluido ? '#FFFFFF' : '#3B82F6'}}>
                        {cliente.versao || "fan"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{color: '#FFFFFF'}}>Tamanho:</span>
                      <span className={`${cliente.concluido ? "line-through" : ""}`} style={{color: cliente.concluido ? '#FFFFFF' : '#3B82F6'}}>
                        {cliente.tamanho}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{color: '#FFFFFF'}}>Valor:</span>
                      <span className={`font-semibold ${cliente.concluido ? "line-through" : ""}`} style={{color: cliente.concluido ? '#FFFFFF' : '#3B82F6'}}>
                        R$ {Number(cliente.preco).toFixed(2)}
                      </span>
                    </div>
                    {cliente.nomeCamisa && (
                      <div className="flex justify-between text-sm">
                        <span style={{color: '#FFFFFF'}}>Nome na Camisa:</span>
                        <span className={`${cliente.concluido ? "line-through" : ""}`} style={{color: cliente.concluido ? '#FFFFFF' : '#3B82F6'}}>
                          {cliente.nomeCamisa}
                        </span>
                      </div>
                    )}
                    {cliente.numeroCamisa && (
                      <div className="flex justify-between text-sm">
                        <span style={{color: '#FFFFFF'}}>Número na Camisa:</span>
                        <span className={`${cliente.concluido ? "line-through" : ""}`} style={{color: cliente.concluido ? '#FFFFFF' : '#3B82F6'}}>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleConcluido(cliente);
                          }}
                          className="flex items-center gap-2 text-sm font-medium transition-colors"
                          style={{color: cliente.concluido ? '#14B8A6' : '#FFFFFF'}}
                          onMouseEnter={(e) => e.target.style.color = '#14B8A6'}
                          onMouseLeave={(e) => e.target.style.color = cliente.concluido ? '#14B8A6' : '#FFFFFF'}
                        >
                          {cliente.concluido ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                          Concluído
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePedidoFeito(cliente);
                          }}
                          className="flex items-center gap-2 text-sm font-medium transition-colors"
                          style={{color: cliente.pedidoFeito ? '#3B82F6' : '#FFFFFF'}}
                          onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
                          onMouseLeave={(e) => e.target.style.color = cliente.pedidoFeito ? '#3B82F6' : '#FFFFFF'}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCliente(cliente);
                          }}
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(cliente);
                          }}
                          className="p-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(cliente);
                          }}
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
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
        </>
      )}

      {/* Modal de detalhes */}
      {selectedCliente && (
        <ClienteDetalhes
          cliente={selectedCliente}
          onClose={() => setSelectedCliente(null)}
        />
      )}
    </div>
  );
}

export default ViewClientes;
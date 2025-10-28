import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, setDoc, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Check, X, AlertCircle, User, Mail, Calendar, DollarSign, LogOut, Trash2, Users, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

const ADMIN_EMAIL = "mauriciogear4@gmail.com";

function AdminPanel({ onBack }) {
  const { currentUser, logout } = useAuth();
  const [pendingUpgrades, setPendingUpgrades] = useState([]);
  const [proUsers, setProUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    if (currentUser && currentUser.email === ADMIN_EMAIL) {
      fetchPendingUpgrades();
      fetchProUsers();
      fetchUserStats();
    }
  }, [currentUser]);

  const fetchPendingUpgrades = async () => {
    try {
      // Buscar usuários com approved: false
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("approved", "==", false));
      
      const snapshot = await getDocs(q);
      const pending = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Filtrar admin - nunca deve aparecer na lista
        if (data.email === 'mauriciogear4@gmail.com') {
          return;
        }
        
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt;
        pending.push({
          id: doc.id,
          uid: data.uid,
          email: data.email || "Email não disponível",
          pendingDate: createdAt || new Date(),
          ...data
        });
      });
      
      // Ordenar por data (mais recente primeiro)
      pending.sort((a, b) => new Date(b.pendingDate) - new Date(a.pendingDate));
      
      setPendingUpgrades(pending);
    } catch (error) {
      console.error("Erro ao buscar usuários pendentes:", error);
      toast.error("Erro ao carregar usuários pendentes");
    } finally {
      setLoading(false);
    }
  };

  const fetchProUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("approved", "==", true));
      
      const snapshot = await getDocs(q);
      const approved = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Filtrar admin - nunca deve aparecer nas listas
        if (data.email === 'mauriciogear4@gmail.com') {
          return;
        }
        
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : 
                         data.approvedDate?.toDate ? data.approvedDate.toDate() : 
                         data.createdAt || data.approvedDate || new Date();
        approved.push({
          id: doc.id,
          email: data.email || "Email não disponível",
          approvedDate: createdAt instanceof Date ? createdAt : new Date(createdAt),
          ...data
        });
      });
      
      // Ordenar por data (mais recente primeiro)
      approved.sort((a, b) => {
        const dateA = a.approvedDate instanceof Date ? a.approvedDate : new Date(a.approvedDate || 0);
        const dateB = b.approvedDate instanceof Date ? b.approvedDate : new Date(b.approvedDate || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setProUsers(approved);
    } catch (error) {
      console.error("Erro ao buscar usuários aprovados:", error);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Buscar todos os usuários aprovados
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("approved", "==", true));
      const usersSnapshot = await getDocs(q);
      
      const stats = {};
      
      // Para cada usuário, contar seus clientes
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        
        // Filtrar admin
        if (userData.email === 'mauriciogear4@gmail.com') {
          continue;
        }
        
        const clientesRef = collection(db, "clientes");
        const clientesQuery = query(clientesRef, where("userId", "==", userDoc.id));
        const clientesSnapshot = await getDocs(clientesQuery);
        
        // Calcular estatísticas
        let totalClientes = 0;
        let clientesConcluidos = 0;
        let clientesPendentes = 0;
        let valorTotal = 0;
        
        clientesSnapshot.forEach((clienteDoc) => {
          const clienteData = clienteDoc.data();
          totalClientes++;
          
          if (clienteData.concluido) {
            clientesConcluidos++;
          } else {
            clientesPendentes++;
          }
          
          valorTotal += clienteData.preco || 0;
        });
        
        stats[userDoc.id] = {
          email: userData.email,
          totalClientes,
          clientesConcluidos,
          clientesPendentes,
          valorTotal: valorTotal.toFixed(2)
        };
      }
      
      setUserStats(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas dos usuários:", error);
    }
  };

  const approveUpgrade = async (userId, userEmail, userUid) => {
    try {
      // Atualizar usuário para aprovado
      await updateDoc(doc(db, "users", userId), {
        approved: true,
        approvedDate: serverTimestamp(),
        approvedBy: currentUser.email
      });

      toast.success(`✅ Usuário aprovado: ${userEmail}`);
      fetchPendingUpgrades();
      fetchProUsers();
      fetchUserStats();
    } catch (error) {
      console.error("Erro ao aprovar usuário:", error);
      toast.error("Erro ao aprovar usuário");
    }
  };

  const rejectUpgrade = async (userId, userEmail) => {
    try {
      // Deletar usuário rejeitado
      await deleteDoc(doc(db, "users", userId));

      toast.success(`❌ Usuário rejeitado: ${userEmail}`);
      fetchPendingUpgrades();
    } catch (error) {
      console.error("Erro ao rejeitar usuário:", error);
      toast.error("Erro ao rejeitar usuário");
    }
  };

  const handleRemoveUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmRemoveUser = async () => {
    if (!userToDelete) return;
    
    try {
      // Deletar usuário aprovado
      await deleteDoc(doc(db, "users", userToDelete.id));

      toast.success(`🗑️ Usuário removido: ${userToDelete.email}`);
      fetchProUsers();
      fetchUserStats();
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
      toast.error("Erro ao remover usuário");
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  // Verificar se é admin
  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0f766e 50%, #1e3a8a 100%)'
      }}>
        <div className="text-center p-8 rounded-2xl max-w-md" style={{
          backgroundColor: '#1e293b',
          border: '2px solid #ef4444'
        }}>
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{color: '#ef4444'}} />
          <h2 className="text-2xl font-bold mb-2" style={{color: '#ef4444'}}>
            Acesso Negado
          </h2>
          <p style={{color: '#FFFFFF'}}>
            Apenas o administrador pode acessar este painel.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0f766e 50%, #1e3a8a 100%)'
      }}>
        <div className="text-xl" style={{color: '#FFFFFF'}}>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #0f766e 50%, #1e3a8a 100%)'
    }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #14B8A6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Painel Admin
            </h1>
            <p className="text-xl" style={{color: '#FFFFFF'}}>
              Gerenciamento de Upgrades PRO
            </p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6" style={{color: '#3B82F6'}} />
              <span style={{color: '#FFFFFF'}}>
                <span style={{color: '#14B8A6', fontWeight: 'bold'}}>{currentUser.email}</span>
              </span>
            </div>
            <div className="flex gap-2">
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-6 py-3 rounded-xl font-medium transition-all"
                  style={{ backgroundColor: '#3B82F6', color: '#FFFFFF' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
                >
                  Voltar para App
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all"
                style={{ backgroundColor: '#ef4444', color: '#FFFFFF' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#ef4444', border: '2px solid #dc2626' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" style={{color: '#FFFFFF'}} />
                <span className="font-bold" style={{color: '#FFFFFF'}}>Pendentes</span>
              </div>
              <div className="text-3xl font-bold" style={{color: '#FFFFFF'}}>
                {pendingUpgrades.length}
              </div>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#3B82F6', border: '2px solid #2563EB' }}>
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5" style={{color: '#FFFFFF'}} />
                <span className="font-bold" style={{color: '#FFFFFF'}}>Aprovados</span>
              </div>
              <div className="text-3xl font-bold" style={{color: '#FFFFFF'}}>
                {proUsers.length}
              </div>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#14B8A6', border: '2px solid #0f766e' }}>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5" style={{color: '#FFFFFF'}} />
                <span className="font-bold" style={{color: '#FFFFFF'}}>Total de Usuários</span>
              </div>
              <div className="text-3xl font-bold" style={{color: '#FFFFFF'}}>
                {pendingUpgrades.length + proUsers.length}
              </div>
            </div>
          </div>
        </div>

        {/* Pendentes */}
        {pendingUpgrades.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{color: '#ef4444'}}>
              ⚠️ Usuários Pendentes de Aprovação
            </h2>
            <div className="space-y-4">
              {pendingUpgrades.map((upgrade) => (
                <div
                  key={upgrade.id}
                  className="p-6 rounded-xl"
                  style={{
                    backgroundColor: '#1e293b',
                    border: '2px solid #ef4444'
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-5 h-5" style={{color: '#3B82F6'}} />
                        <span style={{color: '#FFFFFF', fontWeight: 'bold'}}>{upgrade.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{color: '#999'}} />
                        <span style={{color: '#999', fontSize: '14px'}}>
                          {(() => {
                            try {
                              if (upgrade.pendingDate instanceof Date) {
                                return upgrade.pendingDate.toLocaleDateString('pt-BR');
                              } else if (upgrade.pendingDate) {
                                return new Date(upgrade.pendingDate).toLocaleDateString('pt-BR');
                              }
                            } catch (e) {
                              return 'Recente';
                            }
                            return 'Recente';
                          })()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveUpgrade(upgrade.id, upgrade.email, upgrade.uid)}
                        className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                        style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#10B981'}
                      >
                        <Check className="w-4 h-4" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => rejectUpgrade(upgrade.id, upgrade.email)}
                        className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                        style={{ backgroundColor: '#ef4444', color: '#FFFFFF' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                      >
                        <X className="w-4 h-4" />
                        Rejeitar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estatísticas Detalhadas dos Usuários */}
        {Object.keys(userStats).length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{color: '#14B8A6'}}>
              📊 Estatísticas por Usuário
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(userStats).map(([userId, stats]) => (
                <div
                  key={userId}
                  className="p-6 rounded-xl"
                  style={{
                    backgroundColor: '#1e293b',
                    border: '2px solid #14B8A6'
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl" style={{backgroundColor: '#14B8A6'}}>
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold" style={{color: '#14B8A6'}}>
                        {stats.email}
                      </h3>
                      <p style={{color: '#FFFFFF'}}>Estatísticas de Clientes</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Total de Clientes */}
                    <div className="p-3 rounded-lg" style={{backgroundColor: 'rgba(59, 130, 246, 0.1)'}}>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4" style={{color: '#3B82F6'}} />
                        <span className="text-sm font-medium" style={{color: '#FFFFFF'}}>Total</span>
                      </div>
                      <div className="text-2xl font-bold" style={{color: '#3B82F6'}}>
                        {stats.totalClientes}
                      </div>
                    </div>

                    {/* Clientes Concluídos */}
                    <div className="p-3 rounded-lg" style={{backgroundColor: 'rgba(16, 185, 129, 0.1)'}}>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4" style={{color: '#10B981'}} />
                        <span className="text-sm font-medium" style={{color: '#FFFFFF'}}>Concluídos</span>
                      </div>
                      <div className="text-2xl font-bold" style={{color: '#10B981'}}>
                        {stats.clientesConcluidos}
                      </div>
                    </div>

                    {/* Clientes Pendentes */}
                    <div className="p-3 rounded-lg" style={{backgroundColor: 'rgba(245, 158, 11, 0.1)'}}>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4" style={{color: '#F59E0B'}} />
                        <span className="text-sm font-medium" style={{color: '#FFFFFF'}}>Pendentes</span>
                      </div>
                      <div className="text-2xl font-bold" style={{color: '#F59E0B'}}>
                        {stats.clientesPendentes}
                      </div>
                    </div>

                    {/* Valor Total */}
                    <div className="p-3 rounded-lg" style={{backgroundColor: 'rgba(20, 184, 166, 0.1)'}}>
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4" style={{color: '#14B8A6'}} />
                        <span className="text-sm font-medium" style={{color: '#FFFFFF'}}>Valor Total</span>
                      </div>
                      <div className="text-2xl font-bold" style={{color: '#14B8A6'}}>
                        R$ {stats.valorTotal}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usuários PRO */}
        <div>
          <h2 className="text-2xl font-bold mb-4" style={{color: '#3B82F6'}}>
            ✅ Usuários Aprovados
          </h2>
          <div className="space-y-4">
            {proUsers.length === 0 ? (
              <div className="text-center p-8 rounded-xl" style={{ backgroundColor: '#1e293b', border: '1px solid #3B82F6' }}>
                <p style={{color: '#999'}}>Nenhum usuário aprovado ainda</p>
              </div>
            ) : (
              proUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #3B82F6'
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4" style={{color: '#3B82F6'}} />
                        <span style={{color: '#FFFFFF', fontWeight: 'bold'}}>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{color: '#999'}} />
                        <span style={{color: '#999', fontSize: '14px'}}>
                          Desde {
                            (() => {
                              try {
                                if (user.approvedDate instanceof Date) {
                                  return user.approvedDate.toLocaleDateString('pt-BR');
                                } else if (user.approvedDate) {
                                  return new Date(user.approvedDate).toLocaleDateString('pt-BR');
                                }
                              } catch (e) {
                                return 'Recente';
                              }
                              return 'Recente';
                            })()
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Estatísticas do usuário */}
                      {userStats[user.id] && (
                        <div className="flex items-center gap-2 text-sm">
                          <span style={{color: '#999'}}>
                            {userStats[user.id].totalClientes} clientes
                          </span>
                          <span style={{color: '#14B8A6'}}>
                            R$ {userStats[user.id].valorTotal}
                          </span>
                        </div>
                      )}
                      
                      <span className="px-3 py-1 rounded-lg font-bold text-sm" style={{
                        backgroundColor: '#3B82F6',
                        color: '#FFFFFF'
                      }}>
                        PRO
                      </span>
                      <button
                        onClick={() => handleRemoveUser(user)}
                        className="p-2 rounded-lg transition-all flex items-center gap-2"
                        style={{ backgroundColor: '#ef4444', color: '#FFFFFF' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                        title="Remover usuário"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmação de remoção de usuário */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmRemoveUser}
        title="Remover Usuário"
        message={`Tem certeza que deseja remover o usuário ${userToDelete?.email}? Esta ação não pode ser desfeita.`}
        confirmText="Remover"
        cancelText="Cancelar"
      />
    </div>
  );
}

export default AdminPanel;


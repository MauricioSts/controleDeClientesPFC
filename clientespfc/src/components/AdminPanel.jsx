import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, doc, updateDoc, setDoc, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Check, X, AlertCircle, User, Mail, Calendar, DollarSign, LogOut } from "lucide-react";

const ADMIN_EMAIL = "mauriciogear4@gmail.com";

function AdminPanel({ onBack }) {
  const { currentUser, logout } = useAuth();
  const [pendingUpgrades, setPendingUpgrades] = useState([]);
  const [proUsers, setProUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.email === ADMIN_EMAIL) {
      fetchPendingUpgrades();
      fetchProUsers();
    }
  }, [currentUser]);

  const fetchPendingUpgrades = async () => {
    try {
      // Buscar da nova coleção pending_upgrades
      const upgradesRef = collection(db, "pending_upgrades");
      const q = query(upgradesRef, where("processed", "==", false));
      
      const snapshot = await getDocs(q);
      const upgrades = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt;
        upgrades.push({
          id: doc.id,
          email: data.email || "Email não disponível",
          pendingDate: createdAt || new Date(),
          ...data
        });
      });
      
      // Ordenar por data (mais recente primeiro)
      upgrades.sort((a, b) => new Date(b.pendingDate) - new Date(a.pendingDate));
      
      setPendingUpgrades(upgrades);
    } catch (error) {
      console.error("Erro ao buscar upgrades pendentes:", error);
      toast.error("Erro ao carregar upgrades pendentes");
    } finally {
      setLoading(false);
    }
  };

  const fetchProUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("subscription.plan", "==", "pro"), orderBy("subscription.startDate", "desc"), limit(10));
      
      const snapshot = await getDocs(q);
      const pros = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        pros.push({
          id: doc.id,
          email: data.email || "Email não disponível",
          plan: data.subscription?.plan || "free",
          startDate: data.subscription?.startDate?.toDate() || new Date(),
          ...data
        });
      });
      
      setProUsers(pros);
    } catch (error) {
      console.error("Erro ao buscar usuários PRO:", error);
    }
  };

  const approveUpgrade = async (upgradeId, userEmail) => {
    try {
      // Buscar usuário pelo email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", userEmail));
      const snapshot = await getDocs(q);
      
      let userId;
      if (!snapshot.empty) {
        // Usuário existe, pegar ID
        userId = snapshot.docs[0].id;
        // Atualizar para PRO
        await updateDoc(doc(db, "users", userId), {
          email: userEmail,
          subscription: {
            plan: "pro",
            status: "active",
            startDate: serverTimestamp(),
          }
        });
      } else {
        // Criar novo usuário com email
        userId = `email_${userEmail}`;
        await setDoc(doc(db, "users", userId), {
          email: userEmail,
          subscription: {
            plan: "pro",
            status: "active",
            startDate: serverTimestamp(),
          }
        });
      }
      
      // Marcar como processado na coleção pending_upgrades
      await updateDoc(doc(db, "pending_upgrades", upgradeId), {
        processed: true,
        userId: userId,
        processedAt: serverTimestamp()
      });

      toast.success(`✅ Upgrade PRO aprovado para ${userEmail}`);
      fetchPendingUpgrades();
      fetchProUsers();
    } catch (error) {
      console.error("Erro ao aprovar upgrade:", error);
      toast.error("Erro ao aprovar upgrade");
    }
  };

  const rejectUpgrade = async (upgradeId, userEmail) => {
    try {
      // Marcar como processado (rejeitado)
      await updateDoc(doc(db, "pending_upgrades", upgradeId), {
        processed: true,
        status: "rejected",
        processedAt: serverTimestamp()
      });

      toast.success(`❌ Upgrade PRO rejeitado para ${userEmail}`);
      fetchPendingUpgrades();
    } catch (error) {
      console.error("Erro ao rejeitar upgrade:", error);
      toast.error("Erro ao rejeitar upgrade");
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
                <span className="font-bold" style={{color: '#FFFFFF'}}>Ativos PRO</span>
              </div>
              <div className="text-3xl font-bold" style={{color: '#FFFFFF'}}>
                {proUsers.length}
              </div>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#14B8A6', border: '2px solid #0f766e' }}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5" style={{color: '#FFFFFF'}} />
                <span className="font-bold" style={{color: '#FFFFFF'}}>Receita Mensal</span>
              </div>
              <div className="text-3xl font-bold" style={{color: '#FFFFFF'}}>
                R$ {(proUsers.length * 24.90).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Pendentes */}
        {pendingUpgrades.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{color: '#ef4444'}}>
              ⚠️ Upgrades Pendentes
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
                          {upgrade.pendingDate.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveUpgrade(upgrade.id, upgrade.email)}
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

        {/* Usuários PRO */}
        <div>
          <h2 className="text-2xl font-bold mb-4" style={{color: '#3B82F6'}}>
            ✅ Usuários PRO Ativos
          </h2>
          <div className="space-y-4">
            {proUsers.length === 0 ? (
              <div className="text-center p-8 rounded-xl" style={{ backgroundColor: '#1e293b', border: '1px solid #3B82F6' }}>
                <p style={{color: '#999'}}>Nenhum usuário PRO ativo</p>
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
                          Desde {user.startDate.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-lg font-bold text-sm" style={{
                      backgroundColor: '#3B82F6',
                      color: '#FFFFFF'
                    }}>
                      PRO
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;


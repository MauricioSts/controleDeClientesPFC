import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { Toaster, toast } from "react-hot-toast";
import { LogOut, Lock } from "lucide-react";

import AddCliente from "./AddCliente";
import ViewClientes from "./ViewClientes";
import ClientsManager from "./ClientsManager";
import OrdersManager from "./OrdersManager";
import EstatisticasMensais from "./EstatisticasMensais";

function AuthenticatedApp({ isAdmin, onShowAdmin }) {
  const { currentUser, logout } = useAuth();
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pedidos-legado"); // "pedidos-legado", "pedidos-novo", "clientes" ou "estatisticas"
  const [clientes, setClientes] = useState([]);

  // Verificar se usuário está aprovado
  useEffect(() => {
    if (!currentUser) return;

    const checkUserApproval = async () => {
      try {
        setLoading(true);
        
        // Admin sempre aprovado
        if (currentUser.email === 'mauriciogear4@gmail.com') {
          // Verificar se existe documento e aprovar automaticamente
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists() && !userDoc.data().approved) {
            // Aprovar automaticamente se estava bloqueado
            await updateDoc(doc(db, "users", currentUser.uid), {
              approved: true
            });
          }
          setApproved(true);
          setLoading(false);
          return;
        }
        
        // Buscar dados do usuário
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setApproved(userData.approved || false);
        } else {
          // Usuário novo, não aprovado
          setApproved(false);
          
          // Criar documento do usuário como pendente (usando uid como doc ID)
          await setDoc(doc(db, "users", currentUser.uid), {
            email: currentUser.email,
            uid: currentUser.uid,
            approved: false,
            createdAt: serverTimestamp()
          });
        }
      } catch (error) {
        console.error("Erro ao verificar aprovação do usuário:", error);
        setApproved(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserApproval();
  }, [currentUser]);

  // Buscar clientes para estatísticas
  useEffect(() => {
    if (!currentUser || !approved) return;

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
      const clientesFiltrados = lista.filter(item => {
        // Se tem tipo "pedido", é um pedido com rastreio e NÃO deve aparecer
        if (item.tipo === "pedido") {
          return false;
        }
        // Todos os outros são clientes
        return true;
      });
      
      setClientes(clientesFiltrados);
    });

    return () => unsubscribe();
  }, [currentUser, approved]);

  const handleAddCliente = async (cliente) => {
    const { nome, instagram, numero, produto, tamanho, valor, versao, numeroCamisa, nomeCamisa } = cliente;

    if (!nome || !produto || !valor) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    const numeroTel = numero || "";
    const preco = parseFloat(valor);

    if (isNaN(preco)) {
      toast.error("Valor inválido!");
      return;
    }

    try {
      await addDoc(collection(db, "clientes"), {
        nome,
        instagram,
        numeroTel,
        produto,
        tamanho: tamanho || "",
        preco,
        versao: versao || "fan",
        numeroCamisa: numeroCamisa || "",
        nomeCamisa: nomeCamisa || "",
        data: new Date().toLocaleDateString("pt-BR"),
        createdAt: serverTimestamp(),
        concluido: false,
        pedidoFeito: false,
        isCustomer: true, // Marca como cliente
        userId: currentUser.uid,
      });

      toast.success("Cliente adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      toast.error("Erro ao salvar cliente 😢");
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

  // Tela de bloqueio para usuários não aprovados
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #0f766e 50%, #1e3a8a 100%)'}}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin" style={{color: '#3B82F6'}}>⚙️</div>
          <p style={{color: '#FFFFFF'}}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!approved) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #0f766e 50%, #1e3a8a 100%)'}}>
        <Toaster position="top-right" reverseOrder={false} />
        <div className="text-center p-8 rounded-2xl backdrop-blur-sm max-w-md mx-4" style={{backgroundColor: '#1e293b', border: '2px solid #3B82F6'}}>
          <Lock className="w-20 h-20 mx-auto mb-6" style={{color: '#3B82F6'}} />
          <h1 className="text-3xl font-bold mb-4" style={{color: '#3B82F6'}}>
            Aguardando Aprovação
          </h1>
          <p className="text-lg mb-6" style={{color: '#FFFFFF'}}>
            Seu acesso está pendente de aprovação do administrador.
          </p>
          <p className="text-sm mb-8" style={{color: '#999'}}>
            {currentUser?.email}
          </p>
          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-xl font-medium transition-all"
            style={{ backgroundColor: '#3B82F6', color: '#FFFFFF' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
          >
            <LogOut className="w-5 h-5 inline mr-2" />
            Fazer Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #0f766e 50%, #1e3a8a 100%)'}}>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Título Centralizado */}
          <div className="text-center mb-8">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-2" 
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #14B8A6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              JerseyAndBits
            </h1>
            <p className="text-xl" style={{color: '#FFFFFF'}}>Sistema de Gestão de Pedidos</p>
          </div>

          {/* User Info e Botão Logout */}
          <div className="flex justify-between items-center gap-4 mb-4">
            {isAdmin && onShowAdmin && (
              <button
                onClick={onShowAdmin}
                className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                style={{ backgroundColor: '#14B8A6', color: '#FFFFFF', border: '1px solid #0f766e' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0f766e'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#14B8A6'}
              >
                🔐 Painel Admin
              </button>
            )}

            <div className="flex items-center gap-4">
              <p style={{color: '#FFFFFF', fontSize: '14px'}}>
                <span style={{color: '#14B8A6', fontWeight: 'bold'}}>{currentUser.email}</span>
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all"
                style={{ backgroundColor: '#3B82F6', color: '#FFFFFF', border: '1px solid #3B82F6' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="mb-8">
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => setActiveTab("pedidos-legado")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === "pedidos-legado" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              👥 Clientes/Adicionar
            </button>
            <button
              onClick={() => setActiveTab("pedidos-novo")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === "pedidos-novo" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              🚚 Pedidos com Rastreio
            </button>
            <button
              onClick={() => setActiveTab("estatisticas")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === "estatisticas" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              📊 Estatísticas
            </button>
          </div>
        </div>

        {/* Conteúdo das Abas */}
        {activeTab === "pedidos-legado" && (
          <div className="space-y-8">
            {/* Formulário de Adicionar Cliente */}
            <div className="mb-8">
              <AddCliente onAddCliente={handleAddCliente} />
            </div>

            {/* Lista de Clientes */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2" style={{color: '#3B82F6'}}>
                  Lista de Clientes
                </h2>
                <p style={{color: '#FFFFFF'}}>Gerencie seus clientes de forma eficiente</p>
              </div>
              <ViewClientes />
            </div>
          </div>
        )}

        {activeTab === "pedidos-novo" && (
          <div className="mb-8">
            <OrdersManager />
          </div>
        )}

        {activeTab === "estatisticas" && (
          <div className="mb-8">
            <EstatisticasMensais clientes={clientes} />
          </div>
        )}

      </div>

      <footer className="mt-8 text-sm text-center" style={{color: '#FFFFFF'}}>
        Desenvolvido por{" "}
        <a
          href="https://github.com/MauricioSts"
          className="font-medium transition-colors"
          style={{color: '#14B8A6'}}
          onMouseEnter={(e) => e.target.style.color = '#2DD4BF'}
          onMouseLeave={(e) => e.target.style.color = '#14B8A6'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Mauricio
        </a>
      </footer>
    </div>
  );
}

export default AuthenticatedApp;

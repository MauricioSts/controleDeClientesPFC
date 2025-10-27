import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { Toaster, toast } from "react-hot-toast";
import { LogOut, AlertCircle } from "lucide-react";

import AddCliente from "./AddCliente";
import ViewClientes from "./ViewClientes";

function AuthenticatedApp({ isAdmin, onShowAdmin }) {
  const { currentUser, logout } = useAuth();
  const [userPlan, setUserPlan] = useState("free");
  const [pedidosDoMes, setPedidosDoMes] = useState(0);
  const [canAddOrder, setCanAddOrder] = useState(true);
  const [loading, setLoading] = useState(true);

  // Buscar plano do usuário e contar pedidos do mês
  useEffect(() => {
    if (!currentUser) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Buscar dados do usuário
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        
        if (userDoc.exists()) {
          const plan = userDoc.data().subscription?.plan || "free";
          setUserPlan(plan);

          // Se for FREE, contar pedidos do mês
          if (plan === "free") {
            const inicioMes = new Date();
            inicioMes.setDate(1);
            inicioMes.setHours(0, 0, 0, 0);

            const pedidosRef = query(
              collection(db, "clientes"),
              where("userId", "==", currentUser.uid)
            );

            const snapshot = await getDocs(pedidosRef);
            const pedidos = snapshot.docs.filter(doc => {
              const data = doc.data();
              if (data.createdAt) {
                return data.createdAt.toDate() >= inicioMes;
              }
              return false;
            });

            setPedidosDoMes(pedidos.length);
            setCanAddOrder(pedidos.length < 3);
          } else {
            setCanAddOrder(true); // PRO = ilimitado
          }
        } else {
          // Usuário novo, criar documento
          setUserPlan("free");
          setCanAddOrder(true);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setUserPlan("free");
        setCanAddOrder(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleAddCliente = async (cliente) => {
    // Verificar se pode adicionar pedido
    if (!canAddOrder) {
      toast.error("Você atingiu o limite do plano FREE (3 pedidos/mês). Faça upgrade para PRO!");
      return;
    }

    const { nome, instagram, numero, produto, tamanho, valor, versao, numeroCamisa, nomeCamisa } = cliente;

    if (!nome || !produto || !valor) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    const numeroTel = parseFloat(numero);
    const preco = parseFloat(valor);

    if (isNaN(numeroTel) || isNaN(preco)) {
      toast.error("Número ou valor inválido!");
      return;
    }

    try {
      await addDoc(collection(db, "clientes"), {
        nome,
        instagram,
        numeroTel,
        produto,
        tamanho,
        preco,
        versao: versao || "fan",
        numeroCamisa: numeroCamisa || "",
        nomeCamisa: nomeCamisa || "",
        data: new Date().toLocaleDateString("pt-BR"),
        createdAt: serverTimestamp(),
        concluido: false,
        pedidoFeito: false,
        userId: currentUser.uid,
      });

      // Atualizar contador de pedidos
      if (userPlan === "free") {
        setPedidosDoMes(pedidosDoMes + 1);
        if (pedidosDoMes + 1 >= 3) {
          setCanAddOrder(false);
        }
      }

      toast.success("Pedido adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar pedido:", error);
      toast.error("Erro ao salvar pedido 😢");
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
              JerseysAndBits
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
            {/* Informações do Plano */}
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-lg font-bold text-sm" style={{
                backgroundColor: userPlan === "pro" ? '#3B82F6' : '#6B7280',
                color: '#FFFFFF'
              }}>
                {userPlan === "pro" ? "PRO" : "FREE"}
              </span>
              {userPlan === "free" && (
                <span style={{color: '#FFFFFF', fontSize: '14px'}}>
                  {pedidosDoMes}/3 pedidos/mês
                </span>
              )}
            </div>

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

          {/* Alerta de limite atingido */}
          {!canAddOrder && userPlan === "free" && (
            <div className="mb-4 p-4 rounded-xl flex items-center gap-3" style={{
              backgroundColor: '#ef4444',
              border: '2px solid #dc2626',
              color: '#FFFFFF'
            }}>
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-bold">Limite de pedidos atingido!</p>
                <p className="text-sm">Faça upgrade para o plano PRO e tenha acesso ilimitado.</p>
              </div>
            </div>
          )}
        </div>

        {/* Formulário */}
        <div className="mb-8">
          <AddCliente onAddCliente={handleAddCliente} />
        </div>

        {/* Lista de Pedidos */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2" style={{color: '#3B82F6'}}>
              Lista de Pedidos
            </h2>
            <p style={{color: '#FFFFFF'}}>Gerencie seus pedidos de forma eficiente</p>
          </div>
          <ViewClientes />
        </div>

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

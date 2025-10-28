import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { Toaster, toast } from "react-hot-toast";
import { LogOut, Lock } from "lucide-react";

import AddCliente from "./AddCliente";
import ViewClientes from "./ViewClientes";

function AuthenticatedApp({ isAdmin, onShowAdmin }) {
  const { currentUser, logout } = useAuth();
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar se usuário está aprovado
  useEffect(() => {
    if (!currentUser) return;

    const checkUserApproval = async () => {
      try {
        setLoading(true);
        
        // Admin sempre aprovado
        if (currentUser.email === 'mauriciogear4@gmail.com') {
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

  const handleAddCliente = async (cliente) => {
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

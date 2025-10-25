import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";

import { db } from "./firebase/config";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import AddCliente from "./components/AddCliente";
import ViewClientes from "./components/ViewClientes";
import "./index.css";

function App() {
  const [clientes, setClientes] = useState([]);
  const clientesRef = collection(db, "clientes");

  useEffect(() => {
    const q = query(clientesRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(lista);
    });
    return () => unsubscribe();
  }, []);

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
      await addDoc(clientesRef, {
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
      });

      toast.success("Pedido adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar pedido:", error);
      toast.error("Erro ao salvar pedido 😢");
    }
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #0D0630 0%, #1a0a4a 50%, #0D0630 100%)'}}>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg" style={{color: '#FF2D5B'}}>
            Sistema de Pedidos
          </h1>
          <p className="text-xl" style={{color: '#FFFFFF'}}>Administração de Pedidos P.F.C</p>
        </div>

        {/* Formulário */}
        <div className="mb-8">
          <AddCliente onAddCliente={handleAddCliente} />
        </div>

        {/* Lista de Pedidos */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2" style={{color: '#FF2D5B'}}>
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
          style={{color: '#FF2D5B'}}
          onMouseEnter={(e) => e.target.style.color = '#FF6B8A'}
          onMouseLeave={(e) => e.target.style.color = '#FF2D5B'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Mauricio
        </a>
      </footer>
    </div>
  );
}

export default App;

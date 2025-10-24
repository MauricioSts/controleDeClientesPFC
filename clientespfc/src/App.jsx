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
import Dashboard from "./components/Dashboard";
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
    const { nome, instagram, numero, produto, tamanho, valor } = cliente;

    if (!nome || !produto || !valor) {
      toast.error("Preencha todos os campos!");
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
        data: new Date().toLocaleDateString("pt-BR"),
        createdAt: serverTimestamp(),
        concluido: false,
        pedidoFeito: false,
        pedidoEnviado: false,
      });

      toast.success("Cliente adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      toast.error("Erro ao salvar cliente 😢");
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0841] flex flex-col items-center justify-start py-10 px-6 sm:px-10 md:px-12">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-7xl bg-gradient-to-br from-[#22104F] to-[#2C1660] border border-[#FF2E63]/30 rounded-3xl shadow-2xl shadow-[#00000055] backdrop-blur-xl p-6 sm:p-8 md:p-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-10 tracking-tight text-white">
          Gestão de Clientes{" "}
          <span className="text-[#FF2E63] drop-shadow-[0_0_8px_#FF2E63]">
            PFC
          </span>
        </h1>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#2E1669]/40 backdrop-blur-md border border-[#FF2E63]/20 rounded-2xl p-6 sm:p-8 mb-10 shadow-inner"
        >
          <AddCliente onAddCliente={handleAddCliente} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#2E1669]/40 backdrop-blur-md border border-[#FF2E63]/20 rounded-2xl p-6 sm:p-8 mb-10 shadow-inner"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
            Clientes cadastrados
          </h2>
          <div className="overflow-x-auto">
            <ViewClientes />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Dashboard />
        </motion.section>
      </div>

      <footer className="mt-8 text-gray-400 text-sm text-center">
        Desenvolvido por{" "}
        <a
          href="https://github.com/MauricioSts"
          className="text-[#FF2E63] font-medium hover:text-[#ff517f] transition-colors"
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

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase/config";
import { Toaster, toast } from "react-hot-toast";
import AddCliente from "./components/AddCliente";
import ViewClientes from "./components/ViewClientes";

function App() {
  const [clientes, setClientes] = useState([]);
  const clientesRef = collection(db, "clientes");

  // 🔁 Carrega clientes ao iniciar
  useEffect(() => {
    async function carregarClientes() {
      try {
        const snapshot = await getDocs(clientesRef);//funcao propria do firebase que busca todos os documentos de uma coleçao
        const lista = snapshot.docs.map((doc) => ({//o .map vai transformar cada snapshot em um objeto com id
          id: doc.id,
          ...doc.data(),//retorna todos os campos do documento
        }));

        // Ordena por data (clientes mais recentes primeiro)
        lista.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);

        setClientes(lista);// salva a lista de clientes
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        toast.error("Erro ao carregar clientes 😢");
      }
    }

    carregarClientes();// a func é chamada 1 vez quando o componente é montado
  }, []);

  // ➕ Adiciona cliente no Firestore
  const handleAddCliente = async ({
    nome,
    instagram,
    numero,
    produto,
    tamanho,
    valor,
  }) => {
    if (!nome || !instagram || !numero || !produto || !tamanho || !valor) {
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
      const novoCliente = { //estou criando o objeto
        nome,
        instagram,
        numeroTel,
        produto,
        tamanho,
        preco,
        data: new Date().toLocaleDateString("pt-BR"),
        createdAt: serverTimestamp(),
        concluido: false,
      };

      const docRef = await addDoc(clientesRef, novoCliente);//aqui estou salvando no firebase

      setClientes((prev) => [{ id: docRef.id, ...novoCliente }, ...prev]);

      toast.success("Cliente adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      toast.error("Erro ao salvar cliente 😢");
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0841] text-white flex flex-col items-center py-8 px-4 sm:px-6">
      <Toaster position="top-center" />

      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-[#FF2E63] drop-shadow-md">
        Sistema de Clientes
      </h1>

      {/* Formulário para adicionar cliente */}
      <div className="w-full max-w-2xl mb-10">
        <AddCliente onAddCliente={handleAddCliente} />
      </div>

      {/* Lista de clientes */}
      <div className="w-full max-w-4xl">
        <ViewClientes clientes={clientes} />
      </div>
    </div>
  );
}

export default App;

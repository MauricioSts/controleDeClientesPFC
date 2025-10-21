import { useEffect, useState } from "react";
import { db } from "./firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import AddCliente from "./components/AddCliente";
import ViewClientes from "./components/ViewClientes";
import "./index.css";

function App() {
  const [nome, setNome] = useState("");
  const [instagram, setInstagram] = useState("");
  const [numero, setNumero] = useState("");
  const [produto, setProduto] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date().toLocaleDateString("pt-BR"));
  const [clientes, setClientes] = useState([]);

  const clientesRef = collection(db, "clientes");

  // 🔄 Carrega clientes do Firestore em tempo real
  useEffect(() => {
    const q = query(clientesRef, orderBy("data", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(lista);
    });
    return () => unsubscribe();
  }, []);

  // ➕ Função para adicionar novo cliente ao Firestore
  const handleAddCliente = async () => {
    if (!nome || !produto || !valor) {
      alert("Preencha nome, produto e valor!");
      return;
    }

    try {
      await addDoc(clientesRef, {
        nome,
        instagram,
        numero,
        produto,
        tamanho,
        valor: parseFloat(valor),
        data,
      });

      // limpa o form
      setNome("");
      setInstagram("");
      setNumero("");
      setProduto("");
      setTamanho("");
      setValor("");
      setData(new Date().toLocaleDateString("pt-BR"));
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      alert("Erro ao salvar cliente 😢");
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0841] flex flex-col items-center py-6 px-3 sm:py-8 sm:px-4 md:py-10 md:px-8">
      <div className="w-full max-w-4xl bg-[#22104F] shadow-2xl rounded-2xl p-4 sm:p-6 md:p-8 border border-[#FF2E63]/30">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-6 sm:mb-8 tracking-wide leading-tight">
          Gestão de Clientes{" "}
          <span className="text-[#FF2E63] font-extrabold">PFC</span>
        </h1>

        {/* Formulário */}
        <div className="mb-8 sm:mb-10">
          <AddCliente
            nome={nome}
            setNome={setNome}
            instagram={instagram}
            setInstagram={setInstagram}
            numero={numero}
            setNumero={setNumero}
            produto={produto}
            setProduto={setProduto}
            tamanho={tamanho}
            setTamanho={setTamanho}
            valor={valor}
            setValor={setValor}
            data={data}
            setData={setData}
            onAddCliente={handleAddCliente} // 👈 novo
          />
        </div>

        {/* Lista */}
        <div className="overflow-x-auto">
          <ViewClientes clientes={clientes} />
        </div>
      </div>

      <footer className="mt-8 text-gray-300 text-sm text-center px-4">
        Desenvolvido por{" "}
        <a
          href="https://github.com/MauricioSts"
          className="text-[#FF2E63] font-semibold"
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

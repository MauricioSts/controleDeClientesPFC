import { useEffect, useState } from "react";
import AddCliente from "./components/AddCliente";
import ViewClientes from "./components/ViewClientes";
import "./index.css";

function App() {
  const [nome, setNome] = useState(() => localStorage.getItem("nome") || "");
  const [instagram, setInstagram] = useState(
    () => localStorage.getItem("instagram") || ""
  );
  const [numero, setNumero] = useState(() => {
    const stored = localStorage.getItem("numero");
    return stored ? parseFloat(stored) : "";
  });
  const [produto, setProduto] = useState(
    () => localStorage.getItem("produto") || ""
  );
  const [tamanho, setTamanho] = useState(
    () => localStorage.getItem("tamanho") || ""
  );
  const [valor, setValor] = useState(() => {
    const stored = localStorage.getItem("valor");
    return stored ? parseFloat(stored) : "";
  });
  const [data, setData] = useState(
    () => localStorage.getItem("data") || new Date().toLocaleDateString("pt-BR")
  );
  const [clientes, setClientes] = useState(() => {
    const stored = localStorage.getItem("clientes");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("nome", nome);
    localStorage.setItem("instagram", instagram);
    localStorage.setItem("numero", numero);
    localStorage.setItem("produto", produto);
    localStorage.setItem("tamanho", tamanho);
    localStorage.setItem("valor", valor);
    localStorage.setItem("data", data);
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }, [nome, instagram, numero, produto, tamanho, valor, data, clientes]);

  return (
    <div className="min-h-screen bg-[#1A0841] flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl bg-[#22104F] shadow-2xl rounded-2xl p-8 border border-[#FF2E63]/30">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 tracking-wide">
          Gestão de Clientes{" "}
          <span className="text-[#FF2E63] font-extrabold">PFC</span>
        </h1>

        {/* Formulário */}
        <div className="mb-10">
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
            setData={setData}
            setValor={setValor}
            clientes={clientes}
            setClientes={setClientes}
          />
        </div>

        {/* Lista */}
        <ViewClientes clientes={clientes} />
      </div>

      <footer className="mt-8 text-gray-300 text-sm">
        Feito por <span className="text-[#FF2E63] font-semibold">Mauricio</span>
      </footer>
    </div>
  );
}

export default App;

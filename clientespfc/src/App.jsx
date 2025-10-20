import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import AddCliente from "./components/AddCliente";
import ViewClientes from "./components/ViewClientes";

function App() {
  const [nome, setNome] = useState("");
  const [instagram, setInstagram] = useState("");
  const [numero, setNumero] = useState("");
  const [produto, setProduto] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [valor, setValor] = useState("");
  const [clientes, setClientes] = useState([]);
  return (
    <div>
      <h1>Gestão de clientes - PFC - </h1>
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
        clientes={clientes}
        setClientes={setClientes}
      />
      <ViewClientes clientes={clientes} />
    </div>
  );
}

export default App;

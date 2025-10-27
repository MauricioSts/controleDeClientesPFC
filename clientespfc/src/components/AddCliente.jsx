import { useState } from "react";
import { toast } from "react-hot-toast";

function AddCliente({ onAddCliente }) {
  const [nome, setNome] = useState("");
  const [instagram, setInstagram] = useState("");
  const [numero, setNumero] = useState("");
  const [produto, setProduto] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [valor, setValor] = useState("");
  const [versao, setVersao] = useState("fan");
  const [numeroCamisa, setNumeroCamisa] = useState("");
  const [nomeCamisa, setNomeCamisa] = useState("");
  const [loading, setLoading] = useState(false);

  const tamanhos = [
    "XS", "S", "M", "L", "XL", "XXL", "XXXL",
    "28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50",
    "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"
  ];


  async function handleSubmit() {
    if (!nome || !produto || !valor) return;

    setLoading(true);
    await onAddCliente({ 
      nome, 
      instagram, 
      numero, 
      produto, 
      tamanho, 
      valor, 
      versao, 
      numeroCamisa,
      nomeCamisa
    });
    setLoading(false);

    // Limpar formulário
    setNome("");
    setInstagram("");
    setNumero("");
    setProduto("");
    setTamanho("");
    setValor("");
    setVersao("fan");
    setNumeroCamisa("");
    setNomeCamisa("");
  }

  return (
    <div className="backdrop-blur-sm rounded-2xl p-8 shadow-2xl" style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6'}}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{color: '#3B82F6'}}>
          Adicionar Pedido
        </h2>
        <p style={{color: '#FFFFFF'}}>
          Sistema de Administração de Pedidos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#3B82F6'}}>
            Nome *
          </label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            type="text"
            placeholder="Nome do cliente"
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
            onBlur={(e) => e.target.style.borderColor = '#3B82F6'}
          />
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#3B82F6'}}>
            Instagram
          </label>
          <input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            type="text"
            placeholder="@usuario"
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
            onBlur={(e) => e.target.style.borderColor = '#3B82F6'}
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#3B82F6'}}>
            Telefone
          </label>
          <input
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            type="tel"
            placeholder="(11) 99999-9999"
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
            onBlur={(e) => e.target.style.borderColor = '#3B82F6'}
          />
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#3B82F6'}}>
            Valor *
          </label>
          <input
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            type="number"
            step="0.01"
            placeholder="0.00"
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
            onBlur={(e) => e.target.style.borderColor = '#3B82F6'}
          />
        </div>

        {/* Produto */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#3B82F6'}}>
            Produto *
          </label>
          <input
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
            type="text"
            placeholder="Nome do produto"
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
            onBlur={(e) => e.target.style.borderColor = '#3B82F6'}
          />
        </div>

        {/* Versão */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#3B82F6'}}>
            Versão
          </label>
          <select
            value={versao}
            onChange={(e) => setVersao(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
            onBlur={(e) => e.target.style.borderColor = '#3B82F6'}
          >
            <option value="fan" style={{backgroundColor: '#1e293b', color: '#FFFFFF'}}>Fan</option>
            <option value="retro" style={{backgroundColor: '#1e293b', color: '#FFFFFF'}}>Retro</option>
            <option value="player" style={{backgroundColor: '#1e293b', color: '#FFFFFF'}}>Player</option>
          </select>
        </div>

        {/* Tamanho */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#3B82F6'}}>
            Tamanho
          </label>
          <select
            value={tamanho}
            onChange={(e) => setTamanho(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
            onBlur={(e) => e.target.style.borderColor = '#3B82F6'}
          >
            <option value="" style={{backgroundColor: '#1e293b', color: '#FFFFFF'}}>Selecione o tamanho</option>
            {tamanhos.map((t) => (
              <option key={t} value={t} style={{backgroundColor: '#1e293b', color: '#FFFFFF'}}>{t}</option>
            ))}
          </select>
        </div>

        {/* Nome na Camisa */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#3B82F6'}}>
            Nome na Camisa (opcional)
          </label>
          <input
            value={nomeCamisa}
            onChange={(e) => setNomeCamisa(e.target.value)}
            type="text"
            placeholder="Ex: AB"
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
            onBlur={(e) => e.target.style.borderColor = '#3B82F6'}
          />
        </div>

        {/* Número na Camisa */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#3B82F6'}}>
            Número na Camisa (opcional)
          </label>
          <input
            value={numeroCamisa}
            onChange={(e) => setNumeroCamisa(e.target.value)}
            type="text"
            placeholder="Ex: 10"
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
            onBlur={(e) => e.target.style.borderColor = '#3B82F6'}
          />
        </div>


      </div>

      {/* Botão */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`py-4 px-12 rounded-xl font-semibold text-lg transition-all duration-300 ${
            loading
              ? "cursor-not-allowed"
              : "shadow-lg hover:shadow-xl"
          }`}
          style={{
            backgroundColor: loading ? '#0D0630' : '#3B82F6',
            color: '#FFFFFF',
            border: '1px solid #3B82F6'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#14B8A6';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#3B82F6';
            }
          }}
        >
          {loading ? "Adicionando..." : "Adicionar Pedido"}
        </button>
      </div>
    </div>
  );
}

export default AddCliente;
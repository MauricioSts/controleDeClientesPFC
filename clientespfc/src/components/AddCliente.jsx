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
    <div className="backdrop-blur-sm rounded-2xl p-8 shadow-2xl" style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B'}}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{color: '#FF2D5B'}}>
          Adicionar Pedido
        </h2>
        <p style={{color: '#FFFFFF'}}>
          Sistema de Administração de Pedidos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#FF2D5B'}}>
            Nome *
          </label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            type="text"
            placeholder="Nome do cliente"
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#FF6B8A'}
            onBlur={(e) => e.target.style.borderColor = '#FF2D5B'}
            placeholder="Nome do cliente"
          />
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#FF2D5B'}}>
            Instagram
          </label>
          <input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            type="text"
            placeholder="@usuario"
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#FF6B8A'}
            onBlur={(e) => e.target.style.borderColor = '#FF2D5B'}
            placeholder="@usuario"
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#FF2D5B'}}>
            Telefone
          </label>
          <input
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            type="tel"
            placeholder="(11) 99999-9999"
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#FF6B8A'}
            onBlur={(e) => e.target.style.borderColor = '#FF2D5B'}
            placeholder="(11) 99999-9999"
          />
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#FF2D5B'}}>
            Valor *
          </label>
          <input
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            type="number"
            step="0.01"
            placeholder="0.00"
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#FF6B8A'}
            onBlur={(e) => e.target.style.borderColor = '#FF2D5B'}
            placeholder="0.00"
          />
        </div>

        {/* Produto */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#FF2D5B'}}>
            Produto *
          </label>
          <input
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
            type="text"
            placeholder="Nome do produto"
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#FF6B8A'}
            onBlur={(e) => e.target.style.borderColor = '#FF2D5B'}
            placeholder="Nome do produto"
          />
        </div>

        {/* Versão */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#FF2D5B'}}>
            Versão
          </label>
          <select
            value={versao}
            onChange={(e) => setVersao(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#FF6B8A'}
            onBlur={(e) => e.target.style.borderColor = '#FF2D5B'}
          >
            <option value="fan" style={{backgroundColor: '#0D0630', color: '#FFFFFF'}}>Fan</option>
            <option value="retro" style={{backgroundColor: '#0D0630', color: '#FFFFFF'}}>Retro</option>
            <option value="player" style={{backgroundColor: '#0D0630', color: '#FFFFFF'}}>Player</option>
          </select>
        </div>

        {/* Tamanho */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#FF2D5B'}}>
            Tamanho
          </label>
          <select
            value={tamanho}
            onChange={(e) => setTamanho(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#FF6B8A'}
            onBlur={(e) => e.target.style.borderColor = '#FF2D5B'}
          >
            <option value="" style={{backgroundColor: '#0D0630', color: '#FFFFFF'}}>Selecione o tamanho</option>
            {tamanhos.map((t) => (
              <option key={t} value={t} style={{backgroundColor: '#0D0630', color: '#FFFFFF'}}>{t}</option>
            ))}
          </select>
        </div>

        {/* Nome na Camisa */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#FF2D5B'}}>
            Nome na Camisa (opcional)
          </label>
          <input
            value={nomeCamisa}
            onChange={(e) => setNomeCamisa(e.target.value)}
            type="text"
            placeholder="Ex: AB"
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#FF6B8A'}
            onBlur={(e) => e.target.style.borderColor = '#FF2D5B'}
            placeholder="Ex: AB"
          />
        </div>

        {/* Número na Camisa */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#FF2D5B'}}>
            Número na Camisa (opcional)
          </label>
          <input
            value={numeroCamisa}
            onChange={(e) => setNumeroCamisa(e.target.value)}
            type="text"
            placeholder="Ex: 10"
            className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{backgroundColor: '#0D0630', border: '1px solid #FF2D5B', color: '#FFFFFF'}}
            onFocus={(e) => e.target.style.borderColor = '#FF6B8A'}
            onBlur={(e) => e.target.style.borderColor = '#FF2D5B'}
            placeholder="Ex: 10"
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
            backgroundColor: loading ? '#0D0630' : '#FF2D5B',
            color: '#FFFFFF',
            border: '1px solid #FF2D5B'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#FF6B8A';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#FF2D5B';
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
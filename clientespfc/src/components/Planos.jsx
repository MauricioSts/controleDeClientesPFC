import { motion } from "framer-motion";
import { Check, Zap, Rocket } from "lucide-react";

const planos = [
  {
    nome: "FREE",
    preco: 0,
    periodo: "Gratuito",
    icone: Zap,
    cor: "#6B7280",
    popular: false,
    features: [
      "Até 3 pedidos/mês",
      "Estatísticas básicas"
    ],
    limites: {
      pedidosPorMes: 3,
      exportar: false
    }
  },
  {
    nome: "PRO",
    preco: 24.90,
    periodo: "por mês",
    icone: Rocket,
    cor: "#3B82F6",
    popular: true,
    features: [
      "Pedidos ilimitados",
      "Histórico completo",
      "Estatísticas avançadas",
      "Exportação em PDF",
      "Suporte prioritário",
      "Backup automático"
    ],
    limites: {
      pedidosPorMes: -1, // ilimitado
      exportar: true
    }
  }
];

function Planos({ planoAtual = "free" }) {
  const handleSelect = (plano) => {
    if (plano.nome === "FREE") {
      return;
    }
    
    // Link de pagamento Stripe
    const stripeLink = "https://buy.stripe.com/test_9B63cxffagnB4Wgc4Y1B600";
    
    if (plano.nome === "PRO") {
      window.location.href = stripeLink;
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{color: '#3B82F6'}}>
            Escolha o Plano Ideal
          </h2>
          <p style={{color: '#FFFFFF'}} className="text-xl">
            Comece grátis e faça upgrade quando precisar
          </p>
        </div>

        {/* Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {planos.map((plano) => (
            <motion.div
              key={plano.nome}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl relative ${
                plano.popular ? 'border-2' : 'border'
              }`}
              style={{
                backgroundColor: '#1e293b',
                borderColor: plano.popular ? plano.cor : '#3B82F6'
              }}
            >
              {/* Badge Popular */}
              {plano.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span
                    className="px-4 py-1 rounded-full text-sm font-bold"
                    style={{ backgroundColor: plano.cor, color: '#FFFFFF' }}
                  >
                    MAIS POPULAR
                  </span>
                </div>
              )}

              {/* Ícone */}
              <div className="flex justify-center mb-4">
                <div
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: `${plano.cor}20` }}
                >
                  <plano.icone className="w-8 h-8" style={{ color: plano.cor }} />
                </div>
              </div>

              {/* Nome do Plano */}
              <h3 className="text-2xl font-bold text-center mb-2" style={{ color: plano.cor }}>
                {plano.nome}
              </h3>

              {/* Preço */}
              <div className="text-center mb-6">
                <span className="text-4xl font-bold" style={{ color: '#FFFFFF' }}>
                  {plano.preco === 0 ? "Grátis" : `R$ ${plano.preco.toFixed(2)}`}
                </span>
                {plano.preco > 0 && (
                  <span style={{ color: '#999', fontSize: '14px' }}>
                    {" "}/ {plano.periodo}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plano.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0" style={{ color: plano.cor }} />
                    <span style={{ color: '#FFFFFF' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Botão de Seleção */}
              <button
                onClick={() => handleSelect(plano)}
                className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
                  plano.popular ? 'shadow-lg' : ''
                }`}
                style={{
                  backgroundColor: plano.nome === planoAtual ? '#1e293b' : plano.cor,
                  color: '#FFFFFF',
                  border: plano.nome === planoAtual ? `2px solid ${plano.cor}` : 'none'
                }}
                onMouseEnter={(e) => {
                  if (plano.nome !== planoAtual) {
                    e.target.style.backgroundColor = plano.nome === 'PRO' ? '#2563EB' : '#10B981';
                  }
                }}
                onMouseLeave={(e) => {
                  if (plano.nome !== planoAtual) {
                    e.target.style.backgroundColor = plano.cor;
                  }
                }}
              >
                {plano.nome === planoAtual ? "Plano Atual" : plano.preco === 0 ? "Plano Atual" : "Assinar Agora"}
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-12 backdrop-blur-sm rounded-2xl p-8" style={{ backgroundColor: '#1e293b', border: '1px solid #3B82F6' }}>
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#3B82F6' }}>
            Perguntas Frequentes
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold mb-2" style={{ color: '#FFFFFF' }}>Posso mudar de plano a qualquer momento?</h4>
              <p style={{ color: '#999' }}>Sim! Você pode fazer upgrade ou downgrade a qualquer momento. Alterações são processadas imediatamente.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2" style={{ color: '#FFFFFF' }}>Há taxa de cancelamento?</h4>
              <p style={{ color: '#999' }}>Não! Você pode cancelar sua assinatura a qualquer momento sem taxas.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2" style={{ color: '#FFFFFF' }}>Os dados são seguros?</h4>
              <p style={{ color: '#999' }}>Sim! Utilizamos Firebase (Google) para armazenamento com criptografia de ponta a ponta.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planos;


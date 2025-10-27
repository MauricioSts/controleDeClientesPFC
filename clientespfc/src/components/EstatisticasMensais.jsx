import { useMemo } from "react";
import { Calendar, DollarSign, ShoppingCart } from "lucide-react";

function EstatisticasMensais({ clientes }) {
  // Agrupar pedidos por mês
  const pedidosPorMes = useMemo(() => {
    const agrupados = {};
    
    clientes.forEach(cliente => {
      if (!cliente.data) return;
      
      // Extrair mês/ano da data (formato pt-BR: DD/MM/YYYY)
      const partesData = cliente.data.split('/');
      if (partesData.length !== 3) return;
      
      const mes = partesData[1];
      const ano = partesData[2];
      const chave = `${mes}/${ano}`;
      
      if (!agrupados[chave]) {
        agrupados[chave] = {
          mes,
          ano,
          pedidos: [],
          total: 0
        };
      }
      
      agrupados[chave].pedidos.push(cliente);
      agrupados[chave].total += cliente.preco || 0;
    });
    
    // Converter para array e ordenar por data (mais recente primeiro)
    return Object.entries(agrupados)
      .map(([chave, data]) => ({
        chave,
        ...data
      }))
      .sort((a, b) => {
        const anoA = parseInt(a.ano);
        const anoB = parseInt(b.ano);
        const mesA = parseInt(a.mes);
        const mesB = parseInt(b.mes);
        
        if (anoA !== anoB) return anoB - anoA;
        return mesB - mesA;
      });
  }, [clientes]);

  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getNomeMes = (mes) => {
    const index = parseInt(mes) - 1;
    return nomesMeses[index] || mes;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{color: '#3B82F6'}}>
          Estatísticas Mensais
        </h2>
        <p style={{color: '#FFFFFF'}}>Acompanhe seus pedidos e lucros por mês</p>
      </div>

      {pedidosPorMes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2" style={{color: '#3B82F6'}}>
            Nenhum dado disponível
          </h3>
          <p style={{color: '#FFFFFF'}}>
            Adicione pedidos para ver as estatísticas mensais
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pedidosPorMes.map((mesData) => (
            <div
              key={mesData.chave}
              className="backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #3B82F6'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#14B8A6';
                e.target.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#3B82F6';
              }}
            >
              {/* Header do Card de Mês */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl" style={{backgroundColor: '#3B82F6'}}>
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{color: '#3B82F6'}}>
                    {getNomeMes(mesData.mes)}
                  </h3>
                  <p style={{color: '#FFFFFF'}}>{mesData.ano}</p>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="space-y-4">
                {/* Total de Pedidos */}
                <div className="flex items-center justify-between p-3 rounded-xl" style={{backgroundColor: 'rgba(59, 130, 246, 0.1)'}}>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" style={{color: '#3B82F6'}} />
                    <span style={{color: '#FFFFFF'}}>Pedidos</span>
                  </div>
                  <span className="text-xl font-bold" style={{color: '#3B82F6'}}>
                    {mesData.pedidos.length}
                  </span>
                </div>

                {/* Lucro Líquido */}
                <div className="flex items-center justify-between p-3 rounded-xl" style={{backgroundColor: 'rgba(20, 184, 166, 0.1)'}}>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" style={{color: '#14B8A6'}} />
                    <span style={{color: '#FFFFFF'}}>Lucro Líquido</span>
                  </div>
                  <span className="text-xl font-bold" style={{color: '#14B8A6'}}>
                    R$ {mesData.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Tabela de Pedidos do Mês */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm mb-2" style={{color: '#FFFFFF'}}>Pedidos realizados:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {mesData.pedidos.map((pedido, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium" style={{color: '#FFFFFF'}}>
                          {pedido.nome}
                        </p>
                        <p className="text-xs" style={{color: '#999'}}>
                          {pedido.produto}
                        </p>
                      </div>
                      <span className="text-sm font-bold" style={{color: '#14B8A6'}}>
                        R$ {pedido.preco?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumo Total */}
      {pedidosPorMes.length > 0 && (
        <div className="mt-8 backdrop-blur-sm rounded-2xl p-6" style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6'}}>
          <h3 className="text-2xl font-bold mb-4" style={{color: '#3B82F6'}}>Resumo Total</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl" style={{backgroundColor: 'rgba(59, 130, 246, 0.1)'}}>
              <p style={{color: '#FFFFFF'}}>Total de Meses</p>
              <p className="text-3xl font-bold mt-2" style={{color: '#3B82F6'}}>
                {pedidosPorMes.length}
              </p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{backgroundColor: 'rgba(59, 130, 246, 0.1)'}}>
              <p style={{color: '#FFFFFF'}}>Total de Pedidos</p>
              <p className="text-3xl font-bold mt-2" style={{color: '#3B82F6'}}>
                {clientes.length}
              </p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{backgroundColor: 'rgba(20, 184, 166, 0.1)'}}>
              <p style={{color: '#FFFFFF'}}>Lucro Total</p>
              <p className="text-3xl font-bold mt-2" style={{color: '#14B8A6'}}>
                R$ {clientes.reduce((total, c) => total + (c.preco || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EstatisticasMensais;


# 💳 Plano de Monetização - JerseysAndBits

## 🎯 Modelo de Assinatura Recomendado

### Opção 1: Stripe (RECOMENDADO) ⭐
**Por quê?**
- ✅ Mais fácil de integrar
- ✅ Escalável e confiável
- ✅ Gestão automática de assinaturas
- ✅ Dashboard completo
- ✅ Suporta múltiplos idiomas e moedas
- ✅ Webhooks automáticos

**Preço do Stripe:** 2.9% + R$ 0.40 por transação

**Como funciona:**
1. Cria planos no Stripe Dashboard
2. Integra no frontend com Stripe Checkout
3. Gerencia assinaturas automaticamente
4. Webhooks atualizam status do usuário

---

### Opção 2: Mercado Pago
**Por quê?**
- ✅ Popular no Brasil
- ✅ Aceita múltiplas formas de pagamento
- ✅ Taxa: 3.99% a 4.99% + R$ 0.40
- ✅ Mais complexo de integrar

---

### Opção 3: PagSeguro UOL
**Por quê?**
- ✅ Bom para o mercado brasileiro
- ✅ Taxa: ~4% + R$ 0.40
- ✅ Interface menos moderna

---

## 💰 Sugestão de Planos

### 🆓 Plano FREE
- **R$ 0/mês**
- Até 10 pedidos por mês
- Histórico de 3 meses
- Suporte por email

### 🚀 Plano PRO
- **R$ 29,90/mês**
- Pedidos ilimitados
- Histórico completo
- Estatísticas avançadas
- Exportação em PDF
- Suporte prioritário

### 🏢 Plano ENTERPRISE
- **R$ 99,90/mês**
- Tudo do PRO
- Multi-usuários (até 5)
- Relatórios personalizados
- API access
- Suporte 24/7

---

## 🛠️ Implementação Sugerida (Stripe)

### 1. Estrutura no Firebase

```javascript
// users/{userId}
{
  email: "user@example.com",
  subscription: {
    plan: "pro", // "free", "pro", "enterprise"
    status: "active", // "active", "canceled", "past_due"
    stripeCustomerId: "cus_xxxx",
    stripeSubscriptionId: "sub_xxxx",
    currentPeriodEnd: Timestamp,
    createdAt: Timestamp
  },
  features: {
    maxOrders: 1000, // -1 para unlimited
    canExport: true,
    canUseAdvancedStats: true
  }
}
```

### 2. Variáveis de Ambiente

Criar arquivo `.env`:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxx
VITE_STRIPE_PRO_PRICE_ID=price_xxxx
VITE_STRIPE_ENTERPRISE_PRICE_ID=price_xxxx
```

### 3. Integração com Stripe

Criar `src/lib/stripe.js`:
```javascript
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);
```

### 4. Verificação de Limites

Em `AuthenticatedApp.jsx`:
```javascript
const { currentUser } = useAuth();
const [subscription, setSubscription] = useState(null);

// Verificar limite de pedidos
const canAddMoreOrders = () => {
  if (subscription.plan === 'free') {
    return pedidosDoMes.length < 10;
  }
  return true; // Plano PRO tem limite ilimitado
};
```

---

## 📊 Dashboard de Receitas

### Métricas importantes:
- MRR (Monthly Recurring Revenue)
- Churn Rate
- LTV (Lifetime Value)
- CAC (Customer Acquisition Cost)

### Sugestão de Dashboard:
```javascript
// metrics.js
{
  revenue: {
    mrr: 0,
    arr: 0,
    totalRevenue: 0
  },
  subscriptions: {
    free: 0,
    pro: 0,
    enterprise: 0,
    total: 0
  },
  churn: {
    rate: "0%",
    monthlyCancellations: 0
  }
}
```

---

## 🚀 Passo a Passo para Implementar

### Fase 1: Setup Básico (Dia 1-2)
1. Criar conta no Stripe
2. Configurar produtos e preços
3. Configurar webhooks
4. Instalar SDK: `npm install @stripe/stripe-js`

### Fase 2: Integração Frontend (Dia 3-5)
1. Criar página de planos
2. Integrar Stripe Checkout
3. Adicionar botão "Upgrade" no header
4. Criar middleware de verificação de plano

### Fase 3: Sistema de Limites (Dia 6-7)
1. Verificar limite de pedidos no FREE
2. Bloquear funcionalidades premium no FREE
3. Adicionar mensagens de upgrade
4. Implementar contador de uso

### Fase 4: Gestão de Assinaturas (Dia 8-10)
1. Criar página de assinatura
2. Mostrar plano atual
3. Permitir upgrade/downgrade
4. Implementar cancelamento

---

## 💡 Dicas para Maximizar Conversões

### 1. Pricing Psychology
- ✅ Mostrar economia anual (ex: "R$ 24,90/mês se pago anualmente")
- ✅ Destacar o plano POPULAR
- ✅ Comparação lado a lado

### 2. Social Proof
- Adicionar badges "Mais popular"
- Mostrar número de usuários
- Depoimentos de clientes

### 3. Free Trial Inteligente
- 14 dias grátis no PRO
- Sem necessidade de cartão
- Upgrade automático no término

### 4. Onboarding
- Guia interativo
- Destacar funcionalidades premium
- Calls-to-action estratégicos

---

## 📈 Projeção de Receita

### Cenário Conservador (Ano 1):
- 50 usuários FREE
- 20 usuários PRO (R$ 29,90)
- 5 usuários ENTERPRISE (R$ 99,90)

**MRR:** R$ 1.098,10
**ARR:** R$ 13.177,20

### Cenário Otimista (Ano 1):
- 200 usuários FREE
- 100 usuários PRO
- 20 usuários ENTERPRISE

**MRR:** R$ 4.987,00
**ARR:** R$ 59.844,00

---

## 🎨 Sugestão de UI para Planos

Criar página `/pricing` com:
- Cards de planos lado a lado
- Botão "Mais Popular" destacado
- Tabela comparativa
- FAQ sobre preços
- Botão de upgrade visível no header

---

## 🔐 Segurança

1. **Validation no Backend**
   - Sempre verificar status da assinatura no backend
   - Nunca confiar apenas no frontend

2. **Firestore Security Rules**
   ```javascript
   match /clientes/{clienteId} {
     allow read: if request.auth != null && 
                  resource.data.userId == request.auth.uid &&
                  isValidUser(request.auth.uid);
     // ...
   }
   ```

3. **Rate Limiting**
   - Limitar número de writes por dia
   - Prevenir abuso do FREE

---

## 📞 Próximos Passos

1. **Escolher plataforma** (Stripe recomendado)
2. **Criar planos no dashboard**
3. **Integrar Checkout no frontend**
4. **Implementar verificação de limites**
5. **Criar página de gerenciamento de assinatura**
6. **Adicionar analytics de conversão**

---

## 📚 Recursos Úteis

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Subscription Management](https://stripe.com/docs/billing/subscriptions/overview)
- [Mercado Pago Assinaturas](https://www.mercadopago.com.br/developers/pt/docs/subscriptions)

---

**💡 Dica Final:** Comece com Stripe + Plano FREE. É a opção mais rápida de implementar e escalar!


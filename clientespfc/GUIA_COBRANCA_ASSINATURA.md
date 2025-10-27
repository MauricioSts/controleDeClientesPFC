# 🎯 Guia Passo a Passo - Ativar Cobranças por Assinatura

## 🚀 Opção Recomendada: Stripe (Mais Fácil e Barata)

### **Passo 1: Criar Conta no Stripe** (10 minutos)

1. Acesse: https://stripe.com
2. Clique em "Sign Up" (canto superior direito)
3. Preencha seus dados (email, nome, país: Brasil)
4. Confirme seu email
5. Complete o onboarding

### **Passo 2: Criar Produtos e Preços** (5 minutos)

No Dashboard do Stripe:

1. Vá em **Products** (menu lateral)
2. Clique em **+ Add product**

#### Criar Plano PRO:
- Nome: `JerseysAndBits PRO`
- Descrição: `Assinatura mensal PRO - Pedidos ilimitados`
- Preço: `R$ 24,90`
- Billing: `Recurring monthly`
- Criar produto

**📝 Anote o Price ID** (formato: `price_xxxxx`)

---

### **Passo 3: Instalar Dependências** (2 minutos)

```bash
npm install @stripe/stripe-js
```

---

### **Passo 4: Configurar Variáveis de Ambiente**

Criar arquivo `.env` na raiz do projeto:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_STRIPE_PRO_PRICE_ID=price_xxxxx
```

**⚠️ Importante:** Use as chaves de TESTE primeiro!

---

### **Passo 5: Criar Página de Checkout**

Criar arquivo: `src/components/CheckoutPage.jsx`

```javascript
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutPage({ priceId, planName, onClose }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // Criar sessão de checkout no backend
      const response = await fetch('YOUR_BACKEND_URL/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: currentUser.uid,
          email: currentUser.email
        })
      });

      const { sessionId } = await response.json();

      // Redirecionar para Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] rounded-2xl p-8 max-w-md w-full border border-[#3B82F6]">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#3B82F6' }}>
          Confirmar Assinatura
        </h2>
        <p className="mb-6" style={{ color: '#FFFFFF' }}>
          Você está assinando o plano <strong>{planName}</strong>
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors"
            style={{ backgroundColor: '#1e293b', border: '1px solid #3B82F6', color: '#FFFFFF' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors"
            style={{ backgroundColor: '#3B82F6', color: '#FFFFFF' }}
          >
            {loading ? "Processando..." : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
```

---

### **Passo 6: Atualizar Componente Planos**

Adicionar ao `src/components/Planos.jsx`:

```javascript
import { useState } from "react";
import CheckoutPage from "./CheckoutPage";

function Planos({ planoAtual = "free" }) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const handleSelect = (plano) => {
    if (plano.nome === "FREE") return;
    
    setSelectedPlan(plano);
    setShowCheckout(true);
  };

  // ... código existente ...

  if (showCheckout && selectedPlan) {
    return (
      <CheckoutPage
        priceId={getPriceId(selectedPlan)}
        planName={selectedPlan.nome}
        onClose={() => {
          setShowCheckout(false);
          setSelectedPlan(null);
        }}
      />
    );
  }
}
```

---

### **Passo 7: Criar Backend/API** (IMPORTANTE!)

Você precisa criar uma API backend para:
1. Criar sessão de checkout
2. Receber webhooks do Stripe
3. Atualizar status do usuário no Firebase

#### Opção A: Firebase Cloud Functions (Recomendado)

```javascript
// functions/index.js
const stripe = require('stripe')(functions.config().stripe.secret_key);

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  const { priceId, userId } = data;
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: 'https://yourapp.com/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://yourapp.com/cancel',
    metadata: { userId }
  });
  
  return { sessionId: session.id };
});
```

#### Opção B: Backend Separado (Node.js/Express)

```javascript
// backend/index.js
const express = require('express');
const stripe = require('stripe')('sk_live_xxxxx');

app.post('/api/create-checkout-session', async (req, res) => {
  const { priceId, userId, email } = req.body;
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: email,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: 'https://yourapp.com/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://yourapp.com/cancel',
    metadata: { userId }
  });
  
  res.json({ sessionId: session.id });
});

// Webhook para atualizar status
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    
    // Atualizar Firebase
    await admin.firestore().collection('users').doc(userId).update({
      subscription: {
        plan: 'pro', // ou 'enterprise'
        status: 'active',
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        currentPeriodEnd: session.subscription_details.current_period_end
      }
    });
  }
  
  res.json({ received: true });
});
```

---

### **Passo 8: Atualizar AuthenticatedApp para Verificar Limites**

Adicionar verificação de plano no `src/components/AuthenticatedApp.jsx`:

```javascript
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

function AuthenticatedApp() {
  const { currentUser } = useAuth();
  const [userPlan, setUserPlan] = useState("free");
  const [canAddOrder, setCanAddOrder] = useState(true);

  useEffect(() => {
    if (currentUser) {
      // Buscar dados do usuário
      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserPlan(data.subscription?.plan || "free");
          
          // Verificar limite de pedidos
          if (data.subscription?.plan === "free") {
            // Contar pedidos do mês atual
            const pedidosDoMes = await getPedidosDoMes(currentUser.uid);
            setCanAddOrder(pedidosDoMes < 10);
          } else {
            setCanAddOrder(true);
          }
        }
      };
      fetchUserData();
    }
  }, [currentUser]);

  const handleAddCliente = async (cliente) => {
    if (!canAddOrder) {
      toast.error("Você atingiu o limite do plano FREE. Faça upgrade para PRO!");
      return;
    }
    
    // ... código existente ...
  };

  return (
    <div>
      {!canAddOrder && (
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4 mb-4">
          <p style={{ color: '#FFFFFF' }}>
            Limite atingido! <a href="/planos">Upgrade para PRO</a>
          </p>
        </div>
      )}
      {/* ... resto do código ... */}
    </div>
  );
}
```

---

### **Passo 9: Configurar Firestore Security Rules**

Adicionar à coleção `users`:

```javascript
match /users/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow write: if false; // Apenas via backend/webhook
}
```

---

### **Passo 10: Testar o Fluxo**

1. **Modo Teste do Stripe:**
   - Use cartão de teste: `4242 4242 4242 4242`
   - Data: qualquer data futura
   - CVC: qualquer 3 dígitos

2. **Verificar cadastro:**
   - Acesse Stripe Dashboard → Customers
   - Veja se o usuário foi criado

3. **Verificar Firebase:**
   - Acesse Firestore → users
   - Veja se `subscription` foi atualizado

---

## 📊 Resumo do Fluxo

```
1. Usuário clica "Assinar Agora" no plano PRO
2. Frontend redireciona para Stripe Checkout
3. Usuário paga no Stripe
4. Stripe envia webhook para seu backend
5. Backend atualiza status no Firebase
6. Usuário volta para o app com plano ativo
```

---

## 🎯 Preço Efetivo das Taxas

### Stripe:
- 2.9% + R$ 0.40 por transação
- R$ 29.90 → Recebe: **R$ 28.83**
- R$ 99.90 → Recebe: **R$ 96.81**

### Entrada de Caixa Estimada (Mês 3):

**Cenário Conservador:**
- 25 x PRO = R$ 612,50
- **Total: R$ 612,50/mês**

---

## ✅ Checklist de Implementação

- [ ] Criar conta Stripe
- [ ] Criar produtos e preços
- [ ] Instalar `@stripe/stripe-js`
- [ ] Configurar `.env`
- [ ] Criar componente CheckoutPage
- [ ] Atualizar componente Planos
- [ ] Criar backend/API (Cloud Functions ou servidor)
- [ ] Configurar webhook
- [ ] Adicionar verificação de limites
- [ ] Testar em modo teste
- [ ] Ativar modo produção

---

## 🚨 Importante

1. **Sempre teste antes de ativar produção**
2. **Configure webhooks ANTES de lançar**
3. **Documente o fluxo para manutenção**
4. **Monitore primeira semana após lançar**

---

## 📞 Próximos Passos

Depois de implementar:

1. **Marketing:** Divulgue o sistema
2. **Análise:** Acompanhe conversões no Stripe Dashboard
3. **Otimização:** Ajuste preços baseado em dados
4. **Expansão:** Adicione mais funcionalidades premium

---

**💡 Dica:** Mantenha dois planos (FREE e PRO) para simplicidade e conversão focada.


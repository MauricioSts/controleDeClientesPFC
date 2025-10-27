# 🎯 Próximos Passos - Integração Completa

## ⚠️ Situação Atual

✅ **Funcionando:**
- Link Stripe integrado
- Redirecionamento para checkout
- Pagamento processado

❌ **Faltando:**
- Sistema não detecta plano ativo do usuário
- Funcionalidades do PRO desbloqueadas para todos
- Limite de 3 pedidos/mês (FREE) não implementado

---

## 🚀 Opção A: Solução Manual (Temporária)

### Funcionamento:
1. Usuário compra no Stripe
2. Você recebe notificação por email
3. Você manualmente atualiza no Firebase

### Como implementar:
1. **Criar coleção `users` no Firestore**
2. **Estrutura de dados:**
```javascript
users/{userId} {
  email: "user@email.com",
  subscription: {
    plan: "free", // ou "pro"
    status: "active",
    startDate: "2024-01-15",
    nextBilling: "2024-02-15"
  }
}
```

3. **Verificar plano antes de adicionar pedido:**
```javascript
// Em AuthenticatedApp.jsx
const canAddOrder = async () => {
  const userDoc = await getDoc(doc(db, "users", currentUser.uid));
  const plan = userDoc.data()?.subscription?.plan || "free";
  
  if (plan === "free") {
    // Contar pedidos do mês
    const pedidosDoMes = await countPedidosDoMes();
    return pedidosDoMes < 3;
  }
  
  return true; // PRO = ilimitado
};
```

---

## 🏆 Opção B: Solução Automática (Recomendada)

### Requer: Backend + Webhooks

### Fluxo:
1. Usuário compra no Stripe
2. Stripe envia webhook para seu backend
3. Backend atualiza Firebase automaticamente
4. Sistema aplica limites instantaneamente

### Implementação Completa:

#### 1. Criar Backend (Vercel/Netlify)

Arquivo: `api/webhook.js`
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Obter userId do metadata
    const userId = session.metadata.userId;
    
    if (!userId) {
      console.error('No userId in metadata');
      return res.status(400).json({ error: 'No userId' });
    }

    // Atualizar Firebase
    await admin.firestore().collection('users').doc(userId).set({
      subscription: {
        plan: 'pro',
        status: 'active',
        startDate: new Date(),
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
      }
    }, { merge: true });

    console.log('Subscription activated for user:', userId);
  }

  res.json({ received: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
```

#### 2. Configurar Webhook no Stripe

1. Stripe Dashboard → Developers → Webhooks
2. Click "+ Add endpoint"
3. URL: `https://yourapp.vercel.app/api/webhook`
4. Events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
5. Copiar "Signing secret"

#### 3. Atualizar Payment Link para incluir metadata

No Stripe Dashboard, ao criar o checkout, adicione:
```javascript
metadata: {
  userId: currentUser.uid
}
```

#### 4. Implementar verificação de limites

Em `AuthenticatedApp.jsx`:

```javascript
import { useState, useEffect } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-hot-toast";

function AuthenticatedApp() {
  const { currentUser } = useAuth();
  const [userPlan, setUserPlan] = useState("free");
  const [canAddOrder, setCanAddOrder] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchUserPlan = async () => {
      try {
        // Buscar dados do usuário
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        
        if (userDoc.exists()) {
          const plan = userDoc.data().subscription?.plan || "free";
          setUserPlan(plan);

          // Verificar limites se for FREE
          if (plan === "free") {
            const inicioMes = new Date();
            inicioMes.setDate(1);
            inicioMes.setHours(0, 0, 0, 0);

            const pedidosRef = query(
              collection(db, "clientes"),
              where("userId", "==", currentUser.uid)
            );

            const snapshot = await getDocs(pedidosRef);
            const pedidosDoMes = snapshot.docs.filter(doc => {
              const data = doc.data();
              return data.createdAt?.toDate() >= inicioMes;
            });

            setCanAddOrder(pedidosDoMes.length < 3);
          } else {
            setCanAddOrder(true); // PRO = ilimitado
          }
        }
      } catch (error) {
        console.error("Erro ao buscar plano:", error);
      }
    };

    fetchUserPlan();
  }, [currentUser]);

  const handleAddCliente = async (cliente) => {
    // Verificar se pode adicionar
    if (!canAddOrder) {
      toast.error(
        "Você atingiu o limite do plano FREE (3 pedidos/mês). Faça upgrade para PRO!"
      );
      return;
    }

    // ... resto do código para adicionar pedido ...
  };

  return (
    <div>
      {/* Alerta de limite atingido */}
      {!canAddOrder && (
        <div className="mb-4 p-4 rounded-xl border-2" style={{
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          color: '#fff'
        }}>
          <p className="font-bold">
            ⚠️ Limite atingido! Faça upgrade para PRO para continuar.
          </p>
        </div>
      )}

      {/* Info do plano */}
      <div className="mb-4 p-3 rounded-lg text-center" style={{
        backgroundColor: '#1e293b',
        border: '1px solid #3B82F6'
      }}>
        <p style={{ color: '#fff' }}>
          📦 Plano: <strong>{userPlan.toUpperCase()}</strong>
          {userPlan === "free" && (
            <span> | Restam: {3} pedidos/mês</span>
          )}
        </p>
      </div>

      {/* ... resto do componente ... */}
    </div>
  );
}
```

---

## 📊 Comparação

| Recurso | Opção A (Manual) | Opção B (Automática) |
|---------|------------------|---------------------|
| Implementação | 30 min | 2-3 horas |
| Requer backend | ❌ | ✅ |
| Automático | ❌ | ✅ |
| Escalável | ❌ | ✅ |
| Profissional | ⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎯 Recomendação

**Para começar HOJE:** 
Use Opção A manual enquanto desenvolve a Opção B.

**Para produção:**
Implemente Opção B (webhooks + backend).

---

## 📝 Próximos Passos Immediatos

1. ✅ Criar coleção `users` no Firestore
2. ⚠️ Implementar verificação de plano básica
3. ⚠️ Adicionar limites de pedidos
4. 📈 Desenvolver sistema de webhooks

---

## 💰 Estimativa de Trabalho

- **Opção A**: 1-2 horas
- **Opção B**: 3-4 horas

**Resultado: Sistema 100% funcional com controle automático de acesso!**


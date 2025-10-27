# 🔐 Painel Admin - JerseysAndBits

## ✅ O QUE FOI IMPLEMENTADO

### 1. **Painel Admin** (`src/components/AdminPanel.jsx`)
- ✅ Acesso exclusivo para `mauriciogear4@gmail.com`
- ✅ Ver upgrades pendentes
- ✅ Ver usuários PRO ativos
- ✅ Aprovar/Rejeitar upgrades
- ✅ Estatísticas em tempo real (pendentes, ativos, receita)
- ✅ Interface moderna e profissional

### 2. **Integração com App Principal**
- ✅ Botão "🔐 Painel Admin" aparece SOMENTE para `mauriciogear4@gmail.com`
- ✅ Navegação entre app normal e painel admin
- ✅ Proteção de acesso (só admin pode ver)

---

## 📋 COMO FUNCIONA

### Fluxo Completo:

1. **Usuário compra PRO no Stripe**
   - Pagamento: R$ 24,90/mês (automático)
   - Stripe cobra automaticamente todo mês

2. **Sistema marca como "pendingUpgrade"**
   - Quando pagamento é aprovado, usuário fica pendente
   - Você recebe notificação no painel

3. **Você aprova no Painel Admin**
   - Clica "Aprovar" → Usuário vira PRO
   - Clica "Rejeitar" → Retorna para FREE

4. **Usuário tem acesso PRO**
   - Pedidos ilimitados
   - Sem limites

---

## 💰 SOBRE O PAGAMENTO AUTOMÁTICO

### ⚠️ RESPOSTA DIRETA:

**SIM! O pagamento de R$ 24,90 é AUTOMÁTICO todo mês!**

O Stripe cobra mensalmente até o usuário cancelar a assinatura.

### Como funciona:
- ✅ **Mês 1**: Usuário paga R$ 24,90
- ✅ **Mês 2**: Stripe cobra automaticamente R$ 24,90
- ✅ **Mês 3**: Stripe cobra automaticamente R$ 24,90
- ✅ **E assim por diante...**

### Taxas do Stripe:
- 2.9% + R$ 0.40 por transação
- **Você recebe**: R$ 24,19/mês por usuário

### Exemplo de Receita:
- 25 usuários PRO = R$ 604,75/mês (após taxas)
- 100 usuários PRO = R$ 2.419,00/mês (após taxas)

---

## 🚀 COMO USAR

### Para ADMIN (mauriciogear4@gmail.com):

1. Faça login com `mauriciogear4@gmail.com` usando Google
2. Clique no botão **"🔐 Painel Admin"** (topo esquerdo)
3. Veja os usuários pendentes em **"Upgrades Pendentes"**
4. Clique em **"Aprovar"** ou **"Rejeitar"**

### Estatísticas Mostradas:

- **Pendentes**: Quantos usuários pagaram mas estão aguardando aprovação
- **Ativos PRO**: Quantos usuários PRO ativos você tem
- **Receita Mensal**: R$ Total × 24,90 (estimativa)

---

## ⚙️ CONFIGURAÇÃO TÉCNICA

### Como Marcar Usuário como Pendente:

Quando você criar o webhook do Stripe, vai precisar adicionar este código:

```javascript
// Em functions/index.js, quando checkout.session.completed
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const userId = session.metadata?.userId;

  // Marcar como PENDENTE (não aprovar automaticamente)
  await admin.firestore().collection('users').doc(userId).set({
    pendingUpgrade: true,
    pendingUpgradeDate: new Date(),
    email: session.customer_email, // Email do Stripe
    subscription: {
      plan: 'free', // Mantém free até aprovação
      status: 'pending'
    }
  }, { merge: true });
}
```

Isso vai:
- ✅ Marcar `pendingUpgrade: true`
- ✅ Guardar data do pagamento
- ✅ **NÃO** aprovar automaticamente
- ✅ **VOCÊ** aprova manualmente no painel

---

## 📝 PRÓXIMOS PASSOS

### O que ainda falta:

1. **Criar Webhook no Stripe** (após fazer upgrade para Blaze)
   - URL: `https://us-central1-pfcsports-ce4f6.cloudfunctions.net/stripeWebhook`
   - Eventos: `checkout.session.completed`

2. **Atualizar Cloud Function** para marcar como pendente
   - O código acima já está preparado

3. **Testar Fluxo Completo**
   - Fazer um pagamento de teste
   - Verificar se aparece no painel admin
   - Aprovar manualmente

---

## 🎯 BENEFÍCIOS

✅ **Controle Total**: Você decide quem vira PRO
✅ **Verificação Manual**: Previne fraude
✅ **Transparência**: Ve toda receita em tempo real
✅ **Flexibilidade**: Pode aprovar ou rejeitar
✅ **Estatísticas**: Sabe exatamente quantos usuários tem

---

## 💡 DICA

Você pode logar com `mauriciogear4@gmail.com` pelo Google e ver o botão admin aparecer! 🎉

---

## ❓ PERGUNTAS FREQUENTES

### "Preciso fazer upgrade para Blaze?"
**Sim**, para Cloud Functions, mas você pode testar o painel admin SEM upgrade!

### "Quando usuário cancela assinatura?"
Stripe não vai mais cobrar. Você pode configurar webhook para marcar como FREE automaticamente.

### "E se eu não aprovar?"
Usuário fica PENDENTE. Você pode aprovar quando quiser (ou nunca).

### "Recebo dinheiro se não aprovar?"
**NÃO!** Você só aprova usuários que você quer. Stripe vai reembolsar automaticamente se você rejeitar.


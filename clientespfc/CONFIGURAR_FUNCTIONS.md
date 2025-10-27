# 🔧 Configurar Cloud Functions - Passo a Passo

## ⚠️ IMPORTANTE: Sua chave Stripe foi compartilhada!

**Você deve RENOVAR essa chave de TESTE após configurar!**

Acesse: https://dashboard.stripe.com/test/apikeys
E gere uma nova chave.

---

## 📋 Passo 1: Login no Firebase

```bash
firebase login
```

---

## 📋 Passo 2: Configurar Variáveis de Ambiente

```bash
firebase functions:config:set stripe.secret_key="SUA_CHAVE_STRIPE_AQUI"
```

**Você ainda não tem o webhook_secret.** Continue para configurá-lo.

---

## 📋 Passo 3: Deploy das Cloud Functions (PRIMEIRO)

Antes de configurar o webhook, vamos fazer deploy:

```bash
firebase deploy --only functions
```

Isso vai retornar uma URL como:
```
https://us-central1-pfcsports-ce4f6.cloudfunctions.net/stripeWebhook
```

**COPIE essa URL!** Você vai precisar dela no próximo passo.

---

## 📋 Passo 4: Configurar Webhook no Stripe

### 4.1 Acesse o Stripe Dashboard
https://dashboard.stripe.com/test/webhooks

### 4.2 Criar Webhook
1. Clique em **"+ Add endpoint"**
2. **Endpoint URL**: Cole a URL que você copiou do Firebase
   - Exemplo: `https://us-central1-pfcsports-ce4f6.cloudfunctions.net/stripeWebhook`
3. **Events to send**: 
   - Selecionar **custom**
   - Adicionar: `checkout.session.completed`
   - Adicionar: `customer.subscription.deleted`
4. Clique **"Add endpoint"**

### 4.3 Copiar Signing Secret
1. Depois de criar, vá na página do webhook
2. Clique em **"Signing secret"**
3. Clique em **"Reveal"**
4. **COPIE o valor** (whsec_xxxxx)

---

## 📋 Passo 5: Configurar Webhook Secret no Firebase

```bash
firebase functions:config:set stripe.webhook_secret="whsec_xxxxx"
```

**Substitua** `whsec_xxxxx` pelo valor que você copiou.

---

## 📋 Passo 6: Deploy Novamente

```bash
firebase deploy --only functions
```

---

## 📋 Passo 7: Configurar URL de Sucesso no Stripe

1. Acesse: https://dashboard.stripe.com/test/payment_links
2. Edite seu Payment Link criado
3. Configure:
   - **Success page URL**: `http://localhost:5173/success.html` (desenvolvimento)
   - **Success page URL**: `https://seudominio.com/success.html` (produção)

---

## ✅ Pronto!

Agora você tem:
- ✅ Cloud Functions deployadas
- ✅ Webhook configurado
- ✅ URL de sucesso configurada

---

## 🧪 Testar

1. Acesse seu app
2. Faça login
3. Clique em "Assinar Agora" no plano PRO
4. Use cartão de teste: `4242 4242 4242 4242`
5. Após pagamento, volte para o app
6. Verifique se o badge mudou para "PRO"

---

## 🚨 Importante: Renovar Chave Stripe

**Por segurança, RENOVE a chave depois de configurar:**

1. Acesse: https://dashboard.stripe.com/test/apikeys
2. Revoke (revogar) a chave atual: `sk_test_51SMz95...`
3. Criar nova chave
4. Atualizar no Firebase:

```bash
firebase functions:config:set stripe.secret_key="NOVA_CHAVE"
firebase deploy --only functions
```

---

## 📊 Monitorar

### Ver logs das Functions:
```bash
firebase functions:log
```

### Ver webhooks recebidos:
https://dashboard.stripe.com/test/webhooks

### Ver dados no Firestore:
https://console.firebase.google.com/project/pfcsports-ce4f6/firestore

---

## 🎯 Resumo dos Comandos

```bash
# 1. Login
firebase login

# 2. Configurar chave Stripe
firebase functions:config:set stripe.secret_key="SUA_CHAVE_AQUI"

# 3. Deploy (para pegar URL do webhook)
firebase deploy --only functions

# 4. Criar webhook no Stripe (no dashboard)

# 5. Configurar webhook secret
firebase functions:config:set stripe.webhook_secret="whsec_xxx"

# 6. Deploy final
firebase deploy --only functions
```

---

**💡 Dica:** Mantenha suas chaves seguras! Nunca commite elas no Git.


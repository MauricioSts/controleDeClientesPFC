# 🚀 Guia de Deploy Completo - Sistema com Stripe

## ✅ O que foi implementado:

### Funcionalidades:
1. ✅ Cloud Functions no Firebase
2. ✅ Webhooks do Stripe configurados
3. ✅ Verificação automática de plano (FREE vs PRO)
4. ✅ Limite de 3 pedidos/mês para plano FREE
5. ✅ Contador de pedidos em tempo real
6. ✅ Alertas visuais quando limite é atingido
7. ✅ Badge de plano ativo

### Estrutura criada:
```
functions/
  ├── index.js          # Webhooks + Checkout
  ├── package.json      # Dependências
  └── .eslintrc.js      # Configuração

firebase.json           # Config do projeto
firestore.rules         # Regras de segurança
firestore.indexes.json  # Índices do Firestore
```

---

## 📋 PASSO 1: Instalar dependências do Functions

```bash
cd functions
npm install
cd ..
```

---

## 📋 PASSO 2: Configurar Stripe no Firebase

### 2.1 Obter chaves do Stripe

No Stripe Dashboard:
1. **API Keys** → Copy **Secret key** (sk_live_xxx ou sk_test_xxx)
2. **Webhooks** → Criar novo webhook
3. **URL**: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/stripeWebhook`
4. **Eventos**: 
   - `checkout.session.completed`
   - `customer.subscription.deleted`
5. **Copiar** "Signing secret" (whsec_xxx)

### 2.2 Adicionar configurações no Firebase

```bash
firebase functions:config:set stripe.secret_key="sk_live_xxxxx"
firebase functions:config:set stripe.webhook_secret="whsec_xxxxx"
```

---

## 📋 PASSO 3: Deploy das Cloud Functions

```bash
firebase deploy --only functions
```

Isso vai criar:
- ✅ `stripeWebhook` → Recebe webhooks do Stripe
- ✅ `createCheckoutSession` → Cria sessão de checkout

---

## 📋 PASSO 4: Configurar Regras do Firestore

```bash
firebase deploy --only firestore:rules
```

---

## 📋 PASSO 5: Atualizar Link de Sucesso no Stripe

No Stripe Dashboard → Payment Links → Editar:

**Success URL**: 
```
https://yourapp.com/success.html
```

**Cancel URL**:
```
https://yourapp.com
```

---

## 📋 PASSO 6: Deploy do Frontend

### Opção A: Firebase Hosting (Recomendado)

```bash
# Instalar Firebase CLI (se não instalou)
npm install -g firebase-tools

# Login
firebase login

# Inicializar hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### Opção B: Vercel

```bash
npm install -g vercel
vercel --prod
```

### Opção C: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## ⚙️ Variáveis de Ambiente (Frontend)

Crie `.env.production`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🎯 Testar o Fluxo Completo

### 1. Teste Plano FREE (Limite)
- [ ] Criar conta
- [ ] Adicionar 3 pedidos
- [ ] Tentar adicionar 4º pedido
- [ ] Verificar alerta de limite

### 2. Teste Compra PRO
- [ ] Clicar em "Assinar Agora"
- [ ] Pagar com cartão de teste: `4242 4242 4242 4242`
- [ ] Verificar redirecionamento para success.html
- [ ] Verificar atualização para plano PRO
- [ ] Testar adicionar pedidos ilimitados

### 3. Teste Webhook
- [ ] Fazer uma compra
- [ ] Verificar logs: `firebase functions:log`
- [ ] Verificar Firestore: coleção `users`

---

## 🔍 Debugging

### Ver logs das Cloud Functions:
```bash
firebase functions:log
```

### Testar webhook localmente:
```bash
# Terminal 1: Start emulator
firebase emulators:start

# Terminal 2: Tunnel para Stripe
ngrok http 5001
# Usar URL do ngrok no Stripe Dashboard
```

### Ver dados no Firestore:
```bash
firebase firestore:get /users/USER_ID
```

---

## 📊 Monitoramento

### Firebase Console
- **Functions**: https://console.firebase.google.com/project/YOUR_PROJECT/functions
- **Firestore**: https://console.firebase.google.com/project/YOUR_PROJECT/firestore

### Stripe Dashboard
- **Webhooks**: https://dashboard.stripe.com/webhooks
- **Logs**: https://dashboard.stripe.com/logs
- **Customers**: https://dashboard.stripe.com/customers

---

## 🚨 Troubleshooting

### "Webhook não está sendo recebido"
1. Verificar URL no Stripe
2. Verificar `webhook_secret` configurado
3. Ver logs: `firebase functions:log`

### "Usuário não vira PRO após pagamento"
1. Verificar se webhook foi recebido
2. Verificar metadata no Stripe checkout
3. Ver logs do webhook
4. Verificar Firestore: coleção `users`

### "Limite não funciona"
1. Verificar se `userPlan` está sendo buscado corretamente
2. Verificar contagem de pedidos do mês
3. Ver console do browser para erros

---

## ✅ Checklist Final

Antes de ir para produção:

- [ ] Cloud Functions deployadas
- [ ] Webhook configurado no Stripe
- [ ] URL de sucesso configurada
- [ ] Regras do Firestore aplicadas
- [ ] Frontend deployado
- [ ] Testado com cartões de teste
- [ ] Modo Test Mode → Modo Live no Stripe
- [ ] Backup das chaves e configurações

---

## 🎉 Você está pronto para lançar!

Depois de seguir todos os passos, seu sistema SaaS está **100% funcional** com:

✅ Pagamentos automatizados
✅ Controle de acesso por plano
✅ Limites de pedidos
✅ Webhooks em tempo real
✅ Sistema escalável

**Boa sorte com seu SaaS! 🚀**


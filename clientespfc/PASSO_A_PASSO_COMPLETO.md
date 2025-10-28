# 🎯 PASSO A PASSO COMPLETO - De 0 a 100%

Este guia vai te levar desde o início até ter um sistema 100% funcional com pagamentos.

---

## 📋 VISÃO GERAL

**O que você já tem:**
- ✅ Código do sistema implementado
- ✅ Interface pronta
- ✅ Verificação de plano (FREE/PRO)
- ✅ Limite de 3 pedidos/mês para FREE
- ✅ Link do Stripe configurado
- ✅ Cloud Functions criadas

**O que falta fazer:**
- ⚠️ Deploy das Cloud Functions
- ⚠️ Configurar webhook do Stripe
- ⚠️ Testar tudo

---

## 🚀 FASE 1: PREPARAÇÃO (10 minutos)

### 1.1 Abrir Terminal e Navegar até a Pasta

```bash
cd C:\Users\mauri\controleDeClientesPFC\jerseyandbits
```

### 1.2 Verificar se está tudo instalado

```bash
npm --version
firebase --version
```

Se algum não funcionar:
```bash
npm install -g firebase-tools
```

---

## 🔐 FASE 2: CONFIGURAR FIREBASE (15 minutos)

### 2.1 Login no Firebase

```bash
firebase login
```

**Isso vai:**
1. Abrir navegador
2. Pedir para logar com Google
3. Autorizar Firebase CLI

### 2.2 Conectar ao Projeto

```bash
firebase use --add
```

**Selecione:**
- Projeto: `pfcsports-ce4f6` (ou outro seu)

### 2.3 Configurar Chave do Stripe

```bash
firebase functions:config:set stripe.secret_key="SUA_CHAVE_STRIPE_AQUI"
```

✅ **Isso configura a chave do Stripe**

---

## 📦 FASE 3: DEPLOY DAS FUNCTIONS (5 minutos)

### 3.1 Fazer Deploy

```bash
firebase deploy --only functions
```

**Isso vai:**
1. Compilar as Cloud Functions
2. Deploy no Firebase
3. Retornar URLs das functions

### 3.2 Copiar a URL do Webhook

**Você vai ver algo como:**

```
✔  Deployed!
✔  Function URLs:
✔    stripeWebhook: https://us-central1-pfcsports-ce4f6.cloudfunctions.net/stripeWebhook
```

**COPIE essa URL!** Você vai precisar dela.

---

## 🔗 FASE 4: CONFIGURAR WEBHOOK NO STRIPE (10 minutos)

### 4.1 Acessar Stripe Dashboard

1. Acesse: https://dashboard.stripe.com/test/webhooks
2. Faça login (se necessário)

### 4.2 Criar Webhook

1. Clique **"+ Add endpoint"**
2. **Endpoint URL**: Cole a URL que você copiou
   ```
   https://us-central1-pfcsports-ce4f6.cloudfunctions.net/stripeWebhook
   ```
3. **Description**: `Webhook do JerseysAndBits`
4. **Events to send**: 
   - Clique em **"Select events"**
   - Marque: `checkout.session.completed`
   - Marque: `customer.subscription.deleted`
5. Clique **"Add endpoint"**

### 4.3 Copiar Signing Secret

1. Depois de criar, clique no webhook criado
2. Clique em **"Signing secret"**
3. Clique em **"Reveal"**
4. **COPIE o valor** (whsec_xxxxx)

### 4.4 Configurar no Firebase

Volte ao terminal e execute:

```bash
firebase functions:config:set stripe.webhook_secret="WH_SEC_AQUI"
```

**Substitua** `WH_SEC_AQUI` pelo valor que você copiou.

### 4.5 Deploy Novamente

```bash
firebase deploy --only functions
```

---

## 🎨 FASE 5: CONFIGURAR URL DE SUCESSO NO STRIPE (5 minutos)

### 5.1 Acessar Payment Links

1. Vá para: https://dashboard.stripe.com/test/payment_links
2. Clique no link que você criou anteriormente (jerseysAndBits PRO)

### 5.2 Editar Link

1. Clique em **"Edit"** ou **"..."** → **"Edit"**
2. Role até **"After payment"**
3. Configure:
   - **Success page URL**: `http://localhost:5173/success.html` (se estiver testando localmente)
   - OU: `https://seudominio.com/success.html` (quando fizer deploy)

4. Clique **"Save"**

---

## 🎯 FASE 6: TESTAR SISTEMA (10 minutos)

### 6.1 Iniciar o App

```bash
npm run dev
```

### 6.2 Testar Plano FREE

1. Abra o navegador em `http://localhost:5173`
2. Crie uma conta ou faça login
3. **Verifique:**
   - Badge mostra "FREE"
   - Contador mostra "0/3 pedidos/mês"
4. Adicione 3 pedidos
5. **Verifique:**
   - Contador mostra "3/3 pedidos/mês"
   - Alerta vermelho aparece: "Limite atingido!"
6. Tente adicionar 4º pedido
   - Deve mostrar erro: "Você atingiu o limite"

### 6.3 Testar Upgrade para PRO

1. Vá na aba "Planos" (na tab de Estatísticas/Planos)
2. Clique em "Assinar Agora" no plano PRO
3. **Use cartão de teste:**
   - Número: `4242 4242 4242 4242`
   - Data: qualquer data futura (ex: 12/34)
   - CVC: `123`
   - Zip: qualquer número (ex: 12345)
4. Clique em "Subscribe"
5. **Verifique:**
   - Redireciona para `success.html`
   - Clique "Voltar para o App"
   - Badge mudou para "PRO"
   - Contador desapareceu (ilimitado)
   - Pode adicionar quantos pedidos quiser

### 6.4 Verificar Webhook

1. Acesse: https://dashboard.stripe.com/test/webhooks
2. Clique no webhook criado
3. Na aba **"Events"**, você deve ver:
   - `checkout.session.completed` (marcado em verde)

✅ **Se aparecer, significa que funcionou!**

---

## 🚨 FASE 7: RENOVAR CHAVE POR SEGURANÇA (5 minutos)

**IMPORTANTE:** Você compartilhou uma chave de teste. Por segurança, renove:

### 7.1 Revogar Chave Antiga

1. Acesse: https://dashboard.stripe.com/test/apikeys
2. Ao lado da chave, clique nos 3 pontos
3. Clique **"Reveal key"** se necessário
4. Identifique a chave que começa com `sk_test_51SMz95...`
5. Clique **"Revoke"** → **"Revoke"**

### 7.2 Criar Nova Chave

1. Clique **"+ Create restricted API key"** OU
2. Clique **"+ Create restricted key"**
3. Marque: **Read and write access**
4. Clique **"Create key"**
5. **COPIE a nova chave**

### 7.3 Atualizar no Firebase

```bash
firebase functions:config:set stripe.secret_key="NOVA_CHAVE_AQUI"
```

### 7.4 Deploy Final

```bash
firebase deploy --only functions
```

---

## 🌐 FASE 8: DEPLOY DO FRONTEND (OPCIONAL - 15 minutos)

### 8.1 Opção A: Firebase Hosting

```bash
# Inicializar (apenas primeira vez)
firebase init hosting

# Selecionar:
# - Public directory: dist
# - Single-page app: N
# - GitHub deploys: N

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

### 8.2 Opção B: Vercel

```bash
npm install -g vercel
vercel --prod
```

### 8.3 Opção C: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### 8.4 Atualizar URL de Sucesso

Depois do deploy, volte ao Stripe e atualize:
```
Success page URL: https://seu-dominio.vercel.app/success.html
```

---

## ✅ CHECKLIST FINAL

Antes de considerar TUDO pronto, verifique:

### Sistema
- [ ] App abre sem erros
- [ ] Login/Cadastro funciona
- [ ] Pedidos são salvos
- [ ] Lista de pedidos mostra corretamente
- [ ] Edição de pedidos funciona
- [ ] Exclusão de pedidos funciona
- [ ] Estatísticas mostram dados corretos
- [ ] Badge mostra plano correto (FREE/PRO)
- [ ] Contador de pedidos funciona
- [ ] Alerta aparece quando limite é atingido

### Pagamentos
- [ ] Link do Stripe funciona
- [ ] Redireciona para checkout
- [ ] Pagamento com cartão de teste funciona
- [ ] Redireciona para success.html
- [ ] Usuário vira PRO após pagamento
- [ ] Webhook recebe eventos no Stripe Dashboard
- [ ] Firestore atualiza automaticamente

### Segurança
- [ ] Chave do Stripe foi renovada
- [ ] Regras do Firestore estão configuradas
- [ ] Webhook secret está configurado
- [ ] Dados dos usuários estão isolados

---

## 🐛 TROUBLESHOOTING

### "Firebase login não funciona"
```bash
firebase logout
firebase login
```

### "Deploy falha"
```bash
firebase functions:delete stripeWebhook
firebase deploy --only functions
```

### "Webhook não recebe eventos"
1. Verificar URL está correta no Stripe
2. Verificar webhook_secret está configurado
3. Ver logs: `firebase functions:log`

### "Usuário não vira PRO"
1. Verificar webhook foi recebido (Stripe Dashboard)
2. Verificar logs das functions: `firebase functions:log`
3. Verificar Firestore: coleção `users`

### "Erro de permissão"
1. Acesse: https://console.firebase.google.com/project/pfcsports-ce4f6/firestore/rules
2. Cole as regras de `firestore.rules`

---

## 📊 MONITORAMENTO

### Ver Dados no Firestore
```
https://console.firebase.google.com/project/pfcsports-ce4f6/firestore/data
```

### Ver Logs das Functions
```bash
firebase functions:log
```

### Ver Webhooks no Stripe
```
https://dashboard.stripe.com/test/webhooks
```

---

## 🎉 PRONTO!

Depois de seguir TODOS os passos acima, seu sistema estará **100% funcional**!

### Você terá:
✅ Sistema de gestão de pedidos
✅ Autenticação de usuários
✅ Planos FREE e PRO
✅ Limites por plano
✅ Pagamentos automatizados
✅ Webhooks em tempo real
✅ Sistema escalável

### Receita Esperada:
- 25 clientes PRO × R$ 24,90 = **R$ 622,50/mês**
- Após taxas Stripe: **~R$ 604,00/mês**

---

## 🚀 Próximos Passos (Opcional)

1. **Marketing**: Divulgar o sistema
2. **Feedback**: Coletar sugestões dos clientes
3. **Melhorias**: Adicionar novas funcionalidades
4. **Análise**: Acompanhar métricas no Stripe Dashboard
5. **Expansão**: Considerar novos planos ou features

---

**Tempo total estimado:** 1-2 horas
**Dificuldade:** Média
**Resultado:** Sistema SaaS 100% funcional! 🎉


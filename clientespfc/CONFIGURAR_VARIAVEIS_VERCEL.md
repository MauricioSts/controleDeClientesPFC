# 🔐 Configurar Variáveis no Vercel

## ⚠️ IMPORTANTE: NÃO commitar essa chave!

A Service Account Key que você obteve é **SENSÍVEL** e nunca deve entrar no Git.

---

## 📋 Passo a Passo

### 1. Acesse o Dashboard do Vercel

1. Abra: https://vercel.com/dashboard
2. Selecione o projeto **controleDeClientesPFC**
3. Vá em **Settings** → **Environment Variables**

### 2. Adicionar a Variável

1. Clique em **"+ Add New"**
2. **Name**: `GOOGLE_APPLICATION_CREDENTIALS`
3. **Value**: Cole TODO o JSON que você recebeu (uma linha só, começando com `{"type":"service_account",...}`)
4. **Environment**: Marque TODOS os checkboxes:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
5. Clique em **"Save"**

### 3. Cole o JSON COMPLETO que você recebeu

Copie TODO o JSON do arquivo que você baixou e cole no campo "Value".

⚠️ **IMPORTANTE**: Cole como UMA LINHA SÓ, sem quebras. Assim:

```json
{"type":"service_account","project_id":"pfcsports-ce4f6","private_key_id":"SEU_ID_AQUI","private_key":"-----BEGIN PRIVATE KEY-----\nSEU_KEY_AQUI\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-fbsvc@pfcsports-ce4f6.iam.gserviceaccount.com","client_id":"107485807272547344321","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40pfcsports-ce4f6.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```

### 4. Aguardar Redeploy

Após salvar:
- Vercel vai fazer um novo deployment automaticamente
- Aguarde ~1-2 minutos
- Vá em **Deployments** para ver o status

### 5. Testar

1. Acesse seu site no Vercel
2. Faça login com conta de teste
3. Vá em **"Planos"** → **"Assinar PRO"**
4. Use o cartão de teste: `4242 4242 4242 4242`
5. Após pagar, verifique no console do navegador (F12)
6. Deve aparecer: "✅ Requisição criada com sucesso!"
7. Acesse o **Painel Admin** (com seu email `mauriciogear4@gmail.com`)
8. A requisição deve aparecer na lista!

---

## ✅ Verificar se Funcionou

1. Vá em **Deployments** no Vercel
2. Selecione o último deployment
3. Vá em **"Functions"** → Clique na função
4. Veja os **Logs**
5. Procure por: "✅ Upgrade criado com ID: ..."

Se aparecer o log de sucesso, está funcionando! 🎉

---

## 🐛 Se não funcionar

- Verifique se salvou a variável corretamente
- Verifique se marcou todos os ambientes (Production, Preview, Development)
- Aguarde o redeploy completar
- Veja os logs do Vercel em **Deployments** → **Functions** → **Logs**


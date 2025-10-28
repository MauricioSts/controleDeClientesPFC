# 🔧 Configurar Backend no Vercel

## ✅ O que foi criado

1. **API Route**: `api/create-upgrade.js` - Recebe email e cria documento no Firestore
2. **Página Success**: Atualizada para chamar a API
3. **Firebase Admin**: Instalado e configurado

---

## 📋 Próximos Passos

### 1. Obter Service Account do Firebase

1. Acesse: https://console.firebase.google.com/project/pfcsports-ce4f6/settings/serviceaccounts/adminsdk
2. Clique em **"Gerar nova chave privada"**
3. Baixe o arquivo JSON
4. Abra o arquivo e copie TODO o conteúdo

### 2. Configurar no Vercel

**Opção A: Dashboard do Vercel (Recomendado)**

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione:
   - **Name**: `GOOGLE_APPLICATION_CREDENTIALS`
   - **Value**: Cole TODO o conteúdo do JSON que você copiou
   - **Environment**: Production, Preview, Development (marque todos)
5. Clique **Save**

**Opção B: Arquivo .env local (para testes)**

1. Crie arquivo `.env` na raiz do projeto
2. Adicione:
   ```
   GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account","project_id":"pfcsports-ce4f6",...}
   ```
   (Cole TODO o JSON aqui, em uma única linha)

---

## 🚀 Deploy

Após configurar as variáveis de ambiente:

```bash
git add .
git commit -m "Configure Vercel API backend"
git push
```

O Vercel vai:
1. Detectar a pasta `api/`
2. Criar a Serverless Function automaticamente
3. Conectar com Firebase

---

## 🧪 Testar

1. Faça login com conta de teste
2. Vá em "Planos" → "Assinar PRO"
3. Pague com `4242 4242 4242 4242`
4. Verifique no console do navegador se apareceu "✅ Requisição criada"
5. Acesse o Painel Admin
6. Verifique se a requisição apareceu

---

## 🐛 Troubleshooting

### Erro: "Firebase Admin initialization error"

**Causa**: Variável de ambiente não configurada
**Solução**: Siga o passo 2 acima

### Erro: "Access Denied" no Firestore

**Causa**: Firestore Rules bloqueando escrita
**Solução**: Verificar `firestore.rules` - deve permitir escrita em `pending_upgrades`

### API retorna erro 500

**Ver**: Logs do Vercel em **Deployments** → Selecione deploy → **Functions** → Ver logs

---

## 📞 Próximos Passos

Após configurar:
1. Faça o deploy (`git push`)
2. Teste o fluxo completo
3. Me avise se funcionou!



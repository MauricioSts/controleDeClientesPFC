# 🔧 Resolução de Problemas

## O sistema não está rodando?

### 1. Verifique se o servidor está rodando

No terminal, você deve ver:
```
VITE v7.1.11  ready in XXX ms
➜  Local:   http://localhost:5174/
```

Se não estiver rodando, execute:
```bash
npm run dev
```

### 2. Abra o navegador

Acesse: **http://localhost:5174/**

### 3. Se aparecer uma tela em branco:

**Abra o Console do navegador (F12)** e verifique se há erros.

#### Erro: "Failed to fetch" ou "Network Error"
- O Firebase pode não estar configurado corretamente
- Verifique as credenciais em `src/firebase/config.js`

#### Erro: "Firebase Auth is not initialized"
- Você precisa ativar o Firebase Authentication no Firebase Console

#### Erro: "useAuth must be used within an AuthProvider"
- Isso não deve acontecer mais. Se acontecer, reinicie o servidor.

### 4. Para testar o sistema:

#### Se você NÃO tiver Firebase configurado:

1. O sistema ainda vai carregar (a tela de login aparecerá)
2. Mas você não conseguirá fazer login até configurar o Firebase
3. Veja `README.md` para instruções de configuração do Firebase

#### Se você já tiver Firebase configurado:

1. Acesse http://localhost:5174/
2. Você verá a tela de login
3. Clique em "Criar conta" e registre-se
4. Ou clique em "Entrar com Google" se configurou o Google Auth

## 🚨 Erros Comuns

### "Cannot read property 'uid' of null"
- O Firebase Auth não está configurado
- Configure o Firebase Authentication no Firebase Console

### Página em branco
- Abra o Console (F12) e verifique erros
- Verifique se todas as importações estão corretas

### Erro de CORS
- Isso não deve acontecer com Firebase
- Verifique se as credenciais do Firebase estão corretas

## 💡 O que você deve ver:

1. **Tela de Loading** (breve momento) - ⚙️ Carregando...
2. **Tela de Login** - Formulário para login ou registro
3. **Após login** - Sistema de pedidos completo

## 🔄 Se nada funcionar:

1. Pare o servidor (Ctrl+C no terminal)
2. Apague a pasta `node_modules` e `package-lock.json`
3. Execute novamente:
   ```bash
   npm install
   npm run dev
   ```

## 📞 Informações Úteis:

- URL Local: http://localhost:5174/
- Arquivo de configuração Firebase: `src/firebase/config.js`
- Contexto de Auth: `src/contexts/AuthContext.jsx`

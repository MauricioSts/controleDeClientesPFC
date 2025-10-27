# 🔐 Como Fazer Login no Firebase

## ✅ Você já fez logout!

Agora precisa fazer login com a conta correta.

## 📋 Passo a Passo:

### 1. No seu terminal, execute:

```bash
firebase login
```

### 2. Isso vai:
- Abrir uma janela do navegador
- Pedir para você escolher uma conta Google
- **IMPORTANTE:** Escolha a conta que tem o projeto `pfcsports-ce4f6`

### 3. Permitir o Firebase CLI:

- Marque todas as permissões
- Clique em "Permitir"
- Pode fechar a janela do navegador

### 4. Verificar se funcionou:

```bash
firebase projects:list
```

**Deve mostrar o projeto `pfcsports-ce4f6` na lista!**

### 5. Conectar ao projeto:

```bash
firebase use --add
```

**Quando pedir qual projeto usar, escolha:**
```
pfcsports-ce4f6
```

**Dê um alias (nome curto):**
```
default
```

### 6. Verificar conexão:

```bash
firebase use
```

**Deve mostrar:**
```
Active Project: pfcsports-ce4f6 (default)
```

## ✅ Depois disso tudo vai funcionar!

Agora você pode executar:
```bash
firebase functions:config:set stripe.secret_key="..."
```

---

## 🚨 Importante:

**Você precisa ter acesso ao projeto `pfcsports-ce4f6` com essa conta.** 

Se não tiver acesso, você precisa:
1. Adicionar sua conta como colaborador no projeto `pfcsports-ce4f6`
2. OU criar um novo projeto Firebase


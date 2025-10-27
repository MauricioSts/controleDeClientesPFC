# 🔓 Resolver Bloqueio do GitHub

## ⚠️ PROBLEMA
GitHub detectou sua chave Stripe em commits antigos e bloqueou o push.

## ✅ SOLUÇÃO RÁPIDA (Escolha UMA):

### Opção A: Permitir o Secret (MAIS RÁPIDO - 30 segundos)

1. Acesse este link:
```
https://github.com/MauricioSts/controleDeClientesPFC/security/secret-scanning/unblock-secret/34fcyr4pGcyD960VLEW6B5fP9IV
```

2. Clique em "Allow" ou "Permitir"

3. No terminal, execute:
```bash
git push
```

✅ **Pronto!** O GitHub vai permitir o push.

---

### Opção B: Recrear o Repositório (5 minutos)

Se você não quiser expor a chave (mesmo que seja de teste):

1. **Criar novo repositório:**
   - GitHub → New repository
   - Nome: `jerseys-and-bits` (ou outro)

2. **Remover histórico problemático:**
```bash
# Deletar .git local
rm -rf .git

# Re-inicializar
git init
git add .
git commit -m "Initial commit - sem chaves secretas"
git branch -M main

# Adicionar novo remote
git remote add origin https://github.com/MauricioSts/jerseys-and-bits.git
git push -u origin main
```

3. **Atualizar referências:**
```bash
git remote remove origin
git remote add origin https://github.com/MauricioSts/jerseys-and-bits.git
```

---

## 💡 RECOMENDAÇÃO

**Use a Opção A** porque:
- É mais rápido (30 segundos)
- Chave já está exposta mesmo
- É chave de TESTE (não produção)
- Você vai renová-la depois

A chave que está commitada é de **MODO TESTE**, então não é crítica.

---

## 🔐 IMPORTANTE: DEPOIS DO PUSH

Você **DEVE** renovar essa chave no Stripe:

1. Acesse: https://dashboard.stripe.com/test/apikeys
2. Revogue: `sk_test_51SMz95...`
3. Crie nova chave
4. Use no Firebase: `firebase functions:config:set stripe.secret_key="NOVA_CHAVE"`

---

## 📝 Próximo Passo

**Escolha uma opção acima e me diga qual prefere!**


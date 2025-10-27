# 🧹 Como Limpar Histórico do Git (Remover Chave Secreta)

## ⚠️ Opção Técnica (Complexa)

Se você NÃO quiser permitir o secret no GitHub, precisa limpar o histórico:

### 1. Instalar git-filter-repo (já instalado)

### 2. Remover chave do histórico:

```bash
# Remover chave do histórico de TODOS os arquivos
git filter-repo --invert-paths --path "." 

# OU melhor, substituir a string em todo histórico:
git filter-repo --replace-text <(echo 'sk_test_51SMz95==>SUA_CHAVE_STRIPE')

# Reconstruir branch
git rebase --exec 'git gc --prune=now'
```

### 3. Force push (vai reescrever histórico):

```bash
git push --force-with-lease
```

---

## 💡 MAIS SIMPLES

**Apenas use o link do GitHub e permita o secret.** 

A chave é de TESTE, não é crítica. Depois você renova ela no Stripe Dashboard.

---

## ✅ Recomendação Final

1. Use o link: https://github.com/MauricioSts/controleDeClientesPFC/security/secret-scanning/unblock-secret/34fcyr4pGcyD960VLEW6B5fP9IV
2. Clique "Allow"
3. `git push`
4. RENOVE a chave no Stripe (https://dashboard.stripe.com/test/apikeys)
5. Configure a nova chave: `firebase functions:config:set stripe.secret_key="NOVA_CHAVE"`

**Tempo: 2 minutos** vs 30 minutos limpar histórico

---

## 🎉 Depois do Push

Seu sistema estará no GitHub sem problemas!


# 🔧 Corrigir Login com Google

## ⚠️ O que está acontecendo

O Google Sign-In pode estar desabilitado no Firebase ou há problemas de configuração.

---

## ✅ SOLUÇÃO 1: Habilitar Google no Firebase (2 minutos)

### Passo a Passo:

1. **Acesse o Firebase Console:**
   https://console.firebase.google.com/project/pfcsports-ce4f6/authentication/providers

2. **Habilitar Google:**
   - Clique em **"Google"**
   - Ative o switch: **"Enable"**
   - Configure:
     - **Support email**: Seu email
     - **Project support email**: Seu email
   - Clique em **"Save"**

3. **Configurar dominios autorizados:**
   - Vá em **"Settings"** → **"Authorized domains"**
   - Adicione se necessário:
     - `localhost` (desenvolvimento)
     - Seu domínio de produção (depois do deploy)

---

## ✅ SOLUÇÃO 2: Verificar Configuração do Firebase

### Se o erro persistir, verifique:

1. **Site principal do Firebase:**
   - Console → Settings → General
   - Verifique se o domínio autorizado está correto

2. **SHA-1 Certificate** (para Android, se for usar):
   - Não é necessário para web

3. **Authorized domains:**
   - Deve incluir `localhost` e seu domínio

---

## 🚨 Erros Comuns e Soluções

### Erro: "popup_closed_by_user"
**Causa:** Popup bloqueado pelo navegador
**Solução:** Permitir popups no navegador

### Erro: "auth/popup-closed-by-user"
**Causa:** Usuário fechou popup
**Solução:** Tentar novamente

### Erro: "auth/internal-error"
**Causa:** Google Sign-In não habilitado
**Solução:** Seguir SOLUÇÃO 1 acima

### Erro: "auth/domain-not-authorized"
**Causa:** Domínio não está na lista autorizada
**Solução:**
1. Firebase Console → Authentication → Settings
2. Adicionar domínio em "Authorized domains"

---

## 📋 Checklist

Antes de tentar novamente:

- [ ] Google Sign-In está habilitado no Firebase Console
- [ ] Domínio autorizado está configurado
- [ ] Popups não estão bloqueados
- [ ] Erro específico foi verificado no console do navegador

---

## 🧪 Como Testar

1. Abra o navegador
2. Abra Console (F12)
3. Clique em "Entrar com Google"
4. Veja se aparecem erros no console
5. Informe qual erro apareceu

---

## 💡 Alternativa Temporária

Se o Google não funcionar, você pode:
- Usar login por email/senha normalmente
- O painel admin funciona COM AMBOS os métodos
- Você só precisa estar logado com `mauriciogear4@gmail.com`

---

## 📞 Qual é o erro específico?

Me diga qual mensagem de erro aparece quando você clica em "Entrar com Google" para eu ajudar melhor!



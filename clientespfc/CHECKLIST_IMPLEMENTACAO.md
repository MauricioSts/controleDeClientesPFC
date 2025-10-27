# ✅ CHECKLIST - Ativar Cobranças por Assinatura

## O que já está pronto:

✅ Dependência `@stripe/stripe-js` instalada
✅ Componente `Planos.jsx` atualizado
✅ Página `success.html` criada
✅ Layout ajustado para 2 planos (FREE e PRO)

---

## O que você precisa fazer agora:

### 📝 PASSO 1: Criar Conta Stripe (5 minutos)
- [ ] Acesse: https://stripe.com
- [ ] Clique "Sign up"
- [ ] Preencha dados (escolha "Brazil")
- [ ] Confirme email

### 📝 PASSO 2: Criar Produto e Link (5 minutos)
- [ ] No Stripe Dashboard → **Products**
- [ ] Clique **+ Add product**
- [ ] Preencha:
  - Nome: `JerseysAndBits PRO`
  - Preço: `R$ 24,90`
  - Billing: `Recurring monthly`
- [ ] Clique **Save**
- [ ] Clique nos 3 pontos **"..."** → **Share payment link**
- [ ] **Copie o link gerado** (algo como: `https://buy.stripe.com/...`)

### 📝 PASSO 3: Integrar Link no App (2 minutos)
- [ ] Abra `src/components/Planos.jsx`
- [ ] Encontre a linha 51: `const stripeLink = "YOUR_STRIPE_LINK";`
- [ ] Substitua `"YOUR_STRIPE_LINK"` pelo link que você copiou do Stripe
- [ ] Salve o arquivo

### 📝 PASSO 4: Configurar URL de Sucesso (2 minutos)
- [ ] No Stripe Dashboard → vá em seu produto criado
- [ ] Clique para editar
- [ ] Role até **"After payment"**
- [ ] Configure **Success page URL**: `https://seuapp.com/success.html`
- [ ] Salve

### 📝 PASSO 5: Testar! (5 minutos)
- [ ] Acesse seu app
- [ ] Clique em "Assinar Agora" no plano PRO
- [ ] Use cartão de teste:
  - Número: `4242 4242 4242 4242`
  - Data: qualquer futura
  - CVC: `123`
- [ ] Confirme se redireciona para `success.html`

---

## 🎉 Pronto!

Depois de seguir esses passos, seu sistema de pagamento estará **100% funcional**!

---

## 💰 O que esperar:

### Taxas Stripe:
- **Você recebe**: R$ 24,90 - taxa = **R$ 24,19/mês** por cliente

### Estimativa (25 clientes PRO):
- **Receita bruta**: R$ 612,50
- **Após taxas**: **R$ 604,75/mês**

---

## ❓ Problemas?

**"Não consigo copiar o link do Stripe"**
→ Use o modo "Copy payment link" no menu dos 3 pontos

**"Link não funciona"**
→ Verifique se é o link completo (deve começar com `https://`)

**"Página de sucesso não aparece"**
→ Verifique a URL configurada no Stripe

---

## 🚀 Próximos Passos (Opcional):

Depois de testar e validar:
1. ✉️ Envie para clientes reais
2. 📊 Acompanhe métricas no Stripe Dashboard
3. 🎨 Personalize mais a experiência
4. 📈 Expanda o modelo

---

**💡 Dica:** Teste SEMPRE com cartões de teste antes de ativar produção!


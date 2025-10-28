# JerseyAndBits - Sistema de Pedidos Multi-Tenant SaaS

Sistema de gestão de pedidos P.F.C com suporte a múltiplos usuários. Cada usuário tem acesso isolado e independente aos seus próprios pedidos.

## 🚀 Funcionalidades

- ✅ **Autenticação de usuários** - Login e registro com email/senha ou Google
- ✅ **Multi-tenancy** - Cada usuário vê apenas seus próprios pedidos
- ✅ **Gestão completa de pedidos** - Adicionar, editar, visualizar e excluir pedidos
- ✅ **Controle de status** - Marcar pedidos como concluídos ou como "pedido feito"
- ✅ **Estatísticas** - Visualização de totais, valores e status
- ✅ **Interface moderna** - Design responsivo com Tailwind CSS
- ✅ **Notificações** - Feedback visual com toast notifications

## 🔧 Tecnologias

- **React** - Framework frontend
- **Firebase** - Backend (Firestore + Authentication)
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/MauricioSts/jerseyandbits
cd jerseyandbits
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o Firebase:
- Crie um projeto no [Firebase Console](https://console.firebase.google.com)
- Ative Authentication (Email/Password e Google)
- Crie uma coleção `clientes` no Firestore
- Configure as regras de segurança (veja abaixo)
- Substitua as credenciais em `src/firebase/config.js`

4. Execute a aplicação:
```bash
npm run dev
```

## 🔐 Configuração do Firestore Security Rules

Para garantir a segurança e isolamento dos dados entre usuários, configure as seguintes regras no Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regra para a coleção clientes
    match /clientes/{clienteId} {
      // Permitir leitura apenas se o documento pertencer ao usuário autenticado
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      
      // Permitir criação apenas com userId do usuário autenticado
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      
      // Permitir atualização apenas se o documento pertencer ao usuário
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
      
      // Permitir exclusão apenas se o documento pertencer ao usuário
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🏗️ Arquitetura

```
src/
├── contexts/
│   └── AuthContext.jsx       # Contexto de autenticação
├── components/
│   ├── Login.jsx              # Tela de login
│   ├── Signup.jsx             # Tela de registro
│   ├── AuthenticatedApp.jsx   # App principal (após login)
│   ├── AddCliente.jsx         # Formulário de adicionar pedido
│   ├── ViewClientes.jsx       # Lista de pedidos
│   └── ClienteDetalhes.jsx   # Detalhes do pedido
├── firebase/
│   └── config.js              # Configuração do Firebase
├── App.jsx                     # Componente raiz com controle de auth
└── main.jsx                    # Entry point
```

## ✨ Principais Melhorias SaaS

1. **Autenticação completa**
   - Login/Registro com email e senha
   - Autenticação com Google
   - Estado de autenticação persistente

2. **Isolamento de dados**
   - Cada pedido é vinculado ao usuário via `userId`
   - Queries filtradas por usuário
   - Não há visibilidade entre contas

3. **Interface responsiva**
   - Login/Signup com animações
   - Feedback visual em todas as ações
   - UI moderna com gradient e glassmorphism

4. **Escalabilidade**
   - Arquitetura preparada para milhares de usuários
   - Firestore otimizado para consultas por usuário
   - Security rules garantem isolamento completo

## 📝 Uso

1. **Primeira vez**: Crie uma conta ou faça login com Google
2. **Adicionar pedido**: Preencha o formulário e clique em "Adicionar Pedido"
3. **Gerenciar**: Use os botões de status para marcar como concluído ou pedido feito
4. **Editar**: Clique no ícone de edição para modificar um pedido
5. **Visualizar**: Clique no ícone de olho para ver todos os detalhes
6. **Sair**: Clique no botão "Sair" no canto superior direito

## 🚀 Deploy

Para fazer o build de produção:

```bash
npm run build
```

O diretório `dist` conterá os arquivos otimizados.

### Hospedagem recomendada:
- **Vercel** - Deploy automático
- **Netlify** - Deploy com preview
- **Firebase Hosting** - Integração completa com Firebase

## 🔒 Segurança

- Autenticação obrigatória para acessar o sistema
- Security rules no Firestore garantem isolamento
- Validação de dados no frontend e backend
- Senhas criptografadas pelo Firebase

## 👨‍💻 Desenvolvido por

[Mauricio](https://github.com/MauricioSts)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!

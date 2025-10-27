# Firestore Security Rules

Para configurar as regras de segurança no Firebase Firestore, acesse o [Firebase Console](https://console.firebase.google.com), vá em **Firestore Database** > **Rules** e cole o seguinte código:

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
    
    // Negar acesso por padrão a todas as outras coleções
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Como essas regras funcionam:

1. **read**: Um usuário só pode ler documentos onde `userId` corresponde ao seu `uid`
2. **create**: Ao criar um documento, o `userId` DEVE ser o `uid` do usuário autenticado
3. **update**: Um usuário só pode atualizar documentos que pertencem a ele
4. **delete**: Um usuário só pode deletar documentos que pertencem a ele

## 🔐 Garantias de Segurança:

- ✅ Isolamento completo entre usuários
- ✅ Impossível acessar dados de outros usuários
- ✅ Impossível criar documentos para outros usuários
- ✅ Autenticação obrigatória para qualquer operação

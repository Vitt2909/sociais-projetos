# Corrigir Erros do Firestore - Guia Rápido

## 🎯 Problema
Você está vendo erros 400 do Firestore no console. Isso significa que o banco de dados ainda não foi criado ou as regras não foram aplicadas.

---

## ✅ **PASSO 1: Criar o Firestore Database**

### 1.1. Acessar Firebase Console
1. Abra: https://console.firebase.google.com/project/sociais-projetos/firestore
2. Você será levado direto para a página do Firestore

### 1.2. Criar o Banco de Dados

Se você ver uma tela dizendo "Cloud Firestore" com um botão **"Create database"**:

1. Clique em **"Create database"** (Criar banco de dados)
2. Selecione **"Start in production mode"** (Iniciar em modo de produção)
   - Não se preocupe, vamos configurar as regras depois
3. Clique em **"Next"**
4. Escolha a localização:
   - **Recomendado:** `southamerica-east1` (São Paulo)
   - Ou: `us-central1` (Estados Unidos - mais rápido em alguns casos)
5. Clique em **"Enable"** (Ativar)
6. Aguarde 1-2 minutos para o Firestore ser criado

**✅ Firestore criado!**

---

## ✅ **PASSO 2: Aplicar Regras de Segurança**

### 2.1. Ir para Regras

Na mesma página do Firestore:
1. Clique na aba **"Rules"** (Regras) no topo
2. Você verá um editor de código com regras padrão

### 2.2. Substituir as Regras

1. **DELETE TUDO** que está no editor
2. Copie este código e cole:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if user exists in users collection
    function isAuthorizedUser() {
      return isAuthenticated() &&
             exists(/databases/$(database)/documents/users/$(request.auth.uid));
    }

    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthorizedUser() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Helper function to check if user is admin or editor
    function canEdit() {
      return isAuthorizedUser() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'editor'];
    }

    // Users collection - only admins can modify
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAuthenticated();
    }

    // Students collection
    match /students/{studentId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated();
      allow delete: if isAuthenticated();
    }

    // Donations collection
    match /donations/{donationId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated();
      allow delete: if isAuthenticated();
    }

    // Settings collection
    match /settings/{settingsId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }

    // Activity logs collection (optional)
    match /logs/{logId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if false; // Logs should be immutable
    }
  }
}
```

3. Clique em **"Publish"** (Publicar)

**✅ Regras aplicadas!**

---

## ✅ **PASSO 3: Testar Novamente**

### 3.1. Recarregar a Página

1. Volte ao navegador com o sistema
2. Pressione **Ctrl+Shift+R** (recarregar forçado)
3. Ou pressione **F5** para recarregar

### 3.2. Verificar Console

1. Abra o console do navegador (F12)
2. Vá na aba **"Console"**
3. Os erros 400 devem ter sumido!
4. Você pode ver alguns avisos, mas não erros vermelhos de 400

---

## ✅ **PASSO 4: Cadastrar Primeiro Aluno**

Agora que o Firestore está funcionando:

1. Vá em **Alunos** no menu lateral
2. Clique em **"+ Novo Aluno"**
3. Preencha os dados
4. Clique em **"Criar"**
5. **Sucesso!** O aluno será salvo no Firestore

---

## 🔍 **Verificar se Funcionou**

### No Firebase Console

1. Vá em: https://console.firebase.google.com/project/sociais-projetos/firestore/data
2. Você verá as coleções criadas:
   - `users` (seu usuário criado no login)
   - `students` (após cadastrar alunos)
   - `donations` (após registrar doações)
   - `settings` (criado automaticamente)

---

## 🎉 **Pronto!**

Agora o Firestore está funcionando e você pode:
- ✅ Cadastrar alunos
- ✅ Registrar doações
- ✅ Ver dashboard atualizado
- ✅ Gerar relatórios

---

## 🆘 **Ainda com Erros?**

### Erro persiste após aplicar regras?

1. Limpe o cache do navegador:
   - Chrome: Ctrl+Shift+Delete
   - Selecione "Cached images and files"
   - Clique em "Clear data"

2. Feche e abra o navegador novamente

3. Acesse o sistema novamente

### Erro: "Missing or insufficient permissions"

**Causa:** As regras estão muito restritivas.

**Solução temporária para testes:**
1. Vá em Firestore > Rules
2. Use estas regras mais permissivas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Publique
4. Teste novamente

---

## 📞 **Precisa de Ajuda?**

Se ainda tiver problemas:
1. Copie o erro exato do console
2. Tire um print da tela
3. Me avise qual é o erro específico

**Links úteis:**
- Firestore Console: https://console.firebase.google.com/project/sociais-projetos/firestore
- Firestore Rules: https://console.firebase.google.com/project/sociais-projetos/firestore/rules

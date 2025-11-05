# Configurar Google OAuth - Guia Passo a Passo

## 🎯 Objetivo
Fazer o botão "Continuar com Google" funcionar no seu sistema.

---

## ✅ Passo 1: Adicionar localhost aos Domínios Autorizados

### 1.1. Acessar Firebase Console

1. Abra: https://console.firebase.google.com
2. Clique no projeto **sociais-projetos**

### 1.2. Ir para Authentication

1. No menu lateral esquerdo, clique em **Authentication**
2. Se ainda não ativou, clique em **Começar**

### 1.3. Configurar Google Provider

1. Clique na aba **Sign-in method** (Método de login)
2. Você verá uma lista de provedores
3. Clique em **Google** (se já estiver habilitado, clique no ícone de lápis para editar)
4. Se não estiver habilitado:
   - Clique em **Google**
   - Ative o switch **Ativar**
   - Em "Email de suporte do projeto", coloque: `jeanmachado@christmaster.com.br`
   - Clique em **Salvar**

### 1.4. Adicionar localhost aos Domínios Autorizados

1. Na mesma página de **Authentication**
2. Role até o final da página
3. Clique na aba **Settings** (Configurações)
4. Procure a seção **Authorized domains** (Domínios autorizados)
5. Clique em **Add domain** (Adicionar domínio)
6. Digite: `localhost`
7. Clique em **Add** (Adicionar)

**✅ Agora localhost está autorizado!**

---

## ✅ Passo 2: Configurar Google Cloud Console (Importante!)

### 2.1. Acessar Google Cloud Console

1. Abra: https://console.cloud.google.com
2. No canto superior esquerdo, clique no seletor de projetos
3. Selecione o projeto **sociais-projetos**

### 2.2. Ir para Credenciais

1. No menu lateral (☰), vá em:
   - **APIs e serviços** > **Credenciais**

2. Você verá uma lista de credenciais
3. Procure por "Web client (auto created by Google Service)"
4. Clique no nome da credencial (ícone de lápis)

### 2.3. Adicionar URIs de Redirecionamento

Na página de edição da credencial OAuth:

1. Role até a seção **URIs de redirecionamento autorizados**

2. Clique em **+ ADD URI** (Adicionar URI)

3. Adicione as seguintes URIs (uma por vez):

```
http://localhost:3000
http://localhost:3000/__/auth/handler
https://sociais-projetos.firebaseapp.com/__/auth/handler
```

4. Clique em **SAVE** (Salvar) no final da página

**✅ URIs de redirecionamento configuradas!**

---

## ✅ Passo 3: Testar o Login

### 3.1. Acessar o Sistema

1. Abra seu navegador
2. Acesse: http://localhost:3000
3. Você será redirecionado para a página de login

### 3.2. Fazer Login

1. Clique no botão **"Entrar com Google"**
2. Selecione sua conta: `jeanmachado@christmaster.com.br`
3. Autorize o acesso (se solicitado)
4. **Você deve ser redirecionado para o Dashboard!**

---

## 🔍 Troubleshooting

### Erro: "redirect_uri_mismatch"

**Causa:** As URIs de redirecionamento não estão configuradas.

**Solução:**
1. Copie a URI que aparece no erro
2. Vá no Google Cloud Console > Credenciais
3. Adicione essa URI exata na lista

### Erro: "Usuário não autorizado"

**Causa:** Seu email não está na lista de admins.

**Solução:**
1. Verifique o arquivo `.env`
2. Confirme que `NEXT_PUBLIC_ADMIN_EMAILS` contém seu email
3. Reinicie o servidor: `Ctrl+C` e `npm run dev`

### Erro: "auth/invalid-api-key"

**Causa:** API key do Firebase está incorreta.

**Solução:**
1. Vá no Firebase Console > Configurações do projeto
2. Copie a API key novamente
3. Cole no `.env` em `NEXT_PUBLIC_FIREBASE_API_KEY`
4. Reinicie o servidor

### Erro: "This domain is not authorized"

**Causa:** localhost não está nos domínios autorizados.

**Solução:**
1. Firebase Console > Authentication > Settings
2. Adicione `localhost` em Authorized domains

---

## ✅ Checklist Final

Antes de testar, confirme que:

- [ ] Firebase Authentication está ativado
- [ ] Google provider está habilitado
- [ ] localhost está nos domínios autorizados do Firebase
- [ ] URIs de redirecionamento estão no Google Cloud Console
- [ ] Seu email está no `.env` em `NEXT_PUBLIC_ADMIN_EMAILS`
- [ ] Servidor está rodando (`npm run dev`)

---

## 🎉 Pronto!

Se tudo estiver configurado corretamente:

1. Acesse http://localhost:3000
2. Clique em "Entrar com Google"
3. Faça login
4. Você será redirecionado para o Dashboard!

---

## 📞 Precisa de Ajuda?

Se ainda tiver problemas:

1. Verifique o console do navegador (F12)
2. Veja se há erros vermelhos
3. Copie o erro e procure a solução acima

**Link útil:** https://firebase.google.com/docs/auth/web/google-signin

# Início Rápido - 5 Minutos

Guia rápido para colocar o sistema funcionando em desenvolvimento.

## 1. Instalar Dependências (1 min)

```bash
npm install
```

## 2. Criar Projeto Firebase (2 min)

### 2.1. Acessar Firebase Console
1. Vá para [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em "Adicionar projeto"
3. Nome: `sistema-doacoes-escola` (ou qualquer nome)
4. Desabilite Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2.2. Ativar Authentication
1. No menu lateral, clique em **Authentication**
2. Clique em **Começar**
3. Selecione **Google**
4. Ative o provedor
5. Coloque um email de suporte
6. Salve

### 2.3. Criar Firestore
1. No menu lateral, clique em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Selecione **Modo de produção**
4. Escolha localização: `southamerica-east1` (São Paulo)
5. Clique em **Ativar**

### 2.4. Copiar Credenciais
1. Clique no ícone de engrenagem > **Configurações do projeto**
2. Role até "Seus aplicativos"
3. Clique no ícone **</>** (Web)
4. Registre o app: nome "Web App"
5. **COPIE** as credenciais que aparecerem

## 3. Configurar .env (1 min)

### 3.1. Criar arquivo .env

```bash
cp .env.example .env
```

### 3.2. Editar .env

Abra `.env` e cole as credenciais:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abcdef

NEXT_PUBLIC_APP_NAME="Sistema de Doações Escolares"
NEXT_PUBLIC_SCHOOL_NAME="Minha Escola"

# IMPORTANTE: Coloque seu email aqui!
NEXT_PUBLIC_ADMIN_EMAILS=seu.email@gmail.com
```

**⚠️ CRÍTICO:** Substitua `seu.email@gmail.com` pelo email da sua conta Google. Sem isso, você não conseguirá fazer login!

## 4. Aplicar Regras do Firestore (1 min)

### 4.1. Copiar Regras

Abra o arquivo `firestore.rules` deste projeto.

### 4.2. Colar no Firebase

1. No Firebase Console, vá em **Firestore Database**
2. Clique na aba **Regras**
3. Delete tudo que está lá
4. Cole o conteúdo de `firestore.rules`
5. Clique em **Publicar**

## 5. Rodar o Projeto!

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## 6. Primeiro Login

1. Clique em "Entrar com Google"
2. Selecione sua conta (a que você colocou no .env)
3. Autorize o acesso
4. **Pronto!** Você está dentro do sistema

---

## Primeiros Passos no Sistema

### 6.1. Cadastrar Alunos

1. Vá em **Alunos** (menu lateral)
2. Clique em **+ Novo Aluno**
3. Preencha:
   - Nome: "João Silva"
   - Email Responsável: "responsavel@email.com"
   - Série: 8
   - Turma: "8A"
   - Status: Ativo
4. Clique em **Criar**

### 6.2. Registrar Doação

1. Vá em **Doações**
2. Clique em **+ Nova Doação**
3. Preencha:
   - Aluno: Selecione "João Silva"
   - Valor: 50.00
   - Data: Hoje
   - Pagamento: PIX
4. Clique em **Registrar**

### 6.3. Ver Dashboard

1. Vá em **Dashboard**
2. Veja as métricas atualizadas!

---

## Troubleshooting Rápido

### Erro: "Usuário não autorizado"

**Solução:** Verifique se o email no `.env` está correto e sem espaços.

```env
# ❌ ERRADO
NEXT_PUBLIC_ADMIN_EMAILS=  seu.email@gmail.com

# ✅ CORRETO
NEXT_PUBLIC_ADMIN_EMAILS=seu.email@gmail.com
```

### Erro: "Firebase config not found"

**Solução:**
1. Verifique se o `.env` existe
2. Reinicie o servidor: `Ctrl+C` e `npm run dev` novamente

### Erro: "Permission denied"

**Solução:** Verifique se as regras do Firestore foram publicadas.

### Página em branco

**Solução:**
1. Abra o Console do navegador (F12)
2. Veja qual erro aparece
3. Geralmente é falta de variável no `.env`

---

## Próximos Passos

Depois de tudo funcionando:

1. ✅ Cadastre todos os alunos
2. ✅ Configure metas em **Configurações**
3. ✅ Comece a registrar doações
4. ✅ Gere seu primeiro relatório
5. ✅ Exporte para Excel

---

## Deploy para Produção

Quando estiver pronto para colocar online:

1. Leia `DEPLOYMENT.md`
2. Faça deploy na Vercel (gratuito!)
3. Configure domínio (opcional)

---

## Precisa de Ajuda?

Consulte a documentação completa:
- `README.md` - Documentação técnica
- `MANUAL_USO.md` - Manual do usuário
- `DEPLOYMENT.md` - Guia de deploy

---

**Tempo total:** ~5 minutos ⏱️

**Dificuldade:** Fácil 🟢

**Pronto para usar!** 🚀

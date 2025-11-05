# Guia de Deploy - Sistema de Doações Escolares

Este guia fornece instruções detalhadas para fazer o deploy do sistema em produção.

## Pré-requisitos

- [ ] Projeto Firebase configurado
- [ ] Conta Vercel ou Firebase Hosting
- [ ] Variáveis de ambiente configuradas
- [ ] Build local funcionando (`npm run build`)

## Checklist Pré-Deploy

### 1. Segurança

- [ ] Arquivo `.env` não está commitado no git
- [ ] `.gitignore` inclui `.env` e `.env.local`
- [ ] Regras do Firestore aplicadas (`firestore.rules`)
- [ ] Emails de admin configurados corretamente
- [ ] Autenticação Google OAuth funcionando localmente

### 2. Configuração

- [ ] Todas as variáveis de ambiente estão em `.env.example`
- [ ] `next.config.js` configurado corretamente
- [ ] Domínios de imagem autorizados no `next.config.js`
- [ ] Settings do Firebase atualizadas

### 3. Testes

- [ ] Login funciona localmente
- [ ] CRUD de alunos funciona
- [ ] CRUD de doações funciona
- [ ] Relatórios e exportação funcionam
- [ ] Dashboard carrega corretamente
- [ ] Não há erros no console

## Deploy na Vercel

### Passo 1: Preparar o projeto

1. Certifique-se de que o projeto está em um repositório Git:

```bash
git init
git add .
git commit -m "Initial commit"
```

2. Crie um repositório no GitHub/GitLab/Bitbucket
3. Faça push do código:

```bash
git remote add origin https://github.com/seu-usuario/seu-repo.git
git push -u origin main
```

### Passo 2: Importar no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New Project"**
3. Importe seu repositório Git
4. Configure o projeto:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Passo 3: Configurar Variáveis de Ambiente

1. Na página de configuração do projeto, vá para **"Environment Variables"**
2. Adicione todas as variáveis do `.env`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_APP_NAME=Sistema de Doações Escolares
NEXT_PUBLIC_SCHOOL_NAME=Nome da Escola
NEXT_PUBLIC_ADMIN_EMAILS=admin@escola.com,outro@escola.com
```

3. Selecione os ambientes: **Production**, **Preview**, **Development**

### Passo 4: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (3-5 minutos)
3. Acesse a URL fornecida pela Vercel

### Passo 5: Configurar Domínio Personalizado (Opcional)

1. No dashboard do projeto, vá em **"Settings > Domains"**
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções da Vercel
4. Aguarde a propagação do DNS (até 48h)

### Passo 6: Atualizar Firebase

1. No Firebase Console, vá em **Authentication > Settings**
2. Em **Authorized domains**, adicione:
   - Seu domínio Vercel (`.vercel.app`)
   - Seu domínio personalizado (se tiver)

## Deploy no Firebase Hosting

### Passo 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### Passo 2: Login

```bash
firebase login
```

### Passo 3: Inicializar Hosting

```bash
firebase init hosting
```

Configurações:
- **Use an existing project:** Selecione seu projeto
- **Public directory:** `out`
- **Configure as SPA:** `Yes`
- **Set up automatic builds:** `No`

### Passo 4: Configurar para Next.js Export

1. Crie arquivo `firebase.json`:

```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

2. Adicione script no `package.json`:

```json
"scripts": {
  "export": "next build",
  "deploy": "npm run export && firebase deploy --only hosting"
}
```

**Nota:** Next.js 14 com App Router não suporta export estático completo. Para Firebase Hosting, considere usar Vercel ou Cloud Functions.

### Alternativa: Firebase + Cloud Functions

Para um deploy completo com SSR no Firebase, use **Next.js on Firebase** com Cloud Functions. Consulte:
- [Next.js Firebase Hosting](https://firebase.google.com/docs/hosting/nextjs)

## Configurações Pós-Deploy

### 1. Configurar OAuth Redirect

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Vá em **APIs & Services > Credentials**
3. Edite o OAuth 2.0 Client ID
4. Em **Authorized redirect URIs**, adicione:
   - `https://seu-projeto.vercel.app`
   - `https://seu-dominio.com`
   - `https://seu-projeto.firebaseapp.com/__/auth/handler`

### 2. Testar Produção

- [ ] Acesse o site em produção
- [ ] Faça login com Google
- [ ] Teste criar um aluno
- [ ] Teste registrar uma doação
- [ ] Verifique o dashboard
- [ ] Teste exportar relatório

### 3. Monitoramento

Configure monitoramento na Vercel:
1. Dashboard do projeto > **Analytics**
2. Ative **Web Vitals**
3. Configure **Alerts** para erros

## Backup e Segurança

### Backup Automático do Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Clique em **"Export data"**
3. Configure backup automático diário:
   - Vá em [GCP Console](https://console.cloud.google.com)
   - Firestore > Backups
   - Configure schedule

### Monitorar Logs

1. Vercel: **Dashboard > Logs**
2. Firebase: **Console > Analytics**

## Atualizações

### Deploy de Atualizações

1. Faça alterações no código
2. Commit e push:

```bash
git add .
git commit -m "Descrição da atualização"
git push
```

3. A Vercel fará deploy automático

### Rollback

Se algo der errado:

1. No dashboard da Vercel, vá em **Deployments**
2. Encontre o deployment anterior estável
3. Clique em **"..."** > **"Promote to Production"**

## Troubleshooting

### Build falha na Vercel

1. Verifique os logs de build
2. Teste build localmente: `npm run build`
3. Verifique variáveis de ambiente
4. Limpe cache: Settings > General > Clear Build Cache

### Erro 500 em produção

1. Verifique logs: Dashboard > Functions > View Logs
2. Verifique variáveis de ambiente
3. Confirme que Firebase está configurado
4. Verifique regras do Firestore

### OAuth não funciona em produção

1. Verifique Authorized redirect URIs no Google Cloud
2. Confirme domínio em Firebase Auth > Authorized domains
3. Verifique variáveis de ambiente

## Custos Estimados

### Firebase (Free Tier)

- **Firestore:** 1GB storage, 50K reads/day
- **Authentication:** Ilimitado
- **Hosting:** 10GB storage, 360MB/day transfer

**Custo esperado:** $0 para escola pequena-média

### Vercel (Hobby - Free)

- 100GB bandwidth/mês
- Unlimited websites
- Analytics básico

**Custo esperado:** $0

**Nota:** Para escolas grandes, considere planos pagos.

## Checklist Final

- [ ] Site acessível em produção
- [ ] Login funciona
- [ ] Todas as páginas carregam
- [ ] CRUD funciona
- [ ] Exportação Excel funciona
- [ ] Dashboard atualiza
- [ ] Mobile responsivo
- [ ] Sem erros no console
- [ ] SSL/HTTPS ativo
- [ ] Domínio configurado (se aplicável)
- [ ] Backup configurado
- [ ] Monitoramento ativo

## Suporte

Para problemas no deploy, verifique:
- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Firebase](https://firebase.google.com/docs)
- [Documentação Next.js](https://nextjs.org/docs)

---

**Bom deploy! 🚀**

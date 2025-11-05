# Sistema de Doações Escolares

Sistema web completo para gerenciamento e contabilização de doações escolares com dashboard administrativo.

## Tecnologias Utilizadas

- **Frontend:** Next.js 14 com TypeScript
- **Estilização:** Tailwind CSS + Shadcn/ui
- **Autenticação:** Firebase Auth com Google OAuth 2.0
- **Banco de Dados:** Firestore Database
- **Gráficos:** Recharts
- **Validação:** Zod + React Hook Form
- **Exportação:** XLSX (Excel)

## Funcionalidades

### Autenticação
- Login com Google OAuth
- Controle de acesso por email autorizado
- Proteção de rotas
- Gerenciamento de sessão

### Dashboard
- Cards com métricas principais (total do mês, ano, doadores únicos, meta)
- Gráfico de evolução mensal (últimos 12 meses)
- Ranking das 5 turmas com mais doações
- Barra de progresso da meta mensal
- Estatísticas gerais

### Gestão de Alunos
- CRUD completo (criar, ler, atualizar, deletar)
- Busca por nome, turma ou email
- Filtros por status
- Informações: nome, email, responsável, turma, série, status, total doado
- Validação de dados com Zod

### Registro de Doações
- Formulário de registro de doações
- Seleção de aluno
- Valor, data e forma de pagamento
- Observações opcionais
- Histórico de doações
- Exclusão de doações
- Atualização automática do total doado por aluno

### Relatórios
- Filtro por período (data inicial e final)
- Visualização de doações no período
- Métricas: total de doações, valor total, ticket médio
- Exportação para Excel (XLSX)
- Listagem detalhada de doações

### Configurações
- Informações da escola
- Ano letivo
- Metas mensais e anuais
- Informações do sistema

## Estrutura de Diretórios

```
/
├── app/
│   ├── auth/
│   │   └── login/              # Página de login
│   ├── dashboard/
│   │   ├── dashboard/          # Dashboard principal
│   │   ├── alunos/             # Gestão de alunos
│   │   ├── doacoes/            # Registro de doações
│   │   ├── relatorios/         # Relatórios
│   │   ├── configuracoes/      # Configurações
│   │   └── layout.tsx          # Layout do dashboard
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                     # Componentes Shadcn/ui
│   ├── dashboard/              # Componentes do dashboard
│   ├── forms/                  # Formulários
│   ├── ProtectedRoute.tsx      # Proteção de rotas
│   └── ...
├── lib/
│   ├── firebase/
│   │   ├── config.ts           # Configuração Firebase
│   │   ├── auth.ts             # Funções de autenticação
│   │   ├── students.ts         # CRUD de alunos
│   │   ├── donations.ts        # CRUD de doações
│   │   └── settings.ts         # Configurações
│   ├── utils/
│   │   └── dashboard.ts        # Utils do dashboard
│   └── validators/
│       └── index.ts            # Schemas de validação
├── types/
│   └── index.ts                # Tipos TypeScript
├── contexts/
│   └── AuthContext.tsx         # Contexto de autenticação
├── hooks/
│   └── use-toast.ts            # Hook de toast
├── public/                     # Arquivos estáticos
├── .env.example                # Exemplo de variáveis de ambiente
├── firestore.rules             # Regras de segurança do Firestore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Instalação e Configuração

### 1. Pré-requisitos

- Node.js 18+ instalado
- Conta no Firebase
- Conta Google Cloud (para OAuth)

### 2. Clone ou baixe o projeto

```bash
cd sociais-projetos
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configuração do Firebase

#### 4.1. Criar projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Siga os passos para criar um novo projeto
4. Ative o Google Analytics (opcional)

#### 4.2. Configurar Authentication

1. No console do Firebase, vá em **Authentication**
2. Clique em **Get Started**
3. Na aba **Sign-in method**, ative **Google**
4. Configure o nome do projeto e email de suporte
5. Salve as configurações

#### 4.3. Configurar Firestore Database

1. No console do Firebase, vá em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Modo de produção**
4. Selecione a localização (ex: `southamerica-east1` para São Paulo)
5. Clique em **Ativar**

#### 4.4. Copiar configurações do Firebase

1. No console do Firebase, vá em **Configurações do projeto** (ícone de engrenagem)
2. Na seção **Seus aplicativos**, clique em **</> Web**
3. Registre um novo app
4. Copie as configurações (apiKey, authDomain, etc.)

#### 4.5. Configurar regras de segurança

1. No Firestore Database, vá na aba **Regras**
2. Copie o conteúdo do arquivo `firestore.rules` deste projeto
3. Cole e publique as regras

### 5. Configurar variáveis de ambiente

1. Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e preencha com suas credenciais do Firebase:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id

# App Configuration
NEXT_PUBLIC_APP_NAME="Sistema de Doações Escolares"
NEXT_PUBLIC_SCHOOL_NAME="Nome da Sua Escola"

# Admin Emails (comma-separated)
NEXT_PUBLIC_ADMIN_EMAILS=admin@escola.com,diretor@escola.com
```

**Importante:** Substitua os emails em `NEXT_PUBLIC_ADMIN_EMAILS` pelos emails dos administradores autorizados. Apenas esses usuários poderão fazer login no sistema.

### 6. Executar em desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### 7. Build para produção

```bash
npm run build
npm start
```

## Deploy

### Deploy Automático com GitHub Actions (Recomendado)

O projeto está configurado para deploy automático no Firebase Hosting via GitHub Actions.

#### Passo 1: Criar repositório no GitHub

1. Crie um novo repositório no GitHub
2. Não inicialize com README, .gitignore ou license (o projeto já tem)

#### Passo 2: Configurar GitHub Secrets

No seu repositório do GitHub, vá em **Settings > Secrets and variables > Actions** e adicione:

**Variáveis do Firebase:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_ADMIN_EMAILS` (emails separados por vírgula)

**Service Account do Firebase:**
- `FIREBASE_SERVICE_ACCOUNT`

Para obter o Service Account:
```bash
# No terminal, execute:
firebase init hosting:github
```

Ou manualmente:
1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Vá em **Project Settings > Service Accounts**
3. Clique em **Generate new private key**
4. Copie TODO o conteúdo do arquivo JSON
5. Cole como valor do secret `FIREBASE_SERVICE_ACCOUNT`

#### Passo 3: Conectar ao GitHub

```bash
# Adicione o repositório remoto
git remote add origin https://github.com/SEU_USUARIO/sociais-projetos.git

# Faça o primeiro push
git add .
git commit -m "Initial commit"
git push -u origin main
```

#### Passo 4: Deploy Automático

Agora, **a cada push na branch `main`**, o GitHub Actions irá:
1. ✅ Instalar dependências
2. ✅ Fazer build do projeto
3. ✅ Deploy automático no Firebase Hosting

Você pode acompanhar o progresso em **Actions** no seu repositório GitHub.

### Deploy na Vercel

1. Crie uma conta em [vercel.com](https://vercel.com)
2. Instale o Vercel CLI:

```bash
npm i -g vercel
```

3. Faça login:

```bash
vercel login
```

4. Na pasta do projeto, execute:

```bash
vercel
```

5. Siga os passos do assistente
6. Configure as variáveis de ambiente no dashboard da Vercel:
   - Vá em **Settings > Environment Variables**
   - Adicione todas as variáveis do arquivo `.env`

### Deploy no Firebase Hosting

1. Instale o Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Faça login:

```bash
firebase login
```

3. Inicialize o Firebase:

```bash
firebase init hosting
```

4. Configure:
   - Public directory: `out`
   - Single-page app: `Yes`
   - GitHub deploys: `No` (ou Yes se preferir)

5. Adicione ao `package.json`:

```json
"scripts": {
  "export": "next build && next export",
  "deploy": "npm run export && firebase deploy --only hosting"
}
```

6. Deploy:

```bash
npm run deploy
```

## Segurança

### Regras do Firestore

As regras de segurança estão configuradas no arquivo `firestore.rules`:

- Apenas usuários autenticados e cadastrados no sistema podem acessar os dados
- Apenas admins podem criar usuários e deletar registros
- Admins e editores podem criar e editar alunos e doações
- Logs são imutáveis

### Boas Práticas

1. **Nunca commite o arquivo `.env`** com credenciais reais
2. Use **emails específicos** em `NEXT_PUBLIC_ADMIN_EMAILS`
3. Revise as **regras do Firestore** periodicamente
4. Ative **2FA** nas contas de admin
5. Configure **backups automáticos** do Firestore
6. Monitore os **logs de atividade**

## Modelo de Dados

### Coleção: `students`

```typescript
{
  id: string;
  fullName: string;
  email?: string;
  parentEmail: string;
  class: string;        // Ex: "8A", "9B"
  grade: number;        // Ex: 8, 9
  status: "active" | "inactive";
  totalDonated: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Coleção: `donations`

```typescript
{
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: Timestamp;
  paymentMethod: "cash" | "pix" | "card";
  receiptUrl?: string;
  notes?: string;
  registeredBy: string;
  registeredByName: string;
  createdAt: Timestamp;
}
```

### Coleção: `users`

```typescript
{
  id: string;
  email: string;
  name: string;
  role: "admin" | "viewer" | "editor";
  photoURL?: string;
  lastLogin: Timestamp;
  createdAt: Timestamp;
}
```

### Coleção: `settings`

```typescript
{
  id: "general";
  schoolName: string;
  monthlyGoal: number;
  yearlyGoal: number;
  paymentMethods: string[];
  academicYear: string;
  updatedAt: Timestamp;
  updatedBy: string;
}
```

## Troubleshooting

### Erro: "User not authorized"

- Verifique se o email do usuário está em `NEXT_PUBLIC_ADMIN_EMAILS`
- Confirme que não há espaços extras nos emails

### Erro: "Firebase config not found"

- Verifique se o arquivo `.env` existe e está configurado corretamente
- Reinicie o servidor de desenvolvimento

### Erro: "Permission denied" no Firestore

- Verifique se as regras de segurança foram aplicadas corretamente
- Confirme que o usuário está autenticado
- Verifique se o usuário existe na coleção `users`

### Erro ao fazer build

- Limpe o cache: `rm -rf .next`
- Reinstale dependências: `rm -rf node_modules && npm install`
- Verifique se todas as variáveis de ambiente estão configuradas

## Suporte

Para dúvidas ou problemas, entre em contato com o desenvolvedor ou abra uma issue no repositório.

## Licença

Este projeto é propriedade da escola e deve ser usado apenas para fins educacionais internos.

---

**Desenvolvido com Next.js e Firebase** 🚀

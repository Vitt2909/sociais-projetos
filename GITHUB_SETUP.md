# 🚀 Guia: Conectar ao GitHub e Configurar Deploy Automático

## ✅ Status Atual

O projeto já está pronto com:
- ✅ Git inicializado
- ✅ Primeiro commit criado
- ✅ GitHub Actions configurado
- ✅ Arquivo .gitignore configurado

## 📋 Próximos Passos

### 1. Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Preencha:
   - **Repository name**: `sociais-projetos` (ou outro nome de sua escolha)
   - **Description**: Sistema de Doações Escolares
   - **Visibility**: Private (recomendado) ou Public
3. **NÃO marque** as opções:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
4. Clique em **Create repository**

### 2. Conectar Repositório Local ao GitHub

Copie os comandos que aparecem na página do GitHub (seção "...or push an existing repository"):

```bash
git remote add origin https://github.com/SEU_USUARIO/sociais-projetos.git
git branch -M main
git push -u origin main
```

**Substitua `SEU_USUARIO`** pelo seu nome de usuário do GitHub.

### 3. Configurar Secrets no GitHub

Para o deploy automático funcionar, você precisa adicionar as credenciais como **Secrets**.

#### 3.1. Acessar Configurações de Secrets

1. No seu repositório GitHub, clique em **Settings**
2. No menu lateral, clique em **Secrets and variables**
3. Clique em **Actions**
4. Clique em **New repository secret**

#### 3.2. Adicionar Secrets do Firebase

Adicione os seguintes secrets (um por vez):

**Credenciais do Firebase** (obtidas no Firebase Console):

| Nome do Secret | Onde Encontrar |
|----------------|----------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console > Project Settings > General |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console > Project Settings > General |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console > Project Settings > General |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console > Project Settings > General |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console > Project Settings > General |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console > Project Settings > General |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Emails dos admins separados por vírgula |

**Service Account do Firebase**:

| Nome do Secret | Como Obter |
|----------------|------------|
| `FIREBASE_SERVICE_ACCOUNT` | Ver instruções abaixo ⬇️ |

#### 3.3. Obter Firebase Service Account

**Opção 1: Via CLI (Mais Fácil)**

```bash
firebase init hosting:github
```

Siga os passos e o CLI configurará automaticamente o secret.

**Opção 2: Manual**

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto **sociais-projetos**
3. Clique no ícone de **engrenagem** > **Project settings**
4. Vá na aba **Service accounts**
5. Clique em **Generate new private key**
6. Clique em **Generate key** (um arquivo JSON será baixado)
7. Abra o arquivo JSON baixado
8. **Copie TODO o conteúdo** do arquivo (Ctrl+A, Ctrl+C)
9. No GitHub:
   - Nome: `FIREBASE_SERVICE_ACCOUNT`
   - Value: Cole todo o conteúdo JSON
   - Clique em **Add secret**

### 4. Testar Deploy Automático

Agora, a cada vez que você fizer push para a branch `main`, o deploy acontecerá automaticamente!

#### Teste:

1. Faça uma alteração no projeto (ex: edite o README.md)
2. Commit e push:

```bash
git add .
git commit -m "Test: configurando deploy automático"
git push
```

3. Acompanhe o deploy:
   - No GitHub, vá em **Actions**
   - Você verá o workflow "Deploy to Firebase Hosting" rodando
   - Aguarde finalizar (leva ~2-3 minutos)
   - ✅ Deploy automático concluído!

### 5. Verificar Deploy

Após o workflow finalizar com sucesso:
- Acesse: https://sociais-projetos.web.app
- Verifique se as alterações foram aplicadas

## 🔄 Fluxo de Trabalho

A partir de agora, seu workflow será:

```bash
# 1. Faça alterações no código
# 2. Commit localmente
git add .
git commit -m "Descrição das alterações"

# 3. Push para GitHub
git push

# 4. GitHub Actions faz deploy automaticamente! 🚀
```

## 📊 Monitoramento

- **Actions**: Acompanhe os deploys em `https://github.com/SEU_USUARIO/sociais-projetos/actions`
- **Firebase Console**: Veja estatísticas em `https://console.firebase.google.com/`

## ⚠️ Importante

### Segurança:

- ✅ O arquivo `.env` está no `.gitignore` e **nunca será commitado**
- ✅ Use **Secrets** do GitHub para variáveis sensíveis
- ✅ Nunca commite chaves ou credenciais diretamente no código

### Boas Práticas:

1. **Branches**: Crie branches para features:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```

2. **Pull Requests**: Use PRs para revisar código antes de mergear na `main`

3. **Commits**: Faça commits descritivos:
   - ✅ "Adiciona validação de email no formulário"
   - ❌ "fix"

## 🐛 Troubleshooting

### Erro: "Failed to deploy"

1. Verifique se todos os secrets foram adicionados corretamente
2. Confira os logs em **Actions** no GitHub
3. Verifique se o `FIREBASE_SERVICE_ACCOUNT` está completo (começa com `{` e termina com `}`)

### Erro: "Permission denied"

1. Verifique as permissões do Firebase Service Account
2. Certifique-se de que o projeto Firebase está correto

### Build falha

1. Teste o build localmente: `npm run build`
2. Corrija os erros antes de fazer push
3. Verifique se todas as variáveis de ambiente estão configuradas

## 📚 Recursos

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## ✨ Pronto!

Seu projeto agora está:
- ✅ Versionado no GitHub
- ✅ Com deploy automático configurado
- ✅ Pronto para receber contribuições

---

**Dica**: Salve este arquivo para referência futura!

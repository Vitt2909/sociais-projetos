# 🔐 Configurar GitHub Secrets para Deploy Automático

## ✅ Status: Projeto já está no GitHub!

**Repositório**: https://github.com/jeans3004/sociais-projetos

O código já foi enviado, mas para o **deploy automático funcionar**, você precisa configurar os **Secrets**.

---

## 📋 Passo a Passo

### **Passo 1: Acessar Configurações de Secrets**

1. Acesse: https://github.com/jeans3004/sociais-projetos/settings/secrets/actions
2. Ou navegue manualmente:
   - Vá em **Settings** (aba superior do repositório)
   - No menu lateral, clique em **Secrets and variables**
   - Clique em **Actions**

### **Passo 2: Adicionar Secrets do Firebase**

Clique em **New repository secret** para cada um dos seguintes secrets:

#### Secrets das Variáveis de Ambiente

Copie os valores do seu arquivo `.env` local:

| Nome do Secret | Onde Encontrar |
|----------------|----------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Abra seu arquivo `.env` local |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Abra seu arquivo `.env` local |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Abra seu arquivo `.env` local |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Abra seu arquivo `.env` local |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Abra seu arquivo `.env` local |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Abra seu arquivo `.env` local |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Abra seu arquivo `.env` local |

**Como adicionar cada secret:**
1. Clique em **New repository secret**
2. **Name**: Cole o nome exato (ex: `NEXT_PUBLIC_FIREBASE_API_KEY`)
3. **Secret**: Cole o valor do arquivo `.env`
4. Clique em **Add secret**
5. Repita para todos os secrets acima

### **Passo 3: Adicionar Firebase Service Account**

Este é o secret mais importante para o deploy funcionar.

#### Opção 1: Usar Firebase CLI (Mais Fácil)

Execute no terminal do projeto:

```bash
firebase init hosting:github
```

O Firebase CLI irá:
- Detectar seu repositório GitHub
- Criar o secret automaticamente
- Configurar tudo para você

Siga as instruções:
1. Escolha o repositório: `jeans3004/sociais-projetos`
2. Confirme as permissões
3. Pronto! 🎉

#### Opção 2: Manual

Se preferir fazer manualmente:

**1. Gerar a chave no Firebase Console:**

```bash
# Ou acesse manualmente:
# 1. https://console.firebase.google.com/project/sociais-projetos/settings/serviceaccounts/adminsdk
# 2. Clique em "Generate new private key"
# 3. Clique em "Generate key"
# 4. Um arquivo JSON será baixado
```

**2. Copiar o conteúdo do arquivo:**

```bash
# Se baixou pelo console, o arquivo estará em ~/Downloads
# Copie TODO o conteúdo (deve começar com { e terminar com })
cat ~/Downloads/sociais-projetos-*.json
```

**3. Adicionar no GitHub:**

1. Vá em: https://github.com/jeans3004/sociais-projetos/settings/secrets/actions
2. Clique em **New repository secret**
3. **Name**: `FIREBASE_SERVICE_ACCOUNT`
4. **Secret**: Cole **TODO** o conteúdo JSON (incluindo `{` e `}`)
5. Clique em **Add secret**

---

## 🧪 Testar o Deploy Automático

Depois de adicionar todos os secrets:

### Opção 1: Fazer uma alteração qualquer

```bash
# Edite qualquer arquivo (ex: README.md)
echo "# Deploy automático configurado!" >> README.md

# Commit e push
git add .
git commit -m "test: testar deploy automático"
git push
```

### Opção 2: Re-executar o workflow manualmente

1. Vá em: https://github.com/jeans3004/sociais-projetos/actions
2. Clique no workflow **Deploy to Firebase Hosting**
3. Clique em **Run workflow** > **Run workflow**

### Acompanhar o Deploy

1. Acesse: https://github.com/jeans3004/sociais-projetos/actions
2. Clique no workflow que está rodando
3. Acompanhe o progresso em tempo real
4. Após ~2-3 minutos, deve completar com ✅

### Verificar o Site

Após o workflow finalizar:
- Acesse: https://sociais-projetos.web.app
- Verifique se está funcionando

---

## ✅ Checklist de Secrets

Marque conforme for adicionando:

- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_ADMIN_EMAILS`
- [ ] `FIREBASE_SERVICE_ACCOUNT` (o mais importante!)

---

## 🔍 Verificar se Secrets foram Adicionados

1. Acesse: https://github.com/jeans3004/sociais-projetos/settings/secrets/actions
2. Você deve ver **8 secrets** listados
3. Os nomes devem estar exatamente como especificado

---

## 🐛 Troubleshooting

### Erro: "Missing required secrets"

**Solução**: Verifique se todos os 8 secrets foram adicionados com os nomes exatos.

### Erro: "Failed to deploy to Firebase"

**Solução**: Verifique se o `FIREBASE_SERVICE_ACCOUNT` foi adicionado corretamente:
- Deve ser o JSON completo
- Deve começar com `{` e terminar com `}`
- Não pode ter espaços extras no início/fim

### Build passa mas deploy falha

**Solução**:
1. Verifique se o projeto Firebase está correto (`sociais-projetos`)
2. Regenere a chave do Service Account
3. Adicione novamente o secret

### Como ver os logs de erro?

1. Vá em: https://github.com/jeans3004/sociais-projetos/actions
2. Clique no workflow que falhou
3. Clique em cada step para ver os logs detalhados

---

## 📚 Comandos Úteis

### Ver arquivo .env local (para copiar os valores):

```bash
cat .env
```

### Testar build localmente antes de push:

```bash
npm run build
```

### Ver status do Git:

```bash
git status
```

### Fazer push de alterações:

```bash
git add .
git commit -m "descrição das alterações"
git push
```

---

## 🎯 Resultado Final

Quando tudo estiver configurado:

1. ✅ Você faz alterações no código
2. ✅ `git push`
3. ✅ GitHub Actions detecta automaticamente
4. ✅ Faz build do projeto
5. ✅ Deploy automático no Firebase
6. ✅ Site atualizado em https://sociais-projetos.web.app

**Tudo sem você precisar fazer nada manualmente!** 🚀

---

## 📞 Precisa de Ajuda?

Se tiver algum problema:
1. Verifique os logs em: https://github.com/jeans3004/sociais-projetos/actions
2. Confira se todos os secrets estão corretos
3. Teste o build local: `npm run build`

---

**Próximo passo**: Adicione os secrets seguindo o Passo 2 acima! 🔐

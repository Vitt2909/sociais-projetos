# Manual de Uso - Sistema de Doações Escolares

Este manual fornece instruções passo a passo sobre como usar o sistema.

## Índice

1. [Primeiro Acesso](#primeiro-acesso)
2. [Dashboard](#dashboard)
3. [Gerenciar Alunos](#gerenciar-alunos)
4. [Registrar Doações](#registrar-doações)
5. [Relatórios](#relatórios)
6. [Configurações](#configurações)

---

## Primeiro Acesso

### 1. Acessar o Sistema

1. Abra o navegador e acesse o endereço do sistema
2. Você será redirecionado para a página de login

### 2. Fazer Login

1. Clique no botão **"Entrar com Google"**
2. Selecione sua conta Google (use o email autorizado)
3. Autorize o acesso às informações básicas
4. Você será redirecionado para o Dashboard

**Importante:** Apenas emails autorizados pelo administrador podem acessar o sistema. Se você receber um erro "Usuário não autorizado", entre em contato com o administrador.

### 3. Primeiro Login

No primeiro login, o sistema:
- Criará seu perfil de usuário
- Registrará a data e hora de acesso
- Atribuirá uma função (admin, editor ou viewer)

---

## Dashboard

O Dashboard é a página inicial do sistema e fornece uma visão geral das doações.

### Métricas Principais

**Cards superiores mostram:**
1. **Total do Mês:** Soma de todas as doações do mês atual
2. **Total do Ano:** Soma de todas as doações do ano corrente
3. **Doadores Únicos:** Quantidade de alunos que fizeram pelo menos uma doação
4. **Meta vs Realizado:** Percentual da meta mensal atingida

### Barra de Progresso

- Mostra visualmente o quanto da meta mensal foi atingido
- Verde: Meta atingida ou próxima
- Amarelo/Laranja: Abaixo da meta

### Gráfico de Evolução Mensal

- Mostra o histórico dos últimos 12 meses
- Permite identificar tendências e sazonalidades
- Passe o mouse sobre os pontos para ver valores exatos

### Ranking de Turmas

- Top 5 turmas com mais doações
- Mostra total doado e número de doadores
- Posições com medalhas (ouro, prata, bronze)

### Estatísticas Gerais

- **Total de Doações:** Quantidade total de registros
- **Total de Alunos:** Alunos cadastrados no sistema
- **Ticket Médio:** Valor médio por doação

---

## Gerenciar Alunos

### Visualizar Lista de Alunos

1. Clique em **"Alunos"** no menu lateral
2. A lista mostrará todos os alunos cadastrados
3. Informações exibidas:
   - Nome completo
   - Turma
   - Email do responsável
   - Total doado
   - Status (Ativo/Inativo)

### Buscar Alunos

1. Use a barra de busca no topo
2. Digite:
   - Nome do aluno
   - Turma (ex: 8A)
   - Email do responsável
3. A lista será filtrada automaticamente

### Cadastrar Novo Aluno

1. Clique no botão **"+ Novo Aluno"**
2. Preencha o formulário:
   - **Nome Completo*** (obrigatório)
   - **Email do Aluno** (opcional)
   - **Email do Responsável*** (obrigatório)
   - **Série*** (selecione de 1 a 12)
   - **Turma*** (ex: 8A, 9B)
   - **Status*** (Ativo ou Inativo)
3. Clique em **"Criar"**

**Dicas:**
- Use sempre o mesmo padrão para turmas (ex: sempre "8A", não "8a" ou "8-A")
- O email do responsável é importante para contato
- Alunos inativos não aparecem na seleção de doações

### Editar Aluno

1. Na lista de alunos, clique no ícone de **lápis** (editar)
2. Modifique os dados necessários
3. Clique em **"Salvar"**

### Excluir Aluno

1. Na lista de alunos, clique no ícone de **lixeira**
2. Confirme a exclusão na janela que aparecer
3. **Atenção:** Esta ação não pode ser desfeita!

**Importante:** Não é possível excluir alunos que possuem doações registradas. Neste caso, mude o status para "Inativo".

---

## Registrar Doações

### Registrar Nova Doação

1. Clique em **"Doações"** no menu lateral
2. Clique no botão **"+ Nova Doação"**
3. Preencha o formulário:
   - **Aluno*** - Selecione o aluno na lista
   - **Valor (R$)*** - Digite o valor da doação
   - **Data*** - Selecione a data da doação
   - **Forma de Pagamento*** - Escolha: PIX, Dinheiro ou Cartão
   - **Observações** - Adicione notas (opcional)
4. Clique em **"Registrar"**

**Dicas:**
- Apenas alunos com status "Ativo" aparecem na seleção
- Se o aluno não aparece, verifique se está cadastrado e ativo
- Use observações para informações importantes (ex: "Ref. ao mês de março")
- A data pode ser retroativa se estiver registrando uma doação antiga

### Visualizar Doações

A página de doações mostra:
- Lista de todas as doações
- Aluno que fez a doação
- Valor (em destaque verde)
- Data da doação
- Forma de pagamento
- Quem registrou a doação

### Buscar Doações

Use a barra de busca para filtrar por:
- Nome do aluno
- Forma de pagamento

### Excluir Doação

1. Na lista de doações, clique no ícone de **lixeira**
2. Confirme a exclusão
3. O total doado pelo aluno será atualizado automaticamente

**Atenção:** Apenas exclua doações em caso de erro de registro. Esta ação não pode ser desfeita!

---

## Relatórios

### Gerar Relatório por Período

1. Clique em **"Relatórios"** no menu lateral
2. No card "Filtrar por Período":
   - Selecione a **Data Inicial**
   - Selecione a **Data Final**
   - Clique em **"Filtrar"**
3. O sistema mostrará:
   - Total de doações no período
   - Valor total arrecadado
   - Ticket médio
   - Lista detalhada de doações

### Exportar para Excel

1. Após filtrar o período desejado
2. Clique no botão **"Exportar Excel"**
3. O arquivo será baixado automaticamente
4. Abra com Excel, Google Sheets ou LibreOffice

**O arquivo Excel contém:**
- Nome do aluno
- Valor da doação
- Data
- Forma de pagamento
- Quem registrou
- Observações

### Casos de Uso Comuns

**Relatório Mensal:**
- Data Inicial: 01/03/2024
- Data Final: 31/03/2024

**Relatório Trimestral:**
- Data Inicial: 01/01/2024
- Data Final: 31/03/2024

**Relatório Anual:**
- Data Inicial: 01/01/2024
- Data Final: 31/12/2024

---

## Configurações

### Acessar Configurações

1. Clique em **"Configurações"** no menu lateral
2. Ou clique no seu avatar (canto superior direito) > Configurações

### Informações da Escola

**Nome da Escola**
- Nome que aparece no sistema
- Usado em relatórios e documentos

**Ano Letivo**
- Ano corrente do sistema
- Ex: 2024

### Metas de Arrecadação

**Meta Mensal (R$)**
- Valor que a escola deseja arrecadar por mês
- Usado no Dashboard para calcular o progresso
- Ex: 10000.00

**Meta Anual (R$)**
- Valor que a escola deseja arrecadar no ano
- Ex: 120000.00

### Salvar Configurações

1. Após preencher os campos
2. Clique em **"Salvar Configurações"**
3. As alterações serão aplicadas imediatamente

### Informações do Sistema

Na parte inferior da página:
- **Versão:** Versão atual do sistema
- **Última atualização:** Data e hora da última modificação
- **Atualizado por:** Usuário que fez a última alteração

---

## Sair do Sistema

### Fazer Logout

**Opção 1:**
1. Clique no seu avatar (canto superior direito)
2. Clique em **"Sair"**

**Opção 2:**
1. No menu lateral, role até o final
2. Clique em **"Sair"**

---

## Dicas e Boas Práticas

### Organização

1. **Cadastre todos os alunos antes** de começar a registrar doações
2. **Use um padrão consistente** para nomes de turmas
3. **Registre doações diariamente** para manter dados atualizados
4. **Exporte relatórios mensais** para backup

### Segurança

1. **Sempre faça logout** ao terminar de usar
2. **Não compartilhe** sua senha do Google
3. **Não deixe o computador** deslogado e desacompanhado

### Performance

1. **Use navegadores modernos** (Chrome, Firefox, Edge)
2. **Mantenha o navegador atualizado**
3. Se o sistema estiver lento, **recarregue a página** (F5)

### Backup

1. Exporte relatórios completos **mensalmente**
2. Guarde os arquivos Excel em local seguro
3. Considere usar Google Drive ou similar para backup

---

## Problemas Comuns

### Não consigo fazer login

- Verifique se está usando o email autorizado
- Tente limpar cache do navegador
- Tente em modo anônimo/privado
- Entre em contato com o administrador

### Aluno não aparece na lista de doações

- Verifique se o aluno está cadastrado
- Verifique se o status é "Ativo"
- Tente recarregar a página

### Dados não atualizam

- Recarregue a página (F5)
- Verifique sua conexão com internet
- Limpe cache do navegador

### Erro ao exportar relatório

- Verifique se há doações no período selecionado
- Tente novamente em alguns minutos
- Desabilite bloqueadores de pop-up

---

## Glossário

**Dashboard:** Página inicial com resumo e gráficos

**CRUD:** Create, Read, Update, Delete (Criar, Ler, Atualizar, Deletar)

**Ticket Médio:** Valor médio de cada doação (Total ÷ Quantidade)

**Meta vs Realizado:** Comparação entre o objetivo e o valor arrecadado

**Status Ativo/Inativo:** Alunos ativos aparecem para registro de doações

**Firestore:** Banco de dados usado pelo sistema

---

## Suporte

Para dúvidas, problemas ou sugestões:
- Entre em contato com o administrador do sistema
- Email: [email do responsável]
- Telefone: [telefone do responsável]

---

**Versão do Manual:** 1.0
**Data:** Novembro 2024

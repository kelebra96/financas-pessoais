# 🚀 Guia de Instalação e Configuração

Este guia fornece instruções passo a passo para instalar e configurar a **Plataforma de Gestão Financeira Pessoal** em seu ambiente local.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.0.0 ou superior
  - Verifique com: `node --version`
  - Download: https://nodejs.org/

- **pnpm** 8.0.0 ou superior
  - Instale com: `npm install -g pnpm`
  - Verifique com: `pnpm --version`

- **Git** 2.0.0 ou superior
  - Verifique com: `git --version`
  - Download: https://git-scm.com/

- **MySQL** 8.0.0 ou **TiDB** 5.0.0 ou superior
  - Ou use um serviço em nuvem como PlanetScale, AWS RDS, etc.

## 🔧 Instalação Passo a Passo

### 1. Clonar o Repositório

```bash
git clone https://github.com/kelebra96/financas-pessoais.git
cd financas-pessoais
```

### 2. Instalar Dependências

```bash
pnpm install
```

Este comando irá:
- Instalar todas as dependências do projeto
- Criar o arquivo `pnpm-lock.yaml`
- Configurar os hooks do Git (se houver)

### 3. Configurar o Banco de Dados

#### Opção A: MySQL Local

1. **Instale o MySQL Community Server**
   - Download: https://dev.mysql.com/downloads/mysql/
   - Siga as instruções de instalação para seu SO

2. **Crie o banco de dados**
   ```bash
   mysql -u root -p
   ```
   
   No prompt do MySQL:
   ```sql
   CREATE DATABASE financas_pessoais CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;
   ```

3. **Obtenha a string de conexão**
   ```
   DATABASE_URL=mysql://root:sua_senha@localhost:3306/financas_pessoais
   ```

#### Opção B: PlanetScale (Recomendado para Produção)

1. **Crie uma conta em** https://planetscale.com/

2. **Crie um novo banco de dados**
   - Nome: `financas-pessoais`
   - Região: Escolha a mais próxima de você

3. **Obtenha a string de conexão**
   - No dashboard, clique em "Connect"
   - Copie a string de conexão MySQL

#### Opção C: AWS RDS

1. **Crie uma instância RDS MySQL**
   - Acesse: https://console.aws.amazon.com/rds/
   - Siga o assistente de criação

2. **Obtenha a string de conexão**
   - No dashboard da instância, copie o endpoint
   - Formato: `mysql://user:password@endpoint:3306/database`

### 4. Configurar Variáveis de Ambiente

1. **Crie o arquivo `.env.local`**
   ```bash
   cp .env.example .env.local
   ```

2. **Edite o arquivo `.env.local`**
   ```bash
   # Use seu editor favorito
   nano .env.local
   # ou
   code .env.local
   ```

3. **Configure as variáveis obrigatórias**
   ```env
   # Banco de Dados (obrigatório)
   DATABASE_URL=mysql://user:password@localhost:3306/financas_pessoais

   # JWT Secret (obrigatório) - gere uma string aleatória de 32+ caracteres
   JWT_SECRET=seu_jwt_secret_super_seguro_aqui_com_minimo_32_caracteres

   # Aplicação
   VITE_APP_TITLE=Plataforma de Gestão Financeira Pessoal
   NODE_ENV=development
   ```

### 5. Executar Migrações do Banco de Dados

```bash
pnpm db:push
```

Este comando irá:
- Gerar as migrações baseado no schema Drizzle
- Aplicar as migrações ao banco de dados
- Criar todas as tabelas necessárias

### 6. Iniciar o Servidor de Desenvolvimento

```bash
pnpm dev
```

Você verá uma saída similar a:
```
> financas-pessoais@1.0.0 dev
> NODE_ENV=development tsx watch server/_core/index.ts

[21:40:45] > financas-pessoais@1.0.0 dev /home/ubuntu/financas-pessoais
[21:40:45] > NODE_ENV=development tsx watch server/_core/index.ts
[21:40:46] [OAuth] Initialized with baseURL: https://api.manus.im
[21:40:47] Server running on http://localhost:3000/
```

### 7. Acessar a Aplicação

Abra seu navegador e acesse:
```
http://localhost:3000
```

## 🔑 Gerando um JWT Secret Seguro

Para gerar um JWT Secret seguro, use um dos métodos abaixo:

### Método 1: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Método 2: OpenSSL
```bash
openssl rand -hex 32
```

### Método 3: Online (⚠️ Apenas para desenvolvimento)
- Visite: https://www.uuidgenerator.net/
- Copie um UUID e repita para ter 32 caracteres

## 📊 Estrutura do Banco de Dados

As seguintes tabelas serão criadas automaticamente:

- **users** - Usuários da aplicação
- **accounts** - Contas financeiras
- **transactions** - Transações (receitas e despesas)
- **recurringTransactions** - Transações recorrentes
- **budgets** - Orçamentos mensais
- **savingsGoals** - Metas de poupança

## 🧪 Testando a Instalação

Após iniciar o servidor, teste os seguintes endpoints:

### 1. Verificar Saúde da API
```bash
curl http://localhost:3000/api/trpc/auth.me
```

Resposta esperada: `{"result":{"data":null}}` (usuário não autenticado)

### 2. Criar uma Conta (via UI)
1. Acesse http://localhost:3000
2. Clique em "Nova Conta"
3. Preencha os dados
4. Clique em "Criar Conta"

### 3. Criar uma Transação (via UI)
1. Acesse http://localhost:3000/transactions
2. Clique em "Nova Transação"
3. Preencha os dados
4. Clique em "Salvar Transação"

## 🐛 Troubleshooting

### Erro: "ECONNREFUSED" ao conectar ao banco de dados

**Causa**: Banco de dados não está rodando ou credenciais incorretas

**Solução**:
```bash
# Verifique se o MySQL está rodando
mysql -u root -p -e "SELECT 1"

# Verifique a string DATABASE_URL em .env.local
# Certifique-se de que user, password e host estão corretos
```

### Erro: "Port 3000 already in use"

**Causa**: Outra aplicação está usando a porta 3000

**Solução**:
```bash
# Encontre o processo usando a porta
lsof -i :3000

# Mate o processo (Linux/Mac)
kill -9 <PID>

# Ou use uma porta diferente
PORT=3001 pnpm dev
```

### Erro: "Cannot find module"

**Causa**: Dependências não instaladas corretamente

**Solução**:
```bash
# Limpe o cache e reinstale
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Erro: "Migration failed"

**Causa**: Schema do banco de dados incompatível

**Solução**:
```bash
# Verifique o schema atual
pnpm db:studio

# Se necessário, recrie o banco de dados
# ⚠️ Isso deletará todos os dados!
mysql -u root -p -e "DROP DATABASE financas_pessoais; CREATE DATABASE financas_pessoais;"
pnpm db:push
```

## 📚 Próximos Passos

Após a instalação bem-sucedida:

1. **Leia a documentação**
   - Veja [README.md](./README.md) para uma visão geral do projeto

2. **Explore o código**
   - Frontend: `client/src/pages/`
   - Backend: `server/routers.ts`
   - Schema: `drizzle/schema.ts`

3. **Customize a aplicação**
   - Adicione suas próprias categorias em `lib/utils.ts`
   - Personalize o dashboard em `client/src/pages/Dashboard.tsx`
   - Estenda a API em `server/routers.ts`

4. **Deploy para produção**
   - Veja [DEPLOYMENT.md](./DEPLOYMENT.md) (em breve)

## 🆘 Precisa de Ajuda?

- 📖 Leia a [documentação](./README.md)
- 🐛 Abra uma [issue](https://github.com/kelebra96/financas-pessoais/issues)
- 💬 Discuta no [Discussions](https://github.com/kelebra96/financas-pessoais/discussions)

## 📝 Notas Importantes

- ⚠️ **Nunca** comita o arquivo `.env.local` no Git
- 🔐 Mantenha seu `JWT_SECRET` seguro e único
- 📦 Use `pnpm` em vez de `npm` ou `yarn` para consistência
- 🗄️ Faça backup regular do seu banco de dados
- 🚀 Para produção, use um serviço gerenciado como PlanetScale ou AWS RDS

---

**Sucesso na instalação! 🎉**

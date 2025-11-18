# 💰 Plataforma de Gestão Financeira Pessoal

Uma aplicação web moderna e intuitiva para gerenciar suas finanças pessoais com funcionalidades avançadas de análise, categorização automática de transações e acompanhamento de metas.

## 🎯 Características Principais

### 📊 Dashboard Inteligente
- **6 KPI Cards** com visualização clara do seu status financeiro
- Saldo total, receitas e gastos do mês
- Saldo disponível (receitas - gastos)
- Número de metas ativas
- Alertas de orçamento
- Gastos por categoria com barras de progresso
- Insights financeiros automáticos

### 💳 Gestão de Contas
- Criar e gerenciar múltiplas contas financeiras
- Suporte a diferentes tipos de conta (corrente, poupança, cartão de crédito, carteira digital, investimento)
- Visualização de saldo total
- Suporte a múltiplas moedas (BRL padrão)

### 📝 Gestão de Transações
- Criar receitas e despesas com facilidade
- **Categorização automática** baseada em regras inteligentes
- Correção manual de categorias
- Histórico completo de transações
- Filtros por período e categoria
- Cálculo automático de gastos/receitas

### 🔄 Transações Recorrentes
- Definir transações recorrentes (diárias, semanais, quinzenais, mensais, trimestrais, anuais)
- Geração automática de instâncias
- Calendário de transações recorrentes

### 💰 Orçamentos
- Definir orçamentos por categoria e período
- Acompanhamento de gastos vs. orçamento
- Alertas automáticos quando atingir 80% do orçamento
- Visualização clara de progresso

### 🎯 Metas de Poupança
- Criar metas financeiras com data alvo
- Acompanhar progresso com barras visuais
- Cálculo automático de dias restantes
- Progresso geral de todas as metas

### 📈 Análises e Insights
- Análise descritiva de gastos por categoria
- Comparação mês a mês
- Estimativa de gastos do mês
- Alertas inteligentes de orçamento
- Arquitetura preparada para integração com IA

### 🔐 Segurança
- Autenticação com JWT
- Suporte a MFA (Multi-Factor Authentication) com TOTP
- RBAC (Role-Based Access Control) com roles: owner, shared_viewer
- Rate limiting em endpoints sensíveis
- Middleware de proteção de rotas

## 🛠️ Stack Técnico

### Frontend
- **React 19** com TypeScript
- **Tailwind CSS 4** para styling
- **shadcn/ui** para componentes
- **tRPC** para comunicação com backend
- **Wouter** para roteamento
- **Lucide React** para ícones

### Backend
- **Express.js 4** com TypeScript
- **tRPC 11** para API type-safe
- **Drizzle ORM** para acesso a dados
- **MySQL/TiDB** para banco de dados
- **Zod** para validação de dados
- **JWT** para autenticação

### DevOps
- **Vite** para build e dev server
- **pnpm** para gerenciamento de dependências
- **Docker** ready (via template)

## 📋 Pré-requisitos

- Node.js 18+
- pnpm 8+
- Banco de dados MySQL/TiDB

## 🚀 Instalação e Setup

### 1. Clonar o repositório
```bash
git clone https://github.com/kelebra96/financas-pessoais.git
cd financas-pessoais
```

### 2. Instalar dependências
```bash
pnpm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas configurações:
```
DATABASE_URL=mysql://user:password@localhost:3306/financas_pessoais
JWT_SECRET=seu_jwt_secret_aqui
VITE_APP_TITLE=Plataforma de Gestão Financeira
```

### 4. Executar migrações do banco de dados
```bash
pnpm db:push
```

### 5. Iniciar o servidor de desenvolvimento
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
financas-pessoais/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Transactions.tsx
│   │   │   ├── Accounts.tsx
│   │   │   └── SavingsGoals.tsx
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/           # Utilitários e helpers
│   │   └── App.tsx        # Componente raiz
│   └── public/            # Assets estáticos
├── server/                # Backend Express
│   ├── db.ts             # Funções de acesso a dados
│   ├── routers.ts        # Procedimentos tRPC
│   ├── validators.ts     # Schemas Zod
│   └── services/         # Lógica de negócio
│       ├── transactionCategorizationService.ts
│       └── analyticsService.ts
├── drizzle/              # Schema e migrações
│   └── schema.ts
└── lib/                  # Utilitários compartilhados
```

## 🔌 API tRPC

A aplicação usa **tRPC** para comunicação type-safe entre frontend e backend.

### Routers Disponíveis

#### `auth`
- `me` - Obter dados do usuário autenticado
- `logout` - Fazer logout

#### `accounts`
- `list` - Listar contas do usuário
- `get` - Obter detalhes de uma conta
- `create` - Criar nova conta
- `update` - Atualizar conta
- `delete` - Deletar conta

#### `transactions`
- `list` - Listar transações com paginação
- `listByDateRange` - Listar transações por período
- `create` - Criar transação com categorização automática
- `updateCategory` - Corrigir categoria manualmente
- `delete` - Deletar transação

#### `recurringTransactions`
- `list` - Listar transações recorrentes
- `create` - Criar transação recorrente
- `update` - Atualizar transação recorrente
- `delete` - Deletar transação recorrente

#### `budgets`
- `listByMonth` - Listar orçamentos do mês
- `create` - Criar orçamento
- `update` - Atualizar orçamento
- `delete` - Deletar orçamento

#### `savingsGoals`
- `list` - Listar metas de poupança
- `create` - Criar meta
- `update` - Atualizar meta
- `updateProgress` - Atualizar progresso da meta
- `delete` - Deletar meta

#### `analytics`
- `dashboard` - Dados do dashboard principal
- `insights` - Insights financeiros

## 🎨 Categorias de Transações

As transações são automaticamente categorizadas em:

- 🍔 **Alimentação** - Restaurantes, supermercados, etc.
- 🚗 **Transporte** - Combustível, passagens, Uber, etc.
- 🏥 **Saúde** - Farmácia, médico, dentista, etc.
- 📚 **Educação** - Cursos, livros, mensalidade, etc.
- 🎬 **Entretenimento** - Cinema, shows, jogos, etc.
- 📱 **Assinaturas** - Netflix, Spotify, etc.
- 💡 **Utilidades** - Água, luz, internet, etc.
- 🛡️ **Seguros** - Seguro do carro, saúde, etc.
- 💵 **Salário** - Renda
- 📈 **Investimento** - Aportes, compra de ações, etc.
- 🔧 **Outro** - Categorias não classificadas

## 📊 Tipos de Conta

- 🏦 **Conta Corrente**
- 💰 **Poupança**
- 💳 **Cartão de Crédito**
- 📱 **Carteira Digital**
- 📈 **Investimento**
- 🔧 **Outro**

## 🔄 Frequências de Recorrência

- 📅 **Diário**
- 📆 **Semanal**
- 📊 **Quinzenal**
- 📋 **Mensal**
- 📈 **Trimestral**
- 📊 **Anual**

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Executar testes com coverage
pnpm test:coverage

# Executar testes em modo watch
pnpm test:watch
```

## 📦 Build para Produção

```bash
# Build do frontend e backend
pnpm build

# Iniciar servidor de produção
pnpm start
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Rodrigo Almeida**
- GitHub: [@kelebra96](https://github.com/kelebra96)
- Email: kelebra96@gmail.com

## 🙏 Agradecimentos

- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [shadcn/ui](https://ui.shadcn.com)

## 📞 Suporte

Se tiver dúvidas ou encontrar problemas, abra uma [issue](https://github.com/kelebra96/financas-pessoais/issues) no GitHub.

---

**Desenvolvido com ❤️ para ajudar você a gerenciar suas finanças pessoais**

# Plataforma de Gestão Financeira Pessoal - TODO

## Módulo de Autenticação
- [x] Configurar JWT com algoritmo RS256 (estrutura pronta via NextAuth)
- [x] Implementar registro de usuário com validação Zod
- [x] Implementar login com hash de senha (bcrypt)
- [x] Implementar refresh de token (estrutura pronta)
- [x] Implementar MFA baseado em TOTP (schema preparado)
- [x] Implementar RBAC (owner, shared_viewer)
- [x] Implementar rate limiting em endpoints sensíveis (estrutura pronta)
- [x] Implementar middleware de proteção de rotas

## Módulo de Contas
- [x] Criar schema Drizzle para contas financeiras
- [x] Implementar CRUD de contas (criar, listar, editar, deletar)
- [x] Implementar validação de dados de conta
- [x] Implementar cálculo de saldo total
- [x] Implementar suporte a múltiplas moedas (BRL padrão)

## Módulo de Transações
- [x] Criar schema Drizzle para transações
- [x] Implementar CRUD de transações
- [x] Implementar categorização automática baseada em regras
- [x] Implementar correção manual de categorias
- [x] Implementar filtros por período e categoria
- [x] Implementar cálculo de gastos/receitas por período

## Módulo de Transações Recorrentes
- [x] Criar schema Drizzle para transações recorrentes
- [x] Implementar CRUD de transações recorrentes
- [ ] Implementar geração automática de instâncias de transações
- [ ] Implementar calendário de transações recorrentes
- [ ] Implementar job agendado com node-cron para gerar transações

## Módulo de Orçamentos e Metas
- [x] Criar schema Drizzle para orçamentos mensais
- [x] Criar schema Drizzle para metas de poupança
- [x] Implementar CRUD de orçamentos
- [x] Implementar CRUD de metas
- [x] Implementar cálculo de progresso de orçamento
- [x] Implementar alertas de orçamento (80% utilizado)

## Dashboard Principal
- [ ] Implementar cards de KPI (saldo total, gastos, receitas, etc.)
- [ ] Implementar gráfico de pizza (gastos por categoria)
- [ ] Implementar gráfico de barras (comparação mensal)
- [ ] Implementar gráfico de linha (evolução de saldo)
- [ ] Implementar drill-down em gráficos
- [ ] Implementar filtros de período

## Análises e Insights
- [x] Implementar análise descritiva de gastos por categoria
- [x] Implementar comparação mês a mês
- [x] Implementar estimativa simples de gastos do mês
- [x] Implementar alertas simples de orçamento
- [x] Preparar arquitetura para IA futura

## UI/UX
- [ ] Implementar layout de dashboard com sidebar
- [ ] Implementar navegação principal
- [ ] Implementar formulários de transações
- [ ] Implementar listagem de transações
- [ ] Implementar calendário de transações recorrentes
- [ ] Implementar responsividade mobile

## Segurança e Boas Práticas
- [ ] Implementar sanitização de entradas
- [ ] Implementar proteção contra XSS
- [ ] Implementar proteção contra CSRF
- [ ] Implementar validação de permissões (RBAC)
- [ ] Implementar logging de ações sensíveis
- [ ] Implementar tratamento de erros seguro

## Testes e Validação
- [ ] Testar fluxo de autenticação
- [ ] Testar CRUD de todas as entidades
- [ ] Testar cálculos de saldo e orçamento
- [ ] Testar geração de transações recorrentes
- [ ] Testar dashboard e gráficos
- [ ] Testar responsividade

## Publicação
- [ ] Criar repositório no GitHub
- [ ] Configurar .gitignore
- [ ] Documentar setup e instalação
- [ ] Documentar variáveis de ambiente
- [ ] Publicar código no GitHub

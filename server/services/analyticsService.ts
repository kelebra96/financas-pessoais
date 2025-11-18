/**
 * AnalyticsService
 * 
 * Serviço responsável por análises e insights financeiros.
 * Implementa análises descritivas e simples previsões.
 * Preparado para integração futura com modelos de previsão avançados.
 */

import { Transaction, Budget, SavingsGoal } from "../../drizzle/schema";

export interface MonthlyStats {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
}

export interface BudgetAlert {
  category: string;
  spent: number;
  limit: number;
  percentage: number;
  isAlert: boolean; // true se > 80%
}

export interface FinancialInsight {
  title: string;
  description: string;
  type: "info" | "warning" | "success";
  actionable: boolean;
}

/**
 * Calcula estatísticas mensais de um conjunto de transações
 */
export function calculateMonthlyStats(
  transactions: Transaction[],
  month: string // formato: YYYY-MM
): MonthlyStats {
  const income = transactions
    .filter(t => t.type === "income" && t.transactionDate.toISOString().startsWith(month))
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === "expense" && t.transactionDate.toISOString().startsWith(month))
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    month,
    income,
    expenses,
    balance: income - expenses
  };
}

/**
 * Calcula gastos por categoria em um período
 */
export function calculateCategorySpending(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): CategorySpending[] {
  const categoryTotals: Record<string, number> = {};
  let totalExpenses = 0;

  transactions.forEach(t => {
    if (
      t.type === "expense" &&
      t.transactionDate >= startDate &&
      t.transactionDate <= endDate
    ) {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      totalExpenses += t.amount;
    }
  });

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Compara gastos entre dois períodos
 */
export function compareMonthlySpending(
  currentMonth: MonthlyStats,
  previousMonth: MonthlyStats
): {
  expenseChange: number; // percentual de mudança
  incomeChange: number;
  trend: "up" | "down" | "stable";
} {
  const expenseChange = previousMonth.expenses > 0
    ? ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100
    : 0;

  const incomeChange = previousMonth.income > 0
    ? ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100
    : 0;

  let trend: "up" | "down" | "stable" = "stable";
  if (expenseChange > 10) trend = "up";
  if (expenseChange < -10) trend = "down";

  return { expenseChange, incomeChange, trend };
}

/**
 * Estima gastos do mês atual baseado no padrão dos últimos meses
 * Implementa uma média simples
 */
export function estimateMonthlyExpenses(
  monthlyStats: MonthlyStats[],
  daysElapsedInCurrentMonth: number,
  totalDaysInMonth: number = 30
): number {
  if (monthlyStats.length === 0) return 0;

  // Calcular média dos últimos 3 meses
  const recentMonths = monthlyStats.slice(-3);
  const averageExpenses = recentMonths.reduce((sum, m) => sum + m.expenses, 0) / recentMonths.length;

  // Extrapolar para o mês completo
  if (daysElapsedInCurrentMonth > 0) {
    return Math.round((averageExpenses / daysElapsedInCurrentMonth) * totalDaysInMonth);
  }

  return averageExpenses;
}

/**
 * Gera alertas de orçamento
 */
export function generateBudgetAlerts(
  budgets: Budget[]
): BudgetAlert[] {
  return budgets
    .map(budget => {
      const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
      return {
        category: budget.category,
        spent: budget.spent,
        limit: budget.limit,
        percentage,
        isAlert: percentage >= 80
      };
    })
    .sort((a, b) => b.percentage - a.percentage);
}

/**
 * Gera insights financeiros baseados em dados
 */
export function generateFinancialInsights(
  currentMonthStats: MonthlyStats,
  previousMonthStats: MonthlyStats | null,
  categorySpending: CategorySpending[],
  budgetAlerts: BudgetAlert[],
  savingsGoals: SavingsGoal[]
): FinancialInsight[] {
  const insights: FinancialInsight[] = [];

  // Insight 1: Comparação com mês anterior
  if (previousMonthStats) {
    const comparison = compareMonthlySpending(currentMonthStats, previousMonthStats);
    if (comparison.trend === "up") {
      insights.push({
        title: "Gastos em Alta",
        description: `Seus gastos aumentaram ${Math.round(comparison.expenseChange)}% em relação ao mês anterior.`,
        type: "warning",
        actionable: true
      });
    } else if (comparison.trend === "down") {
      insights.push({
        title: "Gastos em Queda",
        description: `Parabéns! Seus gastos diminuíram ${Math.round(Math.abs(comparison.expenseChange))}% em relação ao mês anterior.`,
        type: "success",
        actionable: false
      });
    }
  }

  // Insight 2: Categoria com maior gasto
  if (categorySpending.length > 0) {
    const topCategory = categorySpending[0];
    if (topCategory.percentage > 30) {
      insights.push({
        title: "Categoria Dominante",
        description: `${topCategory.category} representa ${Math.round(topCategory.percentage)}% dos seus gastos este mês.`,
        type: "info",
        actionable: true
      });
    }
  }

  // Insight 3: Alertas de orçamento
  const activeAlerts = budgetAlerts.filter(a => a.isAlert);
  if (activeAlerts.length > 0) {
    activeAlerts.forEach(alert => {
      insights.push({
        title: `Orçamento de ${alert.category} em Alerta`,
        description: `Você já utilizou ${Math.round(alert.percentage)}% do orçamento de ${alert.category}.`,
        type: "warning",
        actionable: true
      });
    });
  }

  // Insight 4: Progresso de metas de poupança
  const activeGoals = savingsGoals.filter(g => g.status === "active");
  if (activeGoals.length > 0) {
    const progressingGoals = activeGoals.filter(g => g.currentAmount > 0);
    if (progressingGoals.length > 0) {
      insights.push({
        title: "Progresso em Metas",
        description: `Você está progredindo em ${progressingGoals.length} meta(s) de poupança.`,
        type: "success",
        actionable: false
      });
    }
  }

  // Insight 5: Saldo positivo
  if (currentMonthStats.balance > 0) {
    insights.push({
      title: "Mês Positivo",
      description: `Você terminou o mês com um saldo positivo de R$ ${(currentMonthStats.balance / 100).toFixed(2)}.`,
      type: "success",
      actionable: false
    });
  } else if (currentMonthStats.balance < 0) {
    insights.push({
      title: "Mês Negativo",
      description: `Você terminou o mês com um déficit de R$ ${(Math.abs(currentMonthStats.balance) / 100).toFixed(2)}.`,
      type: "warning",
      actionable: true
    });
  }

  return insights;
}

/**
 * Calcula o saldo total do usuário a partir de todas as contas
 */
export function calculateTotalBalance(accountBalances: number[]): number {
  return accountBalances.reduce((sum, balance) => sum + balance, 0);
}

/**
 * Calcula o saldo disponível (total - comprometido com metas/orçamentos)
 */
export function calculateAvailableBalance(
  totalBalance: number,
  budgetSpent: number,
  goalsAmount: number
): number {
  return totalBalance - budgetSpent - goalsAmount;
}

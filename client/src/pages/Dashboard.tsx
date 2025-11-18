import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Target, AlertCircle } from "lucide-react";
import { Loader2 } from "lucide-react";

/**
 * Dashboard Principal
 * 
 * Exibe KPIs principais e insights financeiros do usuário.
 * Segue a regra dos 5 segundos para compreensão rápida.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = trpc.analytics.dashboard.useQuery();
  const { data: insights } = trpc.analytics.insights.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6">
        <p className="text-center text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, {user?.name || "Usuário"}!</h1>
        <p className="text-muted-foreground mt-2">Aqui está um resumo da sua situação financeira</p>
      </div>

      {/* KPI Cards - Hero Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Saldo Total */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Saldo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(dashboardData.totalBalance)}
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              {dashboardData.accountCount} conta{dashboardData.accountCount !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        {/* Receitas do Mês */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Receitas do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(dashboardData.income)}
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">Mês atual</p>
          </CardContent>
        </Card>

        {/* Gastos do Mês */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Gastos do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              {formatCurrency(dashboardData.expenses)}
            </div>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">Mês atual</p>
          </CardContent>
        </Card>

        {/* Saldo Disponível */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Saldo Disponível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {formatCurrency(dashboardData.balance)}
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Receitas - Gastos</p>
          </CardContent>
        </Card>

        {/* Metas Ativas */}
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Metas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {dashboardData.goalsCount}
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">Metas em progresso</p>
          </CardContent>
        </Card>

        {/* Alertas de Orçamento */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {dashboardData.budgetAlerts.filter(a => a.isAlert).length}
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">Orçamentos acima de 80%</p>
          </CardContent>
        </Card>
      </div>

      {/* Gastos por Categoria */}
      {dashboardData.categorySpending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>Distribuição dos gastos do mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.categorySpending.slice(0, 5).map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium capitalize">{category.category}</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold">{formatCurrency(category.amount)}</p>
                    <p className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      {insights && insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Insights Financeiros</CardTitle>
            <CardDescription>Análises e recomendações baseadas nos seus dados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border-l-4 ${
                    insight.type === "success"
                      ? "bg-green-50 dark:bg-green-950 border-green-500"
                      : insight.type === "warning"
                      ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-500"
                      : "bg-blue-50 dark:bg-blue-950 border-blue-500"
                  }`}
                >
                  <p className="font-semibold text-sm">{insight.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertas de Orçamento */}
      {dashboardData.budgetAlerts.filter(a => a.isAlert).length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="text-yellow-900 dark:text-yellow-100">Orçamentos em Alerta</CardTitle>
            <CardDescription className="text-yellow-800 dark:text-yellow-200">
              Categorias que ultrapassaram 80% do orçamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.budgetAlerts
                .filter(a => a.isAlert)
                .map((alert) => (
                  <div key={alert.category} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize">{alert.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(alert.spent)} de {formatCurrency(alert.limit)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                        {alert.percentage.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, Target } from "lucide-react";

/**
 * Página de Metas de Poupança
 * 
 * Permite criar, editar e acompanhar metas de poupança.
 */
export default function SavingsGoals() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
    description: "",
  });

  // Queries
  const { data: goals, refetch: refetchGoals } = trpc.savingsGoals.list.useQuery();

  // Mutations
  const createMutation = trpc.savingsGoals.create.useMutation({
    onSuccess: () => {
      refetchGoals();
      setIsOpen(false);
      setFormData({
        name: "",
        targetAmount: "",
        targetDate: "",
        description: "",
      });
    },
  });

  const deleteMutation = trpc.savingsGoals.delete.useMutation({
    onSuccess: () => {
      refetchGoals();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount || !formData.targetDate) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    createMutation.mutate({
      name: formData.name,
      targetAmount: Math.round(parseFloat(formData.targetAmount) * 100),
      targetDate: new Date(formData.targetDate),
      description: formData.description,
    });
  };

  const activeGoals = goals?.filter(g => g.status === "active") || [];
  const completedGoals = goals?.filter(g => g.status === "completed") || [];

  const totalTargetAmount = activeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = activeGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas de Poupança</h1>
          <p className="text-muted-foreground mt-2">Acompanhe suas metas financeiras</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Meta de Poupança</DialogTitle>
              <DialogDescription>
                Defina uma meta de poupança para alcançar seus objetivos financeiros
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Meta</Label>
                <Input
                  id="name"
                  placeholder="ex: Viagem para o exterior"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Valor Alvo */}
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Valor Alvo (R$)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                />
              </div>

              {/* Data Alvo */}
              <div className="space-y-2">
                <Label htmlFor="targetDate">Data Alvo</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Adicione uma descrição..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Criar Meta"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progresso Geral */}
      {activeGoals.length > 0 && (
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="text-amber-900 dark:text-amber-100 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Progresso Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{formatCurrency(totalCurrentAmount)} de {formatCurrency(totalTargetAmount)}</span>
                  <span className="text-sm font-semibold">{overallProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-3">
                  <div
                    className="bg-amber-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(overallProgress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metas Ativas */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Metas Ativas</h2>
        {activeGoals.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Nenhuma meta ativa no momento</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.map((goal) => {
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              const daysRemaining = Math.ceil(
                (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate({ id: goal.id })}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progresso */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{formatCurrency(goal.currentAmount)}</span>
                        <span className="text-sm font-semibold">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Informações */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Valor Alvo</p>
                        <p className="font-semibold">{formatCurrency(goal.targetAmount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Data Alvo</p>
                        <p className="font-semibold">{formatDate(new Date(goal.targetDate))}</p>
                      </div>
                    </div>

                    {/* Dias Restantes */}
                    {daysRemaining > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {daysRemaining} dia{daysRemaining !== 1 ? "s" : ""} restante{daysRemaining !== 1 ? "s" : ""}
                      </div>
                    )}

                    {goal.description && (
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Metas Concluídas */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Metas Concluídas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="opacity-75">
                <CardHeader>
                  <CardTitle className="text-lg line-through">{goal.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Meta concluída em {formatDate(new Date(goal.targetDate))}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

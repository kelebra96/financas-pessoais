import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { formatCurrency, formatDate, CATEGORY_LABELS, ACCOUNT_TYPE_LABELS } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";

/**
 * Página de Transações
 * 
 * Permite criar, editar e deletar transações.
 * Exibe listagem com filtros por período e categoria.
 */
export default function Transactions() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    accountId: "",
    amount: "",
    type: "expense" as "income" | "expense",
    category: "other",
    description: "",
    transactionDate: new Date().toISOString().split("T")[0],
  });

  // Queries
  const { data: accounts } = trpc.accounts.list.useQuery();
  const { data: transactions, refetch: refetchTransactions } = trpc.transactions.list.useQuery({
    limit: 100,
    offset: 0,
  });

  // Mutations
  const createMutation = trpc.transactions.create.useMutation({
    onSuccess: () => {
      refetchTransactions();
      setIsOpen(false);
      setFormData({
        accountId: "",
        amount: "",
        type: "expense",
        category: "other",
        description: "",
        transactionDate: new Date().toISOString().split("T")[0],
      });
    },
  });

  const deleteMutation = trpc.transactions.delete.useMutation({
    onSuccess: () => {
      refetchTransactions();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.accountId || !formData.amount) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    createMutation.mutate({
      accountId: parseInt(formData.accountId),
      amount: Math.round(parseFloat(formData.amount) * 100),
      type: formData.type,
      category: formData.category as any,
      description: formData.description,
      transactionDate: new Date(formData.transactionDate),
      isRecurring: false,
    });
  };

  const categories = [
    "food",
    "transportation",
    "health",
    "education",
    "entertainment",
    "subscriptions",
    "utilities",
    "insurance",
    "salary",
    "investment",
    "other"
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground mt-2">Gerencie suas receitas e despesas</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
              <DialogDescription>
                Adicione uma nova transação ao seu histórico financeiro
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tipo */}
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conta */}
              <div className="space-y-2">
                <Label htmlFor="accountId">Conta</Label>
                <Select value={formData.accountId} onValueChange={(value) => setFormData({ ...formData, accountId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma conta" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts?.map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Valor */}
              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_LABELS[cat] || cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data */}
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.transactionDate}
                  onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
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
                  "Salvar Transação"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>
            {transactions?.length || 0} transação{transactions?.length !== 1 ? "s" : ""} registrada{transactions?.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!transactions || transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma transação registrada ainda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-semibold">Data</th>
                    <th className="text-left py-2 px-4 font-semibold">Descrição</th>
                    <th className="text-left py-2 px-4 font-semibold">Categoria</th>
                    <th className="text-right py-2 px-4 font-semibold">Valor</th>
                    <th className="text-center py-2 px-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4">{formatDate(new Date(transaction.transactionDate))}</td>
                      <td className="py-2 px-4">{transaction.description || "-"}</td>
                      <td className="py-2 px-4">
                        <span className="inline-block bg-muted px-2 py-1 rounded text-xs">
                          {CATEGORY_LABELS[transaction.category] || transaction.category}
                        </span>
                      </td>
                      <td className={`py-2 px-4 text-right font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate({ id: transaction.id })}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

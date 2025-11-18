import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { formatCurrency, ACCOUNT_TYPE_LABELS } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";

/**
 * Página de Contas
 * 
 * Permite criar, editar e deletar contas financeiras.
 */
export default function Accounts() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "bank_account" as any,
    balance: "",
    description: "",
  });

  // Queries
  const { data: accounts, refetch: refetchAccounts } = trpc.accounts.list.useQuery();

  // Mutations
  const createMutation = trpc.accounts.create.useMutation({
    onSuccess: () => {
      refetchAccounts();
      setIsOpen(false);
      setFormData({
        name: "",
        type: "bank_account",
        balance: "",
        description: "",
      });
    },
  });

  const deleteMutation = trpc.accounts.delete.useMutation({
    onSuccess: () => {
      refetchAccounts();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.balance) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    createMutation.mutate({
      name: formData.name,
      type: formData.type,
      balance: Math.round(parseFloat(formData.balance) * 100),
      currency: "BRL",
      description: formData.description,
    });
  };

  const accountTypes = [
    "bank_account",
    "savings",
    "credit_card",
    "digital_wallet",
    "investment",
    "other"
  ];

  const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;

  return (
    <div className="space-y-6 p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas</h1>
          <p className="text-muted-foreground mt-2">Gerencie suas contas financeiras</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Conta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Conta</DialogTitle>
              <DialogDescription>
                Adicione uma nova conta financeira ao seu portfólio
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Conta</Label>
                <Input
                  id="name"
                  placeholder="ex: Conta Corrente Banco X"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Tipo */}
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Conta</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {ACCOUNT_TYPE_LABELS[type] || type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Saldo Inicial */}
              <div className="space-y-2">
                <Label htmlFor="balance">Saldo Inicial (R$)</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
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
                  "Criar Conta"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Saldo Total */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">Saldo Total</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(totalBalance)}</p>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
            {accounts?.length || 0} conta{accounts?.length !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      {/* Grid de Contas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!accounts || accounts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Nenhuma conta registrada ainda</p>
          </div>
        ) : (
          accounts.map((account) => (
            <Card key={account.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <CardDescription>{ACCOUNT_TYPE_LABELS[account.type] || account.type}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate({ id: account.id })}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Saldo</p>
                    <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
                  </div>
                  {account.description && (
                    <div>
                      <p className="text-sm text-muted-foreground">Descrição</p>
                      <p className="text-sm">{account.description}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Moeda</p>
                    <p className="text-sm font-medium">{account.currency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

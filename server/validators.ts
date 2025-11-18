/**
 * Validadores Zod para toda a aplicação
 * 
 * Define schemas de validação para:
 * - Autenticação
 * - Contas
 * - Transações
 * - Orçamentos
 * - Metas
 */

export { z } from "zod";
import { z } from "zod";

/**
 * AUTENTICAÇÃO
 */
export const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const mfaSetupSchema = z.object({
  secret: z.string().min(1, "Secret é obrigatório"),
});

export const mfaVerifySchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Código deve ter 6 dígitos"),
});

/**
 * CONTAS
 */
export const createAccountSchema = z.object({
  name: z.string().min(1, "Nome da conta é obrigatório").max(255),
  type: z.enum(["bank_account", "savings", "credit_card", "digital_wallet", "investment", "other"]),
  balance: z.number().int().nonnegative("Saldo não pode ser negativo"),
  currency: z.string().length(3).default("BRL"),
  description: z.string().optional(),
});

export const updateAccountSchema = createAccountSchema.partial();

/**
 * TRANSAÇÕES
 */
export const createTransactionSchema = z.object({
  accountId: z.number().int().positive("ID da conta inválido"),
  amount: z.number().int().positive("Valor deve ser positivo"),
  type: z.enum(["income", "expense"]),
  category: z.enum([
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
  ]),
  description: z.string().max(500, "Descrição muito longa").optional(),
  transactionDate: z.date(),
  isRecurring: z.boolean().default(false),
  recurringId: z.number().int().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const updateTransactionCategorySchema = z.object({
  category: z.enum([
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
  ]),
});

/**
 * TRANSAÇÕES RECORRENTES
 */
export const createRecurringTransactionSchema = z.object({
  accountId: z.number().int().positive("ID da conta inválido"),
  amount: z.number().int().positive("Valor deve ser positivo"),
  type: z.enum(["income", "expense"]),
  category: z.enum([
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
  ]),
  description: z.string().max(500).optional(),
  frequency: z.enum(["daily", "weekly", "biweekly", "monthly", "quarterly", "yearly"]),
  nextOccurrenceDate: z.date(),
  endDate: z.date().optional(),
});

export const updateRecurringTransactionSchema = createRecurringTransactionSchema.partial();

/**
 * ORÇAMENTOS
 */
export const createBudgetSchema = z.object({
  category: z.enum([
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
  ]),
  limit: z.number().int().positive("Limite deve ser positivo"),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Formato deve ser YYYY-MM"),
});

export const updateBudgetSchema = createBudgetSchema.partial();

/**
 * METAS DE POUPANÇA
 */
export const createSavingsGoalSchema = z.object({
  name: z.string().min(1, "Nome da meta é obrigatório").max(255),
  targetAmount: z.number().int().positive("Valor alvo deve ser positivo"),
  targetDate: z.date(),
  description: z.string().optional(),
});

export const updateSavingsGoalSchema = createSavingsGoalSchema.partial();

export const updateSavingsGoalProgressSchema = z.object({
  currentAmount: z.number().int().nonnegative("Valor atual não pode ser negativo"),
});

/**
 * COMPARTILHAMENTO
 */
export const shareFinancialDataSchema = z.object({
  sharedWithUserId: z.number().int().positive("ID do usuário inválido"),
  permissions: z.enum(["view", "edit"]).default("view"),
});

/**
 * Tipos TypeScript derivados dos schemas
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type CreateRecurringTransactionInput = z.infer<typeof createRecurringTransactionSchema>;
export type UpdateRecurringTransactionInput = z.infer<typeof updateRecurringTransactionSchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type CreateSavingsGoalInput = z.infer<typeof createSavingsGoalSchema>;
export type UpdateSavingsGoalInput = z.infer<typeof updateSavingsGoalSchema>;
export type ShareFinancialDataInput = z.infer<typeof shareFinancialDataSchema>;

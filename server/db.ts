import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

import { 
  accounts, 
  transactions, 
  recurringTransactions, 
  budgets, 
  savingsGoals,
  Account,
  InsertAccount,
  Transaction,
  InsertTransaction,
  RecurringTransaction,
  InsertRecurringTransaction,
  Budget,
  InsertBudget,
  SavingsGoal,
  InsertSavingsGoal
} from "../drizzle/schema";
import { and, gte, lte } from "drizzle-orm";

/**
 * CONTAS FINANCEIRAS
 * Funções para gerenciar contas do usuário
 */
export async function getUserAccounts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(accounts).where(eq(accounts.userId, userId));
}

export async function getAccountById(accountId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(accounts)
    .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)));
  return result[0];
}

export async function createAccount(account: InsertAccount) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(accounts).values(account);
  return result;
}

export async function updateAccount(accountId: number, userId: number, updates: Partial<Account>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(accounts)
    .set(updates)
    .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)));
}

export async function deleteAccount(accountId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(accounts)
    .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)));
}

/**
 * TRANSAÇÕES
 * Funções para gerenciar transações do usuário
 */
export async function getUserTransactions(userId: number, limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(transactions.transactionDate)
    .limit(limit)
    .offset(offset);
}

export async function getTransactionsByDateRange(userId: number, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(transactions)
    .where(and(
      eq(transactions.userId, userId),
      gte(transactions.transactionDate, startDate),
      lte(transactions.transactionDate, endDate)
    ))
    .orderBy(transactions.transactionDate);
}

export async function getTransactionsByCategory(userId: number, category: string, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(transactions)
    .where(and(
      eq(transactions.userId, userId),
      eq(transactions.category, category as any),
      gte(transactions.transactionDate, startDate),
      lte(transactions.transactionDate, endDate)
    ));
}

export async function createTransaction(transaction: InsertTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(transactions).values(transaction);
}

export async function updateTransaction(transactionId: number, userId: number, updates: Partial<Transaction>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(transactions)
    .set(updates)
    .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)));
}

export async function deleteTransaction(transactionId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(transactions)
    .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)));
}

/**
 * TRANSAÇÕES RECORRENTES
 * Funções para gerenciar transações recorrentes
 */
export async function getUserRecurringTransactions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(recurringTransactions)
    .where(eq(recurringTransactions.userId, userId));
}

export async function getRecurringTransactionById(recurringId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(recurringTransactions)
    .where(and(eq(recurringTransactions.id, recurringId), eq(recurringTransactions.userId, userId)));
  return result[0];
}

export async function createRecurringTransaction(recurring: InsertRecurringTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(recurringTransactions).values(recurring);
}

export async function updateRecurringTransaction(recurringId: number, userId: number, updates: Partial<RecurringTransaction>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(recurringTransactions)
    .set(updates)
    .where(and(eq(recurringTransactions.id, recurringId), eq(recurringTransactions.userId, userId)));
}

export async function deleteRecurringTransaction(recurringId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(recurringTransactions)
    .where(and(eq(recurringTransactions.id, recurringId), eq(recurringTransactions.userId, userId)));
}

/**
 * ORÇAMENTOS
 * Funções para gerenciar orçamentos mensais
 */
export async function getUserBudgets(userId: number, month: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(budgets)
    .where(and(eq(budgets.userId, userId), eq(budgets.month, month)));
}

export async function createBudget(budget: InsertBudget) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(budgets).values(budget);
}

export async function updateBudget(budgetId: number, userId: number, updates: Partial<Budget>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(budgets)
    .set(updates)
    .where(and(eq(budgets.id, budgetId), eq(budgets.userId, userId)));
}

export async function deleteBudget(budgetId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(budgets)
    .where(and(eq(budgets.id, budgetId), eq(budgets.userId, userId)));
}

/**
 * METAS DE POUPANÇA
 * Funções para gerenciar metas de poupança
 */
export async function getUserSavingsGoals(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(savingsGoals)
    .where(eq(savingsGoals.userId, userId));
}

export async function getSavingsGoalById(goalId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(savingsGoals)
    .where(and(eq(savingsGoals.id, goalId), eq(savingsGoals.userId, userId)));
  return result[0];
}

export async function createSavingsGoal(goal: InsertSavingsGoal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(savingsGoals).values(goal);
}

export async function updateSavingsGoal(goalId: number, userId: number, updates: Partial<SavingsGoal>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(savingsGoals)
    .set(updates)
    .where(and(eq(savingsGoals.id, goalId), eq(savingsGoals.userId, userId)));
}

export async function deleteSavingsGoal(goalId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(savingsGoals)
    .where(and(eq(savingsGoals.id, goalId), eq(savingsGoals.userId, userId)));
}

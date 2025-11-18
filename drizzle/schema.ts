import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // MFA fields
  mfaEnabled: boolean("mfaEnabled").default(false).notNull(),
  mfaSecret: varchar("mfaSecret", { length: 255 }),
  // Shared access
  sharedWithIds: text("sharedWithIds"), // JSON array of user IDs with shared access
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Contas financeiras do usuário (conta corrente, poupança, cartão, etc.)
 */
export const accounts = mysqlTable("accounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["bank_account", "savings", "credit_card", "digital_wallet", "investment", "other"]).notNull(),
  balance: int("balance").notNull().default(0), // Armazenar em centavos (ex: 10000 = R$ 100,00)
  currency: varchar("currency", { length: 3 }).notNull().default("BRL"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type InsertAccount = typeof accounts.$inferInsert;

/**
 * Transações (receitas e despesas)
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  accountId: int("accountId").notNull(),
  amount: int("amount").notNull(), // Em centavos
  type: mysqlEnum("type", ["income", "expense"]).notNull(),
  category: mysqlEnum("category", [
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
  ]).notNull(),
  description: varchar("description", { length: 500 }),
  transactionDate: timestamp("transactionDate").notNull(),
  isRecurring: boolean("isRecurring").default(false).notNull(),
  recurringId: int("recurringId"), // Referência para transação recorrente
  categorizedAutomatically: boolean("categorizedAutomatically").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Transações recorrentes (aluguel, assinatura, etc.)
 */
export const recurringTransactions = mysqlTable("recurringTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  accountId: int("accountId").notNull(),
  amount: int("amount").notNull(), // Em centavos
  type: mysqlEnum("type", ["income", "expense"]).notNull(),
  category: mysqlEnum("category", [
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
  ]).notNull(),
  description: varchar("description", { length: 500 }),
  frequency: mysqlEnum("frequency", ["daily", "weekly", "biweekly", "monthly", "quarterly", "yearly"]).notNull(),
  nextOccurrenceDate: timestamp("nextOccurrenceDate").notNull(),
  status: mysqlEnum("status", ["active", "paused", "completed"]).default("active").notNull(),
  endDate: timestamp("endDate"), // Opcional: data de término
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RecurringTransaction = typeof recurringTransactions.$inferSelect;
export type InsertRecurringTransaction = typeof recurringTransactions.$inferInsert;

/**
 * Orçamentos mensais por categoria
 */
export const budgets = mysqlTable("budgets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  category: mysqlEnum("category", [
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
  ]).notNull(),
  limit: int("limit").notNull(), // Em centavos
  spent: int("spent").notNull().default(0), // Em centavos
  month: varchar("month", { length: 7 }).notNull(), // Formato: YYYY-MM
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = typeof budgets.$inferInsert;

/**
 * Metas de poupança
 */
export const savingsGoals = mysqlTable("savingsGoals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  targetAmount: int("targetAmount").notNull(), // Em centavos
  currentAmount: int("currentAmount").notNull().default(0), // Em centavos
  targetDate: timestamp("targetDate").notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["active", "completed", "abandoned"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SavingsGoal = typeof savingsGoals.$inferSelect;
export type InsertSavingsGoal = typeof savingsGoals.$inferInsert;
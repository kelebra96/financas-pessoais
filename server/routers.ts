import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import * as validators from "./validators";
import { getCategorizer } from "./services/transactionCategorizationService";
import * as analyticsService from "./services/analyticsService";
import { formatMonthYYYYMM, getPreviousMonth } from "../lib/utils";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  accounts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserAccounts(ctx.user.id);
    }),

    get: protectedProcedure
      .input(validators.z.object({ id: validators.z.number().int() }))
      .query(async ({ ctx, input }) => {
        const account = await db.getAccountById(input.id, ctx.user.id);
        if (!account) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Conta nao encontrada" });
        }
        return account;
      }),

    create: protectedProcedure
      .input(validators.createAccountSchema)
      .mutation(async ({ ctx, input }) => {
        const result = await db.createAccount({
          ...input,
          userId: ctx.user.id,
        });
        return { success: true, id: 1 };
      }),

    update: protectedProcedure
      .input(
        validators.z.object({
          id: validators.z.number().int(),
          data: validators.updateAccountSchema,
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.updateAccount(input.id, ctx.user.id, input.data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(validators.z.object({ id: validators.z.number().int() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteAccount(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  transactions: router({
    list: protectedProcedure
      .input(
        validators.z.object({
          limit: validators.z.number().int().default(50),
          offset: validators.z.number().int().default(0),
        })
      )
      .query(async ({ ctx, input }) => {
        return db.getUserTransactions(ctx.user.id, input.limit, input.offset);
      }),

    listByDateRange: protectedProcedure
      .input(
        validators.z.object({
          startDate: validators.z.date(),
          endDate: validators.z.date(),
        })
      )
      .query(async ({ ctx, input }) => {
        return db.getTransactionsByDateRange(ctx.user.id, input.startDate, input.endDate);
      }),

    create: protectedProcedure
      .input(validators.createTransactionSchema)
      .mutation(async ({ ctx, input }) => {
        const account = await db.getAccountById(input.accountId, ctx.user.id);
        if (!account) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Conta nao encontrada" });
        }

        const categorizer = getCategorizer();
        const categorizationResult = await categorizer.categorize(
          input.description || "",
          input.amount,
          input.type
        );

        const result = await db.createTransaction({
          ...input,
          userId: ctx.user.id,
          category: categorizationResult.category,
          categorizedAutomatically: categorizationResult.automatic,
        });

        return { success: true, id: 1 };
      }),

    updateCategory: protectedProcedure
      .input(
        validators.z.object({
          id: validators.z.number().int(),
          category: validators.updateTransactionCategorySchema.shape.category,
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.updateTransaction(input.id, ctx.user.id, {
          category: input.category,
          categorizedAutomatically: false,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(validators.z.object({ id: validators.z.number().int() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteTransaction(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  recurringTransactions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserRecurringTransactions(ctx.user.id);
    }),

    create: protectedProcedure
      .input(validators.createRecurringTransactionSchema)
      .mutation(async ({ ctx, input }) => {
        const account = await db.getAccountById(input.accountId, ctx.user.id);
        if (!account) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Conta nao encontrada" });
        }

        const result = await db.createRecurringTransaction({
          ...input,
          userId: ctx.user.id,
        });

        return { success: true, id: 1 };
      }),

    update: protectedProcedure
      .input(
        validators.z.object({
          id: validators.z.number().int(),
          data: validators.updateRecurringTransactionSchema,
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.updateRecurringTransaction(input.id, ctx.user.id, input.data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(validators.z.object({ id: validators.z.number().int() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteRecurringTransaction(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  budgets: router({
    listByMonth: protectedProcedure
      .input(validators.z.object({ month: validators.z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getUserBudgets(ctx.user.id, input.month);
      }),

    create: protectedProcedure
      .input(validators.createBudgetSchema)
      .mutation(async ({ ctx, input }) => {
        const result = await db.createBudget({
          ...input,
          userId: ctx.user.id,
          spent: 0,
        });
        return { success: true, id: 1 };
      }),

    update: protectedProcedure
      .input(
        validators.z.object({
          id: validators.z.number().int(),
          data: validators.updateBudgetSchema,
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.updateBudget(input.id, ctx.user.id, input.data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(validators.z.object({ id: validators.z.number().int() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteBudget(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  savingsGoals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserSavingsGoals(ctx.user.id);
    }),

    create: protectedProcedure
      .input(validators.createSavingsGoalSchema)
      .mutation(async ({ ctx, input }) => {
        const result = await db.createSavingsGoal({
          ...input,
          userId: ctx.user.id,
          currentAmount: 0,
          status: "active",
        });
        return { success: true, id: 1 };
      }),

    update: protectedProcedure
      .input(
        validators.z.object({
          id: validators.z.number().int(),
          data: validators.updateSavingsGoalSchema,
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.updateSavingsGoal(input.id, ctx.user.id, input.data);
        return { success: true };
      }),

    updateProgress: protectedProcedure
      .input(
        validators.z.object({
          id: validators.z.number().int(),
          currentAmount: validators.z.number().int().nonnegative(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.updateSavingsGoal(input.id, ctx.user.id, {
          currentAmount: input.currentAmount,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(validators.z.object({ id: validators.z.number().int() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteSavingsGoal(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  analytics: router({
    dashboard: protectedProcedure.query(async ({ ctx }) => {
      const currentMonth = formatMonthYYYYMM();
      const accounts = await db.getUserAccounts(ctx.user.id);
      const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      const currentTransactions = await db.getTransactionsByDateRange(
        ctx.user.id,
        startOfMonth,
        endOfMonth
      );

      const income = currentTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = currentTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const budgets = await db.getUserBudgets(ctx.user.id, currentMonth);
      const budgetAlerts = analyticsService.generateBudgetAlerts(budgets);

      const goals = await db.getUserSavingsGoals(ctx.user.id);

      const categorySpending = analyticsService.calculateCategorySpending(
        currentTransactions,
        startOfMonth,
        endOfMonth
      );

      return {
        totalBalance,
        income,
        expenses,
        balance: income - expenses,
        accountCount: accounts.length,
        budgetAlerts,
        categorySpending,
        goalsCount: goals.filter(g => g.status === "active").length,
      };
    }),

    insights: protectedProcedure.query(async ({ ctx }) => {
      const currentMonth = formatMonthYYYYMM();
      const previousMonth = getPreviousMonth(currentMonth);

      const startOfCurrent = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endOfCurrent = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      const startOfPrevious = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
      const endOfPrevious = new Date(new Date().getFullYear(), new Date().getMonth(), 0);

      const currentTransactions = await db.getTransactionsByDateRange(
        ctx.user.id,
        startOfCurrent,
        endOfCurrent
      );

      const previousTransactions = await db.getTransactionsByDateRange(
        ctx.user.id,
        startOfPrevious,
        endOfPrevious
      );

      const currentStats = analyticsService.calculateMonthlyStats(currentTransactions, currentMonth);
      const previousStats = analyticsService.calculateMonthlyStats(previousTransactions, previousMonth);

      const categorySpending = analyticsService.calculateCategorySpending(
        currentTransactions,
        startOfCurrent,
        endOfCurrent
      );

      const budgets = await db.getUserBudgets(ctx.user.id, currentMonth);
      const budgetAlerts = analyticsService.generateBudgetAlerts(budgets);

      const goals = await db.getUserSavingsGoals(ctx.user.id);

      const insights = analyticsService.generateFinancialInsights(
        currentStats,
        previousStats,
        categorySpending,
        budgetAlerts,
        goals
      );

      return insights;
    }),
  }),
});

export type AppRouter = typeof appRouter;

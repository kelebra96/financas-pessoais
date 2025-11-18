import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata um valor em centavos para formato de moeda BRL
 */
export function formatCurrency(centavos: number): string {
  const reais = centavos / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(reais);
}

/**
 * Formata uma data para formato brasileiro
 */
export function formatDate(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR").format(data);
}

/**
 * Formata uma data com hora
 */
export function formatDateTime(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(data);
}

/**
 * Traduz nomes de categorias para português
 */
export const CATEGORY_LABELS: Record<string, string> = {
  food: "Alimentação",
  transportation: "Transporte",
  health: "Saúde",
  education: "Educação",
  entertainment: "Entretenimento",
  subscriptions: "Assinaturas",
  utilities: "Utilidades",
  insurance: "Seguros",
  salary: "Salário",
  investment: "Investimento",
  other: "Outro"
};

/**
 * Traduz tipos de contas para português
 */
export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  bank_account: "Conta Corrente",
  savings: "Poupança",
  credit_card: "Cartão de Crédito",
  digital_wallet: "Carteira Digital",
  investment: "Investimento",
  other: "Outro"
};

/**
 * Traduz frequências para português
 */
export const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Diário",
  weekly: "Semanal",
  biweekly: "Quinzenal",
  monthly: "Mensal",
  quarterly: "Trimestral",
  yearly: "Anual"
};

/**
 * Obtém a cor para cada categoria (para gráficos)
 */
export const CATEGORY_COLORS: Record<string, string> = {
  food: "#FF6B6B",
  transportation: "#4ECDC4",
  health: "#45B7D1",
  education: "#FFA07A",
  entertainment: "#98D8C8",
  subscriptions: "#F7DC6F",
  utilities: "#BB8FCE",
  insurance: "#85C1E2",
  salary: "#52C41A",
  investment: "#1890FF",
  other: "#BFBFBF"
};

/**
 * Utilitários para formatação e cálculos
 */

/**
 * Formata um valor em centavos para formato de moeda BRL
 * @param centavos - Valor em centavos
 * @returns String formatada (ex: "R$ 100,00")
 */
export function formatCurrency(centavos: number): string {
  const reais = centavos / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(reais);
}

/**
 * Converte um valor em reais para centavos
 * @param reais - Valor em reais
 * @returns Valor em centavos
 */
export function reaisToCentavos(reais: number): number {
  return Math.round(reais * 100);
}

/**
 * Converte um valor em centavos para reais
 * @param centavos - Valor em centavos
 * @returns Valor em reais
 */
export function centavosToReais(centavos: number): number {
  return centavos / 100;
}

/**
 * Formata uma data para formato brasileiro
 * @param data - Data a formatar
 * @returns String formatada (ex: "01/01/2024")
 */
export function formatDate(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR").format(data);
}

/**
 * Formata uma data com hora
 * @param data - Data a formatar
 * @returns String formatada (ex: "01/01/2024 14:30")
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
 * Obtém o primeiro dia do mês
 * @param data - Data de referência
 * @returns Primeiro dia do mês
 */
export function getFirstDayOfMonth(data: Date = new Date()): Date {
  return new Date(data.getFullYear(), data.getMonth(), 1);
}

/**
 * Obtém o último dia do mês
 * @param data - Data de referência
 * @returns Último dia do mês
 */
export function getLastDayOfMonth(data: Date = new Date()): Date {
  return new Date(data.getFullYear(), data.getMonth() + 1, 0);
}

/**
 * Formata um mês no formato YYYY-MM
 * @param data - Data de referência
 * @returns String no formato YYYY-MM
 */
export function formatMonthYYYYMM(data: Date = new Date()): string {
  const year = data.getFullYear();
  const month = String(data.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Obtém o número de dias decorridos no mês
 * @param data - Data de referência
 * @returns Número de dias decorridos
 */
export function getDaysElapsedInMonth(data: Date = new Date()): number {
  return data.getDate();
}

/**
 * Obtém o número total de dias no mês
 * @param data - Data de referência
 * @returns Número total de dias
 */
export function getTotalDaysInMonth(data: Date = new Date()): number {
  return getLastDayOfMonth(data).getDate();
}

/**
 * Calcula a diferença em dias entre duas datas
 * @param data1 - Primeira data
 * @param data2 - Segunda data
 * @returns Diferença em dias
 */
export function daysBetween(data1: Date, data2: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((data2.getTime() - data1.getTime()) / msPerDay);
}

/**
 * Obtém o mês anterior no formato YYYY-MM
 * @param mes - Mês no formato YYYY-MM
 * @returns Mês anterior no formato YYYY-MM
 */
export function getPreviousMonth(mes: string): string {
  const [year, month] = mes.split("-").map(Number);
  if (month === 1) {
    return `${year - 1}-12`;
  }
  return `${year}-${String(month - 1).padStart(2, "0")}`;
}

/**
 * Obtém o próximo mês no formato YYYY-MM
 * @param mes - Mês no formato YYYY-MM
 * @returns Próximo mês no formato YYYY-MM
 */
export function getNextMonth(mes: string): string {
  const [year, month] = mes.split("-").map(Number);
  if (month === 12) {
    return `${year + 1}-01`;
  }
  return `${year}-${String(month + 1).padStart(2, "0")}`;
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

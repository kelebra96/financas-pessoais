/**
 * TransactionCategorizationService
 * 
 * Serviço responsável por categorizar transações automaticamente.
 * Implementa uma versão baseada em regras simples.
 * Preparado para integração futura com modelos de IA.
 */

type TransactionCategory = 
  | "food"
  | "transportation"
  | "health"
  | "education"
  | "entertainment"
  | "subscriptions"
  | "utilities"
  | "insurance"
  | "salary"
  | "investment"
  | "other";

interface CategorizationResult {
  category: TransactionCategory;
  confidence: number; // 0-1
  automatic: boolean;
}

/**
 * Palavras-chave para cada categoria
 * Usadas para categorização automática baseada em regras
 */
const CATEGORY_KEYWORDS: Record<TransactionCategory, string[]> = {
  food: [
    "restaurante", "lanchonete", "pizza", "hambúrguer", "comida",
    "padaria", "açougue", "supermercado", "mercado", "feira",
    "delivery", "uber eats", "ifood", "rappi", "café", "bar",
    "churrascaria", "sushi", "pão", "alimento", "grocery"
  ],
  transportation: [
    "uber", "taxi", "ônibus", "metrô", "trem", "passagem",
    "combustível", "gasolina", "diesel", "estacionamento",
    "pedágio", "transporte", "viagem", "passagem aérea",
    "lyft", "bolt", "99", "car rental", "aluguel carro"
  ],
  health: [
    "farmácia", "médico", "dentista", "hospital", "clínica",
    "remédio", "medicamento", "consulta", "cirurgia", "exame",
    "academia", "musculação", "yoga", "fisioterapia", "psicólogo",
    "saúde", "healthcare", "pharmacy", "doctor"
  ],
  education: [
    "escola", "universidade", "curso", "educação", "aula",
    "livro", "material escolar", "faculdade", "treinamento",
    "certificado", "workshop", "seminar", "learning", "tutor"
  ],
  entertainment: [
    "cinema", "filme", "teatro", "show", "música", "concerto",
    "jogo", "game", "streaming", "netflix", "spotify", "prime",
    "diversão", "lazer", "parque", "passeio", "viagem",
    "disney", "ingresso", "ticket"
  ],
  subscriptions: [
    "assinatura", "subscription", "netflix", "spotify", "prime",
    "adobe", "microsoft", "apple", "google", "cloud", "hosting",
    "software", "app", "serviço", "mensal", "anual"
  ],
  utilities: [
    "água", "luz", "energia", "gás", "internet", "telefone",
    "conta", "fatura", "utilidade", "eletricidade", "utility",
    "electric", "water", "gas", "internet provider"
  ],
  insurance: [
    "seguro", "insurance", "apólice", "proteção", "cobertura",
    "saúde", "vida", "carro", "casa", "responsabilidade"
  ],
  salary: [
    "salário", "salary", "pagamento", "payment", "depósito",
    "vencimento", "remuneração", "ganho", "income", "earnings"
  ],
  investment: [
    "investimento", "ação", "stock", "fundo", "fund", "bitcoin",
    "cripto", "bolsa", "tesouro", "renda fixa", "aplicação",
    "broker", "corretora", "dividendo"
  ],
  other: []
};

/**
 * Categoriza uma transação automaticamente baseado na descrição
 * 
 * @param description - Descrição da transação
 * @param amount - Valor da transação (em centavos)
 * @param type - Tipo de transação (income ou expense)
 * @returns Resultado da categorização
 */
export function categorizeTransaction(
  description: string,
  amount: number,
  type: "income" | "expense"
): CategorizationResult {
  // Normalizar descrição para busca
  const normalizedDesc = description.toLowerCase().trim();

  // Se for receita (income), categorizar como salário por padrão
  if (type === "income") {
    return {
      category: "salary",
      confidence: 0.5,
      automatic: true
    };
  }

  // Buscar palavras-chave em ordem de confiança
  let bestMatch: { category: TransactionCategory; confidence: number } | null = null;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalizedDesc.includes(keyword)) {
        const confidence = Math.min(1, 0.7 + (keyword.length / 50)); // Palavras mais longas = mais confiança
        
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = {
            category: category as TransactionCategory,
            confidence
          };
        }
      }
    }
  }

  // Se encontrou uma correspondência, retornar
  if (bestMatch) {
    return {
      category: bestMatch.category,
      confidence: bestMatch.confidence,
      automatic: true
    };
  }

  // Padrão: categorizar como "other"
  return {
    category: "other",
    confidence: 0.3,
    automatic: true
  };
}

/**
 * Interface para permitir extensão futura com IA
 * Quando um modelo de IA for integrado, esta função será substituída
 */
export interface ITransactionCategorizer {
  categorize(
    description: string,
    amount: number,
    type: "income" | "expense"
  ): Promise<CategorizationResult>;
}

/**
 * Implementação atual (rule-based)
 */
export class RuleBasedCategorizer implements ITransactionCategorizer {
  async categorize(
    description: string,
    amount: number,
    type: "income" | "expense"
  ): Promise<CategorizationResult> {
    return categorizeTransaction(description, amount, type);
  }
}

/**
 * Placeholder para implementação futura com IA
 * Será ativado quando um modelo de IA for integrado
 */
export class AITransactionCategorizer implements ITransactionCategorizer {
  async categorize(
    description: string,
    amount: number,
    type: "income" | "expense"
  ): Promise<CategorizationResult> {
    // TODO: Integrar com modelo de IA (ex: OpenAI, custom ML model)
    // Por enquanto, usar fallback para rule-based
    return categorizeTransaction(description, amount, type);
  }
}

/**
 * Factory para obter o categorizador apropriado
 */
export function getCategorizer(): ITransactionCategorizer {
  // Por enquanto, usar rule-based
  // Mudar para AITransactionCategorizer quando IA estiver disponível
  return new RuleBasedCategorizer();
}

import { searchKnowledge, getContextualSuggestions, getRelatedTopics, type KnowledgeItem } from "./knowledge-base"

export interface AIResponse {
  text: string
  confidence: number
  relatedTopics?: KnowledgeItem[]
  suggestions?: string[]
}

export interface AIFeedback {
  messageId: string
  isHelpful: boolean
  comment?: string
}

// Histórico de feedback para melhorar as respostas
const feedbackHistory: AIFeedback[] = []

// Histórico de consultas para análise de padrões
const queryHistory: string[] = []

// Respostas genéricas para quando não encontramos uma resposta específica
const fallbackResponses = [
  "Não encontrei uma resposta específica para sua pergunta. Você poderia reformulá-la ou ser mais específico?",
  "Desculpe, não tenho informações suficientes sobre isso. Tente perguntar de outra forma ou consulte a documentação do sistema.",
  "Não tenho uma resposta pronta para essa pergunta. Posso ajudar com informações sobre inspeções, auditorias, ações, reuniões ou outros módulos do sistema.",
  "Não consegui entender completamente sua pergunta. Poderia fornecer mais detalhes ou perguntar de outra maneira?",
  "Não encontrei uma correspondência exata para sua pergunta. Aqui estão alguns tópicos relacionados que podem ajudar.",
]

// Respostas para saudações
const greetingResponses = [
  "Olá! Como posso ajudar você com o sistema SST hoje?",
  "Oi! Estou aqui para ajudar com suas dúvidas sobre o sistema. O que você gostaria de saber?",
  "Olá! Sou o assistente virtual do SST. Como posso auxiliar você?",
  "Oi! Estou pronto para responder suas perguntas sobre o sistema SST. Em que posso ajudar?",
]

// Respostas para agradecimentos
const thankYouResponses = [
  "De nada! Estou sempre à disposição para ajudar.",
  "Por nada! Se tiver mais perguntas, é só me chamar.",
  "Disponha! Fico feliz em poder ajudar.",
  "Não há de quê! Estou aqui para isso.",
]

/**
 * Gera uma resposta para a consulta do usuário usando a base de conhecimento local
 */
export async function generateResponse(query: string, currentCategory?: string): Promise<AIResponse> {
  // Adicionar a consulta ao histórico
  queryHistory.push(query)

  // Normalizar a consulta
  const normalizedQuery = query.toLowerCase().trim()

  // Verificar se é uma saudação
  if (isGreeting(normalizedQuery)) {
    const randomIndex = Math.floor(Math.random() * greetingResponses.length)
    return {
      text: greetingResponses[randomIndex],
      confidence: 0.9,
      suggestions: getContextualSuggestions(),
    }
  }

  // Verificar se é um agradecimento
  if (isThankYou(normalizedQuery)) {
    const randomIndex = Math.floor(Math.random() * thankYouResponses.length)
    return {
      text: thankYouResponses[randomIndex],
      confidence: 0.9,
      suggestions: getContextualSuggestions(currentCategory),
    }
  }

  // Buscar na base de conhecimento
  const matchedItems = searchKnowledge(normalizedQuery)

  // Se encontrou correspondências
  if (matchedItems.length > 0) {
    const bestMatch = matchedItems[0]
    const relatedTopics = getRelatedTopics(bestMatch.id)

    // Retornar a melhor correspondência
    return {
      text: bestMatch.answer,
      confidence: 0.8,
      relatedTopics,
      suggestions: getContextualSuggestions(bestMatch.category),
    }
  }

  // Se não encontrou correspondências, retornar uma resposta genérica
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length)
  return {
    text: fallbackResponses[randomIndex],
    confidence: 0.3,
    suggestions: getContextualSuggestions(),
  }
}

/**
 * Registra feedback sobre uma resposta para melhorar o sistema
 */
export function submitFeedback(feedback: AIFeedback): void {
  feedbackHistory.push(feedback)

  // Aqui poderíamos implementar um mecanismo para ajustar a base de conhecimento
  // com base no feedback recebido, mas isso seria mais complexo
  console.log("Feedback recebido:", feedback)
}

/**
 * Verifica se a consulta é uma saudação
 */
function isGreeting(query: string): boolean {
  const greetings = ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "e aí", "ei", "hello", "hi"]
  return greetings.some((greeting) => query.includes(greeting)) || query.length < 5
}

/**
 * Verifica se a consulta é um agradecimento
 */
function isThankYou(query: string): boolean {
  const thanks = ["obrigado", "obrigada", "valeu", "thanks", "thank you", "grato", "grata", "agradeço"]
  return thanks.some((thank) => query.includes(thank))
}

/**
 * Obtém sugestões com base no histórico de consultas e na categoria atual
 */
export function getSuggestions(currentCategory?: string): string[] {
  return getContextualSuggestions(currentCategory)
}

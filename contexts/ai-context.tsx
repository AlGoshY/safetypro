"\"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AIContextType {
  apiKey: string | null
  setApiKey: (key: string | null) => void
  isAssistantEnabled: boolean
  toggleAssistant: () => void
  assistantHistory: string[]
  addToHistory: (query: string) => void
  clearHistory: () => void
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export function AIContextProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null)
  const [isAssistantEnabled, setIsAssistantEnabled] = useState<boolean>(false)
  const [assistantHistory, setAssistantHistory] = useState<string[]>([])

  // Carregar a chave da API do localStorage ao inicializar
  useEffect(() => {
    const storedApiKey = localStorage.getItem("openai_api_key")
    if (storedApiKey) {
      setApiKeyState(storedApiKey)
    }
    const assistantEnabled = localStorage.getItem("assistant_enabled")
    if (assistantEnabled !== null) {
      setIsAssistantEnabled(assistantEnabled === "true")
    }
    const storedHistory = localStorage.getItem("assistant_history")
    if (storedHistory) {
      try {
        setAssistantHistory(JSON.parse(storedHistory))
      } catch (e) {
        console.error("Erro ao carregar histórico de conversas:", e)
      }
    }
  }, [])

  // Salvar a chave da API no localStorage quando ela mudar
  const setApiKey = (key: string | null) => {
    setApiKeyState(key)
    if (key) {
      localStorage.setItem("openai_api_key", key)
    } else {
      localStorage.removeItem("openai_api_key")
    }
  }

  // Salvar o estado de ativação do assistente
  useEffect(() => {
    localStorage.setItem("assistant_enabled", isAssistantEnabled.toString())
  }, [isAssistantEnabled])

  // Salvar o histórico de conversas no localStorage
  useEffect(() => {
    localStorage.setItem("assistant_history", JSON.stringify(assistantHistory))
  }, [assistantHistory])

  const toggleAssistant = () => {
    setIsAssistantEnabled((prev) => !prev)
  }

  const addToHistory = (query: string) => {
    setAssistantHistory((prev) => {
      // Limitar o histórico a 20 itens
      const newHistory = [query, ...prev]
      if (newHistory.length > 20) {
        return newHistory.slice(0, 20)
      }
      return newHistory
    })
  }

  const clearHistory = () => {
    setAssistantHistory([])
  }

  return (
    <AIContext.Provider
      value={{
        apiKey,
        setApiKey,
        isAssistantEnabled,
        toggleAssistant,
        assistantHistory,
        addToHistory,
        clearHistory,
      }}
    >
      {children}
    </AIContext.Provider>
  )
}

export const useAI = () => {
  const context = useContext(AIContext)

  if (context === undefined) throw new Error("useAI must be used within a AIContextProvider")

  return context
}

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface LocalAIContextType {
  isAssistantEnabled: boolean
  toggleAssistant: () => void
  conversationHistory: string[]
  addToHistory: (query: string) => void
  clearHistory: () => void
}

const LocalAIContext = createContext<LocalAIContextType | undefined>(undefined)

export function LocalAIProvider({ children }: { children: ReactNode }) {
  const [isAssistantEnabled, setIsAssistantEnabled] = useState(true)
  const [conversationHistory, setConversationHistory] = useState<string[]>([])

  // Carregar preferências do usuário do localStorage
  useEffect(() => {
    const storedPreference = localStorage.getItem("assistantEnabled")
    if (storedPreference !== null) {
      setIsAssistantEnabled(storedPreference === "true")
    }

    const storedHistory = localStorage.getItem("conversationHistory")
    if (storedHistory) {
      try {
        setConversationHistory(JSON.parse(storedHistory))
      } catch (e) {
        console.error("Erro ao carregar histórico de conversas:", e)
      }
    }
  }, [])

  // Salvar preferências no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem("assistantEnabled", isAssistantEnabled.toString())
  }, [isAssistantEnabled])

  // Salvar histórico no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("conversationHistory", JSON.stringify(conversationHistory))
  }, [conversationHistory])

  const toggleAssistant = () => {
    setIsAssistantEnabled((prev) => !prev)
  }

  const addToHistory = (query: string) => {
    setConversationHistory((prev) => {
      // Limitar o histórico a 20 itens
      const newHistory = [query, ...prev]
      if (newHistory.length > 20) {
        return newHistory.slice(0, 20)
      }
      return newHistory
    })
  }

  const clearHistory = () => {
    setConversationHistory([])
  }

  return (
    <LocalAIContext.Provider
      value={{
        isAssistantEnabled,
        toggleAssistant,
        conversationHistory,
        addToHistory,
        clearHistory,
      }}
    >
      {children}
    </LocalAIContext.Provider>
  )
}

export function useLocalAI() {
  const context = useContext(LocalAIContext)
  if (context === undefined) {
    throw new Error("useLocalAI deve ser usado dentro de um LocalAIProvider")
  }
  return context
}

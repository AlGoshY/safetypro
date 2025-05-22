"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AIContextType {
  apiKey: string | null
  setApiKey: (key: string | null) => void
  isAssistantEnabled: boolean
  setIsAssistantEnabled: (enabled: boolean) => void
  isApiKeyConfigured: boolean
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export function AIContextProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null)
  const [isAssistantEnabled, setIsAssistantEnabled] = useState<boolean>(true)

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

  return (
    <AIContext.Provider
      value={{
        apiKey,
        setApiKey,
        isAssistantEnabled,
        setIsAssistantEnabled,
        isApiKeyConfigured: !!apiKey,
      }}
    >
      {children}
    </AIContext.Provider>
  )
}

export function useAI() {
  const context = useContext(AIContext)
  if (context === undefined) {
    throw new Error("useAI deve ser usado dentro de um AIContextProvider")
  }
  return context
}

"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Bot,
  X,
  Send,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  MessageSquare,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { generateResponse, submitFeedback, getSuggestions } from "@/lib/ai/local-ai-service"
import type { KnowledgeItem } from "@/lib/ai/knowledge-base"

// Tipos para as mensagens
type MessageRole = "user" | "assistant" | "system"

interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  feedback?: "positive" | "negative"
  relatedTopics?: KnowledgeItem[]
  suggestions?: string[]
}

export function LocalAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string | undefined>()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Sou o assistente virtual do SST. Como posso ajudar você hoje?",
      timestamp: new Date(),
      suggestions: getSuggestions(),
    },
  ])
  const [input, setInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [conversationHistory, setConversationHistory] = useState<Message[]>([])
  const [suggestionsList, setSuggestionsList] = useState<string[]>([])

  useEffect(() => {
    setSuggestionsList(getSuggestions())
  }, [])

  // Rolar para a mensagem mais recente
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Função para enviar mensagem
  const sendMessage = useCallback(async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setConversationHistory((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)
    setShowSuggestions(false)

    try {
      // Simular um pequeno atraso para parecer mais natural
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

      // Gerar resposta usando o serviço de IA local
      const response = await generateResponse(input, currentCategory)

      // Atualizar a categoria atual se a resposta tiver alta confiança
      if (response.confidence > 0.7 && response.suggestions?.length) {
        const firstSuggestion = response.suggestions[0]
        const matchingItem = response.relatedTopics?.find((topic) => topic.question === firstSuggestion)
        if (matchingItem) {
          setCurrentCategory(matchingItem.category)
        }
      }

      // Adicionar a resposta do assistente
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response.text,
        timestamp: new Date(),
        relatedTopics: response.relatedTopics,
        suggestions: response.suggestions,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setConversationHistory((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Erro ao gerar resposta:", error)

      toast({
        title: "Erro ao processar sua pergunta",
        description: "Não foi possível gerar uma resposta. Por favor, tente novamente.",
        variant: "destructive",
      })

      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Desculpe, tive um problema ao processar sua pergunta. Poderia tentar novamente?",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
      setConversationHistory((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }, [input, currentCategory, toast])

  // Função para usar uma sugestão rápida
  const useSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  // Função para usar um tópico relacionado
  const useRelatedTopic = (topic: KnowledgeItem) => {
    setInput(topic.question)
  }

  // Função para dar feedback em uma mensagem
  const giveFeedback = (messageId: string, feedback: "positive" | "negative") => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)))

    // Enviar feedback para o serviço de IA
    submitFeedback({
      messageId,
      isHelpful: feedback === "positive",
    })

    toast({
      title: feedback === "positive" ? "Feedback positivo enviado" : "Feedback negativo enviado",
      description: "Obrigado por nos ajudar a melhorar o assistente!",
    })
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  // Função para lidar com tecla Enter (enviar mensagem)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Função para limpar o histórico de conversa
  const clearConversation = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Olá! Sou o assistente virtual do SST. Como posso ajudar você hoje?",
        timestamp: new Date(),
        suggestions: getSuggestions(),
      },
    ])
    setShowSuggestions(true)
    setCurrentCategory(undefined)
    setConversationHistory([])
  }

  // Renderizar o botão flutuante quando fechado
  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg border border-blue-400/20"
                style={{
                  boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.5), 0 8px 10px -6px rgba(37, 99, 235, 0.5)",
                }}
              >
                <Bot className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Assistente Virtual SST</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    )
  }

  // Renderizar o assistente quando aberto
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        className={`fixed ${
          isExpanded ? "inset-4 md:inset-10" : "bottom-6 right-6 w-96 h-[32rem]"
        } z-50 flex flex-col bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300`}
        style={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-white/20 rounded-full blur-sm"></div>
              <Avatar className="h-9 w-9 bg-white/10 border border-white/20 relative">
                <AvatarImage src="/sst-logo-white.png" alt="SST Assistant" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="font-semibold text-white">Assistente SST</h3>
              <p className="text-xs text-blue-100 opacity-90">Assistente Inteligente</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white hover:bg-white/20 rounded-full h-8 w-8"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none shadow-md"
                      : "bg-white border border-gray-100 shadow-sm rounded-tl-none"
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div className="mt-1 flex justify-between items-center">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>

                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => giveFeedback(message.id, "positive")}
                          className={`h-6 w-6 rounded-full ${
                            message.feedback === "positive" ? "text-green-500 bg-green-50" : "text-gray-400"
                          } hover:text-green-500 hover:bg-green-50`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => giveFeedback(message.id, "negative")}
                          className={`h-6 w-6 rounded-full ${
                            message.feedback === "negative" ? "text-red-500 bg-red-50" : "text-gray-400"
                          } hover:text-red-500 hover:bg-red-50`}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tópicos relacionados */}
              {message.role === "assistant" && message.relatedTopics && message.relatedTopics.length > 0 && (
                <div className="mt-2 ml-2">
                  <p className="text-xs text-gray-500 mb-1">Tópicos relacionados:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.relatedTopics.map((topic, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer bg-white hover:bg-blue-50 transition-colors flex items-center gap-1 shadow-sm border-gray-200"
                        onClick={() => useRelatedTopic(topic)}
                      >
                        <HelpCircle className="h-3 w-3" />
                        {topic.question}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Sugestões */}
              {message.role === "assistant" &&
                message.suggestions &&
                message.suggestions.length > 0 &&
                message.id === messages[messages.length - 1].id && (
                  <div className="mt-2 ml-2">
                    <p className="text-xs text-gray-500 mb-1">Sugestões:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer bg-white hover:bg-blue-50 transition-colors flex items-center gap-1 shadow-sm border-gray-200"
                          onClick={() => useSuggestion(suggestion)}
                        >
                          <MessageSquare className="h-3 w-3" />
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ))}

          {isTyping && (
            <div className="mb-4 flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-100 shadow-sm rounded-tl-none">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div
                      className="h-2 w-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">Digitando...</span>
                </div>
              </div>
            </div>
          )}

          {/* Sugestões rápidas iniciais */}
          {showSuggestions && messages.length < 3 && (
            <div className="mt-4 mb-2">
              <p className="text-xs text-gray-500 mb-2">Pergunte sobre:</p>
              <div className="flex flex-wrap gap-2">
                {suggestionsList.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer bg-white hover:bg-blue-50 transition-colors"
                    onClick={() => useSuggestion(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Controles */}
        <Card className="border-t rounded-none bg-white shadow-lg">
          <form onSubmit={handleSubmit} className="p-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua pergunta..."
                  className="min-h-[60px] resize-none pr-10 border-gray-200 focus:border-blue-300 rounded-lg"
                />
                {input.trim() && (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isTyping}
                    className="absolute right-2 bottom-2 rounded-full bg-blue-600 hover:bg-blue-700 h-7 w-7"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="rounded-full border-gray-200 hover:bg-gray-100"
              >
                {showSuggestions ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex justify-between items-center mt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearConversation}
                disabled={conversationHistory.length === 0}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Limpar conversa
              </Button>
              <p className="text-xs text-gray-400">Assistente interno do sistema SST</p>
            </div>
          </form>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

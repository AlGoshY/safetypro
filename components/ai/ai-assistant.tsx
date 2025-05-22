"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  X,
  Send,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Bot,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Tipos para as mensagens
type MessageRole = "user" | "assistant" | "system"

interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  feedback?: "positive" | "negative"
}

// Sugestões rápidas para o usuário
const quickSuggestions = [
  "Como faço para cadastrar uma nova atividade?",
  "Quais são as etapas para realizar uma inspeção?",
  "Como gerar um relatório de acompanhamento?",
  "Quais são as melhores práticas de segurança?",
  "Como configurar permissões de usuários?",
]

// Contexto do sistema para o assistente
const systemContext = `
Você é o Assistente Virtual do sistema SST (Saúde e Segurança do Trabalho).
Seu objetivo é ajudar os usuários com dúvidas sobre o sistema, processos de segurança e saúde ocupacional.

Informações sobre o sistema SST:
- O sistema gerencia atividades de segurança e saúde do trabalho
- Possui módulos de Inspeção, Rota de Inspeção, Visita Técnica, Reuniões, Auditoria e Comunique
- Permite cadastro de usuários, empresas, setores, cargos e áreas
- Gera relatórios e acompanhamentos de atividades de segurança

Ao responder:
- Seja conciso e direto
- Forneça instruções passo a passo quando necessário
- Sugira recursos ou módulos relevantes do sistema
- Mantenha um tom profissional e amigável
`

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [apiKeyError, setApiKeyError] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Sou o assistente virtual do SST. Como posso ajudar você hoje?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

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
    setInput("")
    setIsTyping(true)
    setShowSuggestions(false)

    try {
      // Preparar o histórico de mensagens para a API
      const messageHistory = messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))

      // Adicionar a mensagem do sistema no início
      messageHistory.unshift({
        role: "system" as MessageRole,
        content: systemContext,
      })

      // Adicionar a mensagem do usuário
      messageHistory.push({
        role: "user" as MessageRole,
        content: input,
      })

      // Simular resposta para desenvolvimento (remover em produção)
      // Em um ambiente real, você usaria a API da OpenAI
      setTimeout(() => {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Esta é uma resposta simulada enquanto a API da OpenAI não está configurada. Para configurar a API, adicione a chave de API nas configurações do assistente.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        setIsTyping(false)
      }, 1500)

      // Comentado até que a API seja configurada
      /*
      // Gerar resposta usando a AI SDK
      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        messages: messageHistory,
      })

      // Adicionar a resposta do assistente
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: text,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      */
    } catch (error) {
      console.error("Erro ao gerar resposta:", error)

      // Verificar se é um erro de API key
      if (error.toString().includes("API key")) {
        setApiKeyError(true)
        toast({
          title: "Erro de configuração",
          description: "A chave da API OpenAI não está configurada.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Erro ao processar sua pergunta",
          description: "Não foi possível obter uma resposta. Tente novamente mais tarde.",
          variant: "destructive",
        })
      }

      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Desculpe, tive um problema ao processar sua pergunta. Poderia tentar novamente?",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }, [input, messages, setMessages, setIsTyping, setShowSuggestions, toast])

  // Função para usar uma sugestão rápida
  const useSuggestion = useCallback(
    (suggestion: string) => {
      setInput(suggestion)
    },
    [setInput],
  )

  // Função para dar feedback em uma mensagem
  const giveFeedback = useCallback(
    (messageId: string, feedback: "positive" | "negative") => {
      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)))

      toast({
        title: feedback === "positive" ? "Feedback positivo enviado" : "Feedback negativo enviado",
        description: "Obrigado por nos ajudar a melhorar o assistente!",
      })
    },
    [setMessages, toast],
  )

  // Função para copiar o conteúdo de uma mensagem
  const copyMessageContent = useCallback(
    (messageId: string, content: string) => {
      navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)

      setTimeout(() => {
        setCopiedMessageId(null)
      }, 2000)

      toast({
        title: "Conteúdo copiado",
        description: "O texto foi copiado para a área de transferência.",
      })
    },
    [toast],
  )

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
      },
    ])
    setShowSuggestions(true)
    setApiKeyError(false)
  }

  // Renderizar o botão flutuante quando fechado
  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                <Bot className="h-6 w-6 text-white" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-gray-800 text-white border-gray-700">
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
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed ${
          isExpanded ? "inset-4 md:inset-10" : "bottom-6 right-6 w-96 h-[32rem]"
        } z-50 flex flex-col bg-white/95 backdrop-blur-md rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden transition-all duration-300`}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-700 to-blue-600 text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 bg-white/20 ring-2 ring-white/30 shadow-inner">
                <AvatarImage src="/sst-logo-white.png" alt="SST Assistant" />
                <AvatarFallback className="bg-blue-700 text-white">AI</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-blue-700"></span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Assistente SST</h3>
              <p className="text-xs text-blue-100">Assistente Inteligente</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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

        {/* Alerta de erro de API */}
        {apiKeyError && (
          <Alert variant="destructive" className="m-2 py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro de configuração</AlertTitle>
            <AlertDescription>
              A chave da API OpenAI não está configurada. Por favor, adicione a variável de ambiente OPENAI_API_KEY.
            </AlertDescription>
          </Alert>
        )}

        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message) => (
            <div key={message.id} className="mb-5 group">
              <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mr-2 mt-1 hidden sm:flex">
                    <AvatarImage src="/sst-logo-new.png" alt="SST Assistant" />
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">SST</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none shadow-md"
                      : "bg-white border border-gray-100 shadow-sm rounded-tl-none"
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>

                    <div className="flex items-center gap-1">
                      {message.role === "assistant" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyMessageContent(message.id, message.content)}
                            className={`h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                              copiedMessageId === message.id ? "text-green-500 bg-green-50" : "text-gray-400"
                            } hover:text-blue-500 hover:bg-blue-50`}
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => giveFeedback(message.id, "positive")}
                            className={`h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                              message.feedback === "positive" ? "text-green-500 bg-green-50" : "text-gray-400"
                            } hover:text-green-500 hover:bg-green-50`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => giveFeedback(message.id, "negative")}
                            className={`h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                              message.feedback === "negative" ? "text-red-500 bg-red-50" : "text-gray-400"
                            } hover:text-red-500 hover:bg-red-50`}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 ml-2 mt-1 hidden sm:flex">
                    <AvatarFallback className="bg-blue-600 text-white text-xs">EU</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="mb-5 flex justify-start">
              <Avatar className="h-8 w-8 mr-2 mt-1 hidden sm:flex">
                <AvatarImage src="/sst-logo-new.png" alt="SST Assistant" />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">SST</AvatarFallback>
              </Avatar>
              <div className="max-w-[85%] rounded-2xl p-4 bg-white border border-gray-100 shadow-sm rounded-tl-none">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">Digitando...</span>
                </div>
              </div>
            </div>
          )}

          {/* Sugestões rápidas */}
          {showSuggestions && messages.length < 3 && (
            <div className="mt-4 mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Pergunte sobre:</p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => {
                  const handleSuggestionClick = useCallback(() => {
                    useSuggestion(suggestion)
                  }, [suggestion, useSuggestion])

                  return (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer bg-white hover:bg-blue-50 transition-colors py-1.5 px-3 shadow-sm border-gray-200"
                      onClick={handleSuggestionClick}
                    >
                      {suggestion}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Controles */}
        <Card className="border-t rounded-none shadow-none">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua pergunta..."
                  className="min-h-[60px] resize-none pr-12 rounded-xl border-gray-200 focus:border-blue-300 shadow-sm"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 bottom-2 rounded-full bg-blue-600 hover:bg-blue-700 h-8 w-8 shadow-sm transition-colors duration-200"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="px-4 py-2 flex justify-between items-center border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearConversation}
                className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex items-center gap-1 h-7 px-2"
              >
                <RefreshCw className="h-3 w-3" />
                Limpar conversa
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex items-center gap-1 h-7 px-2"
              >
                {showSuggestions ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                {showSuggestions ? "Ocultar sugestões" : "Mostrar sugestões"}
              </Button>
            </div>
            <p className="text-xs text-gray-400">Assistente SST v1.2</p>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

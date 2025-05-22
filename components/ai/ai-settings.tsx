"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Bot, Key, Save, Trash, AlertTriangle, Info, Shield } from "lucide-react"
import { useAI } from "./ai-context-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AISettings() {
  const { isAssistantEnabled, toggleAssistant, assistantHistory, clearHistory } = useAI()
  const [apiKey, setApiKey] = useState("")
  const [savedApiKey, setSavedApiKey] = useState("")
  const [isApiKeySet, setIsApiKeySet] = useState(false)
  const { toast } = useToast()

  // Verificar se a chave da API está armazenada
  useEffect(() => {
    const storedKey = localStorage.getItem("openai_api_key")
    if (storedKey) {
      setIsApiKeySet(true)
      setSavedApiKey(storedKey)
      // Mascarar a chave para exibição
      setApiKey("•".repeat(storedKey.length))
    }
  }, [])

  const saveApiKey = () => {
    if (apiKey && apiKey !== "•".repeat(apiKey.length)) {
      localStorage.setItem("openai_api_key", apiKey)
      setIsApiKeySet(true)
      setSavedApiKey(apiKey)
      // Mascarar a chave para exibição
      setApiKey("•".repeat(apiKey.length))

      toast({
        title: "Chave da API salva",
        description: "A chave da API OpenAI foi salva com sucesso.",
      })
    } else {
      toast({
        title: "Chave da API inválida",
        description: "Por favor, insira uma chave de API válida.",
        variant: "destructive",
      })
    }
  }

  const removeApiKey = () => {
    localStorage.removeItem("openai_api_key")
    setApiKey("")
    setIsApiKeySet(false)
    setSavedApiKey("")

    toast({
      title: "Chave da API removida",
      description: "A chave da API OpenAI foi removida com sucesso.",
    })
  }

  const handleClearHistory = () => {
    clearHistory()
    toast({
      title: "Histórico limpo",
      description: "O histórico de conversas foi limpo com sucesso.",
    })
  }

  return (
    <Tabs defaultValue="geral" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="geral">Configurações Gerais</TabsTrigger>
        <TabsTrigger value="api">Configuração da API</TabsTrigger>
        <TabsTrigger value="historico">Histórico de Conversas</TabsTrigger>
      </TabsList>

      <TabsContent value="geral">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-500" />
              Configurações Gerais do Assistente
            </CardTitle>
            <CardDescription>Configure as preferências gerais do assistente virtual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-y-1">
              <div>
                <Label htmlFor="assistantEnabled" className="text-base">
                  Ativar Assistente Virtual
                </Label>
                <p className="text-sm text-gray-500">
                  Quando ativado, o assistente estará disponível em todas as páginas do sistema
                </p>
              </div>
              <Switch id="assistantEnabled" checked={isAssistantEnabled} onCheckedChange={toggleAssistant} />
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Informação</AlertTitle>
              <AlertDescription>
                O assistente virtual utiliza inteligência artificial para responder perguntas sobre o sistema SST. As
                respostas são geradas automaticamente e podem não ser 100% precisas.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="api">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-500" />
              Configuração da API OpenAI
            </CardTitle>
            <CardDescription>Configure a chave da API OpenAI para habilitar o assistente virtual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isApiKeySet && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Chave da API não configurada</AlertTitle>
                <AlertDescription>
                  O assistente virtual não funcionará corretamente sem uma chave de API válida.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="apiKey">Chave da API OpenAI</Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type="password"
                  placeholder={isApiKeySet ? "••••••••••••••••••••••••••" : "sk-..."}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono"
                />
                <Button onClick={saveApiKey} className="whitespace-nowrap">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Chave
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                A chave da API é armazenada localmente no seu navegador e não é compartilhada.
              </p>
            </div>

            {isApiKeySet && (
              <div className="pt-4">
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <Info className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-700">Chave da API configurada</AlertTitle>
                  <AlertDescription className="text-green-600">
                    O assistente virtual está configurado e pronto para uso.
                  </AlertDescription>
                </Alert>

                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={removeApiKey}
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Remover Chave da API
                  </Button>
                </div>
              </div>
            )}

            <Alert className="mt-6">
              <Shield className="h-4 w-4" />
              <AlertTitle>Segurança</AlertTitle>
              <AlertDescription>
                Sua chave da API é armazenada apenas no seu dispositivo. Recomendamos configurar restrições de uso na
                plataforma OpenAI.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <p className="text-xs text-gray-500">
              Não tem uma chave da API?{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Obtenha uma aqui
              </a>
            </p>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="historico">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Conversas</CardTitle>
            <CardDescription>Visualize e gerencie o histórico de conversas com o assistente</CardDescription>
          </CardHeader>
          <CardContent>
            {assistantHistory.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Perguntas recentes:</p>
                <ul className="space-y-1">
                  {assistantHistory.map((query, index) => (
                    <li key={index} className="text-sm p-2 bg-gray-50 rounded-md">
                      {query}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhuma conversa registrada.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleClearHistory} disabled={assistantHistory.length === 0}>
              <Trash className="h-4 w-4 mr-2" />
              Limpar Histórico
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Bot, Trash2, RefreshCw, Database } from "lucide-react"
import { useLocalAI } from "./local-ai-context"
import { useToast } from "@/hooks/use-toast"

export function LocalAISettings() {
  const { isAssistantEnabled, toggleAssistant, conversationHistory, clearHistory } = useLocalAI()
  const { toast } = useToast()
  const [isResetting, setIsResetting] = useState(false)

  const handleClearHistory = () => {
    clearHistory()
    toast({
      title: "Histórico limpo",
      description: "O histórico de conversas com o assistente foi apagado.",
    })
  }

  const handleResetAssistant = () => {
    setIsResetting(true)

    // Simulação de reset do assistente
    setTimeout(() => {
      clearHistory()
      setIsResetting(false)
      toast({
        title: "Assistente reiniciado",
        description: "O assistente foi reiniciado com sucesso.",
      })
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-500" />
          Configurações do Assistente Virtual
        </CardTitle>
        <CardDescription>Personalize como o assistente virtual funciona no sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="assistantEnabled">Ativar Assistente Virtual</Label>
              <p className="text-sm text-gray-500">
                Quando ativado, o assistente estará disponível para ajudar em todas as telas
              </p>
            </div>
            <Switch id="assistantEnabled" checked={isAssistantEnabled} onCheckedChange={toggleAssistant} />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Histórico de Conversas</Label>
            <p className="text-sm text-gray-500">
              {conversationHistory.length === 0
                ? "Nenhuma conversa registrada com o assistente."
                : `${conversationHistory.length} ${
                    conversationHistory.length === 1 ? "conversa registrada" : "conversas registradas"
                  } com o assistente.`}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              disabled={conversationHistory.length === 0}
              className="mt-2"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar histórico
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Reiniciar Assistente</Label>
            <p className="text-sm text-gray-500">
              Reinicie o assistente caso ele esteja apresentando comportamento inesperado
            </p>
            <Button variant="outline" size="sm" onClick={handleResetAssistant} disabled={isResetting} className="mt-2">
              {isResetting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Reiniciando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reiniciar assistente
                </>
              )}
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Informações do Sistema</Label>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Base de Conhecimento Local</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Este assistente utiliza uma base de conhecimento local com informações sobre o sistema SST. Todas as
                    respostas são geradas localmente, sem necessidade de conexão com APIs externas.
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Tópicos:</span> 40+
                    </div>
                    <div>
                      <span className="font-medium">Categorias:</span> 10
                    </div>
                    <div>
                      <span className="font-medium">Palavras-chave:</span> 200+
                    </div>
                    <div>
                      <span className="font-medium">Última atualização:</span> 10/05/2023
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Configurações Avançadas</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="text-sm font-medium">Sugestões automáticas</p>
                  <p className="text-xs text-gray-500">Mostrar sugestões baseadas no contexto</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="text-sm font-medium">Notificações do assistente</p>
                  <p className="text-xs text-gray-500">Receber dicas e lembretes</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="text-sm font-medium">Histórico persistente</p>
                  <p className="text-xs text-gray-500">Manter histórico entre sessões</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="text-sm font-medium">Modo de aprendizado</p>
                  <p className="text-xs text-gray-500">Melhorar com base nas interações</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

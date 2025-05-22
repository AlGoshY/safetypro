"use client"

import type React from "react"
import type { Pergunta, TipoPergunta } from "@/types/pesquisa-satisfacao"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface EditorPerguntaProps {
  pergunta: Pergunta
  onChange: (pergunta: Partial<Pergunta>) => void
}

export function EditorPergunta({ pergunta, onChange }: EditorPerguntaProps) {
  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novoTipo = e.target.value as TipoPergunta

    // Se mudar para um tipo que não usa opções, limpar as opções existentes
    if (novoTipo === "texto" || novoTipo === "escala") {
      onChange({ tipo: novoTipo, opcoes: undefined })
    } else if (!pergunta.opcoes || pergunta.opcoes.length === 0) {
      // Se mudar para um tipo que usa opções e não tiver opções, criar opções padrão
      onChange({
        tipo: novoTipo,
        opcoes: [
          { id: uuidv4(), texto: "Opção 1" },
          { id: uuidv4(), texto: "Opção 2" },
        ],
      })
    } else {
      onChange({ tipo: novoTipo })
    }
  }

  const adicionarOpcao = () => {
    const novasOpcoes = [
      ...(pergunta.opcoes || []),
      { id: uuidv4(), texto: `Opção ${(pergunta.opcoes?.length || 0) + 1}` },
    ]
    onChange({ opcoes: novasOpcoes })
  }

  const removerOpcao = (id: string) => {
    const novasOpcoes = pergunta.opcoes?.filter((o) => o.id !== id)
    onChange({ opcoes: novasOpcoes })
  }

  const atualizarOpcao = (id: string, texto: string) => {
    const novasOpcoes = pergunta.opcoes?.map((o) => (o.id === id ? { ...o, texto } : o))
    onChange({ opcoes: novasOpcoes })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`pergunta-${pergunta.id}`}>Texto da Pergunta</Label>
        <Input
          id={`pergunta-${pergunta.id}`}
          value={pergunta.texto}
          onChange={(e) => onChange({ texto: e.target.value })}
          placeholder="Digite a pergunta"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`tipo-${pergunta.id}`}>Tipo de Pergunta</Label>
          <select
            id={`tipo-${pergunta.id}`}
            value={pergunta.tipo}
            onChange={handleTipoChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 h-10"
          >
            <option value="escala">Escala (1-5)</option>
            <option value="multipla_escolha">Múltipla Escolha (uma resposta)</option>
            <option value="checkbox">Checkbox (múltiplas respostas)</option>
            <option value="texto">Texto Livre</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 pt-8">
          <Switch
            id={`obrigatoria-${pergunta.id}`}
            checked={pergunta.obrigatoria}
            onCheckedChange={(checked) => onChange({ obrigatoria: checked })}
          />
          <Label htmlFor={`obrigatoria-${pergunta.id}`}>Pergunta Obrigatória</Label>
        </div>
      </div>

      {(pergunta.tipo === "multipla_escolha" || pergunta.tipo === "checkbox") && (
        <div className="space-y-3 pt-2">
          <Label>Opções de Resposta</Label>

          {pergunta.opcoes?.map((opcao) => (
            <div key={opcao.id} className="flex items-center space-x-2">
              <Input
                value={opcao.texto}
                onChange={(e) => atualizarOpcao(opcao.id, e.target.value)}
                placeholder="Texto da opção"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removerOpcao(opcao.id)}
                disabled={pergunta.opcoes?.length === 1}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}

          <Button type="button" variant="outline" size="sm" onClick={adicionarOpcao} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Opção
          </Button>
        </div>
      )}

      {pergunta.tipo === "escala" && (
        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Visualização da Escala</p>
          <div className="flex justify-between items-center">
            <span className="flex flex-col items-center">
              <span className="text-xl">😡</span>
              <span className="text-sm">1</span>
            </span>
            <span className="flex flex-col items-center">
              <span className="text-xl">😕</span>
              <span className="text-sm">2</span>
            </span>
            <span className="flex flex-col items-center">
              <span className="text-xl">😐</span>
              <span className="text-sm">3</span>
            </span>
            <span className="flex flex-col items-center">
              <span className="text-xl">🙂</span>
              <span className="text-sm">4</span>
            </span>
            <span className="flex flex-col items-center">
              <span className="text-xl">😄</span>
              <span className="text-sm">5</span>
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">Muito Insatisfeito</span>
            <span className="text-xs text-muted-foreground">Muito Satisfeito</span>
          </div>
        </div>
      )}
    </div>
  )
}

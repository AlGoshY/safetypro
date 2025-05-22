"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type FrequenciaReuniao =
  | "Diária"
  | "Semanal"
  | "Quinzenal"
  | "Mensal"
  | "Bimestral"
  | "Trimestral"
  | "Semestral"
  | "Anual"
  | "Sob demanda"

interface TipoReuniao {
  id: string
  codigo: string
  nome: string
  descricao: string
  ativo: boolean
  frequencias: FrequenciaReuniao[]
}

interface EditarTipoReuniaoModalProps {
  tipo: TipoReuniao
  onSave: (tipoAtualizado: Omit<TipoReuniao, "id">) => void
  onCancel: () => void
}

export function EditarTipoReuniaoModal({ tipo, onSave, onCancel }: EditarTipoReuniaoModalProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(true)
  const [tipoEditado, setTipoEditado] = useState<Omit<TipoReuniao, "id">>({
    codigo: tipo.codigo,
    nome: tipo.nome,
    descricao: tipo.descricao,
    ativo: tipo.ativo,
    frequencias: [...tipo.frequencias],
  })

  const frequenciasDisponiveis: FrequenciaReuniao[] = [
    "Diária",
    "Semanal",
    "Quinzenal",
    "Mensal",
    "Bimestral",
    "Trimestral",
    "Semestral",
    "Anual",
    "Sob demanda",
  ]

  // Fechar o modal e cancelar a edição
  useEffect(() => {
    if (!open) {
      onCancel()
    }
  }, [open, onCancel])

  const handleToggleFrequencia = (frequencia: FrequenciaReuniao) => {
    if (tipoEditado.frequencias.includes(frequencia)) {
      setTipoEditado({
        ...tipoEditado,
        frequencias: tipoEditado.frequencias.filter((f) => f !== frequencia),
      })
    } else {
      setTipoEditado({
        ...tipoEditado,
        frequencias: [...tipoEditado.frequencias, frequencia],
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!tipoEditado.codigo.trim() || !tipoEditado.nome.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Código e Nome são campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    if (tipoEditado.frequencias.length === 0) {
      toast({
        title: "Frequência obrigatória",
        description: "Selecione pelo menos uma frequência possível.",
        variant: "destructive",
      })
      return
    }

    // Salvar as alterações
    onSave(tipoEditado)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Tipo de Reunião</DialogTitle>
            <DialogDescription>Modifique os campos abaixo para atualizar o tipo de reunião.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo" className="text-right">
                  Código *
                </Label>
                <Input
                  id="codigo"
                  placeholder="Ex: CIPA, SEG"
                  value={tipoEditado.codigo}
                  onChange={(e) => setTipoEditado({ ...tipoEditado, codigo: e.target.value })}
                  maxLength={10}
                  required
                />
                <p className="text-xs text-gray-500">Máximo 10 caracteres</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome" className="text-right">
                  Nome *
                </Label>
                <Input
                  id="nome"
                  placeholder="Nome do tipo de reunião"
                  value={tipoEditado.nome}
                  onChange={(e) => setTipoEditado({ ...tipoEditado, nome: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-right">
                Descrição
              </Label>
              <Input
                id="descricao"
                placeholder="Descrição detalhada do tipo de reunião"
                value={tipoEditado.descricao}
                onChange={(e) => setTipoEditado({ ...tipoEditado, descricao: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-right">Frequências Possíveis *</Label>
              <div className="border rounded-md p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {frequenciasDisponiveis.map((frequencia) => (
                  <div key={frequencia} className="flex items-center space-x-2">
                    <Checkbox
                      id={`freq-edit-${frequencia}`}
                      checked={tipoEditado.frequencias.includes(frequencia)}
                      onCheckedChange={() => handleToggleFrequencia(frequencia)}
                    />
                    <Label htmlFor={`freq-edit-${frequencia}`} className="cursor-pointer">
                      {frequencia}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="ativo-edit"
                checked={tipoEditado.ativo}
                onCheckedChange={(checked) => setTipoEditado({ ...tipoEditado, ativo: checked === true })}
              />
              <Label htmlFor="ativo-edit" className="cursor-pointer">
                Ativo
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#0f2167] hover:bg-[#1e3a8a]">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

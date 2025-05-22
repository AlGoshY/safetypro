"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface NovoTipoReuniaoProps {
  onSave: (novoTipo: {
    codigo: string
    nome: string
    descricao: string
    ativo: boolean
    frequencias: FrequenciaReuniao[]
  }) => void
}

export function NovoTipoReuniaoModal({ onSave }: NovoTipoReuniaoProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [novoTipo, setNovoTipo] = useState({
    codigo: "",
    nome: "",
    descricao: "",
    ativo: true,
    frequencias: ["Mensal"] as FrequenciaReuniao[],
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

  const handleToggleFrequencia = (frequencia: FrequenciaReuniao) => {
    if (novoTipo.frequencias.includes(frequencia)) {
      setNovoTipo({
        ...novoTipo,
        frequencias: novoTipo.frequencias.filter((f) => f !== frequencia),
      })
    } else {
      setNovoTipo({
        ...novoTipo,
        frequencias: [...novoTipo.frequencias, frequencia],
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!novoTipo.codigo.trim() || !novoTipo.nome.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Código e Nome são campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    if (novoTipo.frequencias.length === 0) {
      toast({
        title: "Frequência obrigatória",
        description: "Selecione pelo menos uma frequência possível.",
        variant: "destructive",
      })
      return
    }

    // Salvar o novo tipo
    onSave(novoTipo)

    // Resetar o formulário e fechar o modal
    setNovoTipo({
      codigo: "",
      nome: "",
      descricao: "",
      ativo: true,
      frequencias: ["Mensal"],
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0f2167] hover:bg-[#1e3a8a]">
          <Plus className="mr-2 h-4 w-4" />
          <span>Novo Tipo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Novo Tipo de Reunião</DialogTitle>
            <DialogDescription>Preencha os campos abaixo para cadastrar um novo tipo de reunião.</DialogDescription>
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
                  value={novoTipo.codigo}
                  onChange={(e) => setNovoTipo({ ...novoTipo, codigo: e.target.value })}
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
                  value={novoTipo.nome}
                  onChange={(e) => setNovoTipo({ ...novoTipo, nome: e.target.value })}
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
                value={novoTipo.descricao}
                onChange={(e) => setNovoTipo({ ...novoTipo, descricao: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-right">Frequências Possíveis *</Label>
              <div className="border rounded-md p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {frequenciasDisponiveis.map((frequencia) => (
                  <div key={frequencia} className="flex items-center space-x-2">
                    <Checkbox
                      id={`freq-${frequencia}`}
                      checked={novoTipo.frequencias.includes(frequencia)}
                      onCheckedChange={() => handleToggleFrequencia(frequencia)}
                    />
                    <Label htmlFor={`freq-${frequencia}`} className="cursor-pointer">
                      {frequencia}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="ativo"
                checked={novoTipo.ativo}
                onCheckedChange={(checked) => setNovoTipo({ ...novoTipo, ativo: checked === true })}
              />
              <Label htmlFor="ativo" className="cursor-pointer">
                Ativo
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#0f2167] hover:bg-[#1e3a8a]">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

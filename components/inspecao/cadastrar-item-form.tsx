"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface CadastrarItemFormProps {
  onSave?: (data: {
    nome: string
    descricao: string
    ativo: boolean
  }) => void
  initialData?: {
    nome: string
    descricao: string
    ativo: boolean
  }
}

export function CadastrarItemForm({ onSave, initialData }: CadastrarItemFormProps) {
  const [nome, setNome] = useState(initialData?.nome || "")
  const [descricao, setDescricao] = useState(initialData?.descricao || "")
  const [ativo, setAtivo] = useState(initialData?.ativo || true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSave) {
      onSave({ nome, descricao, ativo })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="w-full">
          <Input
            placeholder="Item de verificação"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border-b border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Ativo?</span>
          <Switch checked={ativo} onCheckedChange={setAtivo} />
        </div>
      </div>

      <div>
        <Textarea
          placeholder="Como avaliar"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="min-h-[100px] border-b border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0"
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          SALVAR
        </Button>
      </div>
    </form>
  )
}

"use client"

import { useState, useEffect } from "react"
import { X, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface CadastrarItemModalProps {
  isOpen: boolean
  onClose: () => void
  editMode?: boolean
  itemData?: {
    id: string | number
    nome: string
    descricao: string
    status?: string
    ativo?: boolean
  }
  onSave: (item: any) => void
}

export function CadastrarItemModal({ isOpen, onClose, editMode = false, itemData, onSave }: CadastrarItemModalProps) {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [ativo, setAtivo] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (itemData) {
      setNome(itemData.nome || "")
      setDescricao(itemData.descricao || "")
      setAtivo(itemData.ativo !== undefined ? itemData.ativo : itemData.status === "ativo")
    } else {
      setNome("")
      setDescricao("")
      setAtivo(true)
    }
  }, [itemData, isOpen])

  if (!isOpen) return null

  const handleSalvar = () => {
    const item = {
      id: itemData?.id || null,
      nome,
      descricao,
      status: ativo ? "ativo" : "inativo",
      ativo,
    }

    onSave(item)

    // Exibir mensagem de sucesso
    toast({
      title: "Item salvo com sucesso!",
      description: `O item "${nome}" foi ${editMode ? "atualizado" : "cadastrado"} com sucesso.`,
      variant: "default",
      duration: 5000,
      className: "bg-green-50 border-green-200 text-green-800",
      action: (
        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="h-5 w-5 text-green-600" />
        </div>
      ),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in">
      <div className="bg-white w-full max-w-md flex flex-col rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 scale-100 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold tracking-tight">{editMode ? "Editar Item" : "Cadastrar Item"}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulário */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="w-full">
              <label htmlFor="item-nome" className="text-sm font-medium text-gray-700 mb-1 block">
                Item de verificação
              </label>
              <Input
                id="item-nome"
                placeholder="Digite o nome do item"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
              />
            </div>

            <div className="flex items-center space-x-3 whitespace-nowrap">
              <span className="text-sm font-medium text-gray-700">Ativo?</span>
              <Switch checked={ativo} onCheckedChange={setAtivo} className="data-[state=checked]:bg-blue-600" />
            </div>
          </div>

          <div>
            <label htmlFor="item-descricao" className="text-sm font-medium text-gray-700 mb-1 block">
              Como avaliar
            </label>
            <Textarea
              id="item-descricao"
              placeholder="Descreva como este item deve ser avaliado durante a inspeção"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md resize-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                CANCELAR
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors"
                onClick={handleSalvar}
                disabled={!nome.trim()}
              >
                SALVAR
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

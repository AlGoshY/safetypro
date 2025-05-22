"use client"

import type React from "react"

import { useState } from "react"
import { Save, AlertCircle, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ListagemAtividades from "./listagem-atividades"

// Tipos para os dados do formulário
interface AtividadeFormData {
  id?: number
  processo: string
  frequencia: string
  prioridade: string
  itemVerificacao: string
  comoAvaliar: string
  ativa: boolean
}

// Opções para os selects
const PROCESSOS = [
  { value: "processo1", label: "Processo 1" },
  { value: "processo2", label: "Processo 2" },
  { value: "maquina1", label: "Máquina 1" },
  { value: "equipamento1", label: "Equipamento 1" },
  { value: "Combinados", label: "Combinados" },
  { value: "Embalagem", label: "Embalagem" },
  { value: "Expedição", label: "Expedição" },
  { value: "Manutenção", label: "Manutenção" },
]

const FREQUENCIAS = [
  { value: "diaria", label: "Diária" },
  { value: "semanal", label: "Semanal" },
  { value: "quinzenal", label: "Quinzenal" },
  { value: "mensal", label: "Mensal" },
  { value: "trimestral", label: "Trimestral" },
  { value: "semestral", label: "Semestral" },
  { value: "anual", label: "Anual" },
]

const PRIORIDADES = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Média" },
  { value: "baixa", label: "Baixa" },
]

export default function CadastroAtividades() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("consulta")
  const [formData, setFormData] = useState<AtividadeFormData>({
    processo: "",
    frequencia: "",
    prioridade: "",
    itemVerificacao: "",
    comoAvaliar: "",
    ativa: true,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof AtividadeFormData, string>>>({})
  const [isEditing, setIsEditing] = useState(false)

  // Filtros
  const [filtros, setFiltros] = useState({
    processo: "all",
    atividade: "all",
    frequencia: "all",
    comoAvaliar: "",
  })
  const [searchTerm, setSearchTerm] = useState("")

  // Limpar todos os filtros
  const handleClearFilters = () => {
    setFiltros({
      processo: "all",
      atividade: "all",
      frequencia: "all",
      comoAvaliar: "",
    })
    setSearchTerm("")
  }

  // Função para validar o formulário
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AtividadeFormData, string>> = {}

    if (!formData.processo) newErrors.processo = "Processo/Máquina/Equipamento é obrigatório"
    if (!formData.frequencia) newErrors.frequencia = "Frequência é obrigatória"
    if (!formData.prioridade) newErrors.prioridade = "Prioridade é obrigatória"
    if (!formData.comoAvaliar) newErrors.comoAvaliar = "Como avaliar é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Função para lidar com a mudança nos campos
  const handleChange = (field: keyof AtividadeFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpa o erro do campo quando o usuário digita
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Exibe mensagem de sucesso
      toast({
        title: isEditing ? "Atividade atualizada com sucesso!" : "Atividade salva com sucesso!",
        description: isEditing ? "A atividade foi atualizada no sistema." : "A atividade foi cadastrada no sistema.",
        variant: "success",
      })

      // Limpa o formulário e volta para a consulta
      resetForm()
      setActiveTab("consulta")
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a atividade. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para editar uma atividade
  const handleEdit = (id: number) => {
    // Simulação de busca de dados
    // Em um cenário real, você buscaria os dados da API
    setFormData({
      id,
      processo: "Combinados",
      frequencia: "semanal",
      prioridade: "alta",
      itemVerificacao: "Item de verificação exemplo",
      comoAvaliar: "Os pisos dos setores possuem superfície antiderrapante?",
      ativa: true,
    })

    setIsEditing(true)
    setActiveTab("cadastro")
  }

  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      processo: "",
      frequencia: "",
      prioridade: "",
      itemVerificacao: "",
      comoAvaliar: "",
      ativa: true,
    })
    setIsEditing(false)
    setErrors({})
  }

  // Função para criar nova atividade
  const handleNovaAtividade = () => {
    resetForm()
    setActiveTab("cadastro")
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="consulta">Consulta</TabsTrigger>
          <TabsTrigger value="cadastro">{isEditing ? "Editar" : "Cadastro"}</TabsTrigger>
        </TabsList>

        {activeTab === "consulta" && (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleNovaAtividade}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Atividade
          </Button>
        )}
      </div>

      <TabsContent value="consulta" className="mt-0">
        <ListagemAtividades onEdit={handleEdit} />
      </TabsContent>

      <TabsContent value="cadastro" className="mt-0">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h1 className="text-xl font-semibold mb-6">
                {isEditing ? "Editar atividade TST" : "Cadastro atividades TST"}
                {isEditing && <span className="text-sm text-gray-500 ml-2">Código: {formData.id}</span>}
              </h1>

              {/* Processo/Máquina/Equipamento */}
              <div className="space-y-2">
                <Label htmlFor="processo" className="flex items-center">
                  Processo e/ou Máquina Equipamento
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select value={formData.processo} onValueChange={(value) => handleChange("processo", value)}>
                  <SelectTrigger id="processo" className={errors.processo ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o processo ou equipamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROCESSOS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.processo && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.processo}
                  </p>
                )}
              </div>

              {/* Frequência e Prioridade em grid para desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Frequência */}
                <div className="space-y-2">
                  <Label htmlFor="frequencia" className="flex items-center">
                    Frequência
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select value={formData.frequencia} onValueChange={(value) => handleChange("frequencia", value)}>
                    <SelectTrigger id="frequencia" className={errors.frequencia ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCIAS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.frequencia && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.frequencia}
                    </p>
                  )}
                </div>

                {/* Prioridade */}
                <div className="space-y-2">
                  <Label htmlFor="prioridade" className="flex items-center">
                    Prioridade Implantação
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select value={formData.prioridade} onValueChange={(value) => handleChange("prioridade", value)}>
                    <SelectTrigger id="prioridade" className={errors.prioridade ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORIDADES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.prioridade && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.prioridade}
                    </p>
                  )}
                </div>
              </div>

              {/* Item de Verificação */}
              <div className="space-y-2">
                <Label htmlFor="itemVerificacao">Item de Verificação</Label>
                <Input
                  id="itemVerificacao"
                  value={formData.itemVerificacao}
                  onChange={(e) => handleChange("itemVerificacao", e.target.value)}
                  placeholder="Descreva o item a ser verificado"
                />
              </div>

              {/* Como Avaliar */}
              <div className="space-y-2">
                <Label htmlFor="comoAvaliar" className="flex items-center">
                  Como avaliar
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Textarea
                  id="comoAvaliar"
                  value={formData.comoAvaliar}
                  onChange={(e) => handleChange("comoAvaliar", e.target.value)}
                  placeholder="Descreva como a atividade deve ser avaliada"
                  className={errors.comoAvaliar ? "border-red-500" : ""}
                  rows={4}
                />
                {errors.comoAvaliar && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.comoAvaliar}
                  </p>
                )}
              </div>

              {/* Atividade Ativa */}
              <div className="space-y-2">
                <Label>Atividade Ativa?</Label>
                <RadioGroup
                  value={formData.ativa ? "sim" : "nao"}
                  onValueChange={(value) => handleChange("ativa", value === "sim")}
                  className="flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="ativa-sim" />
                    <Label htmlFor="ativa-sim" className="cursor-pointer">
                      Sim
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="ativa-nao" />
                    <Label htmlFor="ativa-nao" className="cursor-pointer">
                      Não
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Botões de ação */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setActiveTab("consulta")
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Salvando..." : "SALVAR"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

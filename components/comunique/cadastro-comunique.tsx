"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function CadastroComunique() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    anonimo: false,
    matricula: "",
    colaborador: "",
    data: new Date().toISOString().split("T")[0],
    local: "",
    setor: "",
    descricao: "",
    proposta: "",
  })
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Fechar a mensagem automaticamente após alguns segundos
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessMessage])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, anonimo: checked }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, setor: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setFoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveFoto = () => {
    setFoto(null)
    setFotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mostrar mensagem de sucesso
      setShowSuccessMessage(true)

      // Limpar o formulário após o cadastro bem-sucedido
      setFormData({
        anonimo: false,
        matricula: "",
        colaborador: "",
        data: new Date().toISOString().split("T")[0],
        local: "",
        setor: "",
        descricao: "",
        proposta: "",
      })
      setFoto(null)
      setFotoPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao cadastrar o comunique. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="relative">
      {/* Mensagem de sucesso */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-md p-3 flex items-center border-l-4 border-green-500">
          <Check className="text-green-500 mr-2 h-5 w-5" />
          <span className="text-gray-800">Comunique salvo com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox id="anonimo" checked={formData.anonimo} onCheckedChange={handleCheckboxChange} />
            <Label htmlFor="anonimo" className="font-medium">
              Manter anonimato
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="matricula" className="font-medium">
              Matrícula/CPF
            </Label>
            <Input
              id="matricula"
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              disabled={formData.anonimo}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="colaborador" className="font-medium">
              Colaborador
            </Label>
            <Input
              id="colaborador"
              name="colaborador"
              value={formData.colaborador}
              onChange={handleChange}
              disabled={formData.anonimo}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data" className="font-medium">
              Data e hora
            </Label>
            <Input id="data" name="data" type="date" value={formData.data} onChange={handleChange} className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="local" className="font-medium">
              Local da Ocorrência
            </Label>
            <Input id="local" name="local" value={formData.local} onChange={handleChange} className="w-full" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="setor" className="font-medium">
              Setor
            </Label>
            <Select value={formData.setor} onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="producao">Produção</SelectItem>
                <SelectItem value="administrativo">Administrativo</SelectItem>
                <SelectItem value="logistica">Logística</SelectItem>
                <SelectItem value="qualidade">Qualidade</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="descricao" className="font-medium">
              Descrição da ocorrência
            </Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className="min-h-[100px] w-full"
              required
              maxLength={1024}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposta" className="font-medium">
              Proposta de melhoria
            </Label>
            <Textarea
              id="proposta"
              name="proposta"
              value={formData.proposta}
              onChange={handleChange}
              className="min-h-[100px] w-full"
              maxLength={1024}
            />
          </div>
        </div>

        <div className="mb-6">
          <Label className="font-medium mb-2 block">Adicionar foto</Label>
          <div
            className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-auto">
                {fotoPreview ? (
                  <div className="relative w-64 h-64">
                    <img
                      src={fotoPreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveFoto}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="bg-blue-100 w-64 h-64 flex items-center justify-center rounded-md">
                    <img src="/document-icon.png" alt="Documento" className="w-32 h-32" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="foto-input"
                />

                <div className="text-center md:text-left">
                  <p className="text-sm text-gray-500 mb-2">
                    Arraste e solte uma imagem aqui ou clique para selecionar
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    ADICIONAR FOTO
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="bg-gray-700 text-white hover:bg-gray-800"
          >
            CANCELAR
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⊚</span>
                ENVIANDO...
              </>
            ) : (
              "CADASTRAR COMUNIQUE"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Save, ChevronDown } from "lucide-react"

// Componente de seleção
const Select = ({ label, options, value, onChange, className = "", required = false }) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        required={required}
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown size={16} />
      </div>
    </div>
  )
}

export function NovaEmpresaModal({ isOpen, onClose, onSave, editingEmpresa }) {
  const [formData, setFormData] = useState({
    codigo: "",
    razaoSocial: "",
    fantasia: "",
    tipo: "",
    empresaPai: "",
    regional: "",
    sequencia: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    cnpj: "",
    inscricaoEstadual: "",
    inscricaoMunicipal: "",
    email: "",
    telefone: "",
    observacoes: "",
    ativo: true,
  })

  const [errors, setErrors] = useState({})

  // Opções para os selects
  const tipoOptions = [
    { value: "matriz", label: "Matriz" },
    { value: "unidade-produtiva", label: "Unidade Produtiva" },
    { value: "centro-distribuicao", label: "Centro de Distribuição" },
    { value: "escritorio", label: "Escritório" },
  ]

  const empresaPaiOptions = [
    { value: "empresa-abc", label: "Empresa ABC Ltda" },
    { value: "empresa-xyz", label: "Empresa XYZ S.A." },
  ]

  const regionalOptions = [
    { value: "sul", label: "Sul" },
    { value: "sudeste", label: "Sudeste" },
    { value: "centro-oeste", label: "Centro-Oeste" },
    { value: "nordeste", label: "Nordeste" },
    { value: "norte", label: "Norte" },
  ]

  const estadoOptions = [
    { value: "ac", label: "AC" },
    { value: "al", label: "AL" },
    { value: "ap", label: "AP" },
    { value: "am", label: "AM" },
    { value: "ba", label: "BA" },
    { value: "ce", label: "CE" },
    { value: "df", label: "DF" },
    { value: "es", label: "ES" },
    { value: "go", label: "GO" },
    { value: "ma", label: "MA" },
    { value: "mt", label: "MT" },
    { value: "ms", label: "MS" },
    { value: "mg", label: "MG" },
    { value: "pa", label: "PA" },
    { value: "pb", label: "PB" },
    { value: "pr", label: "PR" },
    { value: "pe", label: "PE" },
    { value: "pi", label: "PI" },
    { value: "rj", label: "RJ" },
    { value: "rn", label: "RN" },
    { value: "rs", label: "RS" },
    { value: "ro", label: "RO" },
    { value: "rr", label: "RR" },
    { value: "sc", label: "SC" },
    { value: "sp", label: "SP" },
    { value: "se", label: "SE" },
    { value: "to", label: "TO" },
  ]

  // Opções de cidades (simplificado)
  const cidadeOptions = [
    { value: "sao-paulo", label: "São Paulo" },
    { value: "rio-janeiro", label: "Rio de Janeiro" },
    { value: "belo-horizonte", label: "Belo Horizonte" },
    { value: "brasilia", label: "Brasília" },
    { value: "salvador", label: "Salvador" },
    { value: "fortaleza", label: "Fortaleza" },
    { value: "recife", label: "Recife" },
    { value: "porto-alegre", label: "Porto Alegre" },
    { value: "curitiba", label: "Curitiba" },
    { value: "manaus", label: "Manaus" },
    { value: "nova-veneza", label: "Nova Veneza" },
    { value: "sidrolandia", label: "Sidrolândia" },
    { value: "trindade-sul", label: "Trindade do Sul" },
    { value: "itajai", label: "Itajaí" },
    { value: "montenegro", label: "Montenegro" },
  ]

  useEffect(() => {
    if (isOpen) {
      if (editingEmpresa) {
        // Mapear valores para os selects
        const tipoValue = tipoOptions.find((opt) => opt.label === editingEmpresa.tipo)?.value || ""
        const regionalValue = regionalOptions.find((opt) => opt.label === editingEmpresa.regional)?.value || ""
        const estadoValue = estadoOptions.find((opt) => opt.label === editingEmpresa.estado)?.value || ""
        const cidadeValue = cidadeOptions.find((opt) => opt.label === editingEmpresa.cidade)?.value || ""

        // Extrair informações de endereço
        let endereco = editingEmpresa.endereco || ""
        let numero = ""
        let complemento = ""
        const bairro = editingEmpresa.bairro || ""

        // Tentar extrair número e complemento do endereço
        const enderecoMatch = endereco.match(/(.*?),\s*(\d+)(?:\s+(.*))?/)
        if (enderecoMatch) {
          endereco = enderecoMatch[1]
          numero = enderecoMatch[2]
          complemento = enderecoMatch[3] || ""
        }

        setFormData({
          codigo: editingEmpresa.codigo || "",
          razaoSocial: editingEmpresa.razaoSocial || "",
          fantasia: editingEmpresa.fantasia || "",
          tipo: tipoValue,
          empresaPai: editingEmpresa.empresaPai || "",
          regional: regionalValue,
          sequencia: editingEmpresa.sequencia || "",
          cep: editingEmpresa.cep || "",
          endereco: endereco,
          numero: numero,
          complemento: complemento,
          bairro: bairro,
          estado: estadoValue,
          cidade: cidadeValue,
          cnpj: editingEmpresa.cnpj || "",
          inscricaoEstadual: editingEmpresa.inscricaoEstadual || "",
          inscricaoMunicipal: editingEmpresa.inscricaoMunicipal || "",
          email: editingEmpresa.email || "",
          telefone: editingEmpresa.telefone || "",
          observacoes: editingEmpresa.observacoes || "",
          ativo: editingEmpresa.ativo || false,
        })
      } else {
        // Reset form when not editing
        setFormData({
          codigo: "",
          razaoSocial: "",
          fantasia: "",
          tipo: "",
          empresaPai: "",
          regional: "",
          sequencia: "",
          cep: "",
          endereco: "",
          numero: "",
          complemento: "",
          bairro: "",
          estado: "",
          cidade: "",
          cnpj: "",
          inscricaoEstadual: "",
          inscricaoMunicipal: "",
          email: "",
          telefone: "",
          observacoes: "",
          ativo: true,
        })
      }

      // Limpa os erros ao abrir o modal
      setErrors({})
    }
  }, [editingEmpresa, isOpen])

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    // Limpa o erro quando o usuário começa a digitar
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, ativo: e.target.checked })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.razaoSocial.trim()) newErrors.razaoSocial = "Razão Social é obrigatória"
    if (!formData.fantasia.trim()) newErrors.fantasia = "Nome Fantasia é obrigatório"
    if (!formData.tipo) newErrors.tipo = "Tipo/Configuração é obrigatório"
    if (!formData.cnpj.trim()) newErrors.cnpj = "CNPJ é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Converter os valores de select para os rótulos correspondentes
      const tipoLabel = tipoOptions.find((opt) => opt.value === formData.tipo)?.label || ""
      const regionalLabel = regionalOptions.find((opt) => opt.value === formData.regional)?.label || ""
      const estadoLabel = estadoOptions.find((opt) => opt.value === formData.estado)?.label || ""
      const cidadeLabel = cidadeOptions.find((opt) => opt.value === formData.cidade)?.label || ""

      onSave({
        ...formData,
        tipo: tipoLabel,
        regional: regionalLabel,
        estado: estadoLabel,
        cidade: cidadeLabel,
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-auto">
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center rounded-t-lg sticky top-0 z-10">
          <h3 className="text-xl font-bold">{editingEmpresa ? "Editar Empresa" : "Nova Empresa"}</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Input
                placeholder="Código"
                value={formData.codigo}
                onChange={handleChange("codigo")}
                className="border border-gray-300"
                disabled={!!editingEmpresa}
              />
            </div>

            <div className="flex items-center">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={handleCheckboxChange}
                  className="opacity-0 absolute block w-6 h-6 rounded-full bg-white border-4 cursor-pointer z-10"
                />
                <label
                  htmlFor="ativo"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    formData.ativo ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                      formData.ativo ? "transform translate-x-4" : ""
                    }`}
                  ></span>
                </label>
              </div>
              <Label htmlFor="ativo" className="cursor-pointer">
                {formData.ativo ? "Ativo" : "Inativo"}
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Input
                placeholder="Razão Social*"
                value={formData.razaoSocial}
                onChange={handleChange("razaoSocial")}
                className={`border ${errors.razaoSocial ? "border-red-500" : "border-gray-300"} w-full`}
                required
              />
              {errors.razaoSocial && <p className="text-red-500 text-xs mt-1">{errors.razaoSocial}</p>}
            </div>

            <div>
              <Input
                placeholder="Fantasia*"
                value={formData.fantasia}
                onChange={handleChange("fantasia")}
                className={`border ${errors.fantasia ? "border-red-500" : "border-gray-300"} w-full`}
                required
              />
              {errors.fantasia && <p className="text-red-500 text-xs mt-1">{errors.fantasia}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Select
                label="Tipo/Configuração Unidade*"
                options={tipoOptions}
                value={formData.tipo}
                onChange={handleChange("tipo")}
                className={errors.tipo ? "border-red-500" : ""}
                required
              />
              {errors.tipo && <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>}
            </div>

            <div>
              <Select
                label="Empresa Pai"
                options={empresaPaiOptions}
                value={formData.empresaPai}
                onChange={handleChange("empresaPai")}
              />
            </div>

            <div>
              <Select
                label="Regional"
                options={regionalOptions}
                value={formData.regional}
                onChange={handleChange("regional")}
              />
            </div>
          </div>

          <div className="mb-4">
            <Input
              placeholder="Sequência/Ordenação Painéis"
              value={formData.sequencia}
              onChange={handleChange("sequencia")}
              className="border border-gray-300 w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Input
                placeholder="CEP"
                value={formData.cep}
                onChange={handleChange("cep")}
                className="border border-gray-300 w-full"
              />
            </div>

            <div className="md:col-span-2">
              <Input
                placeholder="Endereço"
                value={formData.endereco}
                onChange={handleChange("endereco")}
                className="border border-gray-300 w-full"
              />
            </div>

            <div>
              <Input
                placeholder="Nº"
                value={formData.numero}
                onChange={handleChange("numero")}
                className="border border-gray-300 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Input
                placeholder="Complemento"
                value={formData.complemento}
                onChange={handleChange("complemento")}
                className="border border-gray-300 w-full"
              />
            </div>

            <div>
              <Input
                placeholder="Bairro"
                value={formData.bairro}
                onChange={handleChange("bairro")}
                className="border border-gray-300 w-full"
              />
            </div>

            <div>
              <Select
                label="Estado"
                options={estadoOptions}
                value={formData.estado}
                onChange={handleChange("estado")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Select
                label="Cidade"
                options={cidadeOptions}
                value={formData.cidade}
                onChange={handleChange("cidade")}
              />
            </div>

            <div>
              <Input
                placeholder="CNPJ*"
                value={formData.cnpj}
                onChange={handleChange("cnpj")}
                className={`border ${errors.cnpj ? "border-red-500" : "border-gray-300"} w-full`}
                required
              />
              {errors.cnpj && <p className="text-red-500 text-xs mt-1">{errors.cnpj}</p>}
            </div>

            <div>
              <Input
                placeholder="Inscrição Estadual"
                value={formData.inscricaoEstadual}
                onChange={handleChange("inscricaoEstadual")}
                className="border border-gray-300 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Input
                placeholder="Inscrição Municipal"
                value={formData.inscricaoMunicipal}
                onChange={handleChange("inscricaoMunicipal")}
                className="border border-gray-300 w-full"
              />
            </div>

            <div>
              <Input
                placeholder="E-mail"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                className="border border-gray-300 w-full"
              />
            </div>

            <div>
              <Input
                placeholder="Telefone"
                value={formData.telefone}
                onChange={handleChange("telefone")}
                className="border border-gray-300 w-full"
              />
            </div>
          </div>

          <div className="mb-4">
            <Textarea
              placeholder="Observações"
              value={formData.observacoes}
              onChange={handleChange("observacoes")}
              className="border border-gray-300 w-full min-h-[100px]"
            />
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white border-0 flex items-center gap-2"
            >
              <X size={18} />
              CANCELAR
            </Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2">
              <Save size={18} />
              SALVAR
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

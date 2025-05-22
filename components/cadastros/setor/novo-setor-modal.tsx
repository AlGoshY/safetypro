"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

export function NovoSetorModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    descricao: "",
    ativo: true,
    unidade: "",
    turno: "",
    setorPai: false,
    setorPaiSelecionado: "",
  })

  const [errors, setErrors] = useState({})

  // Opções para os selects
  const unidadeOptions = [
    { value: "nova-veneza", label: "NOVA VENEZA - ABATE AVES" },
    { value: "sidrolandia", label: "SIDROLÂNDIA - ABATE AVES" },
    { value: "trindade", label: "TRINDADE DO SUL - ABATE AVES" },
    { value: "itajai", label: "CD Itajaí ME HUB" },
    { value: "montenegro", label: "MONTENEGRO - ABATE AVES" },
  ]

  const turnoOptions = [
    { value: "primeiro", label: "Primeiro" },
    { value: "segundo", label: "Segundo" },
    { value: "terceiro", label: "Terceiro" },
    { value: "administrativo", label: "Administrativo" },
  ]

  const setorPaiOptions = [
    { value: "producao", label: "Produção" },
    { value: "qualidade", label: "Qualidade" },
    { value: "manutencao", label: "Manutenção" },
    { value: "logistica", label: "Logística" },
    { value: "administrativo", label: "Administrativo" },
  ]

  useEffect(() => {
    if (isOpen) {
      // Reset form when opening
      setFormData({
        descricao: "",
        ativo: true,
        unidade: "",
        turno: "",
        setorPai: false,
        setorPaiSelecionado: "",
      })
      setErrors({})
    }
  }, [isOpen])

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    // Limpa o erro quando o usuário começa a digitar
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  const handleToggleChange = (e) => {
    setFormData({ ...formData, ativo: e.target.checked })
  }

  const handleSetorPaiChange = (e) => {
    setFormData({ ...formData, setorPai: e.target.checked })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.descricao.trim()) newErrors.descricao = "Descrição é obrigatória"
    if (!formData.unidade) newErrors.unidade = "Unidade é obrigatória"
    if (!formData.turno) newErrors.turno = "Turno é obrigatório"
    if (formData.setorPai && !formData.setorPaiSelecionado) newErrors.setorPaiSelecionado = "Setor pai é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Converter os valores de select para os rótulos correspondentes
      const unidadeLabel = unidadeOptions.find((opt) => opt.value === formData.unidade)?.label || ""
      const turnoLabel = turnoOptions.find((opt) => opt.value === formData.turno)?.label || ""
      const setorPaiLabel = formData.setorPai
        ? setorPaiOptions.find((opt) => opt.value === formData.setorPaiSelecionado)?.label || ""
        : ""

      onSave({
        ...formData,
        unidade: unidadeLabel,
        turno: turnoLabel,
        setorPaiSelecionado: setorPaiLabel,
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-semibold text-gray-800">Novo Setor</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Descrição"
                value={formData.descricao}
                onChange={handleChange("descricao")}
                className={`border ${errors.descricao ? "border-red-500" : "border-gray-300"} w-full`}
                required
              />
              {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao}</p>}
            </div>

            <div className="flex items-center">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={handleToggleChange}
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

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Unidade</Label>
              <Select
                label="Selecione a unidade"
                options={unidadeOptions}
                value={formData.unidade}
                onChange={handleChange("unidade")}
                className={errors.unidade ? "border-red-500" : ""}
                required
              />
              {errors.unidade && <p className="text-red-500 text-xs mt-1">{errors.unidade}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Turno</Label>
              <Select
                label="Selecione o turno"
                options={turnoOptions}
                value={formData.turno}
                onChange={handleChange("turno")}
                className={errors.turno ? "border-red-500" : ""}
                required
              />
              {errors.turno && <p className="text-red-500 text-xs mt-1">{errors.turno}</p>}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="setorPai"
                checked={formData.setorPai}
                onChange={handleSetorPaiChange}
                className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <Label htmlFor="setorPai" className="ml-2 cursor-pointer">
                Setor pai?
              </Label>
            </div>

            {formData.setorPai && (
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Setor pai</Label>
                <Select
                  label="Selecione o setor pai"
                  options={setorPaiOptions}
                  value={formData.setorPaiSelecionado}
                  onChange={handleChange("setorPaiSelecionado")}
                  className={errors.setorPaiSelecionado ? "border-red-500" : ""}
                  required={formData.setorPai}
                />
                {errors.setorPaiSelecionado && (
                  <p className="text-red-500 text-xs mt-1">{errors.setorPaiSelecionado}</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2 border-gray-300"
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

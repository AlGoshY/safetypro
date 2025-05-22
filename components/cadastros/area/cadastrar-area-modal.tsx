"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ChevronDown } from "lucide-react"

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

export function CadastrarAreaModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    cargo: "",
    setores: "",
    ativo: false,
    responsavel: false,
  })

  const [errors, setErrors] = useState({})

  // Opções para os selects
  const cargoOptions = [
    { value: "gerente", label: "Gerente" },
    { value: "supervisor", label: "Supervisor" },
    { value: "coordenador", label: "Coordenador" },
    { value: "analista", label: "Analista" },
    { value: "tecnico", label: "Técnico" },
  ]

  const setoresOptions = [
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
        cargo: "",
        setores: "",
        ativo: false,
        responsavel: false,
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

  const handleToggleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.checked })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.cargo) newErrors.cargo = "Cargo é obrigatório"
    if (!formData.setores) newErrors.setores = "Setor é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Converter os valores de select para os rótulos correspondentes
      const cargoLabel = cargoOptions.find((opt) => opt.value === formData.cargo)?.label || ""
      const setoresLabel = setoresOptions.find((opt) => opt.value === formData.setores)?.label || ""

      onSave({
        ...formData,
        cargo: cargoLabel,
        setores: setoresLabel,
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Cadastrar Área</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Cargo</Label>
              <Select
                label="Selecione o cargo"
                options={cargoOptions}
                value={formData.cargo}
                onChange={handleChange("cargo")}
                className={errors.cargo ? "border-red-500" : ""}
                required
              />
              {errors.cargo && <p className="text-red-500 text-xs mt-1">{errors.cargo}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Setores</Label>
              <Select
                label="Selecione o setor"
                options={setoresOptions}
                value={formData.setores}
                onChange={handleChange("setores")}
                className={errors.setores ? "border-red-500" : ""}
                required
              />
              {errors.setores && <p className="text-red-500 text-xs mt-1">{errors.setores}</p>}
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                {/* Toggle para Ativo/Inativo */}
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={handleToggleChange("ativo")}
                    className="opacity-0 absolute block w-6 h-6 rounded-full bg-white border-4 cursor-pointer z-10"
                  />
                  <label
                    htmlFor="ativo"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      formData.ativo ? "!bg-green-500" : "bg-gray-300"
                    }`}
                    style={{ backgroundColor: formData.ativo ? "#22c55e" : "#d1d5db" }}
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

              <div className="flex items-center">
                {/* Toggle para Responsável */}
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="responsavel"
                    checked={formData.responsavel}
                    onChange={handleToggleChange("responsavel")}
                    className="opacity-0 absolute block w-6 h-6 rounded-full bg-white border-4 cursor-pointer z-10"
                  />
                  <label
                    htmlFor="responsavel"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      formData.responsavel ? "!bg-green-500" : "bg-gray-300"
                    }`}
                    style={{ backgroundColor: formData.responsavel ? "#22c55e" : "#d1d5db" }}
                  >
                    <span
                      className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                        formData.responsavel ? "transform translate-x-4" : ""
                      }`}
                    ></span>
                  </label>
                </div>
                <Label htmlFor="responsavel" className="cursor-pointer">
                  {formData.responsavel ? "Responsável" : "Não responsável"}
                </Label>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2 border-gray-300"
            >
              CANCELAR
            </Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
              SALVAR
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

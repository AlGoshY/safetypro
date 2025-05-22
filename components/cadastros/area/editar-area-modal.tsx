"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

export function EditarAreaModal({ isOpen, onClose, onSave, areaData }) {
  const [formData, setFormData] = useState({
    id: 0,
    cargo: "",
    setores: "",
    ativo: true,
    responsavel: false,
  })

  const [errors, setErrors] = useState({
    cargo: "",
    setores: "",
  })

  // Carregar dados da área quando o modal for aberto
  useEffect(() => {
    if (areaData) {
      setFormData({
        id: areaData.id,
        cargo: areaData.cargo,
        setores: areaData.setores,
        ativo: areaData.ativo,
        responsavel: areaData.responsavel,
      })
    }
  }, [areaData])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
    // Limpar erro quando o usuário começa a digitar
    if (errors[id]) {
      setErrors({ ...errors, [id]: "" })
    }
  }

  const handleToggleChange = (field) => {
    setFormData({ ...formData, [field]: !formData[field] })
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

    if (!formData.cargo.trim()) {
      newErrors.cargo = "Cargo é obrigatório"
      valid = false
    }

    if (!formData.setores.trim()) {
      newErrors.setores = "Setores é obrigatório"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center rounded-t-lg">
          <h3 className="text-lg font-semibold">Editar Área</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-1">
              Cargo
            </label>
            <Input
              type="text"
              id="cargo"
              value={formData.cargo}
              onChange={handleInputChange}
              className={`w-full ${errors.cargo ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.cargo && <p className="text-red-500 text-xs mt-1">{errors.cargo}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="setores" className="block text-sm font-medium text-gray-700 mb-1">
              Setores
            </label>
            <Input
              type="text"
              id="setores"
              value={formData.setores}
              onChange={handleInputChange}
              className={`w-full ${errors.setores ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.setores && <p className="text-red-500 text-xs mt-1">{errors.setores}</p>}
          </div>

          <div className="mb-4 flex items-center">
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="ativo"
                checked={formData.ativo}
                onChange={() => handleToggleChange("ativo")}
                className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none z-10"
                style={{
                  top: "0px",
                  left: formData.ativo ? "calc(100% - 24px)" : "0px",
                  transition: "left 0.3s",
                }}
              />
              <label
                htmlFor="ativo"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  formData.ativo ? "bg-green-500" : "bg-gray-300"
                }`}
                style={{ transition: "background-color 0.3s" }}
              ></label>
            </div>
            <label htmlFor="ativo" className="text-sm font-medium text-gray-700 cursor-pointer">
              {formData.ativo ? "Ativo" : "Inativo"}
            </label>
          </div>

          <div className="mb-4 flex items-center">
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="responsavel"
                checked={formData.responsavel}
                onChange={() => handleToggleChange("responsavel")}
                className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none z-10"
                style={{
                  top: "0px",
                  left: formData.responsavel ? "calc(100% - 24px)" : "0px",
                  transition: "left 0.3s",
                }}
              />
              <label
                htmlFor="responsavel"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  formData.responsavel ? "bg-green-500" : "bg-gray-300"
                }`}
                style={{ transition: "background-color 0.3s" }}
              ></label>
            </div>
            <label htmlFor="responsavel" className="text-sm font-medium text-gray-700 cursor-pointer">
              {formData.responsavel ? "Responsável" : "Não responsável"}
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
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

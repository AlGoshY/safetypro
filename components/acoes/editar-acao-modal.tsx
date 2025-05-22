"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface EditarAcaoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (acao: any) => void
  acao: any
}

export function EditarAcaoModal({ isOpen, onClose, onSave, acao }: EditarAcaoModalProps) {
  const [formData, setFormData] = useState({
    negocio: "",
    unidade: "",
    indicador: "",
    anomalia: "",
    causa: "",
    acao: "",
    responsavel: "",
    previsao: "",
    prioridade: "",
    status: "",
    realizado: "",
  })

  useEffect(() => {
    if (acao) {
      console.log("Dados recebidos no modal:", acao)
      // Preencha o formData com os valores da linha
      setFormData({
        negocio: acao.negocio || "",
        unidade: acao.unidade || "",
        indicador: acao.indicador || "",
        anomalia: acao.anomalia || "",
        causa: acao.causa || "",
        acao: acao.acao || "",
        responsavel: acao.responsavel || "",
        previsao: acao.previsao || "",
        prioridade: acao.prioridade || "",
        status: acao.status || "",
        realizado: acao.realizado || "",
      })
    }
  }, [acao])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Editar Ação</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Negócio *</label>
              <select
                name="negocio"
                value={formData.negocio}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione...</option>
                {acao?.negocioOptions?.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
                <option value="negocio1">Negócio 1</option>
                <option value="negocio2">Negócio 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidade *</label>
              <select
                name="unidade"
                value={formData.unidade}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione...</option>
                {acao?.unidadeOptions?.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
                <option value="unidade1">Unidade 1</option>
                <option value="unidade2">Unidade 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Indicador *</label>
              <select
                name="indicador"
                value={formData.indicador}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione...</option>
                {acao?.indicadorOptions?.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
                <option value="indicador1">Indicador 1</option>
                <option value="indicador2">Indicador 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsável *</label>
              <select
                name="responsavel"
                value={formData.responsavel}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione...</option>
                {acao?.responsavelOptions?.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
                <option value="resp1">Responsável 1</option>
                <option value="resp2">Responsável 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previsão *</label>
              <input
                type="date"
                name="previsao"
                value={formData.previsao}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade *</label>
              <select
                name="prioridade"
                value={formData.prioridade}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione...</option>
                {acao?.prioridadeOptions?.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione...</option>
                {acao?.statusOptions?.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
                <option value="pendente">Pendente</option>
                <option value="concluido">Concluído</option>
                <option value="atrasado">Atrasado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Realizado</label>
              <input
                type="date"
                name="realizado"
                value={formData.realizado}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Anomalia *</label>
              <textarea
                name="anomalia"
                value={formData.anomalia}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Causa *</label>
              <textarea
                name="causa"
                value={formData.causa}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ação *</label>
              <textarea
                name="acao"
                value={formData.acao}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

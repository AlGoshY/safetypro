"use client"

import { useState, useEffect } from "react"
import { X, Save, Users } from "lucide-react"

interface NovaAcaoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (acao: {
    descricao: string
    responsavel: string
    previsto: string
    realizado: string
    obs: string
    percentual: number
  }) => void
  responsaveis: { id: string; nome: string }[]
}

export function NovaAcaoModal({ isOpen, onClose, onSave, responsaveis }: NovaAcaoModalProps) {
  const [descricao, setDescricao] = useState("")
  const [responsavel, setResponsavel] = useState("")
  const [previsto, setPrevisto] = useState("")
  const [realizado, setRealizado] = useState("")
  const [obs, setObs] = useState("")
  const [percentual, setPercentual] = useState(0)
  const [isResponsaveisOpen, setIsResponsaveisOpen] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setDescricao("")
      setResponsavel("")
      setPrevisto("")
      setRealizado("")
      setObs("")
      setPercentual(0)
    }
  }, [isOpen])

  const handleSubmit = () => {
    // Validação básica
    if (!descricao || !responsavel || !previsto) {
      return
    }

    onSave({
      descricao,
      responsavel,
      previsto,
      realizado,
      obs,
      percentual,
    })

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Nova Ação</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* O Que */}
            <div className="md:col-span-2">
              <label htmlFor="o-que" className="block text-sm font-semibold text-gray-700 mb-1.5">
                O Que <span className="text-red-500">*</span>
              </label>
              <input
                id="o-que"
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className={`w-full border ${!descricao && "border-red-300 bg-red-50"} rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                placeholder="Descreva a ação a ser realizada"
                required
                aria-required="true"
              />
              {!descricao && <p className="mt-1 text-xs text-red-500">Este campo é obrigatório</p>}
            </div>

            {/* Quem */}
            <div className="relative">
              <label htmlFor="quem" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Quem <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <div className="relative flex-grow">
                  <button
                    type="button"
                    id="quem"
                    onClick={() => setIsResponsaveisOpen(!isResponsaveisOpen)}
                    className={`w-full border ${!responsavel && "border-red-300 bg-red-50"} rounded-md px-3 py-2.5 bg-white text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                    aria-haspopup="listbox"
                    aria-expanded={isResponsaveisOpen}
                    aria-required="true"
                  >
                    <span className={responsavel ? "" : "text-gray-400"}>
                      {responsavel || "Selecione um responsável"}
                    </span>
                    <svg
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        isResponsaveisOpen ? "transform rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isResponsaveisOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                      <ul className="py-1" role="listbox" aria-labelledby="quem">
                        {responsaveis.length > 0 ? (
                          responsaveis.map((resp) => (
                            <li key={resp.id} role="option" aria-selected={responsavel === resp.nome}>
                              <button
                                type="button"
                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 transition-colors"
                                onClick={() => {
                                  setResponsavel(resp.nome)
                                  setIsResponsaveisOpen(false)
                                }}
                              >
                                {resp.nome}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2.5 text-sm text-gray-500">Nenhum responsável disponível</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="ml-2 p-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Selecionar participantes"
                  aria-label="Selecionar participantes"
                >
                  <Users className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              {!responsavel && <p className="mt-1 text-xs text-red-500">Este campo é obrigatório</p>}
            </div>

            {/* Previsto */}
            <div>
              <label htmlFor="previsto" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Previsto <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="previsto"
                  type="date"
                  value={previsto}
                  onChange={(e) => setPrevisto(e.target.value)}
                  className={`w-full border ${!previsto && "border-red-300 bg-red-50"} rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                  required
                  aria-required="true"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {!previsto && <p className="mt-1 text-xs text-red-500">Este campo é obrigatório</p>}
            </div>

            {/* Realizado */}
            <div>
              <label htmlFor="realizado" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Realizado
              </label>
              <div className="relative">
                <input
                  id="realizado"
                  type="date"
                  value={realizado}
                  onChange={(e) => setRealizado(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Obs */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="obs" className="block text-sm font-semibold text-gray-700">
                  Observações
                </label>
                <span
                  className={`text-xs ${obs.length > 900 ? (obs.length > 1000 ? "text-red-500 font-medium" : "text-amber-500") : "text-gray-500"}`}
                >
                  {obs.length}/1024 caracteres
                </span>
              </div>
              <textarea
                id="obs"
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                className={`w-full border ${obs.length > 1000 ? "border-red-300" : "border-gray-300"} rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none`}
                rows={3}
                placeholder="Observações adicionais sobre a ação"
                maxLength={1024}
                aria-describedby="obs-info"
              />
              {obs.length > 1000 && (
                <p id="obs-info" className="mt-1 text-xs text-red-500">
                  Você está próximo do limite de caracteres.
                </p>
              )}
            </div>

            {/* Percentual */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="percentual" className="block text-sm font-semibold text-gray-700">
                  Percentual de Conclusão
                </label>
                <span
                  className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                    percentual === 100
                      ? "bg-green-100 text-green-800"
                      : percentual > 50
                        ? "bg-yellow-100 text-yellow-800"
                        : percentual > 0
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {percentual}%
                </span>
              </div>
              <div className="mb-3">
                <input
                  id="percentual"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={percentual}
                  onChange={(e) => setPercentual(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${
                      percentual === 100 ? "#10b981" : percentual > 50 ? "#f59e0b" : "#ef4444"
                    } 0%, ${
                      percentual === 100 ? "#10b981" : percentual > 50 ? "#f59e0b" : "#ef4444"
                    } ${percentual}%, #e5e7eb ${percentual}%, #e5e7eb 100%)`,
                  }}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percentual}
                />
              </div>
              <div className="flex space-x-1.5">
                <button
                  type="button"
                  className={`text-xs px-2 py-1.5 rounded-md text-center flex-1 transition-colors ${
                    percentual === 0 ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={() => setPercentual(0)}
                  aria-label="Definir como 0%"
                >
                  0%
                </button>
                <button
                  type="button"
                  className={`text-xs px-2 py-1.5 rounded-md text-center flex-1 transition-colors ${
                    percentual === 25 ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={() => setPercentual(25)}
                  aria-label="Definir como 25%"
                >
                  25%
                </button>
                <button
                  type="button"
                  className={`text-xs px-2 py-1.5 rounded-md text-center flex-1 transition-colors ${
                    percentual === 50 ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={() => setPercentual(50)}
                  aria-label="Definir como 50%"
                >
                  50%
                </button>
                <button
                  type="button"
                  className={`text-xs px-2 py-1.5 rounded-md text-center flex-1 transition-colors ${
                    percentual === 75 ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={() => setPercentual(75)}
                  aria-label="Definir como 75%"
                >
                  75%
                </button>
                <button
                  type="button"
                  className={`text-xs px-2 py-1.5 rounded-md text-center flex-1 transition-colors ${
                    percentual === 100 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={() => setPercentual(100)}
                  aria-label="Definir como 100%"
                >
                  100%
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded-md flex items-center mr-2 hover:bg-gray-700 transition-colors"
          >
            <X className="h-4 w-4 mr-1" /> CANCELAR
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4 mr-1" /> SALVAR
          </button>
        </div>
      </div>
    </div>
  )
}

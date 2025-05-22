"use client"
import { X } from "lucide-react"

interface ConfigurarReuniaoProps {
  unidade: string
  setUnidade: (value: string) => void
  tipoReuniao: string
  setTipoReuniao: (value: string) => void
  onSalvar: () => void
}

export function ConfigurarReuniao({
  unidade,
  setUnidade,
  tipoReuniao,
  setTipoReuniao,
  onSalvar,
}: ConfigurarReuniaoProps) {
  const unidades = [
    { id: "1", nome: "Unidade 1" },
    { id: "2", nome: "Unidade 2" },
    { id: "3", nome: "Unidade 3" },
    { id: "4", nome: "Matriz" },
  ]

  const tiposReuniao = [
    { id: "1", nome: "CIPA" },
    { id: "2", nome: "Diretoria" },
    { id: "3", nome: "Departamento" },
    { id: "4", nome: "Segurança" },
    { id: "5", nome: "Planejamento" },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-blue-50 to-indigo-100 rounded-full -mr-32 -mt-32 opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-50 to-indigo-100 rounded-full -ml-40 -mb-40 opacity-70"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.8)_30%,transparent_70%)]"></div>

        {/* Padrão de pontos decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 grid grid-cols-5 gap-4">
            {Array(25)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-blue-500"></div>
              ))}
          </div>
          <div className="absolute bottom-10 left-10 grid grid-cols-5 gap-4">
            {Array(25)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-indigo-500"></div>
              ))}
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="relative z-10 p-6">
          {/* Cabeçalho com ícone e título */}
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 p-3 rounded-lg shadow-sm mr-4">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Configurar Reunião</h2>
              <p className="text-sm text-gray-600">Selecione a unidade e o tipo de reunião para continuar</p>
            </div>
          </div>

          {/* Indicador de progresso */}
          <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
            <div className="h-full w-1/3 bg-blue-600 rounded-full"></div>
          </div>

          {/* Formulário */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Unidade</label>
                <div className="relative">
                  <select
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                  >
                    <option value="">Selecione uma unidade</option>
                    {unidades.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nome}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                {!unidade && <p className="text-xs text-red-500">Este campo é obrigatório</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Tipo da Reunião</label>
                <div className="relative">
                  <select
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={tipoReuniao}
                    onChange={(e) => setTipoReuniao(e.target.value)}
                  >
                    <option value="">Selecione um tipo</option>
                    {tiposReuniao.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nome}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                {!tipoReuniao && <p className="text-xs text-red-500">Este campo é obrigatório</p>}
              </div>
            </div>
          </div>

          {/* Rodapé com botões e indicador de etapa */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="text-sm text-gray-500 flex items-center">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-medium mr-2">
                1
              </div>
              <span>Etapa 1 de 3: Configuração</span>
            </div>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-200"
                onClick={() => window.history.back()}
              >
                <span className="flex items-center gap-1">
                  <X className="h-4 w-4" />
                  Cancelar
                </span>
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-colors ${
                  !unidade || !tipoReuniao
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                onClick={onSalvar}
                disabled={!unidade || !tipoReuniao}
              >
                <span className="flex items-center gap-1">
                  Continuar
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Download, Upload, ChevronDown, Edit, Check } from "lucide-react"
import { CadastrarAreaModal } from "./cadastrar-area-modal"
import { EditarAreaModal } from "./editar-area-modal"
import { exportToCSV, readCSVFile } from "@/lib/export-import-utils"
import { useToast } from "@/components/ui/use-toast"

// Dados de exemplo para áreas
const areasData = [
  {
    id: 1,
    cargo: "Gerente",
    setores: "Produção",
    ativo: true,
    responsavel: true,
  },
  {
    id: 2,
    cargo: "Supervisor",
    setores: "Qualidade",
    ativo: true,
    responsavel: false,
  },
  {
    id: 3,
    cargo: "Coordenador",
    setores: "Manutenção",
    ativo: true,
    responsavel: true,
  },
  {
    id: 4,
    cargo: "Analista",
    setores: "Logística",
    ativo: false,
    responsavel: false,
  },
  {
    id: 5,
    cargo: "Técnico",
    setores: "Administrativo",
    ativo: true,
    responsavel: false,
  },
]

// Componente de seleção
const Select = ({ label, options, value, onChange, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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

export function CadastroAreas() {
  const [filtros, setFiltros] = useState({
    cargo: "",
    setores: "",
    ativo: "",
    responsavel: "",
  })
  const [areas, setAreas] = useState(areasData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentArea, setCurrentArea] = useState(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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

  const ativoOptions = [
    { value: "sim", label: "Sim" },
    { value: "nao", label: "Não" },
  ]

  const responsavelOptions = [
    { value: "sim", label: "Sim" },
    { value: "nao", label: "Não" },
  ]

  const handleChange = (field) => (e) => {
    setFiltros({ ...filtros, [field]: e.target.value })
  }

  const handleConsultar = () => {
    // Simulação de filtro para demonstração
    let filteredAreas = [...areasData]

    if (filtros.cargo) {
      const cargoSelecionado = cargoOptions.find((opt) => opt.value === filtros.cargo)?.label
      if (cargoSelecionado) {
        filteredAreas = filteredAreas.filter((area) => area.cargo === cargoSelecionado)
      }
    }

    if (filtros.setores) {
      const setorSelecionado = setoresOptions.find((opt) => opt.value === filtros.setores)?.label
      if (setorSelecionado) {
        filteredAreas = filteredAreas.filter((area) => area.setores === setorSelecionado)
      }
    }

    if (filtros.ativo) {
      const ativoValue = filtros.ativo === "sim"
      filteredAreas = filteredAreas.filter((area) => area.ativo === ativoValue)
    }

    if (filtros.responsavel) {
      const responsavelValue = filtros.responsavel === "sim"
      filteredAreas = filteredAreas.filter((area) => area.responsavel === responsavelValue)
    }

    setAreas(filteredAreas)
  }

  const handleTableSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSaveArea = (areaData) => {
    const novaArea = {
      id: areas.length + 1,
      cargo: areaData.cargo,
      setores: areaData.setores,
      ativo: areaData.ativo,
      responsavel: areaData.responsavel,
    }
    setAreas([novaArea, ...areas])
    setIsModalOpen(false)
  }

  const handleEditArea = (area) => {
    setCurrentArea(area)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setCurrentArea(null)
  }

  const handleUpdateArea = (updatedArea) => {
    const updatedAreas = areas.map((area) => (area.id === updatedArea.id ? updatedArea : area))
    setAreas(updatedAreas)
    setIsEditModalOpen(false)
    setCurrentArea(null)
  }

  const handleExport = () => {
    const dataToExport = areas.map((area) => ({
      id: area.id,
      cargo: area.cargo,
      setores: area.setores,
      ativo: area.ativo ? "Sim" : "Não",
      responsavel: area.responsavel ? "Sim" : "Não",
    }))

    exportToCSV(dataToExport, "areas.csv")
    toast({
      title: "Exportação concluída",
      description: "Os dados foram exportados com sucesso.",
    })
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const importedData = await readCSVFile(file)

      // Converte os dados importados para o formato correto
      const newAreas = importedData.map((item) => ({
        id: Number.parseInt(item.id) || Math.floor(Math.random() * 1000),
        cargo: item.cargo || "",
        setores: item.setores || "",
        ativo: item.ativo === "Sim" || item.ativo === true,
        responsavel: item.responsavel === "Sim" || item.responsavel === true,
      }))

      // Atualiza o estado com os dados importados
      setAreas(newAreas)

      toast({
        title: "Importação concluída",
        description: `${newAreas.length} áreas foram importadas com sucesso.`,
      })
    } catch (error) {
      console.error("Erro ao importar dados:", error)
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar os dados. Verifique o formato do arquivo.",
        variant: "destructive",
      })
    }

    // Limpa o input de arquivo
    if (event.target) {
      event.target.value = ""
    }
  }

  // Filtra a tabela com base no termo de busca
  const filteredAreas = searchTerm
    ? areas.filter((area) =>
        Object.values(area).some((value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : areas

  return (
    <div className="max-w-full mx-auto">
      {/* Cabeçalho */}
      <div className="bg-blue-500 text-white p-4 flex justify-between items-center mb-4 rounded-t-md">
        <h2 className="text-xl font-bold">Cadastro de Área</h2>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select label="Cargo" options={cargoOptions} value={filtros.cargo} onChange={handleChange("cargo")} />

          <Select label="Setores" options={setoresOptions} value={filtros.setores} onChange={handleChange("setores")} />

          <Select label="Ativo" options={ativoOptions} value={filtros.ativo} onChange={handleChange("ativo")} />

          <Select
            label="Responsável"
            options={responsavelOptions}
            value={filtros.responsavel}
            onChange={handleChange("responsavel")}
          />

          <Button onClick={handleConsultar} className="bg-blue-500 hover:bg-blue-600 text-white md:col-start-5">
            CONSULTAR
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-md shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex-1 mr-4">
              <Input placeholder="Buscar..." value={searchTerm} onChange={handleTableSearch} className="w-full" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleOpenModal}>
                <Plus size={16} />
                <span>Novo</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleExport}>
                <Download size={16} />
                <span>Exportar</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} />
                <span>Importar</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cargo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Setores
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ativo?
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Responsável?
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAreas.map((area) => (
                <tr key={area.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{area.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{area.cargo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{area.setores}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center justify-center">
                      <div
                        className={`h-4 w-4 rounded border ${
                          area.ativo ? "bg-green-500 border-green-600" : "border-gray-300"
                        } flex items-center justify-center`}
                      >
                        {area.ativo && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center justify-center">
                      <div
                        className={`h-4 w-4 rounded border ${
                          area.responsavel ? "bg-green-500 border-green-600" : "border-gray-300"
                        } flex items-center justify-center`}
                      >
                        {area.responsavel && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditArea(area)}>
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAreas.length === 0 && <div className="p-8 text-center text-gray-500">Nenhuma área encontrada.</div>}

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{filteredAreas.length}</span> de{" "}
            <span className="font-medium">{areasData.length}</span> áreas
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled>
              Próximo
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Cadastro de Área */}
      <CadastrarAreaModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveArea} />

      {/* Modal de Edição de Área */}
      {currentArea && (
        <EditarAreaModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleUpdateArea}
          areaData={currentArea}
        />
      )}
      <input type="file" ref={fileInputRef} accept=".csv" style={{ display: "none" }} onChange={handleImport} />
    </div>
  )
}

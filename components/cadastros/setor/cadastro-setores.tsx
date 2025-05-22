"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Download, Upload, Edit, Check, ChevronDown } from "lucide-react"
import { NovoSetorModal } from "./novo-setor-modal"
import { EditarSetorModal } from "./editar-setor-modal"
import { exportToCSV, readCSVFile } from "@/lib/export-import-utils"
import { useToast } from "@/components/ui/use-toast"

// Dados de exemplo para setores
const setoresData = [
  {
    id: 1,
    descricao: "Produção",
    ativo: true,
    unidade: "NOVA VENEZA - ABATE AVES",
    turno: "Primeiro",
    setorPai: null,
  },
  {
    id: 2,
    descricao: "Qualidade",
    ativo: true,
    unidade: "NOVA VENEZA - ABATE AVES",
    turno: "Administrativo",
    setorPai: null,
  },
  {
    id: 3,
    descricao: "Manutenção",
    ativo: true,
    unidade: "SIDROLÂNDIA - ABATE AVES",
    turno: "Segundo",
    setorPai: null,
  },
  {
    id: 4,
    descricao: "Logística",
    ativo: false,
    unidade: "TRINDADE DO SUL - ABATE AVES",
    turno: "Terceiro",
    setorPai: null,
  },
  {
    id: 5,
    descricao: "Administrativo",
    ativo: true,
    unidade: "CD Itajaí ME HUB",
    turno: "Administrativo",
    setorPai: null,
  },
  {
    id: 6,
    descricao: "Recepção",
    ativo: true,
    unidade: "MONTENEGRO - ABATE AVES",
    turno: "Primeiro",
    setorPai: "Produção",
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
        required
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

export function CadastroSetores() {
  const [filtros, setFiltros] = useState({
    unidade: "",
    turno: "",
    descricao: "",
    ativo: "",
  })
  const [setores, setSetores] = useState(setoresData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentSetor, setCurrentSetor] = useState(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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

  const ativoOptions = [
    { value: "sim", label: "Sim" },
    { value: "nao", label: "Não" },
  ]

  const handleChange = (field) => (e) => {
    setFiltros({ ...filtros, [field]: e.target.value })
  }

  const handleConsultar = () => {
    // Simulação de filtro para demonstração
    let filteredSetores = [...setoresData]

    if (filtros.descricao) {
      filteredSetores = filteredSetores.filter((setor) =>
        setor.descricao.toLowerCase().includes(filtros.descricao.toLowerCase()),
      )
    }

    if (filtros.unidade) {
      const unidadeSelecionada = unidadeOptions.find((opt) => opt.value === filtros.unidade)?.label
      if (unidadeSelecionada) {
        filteredSetores = filteredSetores.filter((setor) => setor.unidade === unidadeSelecionada)
      }
    }

    if (filtros.turno) {
      const turnoSelecionado = turnoOptions.find((opt) => opt.value === filtros.turno)?.label
      if (turnoSelecionado) {
        filteredSetores = filteredSetores.filter((setor) => setor.turno === turnoSelecionado)
      }
    }

    if (filtros.ativo) {
      const ativoValue = filtros.ativo === "sim"
      filteredSetores = filteredSetores.filter((setor) => setor.ativo === ativoValue)
    }

    setSetores(filteredSetores)
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

  const handleSaveSetor = (setorData) => {
    const novoSetor = {
      id: setores.length + 1,
      descricao: setorData.descricao,
      ativo: setorData.ativo,
      unidade: setorData.unidade,
      turno: setorData.turno,
      setorPai: setorData.setorPai ? setorData.setorPaiSelecionado : null,
    }
    setSetores([novoSetor, ...setores])
    setIsModalOpen(false)
  }

  const handleEditSetor = (setor) => {
    setCurrentSetor(setor)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setCurrentSetor(null)
  }

  const handleUpdateSetor = (updatedSetor) => {
    const updatedSetores = setores.map((setor) => (setor.id === updatedSetor.id ? updatedSetor : setor))
    setSetores(updatedSetores)
    setIsEditModalOpen(false)
    setCurrentSetor(null)
  }

  const handleExport = () => {
    const dataToExport = setores.map((setor) => ({
      id: setor.id,
      descricao: setor.descricao,
      ativo: setor.ativo ? "Sim" : "Não",
      unidade: setor.unidade,
      turno: setor.turno,
      setorPai: setor.setorPai || "",
    }))

    exportToCSV(dataToExport, "setores.csv")
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
      const newSetores = importedData.map((item) => ({
        id: Number.parseInt(item.id) || Math.floor(Math.random() * 1000),
        descricao: item.descricao || "",
        ativo: item.ativo === "Sim" || item.ativo === true,
        unidade: item.unidade || "",
        turno: item.turno || "",
        setorPai: item.setorPai || null,
      }))

      // Atualiza o estado com os dados importados
      setSetores(newSetores)

      toast({
        title: "Importação concluída",
        description: `${newSetores.length} setores foram importados com sucesso.`,
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
  const filteredSetores = searchTerm
    ? setores.filter((setor) =>
        Object.values(setor).some(
          (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    : setores

  return (
    <div className="max-w-full mx-auto">
      {/* Cabeçalho - Alterado de orange-500 para red-500 */}
      <div className="bg-blue-500 text-white p-4 flex justify-between items-center mb-4 rounded-t-md">
        <h2 className="text-xl font-bold">Cadastro de Setor</h2>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select label="Unidade" options={unidadeOptions} value={filtros.unidade} onChange={handleChange("unidade")} />

          <Select label="Turno" options={turnoOptions} value={filtros.turno} onChange={handleChange("turno")} />

          <Input
            placeholder="Descrição"
            value={filtros.descricao}
            onChange={handleChange("descricao")}
            className="border border-gray-300"
          />

          <Select label="Ativo" options={ativoOptions} value={filtros.ativo} onChange={handleChange("ativo")} />

          {/* Botão CONSULTAR - Alterado de orange-500/600 para red-500/600 */}
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
                  Descrição
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
                  Unidade
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Turno
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Setor Pai
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
              {filteredSetores.map((setor) => (
                <tr key={setor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{setor.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{setor.descricao}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center justify-center">
                      <div
                        className={`h-4 w-4 rounded border ${
                          setor.ativo ? "bg-green-500 border-green-600" : "border-gray-300"
                        } flex items-center justify-center`}
                      >
                        {setor.ativo && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{setor.unidade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{setor.turno}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{setor.setorPai || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditSetor(setor)}>
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSetores.length === 0 && <div className="p-8 text-center text-gray-500">Nenhum setor encontrado.</div>}

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{filteredSetores.length}</span> de{" "}
            <span className="font-medium">{setoresData.length}</span> setores
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

      {/* Modal de Novo Setor */}
      <NovoSetorModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveSetor} />

      {/* Modal de Editar Setor */}
      {currentSetor && (
        <EditarSetorModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleUpdateSetor}
          setor={currentSetor}
        />
      )}
      <input type="file" ref={fileInputRef} accept=".csv" style={{ display: "none" }} onChange={handleImport} />
    </div>
  )
}

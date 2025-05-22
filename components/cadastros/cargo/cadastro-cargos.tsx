"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Download, Upload, Edit, Check, ChevronDown } from "lucide-react"
import { CadastrarCargoModal } from "./cadastrar-cargo-modal"
import { Label } from "@/components/ui/label"
import { exportToCSV, readCSVFile } from "@/lib/export-import-utils"
import { useToast } from "@/components/ui/use-toast"

// Dados de exemplo para cargos
const cargosData = [
  {
    id: 1,
    descricao: "Gerente",
    ativo: true,
    unidade: "NOVA VENEZA - ABATE AVES",
    setores: "Produção",
  },
  {
    id: 2,
    descricao: "Supervisor",
    ativo: true,
    unidade: "NOVA VENEZA - ABATE AVES",
    setores: "Qualidade",
  },
  {
    id: 3,
    descricao: "Coordenador",
    ativo: true,
    unidade: "SIDROLÂNDIA - ABATE AVES",
    setores: "Manutenção",
  },
  {
    id: 4,
    descricao: "Analista",
    ativo: false,
    unidade: "TRINDADE DO SUL - ABATE AVES",
    setores: "Logística",
  },
  {
    id: 5,
    descricao: "Técnico",
    ativo: true,
    unidade: "CD Itajaí ME HUB",
    setores: "Administrativo",
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

export function CadastroCargos() {
  const [filtros, setFiltros] = useState({
    unidade: "",
    setores: "",
    descricao: "",
    ativo: "",
  })
  const [cargos, setCargos] = useState(cargosData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cargoParaEditar, setCargoParaEditar] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAtivoEdit, setIsAtivoEdit] = useState(false)
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

  const handleChange = (field) => (e) => {
    setFiltros({ ...filtros, [field]: e.target.value })
  }

  const handleConsultar = () => {
    // Simulação de filtro para demonstração
    let filteredCargos = [...cargosData]

    if (filtros.descricao) {
      filteredCargos = filteredCargos.filter((cargo) =>
        cargo.descricao.toLowerCase().includes(filtros.descricao.toLowerCase()),
      )
    }

    if (filtros.unidade) {
      const unidadeSelecionada = unidadeOptions.find((opt) => opt.value === filtros.unidade)?.label
      if (unidadeSelecionada) {
        filteredCargos = filteredCargos.filter((cargo) => cargo.unidade === unidadeSelecionada)
      }
    }

    if (filtros.setores) {
      const setorSelecionado = setoresOptions.find((opt) => opt.value === filtros.setores)?.label
      if (setorSelecionado) {
        filteredCargos = filteredCargos.filter((cargo) => cargo.setores === setorSelecionado)
      }
    }

    if (filtros.ativo) {
      const ativoValue = filtros.ativo === "sim"
      filteredCargos = filteredCargos.filter((cargo) => cargo.ativo === ativoValue)
    }

    setCargos(filteredCargos)
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

  const handleSaveCargo = (cargoData) => {
    const novoCargo = {
      id: cargos.length + 1,
      descricao: cargoData.descricao,
      ativo: cargoData.ativo,
      unidade: cargoData.unidade,
      setores: cargoData.setores,
    }
    setCargos([novoCargo, ...cargos])
    setIsModalOpen(false)
  }

  const handleEditCargo = (cargo) => {
    setCargoParaEditar(cargo)
    setIsAtivoEdit(cargo.ativo)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setCargoParaEditar(null)
  }

  const handleAtivoChange = (e) => {
    console.log("Switch toggled:", e.target.checked)
    setIsAtivoEdit(e.target.checked)
  }

  const handleUpdateCargo = (cargoAtualizado) => {
    setCargos(
      cargos.map((cargo) => (cargo.id === cargoAtualizado.id ? { ...cargoAtualizado, ativo: isAtivoEdit } : cargo)),
    )
    setIsEditModalOpen(false)
    setCargoParaEditar(null)
  }

  const handleExport = () => {
    const dataToExport = cargos.map((cargo) => ({
      id: cargo.id,
      descricao: cargo.descricao,
      ativo: cargo.ativo ? "Sim" : "Não",
      unidade: cargo.unidade,
      setores: cargo.setores,
    }))

    exportToCSV(dataToExport, "cargos.csv")
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
      const newCargos = importedData.map((item) => ({
        id: Number.parseInt(item.id) || Math.floor(Math.random() * 1000),
        descricao: item.descricao || "",
        ativo: item.ativo === "Sim" || item.ativo === true,
        unidade: item.unidade || "",
        setores: item.setores || "",
      }))

      // Atualiza o estado com os dados importados
      setCargos(newCargos)

      toast({
        title: "Importação concluída",
        description: `${newCargos.length} cargos foram importados com sucesso.`,
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
  const filteredCargos = searchTerm
    ? cargos.filter((cargo) =>
        Object.values(cargo).some(
          (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    : cargos

  return (
    <div className="max-w-full mx-auto">
      {/* Cabeçalho - Alterado de orange-500 para red-500 */}
      <div className="bg-blue-500 text-white p-4 flex justify-between items-center mb-4 rounded-t-md">
        <h2 className="text-xl font-bold">Cadastro de Cargo</h2>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select label="Unidade" options={unidadeOptions} value={filtros.unidade} onChange={handleChange("unidade")} />

          <Select label="Setores" options={setoresOptions} value={filtros.setores} onChange={handleChange("setores")} />

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
                  Setores
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
              {filteredCargos.map((cargo) => (
                <tr key={cargo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cargo.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cargo.descricao}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center justify-center">
                      <div
                        className={`h-4 w-4 rounded border ${
                          cargo.ativo ? "bg-green-500 border-green-600" : "border-gray-300"
                        } flex items-center justify-center`}
                      >
                        {cargo.ativo && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cargo.unidade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cargo.setores}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditCargo(cargo)}>
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCargos.length === 0 && <div className="p-8 text-center text-gray-500">Nenhum cargo encontrado.</div>}

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{filteredCargos.length}</span> de{" "}
            <span className="font-medium">{cargosData.length}</span> cargos
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

      {/* Modal de Cadastro de Cargo */}
      <CadastrarCargoModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveCargo} />

      {/* Modal de Edição de Cargo */}
      {isEditModalOpen && cargoParaEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="bg-blue-500 text-white p-4 flex justify-between items-center rounded-t-lg">
              <h3 className="text-xl font-semibold text-white">Editar Cargo</h3>
              <button onClick={handleCloseEditModal} className="text-white">
                &times;
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                handleUpdateCargo({
                  ...cargoParaEditar,
                  descricao: formData.get("descricao"),
                  ativo: document.getElementById("ativo-edit").checked,
                })
              }}
              className="p-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Input
                      name="descricao"
                      placeholder="Descrição"
                      defaultValue={cargoParaEditar.descricao}
                      className="border border-gray-300 w-full"
                      required
                    />
                  </div>

                  <div className="ml-4 flex items-center">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="ativo-edit"
                        name="ativo"
                        checked={isAtivoEdit}
                        onChange={handleAtivoChange}
                        className="opacity-0 absolute block w-6 h-6 rounded-full bg-white border-4 cursor-pointer"
                      />
                      <label
                        htmlFor="ativo-edit"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                          isAtivoEdit ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                            isAtivoEdit ? "transform translate-x-4" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                    <Label htmlFor="ativo-edit" className="cursor-pointer">
                      {isAtivoEdit ? "Ativo" : "Inativo"}
                    </Label>
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">Unidade</Label>
                  <Input
                    value={cargoParaEditar.unidade}
                    className="border border-gray-300 w-full bg-gray-100"
                    disabled
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">Setores</Label>
                  <Input
                    value={cargoParaEditar.setores}
                    className="border border-gray-300 w-full bg-gray-100"
                    disabled
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseEditModal}
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
      )}
      <input type="file" ref={fileInputRef} accept=".csv" style={{ display: "none" }} onChange={handleImport} />
    </div>
  )
}

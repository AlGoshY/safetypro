"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Download, Upload, Edit, Check, ChevronDown } from "lucide-react"
// Atualizar importação do modal
import { NovaEmpresaModal } from "./nova-empresa-modal"
import { exportToCSV, readCSVFile } from "@/lib/export-import-utils"
import { useToast } from "@/components/ui/use-toast"

// Substituir os dados de exemplo para remover referências a JBS e SEARA
const empresasData = [
  {
    codigo: "001",
    razaoSocial: "Empresa ABC Ltda",
    fantasia: "ABC",
    cnpj: "02.914.460/0001-50",
    ativo: true,
    tipo: "Matriz",
    regional: "Sul",
    endereco: "Av. Principal, 500",
    cidade: "São Paulo",
    estado: "SP",
    telefone: "(11) 3144-4000",
    email: "contato@empresaabc.com.br",
  },
  {
    codigo: "002",
    razaoSocial: "Empresa ABC Ltda - Filial Nova Veneza",
    fantasia: "ABC Nova Veneza",
    cnpj: "02.914.460/0002-31",
    ativo: true,
    tipo: "Unidade Produtiva",
    regional: "Sul",
    endereco: "Rodovia SC-447, Km 5",
    cidade: "Nova Veneza",
    estado: "SC",
    telefone: "(48) 3476-1200",
    email: "novaveneza@empresaabc.com.br",
  },
  {
    codigo: "003",
    razaoSocial: "Empresa ABC Ltda - Filial Sidrolândia",
    fantasia: "ABC Sidrolândia",
    cnpj: "02.914.460/0003-12",
    ativo: true,
    tipo: "Unidade Produtiva",
    regional: "Centro-Oeste",
    endereco: "Rodovia MS-162, Km 10",
    cidade: "Sidrolândia",
    estado: "MS",
    telefone: "(67) 3272-1500",
    email: "sidrolandia@empresaabc.com.br",
  },
  {
    codigo: "004",
    razaoSocial: "Empresa ABC Ltda - Filial Trindade do Sul",
    fantasia: "ABC Trindade do Sul",
    cnpj: "02.914.460/0004-03",
    ativo: true,
    tipo: "Unidade Produtiva",
    regional: "Sul",
    endereco: "Rodovia RS-324, Km 45",
    cidade: "Trindade do Sul",
    estado: "RS",
    telefone: "(54) 3541-1300",
    email: "trindadedosul@empresaabc.com.br",
  },
  {
    codigo: "005",
    razaoSocial: "Empresa ABC Ltda - CD Itajaí",
    fantasia: "CD Itajaí",
    cnpj: "02.914.460/0005-94",
    ativo: false,
    tipo: "Centro de Distribuição",
    regional: "Sul",
    endereco: "Rodovia SC-486, Km 4",
    cidade: "Itajaí",
    estado: "SC",
    telefone: "(47) 3346-2000",
    email: "cditajai@empresaabc.com.br",
  },
  {
    codigo: "006",
    razaoSocial: "Empresa ABC Ltda - Filial Montenegro",
    fantasia: "ABC Montenegro",
    cnpj: "02.914.460/0006-75",
    ativo: true,
    tipo: "Unidade Produtiva",
    regional: "Sul",
    endereco: "Rodovia RS-240, Km 30",
    cidade: "Montenegro",
    estado: "RS",
    telefone: "(51) 3632-8500",
    email: "montenegro@empresaabc.com.br",
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

export function CadastroEmpresas() {
  const [filtros, setFiltros] = useState({
    regional: "",
    tipo: "",
    razaoSocial: "",
    ativo: "",
  })
  const [empresas, setEmpresas] = useState(empresasData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmpresa, setEditingEmpresa] = useState(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Opções para os selects
  const regionalOptions = [
    { value: "sul", label: "Sul" },
    { value: "sudeste", label: "Sudeste" },
    { value: "centro-oeste", label: "Centro-Oeste" },
    { value: "nordeste", label: "Nordeste" },
    { value: "norte", label: "Norte" },
  ]

  const tipoOptions = [
    { value: "matriz", label: "Matriz" },
    { value: "unidade-produtiva", label: "Unidade Produtiva" },
    { value: "centro-distribuicao", label: "Centro de Distribuição" },
    { value: "escritorio", label: "Escritório" },
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
    let filteredEmpresas = [...empresasData]

    if (filtros.razaoSocial) {
      filteredEmpresas = filteredEmpresas.filter(
        (empresa) =>
          empresa.razaoSocial.toLowerCase().includes(filtros.razaoSocial.toLowerCase()) ||
          empresa.fantasia.toLowerCase().includes(filtros.razaoSocial.toLowerCase()),
      )
    }

    if (filtros.regional) {
      const regionalSelecionada = regionalOptions.find((opt) => opt.value === filtros.regional)?.label
      if (regionalSelecionada) {
        filteredEmpresas = filteredEmpresas.filter((empresa) => empresa.regional === regionalSelecionada)
      }
    }

    if (filtros.tipo) {
      const tipoSelecionado = tipoOptions.find((opt) => opt.value === filtros.tipo)?.label
      if (tipoSelecionado) {
        filteredEmpresas = filteredEmpresas.filter((empresa) => empresa.tipo === tipoSelecionado)
      }
    }

    if (filtros.ativo) {
      const ativoValue = filtros.ativo === "sim"
      filteredEmpresas = filteredEmpresas.filter((empresa) => empresa.ativo === ativoValue)
    }

    setEmpresas(filteredEmpresas)
  }

  const handleTableSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleOpenModal = () => {
    setEditingEmpresa(null)
    setIsModalOpen(true)
  }

  const handleEditEmpresa = (empresa) => {
    setEditingEmpresa(empresa)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleUpdateEmpresa = (updatedEmpresaData) => {
    const updatedEmpresas = empresas.map((empresa) =>
      empresa.codigo === updatedEmpresaData.codigo ? { ...empresa, ...updatedEmpresaData } : empresa,
    )
    setEmpresas(updatedEmpresas)
    setIsModalOpen(false)
    setEditingEmpresa(null)
  }

  const handleSaveEmpresa = (empresaData) => {
    if (editingEmpresa) {
      // Atualizar empresa existente
      handleUpdateEmpresa(empresaData)
    } else {
      // Adicionar nova empresa
      const novoCodigo = empresaData.codigo || String(Math.floor(1000 + Math.random() * 9000)).padStart(3, "0")
      const novaEmpresa = {
        codigo: novoCodigo,
        razaoSocial: empresaData.razaoSocial,
        fantasia: empresaData.fantasia,
        cnpj: empresaData.cnpj,
        ativo: empresaData.ativo,
        tipo: empresaData.tipo,
        regional: empresaData.regional,
        endereco: `${empresaData.endereco}, ${empresaData.numero} ${empresaData.complemento || ""}`,
        cidade: empresaData.cidade,
        estado: empresaData.estado,
        telefone: empresaData.telefone,
        email: empresaData.email,
      }
      setEmpresas([novaEmpresa, ...empresas])
      setIsModalOpen(false)
    }
  }

  const handleExport = () => {
    const dataToExport = empresas.map((empresa) => ({
      codigo: empresa.codigo,
      razaoSocial: empresa.razaoSocial,
      fantasia: empresa.fantasia,
      cnpj: empresa.cnpj,
      ativo: empresa.ativo ? "Sim" : "Não",
      tipo: empresa.tipo,
      regional: empresa.regional,
      endereco: empresa.endereco,
      cidade: empresa.cidade,
      estado: empresa.estado,
      telefone: empresa.telefone,
      email: empresa.email,
    }))

    exportToCSV(dataToExport, "empresas.csv")
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
      const newEmpresas = importedData.map((item) => ({
        codigo: item.codigo || String(Math.floor(1000 + Math.random() * 9000)).padStart(3, "0"),
        razaoSocial: item.razaoSocial || "",
        fantasia: item.fantasia || "",
        cnpj: item.cnpj || "",
        ativo: item.ativo === "Sim" || item.ativo === true,
        tipo: item.tipo || "",
        regional: item.regional || "",
        endereco: item.endereco || "",
        cidade: item.cidade || "",
        estado: item.estado || "",
        telefone: item.telefone || "",
        email: item.email || "",
      }))

      // Atualiza o estado com os dados importados
      setEmpresas(newEmpresas)

      toast({
        title: "Importação concluída",
        description: `${newEmpresas.length} empresas foram importadas com sucesso.`,
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
  const filteredEmpresas = searchTerm
    ? empresas.filter((empresa) =>
        Object.values(empresa).some(
          (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    : empresas

  return (
    <div className="max-w-full mx-auto">
      {/* Cabeçalho */}
      <div className="bg-blue-500 text-white p-4 flex justify-between items-center mb-4 rounded-t-md">
        <h2 className="text-xl font-bold">Cadastro de empresa</h2>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Regional"
            options={regionalOptions}
            value={filtros.regional}
            onChange={handleChange("regional")}
          />

          <Select label="Tipo" options={tipoOptions} value={filtros.tipo} onChange={handleChange("tipo")} />

          <Input
            placeholder="Razão Social/Fantasia"
            value={filtros.razaoSocial}
            onChange={handleChange("razaoSocial")}
            className="border border-gray-300"
          />

          <Select label="Ativo" options={ativoOptions} value={filtros.ativo} onChange={handleChange("ativo")} />

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
                  Código
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Razão Social
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fantasia
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  CNPJ
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
                  Tipo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Regional
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
              {filteredEmpresas.map((empresa, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.razaoSocial}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{empresa.fantasia}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{empresa.cnpj}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center justify-center">
                      <div
                        className={`h-4 w-4 rounded border ${
                          empresa.ativo ? "bg-green-500 border-green-600" : "border-gray-300"
                        } flex items-center justify-center`}
                      >
                        {empresa.ativo && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{empresa.tipo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{empresa.regional}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditEmpresa(empresa)}>
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmpresas.length === 0 && (
          <div className="p-8 text-center text-gray-500">Nenhuma empresa encontrada.</div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{filteredEmpresas.length}</span> de{" "}
            <span className="font-medium">{empresasData.length}</span> empresas
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

      {/* Modal de Nova Empresa */}
      <NovaEmpresaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEmpresa}
        editingEmpresa={editingEmpresa}
      />
      <input type="file" ref={fileInputRef} accept=".csv" style={{ display: "none" }} onChange={handleImport} />
    </div>
  )
}

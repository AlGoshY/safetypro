"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Download, Upload, Edit, Check, ChevronDown } from "lucide-react"
import { exportToCSV, readCSVFile } from "@/lib/export-import-utils"
import { useToast } from "@/components/ui/use-toast"

// Atualizar importação do modal
import NovoUsuarioModal from "./novo-usuario-modal"

// Atualizar os dados de exemplo para incluir os novos campos
const usuariosData = [
  {
    codigo: "17625",
    nome: "Jessica Amoud Lima",
    cpf: "123.456.789-00",
    email: "jessica.amoud@empresaabc.com.br",
    ativo: true,
    unidade: "NOVA VENEZA - ABATE AVES",
    perfil: "Digitador",
    setor: "Produção",
    cargo: "Analista",
    area: "Gerência de Produção",
  },
  {
    codigo: "17366",
    nome: "Michelli Rodrigues de Souza",
    cpf: "987.654.321-00",
    email: "michelli.souza@empresaabc.com.br",
    ativo: false,
    unidade: "SIDROLÂNDIA - ABATE AVES",
    perfil: "Liderança",
    setor: "Qualidade",
    cargo: "Supervisor",
    area: "Supervisão de Qualidade",
  },
  {
    codigo: "6905",
    nome: "---",
    cpf: "---",
    email: "---",
    ativo: false,
    unidade: "TRINDADE DO SUL - ABATE AVES",
    perfil: "Digitador",
    setor: "Manutenção",
    cargo: "Técnico",
    area: "Coordenação de Manutenção",
  },
  {
    codigo: "17850",
    nome: "---",
    cpf: "111.222.333-44",
    email: "lima.pinheiro@empresaabc.com.br",
    ativo: false,
    unidade: "CD Itajaí ME HUB",
    perfil: "Liderança",
    setor: "Logística",
    cargo: "Coordenador",
    area: "Análise de Logística",
  },
  {
    codigo: "2729",
    nome: "---",
    cpf: "---",
    email: "---",
    ativo: false,
    unidade: "MONTENEGRO - ABATE AVES",
    perfil: "Liderança,Gestão",
    setor: "Administrativo",
    cargo: "Gerente",
    area: "Técnico Administrativo",
  },
  {
    codigo: "15249",
    nome: "A9984r5tg_",
    cpf: "555.666.777-88",
    email: "a2345yujncf@empresaabc.com.br",
    ativo: false,
    unidade: "",
    perfil: "",
    setor: "",
    cargo: "",
    area: "",
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

export function CadastroUsuarios() {
  // Adicionar os novos filtros
  const [filtros, setFiltros] = useState({
    unidade: "",
    perfil: "",
    nomeLogin: "",
    ativo: "",
    setor: "",
    cargo: "",
    area: "",
  })
  const [usuarios, setUsuarios] = useState(usuariosData)
  const [searchTerm, setSearchTerm] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Adicione estes estados dentro da função CadastroUsuarios (após os estados existentes):
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  // Substituir as opções de unidades para remover referências a JBS e SEARA
  const unidadeOptions = [
    { value: "nova-veneza", label: "NOVA VENEZA - ABATE AVES" },
    { value: "sidrolandia", label: "SIDROLÂNDIA - ABATE AVES" },
    { value: "trindade", label: "TRINDADE DO SUL - ABATE AVES" },
    { value: "itajai", label: "CD Itajaí ME HUB" },
    { value: "montenegro", label: "MONTENEGRO - ABATE AVES" },
  ]

  const perfilOptions = [
    { value: "digitador", label: "Digitador" },
    { value: "lideranca", label: "Liderança" },
    { value: "gestao", label: "Gestão" },
  ]

  const ativoOptions = [
    { value: "sim", label: "Sim" },
    { value: "nao", label: "Não" },
  ]

  // Adicionar as opções para os novos selects
  const setorOptions = [
    { value: "producao", label: "Produção" },
    { value: "qualidade", label: "Qualidade" },
    { value: "manutencao", label: "Manutenção" },
    { value: "logistica", label: "Logística" },
    { value: "administrativo", label: "Administrativo" },
  ]

  const cargoOptions = [
    { value: "gerente", label: "Gerente" },
    { value: "supervisor", label: "Supervisor" },
    { value: "coordenador", label: "Coordenador" },
    { value: "analista", label: "Analista" },
    { value: "tecnico", label: "Técnico" },
  ]

  const areaOptions = [
    { value: "producao-gerencia", label: "Gerência de Produção" },
    { value: "qualidade-supervisao", label: "Supervisão de Qualidade" },
    { value: "manutencao-coordenacao", label: "Coordenação de Manutenção" },
    { value: "logistica-analise", label: "Análise de Logística" },
    { value: "administrativo-tecnico", label: "Técnico Administrativo" },
  ]

  const handleChange = (field) => (e) => {
    setFiltros({ ...filtros, [field]: e.target.value })
  }

  // Atualizar a função handleConsultar para incluir os novos filtros
  const handleConsultar = () => {
    // Aqui você implementaria a lógica de filtro real
    console.log("Consultando com filtros:", filtros)

    // Simulação de filtro para demonstração
    let filteredUsuarios = [...usuariosData]

    if (filtros.nomeLogin) {
      filteredUsuarios = filteredUsuarios.filter(
        (user) =>
          user.nome.toLowerCase().includes(filtros.nomeLogin.toLowerCase()) ||
          user.email.toLowerCase().includes(filtros.nomeLogin.toLowerCase()),
      )
    }

    if (filtros.unidade) {
      const unidadeSelecionada = unidadeOptions.find((opt) => opt.value === filtros.unidade)?.label
      if (unidadeSelecionada) {
        filteredUsuarios = filteredUsuarios.filter((user) => user.unidade === unidadeSelecionada)
      }
    }

    if (filtros.perfil) {
      const perfilSelecionado = perfilOptions.find((opt) => opt.value === filtros.perfil)?.label
      if (perfilSelecionado) {
        filteredUsuarios = filteredUsuarios.filter((user) => user.perfil.includes(perfilSelecionado))
      }
    }

    if (filtros.ativo) {
      const ativoValue = filtros.ativo === "sim"
      filteredUsuarios = filteredUsuarios.filter((user) => user.ativo === ativoValue)
    }

    if (filtros.setor) {
      const setorSelecionado = setorOptions.find((opt) => opt.value === filtros.setor)?.label
      if (setorSelecionado) {
        filteredUsuarios = filteredUsuarios.filter((user) => user.setor === setorSelecionado)
      }
    }

    if (filtros.cargo) {
      const cargoSelecionado = cargoOptions.find((opt) => opt.value === filtros.cargo)?.label
      if (cargoSelecionado) {
        filteredUsuarios = filteredUsuarios.filter((user) => user.cargo === cargoSelecionado)
      }
    }

    if (filtros.area) {
      const areaSelecionada = areaOptions.find((opt) => opt.value === filtros.area)?.label
      if (areaSelecionada) {
        filteredUsuarios = filteredUsuarios.filter((user) => user.area === areaSelecionada)
      }
    }

    setUsuarios(filteredUsuarios)
  }

  const handleTableSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // Adicione estas funções dentro da função CadastroUsuarios (antes do return):
  // Modifique a função handleOpenModal para garantir que o editingUser seja limpo
  const handleOpenModal = () => {
    setEditingUser(null) // Limpa qualquer usuário que estava sendo editado
    setIsModalOpen(true)
  }

  // Modifique a função handleEditUser para garantir que o modal seja aberto corretamente
  const handleEditUser = (user) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleUpdateUser = (updatedUserData) => {
    const updatedUsuarios = usuarios.map((user) =>
      user.codigo === updatedUserData.codigo ? { ...user, ...updatedUserData } : user,
    )
    setUsuarios(updatedUsuarios)
    setIsModalOpen(false)
    setEditingUser(null)
  }

  const handleSaveUser = (userData) => {
    if (editingUser) {
      // Atualizar usuário existente
      handleUpdateUser(userData)
    } else {
      // Adicionar novo usuário
      const novoCodigo = userData.codigo || Math.floor(10000 + Math.random() * 90000).toString()
      const novoUsuario = {
        codigo: novoCodigo,
        nome: userData.nome,
        cpf: userData.cpf,
        email: userData.email,
        login: userData.login,
        ativo: userData.ativo,
        unidade: userData.unidade, // Agora vem do select
        perfil: userData.perfil, // Agora vem do select
        setor: userData.setor,
        cargo: userData.cargo,
        area: userData.area,
      }
      setUsuarios([novoUsuario, ...usuarios])
      setIsModalOpen(false)
    }
  }

  const handleExport = () => {
    const dataToExport = usuarios.map((usuario) => ({
      codigo: usuario.codigo,
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      ativo: usuario.ativo ? "Sim" : "Não",
      unidade: usuario.unidade,
      perfil: usuario.perfil,
      setor: usuario.setor || "",
      cargo: usuario.cargo || "",
      area: usuario.area || "",
    }))

    exportToCSV(dataToExport, "usuarios.csv")
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
      const newUsuarios = importedData.map((item) => ({
        codigo: item.codigo || Math.floor(10000 + Math.random() * 90000).toString(),
        nome: item.nome || "",
        cpf: item.cpf || "",
        email: item.email || "",
        ativo: item.ativo === "Sim" || item.ativo === true,
        unidade: item.unidade || "",
        perfil: item.perfil || "",
        setor: item.setor || "",
        cargo: item.cargo || "",
        area: item.area || "",
      }))

      // Atualiza o estado com os dados importados
      setUsuarios(newUsuarios)

      toast({
        title: "Importação concluída",
        description: `${newUsuarios.length} usuários foram importados com sucesso.`,
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
  const filteredUsuarios = searchTerm
    ? usuarios.filter((user) =>
        Object.values(user).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : usuarios

  return (
    <div className="max-w-full mx-auto">
      {/* Cabeçalho - Alterado de orange-500 para red-500 */}
      <div className="bg-blue-500 text-white p-4 flex justify-between items-center mb-4 rounded-t-md">
        <h2 className="text-xl font-bold">Cadastro de usuário</h2>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select label="Unidade" options={unidadeOptions} value={filtros.unidade} onChange={handleChange("unidade")} />

          <Select label="Perfil" options={perfilOptions} value={filtros.perfil} onChange={handleChange("perfil")} />

          <Input
            placeholder="Nome/Login"
            value={filtros.nomeLogin}
            onChange={handleChange("nomeLogin")}
            className="border border-gray-300"
          />

          <Select label="Ativo" options={ativoOptions} value={filtros.ativo} onChange={handleChange("ativo")} />

          <Select label="Setor" options={setorOptions} value={filtros.setor} onChange={handleChange("setor")} />

          <Select label="Cargo" options={cargoOptions} value={filtros.cargo} onChange={handleChange("cargo")} />

          <Select label="Área" options={areaOptions} value={filtros.area} onChange={handleChange("area")} />

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
              {/* Modifique o botão "Novo" na seção da tabela para abrir o modal: */}
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
                  Nome
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  CPF
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  E-Mail
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
                  Perfil
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Setor
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
                  Área
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
              {filteredUsuarios.map((usuario, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.cpf}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center justify-center">
                      <div
                        className={`h-4 w-4 rounded border ${usuario.ativo ? "bg-green-500 border-green-600" : "border-gray-300"} flex items-center justify-center`}
                      >
                        {usuario.ativo && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.unidade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.perfil}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.setor || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.cargo || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.area || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* Alterado de orange-500/700 para red-500/700 */}
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditUser(usuario)}>
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsuarios.length === 0 && (
          <div className="p-8 text-center text-gray-500">Nenhum usuário encontrado.</div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{filteredUsuarios.length}</span> de{" "}
            <span className="font-medium">{usuariosData.length}</span> usuários
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
      {/* Modal de Novo Usuário */}
      <NovoUsuarioModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        editingUser={editingUser}
      />
      <input type="file" ref={fileInputRef} accept=".csv" style={{ display: "none" }} onChange={handleImport} />
    </div>
  )
}

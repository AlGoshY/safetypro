"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Download, Upload, Edit, ChevronDown } from "lucide-react"
// Atualizar importações dos modais
import NovoUsuarioModal from "./novo-usuario-modal"
import { EditarUsuarioModal } from "./editar-usuario-modal"

// Substituir os dados de exemplo para remover referências a JBS e SEARA
const usuariosData = [
  {
    codigo: "17625",
    nome: "Jessica Amoud Lima",
    cpf: "123.456.789-00",
    email: "jessica.amoud@empresaabc.com.br",
    login: "jessica.amoud",
    ativo: true,
    unidade: "NOVA VENEZA - ABATE AVES",
    perfil: "Digitador",
  },
  {
    codigo: "17366",
    nome: "Michelli Rodrigues de Souza",
    cpf: "987.654.321-00",
    email: "michelli.souza@empresaabc.com.br",
    login: "michelli.souza",
    ativo: false,
    unidade: "SIDROLÂNDIA - ABATE AVES",
    perfil: "Liderança",
  },
  {
    codigo: "6905",
    nome: "---",
    cpf: "---",
    email: "---",
    login: "---",
    ativo: false,
    unidade: "TRINDADE DO SUL - ABATE AVES",
    perfil: "Digitador",
  },
  {
    codigo: "17850",
    nome: "---",
    cpf: "111.222.333-44",
    email: "lima.pinheiro@empresaabc.com.br",
    login: "lima.pinheiro",
    ativo: false,
    unidade: "CD Itajaí ME HUB",
    perfil: "Liderança",
  },
  {
    codigo: "2729",
    nome: "---",
    cpf: "---",
    email: "---",
    login: "---",
    ativo: false,
    unidade: "MONTENEGRO - ABATE AVES",
    perfil: "Liderança,Gestão",
  },
  {
    codigo: "15249",
    nome: "A9984r5tg_",
    cpf: "555.666.777-88",
    email: "a2345yujncf@empresaabc.com.br",
    login: "a9984r5tg",
    ativo: false,
    unidade: "",
    perfil: "",
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

export function CadastroUsuariosCompleto() {
  const [filtros, setFiltros] = useState({
    unidade: "",
    perfil: "",
    nomeLogin: "",
    ativo: "",
  })
  const [usuarios, setUsuarios] = useState(usuariosData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isNovoModalOpen, setIsNovoModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
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

  const handleChange = (field) => (e) => {
    setFiltros({ ...filtros, [field]: e.target.value })
  }

  const handleConsultar = () => {
    // Aqui você implementaria a lógica de filtro real
    console.log("Consultando com filtros:", filtros)

    // Simulação de filtro para demonstração
    let filteredUsuarios = [...usuariosData]

    if (filtros.nomeLogin) {
      filteredUsuarios = filteredUsuarios.filter(
        (user) =>
          user.nome.toLowerCase().includes(filtros.nomeLogin.toLowerCase()) ||
          user.email.toLowerCase().includes(filtros.nomeLogin.toLowerCase()) ||
          (user.login && user.login.toLowerCase().includes(filtros.nomeLogin.toLowerCase())),
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

    setUsuarios(filteredUsuarios)
  }

  const handleTableSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // Modifique a função handleOpenNovoModal para garantir que não haja interferência
  const handleOpenNovoModal = () => {
    setEditingUser(null) // Garante que não há usuário sendo editado
    setIsNovoModalOpen(true)
  }

  // Modifique a função handleOpenEditModal para garantir que o modal correto seja aberto
  const handleOpenEditModal = (user) => {
    setEditingUser(user)
    setIsEditModalOpen(true)
  }

  // Modifique a função handleCloseNovoModal para limpar os dados
  const handleCloseNovoModal = () => {
    setIsNovoModalOpen(false)
  }

  // Modifique a função handleCloseEditModal para limpar os dados
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingUser(null)
  }

  const handleSaveNewUser = (userData) => {
    // Gerar um código aleatório para o novo usuário
    const novoCodigo = Math.floor(10000 + Math.random() * 90000).toString()

    // Adicionar o novo usuário à lista
    const novoUsuario = {
      codigo: novoCodigo,
      nome: userData.nome,
      cpf: userData.cpf,
      email: userData.email,
      login: userData.login || userData.email.split("@")[0],
      ativo: userData.ativo,
      unidade: userData.unidade, // Agora vem do select
      perfil: userData.perfil, // Agora vem do select
    }

    setUsuarios([novoUsuario, ...usuarios])
    setIsNovoModalOpen(false)
  }

  const handleUpdateUser = (updatedUserData) => {
    const updatedUsuarios = usuarios.map((user) =>
      user.codigo === updatedUserData.codigo ? { ...user, ...updatedUserData } : user,
    )
    setUsuarios(updatedUsuarios)
    setIsEditModalOpen(false)
    setEditingUser(null)
  }

  // Filtra a tabela com base no termo de busca
  const filteredUsuarios = searchTerm
    ? usuarios.filter((user) =>
        Object.values(user).some((value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : usuarios

  return (
    <div className="max-w-full mx-auto">
      {/* Cabeçalho */}
      <div className="bg-orange-500 text-white p-4 mb-4 rounded-t-md">
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

          <Button onClick={handleConsultar} className="bg-orange-500 hover:bg-orange-600 text-white md:col-start-5">
            CONSULTAR
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-md shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="text-sm text-gray-500 mb-2 md:mb-0">Arraste uma coluna aqui para agrupar</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleOpenNovoModal}>
                <Plus size={16} />
                <span>Novo</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download size={16} />
                <span>Exportar</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Upload size={16} />
                <span>Importar</span>
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleTableSearch}
              className="pl-9 border border-gray-300"
            />
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
                        {usuario.ativo && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.unidade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.perfil}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-orange-500 hover:text-orange-700"
                      onClick={() => handleOpenEditModal(usuario)}
                    >
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
      <NovoUsuarioModal isOpen={isNovoModalOpen} onClose={handleCloseNovoModal} onSave={handleSaveNewUser} />

      {/* Modal de Edição de Usuário */}
      <EditarUsuarioModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleUpdateUser}
        user={editingUser}
      />
    </div>
  )
}

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  X,
  Save,
  ChevronDown,
  Check,
  Search,
  Info,
  User,
  UserCircle,
  Mail,
  AtSign,
  CreditCard,
  Lock,
  Key,
  KeyRound,
  Link,
} from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

// Componente de seleção múltipla
const MultiSelect = ({ label, options, selectedValues, onChange, className = "", required = false, tooltip = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef(null)

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleToggleOption = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]
    onChange(newValues)
  }

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([])
    } else {
      onChange(options.map((option) => option.value))
    }
  }

  const getSelectedLabels = () => {
    if (selectedValues.length === 0) return label

    const selectedLabels = selectedValues
      .map((value) => {
        const option = options.find((opt) => opt.value === value)
        return option ? option.label : ""
      })
      .filter(Boolean)

    if (selectedLabels.length <= 2) return selectedLabels.join(", ")
    return `${selectedLabels.length} selecionados`
  }

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`flex items-center justify-between w-full bg-white border ${required && selectedValues.length === 0 ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 truncate">{getSelectedLabels()}</div>
        <div className="flex items-center">
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={16} className="text-gray-400 mr-2" />
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-800 dark:border-gray-700">
          <div className="sticky top-0 bg-white p-2 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="relative">
              <Search size={16} className="absolute left-2 top-2.5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="p-1">
            <div
              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 dark:text-gray-300"
              onClick={(e) => {
                e.stopPropagation()
                handleSelectAll()
              }}
            >
              <div
                className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${selectedValues.length === options.length ? "bg-blue-500 border-blue-500" : "border-gray-300 dark:border-gray-500"}`}
              >
                {selectedValues.length === options.length && <Check size={12} className="text-white" />}
              </div>
              <span>Selecionar todos</span>
            </div>

            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 dark:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleOption(option.value)
                }}
              >
                <div
                  className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${selectedValues.includes(option.value) ? "bg-blue-500 border-blue-500" : "border-gray-300 dark:border-gray-500"}`}
                >
                  {selectedValues.includes(option.value) && <Check size={12} className="text-white" />}
                </div>
                <span>{option.label}</span>
              </div>
            ))}

            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-gray-500 text-center dark:text-gray-400">Nenhum resultado encontrado</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function NovoUsuarioModal({ isOpen, onClose, onSave, editingUser }) {
  // Modificar o estado formData para incluir arrays para seleções múltiplas
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    email: "",
    login: "",
    cpf: "",
    senha: "",
    confirmarSenha: "",
    ativo: true,
    unidades: [],
    perfis: [],
    setores: [],
    cargos: [],
    areas: [],
  })

  const [errors, setErrors] = useState({})
  const modalRef = useRef(null)

  // Adicionar após a declaração dos estados existentes
  const [isLoadingCode, setIsLoadingCode] = useState(false)
  const [codeError, setCodeError] = useState(false)

  // Opções para os selects
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

  // Adicionar função para buscar o código do usuário
  const fetchUserCode = useCallback(async () => {
    if (!editingUser) {
      try {
        setIsLoadingCode(true)
        setCodeError(false)

        // Simulação de chamada à API - em produção, substituir por fetch real
        // const response = await fetch('/api/usuarios/gerar-codigo')
        // if (!response.ok) throw new Error('Falha ao gerar código')
        // const data = await response.json()
        // const newCode = data.codigo

        // Simulação de resposta da API para demonstração
        await new Promise((resolve) => setTimeout(resolve, 500))
        const newCode = `USR-${Math.floor(1000 + Math.random() * 9000)}`

        setFormData((prev) => ({ ...prev, codigo: newCode }))
      } catch (error) {
        console.error("Erro ao gerar código:", error)
        setCodeError(true)
        // Exibir mensagem de erro (assumindo que existe uma função toast.error)
        // toast.error('Não foi possível gerar o código. Tente novamente.')
      } finally {
        setIsLoadingCode(false)
      }
    }
  }, [editingUser])

  // Atualizar o useEffect para lidar com arrays
  useEffect(() => {
    if (isOpen) {
      if (editingUser) {
        console.log("Dados do usuário para edição:", editingUser)

        // Função auxiliar para converter string ou array para array de valores
        const convertToValueArray = (fieldData, options) => {
          if (!fieldData) return []

          // Se já for um array, use-o diretamente
          if (Array.isArray(fieldData)) {
            return fieldData
              .map((label) => {
                const option = options.find((opt) => opt.label === label)
                return option ? option.value : null
              })
              .filter(Boolean)
          }

          // Se for uma string com vírgulas, divida e processe cada parte
          if (typeof fieldData === "string" && fieldData.includes(",")) {
            const labels = fieldData.split(",").map((item) => item.trim())

            return labels
              .map((label) => {
                const option = options.find((opt) => opt.label.toLowerCase() === label.toLowerCase())
                return option ? option.value : null
              })
              .filter(Boolean)
          }

          // Se for uma string única
          if (typeof fieldData === "string") {
            const option = options.find((opt) => opt.label.toLowerCase() === fieldData.toLowerCase())
            return option ? [option.value] : []
          }

          return []
        }

        // Verificar e converter cada campo
        const unidadesArray =
          editingUser.unidades || editingUser.unidade
            ? convertToValueArray(editingUser.unidades || editingUser.unidade, unidadeOptions)
            : []

        const perfisArray =
          editingUser.perfis || editingUser.perfil
            ? convertToValueArray(editingUser.perfis || editingUser.perfil, perfilOptions)
            : []

        const setoresArray =
          editingUser.setores || editingUser.setor
            ? convertToValueArray(editingUser.setores || editingUser.setor, setorOptions)
            : []

        const cargosArray =
          editingUser.cargos || editingUser.cargo
            ? convertToValueArray(editingUser.cargos || editingUser.cargo, cargoOptions)
            : []

        const areasArray =
          editingUser.areas || editingUser.area
            ? convertToValueArray(editingUser.areas || editingUser.area, areaOptions)
            : []

        console.log("Valores convertidos:", {
          unidades: unidadesArray,
          perfis: perfisArray,
          setores: setoresArray,
          cargos: cargosArray,
          areas: areasArray,
        })

        setFormData({
          codigo: editingUser.codigo || "",
          nome: editingUser.nome || "",
          email: editingUser.email || "",
          login: editingUser.login || "",
          cpf: editingUser.cpf || "",
          senha: "",
          confirmarSenha: "",
          ativo: editingUser.ativo !== undefined ? editingUser.ativo : true,
          unidades: unidadesArray,
          perfis: perfisArray,
          setores: setoresArray,
          cargos: cargosArray,
          areas: areasArray,
        })
      } else {
        // Reset form when not editing
        setFormData({
          codigo: "",
          nome: "",
          email: "",
          login: "",
          cpf: "",
          senha: "",
          confirmarSenha: "",
          ativo: true,
          unidades: [],
          perfis: [],
          setores: [],
          cargos: [],
          areas: [],
        })

        // Buscar código automaticamente
        fetchUserCode()
      }

      // Limpa os erros ao abrir o modal
      setErrors({})
    }
  }, [editingUser, isOpen, fetchUserCode])

  // Fechar modal ao clicar fora
  const handleBackdropClick = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    },
    [onClose],
  )

  // Fechar modal com tecla ESC
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
      document.body.style.overflow = "hidden" // Prevenir scroll do body
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
      document.body.style.overflow = "auto" // Restaurar scroll do body
    }
  }, [isOpen, onClose])

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    // Limpa o erro quando o usuário começa a digitar
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  const handleMultiSelectChange = (field) => (values) => {
    setFormData({ ...formData, [field]: values })
    // Limpa o erro quando o usuário seleciona algo
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, ativo: e.target.checked })
  }

  // Atualizar a validação para verificar arrays
  const validateForm = () => {
    const newErrors = {}

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório"
    if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório"
    if (!formData.login.trim()) newErrors.login = "Login é obrigatório"
    if (!formData.cpf.trim()) newErrors.cpf = "CPF é obrigatório"
    if (formData.unidades.length === 0) newErrors.unidades = "Selecione pelo menos uma unidade"
    if (formData.perfis.length === 0) newErrors.perfis = "Selecione pelo menos um perfil"
    if (formData.setores.length === 0) newErrors.setores = "Selecione pelo menos um setor"
    if (formData.cargos.length === 0) newErrors.cargos = "Selecione pelo menos um cargo"
    if (formData.areas.length === 0) newErrors.areas = "Selecione pelo menos uma área"

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Atualizar o handleSubmit para lidar com arrays
  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Converter os valores de select para os rótulos correspondentes
      const unidadesLabels = formData.unidades
        .map((value) => unidadeOptions.find((opt) => opt.value === value)?.label || "")
        .filter(Boolean)

      const perfisLabels = formData.perfis
        .map((value) => perfilOptions.find((opt) => opt.value === value)?.label || "")
        .filter(Boolean)

      const setoresLabels = formData.setores
        .map((value) => setorOptions.find((opt) => opt.value === value)?.label || "")
        .filter(Boolean)

      const cargosLabels = formData.cargos
        .map((value) => cargoOptions.find((opt) => opt.value === value)?.label || "")
        .filter(Boolean)

      const areasLabels = formData.areas
        .map((value) => areaOptions.find((opt) => opt.value === value)?.label || "")
        .filter(Boolean)

      // Criar objeto com dados formatados para a tabela e para o armazenamento
      const userData = {
        ...formData,
        // Adicionar campos individuais para compatibilidade com a tabela
        unidade: unidadesLabels.join(", "),
        perfil: perfisLabels.join(", "),
        setor: setoresLabels.join(", "),
        cargo: cargosLabels.join(", "),
        area: areasLabels.join(", "),
        // Manter os arrays originais também
        unidades: unidadesLabels,
        perfis: perfisLabels,
        setores: setoresLabels,
        cargos: cargosLabels,
        areas: areasLabels,
      }

      onSave(userData)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-hidden dark:bg-gray-900 dark:bg-opacity-80"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl overflow-hidden animate-scale-in dark:bg-gray-800 dark:text-gray-100"
        style={{ maxWidth: "1200px" }}
      >
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center sticky top-0 z-10 dark:bg-blue-700">
          <h3 className="text-xl font-bold">{editingUser ? "Editar Usuário" : "Novo Usuário"}</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-600 rounded-full p-1 transition-colors dark:hover:bg-blue-800"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-64px)]">
          <form onSubmit={handleSubmit} className="p-6 bg-gray-50 dark:bg-gray-700">
            {/* Cabeçalho do formulário */}
            <div className="mb-8 text-center">
              <h4 className="text-gray-500 text-sm uppercase tracking-wider mb-1 dark:text-gray-400">
                Formulário de Cadastro
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Preencha os campos abaixo para cadastrar um novo usuário no sistema
              </p>
            </div>

            {/* Seção de informações básicas */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3 dark:bg-blue-900">
                  <User size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Informações Básicas</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="codigo" className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-200">
                    Código
                    {isLoadingCode && (
                      <span className="ml-2 text-xs text-blue-500 dark:text-blue-400">(gerando...)</span>
                    )}
                    {codeError && <span className="ml-2 text-xs text-red-500 dark:text-red-400">(erro ao gerar)</span>}
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="codigo"
                      placeholder={isLoadingCode ? "Gerando código..." : "Código"}
                      value={formData.codigo}
                      onChange={handleChange("codigo")}
                      className={`border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-32 ${codeError ? "border-red-500 bg-red-50" : ""} ${isLoadingCode ? "animate-pulse" : ""} dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100`}
                      disabled={true}
                      readOnly
                    />
                    {/* Espaço vazio para manter o alinhamento com outros campos */}
                    <div className="flex-grow"></div>
                  </div>
                  {codeError && (
                    <p className="text-red-500 text-xs mt-1 dark:text-red-400">
                      Não foi possível gerar o código. O formulário não poderá ser salvo.
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="ativo"
                      checked={formData.ativo}
                      onChange={handleCheckboxChange}
                      className="opacity-0 absolute block w-6 h-6 rounded-full bg-white border-4 cursor-pointer z-10"
                    />
                    <label
                      htmlFor="ativo"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        formData.ativo ? "bg-green-500" : "bg-gray-300"
                      } dark:${formData.ativo ? "bg-green-500" : "bg-gray-500"}`}
                    >
                      <span
                        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                          formData.ativo ? "transform translate-x-4" : ""
                        }`}
                      ></span>
                    </label>
                  </div>
                  <Label htmlFor="ativo" className="ml-2 cursor-pointer font-medium dark:text-gray-200">
                    {formData.ativo ? "Ativo" : "Inativo"}
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome" className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-200">
                    Nome*
                  </Label>
                  <div className="relative">
                    <Input
                      id="nome"
                      placeholder="Nome completo"
                      value={formData.nome}
                      onChange={handleChange("nome")}
                      className={`border pl-10 ${errors.nome ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"} w-full focus:ring-2 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100`}
                      required
                    />
                    <UserCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  {errors.nome && <p className="text-red-500 text-xs mt-1 dark:text-red-400">{errors.nome}</p>}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-200">
                    E-mail*
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      placeholder="email@exemplo.com"
                      type="email"
                      value={formData.email}
                      onChange={handleChange("email")}
                      className={`border pl-10 ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"} w-full focus:ring-2 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100`}
                      required
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1 dark:text-red-400">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="login" className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-200">
                      Login*
                    </Label>
                    <div className="relative">
                      <Input
                        id="login"
                        placeholder="Nome de usuário"
                        value={formData.login}
                        onChange={handleChange("login")}
                        className={`border pl-10 ${errors.login ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"} w-full focus:ring-2 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100`}
                        required
                      />
                      <AtSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    {errors.login && <p className="text-red-500 text-xs mt-1 dark:text-red-400">{errors.login}</p>}
                  </div>

                  <div>
                    <Label htmlFor="cpf" className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-200">
                      CPF*
                    </Label>
                    <div className="relative">
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={handleChange("cpf")}
                        className={`border pl-10 ${errors.cpf ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"} w-full focus:ring-2 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100`}
                        required
                      />
                      <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    {errors.cpf && <p className="text-red-500 text-xs mt-1 dark:text-red-400">{errors.cpf}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de senha */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-2 rounded-full mr-3 dark:bg-purple-900">
                  <Lock size={18} className="text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Segurança</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="senha" className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-200">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="senha"
                      placeholder="••••••••"
                      type="password"
                      value={formData.senha}
                      onChange={handleChange("senha")}
                      className="border pl-10 border-gray-300 w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                    <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  {editingUser && (
                    <p className="text-gray-500 text-xs mt-1 dark:text-gray-400">
                      Deixe em branco para manter a senha atual
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="confirmarSenha"
                    className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-200"
                  >
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmarSenha"
                      placeholder="••••••••"
                      type="password"
                      value={formData.confirmarSenha}
                      onChange={handleChange("confirmarSenha")}
                      className={`border pl-10 ${errors.confirmarSenha ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"} w-full focus:ring-2 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100`}
                    />
                    <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  {errors.confirmarSenha && (
                    <p className="text-red-500 text-xs mt-1 dark:text-red-400">{errors.confirmarSenha}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Seção de vínculos */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-full mr-3 dark:bg-green-900">
                  <Link size={18} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Vínculos</h3>
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  Seleção múltipla
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                <div>
                  <Label htmlFor="unidades" className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-200">
                    Unidades*
                  </Label>
                  <MultiSelect
                    label="Selecione as Unidades"
                    options={unidadeOptions}
                    selectedValues={formData.unidades}
                    onChange={handleMultiSelectChange("unidades")}
                    required={true}
                    tooltip="Você pode vincular este usuário a mais de uma unidade"
                    className={errors.unidades ? "border-red-500" : ""}
                  />
                  {errors.unidades && <p className="text-red-500 text-xs mt-1 dark:text-red-400">{errors.unidades}</p>}
                </div>

                <div>
                  <Label htmlFor="perfis" className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-200">
                    Perfis*
                  </Label>
                  <MultiSelect
                    label="Selecione os Perfis"
                    options={perfilOptions}
                    selectedValues={formData.perfis}
                    onChange={handleMultiSelectChange("perfis")}
                    required={true}
                    tooltip="Você pode vincular este usuário a mais de um perfil"
                    className={errors.perfis ? "border-red-500" : ""}
                  />
                  {errors.perfis && <p className="text-red-500 text-xs mt-1 dark:text-red-400">{errors.perfis}</p>}
                </div>

                <div>
                  <Label htmlFor="setores" className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-200">
                    Setores*
                  </Label>
                  <MultiSelect
                    label="Selecione os Setores"
                    options={setorOptions}
                    selectedValues={formData.setores}
                    onChange={handleMultiSelectChange("setores")}
                    required={true}
                    tooltip="Você pode vincular este usuário a mais de um setor"
                    className={errors.setores ? "border-red-500" : ""}
                  />
                  {errors.setores && <p className="text-red-500 text-xs mt-1 dark:text-red-400">{errors.setores}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="cargos" className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-200">
                    Cargos*
                  </Label>
                  <MultiSelect
                    label="Selecione os Cargos"
                    options={cargoOptions}
                    selectedValues={formData.cargos}
                    onChange={handleMultiSelectChange("cargos")}
                    required={true}
                    tooltip="Você pode vincular este usuário a mais de um cargo"
                    className={errors.cargos ? "border-red-500" : ""}
                  />
                  {errors.cargos && <p className="text-red-500 text-xs mt-1 dark:text-red-400">{errors.cargos}</p>}
                </div>

                <div>
                  <Label htmlFor="areas" className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-200">
                    Áreas*
                  </Label>
                  <MultiSelect
                    label="Selecione as Áreas"
                    options={areaOptions}
                    selectedValues={formData.areas}
                    onChange={handleMultiSelectChange("areas")}
                    required={true}
                    tooltip="Você pode vincular este usuário a mais de uma área"
                    className={errors.areas ? "border-red-500" : ""}
                  />
                  {errors.areas && <p className="text-red-500 text-xs mt-1 dark:text-red-400">{errors.areas}</p>}
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white border-0 flex items-center gap-2 px-6 py-2 transition-all dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <X size={18} />
                CANCELAR
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-8 py-2 transition-all dark:bg-blue-600 dark:hover:bg-blue-700"
                disabled={isLoadingCode || codeError}
              >
                <Save size={18} />
                SALVAR
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NovoUsuarioModal

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  AlertTriangle,
  Info,
  Calendar,
  User,
  Building,
  Clock,
  Activity,
  Users,
  FileText,
  CheckSquare,
  ChevronLeft,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Componente de Stepper para mostrar o progresso
const Stepper = ({ currentStep, steps }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                index < currentStep
                  ? "bg-green-500 border-green-500 text-white"
                  : index === currentStep
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-white border-gray-300 text-gray-400"
              } transition-all duration-300`}
            >
              {index < currentStep ? <CheckCircle2 size={20} /> : index + 1}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                index <= currentStep ? "text-gray-800" : "text-gray-400"
              } text-center max-w-[80px]`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-0 h-1 w-full bg-gray-200 rounded"></div>
        <div
          className="absolute top-0 h-1 bg-blue-500 rounded transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

// Modifique o componente CartaoAvaliacao para mostrar os itens diretamente no cartão
const CartaoAvaliacao = ({ cartao, onSelect, isSelected }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative group cursor-pointer rounded-xl border ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
      } transition-all duration-200 overflow-hidden`}
      onClick={() => onSelect(cartao)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isSelected ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-600"
              }`}
            >
              {cartao.id}
            </div>
            <h3 className="text-lg font-medium text-gray-800">{cartao.nome}</h3>
          </div>
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-white text-transparent"
            }`}
          >
            {isSelected && <CheckSquare size={14} />}
          </div>
        </div>

        {/* Lista de itens diretamente no cartão */}
        <div className="mt-3 pl-13">
          <ul className="text-sm text-gray-600 space-y-1 mt-2 ml-10">
            {cartao.itens.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="min-w-4 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="text-sm text-gray-500 mt-2">
            <span className="inline-flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {cartao.itens.length} itens para avaliação
            </span>
          </div>
        </div>
      </div>

      {/* Remova ou mantenha o tooltip conforme necessário */}
      <div className="absolute left-full top-0 ml-4 w-80 p-5 bg-white rounded-xl shadow-xl border border-blue-100 text-sm text-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none">
        <h4 className="font-medium text-blue-700 mb-2">Itens para avaliação:</h4>
        <ul className="space-y-2">
          {cartao.itens.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700">
              <div className="min-w-4 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              </div>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

// Componente de seleção de cartão melhorado
const SelecionarCartao = ({ onSelecionar, selectedCartao }) => {
  const cartoes = [
    {
      id: 1,
      nome: "Reação das pessoas",
      itens: ["Ajustando EPI", "Mudando de Posição", "Reorganizando o Trabalho", "Parando a atividade"],
    },
    {
      id: 2,
      nome: "Posição das pessoas",
      itens: [
        "Batendo contra ou sendo atingido por objetos",
        "Linha de fogo / risco",
        "Preso dentro, sobre ou entre objetos",
        "Caindo",
        "Posição desconfortável ou postura estática",
        "Movimentos Repetitivos (Ritmos/Rodízios/Pauses)",
      ],
    },
    {
      id: 3,
      nome: "Ferramentas/Equipamentos",
      itens: ["Inadequadas para o trabalho", "Usadas incorretamente", "Em condições inseguras", "Improvisações"],
    },
    {
      id: 4,
      nome: "Procedimentos de trabalho",
      itens: ["Não disponível", "Não adequados", "Não conhecidos", "Não compreendidos", "Não seguidos"],
    },
    {
      id: 5,
      nome: "Padrões e Organização",
      itens: ["Não conhecidos", "Não compreendidos", "Não seguidos"],
    },
  ]

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 text-blue-600 mb-6">
        <Info size={18} />
        <p className="text-sm">
          Selecione um cartão de avaliação para prosseguir. Passe o mouse sobre o cartão para ver os itens.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {cartoes.map((cartao) => (
          <CartaoAvaliacao
            key={cartao.id}
            cartao={cartao}
            onSelect={onSelecionar}
            isSelected={selectedCartao?.id === cartao.id}
          />
        ))}
      </div>
    </div>
  )
}

// Componente de item de checklist melhorado
const ChecklistItem = ({ item, index, checked, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={`flex items-center p-3 rounded-lg border ${
        checked ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-white"
      } transition-all duration-200`}
    >
      <input
        type="checkbox"
        id={`item-${index}`}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor={`item-${index}`} className="ml-3 text-gray-800 cursor-pointer flex-1">
        {item}
      </label>
    </motion.div>
  )
}

export default function AvaliacaoAuditoria() {
  const [currentStep, setCurrentStep] = useState(0)
  const [exibirFormularioDados, setExibirFormularioDados] = useState(false)
  const [filtros, setFiltros] = useState({
    regional: "",
    unidade: "",
    dataInicio: "",
    dataFim: "",
  })
  const [novaAuditoriaVisivel, setNovaAuditoriaVisivel] = useState(false)
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null)
  const [checkedItems, setCheckedItems] = useState({})
  const [formData, setFormData] = useState({
    codigo: "",
    unidade: "",
    setor: "",
    data: "",
    turno: "",
    observador: "",
    mesAnoAdmissao: "",
    atividade: "",
    pessoaAvaliada: "",
    tipoTarefa: "",
    numPessoas: "",
    avaliacao: "",
    desvios: "",
    tratativa: "",
  })

  const steps = ["Filtros", "Selecionar Cartão", "Checklist", "Dados da Auditoria", "Revisão"]

  useEffect(() => {
    // Atualiza o passo atual com base no estado da aplicação
    if (exibirFormularioDados) {
      setCurrentStep(3)
    } else if (cartaoSelecionado) {
      setCurrentStep(2)
    } else if (novaAuditoriaVisivel) {
      setCurrentStep(1)
    } else {
      setCurrentStep(0)
    }
  }, [exibirFormularioDados, cartaoSelecionado, novaAuditoriaVisivel])

  const handleChange = (field) => (e) => {
    setFiltros({ ...filtros, [field]: e.target.value })
  }

  const handleFormChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  const handleTextAreaChange =
    (field, maxLength = 1024) =>
    (e) => {
      // Limita o texto ao número máximo de caracteres
      const text = e.target.value.slice(0, maxLength)
      setFormData({ ...formData, [field]: text })
    }

  const handleConsultar = () => {
    console.log("Consultando com filtros:", filtros)
  }

  const handleNovaAuditoria = () => {
    setNovaAuditoriaVisivel(true)
    setCartaoSelecionado(null)
    setExibirFormularioDados(false)
    setCurrentStep(1)
  }

  const handleSelecionarCartao = (cartao) => {
    setCartaoSelecionado(cartao)
    // Inicializa o estado dos checkboxes
    const initialCheckedState = {}
    cartao.itens.forEach((item, index) => {
      initialCheckedState[index] = false
    })
    setCheckedItems(initialCheckedState)
    setCurrentStep(2)
  }

  const handleChecklistItemChange = (index) => {
    setCheckedItems({
      ...checkedItems,
      [index]: !checkedItems[index],
    })
  }

  const handleVoltar = () => {
    if (exibirFormularioDados) {
      setExibirFormularioDados(false)
      setCartaoSelecionado(null)
      setNovaAuditoriaVisivel(true)
      setCurrentStep(1)
    } else if (cartaoSelecionado) {
      setCartaoSelecionado(null)
      setCurrentStep(1)
    } else if (novaAuditoriaVisivel) {
      setNovaAuditoriaVisivel(false)
      setCurrentStep(0)
    }
  }

  const handleAvancar = () => {
    if (cartaoSelecionado) {
      setExibirFormularioDados(true)
      setCurrentStep(3)
    }
  }

  const handleSalvar = () => {
    console.log("Salvando formulário:", formData)
    // Aqui você adicionaria a lógica para salvar os dados
    alert("Auditoria salva com sucesso!")
    // Reset do formulário
    setExibirFormularioDados(false)
    setCartaoSelecionado(null)
    setNovaAuditoriaVisivel(false)
    setCurrentStep(0)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Auditoria Comportamental</h2>
          <p className="text-gray-500 mt-1">Avalie comportamentos e identifique oportunidades de melhoria</p>
        </div>
        {!novaAuditoriaVisivel && !cartaoSelecionado && !exibirFormularioDados && (
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            onClick={handleNovaAuditoria}
          >
            <ClipboardCheck size={18} />
            Nova Auditoria
          </Button>
        )}
      </div>

      {/* Stepper de progresso */}
      {(novaAuditoriaVisivel || cartaoSelecionado || exibirFormularioDados) && (
        <Stepper currentStep={currentStep} steps={steps} />
      )}

      <AnimatePresence mode="wait">
        {!novaAuditoriaVisivel && !cartaoSelecionado && !exibirFormularioDados && (
          <motion.div
            key="filtros"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-md mb-6"
          >
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <Info size={18} />
              <p className="text-sm">
                Use os filtros abaixo para consultar auditorias existentes ou clique em "Nova Auditoria" para criar uma
                nova.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Building size={16} />
                  Regional
                </Label>
                <Input
                  placeholder="Digite a regional"
                  value={filtros.regional}
                  onChange={handleChange("regional")}
                  className="text-gray-900 placeholder-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Building size={16} />
                  Unidade
                </Label>
                <Input
                  placeholder="Digite a unidade"
                  value={filtros.unidade}
                  onChange={handleChange("unidade")}
                  className="text-gray-900 placeholder-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar size={16} />
                  Data Início
                </Label>
                <Input
                  type="date"
                  value={filtros.dataInicio}
                  onChange={handleChange("dataInicio")}
                  className="text-gray-900 placeholder-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar size={16} />
                  Data Fim
                </Label>
                <Input
                  type="date"
                  value={filtros.dataFim}
                  onChange={handleChange("dataFim")}
                  className="text-gray-900 placeholder-gray-600"
                />
              </div>
            </div>
            <div className="mt-6 text-right">
              <Button
                onClick={handleConsultar}
                className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              >
                <Activity size={18} />
                Consultar
              </Button>
            </div>
          </motion.div>
        )}

        {novaAuditoriaVisivel && !cartaoSelecionado && (
          <motion.div
            key="selecionar-cartao"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SelecionarCartao onSelecionar={handleSelecionarCartao} selectedCartao={cartaoSelecionado} />

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={handleVoltar} className="flex items-center gap-2">
                <ChevronLeft size={18} />
                Voltar
              </Button>
            </div>
          </motion.div>
        )}

        {novaAuditoriaVisivel && cartaoSelecionado && !exibirFormularioDados && (
          <motion.div
            key="checklist"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
                {cartaoSelecionado.id}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{cartaoSelecionado.nome}</h3>
                <p className="text-sm text-gray-500">Selecione os itens observados durante a auditoria</p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              {cartaoSelecionado.itens.map((item, index) => (
                <ChecklistItem
                  key={index}
                  item={item}
                  index={index}
                  checked={checkedItems[index] || false}
                  onChange={() => handleChecklistItemChange(index)}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={handleVoltar} className="flex items-center gap-2">
                <ChevronLeft size={18} />
                Voltar
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                onClick={handleAvancar}
              >
                Avançar
                <ChevronRight size={18} />
              </Button>
            </div>
          </motion.div>
        )}

        {exibirFormularioDados && (
          <motion.div
            key="formulario-dados"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Dados da Auditoria</h3>
              <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                <AlertTriangle size={16} />
                <span>Todos os campos com * são obrigatórios</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">Código *</Label>
                <Input
                  placeholder="Digite o código"
                  className="text-gray-900 placeholder-gray-600"
                  value={formData.codigo}
                  onChange={handleFormChange("codigo")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Building size={16} />
                  Unidade *
                </Label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-600"
                  value={formData.unidade}
                  onChange={handleFormChange("unidade")}
                  required
                >
                  <option value="">Selecione a unidade</option>
                  <option value="Unidade 1">Unidade 1</option>
                  <option value="Unidade 2">Unidade 2</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">Setor *</Label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-600"
                  value={formData.setor}
                  onChange={handleFormChange("setor")}
                  required
                >
                  <option value="">Selecione o setor</option>
                  <option value="Setor A">Setor A</option>
                  <option value="Setor B">Setor B</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar size={16} />
                  Data *
                </Label>
                <Input
                  type="datetime-local"
                  className="text-gray-900 placeholder-gray-600"
                  value={formData.data}
                  onChange={handleFormChange("data")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Clock size={16} />
                  Turno *
                </Label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-600"
                  value={formData.turno}
                  onChange={handleFormChange("turno")}
                  required
                >
                  <option value="">Selecione o turno</option>
                  <option value="Primeiro">Primeiro</option>
                  <option value="Segundo">Segundo</option>
                  <option value="Terceiro">Terceiro</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <User size={16} />
                  Observador *
                </Label>
                <Input
                  placeholder="Nome do observador"
                  className="text-gray-900 placeholder-gray-600"
                  value={formData.observador}
                  onChange={handleFormChange("observador")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar size={16} />
                  Mês/Ano Admissão
                </Label>
                <Input
                  type="month"
                  className="text-gray-900 placeholder-gray-600"
                  value={formData.mesAnoAdmissao}
                  onChange={handleFormChange("mesAnoAdmissao")}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Activity size={16} />
                  Atividade *
                </Label>
                <Input
                  placeholder="Descrição da atividade"
                  className="text-gray-900 placeholder-gray-600"
                  value={formData.atividade}
                  onChange={handleFormChange("atividade")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <User size={16} />
                  Pessoa Avaliada *
                </Label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-600"
                  value={formData.pessoaAvaliada}
                  onChange={handleFormChange("pessoaAvaliada")}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Funcionário">Funcionário</option>
                  <option value="Terceiro">Terceiro</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Users size={16} />
                  Tipo Tarefa *
                </Label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-600"
                  value={formData.tipoTarefa}
                  onChange={handleFormChange("tipoTarefa")}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Grupo/Equipe">Grupo/Equipe</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Users size={16} />
                  Nº de pessoas *
                </Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="Quantidade de pessoas"
                  className="text-gray-900 placeholder-gray-600"
                  value={formData.numPessoas}
                  onChange={handleFormChange("numPessoas")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">Avaliação da Atividade *</Label>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="avaliacao"
                      value="seguro"
                      className="h-4 w-4 text-green-600"
                      checked={formData.avaliacao === "seguro"}
                      onChange={handleFormChange("avaliacao")}
                    />
                    <span className="flex items-center gap-1 text-green-700">
                      <CheckCircle2 size={16} />
                      Seguro
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="avaliacao"
                      value="inseguro"
                      className="h-4 w-4 text-red-600"
                      checked={formData.avaliacao === "inseguro"}
                      onChange={handleFormChange("avaliacao")}
                    />
                    <span className="flex items-center gap-1 text-red-700">
                      <AlertTriangle size={16} />
                      Inseguro
                    </span>
                  </label>
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="flex items-center gap-1">
                  <FileText size={16} />
                  Desvios Observados
                </Label>
                <div className="relative">
                  <Textarea
                    placeholder="Descreva os desvios observados durante a auditoria"
                    className="min-h-[100px] text-gray-900 placeholder-gray-600"
                    value={formData.desvios}
                    onChange={handleTextAreaChange("desvios")}
                    maxLength={1024}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {formData.desvios?.length || 0}/1024 caracteres
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="flex items-center gap-1">
                  <FileText size={16} />
                  Tratativa *
                </Label>
                <div className="relative">
                  <Textarea
                    placeholder="Informe as tratativas adotadas para os desvios identificados"
                    className="min-h-[100px] text-gray-900 placeholder-gray-600"
                    value={formData.tratativa}
                    onChange={handleTextAreaChange("tratativa")}
                    maxLength={1024}
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {formData.tratativa?.length || 0}/1024 caracteres
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={handleVoltar} className="flex items-center gap-2">
                <ChevronLeft size={18} />
                Voltar
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                onClick={handleSalvar}
              >
                <CheckCircle2 size={18} />
                Salvar Auditoria
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

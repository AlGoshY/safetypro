"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, SearchIcon, InfoIcon, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

type ResultadoAuditoria = {
  id: number
  regional: string
  unidade: string
  codGestor: number
  gestor: string
  semana1: number
  semana2: number
  semana3: number
  semana4: number
  semana5: number
  total: number
  conformidade: number
  seguro: number
  inseguro: number
  children?: ResultadoAuditoria[]
  expanded?: boolean
  level?: number
  parent?: boolean
  hasChildren?: boolean
}

export default function PainelAuditoria() {
  const [regional, setRegional] = useState<string>("")
  const [filial, setFilial] = useState<string>("")
  const [setor, setSetor] = useState<string>("")
  const [perfilAgrupador, setPerfilAgrupador] = useState<string>("")
  const [mes, setMes] = useState<string>("")
  const [ano, setAno] = useState<Date | undefined>(new Date())
  const [exibirSetorSemAuditoria, setExibirSetorSemAuditoria] = useState<boolean>(false)
  const [isConsultando, setIsConsultando] = useState<boolean>(false)
  const [resultados, setResultados] = useState<ResultadoAuditoria[]>([])
  const [modalAberto, setModalAberto] = useState<boolean>(false)
  const [gestorSelecionado, setGestorSelecionado] = useState<string>("")
  const [setorSelecionado, setSetorSelecionado] = useState<string>("")

  const handleConsultar = () => {
    setIsConsultando(true)

    // Simulando uma consulta ao backend
    setTimeout(() => {
      // Dados fictícios mais detalhados para demonstração
      const dadosSimplificados: ResultadoAuditoria[] = [
        {
          id: 1,
          regional: "Regional Dotse Sup",
          unidade: "",
          codGestor: 0,
          gestor: "",
          semana1: 0,
          semana2: 50,
          semana3: 100,
          semana4: 0,
          semana5: 0,
          total: 20,
          conformidade: 30,
          seguro: 50,
          inseguro: 50,
          expanded: false, // Primeiro nível fechado inicialmente
          parent: true,
          level: 0,
          hasChildren: true,
          children: [
            {
              id: 2,
              regional: "Diretoria Dotse - Sup",
              unidade: "Regional Dotse - Sup",
              codGestor: 1,
              gestor: "ADM",
              semana1: 0,
              semana2: 1,
              semana3: 0,
              semana4: 0,
              semana5: 0,
              total: 1,
              conformidade: 10,
              seguro: 100,
              inseguro: 0,
              level: 1,
              expanded: false,
              hasChildren: true,
              children: [
                {
                  id: 4,
                  regional: "Regional Dotse Sup",
                  unidade: "DOTSE - DEMONSTRAÇÃO",
                  codGestor: 5,
                  gestor: "Suporte",
                  semana1: 0,
                  semana2: 13,
                  semana3: 5,
                  semana4: 0,
                  semana5: 0,
                  total: 18,
                  conformidade: 40,
                  seguro: 50,
                  inseguro: 50,
                  level: 2,
                  hasChildren: false,
                },
              ],
            },
            {
              id: 3,
              regional: "Regional Dotse Sup",
              unidade: "Unidade Dotse - Sup",
              codGestor: 0,
              gestor: "",
              semana1: 0,
              semana2: 0,
              semana3: 100,
              semana4: 0,
              semana5: 0,
              total: 2,
              conformidade: 20,
              seguro: 50,
              inseguro: 50,
              level: 1,
              expanded: false,
              hasChildren: true,
              children: [
                {
                  id: 5,
                  regional: "Diretoria Dotse - Sup",
                  unidade: "Regional Dotse - Sup",
                  codGestor: 1,
                  gestor: "ADM",
                  semana1: 0,
                  semana2: 1,
                  semana3: 0,
                  semana4: 0,
                  semana5: 0,
                  total: 1,
                  conformidade: 10,
                  seguro: 100,
                  inseguro: 0,
                  level: 2,
                  expanded: false,
                  hasChildren: true,
                  children: [
                    {
                      id: 6,
                      regional: "Regional Dotse Sup",
                      unidade: "DOTSE - DEMONSTRAÇÃO",
                      codGestor: 5,
                      gestor: "Suporte",
                      semana1: 0,
                      semana2: 13,
                      semana3: 5,
                      semana4: 0,
                      semana5: 0,
                      total: 18,
                      conformidade: 40,
                      seguro: 50,
                      inseguro: 50,
                      level: 3,
                      hasChildren: false,
                    },
                  ],
                },
                {
                  id: 7,
                  regional: "Regional Dotse Sup",
                  unidade: "DOTSE - DEMONSTRAÇÃO",
                  codGestor: 5,
                  gestor: "Suporte",
                  semana1: 0,
                  semana2: 13,
                  semana3: 5,
                  semana4: 0,
                  semana5: 0,
                  total: 18,
                  conformidade: 40,
                  seguro: 50,
                  inseguro: 50,
                  level: 2,
                  hasChildren: false,
                },
              ],
            },
          ],
        },
        {
          id: 8,
          regional: "Regional Norte",
          unidade: "",
          codGestor: 0,
          gestor: "",
          semana1: 75,
          semana2: 80,
          semana3: 90,
          semana4: 85,
          semana5: 95,
          total: 85,
          conformidade: 85,
          seguro: 90,
          inseguro: 10,
          expanded: false,
          parent: true,
          level: 0,
          hasChildren: true,
          children: [
            {
              id: 9,
              regional: "Diretoria Norte - Belém",
              unidade: "Belém Central",
              codGestor: 12,
              gestor: "Carlos Silva",
              semana1: 80,
              semana2: 85,
              semana3: 90,
              semana4: 80,
              semana5: 95,
              total: 86,
              conformidade: 86,
              seguro: 90,
              inseguro: 10,
              level: 1,
              expanded: false,
              hasChildren: true,
              children: [
                {
                  id: 10,
                  regional: "Equipe Operacional",
                  unidade: "Belém - Operações",
                  codGestor: 15,
                  gestor: "Ana Souza",
                  semana1: 75,
                  semana2: 80,
                  semana3: 85,
                  semana4: 80,
                  semana5: 90,
                  total: 82,
                  conformidade: 82,
                  seguro: 85,
                  inseguro: 15,
                  level: 2,
                  hasChildren: false,
                },
              ],
            },
            {
              id: 11,
              regional: "Diretoria Norte - Manaus",
              unidade: "Manaus Central",
              codGestor: 18,
              gestor: "Roberto Martins",
              semana1: 70,
              semana2: 75,
              semana3: 90,
              semana4: 85,
              semana5: 95,
              total: 83,
              conformidade: 83,
              seguro: 90,
              inseguro: 10,
              level: 1,
              expanded: false,
              hasChildren: true,
              children: [
                {
                  id: 12,
                  regional: "Equipe Administrativa",
                  unidade: "Manaus - Administração",
                  codGestor: 22,
                  gestor: "Juliana Costa",
                  semana1: 80,
                  semana2: 85,
                  semana3: 95,
                  semana4: 90,
                  semana5: 100,
                  total: 90,
                  conformidade: 90,
                  seguro: 95,
                  inseguro: 5,
                  level: 2,
                  hasChildren: false,
                },
              ],
            },
          ],
        },
        {
          id: 13,
          regional: "Regional Sudeste",
          unidade: "",
          codGestor: 0,
          gestor: "",
          semana1: 85,
          semana2: 90,
          semana3: 95,
          semana4: 90,
          semana5: 100,
          total: 92,
          conformidade: 92,
          seguro: 95,
          inseguro: 5,
          expanded: false,
          parent: true,
          level: 0,
          hasChildren: true,
          children: [
            {
              id: 14,
              regional: "Diretoria Sudeste - São Paulo",
              unidade: "São Paulo Central",
              codGestor: 30,
              gestor: "Marcos Oliveira",
              semana1: 90,
              semana2: 95,
              semana3: 100,
              semana4: 95,
              semana5: 100,
              total: 96,
              conformidade: 96,
              seguro: 98,
              inseguro: 2,
              level: 1,
              expanded: false,
              hasChildren: true,
              children: [
                {
                  id: 15,
                  regional: "Equipe Financeira",
                  unidade: "SP - Finanças",
                  codGestor: 35,
                  gestor: "Patrícia Lima",
                  semana1: 95,
                  semana2: 100,
                  semana3: 100,
                  semana4: 95,
                  semana5: 100,
                  total: 98,
                  conformidade: 98,
                  seguro: 100,
                  inseguro: 0,
                  level: 2,
                  hasChildren: false,
                },
              ],
            },
            {
              id: 16,
              regional: "Diretoria Sudeste - Rio de Janeiro",
              unidade: "Rio de Janeiro Central",
              codGestor: 40,
              gestor: "Fernando Santos",
              semana1: 80,
              semana2: 85,
              semana3: 90,
              semana4: 85,
              semana5: 95,
              total: 87,
              conformidade: 87,
              seguro: 90,
              inseguro: 10,
              level: 1,
              expanded: false,
              hasChildren: true,
              children: [
                {
                  id: 17,
                  regional: "Equipe Comercial",
                  unidade: "RJ - Comercial",
                  codGestor: 45,
                  gestor: "Luciana Ferreira",
                  semana1: 85,
                  semana2: 90,
                  semana3: 95,
                  semana4: 90,
                  semana5: 95,
                  total: 91,
                  conformidade: 91,
                  seguro: 95,
                  inseguro: 5,
                  level: 2,
                  hasChildren: false,
                },
              ],
            },
          ],
        },
      ]

      setResultados(dadosSimplificados)
      setIsConsultando(false)
    }, 1000)
  }

  const handleVisualizarAuditoria = (gestor: string, setor: string) => {
    setGestorSelecionado(gestor)
    setSetorSelecionado(setor)
    setModalAberto(true)
  }

  const toggleExpand = (id: number) => {
    setResultados((prevResultados) => {
      const updateExpanded = (items: ResultadoAuditoria[]): ResultadoAuditoria[] => {
        return items.map((item) => {
          if (item.id === id) {
            return { ...item, expanded: !item.expanded }
          }
          if (item.children) {
            return { ...item, children: updateExpanded(item.children) }
          }
          return item
        })
      }
      return updateExpanded(prevResultados)
    })
  }

  const renderRow = (item: ResultadoAuditoria) => {
    const isParent = item.hasChildren || (item.children && item.children.length > 0)
    const paddingLeft = item.level ? `${item.level * 24}px` : "0px"

    // Função para determinar a cor de fundo com base no valor percentual
    const getBackgroundColor = (value: number) => {
      if (value === 0) return "bg-red-600 text-white"
      if (value <= 20) return "bg-red-500 text-white"
      if (value <= 40) return "bg-orange-500 text-white"
      if (value <= 60) return "bg-yellow-500 text-white"
      if (value <= 80) return "bg-green-400 text-white"
      if (value <= 99) return "bg-green-500 text-white"
      if (value === 100) return "bg-green-600 text-white"
      return ""
    }

    // Função para determinar a cor de fundo para a coluna de inseguro (invertida)
    const getInseguroColor = (value: number) => {
      if (value === 0) return "bg-green-600 text-white"
      if (value <= 20) return "bg-green-500 text-white"
      if (value <= 40) return "bg-yellow-500 text-white"
      if (value <= 60) return "bg-orange-500 text-white"
      if (value <= 80) return "bg-red-500 text-white"
      if (value >= 80) return "bg-red-600 text-white"
      return ""
    }

    return (
      <>
        <tr key={item.id} className={item.parent ? "bg-gray-50" : ""}>
          <td className="px-4 py-2 whitespace-nowrap text-sm">
            <div className="flex items-center" style={{ paddingLeft }}>
              {isParent && (
                <button onClick={() => toggleExpand(item.id)} className="mr-1 focus:outline-none">
                  {item.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              )}
              {!isParent && <div className="w-5 mr-1"></div>}
              {item.regional}
            </div>
          </td>
          <td className="px-4 py-2 whitespace-nowrap text-sm">{item.unidade}</td>
          <td className="px-4 py-2 whitespace-nowrap text-sm text-center">{item.codGestor || ""}</td>
          <td className="px-4 py-2 whitespace-nowrap text-sm">{item.gestor}</td>
          <td className={`px-4 py-2 whitespace-nowrap text-sm text-center ${getBackgroundColor(item.semana1)}`}>
            {typeof item.semana1 === "number" && !isNaN(item.semana1)
              ? Number.isInteger(item.semana1) && item.semana1 <= 5
                ? item.semana1
                : `${item.semana1.toFixed(1)}%`
              : ""}
          </td>
          <td className={`px-4 py-2 whitespace-nowrap text-sm text-center ${getBackgroundColor(item.semana2)}`}>
            {typeof item.semana2 === "number" && !isNaN(item.semana2)
              ? Number.isInteger(item.semana2) && item.semana2 <= 20
                ? item.semana2
                : `${item.semana2.toFixed(1)}%`
              : ""}
          </td>
          <td className={`px-4 py-2 whitespace-nowrap text-sm text-center ${getBackgroundColor(item.semana3)}`}>
            {typeof item.semana3 === "number" && !isNaN(item.semana3)
              ? Number.isInteger(item.semana3) && item.semana3 <= 5
                ? item.semana3
                : `${item.semana3.toFixed(1)}%`
              : ""}
          </td>
          <td className={`px-4 py-2 whitespace-nowrap text-sm text-center ${getBackgroundColor(item.semana4)}`}>
            {typeof item.semana4 === "number" && !isNaN(item.semana4)
              ? Number.isInteger(item.semana4) && item.semana4 <= 5
                ? item.semana4
                : `${item.semana4.toFixed(1)}%`
              : ""}
          </td>
          <td className={`px-4 py-2 whitespace-nowrap text-sm text-center ${getBackgroundColor(item.semana5)}`}>
            {typeof item.semana5 === "number" && !isNaN(item.semana5)
              ? Number.isInteger(item.semana5) && item.semana5 <= 5
                ? item.semana5
                : `${item.semana5.toFixed(1)}%`
              : ""}
          </td>
          <td className="px-4 py-2 whitespace-nowrap text-sm text-center font-medium">{item.total}</td>
          <td className={`px-4 py-2 whitespace-nowrap text-sm text-center ${getBackgroundColor(item.conformidade)}`}>
            {item.conformidade > 0 ? `${item.conformidade.toFixed(1)}%` : ""}
          </td>
          <td className={`px-4 py-2 whitespace-nowrap text-sm text-center ${getBackgroundColor(item.seguro)}`}>
            {item.seguro > 0 ? `${item.seguro.toFixed(1)}%` : ""}
          </td>
          <td className={`px-4 py-2 whitespace-nowrap text-sm text-center ${getInseguroColor(item.inseguro)}`}>
            {item.inseguro > 0 ? `${item.inseguro.toFixed(1)}%` : ""}
          </td>
        </tr>
        {item.expanded && item.children && item.children.map((child) => renderRow(child))}
      </>
    )
  }

  const meses = [
    { valor: "1", nome: "Janeiro" },
    { valor: "2", nome: "Fevereiro" },
    { valor: "3", nome: "Março" },
    { valor: "4", nome: "Abril" },
    { valor: "5", nome: "Maio" },
    { valor: "6", nome: "Junho" },
    { valor: "7", nome: "Julho" },
    { valor: "8", nome: "Agosto" },
    { valor: "9", nome: "Setembro" },
    { valor: "10", nome: "Outubro" },
    { valor: "11", nome: "Novembro" },
    { valor: "12", nome: "Dezembro" },
  ]

  const regionais = [
    { valor: "1", nome: "Norte" },
    { valor: "2", nome: "Nordeste" },
    { valor: "3", nome: "Centro-Oeste" },
    { valor: "4", nome: "Sudeste" },
    { valor: "5", nome: "Sul" },
  ]

  const filiais = [
    { valor: "1", nome: "São Paulo" },
    { valor: "2", nome: "Rio de Janeiro" },
    { valor: "3", nome: "Belo Horizonte" },
    { valor: "4", nome: "Brasília" },
    { valor: "5", nome: "Salvador" },
    { valor: "6", nome: "Recife" },
    { valor: "7", nome: "Porto Alegre" },
  ]

  const setores = [
    { valor: "1", nome: "Operações" },
    { valor: "2", nome: "Administrativo" },
    { valor: "3", nome: "Logística" },
    { valor: "4", nome: "Financeiro" },
    { valor: "5", nome: "Comercial" },
    { valor: "6", nome: "Recursos Humanos" },
  ]

  const perfisAgrupadores = [
    { valor: "1", nome: "Gerente" },
    { valor: "2", nome: "Supervisor" },
    { valor: "3", nome: "Coordenador" },
    { valor: "4", nome: "Diretor" },
  ]

  return (
    <div className="max-w-full mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Painel de Auditoria Comportamental x Gestor</h2>
        <p className="text-gray-500 mt-1">Visualize e analise os dados de auditoria por gestor</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <Select value={regional} onValueChange={setRegional}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Regional" />
              </SelectTrigger>
              <SelectContent>
                {regionais.map((item) => (
                  <SelectItem key={item.valor} value={item.valor}>
                    {item.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={filial} onValueChange={setFilial}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filial" />
              </SelectTrigger>
              <SelectContent>
                {filiais.map((item) => (
                  <SelectItem key={item.valor} value={item.valor}>
                    {item.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={setor} onValueChange={setSetor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Setor" />
              </SelectTrigger>
              <SelectContent>
                {setores.map((item) => (
                  <SelectItem key={item.valor} value={item.valor}>
                    {item.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={perfilAgrupador} onValueChange={setPerfilAgrupador}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Perfil Agrupador" />
              </SelectTrigger>
              <SelectContent>
                {perfisAgrupadores.map((item) => (
                  <SelectItem key={item.valor} value={item.valor}>
                    {item.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <Select value={mes} onValueChange={setMes}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {meses.map((item) => (
                  <SelectItem key={item.valor} value={item.valor}>
                    {item.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !ano && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {ano ? format(ano, "yyyy", { locale: ptBR }) : "Ano"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={ano}
                  onSelect={setAno}
                  initialFocus
                  disabled={(date) => date.getFullYear() < 2020 || date.getFullYear() > 2030}
                  captionLayout="dropdown-buttons"
                  fromYear={2020}
                  toYear={2030}
                  showMonthYearPicker={true}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="exibirSetorSemAuditoria"
              checked={exibirSetorSemAuditoria}
              onCheckedChange={(checked) => setExibirSetorSemAuditoria(checked === true)}
            />
            <label
              htmlFor="exibirSetorSemAuditoria"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Exibir setor sem auditoria
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleConsultar}
            disabled={isConsultando}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isConsultando ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Consultando...
              </span>
            ) : (
              <span className="flex items-center">
                <SearchIcon className="mr-2 h-4 w-4" />
                CONSULTAR
              </span>
            )}
          </Button>
        </div>
      </div>

      {resultados.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Regional
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Unidade
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cod. gestor
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Gestor
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Semana 1
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Semana 2
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Semana 3
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Semana 4
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Semana 5
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  % Conformidade
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  % Seguro
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  % Inseguro
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">{resultados.map((item) => renderRow(item))}</tbody>
          </table>
        </div>
      )}

      {resultados.length === 0 && !isConsultando && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-gray-500">Utilize os filtros acima e clique em CONSULTAR para visualizar os resultados.</p>
        </div>
      )}

      {/* Modal de visualização */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <InfoIcon className="h-5 w-5 mr-2 text-blue-500" />
              Detalhes da Auditoria
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div className="text-center">
              <p className="text-gray-700">
                Visualizando auditoria do gestor <span className="font-semibold">{gestorSelecionado}</span> do setor{" "}
                <span className="font-semibold">{setorSelecionado}</span>.
              </p>
              <p className="text-gray-500 mt-2">Esta funcionalidade será implementada em breve.</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setModalAberto(false)} className="w-full sm:w-auto">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

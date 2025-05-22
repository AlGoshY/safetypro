"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowUpDown, Download, Edit, FileText, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { exportToCSV } from "@/lib/export-import-utils"

// Tipos
interface Indicador {
  id: string
  codigo: string
  nome: string
  descricao: string
  valor: number
  meta: number
  unidade: string
  tipo: string
  categoria: string
  responsavel: string
  status: boolean
  observacao: string
  dataCriacao: string
  dataAtualizacao: string
}

// Dados de exemplo
const indicadoresIniciais: Indicador[] = [
  {
    id: "1",
    codigo: "IND-001",
    nome: "Taxa de Acidentes",
    descricao: "Taxa de acidentes de trabalho por 100 funcionários",
    valor: 2.5,
    meta: 1.0,
    unidade: "%",
    tipo: "Segurança",
    categoria: "Crítico",
    responsavel: "João Silva",
    status: true,
    observacao: "Indicador mensal",
    dataCriacao: "2023-01-15",
    dataAtualizacao: "2023-05-20",
  },
  {
    id: "2",
    codigo: "IND-002",
    nome: "Conformidade EPI",
    descricao: "Percentual de conformidade no uso de EPIs",
    valor: 87.5,
    meta: 95.0,
    unidade: "%",
    tipo: "Segurança",
    categoria: "Importante",
    responsavel: "Maria Santos",
    status: true,
    observacao: "Verificação semanal",
    dataCriacao: "2023-02-10",
    dataAtualizacao: "2023-05-18",
  },
  {
    id: "3",
    codigo: "IND-003",
    nome: "Treinamentos Realizados",
    descricao: "Número de treinamentos de segurança realizados",
    valor: 12,
    meta: 15,
    unidade: "Unidades",
    tipo: "Treinamento",
    categoria: "Normal",
    responsavel: "Carlos Mendes",
    status: true,
    observacao: "Indicador trimestral",
    dataCriacao: "2023-03-05",
    dataAtualizacao: "2023-05-15",
  },
  {
    id: "4",
    codigo: "IND-004",
    nome: "Dias Sem Acidentes",
    descricao: "Número de dias consecutivos sem acidentes de trabalho",
    valor: 45,
    meta: 90,
    unidade: "Dias",
    tipo: "Segurança",
    categoria: "Crítico",
    responsavel: "Ana Oliveira",
    status: true,
    observacao: "Contagem diária",
    dataCriacao: "2023-01-01",
    dataAtualizacao: "2023-05-16",
  },
  {
    id: "5",
    codigo: "IND-005",
    nome: "Inspeções de Segurança",
    descricao: "Número de inspeções de segurança realizadas",
    valor: 8,
    meta: 10,
    unidade: "Unidades",
    tipo: "Inspeção",
    categoria: "Importante",
    responsavel: "Roberto Alves",
    status: false,
    observacao: "Indicador mensal",
    dataCriacao: "2023-02-20",
    dataAtualizacao: "2023-04-30",
  },
]

// Componente principal
export function CadastroIndicadores() {
  const { toast } = useToast()
  const router = useRouter()

  // Estados
  const [indicadores, setIndicadores] = useState<Indicador[]>(indicadoresIniciais)
  const [tabAtiva, setTabAtiva] = useState("lista")
  const [termoBusca, setTermoBusca] = useState("")
  const [ordenacao, setOrdenacao] = useState({ campo: "codigo", crescente: true })
  const [indicadorEditando, setIndicadorEditando] = useState<Indicador | null>(null)
  const [indicadorExcluindo, setIndicadorExcluindo] = useState<Indicador | null>(null)
  const [formData, setFormData] = useState<Omit<Indicador, "id" | "dataCriacao" | "dataAtualizacao">>({
    codigo: "",
    nome: "",
    descricao: "",
    valor: 0,
    meta: 0,
    unidade: "",
    tipo: "",
    categoria: "",
    responsavel: "",
    status: true,
    observacao: "",
  })
  const [erros, setErros] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [sucessoSalvar, setSucessoSalvar] = useState(false)

  // Efeito para carregar dados do indicador em edição
  useEffect(() => {
    if (indicadorEditando) {
      setFormData({
        codigo: indicadorEditando.codigo,
        nome: indicadorEditando.nome,
        descricao: indicadorEditando.descricao,
        valor: indicadorEditando.valor,
        meta: indicadorEditando.meta,
        unidade: indicadorEditando.unidade,
        tipo: indicadorEditando.tipo,
        categoria: indicadorEditando.categoria,
        responsavel: indicadorEditando.responsavel,
        status: indicadorEditando.status,
        observacao: indicadorEditando.observacao,
      })
      setTabAtiva("cadastro")
    }
  }, [indicadorEditando])

  // Função para ordenar indicadores
  const ordenarIndicadores = (campo: keyof Indicador) => {
    if (ordenacao.campo === campo) {
      setOrdenacao({ ...ordenacao, crescente: !ordenacao.crescente })
    } else {
      setOrdenacao({ campo, crescente: true })
    }
  }

  // Função para filtrar indicadores
  const indicadoresFiltrados = indicadores
    .filter((indicador) => {
      const termoLowerCase = termoBusca.toLowerCase()
      return (
        indicador.codigo.toLowerCase().includes(termoLowerCase) ||
        indicador.nome.toLowerCase().includes(termoLowerCase) ||
        indicador.tipo.toLowerCase().includes(termoLowerCase) ||
        indicador.categoria.toLowerCase().includes(termoLowerCase) ||
        indicador.responsavel.toLowerCase().includes(termoLowerCase)
      )
    })
    .sort((a, b) => {
      const valorA = a[ordenacao.campo as keyof Indicador]
      const valorB = b[ordenacao.campo as keyof Indicador]

      if (typeof valorA === "string" && typeof valorB === "string") {
        return ordenacao.crescente ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA)
      } else if (typeof valorA === "number" && typeof valorB === "number") {
        return ordenacao.crescente ? valorA - valorB : valorB - valorA
      } else if (typeof valorA === "boolean" && typeof valorB === "boolean") {
        return ordenacao.crescente ? (valorA ? 1 : 0) - (valorB ? 1 : 0) : (valorB ? 1 : 0) - (valorA ? 1 : 0)
      }
      return 0
    })

  // Função para validar o formulário
  const validarFormulario = () => {
    const novosErros: Record<string, string> = {}

    if (!formData.codigo.trim()) novosErros.codigo = "Código é obrigatório"
    if (!formData.nome.trim()) novosErros.nome = "Nome é obrigatório"
    if (!formData.unidade.trim()) novosErros.unidade = "Unidade é obrigatória"
    if (!formData.tipo.trim()) novosErros.tipo = "Tipo é obrigatório"
    if (!formData.categoria.trim()) novosErros.categoria = "Categoria é obrigatória"
    if (!formData.responsavel.trim()) novosErros.responsavel = "Responsável é obrigatório"

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  // Função para lidar com mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Limpar erro do campo quando o usuário digitar
    if (erros[name]) {
      setErros({ ...erros, [name]: "" })
    }
  }

  // Função para lidar com mudanças em campos numéricos
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: Number.parseFloat(value) || 0 })

    if (erros[name]) {
      setErros({ ...erros, [name]: "" })
    }
  }

  // Função para lidar com mudanças no switch
  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, status: checked })
  }

  // Função para lidar com mudanças no select
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })

    if (erros[name]) {
      setErros({ ...erros, [name]: "" })
    }
  }

  // Função para salvar indicador
  const salvarIndicador = async () => {
    if (!validarFormulario()) return

    setIsLoading(true)

    try {
      // Simula uma chamada de API (pode ser substituído por uma chamada real)
      await new Promise((resolve) => setTimeout(resolve, 800))

      const dataAtual = new Date().toISOString().split("T")[0]

      if (indicadorEditando) {
        // Atualizar indicador existente
        const indicadoresAtualizados = indicadores.map((ind) =>
          ind.id === indicadorEditando.id
            ? {
                ...ind,
                ...formData,
                dataAtualizacao: dataAtual,
              }
            : ind,
        )

        setIndicadores(indicadoresAtualizados)
        toast({
          title: "Indicador atualizado",
          description: `O indicador ${formData.nome} foi atualizado com sucesso.`,
        })
      } else {
        // Criar novo indicador
        const novoIndicador: Indicador = {
          id: `${indicadores.length + 1}`,
          ...formData,
          dataCriacao: dataAtual,
          dataAtualizacao: dataAtual,
        }

        setIndicadores([...indicadores, novoIndicador])
        toast({
          title: "Indicador criado",
          description: `O indicador ${formData.nome} foi criado com sucesso.`,
        })
      }

      // Exibe mensagem de sucesso
      setSucessoSalvar(true)

      // Esconde a mensagem após 3 segundos
      setTimeout(() => {
        setSucessoSalvar(false)
        // Resetar formulário e voltar para a lista
        resetarFormulario()
        setTabAtiva("lista")
      }, 3000)
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o indicador. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para excluir indicador
  const excluirIndicador = () => {
    if (!indicadorExcluindo) return

    const indicadoresAtualizados = indicadores.filter((ind) => ind.id !== indicadorExcluindo.id)

    setIndicadores(indicadoresAtualizados)
    setIndicadorExcluindo(null)

    toast({
      title: "Indicador excluído",
      description: `O indicador ${indicadorExcluindo.nome} foi excluído com sucesso.`,
    })
  }

  // Função para exportar indicadores
  const exportarIndicadores = () => {
    const dadosParaExportar = indicadoresFiltrados.map((ind) => ({
      Código: ind.codigo,
      Nome: ind.nome,
      Descrição: ind.descricao,
      Valor: ind.valor,
      Meta: ind.meta,
      Unidade: ind.unidade,
      Tipo: ind.tipo,
      Categoria: ind.categoria,
      Responsável: ind.responsavel,
      Status: ind.status ? "Ativo" : "Inativo",
      Observação: ind.observacao,
      "Data de Criação": ind.dataCriacao,
      "Última Atualização": ind.dataAtualizacao,
    }))

    exportToCSV(dadosParaExportar, "indicadores")

    toast({
      title: "Exportação concluída",
      description: "Os indicadores foram exportados com sucesso.",
    })
  }

  // Função para resetar o formulário
  const resetarFormulario = () => {
    setFormData({
      codigo: "",
      nome: "",
      descricao: "",
      valor: 0,
      meta: 0,
      unidade: "",
      tipo: "",
      categoria: "",
      responsavel: "",
      status: true,
      observacao: "",
    })
    setIndicadorEditando(null)
    setErros({})
  }

  // Função para iniciar novo cadastro
  const iniciarNovoCadastro = () => {
    resetarFormulario()
    setTabAtiva("cadastro")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cadastro de Indicadores</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gerencie os indicadores para acompanhamento em reuniões
          </p>
        </div>
      </div>

      <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="lista" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Lista de Indicadores</span>
          </TabsTrigger>
          <TabsTrigger value="cadastro" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>{indicadorEditando ? "Editar Indicador" : "Novo Indicador"}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar indicadores..."
                className="pl-9"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" className="flex items-center gap-2" onClick={exportarIndicadores}>
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </Button>
              <Button className="flex items-center gap-2" onClick={iniciarNovoCadastro}>
                <Plus className="h-4 w-4" />
                <span>Novo Indicador</span>
              </Button>
            </div>
          </div>

          <div className="rounded-md border bg-white dark:bg-gray-950">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 p-0 font-medium"
                        onClick={() => ordenarIndicadores("codigo")}
                      >
                        Código
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 p-0 font-medium"
                        onClick={() => ordenarIndicadores("nome")}
                      >
                        Nome
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 p-0 font-medium"
                        onClick={() => ordenarIndicadores("valor")}
                      >
                        Valor
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 p-0 font-medium"
                        onClick={() => ordenarIndicadores("meta")}
                      >
                        Meta
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 p-0 font-medium"
                        onClick={() => ordenarIndicadores("tipo")}
                      >
                        Tipo
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 p-0 font-medium"
                        onClick={() => ordenarIndicadores("categoria")}
                      >
                        Categoria
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden xl:table-cell">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 p-0 font-medium"
                        onClick={() => ordenarIndicadores("responsavel")}
                      >
                        Responsável
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[100px]">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 p-0 font-medium"
                        onClick={() => ordenarIndicadores("status")}
                      >
                        Status
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[100px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {indicadoresFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        Nenhum indicador encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    indicadoresFiltrados.map((indicador) => (
                      <TableRow key={indicador.id}>
                        <TableCell className="font-medium">{indicador.codigo}</TableCell>
                        <TableCell>{indicador.nome}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {indicador.valor} {indicador.unidade}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {indicador.meta} {indicador.unidade}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{indicador.tipo}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            variant={
                              indicador.categoria === "Crítico"
                                ? "destructive"
                                : indicador.categoria === "Importante"
                                  ? "warning"
                                  : "default"
                            }
                          >
                            {indicador.categoria}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">{indicador.responsavel}</TableCell>
                        <TableCell>
                          <Badge variant={indicador.status ? "success" : "outline"}>
                            {indicador.status ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setIndicadorEditando(indicador)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setIndicadorExcluindo(indicador)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cadastro" className="space-y-4">
          <div className="grid gap-6 rounded-lg border bg-white p-6 dark:bg-gray-950">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="codigo">
                  Código <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="codigo"
                  name="codigo"
                  placeholder="Ex: IND-001"
                  value={formData.codigo}
                  onChange={handleChange}
                  className={erros.codigo ? "border-red-500" : ""}
                />
                {erros.codigo && <p className="text-xs text-red-500">{erros.codigo}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">
                  Nome <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Nome do indicador"
                  value={formData.nome}
                  onChange={handleChange}
                  className={erros.nome ? "border-red-500" : ""}
                />
                {erros.nome && <p className="text-xs text-red-500">{erros.nome}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                placeholder="Descrição detalhada do indicador"
                value={formData.descricao}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="valor">Valor Atual</Label>
                <Input
                  id="valor"
                  name="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta">Meta</Label>
                <Input
                  id="meta"
                  name="meta"
                  type="number"
                  step="0.01"
                  value={formData.meta}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade">
                  Unidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="unidade"
                  name="unidade"
                  placeholder="Ex: %, unidades, dias"
                  value={formData.unidade}
                  onChange={handleChange}
                  className={erros.unidade ? "border-red-500" : ""}
                />
                {erros.unidade && <p className="text-xs text-red-500">{erros.unidade}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="tipo">
                  Tipo <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                  <SelectTrigger id="tipo" className={erros.tipo ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Segurança">Segurança</SelectItem>
                    <SelectItem value="Saúde">Saúde</SelectItem>
                    <SelectItem value="Meio Ambiente">Meio Ambiente</SelectItem>
                    <SelectItem value="Qualidade">Qualidade</SelectItem>
                    <SelectItem value="Produtividade">Produtividade</SelectItem>
                    <SelectItem value="Treinamento">Treinamento</SelectItem>
                    <SelectItem value="Inspeção">Inspeção</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                {erros.tipo && <p className="text-xs text-red-500">{erros.tipo}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">
                  Categoria <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.categoria} onValueChange={(value) => handleSelectChange("categoria", value)}>
                  <SelectTrigger id="categoria" className={erros.categoria ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Crítico">Crítico</SelectItem>
                    <SelectItem value="Importante">Importante</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
                {erros.categoria && <p className="text-xs text-red-500">{erros.categoria}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsavel">
                  Responsável <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="responsavel"
                  name="responsavel"
                  placeholder="Nome do responsável"
                  value={formData.responsavel}
                  onChange={handleChange}
                  className={erros.responsavel ? "border-red-500" : ""}
                />
                {erros.responsavel && <p className="text-xs text-red-500">{erros.responsavel}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacao">Observações</Label>
              <Textarea
                id="observacao"
                name="observacao"
                placeholder="Observações adicionais sobre o indicador"
                value={formData.observacao}
                onChange={handleChange}
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="status" checked={formData.status} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="status">Indicador ativo</Label>
            </div>

            <div className="space-y-4">
              {sucessoSalvar && (
                <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Indicador {indicadorEditando ? "atualizado" : "salvo"} com sucesso!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetarFormulario()
                    setTabAtiva("lista")
                  }}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button onClick={salvarIndicador} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                  {isLoading ? (
                    <>
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    <>{indicadorEditando ? "Atualizar" : "Salvar"} Indicador</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={!!indicadorExcluindo} onOpenChange={() => setIndicadorExcluindo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o indicador{" "}
              <span className="font-semibold">{indicadorExcluindo?.nome}</span>?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={excluirIndicador} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

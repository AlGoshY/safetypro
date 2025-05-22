"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ChevronDown, ChevronRight, Filter, Search, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { ParametrizarAtividadesModal } from "./parametrizar-atividades-modal"

// Tipos
interface Atividade {
  id: number
  processo: string
  atividade: string
  comoAvaliar: string
  frequencia: string
  parametrizada: boolean
  unidade: string
  tecnico: string
  detalhes?: {
    dataParametrizacao?: string
    responsavelParametrizacao?: string
    observacoes?: string
    ultimaAtualizacao?: string
    anexos?: Array<{
      nome: string
      tipo: string
      tamanho: string
      url: string
    }>
  }
}

interface Unidade {
  id: string
  nome: string
}

interface Tecnico {
  id: string
  nome: string
}

// Dados mockados para demonstração
const UNIDADES: Unidade[] = [
  { id: "1", nome: "Regional Dotse - Demo" },
  { id: "2", nome: "Unidade Central" },
  { id: "3", nome: "Filial Norte" },
  { id: "4", nome: "Filial Sul" },
]

const TECNICOS: Tecnico[] = [
  { id: "ADM", nome: "ADM" },
  { id: "JOAO", nome: "João Silva" },
  { id: "MARIA", nome: "Maria Oliveira" },
  { id: "CARLOS", nome: "Carlos Santos" },
]

const ATIVIDADES_MOCK: Atividade[] = [
  {
    id: 1,
    processo: "Combinados",
    atividade: "1 - Combinados 2023 - Queda de Mesmo Nível",
    comoAvaliar: "Os pisos dos setores possuem superfície antiderrapante?",
    frequencia: "Semanal",
    parametrizada: true,
    unidade: "Regional Dotse - Demo",
    tecnico: "ADM",
    detalhes: {
      dataParametrizacao: "15/04/2023",
      responsavelParametrizacao: "Carlos Santos",
      observacoes:
        "Verificar especialmente nas áreas de circulação e próximo a equipamentos com risco de vazamento de líquidos.",
      ultimaAtualizacao: "20/04/2023",
      anexos: [
        { nome: "Manual_Seguranca.pdf", tipo: "PDF", tamanho: "2.3 MB", url: "#" },
        { nome: "Checklist_Pisos.xlsx", tipo: "Excel", tamanho: "1.1 MB", url: "#" },
      ],
    },
  },
  {
    id: 2,
    processo: "Combinados",
    atividade: "2 - Combinados 2023 - Queda de Mesmo Nível",
    comoAvaliar: "Os pisos dos setores estão livres de resíduos (Carne, Sebo etc.)?",
    frequencia: "Semanal",
    parametrizada: true,
    unidade: "Regional Dotse - Demo",
    tecnico: "ADM",
    detalhes: {
      dataParametrizacao: "15/04/2023",
      responsavelParametrizacao: "Carlos Santos",
      observacoes: "Verificar a limpeza regular e o sistema de drenagem.",
      ultimaAtualizacao: "20/04/2023",
    },
  },
  {
    id: 3,
    processo: "Combinados",
    atividade: "3 - Combinados 2023 - Queda de Mesmo Nível",
    comoAvaliar: "Os locais com risco de queda estão com sinalização (Placa 32 Book de Sinalização)?",
    frequencia: "Semanal",
    parametrizada: true,
    unidade: "Regional Dotse - Demo",
    tecnico: "ADM",
    detalhes: {
      dataParametrizacao: "16/04/2023",
      responsavelParametrizacao: "Maria Oliveira",
      observacoes: "Verificar se as placas estão em bom estado e bem posicionadas para visualização.",
      ultimaAtualizacao: "21/04/2023",
    },
  },
  {
    id: 4,
    processo: "Combinados",
    atividade: "4 - Combinados 2023 - Queda de Mesmo Nível",
    comoAvaliar: "Houve a Implantação da bota MaxiGripe nas tarefas mapeadas (Desossa, Bem.1° e 2°)?",
    frequencia: "Semanal",
    parametrizada: true,
    unidade: "Regional Dotse - Demo",
    tecnico: "ADM",
    detalhes: {
      dataParametrizacao: "16/04/2023",
      responsavelParametrizacao: "João Silva",
      observacoes: "Verificar se todos os colaboradores das áreas mapeadas estão utilizando o EPI adequado.",
      ultimaAtualizacao: "22/04/2023",
    },
  },
  {
    id: 5,
    processo: "Combinados",
    atividade: "5 - Combinados 2023 - Água Quente",
    comoAvaliar:
      "Existe dispositivo que possibilite a realização de bloqueio físico de acesso junto aos pontos de água quente nas linhas de higienização?",
    frequencia: "Semanal",
    parametrizada: true,
    unidade: "Regional Dotse - Demo",
    tecnico: "ADM",
    detalhes: {
      dataParametrizacao: "17/04/2023",
      responsavelParametrizacao: "Carlos Santos",
      observacoes: "Verificar a integridade dos dispositivos de bloqueio e se estão sendo utilizados corretamente.",
      ultimaAtualizacao: "23/04/2023",
    },
  },
  {
    id: 6,
    processo: "Combinados",
    atividade: "6 - Combinados 2023 - Água Quente",
    comoAvaliar: "Existe sistema limitador de água quente até o máximo de 46,1°C?",
    frequencia: "Semanal",
    parametrizada: true,
    unidade: "Regional Dotse - Demo",
    tecnico: "ADM",
    detalhes: {
      dataParametrizacao: "17/04/2023",
      responsavelParametrizacao: "Maria Oliveira",
      observacoes: "Verificar a calibração dos limitadores de temperatura e registrar as medições.",
      ultimaAtualizacao: "23/04/2023",
    },
  },
  {
    id: 7,
    processo: "Elétrica",
    atividade: "1 - Elétrica 2023 - Choque Elétrico",
    comoAvaliar: "Os quadros elétricos estão identificados quanto ao risco de choque?",
    frequencia: "Mensal",
    parametrizada: false,
    unidade: "Filial Norte",
    tecnico: "JOAO",
    detalhes: {
      dataParametrizacao: "18/04/2023",
      responsavelParametrizacao: "João Silva",
      observacoes: "Verificar se todas as sinalizações estão de acordo com a NR-10.",
      ultimaAtualizacao: "24/04/2023",
    },
  },
  {
    id: 8,
    processo: "Elétrica",
    atividade: "2 - Elétrica 2023 - Choque Elétrico",
    comoAvaliar: "Os colaboradores que realizam atividades em instalações elétricas possuem treinamento NR-10?",
    frequencia: "Mensal",
    parametrizada: false,
    unidade: "Filial Sul",
    tecnico: "MARIA",
    detalhes: {
      dataParametrizacao: "18/04/2023",
      responsavelParametrizacao: "Carlos Santos",
      observacoes: "Verificar a validade dos certificados de treinamento e a necessidade de reciclagem.",
      ultimaAtualizacao: "24/04/2023",
    },
  },
]

export function ParametrizacaoTST() {
  const { toast } = useToast()
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>("")
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState<string>("")
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [atividadesFiltradas, setAtividadesFiltradas] = useState<Atividade[]>([])
  const [carregando, setCarregando] = useState<boolean>(false)
  const [paginaAtual, setPaginaAtual] = useState<number>(1)
  const [busca, setBusca] = useState<string>("")
  const [expandidos, setExpandidos] = useState<number[]>([])
  const [mostrarTabela, setMostrarTabela] = useState<boolean>(false)
  const [modalParametrizacaoAberto, setModalParametrizacaoAberto] = useState<boolean>(false)
  const [filtros, setFiltros] = useState({
    processo: "",
    atividade: "",
    comoAvaliar: "",
    frequencia: "",
    parametrizada: "",
    unidade: "",
    tecnico: "",
  })

  const itensPorPagina = 5
  const totalPaginas = Math.ceil(atividadesFiltradas.length / itensPorPagina)

  // Função para buscar atividades parametrizadas
  const buscarAtividadesParametrizadas = () => {
    setCarregando(true)
    setMostrarTabela(true)

    // Simulando uma chamada à API
    setTimeout(() => {
      // Filtrando atividades com base na unidade e técnico selecionados
      const atividadesFiltradas = ATIVIDADES_MOCK.filter(
        (atividade) =>
          (unidadeSelecionada === "all" ||
            atividade.unidade === UNIDADES.find((u) => u.id === unidadeSelecionada)?.nome) &&
          (tecnicoSelecionado === "all" ||
            atividade.tecnico === TECNICOS.find((t) => t.id === tecnicoSelecionado)?.nome),
      )

      setAtividades(atividadesFiltradas)
      setAtividadesFiltradas(atividadesFiltradas)
      setCarregando(false)

      // Expandir a primeira atividade por padrão se houver resultados
      if (atividadesFiltradas.length > 0) {
        setExpandidos([atividadesFiltradas[0].id])
      }

      toast({
        title: "Atividades carregadas",
        description: `${atividadesFiltradas.length} atividades encontradas.`,
      })
    }, 800)
  }

  // Função para alternar a expansão de uma linha
  const toggleExpansao = (id: number) => {
    if (expandidos.includes(id)) {
      setExpandidos(expandidos.filter((expandidoId) => expandidoId !== id))
    } else {
      setExpandidos([...expandidos, id])
    }
  }

  // Função para aplicar filtros
  const aplicarFiltros = () => {
    let resultado = [...atividades]

    if (filtros.processo) {
      resultado = resultado.filter((item) => item.processo.toLowerCase().includes(filtros.processo.toLowerCase()))
    }

    if (filtros.atividade) {
      resultado = resultado.filter((item) => item.atividade.toLowerCase().includes(filtros.atividade.toLowerCase()))
    }

    if (filtros.comoAvaliar) {
      resultado = resultado.filter((item) => item.comoAvaliar.toLowerCase().includes(filtros.comoAvaliar.toLowerCase()))
    }

    if (filtros.frequencia) {
      resultado = resultado.filter((item) => item.frequencia.toLowerCase().includes(filtros.frequencia.toLowerCase()))
    }

    if (filtros.parametrizada && filtros.parametrizada !== "all") {
      resultado = resultado.filter((item) =>
        filtros.parametrizada === "sim" ? item.parametrizada : !item.parametrizada,
      )
    }

    if (filtros.unidade) {
      resultado = resultado.filter((item) => item.unidade.toLowerCase().includes(filtros.unidade.toLowerCase()))
    }

    if (filtros.tecnico) {
      resultado = resultado.filter((item) => item.tecnico.toLowerCase().includes(filtros.tecnico.toLowerCase()))
    }

    // Aplicar busca geral
    if (busca) {
      resultado = resultado.filter(
        (item) =>
          item.processo.toLowerCase().includes(busca.toLowerCase()) ||
          item.atividade.toLowerCase().includes(busca.toLowerCase()) ||
          item.comoAvaliar.toLowerCase().includes(busca.toLowerCase()) ||
          item.frequencia.toLowerCase().includes(busca.toLowerCase()) ||
          item.unidade.toLowerCase().includes(busca.toLowerCase()) ||
          item.tecnico.toLowerCase().includes(busca.toLowerCase()),
      )
    }

    setAtividadesFiltradas(resultado)
    setPaginaAtual(1)
  }

  // Atualizar filtros quando a busca mudar
  useEffect(() => {
    aplicarFiltros()
  }, [busca])

  // Atualizar filtros quando os filtros de coluna mudarem
  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros({ ...filtros, [campo]: valor })
    setTimeout(() => aplicarFiltros(), 100)
  }

  // Limpar todos os filtros
  const limparFiltros = () => {
    setFiltros({
      processo: "",
      atividade: "",
      comoAvaliar: "",
      frequencia: "",
      parametrizada: "",
      unidade: "",
      tecnico: "",
    })
    setBusca("")
    setAtividadesFiltradas(atividades)
  }

  // Calcular itens da página atual
  const itensPaginaAtual = atividadesFiltradas.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)

  // Abrir modal de parametrização
  const abrirModalParametrizacao = () => {
    if (!unidadeSelecionada || unidadeSelecionada === "all") {
      toast({
        title: "Selecione uma unidade",
        description: "É necessário selecionar uma unidade específica para parametrizar atividades.",
        variant: "destructive",
      })
      return
    }

    if (!tecnicoSelecionado || tecnicoSelecionado === "all") {
      toast({
        title: "Selecione um técnico",
        description: "É necessário selecionar um técnico específico para parametrizar atividades.",
        variant: "destructive",
      })
      return
    }

    setModalParametrizacaoAberto(true)
  }

  // Obter nomes da unidade e técnico selecionados
  const unidadeNome = unidadeSelecionada ? UNIDADES.find((u) => u.id === unidadeSelecionada)?.nome : ""
  const tecnicoNome = tecnicoSelecionado ? TECNICOS.find((t) => t.id === tecnicoSelecionado)?.nome : ""

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold">Parametrizar TST/Unidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label htmlFor="unidade" className="text-sm font-medium flex items-center">
                Unidade<span className="text-red-500 ml-1">*</span>
              </label>
              <Select value={unidadeSelecionada} onValueChange={setUnidadeSelecionada}>
                <SelectTrigger id="unidade" className="w-full">
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as unidades</SelectItem>
                  {UNIDADES.map((unidade) => (
                    <SelectItem key={unidade.id} value={unidade.id}>
                      {unidade.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="tecnico" className="text-sm font-medium flex items-center">
                Técnico da Unidade<span className="text-red-500 ml-1">*</span>
              </label>
              <Select value={tecnicoSelecionado} onValueChange={setTecnicoSelecionado}>
                <SelectTrigger id="tecnico" className="w-full">
                  <SelectValue placeholder="Selecione o técnico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os técnicos</SelectItem>
                  {TECNICOS.map((tecnico) => (
                    <SelectItem key={tecnico.id} value={tecnico.id}>
                      {tecnico.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex gap-2">
              <Button
                onClick={buscarAtividadesParametrizadas}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={carregando}
              >
                <Users className="mr-2 h-4 w-4" />
                Consultar Atividades Parametrizadas
              </Button>
              <Button onClick={abrirModalParametrizacao} variant="destructive" disabled={carregando}>
                Parametrizar
              </Button>
            </div>
            {mostrarTabela && (
              <div className="w-full sm:w-auto flex items-center relative">
                <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
            )}
          </div>

          {mostrarTabela && (
            <>
              {atividades.length > 0 ? (
                <>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10"></TableHead>
                          <TableHead>Processo</TableHead>
                          <TableHead>Atividade</TableHead>
                          <TableHead>Como Avaliar</TableHead>
                          <TableHead>Frequência</TableHead>
                          <TableHead>Parametrizada?</TableHead>
                          <TableHead>Unidade</TableHead>
                          <TableHead>Técnico</TableHead>
                        </TableRow>
                        <TableRow>
                          <TableHead></TableHead>
                          <TableHead>
                            <Input
                              placeholder="Filtrar..."
                              value={filtros.processo}
                              onChange={(e) => handleFiltroChange("processo", e.target.value)}
                              className="h-8 text-xs"
                            />
                          </TableHead>
                          <TableHead>
                            <Input
                              placeholder="Filtrar..."
                              value={filtros.atividade}
                              onChange={(e) => handleFiltroChange("atividade", e.target.value)}
                              className="h-8 text-xs"
                            />
                          </TableHead>
                          <TableHead>
                            <Input
                              placeholder="Filtrar..."
                              value={filtros.comoAvaliar}
                              onChange={(e) => handleFiltroChange("comoAvaliar", e.target.value)}
                              className="h-8 text-xs"
                            />
                          </TableHead>
                          <TableHead>
                            <Input
                              placeholder="Filtrar..."
                              value={filtros.frequencia}
                              onChange={(e) => handleFiltroChange("frequencia", e.target.value)}
                              className="h-8 text-xs"
                            />
                          </TableHead>
                          <TableHead>
                            <Select
                              value={filtros.parametrizada}
                              onValueChange={(value) => handleFiltroChange("parametrizada", value)}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Filtrar..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="sim">Sim</SelectItem>
                                <SelectItem value="nao">Não</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableHead>
                          <TableHead>
                            <Input
                              placeholder="Filtrar..."
                              value={filtros.unidade}
                              onChange={(e) => handleFiltroChange("unidade", e.target.value)}
                              className="h-8 text-xs"
                            />
                          </TableHead>
                          <TableHead>
                            <Input
                              placeholder="Filtrar..."
                              value={filtros.tecnico}
                              onChange={(e) => handleFiltroChange("tecnico", e.target.value)}
                              className="h-8 text-xs"
                            />
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {itensPaginaAtual.length > 0 ? (
                          itensPaginaAtual.map((atividade) => (
                            <>
                              <TableRow key={atividade.id} className="hover:bg-gray-50">
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleExpansao(atividade.id)}
                                    className="h-6 w-6"
                                  >
                                    {expandidos.includes(atividade.id) ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TableCell>
                                <TableCell>{atividade.processo}</TableCell>
                                <TableCell>{atividade.atividade}</TableCell>
                                <TableCell className="max-w-xs truncate" title={atividade.comoAvaliar}>
                                  {atividade.comoAvaliar}
                                </TableCell>
                                <TableCell>{atividade.frequencia}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      atividade.parametrizada
                                        ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                        : "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                                    }
                                  >
                                    {atividade.parametrizada ? "Sim" : "Não"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{atividade.unidade}</TableCell>
                                <TableCell>{atividade.tecnico}</TableCell>
                              </TableRow>
                              {expandidos.includes(atividade.id) && atividade.detalhes && (
                                <TableRow>
                                  <TableCell colSpan={8} className="bg-gray-50 p-0">
                                    <div className="p-4 border-t border-gray-200">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                          <h4 className="font-medium text-sm text-gray-700 mb-2">
                                            Informações da Parametrização
                                          </h4>
                                          <div className="space-y-2 text-sm">
                                            <p>
                                              <span className="font-medium">Data de Parametrização:</span>{" "}
                                              {atividade.detalhes.dataParametrizacao}
                                            </p>
                                            <p>
                                              <span className="font-medium">Responsável:</span>{" "}
                                              {atividade.detalhes.responsavelParametrizacao}
                                            </p>
                                            <p>
                                              <span className="font-medium">Última Atualização:</span>{" "}
                                              {atividade.detalhes.ultimaAtualizacao}
                                            </p>
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-sm text-gray-700 mb-2">Observações</h4>
                                          <p className="text-sm text-gray-600">{atividade.detalhes.observacoes}</p>
                                        </div>
                                      </div>

                                      {atividade.detalhes.anexos && atividade.detalhes.anexos.length > 0 && (
                                        <div className="mt-4">
                                          <h4 className="font-medium text-sm text-gray-700 mb-2">Anexos</h4>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {atividade.detalhes.anexos.map((anexo, index) => (
                                              <div
                                                key={index}
                                                className="flex items-center p-2 border rounded-md bg-white"
                                              >
                                                <div className="flex-1">
                                                  <p className="font-medium text-sm">{anexo.nome}</p>
                                                  <p className="text-xs text-gray-500">
                                                    {anexo.tipo} • {anexo.tamanho}
                                                  </p>
                                                </div>
                                                <Button variant="outline" size="sm" className="ml-2">
                                                  Baixar
                                                </Button>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                              Nenhuma atividade encontrada com os critérios informados.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {atividadesFiltradas.length > itensPorPagina && (
                    <div className="flex items-center justify-between space-x-2 py-4">
                      <div className="text-sm text-gray-500">
                        Mostrando {(paginaAtual - 1) * itensPorPagina + 1} a{" "}
                        {Math.min(paginaAtual * itensPorPagina, atividadesFiltradas.length)} de{" "}
                        {atividadesFiltradas.length} registros
                      </div>
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                              className={paginaAtual === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          {Array.from({ length: totalPaginas }).map((_, index) => (
                            <PaginationItem key={index}>
                              <PaginationLink
                                onClick={() => setPaginaAtual(index + 1)}
                                isActive={paginaAtual === index + 1}
                              >
                                {index + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
                              className={paginaAtual === totalPaginas ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}

                  <div className="flex justify-end mt-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" onClick={limparFiltros}>
                            <Filter className="h-4 w-4 mr-2" />
                            Limpar Filtros
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Limpar todos os filtros aplicados</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </>
              ) : carregando ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="text-center py-12 border rounded-md">
                  <p className="text-gray-500 mb-4">
                    Nenhuma atividade parametrizada encontrada para os critérios informados.
                  </p>
                  <p className="text-gray-500 mb-6">
                    Tente selecionar outros filtros ou verifique se existem atividades parametrizadas para esta unidade
                    e técnico.
                  </p>
                  <Button onClick={buscarAtividadesParametrizadas} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Users className="mr-2 h-4 w-4" />
                    Consultar Novamente
                  </Button>
                </div>
              )}
            </>
          )}

          {!mostrarTabela && !carregando && (
            <div className="text-center py-12 border rounded-md">
              <p className="text-gray-500 mb-4">
                Selecione uma unidade e um técnico para consultar as atividades parametrizadas.
              </p>
              <p className="text-gray-500 mb-6">
                Clique em "Consultar Atividades Parametrizadas" para visualizar os resultados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Parametrização */}
      <ParametrizarAtividadesModal
        isOpen={modalParametrizacaoAberto}
        onClose={() => setModalParametrizacaoAberto(false)}
        unidadeSelecionada={unidadeNome}
        tecnicoSelecionado={tecnicoNome}
      />
    </div>
  )
}

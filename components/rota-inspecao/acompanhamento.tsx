"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, ChevronDown, ChevronRight, Download, FileText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Dados mockados para demonstração
const UNIDADES = [
  { value: "unidade-1", label: "Unidade Dotse Demo" },
  { value: "unidade-2", label: "Unidade Central" },
  { value: "unidade-3", label: "Filial Norte" },
]

const SETORES = [
  { value: "all", label: "Todos os setores" },
  { value: "setor-1", label: "Produção" },
  { value: "setor-2", label: "Administrativo" },
  { value: "setor-3", label: "Logística" },
  { value: "setor-4", label: "Manutenção" },
]

const MESES = [
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
]

const ANOS = [
  { value: "2023", label: "2023" },
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
]

// Dados mockados para a tabela
const DADOS_MOCKADOS = [
  {
    id: 1,
    setor: "Produção",
    responsavel: "João Silva",
    data: "10/05/2024",
    totalAtividades: 56,
    atividadesAvaliadas: 56,
    conformes: 48,
    naoConformes: 8,
    naoSeAplica: 0,
    percentualConformidade: 85.7,
    status: "Concluído",
    detalhes: [
      { processo: "Combinados 2023 - Queda de Mesmo Nível", conformes: 12, naoConformes: 3, naoSeAplica: 0 },
      { processo: "Combinados 2023 - Água Quente", conformes: 8, naoConformes: 2, naoSeAplica: 0 },
      { processo: "Elétrica 2023 - Choque Elétrico", conformes: 15, naoConformes: 0, naoSeAplica: 0 },
      { processo: "Ergonomia - Movimentação Manual", conformes: 13, naoConformes: 3, naoSeAplica: 0 },
    ],
  },
  {
    id: 2,
    setor: "Administrativo",
    responsavel: "Maria Oliveira",
    data: "08/05/2024",
    totalAtividades: 32,
    atividadesAvaliadas: 32,
    conformes: 30,
    naoConformes: 2,
    naoSeAplica: 0,
    percentualConformidade: 93.8,
    status: "Concluído",
    detalhes: [
      { processo: "Combinados 2023 - Queda de Mesmo Nível", conformes: 10, naoConformes: 0, naoSeAplica: 0 },
      { processo: "Elétrica 2023 - Choque Elétrico", conformes: 12, naoConformes: 1, naoSeAplica: 0 },
      { processo: "Ergonomia - Movimentação Manual", conformes: 8, naoConformes: 1, naoSeAplica: 0 },
    ],
  },
  {
    id: 3,
    setor: "Logística",
    responsavel: "Carlos Santos",
    data: "05/05/2024",
    totalAtividades: 48,
    atividadesAvaliadas: 45,
    conformes: 40,
    naoConformes: 5,
    naoSeAplica: 3,
    percentualConformidade: 88.9,
    status: "Concluído",
    detalhes: [
      { processo: "Combinados 2023 - Queda de Mesmo Nível", conformes: 15, naoConformes: 2, naoSeAplica: 1 },
      { processo: "Combinados 2023 - Água Quente", conformes: 5, naoConformes: 0, naoSeAplica: 2 },
      { processo: "Elétrica 2023 - Choque Elétrico", conformes: 10, naoConformes: 1, naoSeAplica: 0 },
      { processo: "Ergonomia - Movimentação Manual", conformes: 10, naoConformes: 2, naoSeAplica: 0 },
    ],
  },
  {
    id: 4,
    setor: "Manutenção",
    responsavel: "Ana Pereira",
    data: "02/05/2024",
    totalAtividades: 40,
    atividadesAvaliadas: 20,
    conformes: 15,
    naoConformes: 5,
    naoSeAplica: 0,
    percentualConformidade: 75.0,
    status: "Em andamento",
    detalhes: [
      { processo: "Combinados 2023 - Queda de Mesmo Nível", conformes: 5, naoConformes: 2, naoSeAplica: 0 },
      { processo: "Elétrica 2023 - Choque Elétrico", conformes: 10, naoConformes: 3, naoSeAplica: 0 },
    ],
  },
]

export function RotaInspecaoAcompanhamento() {
  const [unidade, setUnidade] = useState("")
  const [setor, setSetor] = useState("all")
  const [mes, setMes] = useState("")
  const [ano, setAno] = useState("")
  const [busca, setBusca] = useState("")
  const [expandidos, setExpandidos] = useState<number[]>([])

  // Função para alternar a expansão de uma linha
  const toggleExpansao = (id: number) => {
    if (expandidos.includes(id)) {
      setExpandidos(expandidos.filter((expandidoId) => expandidoId !== id))
    } else {
      setExpandidos([...expandidos, id])
    }
  }

  // Função para filtrar dados com base na busca
  const filtrarDados = () => {
    if (!busca.trim()) return DADOS_MOCKADOS

    const termoBusca = busca.toLowerCase()
    return DADOS_MOCKADOS.filter((item) => {
      return (
        item.setor.toLowerCase().includes(termoBusca) ||
        item.responsavel.toLowerCase().includes(termoBusca) ||
        item.data.includes(termoBusca) ||
        item.status.toLowerCase().includes(termoBusca)
      )
    })
  }

  // Função para filtrar por setor
  const filtrarPorSetor = (dados: typeof DADOS_MOCKADOS) => {
    if (setor === "all") return dados

    return dados.filter((item) => {
      // Aqui você faria uma comparação real com o valor do setor
      return item.setor === SETORES.find((s) => s.value === setor)?.label
    })
  }

  // Aplicar filtros
  const dadosFiltrados = filtrarPorSetor(filtrarDados())

  // Calcular estatísticas gerais
  const estatisticas = dadosFiltrados.reduce(
    (acc, item) => {
      acc.totalInspecoes += 1
      acc.totalAtividades += item.totalAtividades
      acc.atividadesAvaliadas += item.atividadesAvaliadas
      acc.conformes += item.conformes
      acc.naoConformes += item.naoConformes
      acc.naoSeAplica += item.naoSeAplica
      return acc
    },
    {
      totalInspecoes: 0,
      totalAtividades: 0,
      atividadesAvaliadas: 0,
      conformes: 0,
      naoConformes: 0,
      naoSeAplica: 0,
    },
  )

  const percentualConformidadeGeral =
    estatisticas.atividadesAvaliadas > 0
      ? ((estatisticas.conformes / (estatisticas.atividadesAvaliadas - estatisticas.naoSeAplica)) * 100).toFixed(1)
      : "0.0"

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <Link
          href="/registros/rota-inspecao/lancamento"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mt-2">Relatório de Acompanhamento</h1>
        <p className="text-gray-500 mt-1">Acompanhe o progresso e resultados das inspeções realizadas</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="unidade" className="block text-sm font-medium text-gray-700 mb-1">
                Unidade
              </label>
              <Select value={unidade} onValueChange={setUnidade}>
                <SelectTrigger id="unidade">
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {UNIDADES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="setor" className="block text-sm font-medium text-gray-700 mb-1">
                Setor
              </label>
              <Select value={setor} onValueChange={setSetor}>
                <SelectTrigger id="setor">
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  {SETORES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="mes" className="block text-sm font-medium text-gray-700 mb-1">
                Mês
              </label>
              <Select value={mes} onValueChange={setMes}>
                <SelectTrigger id="mes">
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {MESES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="ano" className="block text-sm font-medium text-gray-700 mb-1">
                Ano
              </label>
              <Select value={ano} onValueChange={setAno}>
                <SelectTrigger id="ano">
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {ANOS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Resumo do Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500 mb-1">Total de Inspeções</div>
              <div className="text-2xl font-bold text-gray-900">{estatisticas.totalInspecoes}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500 mb-1">Atividades Avaliadas</div>
              <div className="text-2xl font-bold text-gray-900">
                {estatisticas.atividadesAvaliadas} / {estatisticas.totalAtividades}
              </div>
              <Progress
                value={(estatisticas.atividadesAvaliadas / estatisticas.totalAtividades) * 100}
                className="h-2 mt-2"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500 mb-1">Conformidade Geral</div>
              <div className="text-2xl font-bold text-gray-900">{percentualConformidadeGeral}%</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${percentualConformidadeGeral}%` }}></div>
                </div>
                <span className="text-xs text-gray-500">{estatisticas.conformes} conformes</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500 mb-1">Não Conformidades</div>
              <div className="text-2xl font-bold text-red-600">{estatisticas.naoConformes}</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${(estatisticas.naoConformes / estatisticas.atividadesAvaliadas) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">
                  {((estatisticas.naoConformes / estatisticas.atividadesAvaliadas) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Exportar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de inspeções */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Inspeções Realizadas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Atividades</TableHead>
                  <TableHead className="text-right">Conformes</TableHead>
                  <TableHead className="text-right">Não Conformes</TableHead>
                  <TableHead className="text-right">% Conformidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dadosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-6">
                      Nenhuma inspeção encontrada para os critérios informados.
                    </TableCell>
                  </TableRow>
                ) : (
                  dadosFiltrados.map((item) => (
                    <>
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleExpansao(item.id)}
                            className="h-6 w-6"
                          >
                            {expandidos.includes(item.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>{item.setor}</TableCell>
                        <TableCell>{item.responsavel}</TableCell>
                        <TableCell>{item.data}</TableCell>
                        <TableCell className="text-right">
                          {item.atividadesAvaliadas}/{item.totalAtividades}
                        </TableCell>
                        <TableCell className="text-right">{item.conformes}</TableCell>
                        <TableCell className="text-right">{item.naoConformes}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.percentualConformidade >= 90 ? "bg-green-500" : item.percentualConformidade >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
                                style={{ width: `${item.percentualConformidade}%` }}
                              ></div>
                            </div>
                            <span>{item.percentualConformidade}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`
                              ${
                                item.status === "Concluído"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : item.status === "Em andamento"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                              }
                            `}
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandidos.includes(item.id) && (
                        <TableRow>
                          <TableCell colSpan={10} className="bg-gray-50 p-0">
                            <div className="p-4 border-t border-gray-200">
                              <h4 className="font-medium text-sm text-gray-700 mb-3">Detalhes por Processo</h4>
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Processo</TableHead>
                                      <TableHead className="text-right">Conformes</TableHead>
                                      <TableHead className="text-right">Não Conformes</TableHead>
                                      <TableHead className="text-right">Não se Aplica</TableHead>
                                      <TableHead className="text-right">% Conformidade</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {item.detalhes.map((detalhe, index) => {
                                      const total = detalhe.conformes + detalhe.naoConformes
                                      const percentual =
                                        total > 0 ? ((detalhe.conformes / total) * 100).toFixed(1) : "0.0"

                                      return (
                                        <TableRow key={index}>
                                          <TableCell>{detalhe.processo}</TableCell>
                                          <TableCell className="text-right">{detalhe.conformes}</TableCell>
                                          <TableCell className="text-right">{detalhe.naoConformes}</TableCell>
                                          <TableCell className="text-right">{detalhe.naoSeAplica}</TableCell>
                                          <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                  className={`h-full ${
                                                    Number.parseFloat(percentual) >= 90
                                                      ? "bg-green-500"
                                                      : Number.parseFloat(percentual) >= 70
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                                  }`}
                                                  style={{ width: `${percentual}%` }}
                                                ></div>
                                              </div>
                                              <span>{percentual}%</span>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      )
                                    })}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

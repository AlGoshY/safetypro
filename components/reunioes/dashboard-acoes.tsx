"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Filter } from "lucide-react"

// Dados simulados para o dashboard
const acoesPorStatus = [
  { name: "Concluídas", value: 68, color: "#10b981" },
  { name: "Em andamento", value: 23, color: "#3b82f6" },
  { name: "Atrasadas", value: 12, color: "#ef4444" },
  { name: "Canceladas", value: 5, color: "#6b7280" },
]

const tempoResolucaoAcoes = [
  { categoria: "0-7 dias", quantidade: 42 },
  { categoria: "8-15 dias", quantidade: 28 },
  { categoria: "16-30 dias", quantidade: 18 },
  { categoria: "31-60 dias", quantidade: 8 },
  { categoria: "60+ dias", quantidade: 4 },
]

const acoesCriticas = [
  {
    id: "1",
    descricao: "Revisar procedimento de trabalho em altura",
    responsavel: {
      nome: "Marcos Silva",
      avatar: "/abstract-geometric-shapes.png",
      iniciais: "MS",
    },
    reuniao: "CIPA Mensal",
    prazo: "Vencido (2 dias)",
    status: "Em andamento",
    progresso: 75,
    atrasada: true,
  },
  {
    id: "2",
    descricao: "Atualizar mapa de riscos do setor produtivo",
    responsavel: {
      nome: "Ana Oliveira",
      avatar: "/number-two-graphic.png",
      iniciais: "AO",
    },
    reuniao: "Segurança Semanal",
    prazo: "Hoje",
    status: "Em andamento",
    progresso: 90,
    atrasada: true,
  },
  {
    id: "3",
    descricao: "Implementar checklist de inspeção de EPIs",
    responsavel: {
      nome: "Roberto Santos",
      avatar: "/abstract-geometric-shapes.png",
      iniciais: "RS",
    },
    reuniao: "DDS - EPIs",
    prazo: "2 dias",
    status: "Em andamento",
    progresso: 50,
    atrasada: false,
  },
  {
    id: "4",
    descricao: "Realizar treinamento de primeiros socorros",
    responsavel: {
      nome: "Juliana Costa",
      avatar: "/abstract-geometric-shapes.png",
      iniciais: "JC",
    },
    reuniao: "Planejamento Trimestral",
    prazo: "5 dias",
    status: "Em andamento",
    progresso: 25,
    atrasada: false,
  },
]

export default function DashboardAcoes() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar ações com base no termo de busca
  const filteredAcoes = acoesCriticas.filter(
    (acao) =>
      acao.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acao.responsavel.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acao.reuniao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acao.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status das Ações</CardTitle>
            <CardDescription>Distribuição das ações por status atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={acoesPorStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {acoesPorStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tempo de Resolução</CardTitle>
            <CardDescription>Distribuição das ações por tempo de resolução</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tempoResolucaoAcoes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" name="Quantidade de Ações" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Ações Pendentes Críticas</CardTitle>
              <CardDescription>Ações com prazo próximo ou vencido</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Buscar ação..."
                className="w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Descrição</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Responsável</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Reunião</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Prazo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Progresso</th>
                </tr>
              </thead>
              <tbody>
                {filteredAcoes.length > 0 ? (
                  filteredAcoes.map((acao) => (
                    <tr key={acao.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{acao.descricao}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={acao.responsavel.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{acao.responsavel.iniciais}</AvatarFallback>
                          </Avatar>
                          <span>{acao.responsavel.nome}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{acao.reuniao}</td>
                      <td className={`py-3 px-4 ${acao.atrasada ? "text-red-600" : ""}`}>{acao.prazo}</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">{acao.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Progress value={acao.progresso} className="h-2 w-24" />
                          <span className="text-xs">{acao.progresso}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">
                      Nenhuma ação encontrada para "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Ver todas as ações
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

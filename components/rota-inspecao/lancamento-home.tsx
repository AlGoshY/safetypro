"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ClipboardList, Users, BarChart3, FileCheck, FileText, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Definição das funcionalidades disponíveis
const funcionalidades = [
  {
    id: "cadastro-atividades",
    titulo: "Cadastro de Atividades",
    descricao: "Crie e gerencie atividades de SST",
    icone: ClipboardList,
    rota: "/registros/rota-inspecao/atividades",
    cor: "#ef4444",
  },
  {
    id: "parametrizacao",
    titulo: "Parametrização TST/Unidade",
    descricao: "Configure parâmetros por unidade",
    icone: Users,
    rota: "/registros/rota-inspecao/parametrizacao",
    cor: "#f97316",
  },
  {
    id: "relatorio",
    titulo: "Relatório",
    descricao: "Visualize relatórios detalhados",
    icone: BarChart3,
    rota: "/registros/rota-inspecao/relatorio",
    cor: "#3b82f6",
  },
  {
    id: "lancamento",
    titulo: "Lançamento",
    descricao: "Registre novas inspeções",
    icone: FileCheck,
    rota: "/registros/rota-inspecao/lancamento/novo",
    cor: "#10b981",
  },
  {
    id: "relatorio-acompanhamento",
    titulo: "Relatório Acompanhamento",
    descricao: "Acompanhe o progresso das inspeções",
    icone: FileText,
    rota: "/registros/rota-inspecao/acompanhamento",
    cor: "#8b5cf6",
  },
]

// Componente de card de funcionalidade
const FuncionalidadeCard = ({
  titulo,
  descricao,
  icone: Icone,
  rota,
  cor,
}: {
  titulo: string
  descricao: string
  icone: any
  rota: string
  cor: string
}) => {
  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
      <Link href={rota} className="block h-full">
        <Card
          className="h-full border border-gray-200 hover:border-gray-300 hover:ring-1 hover:ring-opacity-50 transition-all duration-200 overflow-hidden group"
          style={{ hoverRing: cor }}
        >
          <CardContent className="p-6 flex flex-col h-full">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors"
              style={{ backgroundColor: `${cor}15` }}
            >
              <Icone className="h-6 w-6" style={{ color: cor }} />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              {titulo}
              <ChevronRight className="h-4 w-4 ml-1 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-gray-400" />
            </h3>

            <p className="text-sm text-gray-500 flex-grow">{descricao}</p>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Acessar</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

export function RotaInspecaoLancamentoHome() {
  const [notificacoes] = useState(3)

  return (
    <div className="min-h-full flex flex-col">
      {/* AppBar */}

      {/* Conteúdo principal */}
      <main className="flex-grow py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Botão voltar */}
          <div className="mb-6">
            <Link
              href="/registros/rota-inspecao"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar para Rota de Inspeção
            </Link>
          </div>

          {/* Título da página */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Rota de Inspeção / Lançamento</h1>
            <p className="text-gray-500 mt-1">
              Selecione uma das opções abaixo para gerenciar suas atividades de inspeção
            </p>
          </div>

          {/* Grid de funcionalidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funcionalidades.map((funcionalidade) => (
              <FuncionalidadeCard
                key={funcionalidade.id}
                titulo={funcionalidade.titulo}
                descricao={funcionalidade.descricao}
                icone={funcionalidade.icone}
                rota={funcionalidade.rota}
                cor={funcionalidade.cor}
              />
            ))}
          </div>

          {/* Seção de atividades recentes */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Atividades Recentes</h2>
              <Button variant="link" className="text-sm text-blue-600">
                Ver todas
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                            item === 1 ? "bg-blue-100" : item === 2 ? "bg-green-100" : "bg-orange-100",
                          )}
                        >
                          <FileCheck
                            className={cn(
                              "h-4 w-4",
                              item === 1 ? "text-blue-600" : item === 2 ? "text-green-600" : "text-orange-600",
                            )}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {item === 1
                              ? "Inspeção realizada"
                              : item === 2
                                ? "Atividade cadastrada"
                                : "Parâmetros atualizados"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item === 1
                              ? "Unidade Dotse Demo • Setor Produção"
                              : item === 2
                                ? "Combinados 2023 - Queda de Mesmo Nível"
                                : "Regional Dotse • Técnico ADM"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {item === 1 ? "Hoje, 10:45" : item === 2 ? "Ontem, 15:30" : "3 dias atrás"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

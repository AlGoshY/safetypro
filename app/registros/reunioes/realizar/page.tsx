"use client"

import { useState } from "react"
import { RealizarReuniao } from "@/components/reunioes/realizar-reuniao"
import { ConfigurarReuniao } from "@/components/reunioes/configurar-reuniao"
import { ChevronLeft, ChevronRight, Clock, FileText, Users } from "lucide-react"

// Interface para representar uma reunião
interface Reuniao {
  id: string
  titulo: string
  dataUltimaRealizacao: string
  frequencia: string
  participantes: number
  pendencias: number
}

export default function RealizarReuniaoPage() {
  const [etapa, setEtapa] = useState<"configuracao" | "selecao" | "realizacao">("configuracao")
  const [unidade, setUnidade] = useState("")
  const [tipoReuniao, setTipoReuniao] = useState("")
  const [reuniaoSelecionada, setReuniaoSelecionada] = useState<Reuniao | null>(null)

  // Dados fictícios de reuniões para demonstração
  const [reunioesDisponiveis, setReunioesDisponiveis] = useState<Reuniao[]>([])

  const handleSalvarConfiguracao = () => {
    if (unidade && tipoReuniao) {
      // Simular carregamento de reuniões com base na unidade e tipo selecionados
      const reunioesFiltradas = gerarReunioesDisponiveis(unidade, tipoReuniao)
      setReunioesDisponiveis(reunioesFiltradas)
      setEtapa("selecao")
    }
  }

  const handleSelecionarReuniao = (reuniao: Reuniao) => {
    setReuniaoSelecionada(reuniao)
    setEtapa("realizacao")
  }

  const handleVoltar = () => {
    if (etapa === "selecao") {
      setEtapa("configuracao")
    } else if (etapa === "realizacao") {
      setEtapa("selecao")
    }
  }

  // Função para gerar dados fictícios de reuniões com base na unidade e tipo
  const gerarReunioesDisponiveis = (unidade: string, tipo: string): Reuniao[] => {
    const nomeUnidade = ["", "Unidade 1", "Unidade 2", "Unidade 3", "Matriz"][Number.parseInt(unidade)] || "Unidade"
    const nomeTipo =
      ["", "CIPA", "Diretoria", "Departamento", "Segurança", "Planejamento"][Number.parseInt(tipo)] || "Reunião"

    return [
      {
        id: "1",
        titulo: `${nomeTipo} Mensal - ${nomeUnidade}`,
        dataUltimaRealizacao: "2025-04-15",
        frequencia: "Mensal",
        participantes: 8,
        pendencias: 3,
      },
      {
        id: "2",
        titulo: `${nomeTipo} Semanal - ${nomeUnidade}`,
        dataUltimaRealizacao: "2025-05-01",
        frequencia: "Semanal",
        participantes: 5,
        pendencias: 2,
      },
      {
        id: "3",
        titulo: `${nomeTipo} Extraordinária - ${nomeUnidade}`,
        dataUltimaRealizacao: "2025-03-22",
        frequencia: "Sob demanda",
        participantes: 12,
        pendencias: 0,
      },
    ]
  }

  // Formatar data para exibição
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  return (
    <div className="container mx-auto">
      {etapa === "configuracao" && (
        <ConfigurarReuniao
          unidade={unidade}
          setUnidade={setUnidade}
          tipoReuniao={tipoReuniao}
          setTipoReuniao={setTipoReuniao}
          onSalvar={handleSalvarConfiguracao}
        />
      )}

      {etapa === "selecao" && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <button
              onClick={handleVoltar}
              className="mr-4 flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded border border-blue-200 hover:bg-blue-100 transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> VOLTAR
            </button>
            <h2 className="text-xl font-semibold">Selecionar Reunião</h2>
          </div>

          <p className="text-gray-500 mb-6">
            Selecione qual reunião deseja realizar para a unidade e tipo selecionados:
          </p>

          <div className="space-y-4">
            {reunioesDisponiveis.map((reuniao) => (
              <div
                key={reuniao.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => handleSelecionarReuniao(reuniao)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{reuniao.titulo}</h3>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        <span>
                          Frequência: <span className="font-medium">{reuniao.frequencia}</span>
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1 text-gray-400" />
                        <span>
                          Última realização:{" "}
                          <span className="font-medium">{formatarData(reuniao.dataUltimaRealizacao)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        <span>
                          Participantes: <span className="font-medium">{reuniao.participantes}</span>
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            reuniao.pendencias > 0 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {reuniao.pendencias} pendências
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center text-blue-600 hover:text-blue-800">
                    Selecionar <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}

            {reunioesDisponiveis.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma reunião encontrada para os critérios selecionados.
              </div>
            )}
          </div>
        </div>
      )}

      {etapa === "realizacao" && reuniaoSelecionada && (
        <RealizarReuniao
          unidade={unidade}
          tipoReuniao={tipoReuniao}
          onVoltar={handleVoltar}
          reuniaoInfo={reuniaoSelecionada}
        />
      )}
    </div>
  )
}

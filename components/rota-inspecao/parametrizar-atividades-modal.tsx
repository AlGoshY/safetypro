"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Copy, Plus, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Tipos
interface AtividadeParametrizacao {
  id: number
  codigo: number
  processo: string
  atividade: string
  setor: string
  oQueAvaliar: string
  frequencia: string
}

interface ParametrizarAtividadesModalProps {
  isOpen: boolean
  onClose: () => void
  unidadeSelecionada: string
  tecnicoSelecionado: string
}

// Dados mockados para demonstração
const ATIVIDADES_MOCK: AtividadeParametrizacao[] = [
  {
    id: 1,
    codigo: 1,
    processo: "Combinados",
    atividade: "(Combinados) - Combinados 2023 - Queda de Mesmo Nível",
    setor: "",
    oQueAvaliar: "Os pisos dos setores possuem superfície antiderrapante?",
    frequencia: "Semanal",
  },
  {
    id: 2,
    codigo: 1,
    processo: "Combinados",
    atividade: "(Combinados) - Combinados 2023 - Queda de Mesmo Nível",
    setor: "Caldeira 2",
    oQueAvaliar: "Os pisos dos setores possuem superfície antiderrapante?",
    frequencia: "Semanal",
  },
  {
    id: 3,
    codigo: 1,
    processo: "Combinados",
    atividade: "(Combinados) - Combinados 2023 - Queda de Mesmo Nível",
    setor: "Caldeira 1",
    oQueAvaliar: "Os pisos dos setores possuem superfície antiderrapante?",
    frequencia: "Semanal",
  },
  {
    id: 4,
    codigo: 2,
    processo: "Combinados",
    atividade: "(Combinados) - Combinados 2023 - Queda de Mesmo Nível",
    setor: "Caldeira 3",
    oQueAvaliar: "Os pisos dos setores estão livres de resíduos (Carne, Sebo etc.)?",
    frequencia: "Semanal",
  },
  {
    id: 5,
    codigo: 3,
    processo: "Combinados",
    atividade: "(Combinados) - Combinados 2023 - Queda de Mesmo Nível",
    setor: "",
    oQueAvaliar: "Os locais com risco de queda estão com sinalização (Placa 32 Book de Sinalização)?",
    frequencia: "Semanal",
  },
  {
    id: 6,
    codigo: 4,
    processo: "Combinados",
    atividade: "(Combinados) - Combinados 2023 - Queda de Mesmo Nível",
    setor: "",
    oQueAvaliar: "Houve a Implantação da bota MaxiGripe nas tarefas mapeadas (Desossa, Bem.1° e 2°)?",
    frequencia: "Semanal",
  },
  {
    id: 7,
    codigo: 5,
    processo: "Combinados",
    atividade: "(Combinados) - Combinados 2023 - Água Quente",
    setor: "",
    oQueAvaliar:
      "Existe dispositivo que possibilite a realização de bloqueio físico de acesso junto aos pontos de água quente nas linhas de higienização?",
    frequencia: "Semanal",
  },
]

export function ParametrizarAtividadesModal({
  isOpen,
  onClose,
  unidadeSelecionada,
  tecnicoSelecionado,
}: ParametrizarAtividadesModalProps) {
  const { toast } = useToast()
  const [atividades, setAtividades] = useState<AtividadeParametrizacao[]>([])
  const [atividadesFiltradas, setAtividadesFiltradas] = useState<AtividadeParametrizacao[]>([])
  const [busca, setBusca] = useState<string>("")
  const [carregando, setCarregando] = useState<boolean>(false)
  const [proximoId, setProximoId] = useState<number>(100) // ID inicial para novas atividades duplicadas

  // Carregar atividades ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      carregarAtividades()
    }
  }, [isOpen])

  // Função para carregar atividades
  const carregarAtividades = () => {
    setCarregando(true)

    // Simulando uma chamada à API
    setTimeout(() => {
      setAtividades([...ATIVIDADES_MOCK])
      setAtividadesFiltradas([...ATIVIDADES_MOCK])
      setCarregando(false)
    }, 500)
  }

  // Função para filtrar atividades com base na busca
  useEffect(() => {
    if (busca.trim() === "") {
      setAtividadesFiltradas([...atividades])
    } else {
      const termoBusca = busca.toLowerCase()
      const filtradas = atividades.filter(
        (atividade) =>
          atividade.codigo.toString().includes(termoBusca) ||
          atividade.processo.toLowerCase().includes(termoBusca) ||
          atividade.atividade.toLowerCase().includes(termoBusca) ||
          atividade.setor.toLowerCase().includes(termoBusca) ||
          atividade.oQueAvaliar.toLowerCase().includes(termoBusca) ||
          atividade.frequencia.toLowerCase().includes(termoBusca),
      )
      setAtividadesFiltradas(filtradas)
    }
  }, [busca, atividades])

  // Função para atualizar o setor de uma atividade
  const atualizarSetor = (id: number, setor: string) => {
    const novasAtividades = atividades.map((atividade) => {
      if (atividade.id === id) {
        return { ...atividade, setor }
      }
      return atividade
    })

    setAtividades(novasAtividades)
    setAtividadesFiltradas(
      atividadesFiltradas.map((atividade) => {
        if (atividade.id === id) {
          return { ...atividade, setor }
        }
        return atividade
      }),
    )
  }

  // Função para duplicar uma atividade
  const duplicarAtividade = (atividade: AtividadeParametrizacao) => {
    const novaAtividade = {
      ...atividade,
      id: proximoId,
      setor: "", // Limpar o setor para permitir nova atribuição
    }

    setProximoId(proximoId + 1)

    const novasAtividades = [...atividades, novaAtividade]
    setAtividades(novasAtividades)
    setAtividadesFiltradas([...atividadesFiltradas, novaAtividade])

    toast({
      title: "Atividade duplicada",
      description: "A atividade foi duplicada com sucesso.",
    })
  }

  // Função para parametrizar atividades
  const parametrizarAtividades = () => {
    // Verificar se há atividades com setor preenchido
    const atividadesComSetor = atividades.filter((atividade) => atividade.setor.trim() !== "")

    if (atividadesComSetor.length === 0) {
      toast({
        title: "Erro ao parametrizar",
        description: "É necessário atribuir pelo menos um setor a uma atividade.",
        variant: "destructive",
      })
      return
    }

    setCarregando(true)

    // Simulando uma chamada à API
    setTimeout(() => {
      setCarregando(false)

      toast({
        title: "Atividades parametrizadas",
        description: `${atividadesComSetor.length} atividades foram parametrizadas com sucesso.`,
      })

      onClose()
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Parametrizar Atividades</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <p>
                <span className="font-medium">Unidade:</span> {unidadeSelecionada || "Não selecionada"}
              </p>
              <p>
                <span className="font-medium">Técnico:</span> {tecnicoSelecionado || "Não selecionado"}
              </p>
            </div>

            <Button
              onClick={parametrizarAtividades}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={carregando}
            >
              <Plus className="mr-2 h-4 w-4" />
              PARAMETRIZAR ATIVIDADES
            </Button>
          </div>

          <div className="border rounded-md">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-medium">Atividades cadastradas</h3>
              <div className="flex items-center relative">
                <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Processo</TableHead>
                    <TableHead>Atividade</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>O que Avaliar</TableHead>
                    <TableHead>Frequência</TableHead>
                    <TableHead className="w-20 text-center">Duplicar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carregando ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : atividadesFiltradas.length > 0 ? (
                    atividadesFiltradas.map((atividade) => (
                      <TableRow key={atividade.id}>
                        <TableCell>{atividade.codigo}</TableCell>
                        <TableCell>{atividade.processo}</TableCell>
                        <TableCell className="max-w-xs truncate" title={atividade.atividade}>
                          {atividade.atividade}
                        </TableCell>
                        <TableCell className="p-0">
                          <Input
                            placeholder="Digite aqui..."
                            value={atividade.setor}
                            onChange={(e) => atualizarSetor(atividade.id, e.target.value)}
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={atividade.oQueAvaliar}>
                          {atividade.oQueAvaliar}
                        </TableCell>
                        <TableCell>{atividade.frequencia}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => duplicarAtividade(atividade)}
                            className="h-8 w-8"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Nenhuma atividade encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

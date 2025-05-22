"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Pesquisa } from "@/types/pesquisa-satisfacao"
import { v4 as uuidv4 } from "uuid"

type PesquisaContextType = {
  pesquisas: Pesquisa[]
  isLoading: boolean
  getPesquisa: (id: string) => Pesquisa | undefined
  criarPesquisa: (pesquisa: Omit<Pesquisa, "id" | "dataCriacao" | "qrCodeUrl" | "linkPublico">) => Promise<Pesquisa>
  atualizarPesquisa: (id: string, pesquisa: Partial<Pesquisa>) => Promise<Pesquisa | null>
  excluirPesquisa: (id: string) => Promise<boolean>
  carregarPesquisas: () => Promise<void>
}

const STORAGE_KEY = "pesquisas_satisfacao"

// Dados de exemplo para inicialização
const dadosExemplo: Pesquisa[] = [
  {
    id: "1",
    titulo: "Pesquisa de Satisfação - Segurança do Trabalho",
    descricao: "Avaliação da satisfação dos colaboradores com as medidas de segurança",
    dataInicio: "2023-04-30",
    dataFim: "2023-05-31",
    dataCriacao: "2023-04-15",
    status: "ativa",
    unidades: ["NOVA VENEZA - ABATE AVES"],
    setores: ["Produção"],
    perguntas: [
      {
        id: "p1",
        texto: "Como você avalia as medidas de segurança adotadas?",
        tipo: "escala",
        obrigatoria: true,
        ordem: 0,
      },
      {
        id: "p2",
        texto: "Você se sente seguro no ambiente de trabalho?",
        tipo: "sim_nao",
        obrigatoria: true,
        ordem: 1,
      },
    ],
    qrCodeUrl: "/qr-code-example.png",
    linkPublico: "/pesquisa-satisfacao/responder/1",
  },
  {
    id: "2",
    titulo: "Avaliação de Clima Organizacional",
    descricao: "Pesquisa para avaliar o clima organizacional da empresa",
    dataInicio: "2023-05-31",
    dataFim: "2023-06-29",
    dataCriacao: "2023-05-15",
    status: "rascunho",
    unidades: ["FORTALEZA - PROCESSADOS"],
    setores: ["Administrativo"],
    perguntas: [
      {
        id: "p3",
        texto: "Como você avalia o ambiente de trabalho?",
        tipo: "escala",
        obrigatoria: true,
        ordem: 0,
      },
      {
        id: "p4",
        texto: "Você se sente valorizado pela empresa?",
        tipo: "escala",
        obrigatoria: true,
        ordem: 1,
      },
      {
        id: "p5",
        texto: "Sugestões para melhorar o clima organizacional:",
        tipo: "texto",
        obrigatoria: false,
        ordem: 2,
      },
    ],
  },
  {
    id: "3",
    titulo: "Pesquisa de Satisfação - Treinamentos SST",
    descricao: "Avaliação da qualidade dos treinamentos de segurança",
    dataInicio: "2023-06-30",
    dataFim: "2023-07-30",
    dataCriacao: "2023-06-15",
    status: "ativa",
    unidades: ["ITAJAÍ - PESCADOS"],
    setores: ["Todos"],
    perguntas: [
      {
        id: "p6",
        texto: "Como você avalia os treinamentos de segurança?",
        tipo: "escala",
        obrigatoria: true,
        ordem: 0,
      },
      {
        id: "p7",
        texto: "Os treinamentos são úteis para o seu dia a dia?",
        tipo: "sim_nao",
        obrigatoria: true,
        ordem: 1,
      },
    ],
    qrCodeUrl: "/qr-code-example.png",
    linkPublico: "/pesquisa-satisfacao/responder/3",
  },
]

const PesquisaContext = createContext<PesquisaContextType | undefined>(undefined)

export function PesquisaProvider({ children }: { children: ReactNode }) {
  const [pesquisas, setPesquisas] = useState<Pesquisa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Inicializar dados - apenas uma vez
  useEffect(() => {
    if (!isInitialized) {
      carregarPesquisas()
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Função para carregar pesquisas do localStorage
  const carregarPesquisas = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log("Carregando pesquisas do localStorage...")

      if (typeof window !== "undefined") {
        const storedData = localStorage.getItem(STORAGE_KEY)

        if (storedData) {
          const parsedData = JSON.parse(storedData)
          console.log("Dados carregados do localStorage:", parsedData)
          setPesquisas(parsedData)
        } else {
          // Se não houver dados no localStorage, usar dados de exemplo
          console.log("Nenhum dado encontrado. Inicializando com dados de exemplo...")
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosExemplo))
          setPesquisas(dadosExemplo)
        }
      }
    } catch (error) {
      console.error("Erro ao carregar pesquisas:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Função para obter uma pesquisa pelo ID
  const getPesquisa = useCallback(
    (id: string) => {
      console.log(`Buscando pesquisa com ID: ${id}`, pesquisas)
      const pesquisa = pesquisas.find((p) => p.id === id)
      console.log("Pesquisa encontrada:", pesquisa)
      return pesquisa
    },
    [pesquisas],
  )

  // Função para criar uma nova pesquisa
  const criarPesquisa = useCallback(
    async (novaPesquisa: Omit<Pesquisa, "id" | "dataCriacao" | "qrCodeUrl" | "linkPublico">): Promise<Pesquisa> => {
      const id = uuidv4()
      const pesquisaCompleta: Pesquisa = {
        ...novaPesquisa,
        id,
        dataCriacao: new Date().toISOString().split("T")[0],
        qrCodeUrl: novaPesquisa.status === "ativa" ? "/qr-code-generic.png" : undefined,
        linkPublico: novaPesquisa.status === "ativa" ? `/pesquisa-satisfacao/responder/${id}` : undefined,
      }

      const novasPesquisas = [...pesquisas, pesquisaCompleta]
      setPesquisas(novasPesquisas)

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(novasPesquisas))
      }

      return pesquisaCompleta
    },
    [pesquisas],
  )

  // Função para atualizar uma pesquisa existente
  const atualizarPesquisa = useCallback(
    async (id: string, dadosAtualizados: Partial<Pesquisa>): Promise<Pesquisa | null> => {
      const index = pesquisas.findIndex((p) => p.id === id)
      if (index === -1) {
        console.error(`Pesquisa com ID ${id} não encontrada para atualização`)
        return null
      }

      // Se estiver mudando para status ativo, adicionar QR Code e link
      if (dadosAtualizados.status === "ativa" && pesquisas[index].status !== "ativa") {
        dadosAtualizados.qrCodeUrl = "/qr-code-generic.png"
        dadosAtualizados.linkPublico = `/pesquisa-satisfacao/responder/${id}`
      }

      const pesquisaAtualizada = { ...pesquisas[index], ...dadosAtualizados }
      const novasPesquisas = [...pesquisas]
      novasPesquisas[index] = pesquisaAtualizada

      setPesquisas(novasPesquisas)

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(novasPesquisas))
      }

      return pesquisaAtualizada
    },
    [pesquisas],
  )

  // Função para excluir uma pesquisa
  const excluirPesquisa = useCallback(
    async (id: string): Promise<boolean> => {
      const novasPesquisas = pesquisas.filter((p) => p.id !== id)

      if (novasPesquisas.length === pesquisas.length) {
        console.error(`Pesquisa com ID ${id} não encontrada para exclusão`)
        return false
      }

      setPesquisas(novasPesquisas)

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(novasPesquisas))
      }

      return true
    },
    [pesquisas],
  )

  const contextValue = {
    pesquisas,
    isLoading,
    getPesquisa,
    criarPesquisa,
    atualizarPesquisa,
    excluirPesquisa,
    carregarPesquisas,
  }

  return <PesquisaContext.Provider value={contextValue}>{children}</PesquisaContext.Provider>
}

export function usePesquisa() {
  const context = useContext(PesquisaContext)
  if (context === undefined) {
    throw new Error("usePesquisa deve ser usado dentro de um PesquisaProvider")
  }
  return context
}

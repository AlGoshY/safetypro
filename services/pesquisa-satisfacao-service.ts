// Serviço para gerenciar pesquisas de satisfação
import { v4 as uuidv4 } from "uuid"
import type { Pesquisa } from "@/types/pesquisa-satisfacao"

// Chave para armazenar as pesquisas no localStorage
const STORAGE_KEY = "pesquisas_satisfacao"

// Função para gerar dados de exemplo se não existirem pesquisas
const gerarDadosExemplo = (): Pesquisa[] => {
  const hoje = new Date()
  const amanha = new Date(hoje)
  amanha.setDate(hoje.getDate() + 1)

  const proximoMes = new Date(hoje)
  proximoMes.setMonth(hoje.getMonth() + 1)

  const mesPassado = new Date(hoje)
  mesPassado.setMonth(hoje.getMonth() - 1)

  return [
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
      linkPublico: "https://exemplo.com/pesquisa/1",
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
      linkPublico: "https://exemplo.com/pesquisa/3",
    },
  ]
}

// Função para inicializar o localStorage com dados de exemplo se necessário
const inicializarDados = (): void => {
  if (typeof window === "undefined") return

  const pesquisasJson = localStorage.getItem(STORAGE_KEY)
  if (!pesquisasJson) {
    const dadosExemplo = gerarDadosExemplo()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosExemplo))
    console.log("Dados de exemplo de pesquisas criados no localStorage")
  }
}

// Função para obter todas as pesquisas
export const obterPesquisas = async (): Promise<Pesquisa[]> => {
  try {
    // Inicializar dados se necessário
    inicializarDados()

    // Obter pesquisas do localStorage
    const pesquisasJson = localStorage.getItem(STORAGE_KEY)
    if (!pesquisasJson) {
      return []
    }

    return JSON.parse(pesquisasJson)
  } catch (error) {
    console.error("Erro ao obter pesquisas:", error)
    return []
  }
}

// Função para obter uma pesquisa específica pelo ID
export const obterPesquisaPorId = async (id: string): Promise<Pesquisa | null> => {
  try {
    console.log(`Obtendo pesquisa com ID: ${id}`)

    // Inicializar dados se necessário
    inicializarDados()

    // Obter pesquisas do localStorage
    const pesquisasJson = localStorage.getItem(STORAGE_KEY)
    if (!pesquisasJson) {
      console.error("Nenhuma pesquisa encontrada no localStorage")
      return null
    }

    const pesquisas: Pesquisa[] = JSON.parse(pesquisasJson)
    const pesquisa = pesquisas.find((p) => p.id === id)

    if (!pesquisa) {
      console.error(`Pesquisa com ID ${id} não encontrada`)
      return null
    }

    console.log("Pesquisa encontrada:", pesquisa)
    return pesquisa
  } catch (error) {
    console.error("Erro ao obter pesquisa por ID:", error)
    return null
  }
}

// Função para criar uma nova pesquisa
export const criarPesquisa = async (
  pesquisa: Omit<Pesquisa, "id" | "dataCriacao" | "qrCodeUrl" | "linkPublico">,
): Promise<Pesquisa> => {
  try {
    // Inicializar dados se necessário
    inicializarDados()

    // Obter pesquisas existentes
    const pesquisasJson = localStorage.getItem(STORAGE_KEY)
    const pesquisas: Pesquisa[] = pesquisasJson ? JSON.parse(pesquisasJson) : []

    // Criar nova pesquisa
    const novaPesquisa: Pesquisa = {
      ...pesquisa,
      id: uuidv4(),
      dataCriacao: new Date().toISOString().split("T")[0],
      qrCodeUrl: pesquisa.status === "ativa" ? "/qr-code-generic.png" : undefined,
      linkPublico: pesquisa.status === "ativa" ? `https://exemplo.com/pesquisa/${uuidv4().slice(0, 8)}` : undefined,
    }

    // Adicionar à lista e salvar
    pesquisas.push(novaPesquisa)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pesquisas))

    return novaPesquisa
  } catch (error) {
    console.error("Erro ao criar pesquisa:", error)
    throw new Error("Não foi possível criar a pesquisa")
  }
}

// Função para atualizar uma pesquisa existente
export const atualizarPesquisa = async (id: string, dadosAtualizados: Partial<Pesquisa>): Promise<Pesquisa> => {
  try {
    // Inicializar dados se necessário
    inicializarDados()

    // Obter pesquisas existentes
    const pesquisasJson = localStorage.getItem(STORAGE_KEY)
    if (!pesquisasJson) {
      throw new Error("Nenhuma pesquisa encontrada")
    }

    const pesquisas: Pesquisa[] = JSON.parse(pesquisasJson)
    const index = pesquisas.findIndex((p) => p.id === id)

    if (index === -1) {
      throw new Error(`Pesquisa com ID ${id} não encontrada`)
    }

    // Se estiver alterando o status para ativo, adicionar QR code e link público
    if (dadosAtualizados.status === "ativa" && pesquisas[index].status !== "ativa") {
      dadosAtualizados.qrCodeUrl = "/qr-code-generic.png"
      dadosAtualizados.linkPublico = `https://exemplo.com/pesquisa/${uuidv4().slice(0, 8)}`
    }

    // Atualizar pesquisa
    const pesquisaAtualizada: Pesquisa = {
      ...pesquisas[index],
      ...dadosAtualizados,
    }

    pesquisas[index] = pesquisaAtualizada
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pesquisas))

    return pesquisaAtualizada
  } catch (error) {
    console.error("Erro ao atualizar pesquisa:", error)
    throw new Error("Não foi possível atualizar a pesquisa")
  }
}

// Função para excluir uma pesquisa
export const excluirPesquisa = async (id: string): Promise<void> => {
  try {
    // Inicializar dados se necessário
    inicializarDados()

    // Obter pesquisas existentes
    const pesquisasJson = localStorage.getItem(STORAGE_KEY)
    if (!pesquisasJson) {
      throw new Error("Nenhuma pesquisa encontrada")
    }

    const pesquisas: Pesquisa[] = JSON.parse(pesquisasJson)
    const novasPesquisas = pesquisas.filter((p) => p.id !== id)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(novasPesquisas))
  } catch (error) {
    console.error("Erro ao excluir pesquisa:", error)
    throw new Error("Não foi possível excluir a pesquisa")
  }
}

// Exportar o serviço completo
export const PesquisaSatisfacaoService = {
  obterPesquisas,
  obterPesquisaPorId,
  criarPesquisa,
  atualizarPesquisa,
  excluirPesquisa,
}

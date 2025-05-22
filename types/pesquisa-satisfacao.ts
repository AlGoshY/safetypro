export type TipoPergunta = "escala" | "multipla_escolha" | "texto" | "checkbox"

export type StatusPesquisa = "rascunho" | "ativa" | "encerrada"

export interface OpcaoResposta {
  id: string
  texto: string
}

export interface Pergunta {
  id: string
  texto: string
  tipo: TipoPergunta
  obrigatoria: boolean
  opcoes?: OpcaoResposta[]
  ordem: number
}

export interface Pesquisa {
  id: string
  titulo: string
  descricao: string
  dataInicio: string
  dataFim: string
  status: StatusPesquisa
  unidades: string[]
  setores: string[]
  perguntas: Pergunta[]
  criadoPor: string
  dataCriacao: string
  qrCodeUrl?: string
  linkPublico?: string
}

export interface Resposta {
  id: string
  pesquisaId: string
  perguntaId: string
  valor: string | string[]
  dataResposta: string
  unidade?: string
  setor?: string
}

export interface RespostaPesquisa {
  id: string
  pesquisaId: string
  dataResposta: string
  unidade?: string
  setor?: string
  respostas: Resposta[]
}

export interface EstatisticasPesquisa {
  totalRespostas: number
  mediaParticipacao: number
  mediaSatisfacao: number
  distribuicaoPorUnidade: Record<string, number>
  distribuicaoPorSetor: Record<string, number>
  respostasPorDia: Record<string, number>
}

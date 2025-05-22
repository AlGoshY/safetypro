import type {
  Pesquisa,
  EstatisticasPesquisa,
  RespostaPesquisa,
  Pergunta,
  OpcaoResposta,
  Resposta,
} from "@/types/pesquisa-satisfacao"
import { v4 as uuidv4 } from "uuid"

// Função para gerar uma data aleatória dentro de um intervalo
const randomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().split("T")[0]
}

// Função para gerar um número aleatório dentro de um intervalo
const randomNumber = (min: number, max: number, decimals = 0): number => {
  const num = Math.random() * (max - min) + min
  const factor = Math.pow(10, decimals)
  return Math.round(num * factor) / factor
}

// Função para gerar um array de números aleatórios que somam 100
const randomPercentages = (count: number): number[] => {
  const numbers: number[] = []
  let remaining = 100

  for (let i = 0; i < count - 1; i++) {
    const max = remaining - (count - i - 1)
    const value = i === count - 2 ? max : randomNumber(1, max)
    numbers.push(value)
    remaining -= value
  }

  numbers.push(remaining)
  return numbers
}

// Função para gerar uma pergunta aleatória
const generateRandomPergunta = (id: number, tipo?: string): Pergunta => {
  const tipos: ("escala" | "multipla_escolha" | "texto" | "checkbox")[] = [
    "escala",
    "multipla_escolha",
    "texto",
    "checkbox",
  ]
  const tipoFinal = tipo || tipos[Math.floor(Math.random() * tipos.length)]

  const perguntasEscala = [
    "Como você avalia a qualidade do produto/serviço?",
    "Qual o seu nível de satisfação com o atendimento recebido?",
    "Como você avalia o tempo de resposta?",
    "Qual o seu nível de satisfação geral?",
    "Como você avalia a relação custo-benefício?",
    "Qual a probabilidade de você recomendar nossos produtos/serviços?",
    "Como você avalia a facilidade de uso do produto/serviço?",
    "Qual o seu nível de satisfação com o suporte técnico?",
    "Como você avalia a comunicação durante o processo?",
    "Qual o seu nível de satisfação com o prazo de entrega?",
  ]

  const perguntasMultiplaEscolha = [
    "Qual aspecto mais influenciou sua decisão de compra?",
    "Como você conheceu nossa empresa?",
    "Qual característica você mais valoriza em nossos produtos?",
    "Qual foi o principal motivo da sua visita hoje?",
    "Qual área você acredita que precisamos melhorar?",
  ]

  const perguntasTexto = [
    "Você tem alguma sugestão para melhorarmos nossos serviços?",
    "O que você mais gostou na sua experiência conosco?",
    "Há algo específico que poderíamos ter feito melhor?",
    "Quais outros produtos ou serviços você gostaria que oferecêssemos?",
    "Deixe um comentário adicional sobre sua experiência:",
  ]

  const perguntasCheckbox = [
    "Quais fatores influenciaram sua decisão de compra?",
    "Quais características você mais valoriza em nossos produtos?",
    "Quais canais de comunicação você prefere?",
    "Quais serviços adicionais você gostaria que oferecêssemos?",
    "Quais aspectos do atendimento você considera mais importantes?",
  ]

  let perguntasArray: string[] = []
  let opcoes: OpcaoResposta[] | undefined = undefined

  switch (tipoFinal) {
    case "escala":
      perguntasArray = perguntasEscala
      break
    case "multipla_escolha":
      perguntasArray = perguntasMultiplaEscolha
      opcoes = [
        { id: uuidv4(), texto: "Preço" },
        { id: uuidv4(), texto: "Qualidade" },
        { id: uuidv4(), texto: "Atendimento" },
        { id: uuidv4(), texto: "Prazo de entrega" },
        { id: uuidv4(), texto: "Reputação da empresa" },
      ]
      break
    case "texto":
      perguntasArray = perguntasTexto
      break
    case "checkbox":
      perguntasArray = perguntasCheckbox
      opcoes = [
        { id: uuidv4(), texto: "Preço" },
        { id: uuidv4(), texto: "Qualidade" },
        { id: uuidv4(), texto: "Atendimento" },
        { id: uuidv4(), texto: "Prazo de entrega" },
        { id: uuidv4(), texto: "Reputação da empresa" },
      ]
      break
  }

  return {
    id: `p${id}`,
    texto: perguntasArray[Math.floor(Math.random() * perguntasArray.length)],
    tipo: tipoFinal,
    obrigatoria: Math.random() > 0.3,
    opcoes,
    ordem: id,
  }
}

// Função para gerar uma resposta aleatória para uma pergunta
const generateRandomResposta = (perguntaId: string, tipo: string): Resposta => {
  let valor: string | string[] = ""

  switch (tipo) {
    case "escala":
      valor = String(randomNumber(1, 5))
      break
    case "multipla_escolha":
      valor = String(randomNumber(0, 4))
      break
    case "texto":
      const comentarios = [
        "Excelente atendimento, equipe muito prestativa.",
        "Produto de ótima qualidade, recomendo!",
        "Atendimento rápido e eficiente.",
        "Tive problemas com o produto, mas o suporte resolveu rapidamente.",
        "Preço um pouco acima do mercado, mas a qualidade compensa.",
        "Entrega dentro do prazo, produto conforme o esperado.",
        "Poderia melhorar o tempo de resposta do suporte.",
        "Muito satisfeito com a experiência de compra.",
        "Produto atendeu às expectativas, mas o prazo de entrega foi maior que o informado.",
        "Equipe muito atenciosa e prestativa.",
      ]
      valor = comentarios[Math.floor(Math.random() * comentarios.length)]
      break
    case "checkbox":
      const opcoes = ["0", "1", "2", "3", "4"]
      const numSelecoes = randomNumber(1, 3)
      const selecoes: string[] = []

      while (selecoes.length < numSelecoes) {
        const opcao = opcoes[Math.floor(Math.random() * opcoes.length)]
        if (!selecoes.includes(opcao)) {
          selecoes.push(opcao)
        }
      }

      valor = selecoes
      break
  }

  return {
    id: uuidv4(),
    pesquisaId: "",
    perguntaId,
    valor,
    dataResposta: "",
  }
}

// Função para gerar uma pesquisa aleatória
const generateRandomPesquisa = (id: string, index: number): Pesquisa => {
  const hoje = new Date()
  const tresSemanasAtras = new Date(hoje)
  tresSemanasAtras.setDate(hoje.getDate() - 21)

  const umaSemanaDepois = new Date(hoje)
  umaSemanaDepois.setDate(hoje.getDate() + 7)

  const umMesDepois = new Date(hoje)
  umMesDepois.setDate(hoje.getDate() + 30)

  const dataInicio = randomDate(tresSemanasAtras, hoje)
  const dataFim = randomDate(umaSemanaDepois, umMesDepois)

  const unidades = [
    "NOVA VENEZA - ABATE AVES",
    "FORTALEZA - PROCESSADOS",
    "ITAJAÍ - PESCADOS",
    "SÃO PAULO - MATRIZ",
    "CHAPECÓ - SUÍNOS",
    "CURITIBA - DISTRIBUIÇÃO",
  ]

  const setores = [
    "Produção",
    "Administrativo",
    "Logística",
    "Recursos Humanos",
    "Financeiro",
    "TI",
    "Marketing",
    "Comercial",
    "Qualidade",
    "Manutenção",
  ]

  const titulos = [
    "Pesquisa de Satisfação - Segurança do Trabalho",
    "Avaliação de Clima Organizacional",
    "Pesquisa de Satisfação - Treinamentos SST",
    "Avaliação de Condições de Trabalho",
    "Pesquisa de Satisfação - Equipamentos de Proteção",
    "Avaliação de Procedimentos de Segurança",
    "Pesquisa de Satisfação - Comunicação Interna",
    "Avaliação de Liderança e Gestão",
    "Pesquisa de Satisfação - Ambiente de Trabalho",
    "Avaliação de Programas de Bem-estar",
  ]

  const descricoes = [
    "Avaliação da satisfação dos colaboradores com as medidas de segurança",
    "Pesquisa para avaliar o clima organizacional da empresa",
    "Avaliação da qualidade dos treinamentos de segurança",
    "Pesquisa para avaliar as condições de trabalho dos colaboradores",
    "Avaliação da satisfação com os equipamentos de proteção fornecidos",
    "Pesquisa para avaliar os procedimentos de segurança implementados",
    "Avaliação da eficácia da comunicação interna",
    "Pesquisa para avaliar a liderança e gestão da empresa",
    "Avaliação da satisfação com o ambiente de trabalho",
    "Pesquisa para avaliar os programas de bem-estar oferecidos",
  ]

  const numUnidades = randomNumber(1, 3)
  const unidadesSelecionadas: string[] = []

  while (unidadesSelecionadas.length < numUnidades) {
    const unidade = unidades[Math.floor(Math.random() * unidades.length)]
    if (!unidadesSelecionadas.includes(unidade)) {
      unidadesSelecionadas.push(unidade)
    }
  }

  const numSetores = randomNumber(1, 4)
  const setoresSelecionados: string[] = []

  while (setoresSelecionados.length < numSetores) {
    const setor = setores[Math.floor(Math.random() * setores.length)]
    if (!setoresSelecionados.includes(setor)) {
      setoresSelecionados.push(setor)
    }
  }

  const numPerguntas = randomNumber(3, 10)
  const perguntas: Pergunta[] = []

  // Garantir pelo menos uma pergunta de cada tipo principal
  perguntas.push(generateRandomPergunta(0, "escala"))
  perguntas.push(generateRandomPergunta(1, "multipla_escolha"))
  perguntas.push(generateRandomPergunta(2, "texto"))

  // Adicionar perguntas aleatórias adicionais
  for (let i = 3; i < numPerguntas; i++) {
    perguntas.push(generateRandomPergunta(i))
  }

  const status: ("rascunho" | "ativa" | "encerrada")[] = ["rascunho", "ativa", "encerrada"]
  const pesquisaStatus = status[Math.floor(Math.random() * status.length)]

  const responsaveis = [
    "Ana Silva",
    "Carlos Santos",
    "Mariana Oliveira",
    "Roberto Almeida",
    "Juliana Costa",
    "Fernando Souza",
    "Patricia Lima",
    "Ricardo Gomes",
    "Camila Pereira",
    "Marcelo Rodrigues",
  ]

  return {
    id,
    titulo: titulos[index % titulos.length],
    descricao: descricoes[index % descricoes.length],
    dataInicio,
    dataFim,
    status: pesquisaStatus,
    unidades: unidadesSelecionadas,
    setores: setoresSelecionados,
    perguntas,
    criadoPor: responsaveis[Math.floor(Math.random() * responsaveis.length)],
    dataCriacao: randomDate(new Date(2023, 0, 1), new Date(2023, 11, 31)),
    qrCodeUrl: pesquisaStatus === "ativa" ? "/qr-code-example.png" : undefined,
    linkPublico: pesquisaStatus === "ativa" ? `https://exemplo.com/pesquisa/${id}` : undefined,
  }
}

// Função para gerar estatísticas aleatórias para uma pesquisa
const generateRandomEstatisticas = (pesquisaId: string): EstatisticasPesquisa => {
  const totalRespostas = randomNumber(50, 500)
  const mediaParticipacao = randomNumber(0.3, 0.9, 2)
  const mediaSatisfacao = randomNumber(3.5, 4.8, 1)

  const distribuicaoPorUnidade: Record<string, number> = {}
  const unidades = [
    "NOVA VENEZA - ABATE AVES",
    "FORTALEZA - PROCESSADOS",
    "ITAJAÍ - PESCADOS",
    "SÃO PAULO - MATRIZ",
    "CHAPECÓ - SUÍNOS",
    "CURITIBA - DISTRIBUIÇÃO",
  ]

  const percentagens = randomPercentages(unidades.length)
  unidades.forEach((unidade, index) => {
    distribuicaoPorUnidade[unidade] = percentagens[index]
  })

  const distribuicaoPorSetor: Record<string, number> = {}
  const setores = [
    "Produção",
    "Administrativo",
    "Logística",
    "Recursos Humanos",
    "Financeiro",
    "TI",
    "Marketing",
    "Comercial",
    "Qualidade",
    "Manutenção",
  ]

  const percentagensSetores = randomPercentages(setores.length)
  setores.forEach((setor, index) => {
    distribuicaoPorSetor[setor] = percentagensSetores[index]
  })

  const respostasPorDia: Record<string, number> = {}
  const hoje = new Date()

  for (let i = 30; i >= 0; i--) {
    const data = new Date(hoje)
    data.setDate(hoje.getDate() - i)
    const dataFormatada = data.toISOString().split("T")[0]
    respostasPorDia[dataFormatada] = randomNumber(0, 30)
  }

  return {
    totalRespostas,
    mediaParticipacao,
    mediaSatisfacao,
    distribuicaoPorUnidade,
    distribuicaoPorSetor,
    respostasPorDia,
  }
}

// Função para gerar respostas aleatórias para uma pesquisa
const generateRandomRespostas = (pesquisa: Pesquisa, quantidade: number): RespostaPesquisa[] => {
  const respostas: RespostaPesquisa[] = []
  const hoje = new Date()
  const trintaDiasAtras = new Date(hoje)
  trintaDiasAtras.setDate(hoje.getDate() - 30)

  for (let i = 0; i < quantidade; i++) {
    const dataResposta = randomDate(trintaDiasAtras, hoje)
    const unidade = pesquisa.unidades[Math.floor(Math.random() * pesquisa.unidades.length)]
    const setor = pesquisa.setores[Math.floor(Math.random() * pesquisa.setores.length)]

    const respostasPergunta: Resposta[] = []

    pesquisa.perguntas.forEach((pergunta) => {
      const resposta = generateRandomResposta(pergunta.id, pergunta.tipo)
      resposta.pesquisaId = pesquisa.id
      resposta.dataResposta = dataResposta
      respostasPergunta.push(resposta)
    })

    respostas.push({
      id: uuidv4(),
      pesquisaId: pesquisa.id,
      dataResposta,
      unidade,
      setor,
      respostas: respostasPergunta,
    })
  }

  return respostas
}

// Gerar dados mockados para pesquisas
const generateMockPesquisas = (quantidade: number): Pesquisa[] => {
  const pesquisas: Pesquisa[] = []

  for (let i = 0; i < quantidade; i++) {
    pesquisas.push(generateRandomPesquisa(`pesquisa-${i + 1}`, i))
  }

  return pesquisas
}

// Pesquisa padrão para demonstração
const pesquisaPadrao: Pesquisa = {
  id: "pesquisa-demo",
  titulo: "Pesquisa de Satisfação - Segurança do Trabalho",
  descricao: "Avaliação da satisfação dos colaboradores com as medidas de segurança",
  dataInicio: "2025-04-01",
  dataFim: "2025-05-31",
  status: "ativa",
  unidades: ["NOVA VENEZA - ABATE AVES", "FORTALEZA - PROCESSADOS"],
  setores: ["Produção", "Administrativo", "Logística"],
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
      tipo: "multipla_escolha",
      obrigatoria: true,
      opcoes: [
        { id: "op1", texto: "Sim, completamente" },
        { id: "op2", texto: "Sim, na maior parte do tempo" },
        { id: "op3", texto: "Às vezes" },
        { id: "op4", texto: "Raramente" },
        { id: "op5", texto: "Não, nunca" },
      ],
      ordem: 1,
    },
    {
      id: "p3",
      texto: "Quais equipamentos de proteção você utiliza regularmente?",
      tipo: "checkbox",
      obrigatoria: true,
      opcoes: [
        { id: "op6", texto: "Capacete" },
        { id: "op7", texto: "Luvas" },
        { id: "op8", texto: "Óculos de proteção" },
        { id: "op9", texto: "Protetor auricular" },
        { id: "op10", texto: "Máscara" },
      ],
      ordem: 2,
    },
    {
      id: "p4",
      texto: "Como você avalia os treinamentos de segurança oferecidos?",
      tipo: "escala",
      obrigatoria: true,
      ordem: 3,
    },
    {
      id: "p5",
      texto: "Você tem sugestões para melhorar a segurança no trabalho?",
      tipo: "texto",
      obrigatoria: false,
      ordem: 4,
    },
  ],
  criadoPor: "Ana Silva",
  dataCriacao: "2025-03-15",
  qrCodeUrl: "/qr-code-example.png",
  linkPublico: "https://exemplo.com/pesquisa/demo",
}

// Estatísticas padrão para demonstração
const estatisticasPadrao: EstatisticasPesquisa = {
  totalRespostas: 325,
  mediaParticipacao: 0.78,
  mediaSatisfacao: 4.2,
  distribuicaoPorUnidade: {
    "NOVA VENEZA - ABATE AVES": 65,
    "FORTALEZA - PROCESSADOS": 35,
  },
  distribuicaoPorSetor: {
    Produção: 50,
    Administrativo: 30,
    Logística: 20,
  },
  respostasPorDia: {
    "2025-04-01": 12,
    "2025-04-02": 15,
    "2025-04-03": 10,
    "2025-04-04": 18,
    "2025-04-05": 8,
    "2025-04-06": 5,
    "2025-04-07": 14,
    "2025-04-08": 20,
    "2025-04-09": 17,
    "2025-04-10": 22,
    "2025-04-11": 19,
    "2025-04-12": 11,
    "2025-04-13": 7,
    "2025-04-14": 16,
    "2025-04-15": 21,
    "2025-04-16": 18,
    "2025-04-17": 15,
    "2025-04-18": 13,
    "2025-04-19": 9,
    "2025-04-20": 6,
    "2025-04-21": 12,
    "2025-04-22": 17,
    "2025-04-23": 14,
    "2025-04-24": 11,
    "2025-04-25": 8,
    "2025-04-26": 5,
    "2025-04-27": 10,
    "2025-04-28": 13,
    "2025-04-29": 16,
    "2025-04-30": 19,
  },
}

// Respostas padrão para demonstração
const respostasPadrao: RespostaPesquisa[] = [
  {
    id: "resp1",
    pesquisaId: "pesquisa-demo",
    dataResposta: "2025-04-15",
    unidade: "NOVA VENEZA - ABATE AVES",
    setor: "Produção",
    respostas: [
      {
        id: "r1",
        pesquisaId: "pesquisa-demo",
        perguntaId: "p1",
        valor: "4",
        dataResposta: "2025-04-15",
      },
      {
        id: "r2",
        pesquisaId: "pesquisa-demo",
        perguntaId: "p2",
        valor: "1",
        dataResposta: "2025-04-15",
      },
      {
        id: "r3",
        pesquisaId: "pesquisa-demo",
        perguntaId: "p3",
        valor: ["0", "1", "3"],
        dataResposta: "2025-04-15",
      },
      {
        id: "r4",
        pesquisaId: "pesquisa-demo",
        perguntaId: "p4",
        valor: "5",
        dataResposta: "2025-04-15",
      },
      {
        id: "r5",
        pesquisaId: "pesquisa-demo",
        perguntaId: "p5",
        valor: "Sugiro mais treinamentos práticos e simulações de emergência.",
        dataResposta: "2025-04-15",
      },
    ],
  },
  {
    id: "resp2",
    pesquisaId: "pesquisa-demo",
    dataResposta: "2025-04-16",
    unidade: "FORTALEZA - PROCESSADOS",
    setor: "Administrativo",
    respostas: [
      {
        id: "r6",
        pesquisaId: "pesquisa-demo",
        perguntaId: "p1",
        valor: "3",
        dataResposta: "2025-04-16",
      },
      {
        id: "r7",
        pesquisaId: "pesquisa-demo",
        perguntaId: "p2",
        valor: "2",
        dataResposta: "2025-04-16",
      },
      {
        id: "r8",
        pesquisaId: "pesquisa-demo",
        perguntaId: "p3",
        valor: ["4"],
        dataResposta: "2025-04-16",
      },
      {
        id: "r9",
        pesquisaId: "pesquisa-demo",
        perguntaId: "p4",
        valor: "4",
        dataResposta: "2025-04-16",
      },
      {
        id: "r10",
        pesquisaId: "pesquisa-demo",
        perguntaId: "p5",
        valor: "Melhorar a sinalização de emergência e rotas de fuga.",
        dataResposta: "2025-04-16",
      },
    ],
  },
  {
    id: "resp3",
    pesquisaId: "pesquisa-demo",
    dataResposta: "2025-04-17",
    unidade: "NOVA VENEZA - ABATE AVES",
    setor: "Logística",
    respostas: [
      {
        id: "r11",
        pesquisaId: "pesquisa-demo",
        perguntaId: "p1",
        valor: "5",
        dataResposta: "2025-04-17",
      },
      {
        id: "r12",
        pesquisaId: "pesquisa-demo",
        perguntaId: "p2",
        valor: "0",
        dataResposta: "2025-04-17",
      },
      {
        id: "r13",
        pesquisaId: "pesquisa-demo",
        perguntaId: "p3",
        valor: ["0", "2", "3", "4"],
        dataResposta: "2025-04-17",
      },
      {
        id: "r14",
        pesquisaId: "pesquisa-demo",
        perguntaId: "p4",
        valor: "5",
        dataResposta: "2025-04-17",
      },
      {
        id: "r15",
        pesquisaId: "pesquisa-demo",
        perguntaId: "p5",
        valor: "Excelentes medidas de segurança, não tenho sugestões de melhoria.",
        dataResposta: "2025-04-17",
      },
    ],
  },
]

// Gerar mais respostas para a pesquisa padrão
for (let i = 0; i < 20; i++) {
  const novasRespostas = generateRandomRespostas(pesquisaPadrao, 1)
  respostasPadrao.push(novasRespostas[0])
}

// Exportar o serviço de dados mockados
export const PesquisaSatisfacaoMockService = {
  // Obter todas as pesquisas mockadas
  obterPesquisas: async (): Promise<Pesquisa[]> => {
    return [...generateMockPesquisas(10), pesquisaPadrao]
  },

  // Obter uma pesquisa específica pelo ID
  obterPesquisaPorId: async (id: string): Promise<Pesquisa | null> => {
    if (id === "pesquisa-demo") {
      return pesquisaPadrao
    }

    const pesquisas = generateMockPesquisas(10)
    const pesquisa = pesquisas.find((p) => p.id === id)
    return pesquisa || null
  },

  // Obter estatísticas para uma pesquisa
  obterEstatisticas: async (id: string): Promise<EstatisticasPesquisa> => {
    if (id === "pesquisa-demo") {
      return estatisticasPadrao
    }

    return generateRandomEstatisticas(id)
  },

  // Obter respostas para uma pesquisa
  obterRespostasPorPesquisa: async (id: string): Promise<RespostaPesquisa[]> => {
    if (id === "pesquisa-demo") {
      return respostasPadrao
    }

    const pesquisa = await PesquisaSatisfacaoMockService.obterPesquisaPorId(id)
    if (!pesquisa) {
      return []
    }

    return generateRandomRespostas(pesquisa, randomNumber(20, 50))
  },

  // Obter pesquisa padrão para demonstração
  obterPesquisaPadrao: async (): Promise<Pesquisa> => {
    return pesquisaPadrao
  },

  // Obter estatísticas padrão para demonstração
  obterEstatisticasPadrao: async (): Promise<EstatisticasPesquisa> => {
    return estatisticasPadrao
  },

  // Obter respostas padrão para demonstração
  obterRespostasPadrao: async (): Promise<RespostaPesquisa[]> => {
    return respostasPadrao
  },

  // Dados para gráficos específicos
  obterDadosGraficos: async () => {
    return {
      respostasPorTempo: [
        { data: "01/05", quantidade: 12 },
        { data: "02/05", quantidade: 8 },
        { data: "03/05", quantidade: 15 },
        { data: "04/05", quantidade: 10 },
        { data: "05/05", quantidade: 7 },
        { data: "06/05", quantidade: 14 },
        { data: "07/05", quantidade: 18 },
        { data: "08/05", quantidade: 11 },
        { data: "09/05", quantidade: 9 },
        { data: "10/05", quantidade: 16 },
        { data: "11/05", quantidade: 13 },
        { data: "12/05", quantidade: 20 },
        { data: "13/05", quantidade: 15 },
        { data: "14/05", quantidade: 17 },
      ],

      satisfacaoPorSetor: [
        { setor: "Produção", satisfacao: 4.2, respostas: 45 },
        { setor: "Administrativo", satisfacao: 3.8, respostas: 32 },
        { setor: "Logística", satisfacao: 4.5, respostas: 28 },
        { setor: "Recursos Humanos", satisfacao: 4.0, respostas: 20 },
        { setor: "Financeiro", satisfacao: 3.5, respostas: 15 },
        { setor: "TI", satisfacao: 4.3, respostas: 18 },
      ],

      distribuicaoRespostas: [
        { nome: "Muito Satisfeito", valor: 30, cor: "#10b981" },
        { nome: "Satisfeito", valor: 45, cor: "#3b82f6" },
        { nome: "Neutro", valor: 15, cor: "#f59e0b" },
        { nome: "Insatisfeito", valor: 7, cor: "#ef4444" },
        { nome: "Muito Insatisfeito", valor: 3, cor: "#6b7280" },
      ],

      tendenciaSatisfacao: [
        { mes: "Jan", satisfacao: 3.8 },
        { mes: "Fev", satisfacao: 3.9 },
        { mes: "Mar", satisfacao: 4.0 },
        { mes: "Abr", satisfacao: 4.1 },
        { mes: "Mai", satisfacao: 4.2 },
        { mes: "Jun", satisfacao: 4.3 },
        { mes: "Jul", satisfacao: 4.2 },
        { mes: "Ago", satisfacao: 4.4 },
        { mes: "Set", satisfacao: 4.5 },
        { mes: "Out", satisfacao: 4.6 },
        { mes: "Nov", satisfacao: 4.7 },
        { mes: "Dez", satisfacao: 4.8 },
      ],

      perguntasMaisRelevantes: [
        { id: 1, texto: "Como você avalia o atendimento recebido?", satisfacao: 4.7, respostas: 120 },
        { id: 2, texto: "O produto atendeu suas expectativas?", satisfacao: 4.2, respostas: 118 },
        { id: 3, texto: "Como você avalia a qualidade do produto?", satisfacao: 4.5, respostas: 115 },
        { id: 4, texto: "O prazo de entrega foi satisfatório?", satisfacao: 3.8, respostas: 110 },
        { id: 5, texto: "Como você avalia o custo-benefício?", satisfacao: 4.0, respostas: 105 },
      ],

      comentariosRecentes: [
        {
          id: 1,
          texto: "Excelente atendimento, equipe muito prestativa e atenciosa.",
          autor: "Carlos Silva",
          data: "15/05/2025",
          avaliacao: 5,
          setor: "Produção",
        },
        {
          id: 2,
          texto: "Produto de ótima qualidade, mas o prazo de entrega poderia ser melhor.",
          autor: "Ana Oliveira",
          data: "14/05/2025",
          avaliacao: 4,
          setor: "Logística",
        },
        {
          id: 3,
          texto: "Atendimento rápido e eficiente. Recomendo!",
          autor: "Roberto Santos",
          data: "13/05/2025",
          avaliacao: 5,
          setor: "Administrativo",
        },
        {
          id: 4,
          texto: "Tive problemas com o produto, mas o suporte resolveu rapidamente.",
          autor: "Juliana Costa",
          data: "12/05/2025",
          avaliacao: 3,
          setor: "TI",
        },
        {
          id: 5,
          texto: "Preço um pouco acima do mercado, mas a qualidade compensa.",
          autor: "Marcos Pereira",
          data: "11/05/2025",
          avaliacao: 4,
          setor: "Financeiro",
        },
      ],

      comparativoMensal: [
        { mes: "Jan", atual: 4.2, anterior: 3.9 },
        { mes: "Fev", atual: 4.3, anterior: 4.0 },
        { mes: "Mar", atual: 4.4, anterior: 4.1 },
        { mes: "Abr", atual: 4.5, anterior: 4.2 },
        { mes: "Mai", atual: 4.6, anterior: 4.3 },
        { mes: "Jun", atual: 4.7, anterior: 4.4 },
      ],

      correlacaoFatores: [
        { x: 4.2, y: 95, z: 120, nome: "Atendimento" },
        { x: 3.8, y: 82, z: 95, nome: "Prazo de Entrega" },
        { x: 4.5, y: 98, z: 110, nome: "Qualidade" },
        { x: 4.0, y: 88, z: 105, nome: "Preço" },
        { x: 4.3, y: 92, z: 100, nome: "Suporte" },
        { x: 3.9, y: 85, z: 90, nome: "Comunicação" },
        { x: 4.4, y: 94, z: 115, nome: "Facilidade de Uso" },
      ],

      previsaoProximosMeses: [
        { mes: "Jul", previsto: 4.7, intervaloInferior: 4.5, intervaloSuperior: 4.9 },
        { mes: "Ago", previsto: 4.8, intervaloInferior: 4.6, intervaloSuperior: 5.0 },
        { mes: "Set", previsto: 4.8, intervaloInferior: 4.6, intervaloSuperior: 5.0 },
        { mes: "Out", previsto: 4.9, intervaloInferior: 4.7, intervaloSuperior: 5.0 },
        { mes: "Nov", previsto: 4.9, intervaloInferior: 4.7, intervaloSuperior: 5.0 },
        { mes: "Dez", previsto: 5.0, intervaloInferior: 4.8, intervaloSuperior: 5.0 },
      ],

      indicadoresDesempenho: [
        {
          nome: "Satisfação Geral",
          atual: 4.5,
          anterior: 4.2,
          meta: 4.8,
          tendencia: "aumento",
          previsao: 4.7,
        },
        {
          nome: "Taxa de Resposta",
          atual: 68,
          anterior: 62,
          meta: 75,
          tendencia: "aumento",
          previsao: 72,
        },
        {
          nome: "NPS (Net Promoter Score)",
          atual: 72,
          anterior: 65,
          meta: 80,
          tendencia: "aumento",
          previsao: 76,
        },
        {
          nome: "Tempo Médio de Resposta (min)",
          atual: 3.2,
          anterior: 4.5,
          meta: 2.5,
          tendencia: "diminuicao",
          previsao: 2.8,
        },
        {
          nome: "Índice de Recomendação",
          atual: 85,
          anterior: 78,
          meta: 90,
          tendencia: "aumento",
          previsao: 88,
        },
      ],

      satisfacaoPorCanal: [
        { canal: "Website", satisfacao: 4.3, respostas: 250 },
        { canal: "Aplicativo", satisfacao: 4.1, respostas: 180 },
        { canal: "E-mail", satisfacao: 3.9, respostas: 120 },
        { canal: "QR Code", satisfacao: 4.5, respostas: 200 },
        { canal: "SMS", satisfacao: 4.0, respostas: 90 },
        { canal: "Presencial", satisfacao: 4.7, respostas: 150 },
      ],

      satisfacaoPorPeriodo: [
        { periodo: "Manhã", satisfacao: 4.4, respostas: 320 },
        { periodo: "Tarde", satisfacao: 4.2, respostas: 280 },
        { periodo: "Noite", satisfacao: 4.0, respostas: 190 },
        { periodo: "Madrugada", satisfacao: 3.8, respostas: 70 },
      ],

      pesquisasAtivas: [
        {
          id: "PS001",
          titulo: "Satisfação com Atendimento",
          dataInicio: "2025-05-01",
          dataFim: "2025-05-31",
          respostas: 120,
          satisfacaoMedia: 4.5,
        },
        {
          id: "PS002",
          titulo: "Avaliação de Produtos",
          dataInicio: "2025-05-10",
          dataFim: "2025-06-10",
          respostas: 85,
          satisfacaoMedia: 4.2,
        },
        {
          id: "PS003",
          titulo: "Feedback de Serviços",
          dataInicio: "2025-04-15",
          dataFim: "2025-05-15",
          respostas: 150,
          satisfacaoMedia: 4.7,
        },
        {
          id: "PS004",
          titulo: "Experiência do Cliente",
          dataInicio: "2025-05-05",
          dataFim: "2025-06-05",
          respostas: 95,
          satisfacaoMedia: 4.3,
        },
        {
          id: "PS005",
          titulo: "Avaliação de Suporte",
          dataInicio: "2025-04-20",
          dataFim: "2025-05-20",
          respostas: 110,
          satisfacaoMedia: 4.0,
        },
      ],
    }
  },
}

// Base de conhecimento do sistema SST
// Esta base contém informações sobre o sistema, suas funcionalidades e respostas comuns

export interface KnowledgeItem {
  id: string
  keywords: string[]
  question: string
  answer: string
  category: string
  relatedTopics?: string[]
}

export const knowledgeBase: KnowledgeItem[] = [
  // Informações gerais sobre o sistema
  {
    id: "sistema-geral",
    keywords: ["sistema", "sst", "sobre", "funcionalidades", "recursos"],
    question: "O que é o sistema SST?",
    answer:
      "O Sistema SST (Saúde e Segurança do Trabalho) é uma plataforma completa para gerenciamento de atividades relacionadas à saúde e segurança ocupacional. Ele permite o registro, acompanhamento e análise de inspeções, auditorias, ações corretivas, reuniões e outros processos relacionados à segurança do trabalho.",
    category: "geral",
  },
  {
    id: "modulos-sistema",
    keywords: ["módulos", "funcionalidades", "recursos", "ferramentas"],
    question: "Quais são os módulos do sistema?",
    answer:
      "O sistema SST possui os seguintes módulos principais: Inspeções, Rota de Inspeção, Auditorias, Ações, Reuniões, Comunique, Visita Técnica, e Cadastros (Usuários, Empresas, Setores, Cargos e Áreas). Cada módulo possui funcionalidades específicas para gerenciar diferentes aspectos da saúde e segurança do trabalho.",
    category: "geral",
    relatedTopics: ["inspecoes-geral", "auditorias-geral", "acoes-geral"],
  },

  // Inspeções
  {
    id: "inspecoes-geral",
    keywords: ["inspeção", "inspeções", "como fazer inspeção", "registrar inspeção"],
    question: "Como faço para registrar uma inspeção?",
    answer:
      "Para registrar uma nova inspeção, acesse o menu 'Registros' > 'Inspeção' > 'Lançamento'. Preencha os campos obrigatórios como data, local, tipo de inspeção e responsável. Adicione os itens inspecionados, suas condições e observações. Ao finalizar, clique em 'Salvar' para registrar a inspeção no sistema.",
    category: "inspeções",
    relatedTopics: ["inspecoes-tipos", "inspecoes-relatorio"],
  },
  {
    id: "inspecoes-tipos",
    keywords: ["tipos de inspeção", "inspeção comportamental", "inspeção de equipamentos"],
    question: "Quais são os tipos de inspeção disponíveis?",
    answer:
      "O sistema oferece diversos tipos de inspeção: Comportamental, Sistêmica, Equipamentos, Processos e Ambiental. Cada tipo possui campos específicos e é destinado a diferentes aspectos da segurança do trabalho. Você pode selecionar o tipo adequado ao criar uma nova inspeção.",
    category: "inspeções",
    relatedTopics: ["inspecoes-geral"],
  },
  {
    id: "inspecoes-relatorio",
    keywords: ["relatório de inspeção", "gerar relatório", "exportar inspeção"],
    question: "Como gerar um relatório de inspeção?",
    answer:
      "Para gerar um relatório de inspeção, acesse o menu 'Registros' > 'Inspeção' > 'Relatório'. Aplique os filtros desejados (período, tipo, local, etc.) e clique em 'Gerar Relatório'. O sistema exibirá os resultados que podem ser visualizados na tela ou exportados em formato PDF ou Excel através do botão 'Exportar'.",
    category: "inspeções",
    relatedTopics: ["inspecoes-geral"],
  },

  // Auditorias
  {
    id: "auditorias-geral",
    keywords: ["auditoria", "auditorias", "como fazer auditoria", "registrar auditoria"],
    question: "Como faço para registrar uma auditoria?",
    answer:
      "Para registrar uma auditoria, acesse o menu 'Registros' > 'Auditoria Comportamental' > 'Lançamento'. Preencha os dados da auditoria como data, local, tipo e responsável. Adicione os itens auditados e suas conformidades. Ao finalizar, clique em 'Salvar' para registrar a auditoria no sistema.",
    category: "auditorias",
    relatedTopics: ["auditorias-tipos", "auditorias-painel"],
  },
  {
    id: "auditorias-tipos",
    keywords: ["tipos de auditoria", "auditoria comportamental", "auditoria de conformidade"],
    question: "Quais são os tipos de auditoria disponíveis?",
    answer:
      "O sistema oferece os seguintes tipos de auditoria: Comportamental, Conformidade, Processos e Sistemas. Cada tipo possui critérios específicos de avaliação e é destinado a diferentes aspectos da segurança e conformidade no ambiente de trabalho.",
    category: "auditorias",
    relatedTopics: ["auditorias-geral"],
  },
  {
    id: "auditorias-painel",
    keywords: ["painel de auditoria", "dashboard auditoria", "resultados auditoria"],
    question: "Como acessar o painel de auditorias?",
    answer:
      "Para acessar o painel de auditorias, navegue até 'Registros' > 'Auditoria Comportamental' > 'Painel'. Nesta tela, você pode visualizar gráficos e indicadores de desempenho das auditorias, filtrar por período, setor ou responsável, e analisar tendências de conformidade ao longo do tempo.",
    category: "auditorias",
    relatedTopics: ["auditorias-geral"],
  },

  // Ações
  {
    id: "acoes-geral",
    keywords: ["ação", "ações", "ação corretiva", "registrar ação"],
    question: "Como registrar uma ação corretiva?",
    answer:
      "Para registrar uma ação corretiva, acesse 'Registros' > 'Gerenciador de Ações' e clique no botão 'Nova Ação'. Preencha os campos obrigatórios como título, descrição, responsável, prazo e prioridade. Você pode vincular a ação a uma inspeção ou auditoria existente. Ao finalizar, clique em 'Salvar'.",
    category: "ações",
    relatedTopics: ["acoes-acompanhamento", "acoes-tipos"],
  },
  {
    id: "acoes-acompanhamento",
    keywords: ["acompanhar ações", "status ação", "atualizar ação"],
    question: "Como acompanhar o status das ações?",
    answer:
      "Para acompanhar o status das ações, acesse 'Registros' > 'Gerenciador de Ações'. A tela exibirá todas as ações cadastradas com seus respectivos status, prazos e responsáveis. Você pode filtrar por status, prioridade, responsável ou período. Para atualizar o status de uma ação, clique no ícone de edição na linha correspondente.",
    category: "ações",
    relatedTopics: ["acoes-geral"],
  },
  {
    id: "acoes-tipos",
    keywords: ["tipos de ação", "ação preventiva", "ação corretiva", "ação de melhoria"],
    question: "Quais são os tipos de ação disponíveis?",
    answer:
      "O sistema oferece os seguintes tipos de ação: Corretiva (para corrigir não conformidades), Preventiva (para prevenir potenciais problemas), Melhoria (para aprimorar processos) e Emergencial (para situações críticas que exigem atenção imediata).",
    category: "ações",
    relatedTopics: ["acoes-geral"],
  },

  // Cadastros
  {
    id: "cadastros-usuarios",
    keywords: ["cadastrar usuário", "novo usuário", "editar usuário", "permissões"],
    question: "Como cadastrar um novo usuário?",
    answer:
      "Para cadastrar um novo usuário, acesse 'Cadastros' > 'Usuários' e clique no botão 'Novo Usuário'. Preencha os dados pessoais, defina o login, senha e selecione o perfil de acesso (que determina as permissões). Você também pode vincular o usuário a um setor e cargo específicos. Ao finalizar, clique em 'Salvar'.",
    category: "cadastros",
    relatedTopics: ["cadastros-perfis"],
  },
  {
    id: "cadastros-perfis",
    keywords: ["perfis de acesso", "permissões", "níveis de acesso"],
    question: "Quais são os perfis de acesso disponíveis?",
    answer:
      "O sistema possui os seguintes perfis de acesso: Administrador (acesso total), Gestor (gerencia todas as funcionalidades com algumas restrições), Supervisor (supervisiona atividades), Técnico (registra e acompanha atividades), Digitador (apenas registro de dados) e Visualizador (apenas consulta). Cada perfil possui permissões específicas que podem ser configuradas em 'Configurações' > 'Perfis'.",
    category: "cadastros",
    relatedTopics: ["cadastros-usuarios"],
  },
  {
    id: "cadastros-empresas",
    keywords: ["cadastrar empresa", "nova empresa", "editar empresa"],
    question: "Como cadastrar uma nova empresa?",
    answer:
      "Para cadastrar uma nova empresa, acesse 'Cadastros' > 'Empresas' e clique no botão 'Nova Empresa'. Preencha os dados como razão social, nome fantasia, CNPJ, endereço e contatos. Você também pode adicionar informações adicionais como logo e observações. Ao finalizar, clique em 'Salvar'.",
    category: "cadastros",
  },

  // Reuniões
  {
    id: "reunioes-geral",
    keywords: ["reunião", "reuniões", "agendar reunião", "registrar reunião"],
    question: "Como agendar uma reunião?",
    answer:
      "Para agendar uma reunião, acesse 'Registros' > 'Reuniões' > 'Cadastrar'. Preencha os dados como título, data, hora, local e participantes. Defina a pauta da reunião e adicione os tópicos a serem discutidos. Você pode configurar notificações para os participantes. Ao finalizar, clique em 'Salvar'.",
    category: "reuniões",
    relatedTopics: ["reunioes-realizar", "reunioes-ata"],
  },
  {
    id: "reunioes-realizar",
    keywords: ["realizar reunião", "conduzir reunião", "iniciar reunião"],
    question: "Como realizar uma reunião agendada?",
    answer:
      "Para realizar uma reunião agendada, acesse 'Registros' > 'Reuniões' > 'Realizar'. Selecione a reunião na lista de reuniões agendadas para hoje. Na tela de realização, você pode registrar a presença dos participantes, adicionar notas para cada item da pauta, registrar decisões e criar ações a partir da reunião. Ao finalizar, clique em 'Concluir Reunião'.",
    category: "reuniões",
    relatedTopics: ["reunioes-geral", "reunioes-ata"],
  },
  {
    id: "reunioes-ata",
    keywords: ["ata de reunião", "gerar ata", "exportar ata"],
    question: "Como gerar a ata de uma reunião?",
    answer:
      "Para gerar a ata de uma reunião, acesse 'Registros' > 'Reuniões' > 'Consultar'. Localize a reunião desejada e clique no ícone de 'Visualizar'. Na tela de detalhes da reunião, clique no botão 'Gerar Ata'. O sistema irá compilar todas as informações da reunião em um documento formatado que pode ser visualizado, exportado em PDF ou enviado por e-mail aos participantes.",
    category: "reuniões",
    relatedTopics: ["reunioes-geral", "reunioes-realizar"],
  },

  // Comunique
  {
    id: "comunique-geral",
    keywords: ["comunique", "comunicação", "registrar comunique", "novo comunique"],
    question: "O que é o módulo Comunique?",
    answer:
      "O módulo Comunique é uma ferramenta para registro e comunicação de situações de risco, sugestões de melhoria ou observações relacionadas à segurança. Ele permite que qualquer colaborador registre uma situação observada, que será encaminhada aos responsáveis para análise e tratamento.",
    category: "comunique",
    relatedTopics: ["comunique-registrar", "comunique-acompanhar"],
  },
  {
    id: "comunique-registrar",
    keywords: ["registrar comunique", "novo comunique", "criar comunique"],
    question: "Como registrar um novo Comunique?",
    answer:
      "Para registrar um novo Comunique, acesse 'Registros' > 'Comunique' > 'Cadastrar'. Preencha os campos como título, descrição, local, data e tipo (risco, sugestão ou observação). Você pode anexar fotos ou documentos para melhor ilustrar a situação. Ao finalizar, clique em 'Salvar'. O sistema encaminhará automaticamente para os responsáveis designados.",
    category: "comunique",
    relatedTopics: ["comunique-geral", "comunique-acompanhar"],
  },
  {
    id: "comunique-acompanhar",
    keywords: ["acompanhar comunique", "status comunique", "visualizar comunique"],
    question: "Como acompanhar o status de um Comunique?",
    answer:
      "Para acompanhar o status de um Comunique, acesse 'Registros' > 'Comunique' > 'Visualizar'. A tela exibirá todos os Comuniques registrados com seus respectivos status, datas e responsáveis. Você pode filtrar por status, tipo, período ou responsável. Clique em um Comunique específico para ver seus detalhes e o histórico de tratamento.",
    category: "comunique",
    relatedTopics: ["comunique-geral", "comunique-registrar"],
  },

  // Visita Técnica
  {
    id: "visita-tecnica-geral",
    keywords: ["visita técnica", "visitas", "registrar visita"],
    question: "Como registrar uma visita técnica?",
    answer:
      "Para registrar uma visita técnica, acesse 'Registros' > 'Visita Técnica' > 'Cadastrar'. Preencha os dados como data, local, empresa, responsável e objetivo da visita. Adicione os participantes e as observações relevantes. Você pode anexar documentos ou fotos relacionados à visita. Ao finalizar, clique em 'Salvar'.",
    category: "visita técnica",
    relatedTopics: ["visita-tecnica-relatorio"],
  },
  {
    id: "visita-tecnica-relatorio",
    keywords: ["relatório de visita técnica", "gerar relatório de visita"],
    question: "Como gerar um relatório de visita técnica?",
    answer:
      "Para gerar um relatório de visita técnica, acesse 'Registros' > 'Visita Técnica' > 'Listar'. Localize a visita desejada e clique no ícone de 'Visualizar'. Na tela de detalhes, clique no botão 'Gerar Relatório'. O sistema compilará todas as informações da visita em um documento formatado que pode ser visualizado, exportado em PDF ou compartilhado com os interessados.",
    category: "visita técnica",
    relatedTopics: ["visita-tecnica-geral"],
  },

  // Rota de Inspeção
  {
    id: "rota-inspecao-geral",
    keywords: ["rota de inspeção", "rota", "criar rota", "parametrizar rota"],
    question: "O que é o módulo Rota de Inspeção?",
    answer:
      "O módulo Rota de Inspeção permite criar roteiros predefinidos para inspeções regulares em diferentes áreas ou equipamentos. Ele ajuda a padronizar o processo de inspeção, garantindo que todos os itens importantes sejam verificados de forma sistemática e consistente.",
    category: "rota de inspeção",
    relatedTopics: ["rota-inspecao-parametrizar", "rota-inspecao-realizar"],
  },
  {
    id: "rota-inspecao-parametrizar",
    keywords: ["parametrizar rota", "configurar rota", "criar rota"],
    question: "Como parametrizar uma rota de inspeção?",
    answer:
      "Para parametrizar uma rota de inspeção, acesse 'Registros' > 'Rota de Inspeção' > 'Parametrização'. Clique em 'Nova Rota' e defina um nome e descrição. Adicione os pontos de inspeção, especificando para cada um: descrição, tipo de verificação, critérios de conformidade e ordem na sequência. Você pode organizar os pontos por área ou equipamento. Ao finalizar, clique em 'Salvar'.",
    category: "rota de inspeção",
    relatedTopics: ["rota-inspecao-geral", "rota-inspecao-realizar"],
  },
  {
    id: "rota-inspecao-realizar",
    keywords: ["realizar rota", "executar rota", "inspeção por rota"],
    question: "Como realizar uma inspeção usando uma rota?",
    answer:
      "Para realizar uma inspeção usando uma rota predefinida, acesse 'Registros' > 'Rota de Inspeção' > 'Lançamento'. Selecione a rota desejada na lista disponível. O sistema exibirá todos os pontos de inspeção na sequência configurada. Para cada ponto, registre a conformidade, observações e evidências (fotos). Você pode pausar e continuar a inspeção posteriormente. Ao finalizar todos os pontos, clique em 'Concluir Inspeção'.",
    category: "rota de inspeção",
    relatedTopics: ["rota-inspecao-geral", "rota-inspecao-parametrizar"],
  },

  // Dashboard
  {
    id: "dashboard-geral",
    keywords: ["dashboard", "indicadores", "painel", "estatísticas"],
    question: "Como usar o Dashboard?",
    answer:
      "O Dashboard apresenta indicadores visuais e estatísticas sobre as atividades de segurança do trabalho. Para acessá-lo, clique em 'Dashboard' no menu principal. Você pode alternar entre diferentes visões (geral, inspeções, ações, auditorias) usando as abas no topo. Use os filtros para refinar os dados por período, setor ou responsável. Clique nos cards ou gráficos para ver informações mais detalhadas.",
    category: "dashboard",
    relatedTopics: ["dashboard-exportar", "dashboard-filtros"],
  },
  {
    id: "dashboard-exportar",
    keywords: ["exportar dashboard", "exportar relatórios", "exportar dados"],
    question: "Como exportar dados do Dashboard?",
    answer:
      "Para exportar dados do Dashboard, navegue até a visualização desejada (geral, inspeções, ações ou auditorias). No canto superior direito, clique no botão 'Exportar'. Você pode escolher exportar os dados em formato Excel ou PDF. O arquivo exportado conterá todos os dados visíveis na tela atual, respeitando os filtros aplicados.",
    category: "dashboard",
    relatedTopics: ["dashboard-geral"],
  },
  {
    id: "dashboard-filtros",
    keywords: ["filtros dashboard", "filtrar dados", "período dashboard"],
    question: "Como aplicar filtros no Dashboard?",
    answer:
      "Para aplicar filtros no Dashboard, use os controles na parte superior da tela. Você pode selecionar o período desejado (últimos 30 dias, 60 dias, 90 dias ou ano atual) no seletor de período. Para filtros mais avançados, clique no botão 'Filtros' que abrirá um modal com opções adicionais como prioridade, setor e responsável. Selecione os filtros desejados e clique em 'Aplicar Filtros'.",
    category: "dashboard",
    relatedTopics: ["dashboard-geral", "dashboard-exportar"],
  },

  // Configurações
  {
    id: "configuracoes-geral",
    keywords: ["configurações", "configurar sistema", "preferências"],
    question: "Como acessar as configurações do sistema?",
    answer:
      "Para acessar as configurações do sistema, clique em 'Configurações' no menu principal. Esta área permite personalizar diversos aspectos do sistema, como perfis de acesso, notificações, parâmetros gerais e integrações. Note que o acesso a esta área geralmente é restrito a usuários com perfil de Administrador.",
    category: "configurações",
    relatedTopics: ["configuracoes-perfis", "configuracoes-notificacoes"],
  },
  {
    id: "configuracoes-perfis",
    keywords: ["configurar perfis", "permissões", "perfis de acesso"],
    question: "Como configurar perfis de acesso?",
    answer:
      "Para configurar perfis de acesso, navegue até 'Configurações' > 'Perfis'. Você verá a lista de perfis existentes (Administrador, Gestor, Supervisor, etc.). Clique em um perfil para editar suas permissões ou em 'Novo Perfil' para criar um personalizado. Para cada perfil, você pode definir permissões específicas por módulo (visualizar, criar, editar, excluir, aprovar). Após fazer as alterações, clique em 'Salvar'.",
    category: "configurações",
    relatedTopics: ["configuracoes-geral", "cadastros-usuarios"],
  },
  {
    id: "configuracoes-notificacoes",
    keywords: ["configurar notificações", "alertas", "e-mails"],
    question: "Como configurar notificações do sistema?",
    answer:
      "Para configurar notificações, acesse 'Configurações' > 'Notificações'. Nesta tela, você pode definir quais eventos devem gerar notificações (ex: nova inspeção, ação atrasada, reunião agendada) e como elas devem ser entregues (no sistema, por e-mail ou ambos). Você também pode configurar modelos de e-mail e programar resumos periódicos. As configurações podem ser definidas por perfil de usuário ou individualmente.",
    category: "configurações",
    relatedTopics: ["configuracoes-geral"],
  },

  // Assistente de IA
  {
    id: "assistente-geral",
    keywords: ["assistente", "ajuda", "assistente virtual", "ia"],
    question: "Como usar o Assistente Virtual?",
    answer:
      "O Assistente Virtual está disponível em todas as telas do sistema através do ícone no canto inferior direito. Clique nele para abrir o chat e digite sua pergunta ou selecione uma das sugestões. O assistente responderá com informações sobre o sistema, orientações sobre como realizar tarefas ou esclarecimentos sobre funcionalidades. Você pode minimizar, maximizar ou fechar o assistente a qualquer momento.",
    category: "assistente",
    relatedTopics: ["assistente-configurar"],
  },
  {
    id: "assistente-configurar",
    keywords: ["configurar assistente", "desativar assistente", "preferências assistente"],
    question: "Como configurar o Assistente Virtual?",
    answer:
      "Para configurar o Assistente Virtual, acesse 'Configurações' > 'Assistente'. Nesta tela, você pode ativar ou desativar o assistente, limpar o histórico de conversas e ajustar outras preferências. As configurações são salvas por usuário, então cada pessoa pode personalizar o assistente conforme sua preferência.",
    category: "assistente",
    relatedTopics: ["assistente-geral"],
  },
]

// Função para buscar respostas na base de conhecimento
export function searchKnowledge(query: string): KnowledgeItem[] {
  // Converter a consulta para minúsculas e remover acentos para melhorar a busca
  const normalizedQuery = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  // Dividir a consulta em palavras para busca por palavras-chave
  const queryWords = normalizedQuery.split(/\s+/).filter((word) => word.length > 2)

  // Pontuação para cada item da base de conhecimento
  const scoredItems = knowledgeBase.map((item) => {
    let score = 0

    // Verificar correspondência exata com a pergunta
    const normalizedQuestion = item.question
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
    if (normalizedQuestion.includes(normalizedQuery)) {
      score += 10

      // Correspondência exata com a pergunta completa
      if (normalizedQuestion === normalizedQuery) {
        score += 50
      }
    }

    // Verificar palavras-chave
    for (const word of queryWords) {
      // Verificar nas palavras-chave do item
      for (const keyword of item.keywords) {
        const normalizedKeyword = keyword
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")

        if (normalizedKeyword === word) {
          score += 5 // Correspondência exata com palavra-chave
        } else if (normalizedKeyword.includes(word) || word.includes(normalizedKeyword)) {
          score += 3 // Correspondência parcial com palavra-chave
        }
      }

      // Verificar no título da pergunta
      if (normalizedQuestion.includes(word)) {
        score += 2
      }

      // Verificar na resposta
      const normalizedAnswer = item.answer
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
      if (normalizedAnswer.includes(word)) {
        score += 1
      }
    }

    return { item, score }
  })

  // Filtrar itens com pontuação maior que zero e ordenar por pontuação
  const filteredItems = scoredItems
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)

  return filteredItems
}

// Função para obter sugestões contextuais com base na categoria atual
export function getContextualSuggestions(category?: string): string[] {
  if (!category) {
    // Sugestões gerais se nenhuma categoria for especificada
    return [
      "O que é o sistema SST?",
      "Como registrar uma inspeção?",
      "Como criar uma ação corretiva?",
      "Como agendar uma reunião?",
      "Como usar o Dashboard?",
    ]
  }

  // Filtrar itens da base de conhecimento por categoria
  const categoryItems = knowledgeBase.filter((item) => item.category === category)

  // Retornar as perguntas dos itens filtrados (até 5)
  return categoryItems.slice(0, 5).map((item) => item.question)
}

// Função para obter tópicos relacionados
export function getRelatedTopics(topicId: string): KnowledgeItem[] {
  // Encontrar o item atual
  const currentItem = knowledgeBase.find((item) => item.id === topicId)

  if (!currentItem || !currentItem.relatedTopics || currentItem.relatedTopics.length === 0) {
    return []
  }

  // Buscar os itens relacionados
  return knowledgeBase.filter((item) => currentItem.relatedTopics?.includes(item.id))
}

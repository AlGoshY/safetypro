// Serviço para gerenciar operações relacionadas às unidades
import { toast } from "@/hooks/use-toast"

// Tipos
export interface Unidade {
  id: number | string
  nome: string
  empresaId: string
  ativa: boolean
}

export interface EmpresaInfo {
  id: string
  nome: string
}

// Mapeamento de empresas para exibição
const empresasMap: Record<string, string> = {
  FARM45: "Farmatech Curitiba",
  FARM46: "Farmatech São Paulo",
  FARM47: "Farmatech Nordeste",
}

// Simulação de unidades disponíveis para o usuário
export const unidadesDisponiveis: Unidade[] = [
  { id: 1, nome: "Matriz Curitiba", empresaId: "FARM45", ativa: true },
  { id: 2, nome: "Filial Londrina", empresaId: "FARM45", ativa: true },
  { id: 3, nome: "Filial São Paulo", empresaId: "FARM46", ativa: true },
  { id: 4, nome: "Unidade Joinville", empresaId: "FARM45", ativa: true },
  { id: 5, nome: "Unidade Florianópolis", empresaId: "FARM45", ativa: true },
  { id: 6, nome: "Unidade Maringá", empresaId: "FARM45", ativa: true },
  { id: 7, nome: "Unidade Cascavel", empresaId: "FARM45", ativa: true },
  { id: 8, nome: "Unidade Foz do Iguaçu", empresaId: "FARM45", ativa: true },
  { id: 9, nome: "Filial Rio de Janeiro", empresaId: "FARM46", ativa: true },
  { id: 10, nome: "Filial Belo Horizonte", empresaId: "FARM46", ativa: true },
  { id: 11, nome: "Unidade Ponta Grossa", empresaId: "FARM45", ativa: true },
  { id: 12, nome: "Unidade Guarapuava", empresaId: "FARM45", ativa: true },
  { id: 13, nome: "Unidade Campo Largo", empresaId: "FARM45", ativa: true },
  { id: 14, nome: "Filial Salvador", empresaId: "FARM47", ativa: true },
  { id: 15, nome: "Filial Recife", empresaId: "FARM47", ativa: true },
]

// Função para obter o nome da empresa a partir do ID
export function getEmpresaNome(empresaId: string): string {
  return empresasMap[empresaId] || "Empresa"
}

// Função para obter todas as unidades disponíveis para o usuário
export async function getUnidadesDisponiveis(): Promise<Unidade[]> {
  // Simulação de uma chamada de API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(unidadesDisponiveis)
    }, 500)
  })
}

// Função para trocar a unidade ativa do usuário
export async function trocarUnidadeAtiva(unidadeId: number | string): Promise<boolean> {
  // Simulação de uma chamada de API para trocar a unidade
  return new Promise((resolve) => {
    setTimeout(() => {
      // Verificar se a unidade existe e está ativa
      const unidade = unidadesDisponiveis.find((u) => u.id === unidadeId)

      if (!unidade) {
        toast({
          title: "Erro ao trocar unidade",
          description: "Unidade não encontrada",
          variant: "destructive",
        })
        resolve(false)
        return
      }

      if (!unidade.ativa) {
        toast({
          title: "Erro ao trocar unidade",
          description: "Esta unidade está inativa",
          variant: "destructive",
        })
        resolve(false)
        return
      }

      // Atualizar o localStorage com os novos valores
      localStorage.setItem("unidadeId", unidadeId.toString())
      localStorage.setItem("unidadeNome", unidade.nome)
      localStorage.setItem("empresaIdentificador", unidade.empresaId)
      localStorage.setItem("empresaNome", getEmpresaNome(unidade.empresaId))

      // Simular sucesso
      resolve(true)
    }, 800)
  })
}

// Função para verificar se o usuário tem permissão para acessar uma unidade
export async function verificarPermissaoUnidade(unidadeId: number | string): Promise<boolean> {
  // Simulação de verificação de permissão
  return new Promise((resolve) => {
    setTimeout(() => {
      // Nesta simulação, o usuário tem acesso a todas as unidades
      resolve(true)
    }, 300)
  })
}

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type Unidade,
  getUnidadesDisponiveis,
  trocarUnidadeAtiva,
  verificarPermissaoUnidade,
  getEmpresaNome,
} from "@/services/unidade-service"
import { toast } from "@/hooks/use-toast"

interface UnidadeContextType {
  unidadeAtual: Unidade | null
  unidadesDisponiveis: Unidade[]
  empresaNome: string
  carregando: boolean
  trocarUnidade: (unidadeId: number | string) => Promise<boolean>
  atualizarUnidades: () => Promise<void>
}

const UnidadeContext = createContext<UnidadeContextType | undefined>(undefined)

export function UnidadeProvider({ children }: { children: ReactNode }) {
  const [unidadeAtual, setUnidadeAtual] = useState<Unidade | null>(null)
  const [unidadesDisponiveis, setUnidadesDisponiveis] = useState<Unidade[]>([])
  const [empresaNome, setEmpresaNome] = useState<string>("")
  const [carregando, setCarregando] = useState<boolean>(true)

  // Carregar unidades disponíveis e unidade atual ao iniciar
  useEffect(() => {
    const inicializarUnidades = async () => {
      try {
        setCarregando(true)

        // Carregar unidades disponíveis
        const unidades = await getUnidadesDisponiveis()
        setUnidadesDisponiveis(unidades)

        // Verificar se há uma unidade salva no localStorage
        const unidadeIdSalva = localStorage.getItem("unidadeId")

        if (unidadeIdSalva) {
          // Converter para número se for um ID numérico
          const id = !isNaN(Number(unidadeIdSalva)) ? Number(unidadeIdSalva) : unidadeIdSalva

          // Encontrar a unidade nos dados carregados
          const unidadeSalva = unidades.find((u) => u.id === id)

          if (unidadeSalva) {
            setUnidadeAtual(unidadeSalva)
            setEmpresaNome(getEmpresaNome(unidadeSalva.empresaId))
          } else {
            // Se a unidade salva não for encontrada, usar a primeira disponível
            if (unidades.length > 0) {
              setUnidadeAtual(unidades[0])
              setEmpresaNome(getEmpresaNome(unidades[0].empresaId))

              // Atualizar o localStorage
              localStorage.setItem("unidadeId", unidades[0].id.toString())
              localStorage.setItem("unidadeNome", unidades[0].nome)
              localStorage.setItem("empresaIdentificador", unidades[0].empresaId)
              localStorage.setItem("empresaNome", getEmpresaNome(unidades[0].empresaId))
            }
          }
        } else if (unidades.length > 0) {
          // Se não houver unidade salva, usar a primeira disponível
          setUnidadeAtual(unidades[0])
          setEmpresaNome(getEmpresaNome(unidades[0].empresaId))

          // Atualizar o localStorage
          localStorage.setItem("unidadeId", unidades[0].id.toString())
          localStorage.setItem("unidadeNome", unidades[0].nome)
          localStorage.setItem("empresaIdentificador", unidades[0].empresaId)
          localStorage.setItem("empresaNome", getEmpresaNome(unidades[0].empresaId))
        }
      } catch (error) {
        console.error("Erro ao inicializar unidades:", error)
        toast({
          title: "Erro ao carregar unidades",
          description: "Não foi possível carregar as unidades disponíveis",
          variant: "destructive",
        })
      } finally {
        setCarregando(false)
      }
    }

    inicializarUnidades()
  }, [])

  // Função para trocar a unidade ativa
  const trocarUnidade = async (unidadeId: number | string): Promise<boolean> => {
    try {
      setCarregando(true)

      // Verificar permissão
      const temPermissao = await verificarPermissaoUnidade(unidadeId)

      if (!temPermissao) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta unidade",
          variant: "destructive",
        })
        return false
      }

      // Trocar unidade
      const sucesso = await trocarUnidadeAtiva(unidadeId)

      if (sucesso) {
        // Encontrar a unidade nos dados disponíveis
        const novaUnidade = unidadesDisponiveis.find((u) => u.id === unidadeId)

        if (novaUnidade) {
          setUnidadeAtual(novaUnidade)
          setEmpresaNome(getEmpresaNome(novaUnidade.empresaId))

          toast({
            title: "Unidade alterada com sucesso",
            description: `Você está agora na unidade ${novaUnidade.nome}`,
            variant: "default",
          })

          return true
        }
      }

      return false
    } catch (error) {
      console.error("Erro ao trocar unidade:", error)
      toast({
        title: "Erro ao trocar unidade",
        description: "Ocorreu um erro ao tentar trocar de unidade",
        variant: "destructive",
      })
      return false
    } finally {
      setCarregando(false)
    }
  }

  // Função para atualizar a lista de unidades disponíveis
  const atualizarUnidades = async (): Promise<void> => {
    try {
      setCarregando(true)
      const unidades = await getUnidadesDisponiveis()
      setUnidadesDisponiveis(unidades)
    } catch (error) {
      console.error("Erro ao atualizar unidades:", error)
      toast({
        title: "Erro ao atualizar unidades",
        description: "Não foi possível atualizar a lista de unidades",
        variant: "destructive",
      })
    } finally {
      setCarregando(false)
    }
  }

  return (
    <UnidadeContext.Provider
      value={{
        unidadeAtual,
        unidadesDisponiveis,
        empresaNome,
        carregando,
        trocarUnidade,
        atualizarUnidades,
      }}
    >
      {children}
    </UnidadeContext.Provider>
  )
}

export function useUnidade() {
  const context = useContext(UnidadeContext)

  if (context === undefined) {
    throw new Error("useUnidade deve ser usado dentro de um UnidadeProvider")
  }

  return context
}

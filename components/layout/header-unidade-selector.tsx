"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { useOnClickOutside } from "@/hooks/use-click-outside"
import { toast } from "@/hooks/use-toast"

// Tipos
interface Unidade {
  id: number | string
  nome: string
  empresaId: string
  ativa: boolean
}

// Mapeamento de empresas para exibição
const empresasMap: Record<string, string> = {
  FARM45: "Farmatech Curitiba",
  FARM46: "Farmatech São Paulo",
  FARM47: "Farmatech Nordeste",
}

// Simulação de unidades disponíveis para o usuário
const unidadesDisponiveis: Unidade[] = [
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

export function UnidadeSelector() {
  const [unidadeAtual, setUnidadeAtual] = useState<Unidade | null>(null)
  const [empresaNome, setEmpresaNome] = useState<string>("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [atualizandoLista, setAtualizandoLista] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [unidade, setUnidade] = useState<string | null>(null)

  // Fechar dropdown ao clicar fora
  useOnClickOutside(dropdownRef, () => setDropdownOpen(false))

  // Carregar dados iniciais
  useEffect(() => {
    try {
      // Carregar unidade atual do localStorage
      const unidadeIdSalva = localStorage.getItem("unidadeId")
      const unidadeNomeSalvo = localStorage.getItem("unidadeNome")
      const empresaIdSalvo = localStorage.getItem("empresaIdentificador")

      if (unidadeIdSalva && unidadeNomeSalvo && empresaIdSalvo) {
        // Converter para número se for um ID numérico
        const id = !isNaN(Number(unidadeIdSalva)) ? Number(unidadeIdSalva) : unidadeIdSalva

        // Encontrar a unidade nos dados disponíveis
        const unidade = unidadesDisponiveis.find((u) => u.id === id)

        if (unidade) {
          setUnidadeAtual(unidade)
          setEmpresaNome(empresasMap[unidade.empresaId] || "Empresa")
          setUnidade(unidade.nome)
        } else {
          // Se não encontrar, usar a primeira unidade disponível
          setUnidadeAtual(unidadesDisponiveis[0])
          setEmpresaNome(empresasMap[unidadesDisponiveis[0].empresaId] || "Empresa")
          setUnidade(unidadesDisponiveis[0].nome)

          // Atualizar localStorage
          localStorage.setItem("unidadeId", String(unidadesDisponiveis[0].id))
          localStorage.setItem("unidadeNome", unidadesDisponiveis[0].nome)
          localStorage.setItem("empresaIdentificador", unidadesDisponiveis[0].empresaId)
          localStorage.setItem("empresaNome", empresasMap[unidadesDisponiveis[0].empresaId] || "Empresa")
        }
      } else {
        // Se não houver dados no localStorage, usar a primeira unidade
        setUnidadeAtual(unidadesDisponiveis[0])
        setEmpresaNome(empresasMap[unidadesDisponiveis[0].empresaId] || "Empresa")
        setUnidade(unidadesDisponiveis[0].nome)

        // Atualizar localStorage
        localStorage.setItem("unidadeId", String(unidadesDisponiveis[0].id))
        localStorage.setItem("unidadeNome", unidadesDisponiveis[0].nome)
        localStorage.setItem("empresaIdentificador", unidadesDisponiveis[0].empresaId)
        localStorage.setItem("empresaNome", empresasMap[unidadesDisponiveis[0].empresaId] || "Empresa")
      }
    } catch (error) {
      console.error("Erro ao carregar dados da unidade:", error)
    }
  }, [])

  // Agrupar unidades por empresa para exibição organizada
  const unidadesPorEmpresa = unidadesDisponiveis.reduce(
    (acc, unidade) => {
      if (!acc[unidade.empresaId]) {
        acc[unidade.empresaId] = []
      }
      acc[unidade.empresaId].push(unidade)
      return acc
    },
    {} as Record<string, typeof unidadesDisponiveis>,
  )

  // Função para atualizar a lista de unidades
  const handleAtualizarLista = (e: React.MouseEvent) => {
    e.stopPropagation() // Impedir que o clique feche o dropdown
    setAtualizandoLista(true)

    // Simulação de atualização
    setTimeout(() => {
      setAtualizandoLista(false)
      toast({
        title: "Lista atualizada",
        description: "A lista de unidades foi atualizada com sucesso",
      })
    }, 1000)
  }

  // Função para trocar de unidade
  const handleTrocarUnidade = (unidade: Unidade, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Impedir que o clique propague

    if (unidade.id === unidadeAtual?.id) {
      setDropdownOpen(false)
      return
    }

    console.log("Trocando para unidade:", unidade.nome)

    try {
      setDropdownOpen(false)
      setCarregando(true)

      // Simulação de chamada à API
      setTimeout(() => {
        try {
          // Atualizar o localStorage com os novos valores
          localStorage.setItem("unidadeId", String(unidade.id))
          localStorage.setItem("unidadeNome", unidade.nome)
          localStorage.setItem("empresaIdentificador", unidade.empresaId)
          localStorage.setItem("empresaNome", empresasMap[unidade.empresaId] || "Empresa")

          // Atualizar estado
          setUnidadeAtual(unidade)
          setEmpresaNome(empresasMap[unidade.empresaId] || "Empresa")
          setUnidade(unidade.nome)

          // Mostrar toast de sucesso
          toast({
            title: "Unidade alterada com sucesso",
            description: `Você está agora na unidade ${unidade.nome}`,
          })

          // Recarregar a página para aplicar o novo contexto
          window.location.reload()
        } catch (error) {
          console.error("Erro ao atualizar dados:", error)
          setCarregando(false)
          toast({
            title: "Erro ao trocar unidade",
            description: "Ocorreu um erro ao tentar trocar de unidade",
            variant: "destructive",
          })
        }
      }, 800)
    } catch (error) {
      console.error("Erro ao trocar unidade:", error)
      setCarregando(false)
      toast({
        title: "Erro ao trocar unidade",
        description: "Ocorreu um erro ao tentar trocar de unidade",
        variant: "destructive",
      })
    }
  }

  if (!unidadeAtual) {
    return (
      <div className="flex items-center text-sm text-gray-600 mr-4">
        <div className="px-3 py-1.5 rounded bg-gray-100 animate-pulse w-32 h-6"></div>
      </div>
    )
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleSelectUnidade = (e: React.MouseEvent, unit: string) => {
    e.preventDefault()
    setUnidade(unit)
    setIsOpen(false)
  }

  const filteredUnidades = unidadesDisponiveis
    .map((unidade) => unidade.nome)
    .filter((unit) => unit.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {unidade ? unidade : "Selecione uma unidade"}
          <ChevronDown className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
          ref={dropdownRef}
        >
          <div className="py-1" role="none">
            <input
              type="text"
              placeholder="Buscar unidade..."
              className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 focus:outline-none dark:bg-gray-800 dark:placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="max-h-60 overflow-y-auto">
              {filteredUnidades.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Nenhuma unidade encontrada</div>
              ) : (
                filteredUnidades.map((unit) => (
                  <a
                    key={unit}
                    href="#"
                    className="text-gray-700 dark:text-gray-200 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    onClick={(e) => handleSelectUnidade(e, unit)}
                  >
                    {unit}
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

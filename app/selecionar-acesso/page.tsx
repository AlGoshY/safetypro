"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Building, CreditCard, ChevronDown, AlertCircle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

// Dados de exemplo - em um ambiente real, estes viriam de uma API
const unidades = [
  { id: 1, nome: "Matriz" },
  { id: 2, nome: "Filial São Paulo" },
  { id: 3, nome: "Filial Rio de Janeiro" },
]

const perfis = [
  { id: 1, nome: "Administrador" },
  { id: 2, nome: "Gestor" },
  { id: 3, nome: "Usuário" },
]

export default function SelecionarAcessoPage() {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<number | null>(null)
  const [perfilSelecionado, setPerfilSelecionado] = useState<number | null>(null)
  const [unidadeAberta, setUnidadeAberta] = useState(false)
  const [perfilAberto, setPerfilAberto] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [empresaNome, setEmpresaNome] = useState("")

  // Verificar se o usuário está autenticado temporariamente
  useEffect(() => {
    const tempAuth = localStorage.getItem("tempAuth")
    const empresaNome = localStorage.getItem("empresaNome")

    console.log("tempAuth:", tempAuth)
    console.log("empresaNome:", empresaNome)

    if (tempAuth !== "true") {
      router.push("/login")
    }

    if (empresaNome) {
      setEmpresaNome(empresaNome)
    }
  }, [router])

  // Efeito para redirecionar após mostrar a mensagem de sucesso
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout

    if (success) {
      redirectTimer = setTimeout(() => {
        router.push("/")
      }, 1500) // Redireciona após 1.5 segundos
    }

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer)
    }
  }, [success, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Limpar mensagem de erro anterior
    setError("")
    setIsLoading(true)

    // Validar se ambos foram selecionados
    if (!unidadeSelecionada && !perfilSelecionado) {
      setError("Por favor, selecione uma unidade e um perfil")
      setIsLoading(false)
      return
    } else if (!unidadeSelecionada) {
      setError("Por favor, selecione uma unidade")
      setIsLoading(false)
      return
    } else if (!perfilSelecionado) {
      setError("Por favor, selecione um perfil")
      setIsLoading(false)
      return
    }

    // Simular um pequeno atraso para dar a sensação de processamento
    setTimeout(() => {
      // Armazenar informações de autenticação no localStorage
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("unidadeId", unidadeSelecionada.toString())
      localStorage.setItem("perfilId", perfilSelecionado.toString())
      localStorage.setItem("unidadeNome", getNomeUnidade())
      localStorage.setItem("perfilNome", getNomePerfil())

      // Remover a autenticação temporária
      localStorage.removeItem("tempAuth")

      // Mostrar mensagem de sucesso
      setSuccess(true)
      setIsLoading(false)

      // O redirecionamento será feito pelo useEffect
    }, 800)
  }

  const getNomeUnidade = () => {
    if (!unidadeSelecionada) return ""
    const unidade = unidades.find((u) => u.id === unidadeSelecionada)
    return unidade ? unidade.nome : ""
  }

  const getNomePerfil = () => {
    if (!perfilSelecionado) return ""
    const perfil = perfis.find((p) => p.id === perfilSelecionado)
    return perfil ? perfil.nome : ""
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5 z-0"></div>

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex z-10">
        {/* Lado esquerdo - Imagem e mensagem */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-blue-800 to-blue-600 text-white p-12 relative">
          <div className="absolute inset-0 bg-blue-900 opacity-20 z-0"></div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="mb-8">
              <img
                src="/sst-logo-white.png"
                alt="SST - Saúde e Segurança do Trabalho"
                className="h-24 w-auto object-contain"
              />
            </div>

            <div className="flex-grow flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6">Selecione seu acesso</h2>
              <p className="text-blue-100 mb-8">
                Escolha a unidade e o perfil com os quais deseja acessar o sistema. Suas permissões serão ajustadas de
                acordo com a seleção.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                    <Building className="h-5 w-5" />
                  </div>
                  <p>Selecione sua unidade de trabalho</p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <p>Escolha seu perfil de acesso</p>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <p className="text-sm text-blue-200">© 2025 SST - Todos os direitos reservados</p>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="flex justify-center md:hidden mb-8">
            <div className="bg-blue-600 p-4 rounded-xl">
              <img
                src="/sst-logo-white.png"
                alt="SST - Saúde e Segurança do Trabalho"
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Selecione sua unidade e perfil</h1>
            <p className="text-gray-600 mb-2">Escolha como deseja acessar o sistema</p>
            {empresaNome && (
              <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-700 font-medium">{empresaNome}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start animate-pulse">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-green-700 text-sm">Acesso configurado com sucesso! Redirecionando...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="unidade" className="block text-sm font-medium text-gray-700 mb-1">
                  Unidade
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full px-3 py-3 border-0 border-b-2 border-gray-300 bg-gray-50 rounded-t-md text-left focus:outline-none focus:ring-0 focus:border-blue-500 transition-all"
                    onClick={() => setUnidadeAberta(!unidadeAberta)}
                    disabled={isLoading || success}
                  >
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-blue-500 mr-2" />
                      <span>{getNomeUnidade() || "Selecione uma unidade"}</span>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>

                  {unidadeAberta && !isLoading && !success && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
                      {unidades.map((unidade) => (
                        <div
                          key={unidade.id}
                          className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                          onClick={() => {
                            setUnidadeSelecionada(unidade.id)
                            setUnidadeAberta(false)
                          }}
                        >
                          {unidade.nome}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="perfil" className="block text-sm font-medium text-gray-700 mb-1">
                  Perfil
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full px-3 py-3 border-0 border-b-2 border-gray-300 bg-gray-50 rounded-t-md text-left focus:outline-none focus:ring-0 focus:border-blue-500 transition-all"
                    onClick={() => setPerfilAberto(!perfilAberto)}
                    disabled={isLoading || success}
                  >
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
                      <span>{getNomePerfil() || "Selecione um perfil"}</span>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>

                  {perfilAberto && !isLoading && !success && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
                      {perfis.map((perfil) => (
                        <div
                          key={perfil.id}
                          className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                          onClick={() => {
                            setPerfilSelecionado(perfil.id)
                            setPerfilAberto(false)
                          }}
                        >
                          {perfil.nome}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white transition-all ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : success
                        ? "bg-green-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  }`}
                  disabled={isLoading || success}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processando...
                    </span>
                  ) : success ? (
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Configurado
                    </span>
                  ) : (
                    "Entrar"
                  )}
                </button>
              </div>
            </form>

            <div className="text-center text-xs text-gray-400 mt-8">v23012025</div>
          </div>
        </div>
      </div>
    </div>
  )
}

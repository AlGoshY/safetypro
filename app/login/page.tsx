"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Lock, User, AlertCircle, CheckCircle, Building } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [identificador, setIdentificador] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Carregar identificador salvo
  useEffect(() => {
    const savedIdentifier = localStorage.getItem("savedEmpresaIdentificador")
    if (savedIdentifier) {
      setIdentificador(savedIdentifier)
      setRememberMe(true)
    }
  }, [])

  // Efeito para redirecionar após mostrar a mensagem de sucesso
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout

    if (success) {
      redirectTimer = setTimeout(() => {
        router.push("/selecionar-acesso")
      }, 1500) // Redireciona após 1.5 segundos
    }

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer)
    }
  }, [success, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Limpar mensagens anteriores
    setError("")
    setSuccess(false)
    setIsLoading(true)

    // Verificar se o campo identificador foi preenchido e contém o formato correto
    if (!identificador.trim()) {
      setError("Por favor, informe o identificador da empresa.")
      setIsLoading(false)
      return
    }

    // Verificar se o identificador contém pelo menos uma letra e um número
    const hasLetter = /[a-zA-Z]/.test(identificador)
    const hasNumber = /[0-9]/.test(identificador)

    if (!hasLetter || !hasNumber) {
      setError("O identificador deve conter pelo menos uma letra e um número.")
      setIsLoading(false)
      return
    }

    // Simular um pequeno atraso para dar a sensação de processamento
    setTimeout(() => {
      // Verificar se as credenciais são admin/admin
      if (username === "admin" && password === "admin") {
        // Credenciais corretas
        // Não definir isAuthenticated ainda, será definido após selecionar unidade e perfil
        localStorage.setItem("username", username)

        // Configurar autenticação temporária
        localStorage.setItem("tempAuth", "true")

        // Salvar identificador da empresa
        localStorage.setItem("empresaIdentificador", identificador)
        localStorage.setItem("empresaNome", `Empresa ${identificador.toUpperCase()}`)

        // Salvar identificador se "Lembrar-me" estiver marcado
        if (rememberMe) {
          localStorage.setItem("savedEmpresaIdentificador", identificador)
        } else {
          localStorage.removeItem("savedEmpresaIdentificador")
        }

        // Configurar usuário padrão
        const userData = {
          id: "1",
          name: "Administrador",
          email: "admin@exemplo.com",
          role: "admin",
          permissions: {},
          unidade: "Matriz",
          setor: "Administrativo",
          cargo: "Administrador",
        }
        localStorage.setItem("user", JSON.stringify(userData))

        // Mostrar mensagem de sucesso
        setSuccess(true)
        setIsLoading(false)

        // O redirecionamento será feito pelo useEffect
      } else if (username !== "admin" && password !== "admin") {
        setError("Usuário e senha incorretos. Use admin/admin para teste.")
        setIsLoading(false)
      } else if (username !== "admin") {
        setError("Usuário incorreto. Use 'admin' para teste.")
        setIsLoading(false)
      } else {
        setError("Senha incorreta. Use 'admin' para teste.")
        setIsLoading(false)
      }
    }, 800)
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
              <h2 className="text-3xl font-bold mb-6">Bem-vindo ao Sistema SST</h2>
              <p className="text-blue-100 mb-8">
                Plataforma completa para gestão de Saúde e Segurança do Trabalho. Acesse agora e gerencie suas
                atividades com eficiência e segurança.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p>Gestão completa de SST</p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p>Relatórios e dashboards</p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p>Segurança e conformidade</p>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Seja Bem-vindo(a)</h1>
            <p className="text-gray-600 mb-8">Acesse sua conta para continuar</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start animate-pulse">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-green-700 text-sm">Login realizado com sucesso! Redirecionando...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo de identificador da empresa */}
              <div>
                <label htmlFor="identificador" className="block text-sm font-medium text-gray-700 mb-1">
                  Identificador da Empresa
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    id="identificador"
                    name="identificador"
                    type="text"
                    required
                    placeholder="Digite o identificador da empresa"
                    className="block w-full pl-10 pr-3 py-3 border-0 border-b-2 border-gray-300 bg-gray-50 rounded-t-md focus:outline-none focus:ring-0 focus:border-blue-500 transition-all"
                    value={identificador}
                    onChange={(e) => setIdentificador(e.target.value)}
                    disabled={isLoading || success}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Usuário
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    placeholder="Digite seu nome de usuário"
                    className="block w-full pl-10 pr-3 py-3 border-0 border-b-2 border-gray-300 bg-gray-50 rounded-t-md focus:outline-none focus:ring-0 focus:border-blue-500 transition-all"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading || success}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Digite sua senha"
                    className="block w-full pl-10 pr-10 py-3 border-0 border-b-2 border-gray-300 bg-gray-50 rounded-t-md focus:outline-none focus:ring-0 focus:border-blue-500 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || success}
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-form-type="password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading || success}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Lembrar identificador
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/redefinir-senha"
                    className={`font-medium text-blue-600 hover:text-blue-500 ${
                      isLoading || success ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    Esqueceu a senha?
                  </Link>
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
                      Entrando...
                    </span>
                  ) : success ? (
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Autenticado
                    </span>
                  ) : (
                    "Entrar"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                Ao acessar, você concorda com os Termos de Uso e Política de Privacidade
              </p>
            </div>

            <div className="text-center text-xs text-gray-400 mt-8">v23012025</div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Mail, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Lista de e-mails válidos para simulação
  const validEmails = ["admin@sst.com", "usuario@sst.com", "teste@sst.com"]

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/login")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    setSuccess(false)

    try {
      // Simulação de verificação de e-mail
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Verificar se o e-mail está na lista de e-mails válidos
      if (!email.trim() || !email.includes("@")) {
        setMessage({
          type: "error",
          text: "Por favor, insira um endereço de e-mail válido.",
        })
      } else if (!validEmails.includes(email.toLowerCase())) {
        setMessage({
          type: "error",
          text: "E-mail não encontrado em nossa base de dados.",
        })
      } else {
        setSuccess(true)
        setMessage({
          type: "success",
          text: "Link de redefinição enviado com sucesso para seu e-mail.",
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
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
              <h2 className="text-3xl font-bold mb-6">Recupere seu acesso</h2>
              <p className="text-blue-100 mb-8">
                Não se preocupe! Acontece com todos nós. Informe seu e-mail cadastrado e enviaremos um link para você
                redefinir sua senha com segurança.
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
                  <p>Link enviado diretamente para seu e-mail</p>
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
                  <p>Processo seguro e criptografado</p>
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
                  <p>Redefinição rápida e simples</p>
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

          <div className="max-w-md mx-auto flex flex-col justify-center h-full">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Redefinição de senha</h1>
            <p className="text-gray-600 mb-8">Informe seu e-mail para receber o link de redefinição</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Digite seu e-mail cadastrado"
                    className={`block w-full pl-10 pr-3 py-3 border-0 border-b-2 ${
                      message?.type === "error" ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"
                    } rounded-t-md focus:outline-none focus:ring-0 ${
                      message?.type === "error" ? "focus:border-red-500" : "focus:border-blue-500"
                    } transition-all`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting || success}
                    autoComplete="off"
                    data-lpignore="true"
                  />
                </div>
                {message?.type === "error" && <p className="mt-1 text-sm text-red-600">{message.text}</p>}
              </div>

              {message && message.type === "success" && (
                <div className="p-4 rounded-md bg-green-50 border border-green-100 animate-fadeIn">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">{message.text}</p>
                      <p className="mt-1 text-sm text-green-700">
                        Você será redirecionado para a página de login em alguns segundos...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white ${
                    success ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    success ? "focus:ring-green-500" : "focus:ring-blue-500"
                  } transition-colors disabled:opacity-70`}
                  disabled={isSubmitting || success}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Enviando...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Link enviado
                    </>
                  ) : (
                    "Enviar link de redefinição"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Voltar para o login
              </Link>
            </div>

            <div className="text-center text-xs text-gray-400 mt-4">v23012025</div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { AIAssistant } from "@/components/ai/ai-assistant"

export function MainLayout({ children }) {
  const { user } = useAuth()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-70"></div>
          <div className="absolute inset-0 bg-[url('/subtle-dot-pattern.png')] bg-repeat opacity-5"></div>
          <div className="relative min-h-full p-5 lg:p-8 m-3 lg:m-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-white/40">
            {children}
          </div>
        </main>
      </div>

      {/* Assistente de IA */}
      <AIAssistant />
    </div>
  )
}

// Componente para exibir quando o acesso é negado
function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-red-500 text-6xl mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Acesso Negado</h1>
      <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta página.</p>
      <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Voltar para o Dashboard
      </Link>
    </div>
  )
}

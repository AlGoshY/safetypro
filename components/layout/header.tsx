"use client"

import { Bell, HelpCircle, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { UnidadeSelector } from "./header-unidade-selector"

// Função para obter o título da página com base no caminho
const getPageTitle = (pathname: string) => {
  if (pathname === "/") return "Dashboard"
  if (pathname === "/dashboard/reunioes") return "Dashboard de Reuniões"

  // Remove a barra inicial e divide o caminho
  const segments = pathname.substring(1).split("/")

  // Capitaliza o primeiro segmento para o título principal
  if (segments.length > 0) {
    const mainSegment = segments[0]
    return mainSegment.charAt(0).toUpperCase() + mainSegment.slice(1)
  }

  return "Dashboard"
}

export function Header() {
  const [perfilNome, setPerfilNome] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  useEffect(() => {
    try {
      // Carregar dados do localStorage apenas no lado do cliente
      const storedPerfilNome = localStorage.getItem("perfilNome") || "Administrador"
      const storedUsername = localStorage.getItem("username") || "João Silva"

      // Atualizar o estado com os valores do localStorage
      setPerfilNome(storedPerfilNome)
      setUsername(storedUsername)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }, [])

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-[#0f2167] dark:text-gray-100">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center text-sm text-gray-600 dark:text-gray-300 mr-4">
          <UnidadeSelector />
        </div>
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
            <Bell size={20} className="text-gray-700 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
        <div className="relative">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            title="Atendimento de Suporte"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 inline-flex items-center justify-center"
          >
            <HelpCircle size={20} className="text-gray-700 dark:text-gray-300" />
          </a>
        </div>
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#0f2167] dark:bg-blue-800 flex items-center justify-center text-white">
            <User size={18} />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium dark:text-gray-200">{username || "Usuário"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{perfilNome || "Administrador"}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

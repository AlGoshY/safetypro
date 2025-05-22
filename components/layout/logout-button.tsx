"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface LogoutButtonProps {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Aqui você pode adicionar lógica para limpar tokens, cookies ou estado de autenticação
    // Por exemplo:
    // localStorage.removeItem("authToken")
    // sessionStorage.clear()

    // Redireciona para a página de login
    router.push("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors ${className}`}
    >
      <LogOut size={18} />
      <span>Sair</span>
    </button>
  )
}

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Definição dos tipos de perfil
export type UserRole = "admin" | "gestor" | "supervisor" | "tecnico" | "digitador" | "visualizador"

// Definição das permissões por módulo
export interface Permissions {
  dashboard: {
    view: boolean
    export: boolean
  }
  cadastros: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
  }
  inspecao: {
    view: boolean
    create: boolean
    edit: boolean
    approve: boolean
    export: boolean
  }
  reunioes: {
    view: boolean
    create: boolean
    edit: boolean
    approve: boolean
  }
  acoes: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
    approve: boolean
  }
  auditoria: {
    view: boolean
    create: boolean
    edit: boolean
    approve: boolean
    export: boolean
  }
  visitaTecnica: {
    view: boolean
    create: boolean
    edit: boolean
    approve: boolean
  }
  comunique: {
    view: boolean
    create: boolean
    edit: boolean
    share: boolean
  }
  configuracoes: {
    view: boolean
    edit: boolean
  }
  pesquisaSatisfacao: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
    share: boolean
    export: boolean
  }
  rotaInspecao: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
    approve: boolean
    configure: boolean
  }
}

// Definição do usuário
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  permissions: Permissions
  unidade: string
  setor: string
  cargo: string
}

// Contexto de autenticação
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  hasPermission: (module: keyof Permissions, action: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Definição das permissões por perfil
const rolePermissions: Record<UserRole, Permissions> = {
  admin: {
    dashboard: { view: true, export: true },
    cadastros: { view: true, create: true, edit: true, delete: true },
    inspecao: { view: true, create: true, edit: true, approve: true, export: true },
    reunioes: { view: true, create: true, edit: true, approve: true },
    acoes: { view: true, create: true, edit: true, delete: true, approve: true },
    auditoria: { view: true, create: true, edit: true, approve: true, export: true },
    visitaTecnica: { view: true, create: true, edit: true, approve: true },
    comunique: { view: true, create: true, edit: true, share: true },
    configuracoes: { view: true, edit: true },
    pesquisaSatisfacao: { view: true, create: true, edit: true, delete: true, share: true, export: true },
    rotaInspecao: { view: true, create: true, edit: true, delete: true, approve: true, configure: true },
  },
  gestor: {
    dashboard: { view: true, export: true },
    cadastros: { view: true, create: true, edit: true, delete: false },
    inspecao: { view: true, create: true, edit: true, approve: true, export: true },
    reunioes: { view: true, create: true, edit: true, approve: true },
    acoes: { view: true, create: true, edit: true, delete: false, approve: true },
    auditoria: { view: true, create: true, edit: true, approve: true, export: true },
    visitaTecnica: { view: true, create: true, edit: true, approve: true },
    comunique: { view: true, create: true, edit: true, share: true },
    configuracoes: { view: true, edit: false },
    pesquisaSatisfacao: { view: true, create: true, edit: true, delete: false, share: true, export: true },
    rotaInspecao: { view: true, create: true, edit: true, delete: false, approve: true, configure: false },
  },
  supervisor: {
    dashboard: { view: true, export: true },
    cadastros: { view: true, create: false, edit: false, delete: false },
    inspecao: { view: true, create: true, edit: true, approve: false, export: true },
    reunioes: { view: true, create: true, edit: true, approve: false },
    acoes: { view: true, create: true, edit: true, delete: false, approve: false },
    auditoria: { view: true, create: true, edit: true, approve: false, export: true },
    visitaTecnica: { view: true, create: true, edit: true, approve: false },
    comunique: { view: true, create: true, edit: true, share: true },
    configuracoes: { view: false, edit: false },
    pesquisaSatisfacao: { view: true, create: true, edit: true, delete: false, share: true, export: false },
    rotaInspecao: { view: true, create: true, edit: true, delete: false, approve: false, configure: false },
  },
  tecnico: {
    dashboard: { view: true, export: false },
    cadastros: { view: true, create: false, edit: false, delete: false },
    inspecao: { view: true, create: true, edit: true, approve: false, export: false },
    reunioes: { view: true, create: true, edit: true, approve: false },
    acoes: { view: true, create: true, edit: true, delete: false, approve: false },
    auditoria: { view: true, create: true, edit: false, approve: false, export: false },
    visitaTecnica: { view: true, create: true, edit: true, approve: false },
    comunique: { view: true, create: true, edit: true, share: false },
    configuracoes: { view: false, edit: false },
    pesquisaSatisfacao: { view: true, create: false, edit: false, delete: false, share: false, export: false },
    rotaInspecao: { view: true, create: true, edit: false, delete: false, approve: false, configure: false },
  },
  digitador: {
    dashboard: { view: true, export: false },
    cadastros: { view: true, create: false, edit: false, delete: false },
    inspecao: { view: true, create: true, edit: false, approve: false, export: false },
    reunioes: { view: true, create: false, edit: false, approve: false },
    acoes: { view: true, create: false, edit: false, delete: false, approve: false },
    auditoria: { view: true, create: true, edit: false, approve: false, export: false },
    visitaTecnica: { view: true, create: false, edit: false, approve: false },
    comunique: { view: true, create: true, edit: false, share: false },
    configuracoes: { view: false, edit: false },
    pesquisaSatisfacao: { view: true, create: false, edit: false, delete: false, share: false, export: false },
    rotaInspecao: { view: true, create: false, edit: false, delete: false, approve: false, configure: false },
  },
  visualizador: {
    dashboard: { view: true, export: false },
    cadastros: { view: true, create: false, edit: false, delete: false },
    inspecao: { view: true, create: false, edit: false, approve: false, export: false },
    reunioes: { view: true, create: false, edit: false, approve: false },
    acoes: { view: true, create: false, edit: false, delete: false, approve: false },
    auditoria: { view: true, create: true, edit: false, approve: false, export: false },
    visitaTecnica: { view: true, create: false, edit: false, approve: false },
    comunique: { view: true, create: true, edit: false, share: false },
    configuracoes: { view: false, edit: false },
    pesquisaSatisfacao: { view: true, create: false, edit: false, delete: false, share: false, export: false },
    rotaInspecao: { view: true, create: false, edit: false, delete: false, approve: false, configure: false },
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulação de uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Usuário de exemplo para demonstração
      // Em um ambiente real, isso viria da API
      if (email === "admin@exemplo.com" && password === "senha123") {
        const userData: User = {
          id: "1",
          name: "Administrador",
          email: "admin@exemplo.com",
          role: "admin",
          permissions: rolePermissions.admin,
          unidade: "NOVA VENEZA - ABATE AVES",
          setor: "Administrativo",
          cargo: "Administrador",
        }
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return true
      } else if (email === "gestor@exemplo.com" && password === "senha123") {
        const userData: User = {
          id: "2",
          name: "Gestor",
          email: "gestor@exemplo.com",
          role: "gestor",
          permissions: rolePermissions.gestor,
          unidade: "NOVA VENEZA - ABATE AVES",
          setor: "Produção",
          cargo: "Gerente",
        }
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return true
      } else if (email === "tecnico@exemplo.com" && password === "senha123") {
        const userData: User = {
          id: "3",
          name: "Técnico",
          email: "tecnico@exemplo.com",
          role: "tecnico",
          permissions: rolePermissions.tecnico,
          unidade: "NOVA VENEZA - ABATE AVES",
          setor: "Qualidade",
          cargo: "Técnico",
        }
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return true
      }

      return false
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      return false
    }
  }

  // Função de logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  // Verificar se o usuário tem permissão para uma ação específica
  const hasPermission = (module: keyof Permissions, action: string): boolean => {
    if (!user) return false

    // Administrador sempre tem todas as permissões
    if (user.role === "admin") return true

    const modulePermissions = user.permissions[module]
    if (!modulePermissions) return false

    return modulePermissions[action as keyof typeof modulePermissions] === true
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

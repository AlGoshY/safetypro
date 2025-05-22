"use client"

import { useState, useEffect } from "react"
import {
  Settings,
  Users,
  Briefcase,
  Building2,
  LayoutGrid,
  LogOut,
  ClipboardList,
  ShieldCheck,
  CalendarCheck,
  Megaphone,
  FileText,
  MenuIcon,
  Eye,
  Home,
  Calendar,
  ChevronRight,
  ChevronDown,
  X,
  Search,
  PlusCircle,
  Share2,
  Bot,
  BarChart4,
  BarChart,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

// Substitua as cores fixas por classes que dependem do tema
const sidebarBg = "bg-[#0f2167] dark:bg-gray-900"
const sidebarBorderColor = "border-[#2c4187]/30 dark:border-gray-800/50"
const sidebarText = "text-white dark:text-gray-100"
const sidebarMenuItemBg = "hover:bg-[#1e3a8a]/50 dark:hover:bg-gray-800/70"
const sidebarMenuItemActive = "bg-[#1e3a8a]/50 dark:bg-gray-800/70"
const sidebarSubmenuText = "text-[#a3b3d6] dark:text-gray-400"
const sidebarButtonBg = "bg-[#1e3a8a]/40 hover:bg-[#1e3a8a]/60 dark:bg-gray-800 dark:hover:bg-gray-700"
const sidebarLogoutButton = "hover:bg-red-600/20 hover:text-white dark:hover:bg-red-900/30"

const menus = [
  { title: "Dashboard", icon: Home, path: "/" },
  {
    title: "Cadastros",
    icon: LayoutGrid,
    submenu: [
      { label: "Áreas", icon: LayoutGrid, path: "/cadastros/areas" },
      { label: "Cargos", icon: Briefcase, path: "/cadastros/cargos" },
      { label: "Empresas", icon: Building2, path: "/cadastros/empresas" },
      { label: "Setores", icon: LayoutGrid, path: "/cadastros/setores" },
      { label: "Usuários", icon: Users, path: "/cadastros/usuarios" },
    ],
  },
  {
    title: "Gerenciador",
    icon: ClipboardList,
    submenu: [{ label: "Gerenciador de Ações", icon: ClipboardList, path: "/registros/gerenciador-acoes" }],
  },
  {
    title: "Inspeção",
    icon: ShieldCheck,
    submenu: [
      { label: "Cadastrar Item", icon: ShieldCheck, path: "/registros/inspecao/cadastrar-item" },
      { label: "Lançamento", icon: ShieldCheck, path: "/registros/inspecao/lancamento" },
      { label: "Relatório", icon: FileText, path: "/registros/inspecao/relatorio" },
      { label: "Relatório Acompanhamento", icon: FileText, path: "/registros/inspecao/acompanhamento" },
    ],
  },
  {
    title: "Rota de Inspeção",
    icon: Calendar,
    submenu: [
      { label: "Cadastro de Atividades", icon: ClipboardList, path: "/registros/rota-inspecao/atividades" },
      { label: "Parametrização TST/Unidade", icon: Settings, path: "/registros/rota-inspecao/parametrizacao" },
      { label: "Lançamento", icon: ClipboardList, path: "/registros/rota-inspecao/lancamento" },
      { label: "Relatório", icon: FileText, path: "/registros/rota-inspecao/relatorio" },
      { label: "Relatório Acompanhamento", icon: FileText, path: "/registros/rota-inspecao/acompanhamento" },
    ],
  },
  {
    title: "Visita Técnica",
    icon: Eye,
    submenu: [
      { label: "Cadastrar Visita", icon: CalendarCheck, path: "/registros/visita-tecnica/cadastrar" },
      { label: "Listar", icon: CalendarCheck, path: "/registros/visita-tecnica/listar" },
    ],
  },
  {
    title: "Reunião",
    icon: Users,
    submenu: [
      { label: "Cadastrar Reunião", icon: PlusCircle, path: "/registros/reunioes/cadastrar" },
      { label: "Realizar Reunião", icon: CalendarCheck, path: "/registros/reunioes/realizar" },
      { label: "Consultar Reunião", icon: CalendarCheck, path: "/registros/reunioes/consultar" },
      { label: "Indicadores", icon: FileText, path: "/registros/reunioes/indicadores" },
      { label: "Tipos de Reunião", icon: Calendar, path: "/cadastros/tipos-reuniao" },
      { label: "Dashboard de Reuniões", icon: BarChart, path: "/dashboard/reunioes" },
    ],
  },
  {
    title: "Auditoria",
    icon: FileText,
    submenu: [
      {
        label: "Lançamento Cartão Avaliação",
        icon: ShieldCheck,
        path: "/registros/auditoria-comportamental/lancamento",
      },
      { label: "Painel Auditoria Comp. x Gestor", icon: FileText, path: "/registros/auditoria-comportamental/painel" },
    ],
  },
  {
    title: "Comunique",
    icon: Megaphone,
    submenu: [
      { label: "Cadastrar Comunique", icon: PlusCircle, path: "/registros/comunique/cadastrar" },
      { label: "Visualizar Comunique", icon: Eye, path: "/registros/comunique/visualizar" },
      { label: "Compartilhamento", icon: Share2, path: "/registros/comunique/compartilhar" },
    ],
  },
  {
    title: "Pesquisa de Satisfação",
    icon: BarChart4,
    submenu: [
      { label: "Dashboard", icon: BarChart4, path: "/pesquisa-satisfacao/dashboard" },
      { label: "Criar Pesquisa", icon: PlusCircle, path: "/pesquisa-satisfacao/criar" },
      { label: "Gerenciar Pesquisas", icon: ClipboardList, path: "/pesquisa-satisfacao/gerenciar" },
    ],
  },
  {
    title: "Configurações",
    icon: Settings,
    submenu: [
      { label: "Configurações Gerais", icon: Settings, path: "/configuracoes" },
      { label: "Assistente Virtual", icon: Bot, path: "/configuracoes/assistente" },
    ],
  },
]

export function Sidebar() {
  const [expandedMenu, setExpandedMenu] = useState(null)
  const [hoveredMenu, setHoveredMenu] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isHoveringMenu, setIsHoveringMenu] = useState(false)
  const [pathname, setPathnameInternal] = useState("")
  const pathnameFromRouter = usePathname()
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    setPathnameInternal(pathnameFromRouter)
  }, [pathnameFromRouter])

  // Adicione esta função para filtrar os menus com base no termo de busca
  const filteredMenus = menus.filter((menu) => {
    // Verifica se o título do menu contém o termo de busca
    const titleMatch = menu.title.toLowerCase().includes(searchTerm.toLowerCase())

    // Se o menu tiver submenu, verifica se algum item do submenu contém o termo de busca
    const submenuMatch = menu.submenu
      ? menu.submenu.some((subItem) => subItem.label.toLowerCase().includes(searchTerm.toLowerCase()))
      : false

    // Retorna true se o título ou algum item do submenu corresponder ao termo de busca
    return titleMatch || submenuMatch
  })

  // Função para determinar se um menu deve ser mostrado (por clique ou hover)
  const isMenuExpanded = (idx) => {
    return expandedMenu === idx || hoveredMenu === idx
  }

  // Verifica se o caminho atual corresponde a algum submenu
  const findActiveMenuIndex = () => {
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].submenu) {
        for (const subItem of menus[i].submenu) {
          if (pathname.startsWith(subItem.path)) {
            return i
          }
        }
      } else if (pathname.startsWith(menus[i].path)) {
        return i
      }
    }
    return null
  }

  // Expande automaticamente o menu ativo
  useEffect(() => {
    const activeIndex = findActiveMenuIndex()
    if (activeIndex !== null) {
      setExpandedMenu(activeIndex)
    }
  }, [pathname])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      } else if (window.innerWidth < 768) {
        setSidebarOpen(false)
        setHoveredMenu(null)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = () => {
    // Limpar a sessão (exemplo: remover token do localStorage)
    localStorage.removeItem("token")

    // Redirecionar para a página de login
    router.push("/login")
  }

  return (
    <>
      {/* Overlay para fechar o menu mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ease-in-out fixed lg:relative z-50 flex flex-col h-screen
          ${sidebarOpen || isHoveringMenu ? "w-64" : "w-20"} 
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${sidebarBg} ${sidebarText}`}
        onMouseEnter={() => !sidebarOpen && setIsHoveringMenu(true)}
        onMouseLeave={() => setIsHoveringMenu(false)}
      >
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 lg:hidden text-white p-1 rounded-md"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className={`flex items-center justify-center h-16 px-4 border-b ${sidebarBorderColor}`}>
          {sidebarOpen || isHoveringMenu ? (
            <div className="flex items-center">
              <img src="/sst-logo-white.png" alt="SST Logo" className="h-12 w-12" />
              <span className="ml-2 text-xl font-semibold text-white">SST</span>
            </div>
          ) : (
            <img src="/sst-logo-white.png" alt="SST Logo" className="h-10 w-10" />
          )}
        </div>

        {/* Search */}
        {(sidebarOpen || isHoveringMenu) && (
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b9cb9] h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1e3a8a]/30 text-white placeholder-[#8b9cb9] rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#8b9cb9] hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {filteredMenus.map((item, idx) => (
              <div key={idx} className="mb-1">
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => setExpandedMenu(expandedMenu === idx ? null : idx)}
                      onMouseEnter={() => setHoveredMenu(idx)}
                      onMouseLeave={() => setHoveredMenu(null)}
                      className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-md text-[#e2e8f0] hover:bg-[#1e3a8a]/50 transition-all duration-200 ${
                        isMenuExpanded(idx) || findActiveMenuIndex() === idx ? "bg-[#1e3a8a]/50" : ""
                      } ${sidebarMenuItemBg} ${isMenuExpanded(idx) || findActiveMenuIndex() === idx ? sidebarMenuItemActive : ""}`}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon size={18} />
                        {(sidebarOpen || isHoveringMenu) && <span className="text-sm font-medium">{item.title}</span>}
                      </span>
                      {(sidebarOpen || isHoveringMenu) && (
                        <span>{isMenuExpanded(idx) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
                      )}
                    </button>
                    {isMenuExpanded(idx) && (sidebarOpen || isHoveringMenu) && (
                      <div
                        className="mt-1 ml-7 pl-3 border-l border-[#2c4187]/50 space-y-1"
                        onMouseEnter={() => setHoveredMenu(idx)}
                        onMouseLeave={() => setHoveredMenu(null)}
                      >
                        {/* Se houver um termo de busca, filtre os subitens também */}
                        {item.submenu
                          .filter((subItem) =>
                            searchTerm ? subItem.label.toLowerCase().includes(searchTerm.toLowerCase()) : true,
                          )
                          .map((subItem, i) => (
                            <Link
                              key={i}
                              href={subItem.path}
                              className={`flex items-center gap-3 w-full text-sm ${
                                pathname.startsWith(subItem.path) ? "text-white" : "text-[#a3b3d6]"
                              } hover:text-white py-2 px-3 rounded-md hover:bg-[#1e3a8a]/30 transition-all duration-200 ${pathname.startsWith(subItem.path) ? "text-white" : sidebarSubmenuText} hover:text-white py-2 px-3 rounded-md ${sidebarMenuItemBg}`}
                              onClick={(e) => {
                                e.preventDefault() // Previne o comportamento padrão do link
                                if (window.innerWidth < 768) {
                                  setMobileMenuOpen(false)
                                }
                                // Forçar a navegação usando o router
                                router.push(subItem.path)
                              }}
                            >
                              <subItem.icon size={15} />
                              <span className="truncate">{subItem.label}</span>
                            </Link>
                          ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.path}
                    className={`flex items-center w-full text-left px-3 py-2.5 rounded-md text-[#e2e8f0] hover:bg-[#1e3a8a]/50 transition-all duration-200 ${
                      pathname.startsWith(item.path) ? "bg-[#1e3a8a]/50" : ""
                    } ${sidebarMenuItemBg} ${pathname.startsWith(item.path) ? sidebarMenuItemActive : ""}`}
                    onClick={(e) => {
                      e.preventDefault() // Previne o comportamento padrão do link
                      if (window.innerWidth < 768) {
                        setMobileMenuOpen(false)
                      }
                      // Forçar a navegação usando o router
                      router.push(item.path)
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon size={18} />
                      {(sidebarOpen || isHoveringMenu) && <span className="text-sm font-medium">{item.title}</span>}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className={`border-t ${sidebarBorderColor} px-4 py-3`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`hidden lg:flex items-center justify-center gap-2 w-full py-2 px-3 rounded-md ${sidebarButtonBg} transition-all duration-200 text-sm`}
          >
            <MenuIcon size={16} />
            {(sidebarOpen || isHoveringMenu) && <span>Recolher menu</span>}
          </button>
          <button
            className={`flex items-center justify-center gap-2 w-full py-2 px-3 mt-2 rounded-md text-white/80 ${sidebarLogoutButton} transition-all duration-200 text-sm`}
            onClick={handleLogout}
          >
            <LogOut size={16} />
            {(sidebarOpen || isHoveringMenu) && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Mobile menu button - will be shown in the header */}
      <button
        className="lg:hidden fixed bottom-4 right-4 z-30 bg-[#0f2167] text-white p-3 rounded-full shadow-lg"
        onClick={() => setMobileMenuOpen(true)}
      >
        <MenuIcon size={24} />
      </button>
    </>
  )
}

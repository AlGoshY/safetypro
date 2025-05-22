"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import {
  Settings,
  Users,
  Briefcase,
  Building2,
  LayoutGrid,
  HeartPulse,
  LogOut,
  ClipboardList,
  ShieldCheck,
  CalendarCheck,
  Megaphone,
  FileText,
  MenuIcon,
  AlertTriangle,
  FileCheck,
  Eye,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  X,
  Bell,
  Search,
  User,
  HelpCircle,
  Home,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Filter,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts"

const menus = [
  { title: "Dashboard", icon: Home, path: "/dashboard" },
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
      { label: "Cadastrar Item", icon: ShieldCheck, path: "/registros/inspecao-sistemica" },
      { label: "Lançamento", icon: ShieldCheck, path: "/registros/inspecao-sistemica" },
      { label: "Relatório", icon: FileText, path: "/registros/inspecao-sistemica" },
      { label: "Relatório Acompanhamento", icon: FileText, path: "/registros/inspecao-sistemica" },
    ],
  },
  {
    title: "Rota de Inspeção",
    icon: Calendar,
    submenu: [
      { label: "Cadastro de Atividades", icon: ClipboardList, path: "/registros/rota-inspecao" },
      { label: "Parametrização TST/Unidade", icon: Settings, path: "/registros/rota-inspecao" },
      { label: "Lançamento", icon: ClipboardList, path: "/registros/rota-inspecao" },
      { label: "Relatório", icon: FileText, path: "/registros/rota-inspecao" },
      { label: "Relatório Acompanhamento", icon: FileText, path: "/registros/rota-inspecao" },
    ],
  },
  {
    title: "Visita Técnica",
    icon: Eye,
    submenu: [
      { label: "Cadastrar Visita", icon: CalendarCheck, path: "/registros/visita-tecnica" },
      { label: "Listar", icon: CalendarCheck, path: "/registros/visita-tecnica" },
    ],
  },
  {
    title: "Reunião",
    icon: Users,
    submenu: [
      { label: "Realizar Reunião", icon: CalendarCheck, path: "/registros/reuniao" },
      { label: "Consultar Reunião", icon: CalendarCheck, path: "/registros/reuniao" },
    ],
  },
  {
    title: "Auditoria",
    icon: FileCheck,
    submenu: [
      { label: "Lançamento Cartão Avaliação", icon: ShieldCheck, path: "/registros/auditoria-comportamental" },
      { label: "Painel Auditoria Comp. x Gestor", icon: FileText, path: "/registros/auditoria-comportamental" },
    ],
  },
  {
    title: "Comunique",
    icon: Megaphone,
    submenu: [
      { label: "Cadastrar Comunique", icon: Megaphone, path: "/registros/comunique" },
      { label: "Visualizar Comunique", icon: Megaphone, path: "/registros/comunique" },
      { label: "Compartilhamento", icon: Megaphone, path: "/registros/comunique" },
    ],
  },
  { title: "Configurações", icon: Settings, path: "/configuracoes" },
]

const chartData = [
  { name: "Jan", meta: 100, realizado: 65, atrasado: 35 },
  { name: "Fev", meta: 100, realizado: 70, atrasado: 30 },
  { name: "Mar", meta: 100, realizado: 68, atrasado: 32 },
  { name: "Abr", meta: 100, realizado: 76, atrasado: 24 },
  { name: "Mai", meta: 100, realizado: 82, atrasado: 18 },
  { name: "Jun", meta: 100, realizado: 85, atrasado: 15 },
]

const trendData = [
  { name: "Jan", inspecoes: 42, acoes: 28 },
  { name: "Fev", inspecoes: 38, acoes: 32 },
  { name: "Mar", inspecoes: 45, acoes: 35 },
  { name: "Abr", inspecoes: 52, acoes: 40 },
  { name: "Mai", inspecoes: 48, acoes: 38 },
  { name: "Jun", inspecoes: 55, acoes: 42 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
        <p className="font-medium text-sm mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

const HomePage = () => {
  const [expandedMenu, setExpandedMenu] = useState(null)
  const [hoveredMenu, setHoveredMenu] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("geral")
  const router = useRouter()
  const [isHoveringMenu, setIsHoveringMenu] = useState(false)

  const handleNavigate = (route) => {
    router.push(route)
    if (window.innerWidth < 768) {
      setMobileMenuOpen(false)
    }
  }

  // Função para determinar se um menu deve ser mostrado (por clique ou hover)
  const isMenuExpanded = (idx) => {
    return expandedMenu === idx || hoveredMenu === idx
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      } else if (window.innerWidth < 768) {
        setSidebarOpen(false)
        // Limpar hover em dispositivos móveis
        setHoveredMenu(null)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex h-screen bg-[#f8fafc] text-[#1e293b] font-sans">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ease-in-out fixed lg:relative z-50 flex flex-col h-screen
          ${sidebarOpen || isHoveringMenu ? "w-64" : "w-20"} 
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-[#0f2167] text-white`}
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
        <div className="flex items-center justify-center h-16 px-4 border-b border-[#2c4187]/30">
          {sidebarOpen ? (
            <div className="flex items-center">
              <img src="/abstract-logo.png" alt="Logo" className="h-10 w-10" />
              <span className="ml-2 text-xl font-semibold text-white">SafetyPro</span>
            </div>
          ) : (
            <img src="/abstract-logo.png" alt="Logo" className="h-8 w-8" />
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
                className="w-full bg-[#1e3a8a]/30 text-white placeholder-[#8b9cb9] rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {menus.map((item, idx) => (
              <div key={idx} className="mb-1">
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => setExpandedMenu(expandedMenu === idx ? null : idx)}
                      onMouseEnter={() => setHoveredMenu(idx)}
                      onMouseLeave={() => setHoveredMenu(null)}
                      className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-md text-[#e2e8f0] hover:bg-[#1e3a8a]/50 transition-all duration-200 ${
                        isMenuExpanded(idx) ? "bg-[#1e3a8a]/50" : ""
                      }`}
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
                        {item.submenu.map((subItem, i) => (
                          <button
                            key={i}
                            onClick={() => handleNavigate(subItem.path)}
                            className="flex items-center gap-3 w-full text-sm text-[#a3b3d6] hover:text-white py-2 px-3 rounded-md hover:bg-[#1e3a8a]/30 transition-all duration-200"
                          >
                            <subItem.icon size={15} />
                            <span className="truncate">{subItem.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={`flex items-center w-full text-left px-3 py-2.5 rounded-md text-[#e2e8f0] hover:bg-[#1e3a8a]/50 transition-all duration-200 ${
                      idx === 0 ? "bg-[#1e3a8a]/50" : ""
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon size={18} />
                      {(sidebarOpen || isHoveringMenu) && <span className="text-sm font-medium">{item.title}</span>}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-[#2c4187]/30 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center justify-center gap-2 w-full py-2 px-3 rounded-md bg-[#1e3a8a]/40 hover:bg-[#1e3a8a]/60 transition-all duration-200 text-sm"
          >
            <MenuIcon size={16} />
            {sidebarOpen && <span>Recolher menu</span>}
          </button>
          <button className="flex items-center justify-center gap-2 w-full py-2 px-3 mt-2 rounded-md text-white/80 hover:bg-red-600/20 hover:text-white transition-all duration-200 text-sm">
            <LogOut size={16} />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center">
            <button className="lg:hidden mr-2 p-2 rounded-md hover:bg-gray-100" onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon size={20} />
            </button>
            <h1 className="text-xl font-semibold text-[#0f2167]">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <HelpCircle size={20} />
              </button>
            </div>
            <div className="h-8 w-px bg-gray-200 mx-1"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0f2167] flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">João Silva</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
                <p className="text-gray-500 mt-1">Acompanhe os principais indicadores de segurança</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-200 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>Últimos 30 dias</option>
                    <option>Últimos 60 dias</option>
                    <option>Últimos 90 dias</option>
                    <option>Este ano</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                <button className="flex items-center gap-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm hover:bg-gray-50">
                  <Filter size={16} />
                  <span>Filtros</span>
                </button>
                <button className="bg-[#0f2167] text-white rounded-md px-4 py-2 text-sm hover:bg-[#1e3a8a] transition-colors">
                  Exportar
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <div className="flex space-x-6">
                <button
                  onClick={() => setActiveTab("geral")}
                  className={`py-3 px-1 text-sm font-medium border-b-2 ${
                    activeTab === "geral"
                      ? "border-[#0f2167] text-[#0f2167]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Visão Geral
                </button>
                <button
                  onClick={() => setActiveTab("inspecoes")}
                  className={`py-3 px-1 text-sm font-medium border-b-2 ${
                    activeTab === "inspecoes"
                      ? "border-[#0f2167] text-[#0f2167]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Inspeções
                </button>
                <button
                  onClick={() => setActiveTab("acoes")}
                  className={`py-3 px-1 text-sm font-medium border-b-2 ${
                    activeTab === "acoes"
                      ? "border-[#0f2167] text-[#0f2167]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Ações
                </button>
                <button
                  onClick={() => setActiveTab("auditorias")}
                  className={`py-3 px-1 text-sm font-medium border-b-2 ${
                    activeTab === "auditorias"
                      ? "border-[#0f2167] text-[#0f2167]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Auditorias
                </button>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Inspeções em Aberto</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-800">12</h3>
                    <div className="flex items-center mt-1 text-xs font-medium text-green-600">
                      <ArrowUpRight size={14} className="mr-1" />
                      <span>8% desde o mês passado</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <HeartPulse size={22} className="text-blue-600" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Meta: 15</span>
                    <span className="text-green-600 font-medium">80% concluído</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ações Críticas</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-800">5</h3>
                    <div className="flex items-center mt-1 text-xs font-medium text-red-600">
                      <ArrowDownRight size={14} className="mr-1" />
                      <span>2 desde a semana passada</span>
                    </div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <AlertTriangle size={22} className="text-red-600" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Prazo médio</span>
                    <span className="text-red-600 font-medium">3 dias restantes</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                    <div className="bg-red-600 h-1.5 rounded-full" style={{ width: "30%" }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Relatórios Emitidos</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-800">30</h3>
                    <div className="flex items-center mt-1 text-xs font-medium text-green-600">
                      <ArrowUpRight size={14} className="mr-1" />
                      <span>12 este mês</span>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <FileCheck size={22} className="text-green-600" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Meta mensal: 35</span>
                    <span className="text-green-600 font-medium">85% concluído</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Auditorias Concluídas</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-800">15</h3>
                    <div className="flex items-center mt-1 text-xs font-medium text-teal-600">
                      <Clock size={14} className="mr-1" />
                      <span>100% no prazo</span>
                    </div>
                  </div>
                  <div className="bg-teal-50 p-3 rounded-lg">
                    <CheckCircle2 size={22} className="text-teal-600" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Meta trimestral: 45</span>
                    <span className="text-teal-600 font-medium">33% concluído</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                    <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: "33%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-2">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-semibold text-gray-800">Progresso de Metas</h3>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Mensal
                    </span>
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="realizado" name="Realizado" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="atrasado" name="Atrasado" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center mt-4 space-x-8">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-sm text-gray-600">Realizado</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <span className="text-sm text-gray-600">Atrasado</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-semibold text-gray-800">Resumo de Atividades</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Inspeções Realizadas</span>
                      <span className="text-sm font-semibold">76%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "76%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Ações Concluídas</span>
                      <span className="text-sm font-semibold">62%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "62%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Auditorias Pendentes</span>
                      <span className="text-sm font-semibold">35%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Comuniques Ativos</span>
                      <span className="text-sm font-semibold">88%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: "88%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Tendência Mensal</h4>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="inspecoes" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="acoes" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity and Recent Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Próximas Atividades</h3>
                  <button className="text-sm text-[#0f2167] hover:text-[#1e3a8a] font-medium flex items-center">
                    Ver todas
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      title: "Inspeção Sistêmica - Setor A",
                      date: "Hoje, 14:00",
                      status: "Pendente",
                      icon: ShieldCheck,
                      color: "yellow",
                    },
                    {
                      title: "Reunião de Segurança",
                      date: "Amanhã, 09:30",
                      status: "Agendada",
                      icon: Users,
                      color: "blue",
                    },
                    {
                      title: "Auditoria Comportamental",
                      date: "12/05, 10:00",
                      status: "Agendada",
                      icon: FileCheck,
                      color: "blue",
                    },
                    {
                      title: "Visita Técnica - Empresa XYZ",
                      date: "15/05, 08:00",
                      status: "Confirmada",
                      icon: Eye,
                      color: "green",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`mr-4 p-2 rounded-lg bg-${activity.color}-50`}>
                        <activity.icon size={18} className={`text-${activity.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{activity.title}</h4>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          activity.status === "Pendente"
                            ? "bg-yellow-100 text-yellow-800"
                            : activity.status === "Agendada"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Ações Recentes</h3>
                  <button className="text-sm text-[#0f2167] hover:text-[#1e3a8a] font-medium flex items-center">
                    Ver histórico
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      title: "Relatório de Inspeção #2458",
                      user: "Carlos Silva",
                      time: "2 horas atrás",
                      type: "Emitido",
                      icon: FileText,
                      color: "blue",
                    },
                    {
                      title: "Comunique #187 - Risco Elétrico",
                      user: "Ana Oliveira",
                      time: "5 horas atrás",
                      type: "Criado",
                      icon: Megaphone,
                      color: "green",
                    },
                    {
                      title: "Auditoria #92 - Setor Produção",
                      user: "Roberto Santos",
                      time: "1 dia atrás",
                      type: "Atualizado",
                      icon: ClipboardList,
                      color: "purple",
                    },
                    {
                      title: "Ação Corretiva #345",
                      user: "Mariana Costa",
                      time: "2 dias atrás",
                      type: "Concluída",
                      icon: CheckCircle2,
                      color: "teal",
                    },
                  ].map((action, index) => (
                    <div key={index} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`mt-1 mr-4 p-2 rounded-lg bg-${action.color}-50`}>
                        <action.icon size={18} className={`text-${action.color}-600`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{action.title}</h4>
                        <p className="text-sm text-gray-500">
                          {action.user} • {action.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default HomePage

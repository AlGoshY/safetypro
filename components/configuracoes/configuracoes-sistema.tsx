"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Clock,
  Cloud,
  Download,
  Globe,
  Key,
  Mail,
  Phone,
  RefreshCw,
  Shield,
  User,
  Users,
  Save,
  AlertCircle,
  Eye,
  PlusCircle,
  Pencil,
  Trash2,
  CheckCircle,
  Settings,
  Lock,
  Info,
  Check,
  BarChart2,
  FileText,
  Calendar,
  AlertTriangle,
  Activity,
  Clipboard,
  MessageSquare,
  Sliders,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"

// Tipos de perfil
type UserRole = "admin" | "gestor" | "supervisor" | "tecnico" | "digitador" | "visualizador"

// Definição das permissões por módulo
interface ModulePermissions {
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
  approve: boolean
  configure: boolean
  export?: boolean
  share?: boolean
}

// Definição das permissões por perfil
interface RolePermissions {
  [key: string]: {
    [key: string]: ModulePermissions
  }
}

// Descrições dos módulos
interface ModuleDescriptions {
  [key: string]: string
}

export function ConfiguracoesSistema() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [foto, setFoto] = useState("/abstract-geometric-shapes.png")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin")
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [isPermissionsChanged, setIsPermissionsChanged] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  // Estado temporário para armazenar as alterações antes de salvar
  const [temaTemp, setTemaTemp] = useState<string>("claro")

  const [configuracoes, setConfiguracoes] = useState({
    nome: "João Silva",
    email: "joao.silva@empresa.com",
    telefone: "(11) 98765-4321",
    cargo: "Administrador",
    fusoHorario: "America/Sao_Paulo",
    idioma: "pt-BR",
    notificacoesEmail: true,
    notificacoesSom: true,
    paginaInicial: "dashboard",
    googleDrive: false,
    backupFrequencia: "diario",
    backupHora: "03:00",
    token: "a1b2c3d4e5f6g7h8i9j0",
  })

  // Descrições dos perfis
  const roleDescriptions = {
    admin: "Acesso total ao sistema, incluindo configurações avançadas e gerenciamento de usuários.",
    gestor: "Acesso amplo para gerenciar equipes, aprovar ações e visualizar relatórios completos.",
    supervisor: "Supervisão de atividades, criação de registros e acompanhamento de indicadores.",
    tecnico: "Registro de inspeções, visitas técnicas e ações corretivas.",
    digitador: "Entrada de dados básicos e visualização limitada de informações.",
    visualizador: "Apenas visualização de informações, sem permissão para criar ou editar.",
  }

  // Tradução dos módulos
  const moduleTranslations = {
    dashboard: "Dashboard",
    cadastros: "Cadastros",
    inspecao: "Inspeção",
    reunioes: "Reuniões",
    acoes: "Ações",
    auditoria: "Auditoria",
    visitaTecnica: "Visita Técnica",
    comunique: "Comunique",
    configuracoes: "Configurações",
    pesquisaSatisfacao: "Pesquisa de Satisfação",
    rotaInspecao: "Rota de Inspeção",
  }

  // Ícones dos módulos
  const moduleIcons = {
    dashboard: <BarChart2 className="h-4 w-4" />,
    cadastros: <FileText className="h-4 w-4" />,
    inspecao: <Clipboard className="h-4 w-4" />,
    reunioes: <Calendar className="h-4 w-4" />,
    acoes: <AlertTriangle className="h-4 w-4" />,
    auditoria: <Activity className="h-4 w-4" />,
    visitaTecnica: <Clipboard className="h-4 w-4" />,
    comunique: <MessageSquare className="h-4 w-4" />,
    configuracoes: <Sliders className="h-4 w-4" />,
    pesquisaSatisfacao: <CheckCircle className="h-4 w-4" />,
    rotaInspecao: <Clipboard className="h-4 w-4" />,
  }

  // Descrições dos módulos
  const moduleDescriptions: ModuleDescriptions = {
    dashboard: "Visualização de indicadores, gráficos e informações gerais do sistema.",
    cadastros: "Gerenciamento de usuários, empresas, setores, cargos e outras informações cadastrais.",
    inspecao: "Registro e acompanhamento de inspeções de segurança e conformidade.",
    reunioes: "Agendamento, registro e acompanhamento de reuniões e seus resultados.",
    acoes: "Criação e acompanhamento de ações corretivas e preventivas.",
    auditoria: "Registro e acompanhamento de auditorias comportamentais e de processos.",
    visitaTecnica: "Registro e acompanhamento de visitas técnicas realizadas.",
    comunique: "Sistema de comunicação e registro de ocorrências.",
    configuracoes: "Configurações gerais do sistema, perfis de acesso e personalizações.",
    pesquisaSatisfacao: "Criação e gerenciamento de pesquisas de satisfação e feedback.",
    rotaInspecao: "Configuração e acompanhamento de rotas de inspeção programadas.",
  }

  // Tradução das ações
  const actionTranslations = {
    view: "Visualizar",
    create: "Criar",
    edit: "Editar",
    delete: "Excluir",
    approve: "Aprovar",
    configure: "Configurar",
    export: "Exportar",
    share: "Compartilhar",
  }

  // Ícones para as ações
  const actionIcons = {
    view: <Eye className="h-4 w-4" />,
    create: <PlusCircle className="h-4 w-4" />,
    edit: <Pencil className="h-4 w-4" />,
    delete: <Trash2 className="h-4 w-4" />,
    approve: <CheckCircle className="h-4 w-4" />,
    configure: <Settings className="h-4 w-4" />,
    export: <Download className="h-4 w-4" />,
    share: <Users className="h-4 w-4" />,
  }

  // Permissões sensíveis que precisam de destaque
  const sensitivePemissions = ["delete", "configure"]

  // Estado para armazenar as permissões
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>({
    admin: {
      dashboard: { view: true, create: true, edit: true, delete: true, approve: true, configure: true, export: true },
      cadastros: { view: true, create: true, edit: true, delete: true, approve: true, configure: true },
      inspecao: { view: true, create: true, edit: true, delete: true, approve: true, configure: true, export: true },
      reunioes: { view: true, create: true, edit: true, delete: true, approve: true, configure: true },
      acoes: { view: true, create: true, edit: true, delete: true, approve: true, configure: true },
      auditoria: { view: true, create: true, edit: true, delete: true, approve: true, configure: true, export: true },
      visitaTecnica: { view: true, create: true, edit: true, delete: true, approve: true, configure: true },
      comunique: { view: true, create: true, edit: true, delete: true, approve: true, configure: true, share: true },
      configuracoes: { view: true, create: true, edit: true, delete: true, approve: true, configure: true },
      pesquisaSatisfacao: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        approve: true,
        configure: true,
        share: true,
        export: true,
      },
      rotaInspecao: { view: true, create: true, edit: true, delete: true, approve: true, configure: true },
    },
    gestor: {
      dashboard: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: true,
        configure: false,
        export: true,
      },
      cadastros: { view: true, create: true, edit: true, delete: false, approve: true, configure: false },
      inspecao: { view: true, create: true, edit: true, delete: false, approve: true, configure: false, export: true },
      reunioes: { view: true, create: true, edit: true, delete: false, approve: true, configure: false },
      acoes: { view: true, create: true, edit: true, delete: false, approve: true, configure: false },
      auditoria: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: true,
        configure: false,
        export: true,
      },
      visitaTecnica: { view: true, create: true, edit: true, delete: false, approve: true, configure: false },
      comunique: { view: true, create: true, edit: true, delete: false, approve: true, configure: false, share: true },
      configuracoes: { view: true, create: false, edit: false, delete: false, approve: false, configure: false },
      pesquisaSatisfacao: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        approve: true,
        configure: false,
        share: true,
        export: true,
      },
      rotaInspecao: { view: true, create: true, edit: true, delete: false, approve: true, configure: false },
    },
    supervisor: {
      dashboard: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        configure: false,
        export: true,
      },
      cadastros: { view: true, create: true, edit: true, delete: false, approve: false, configure: false },
      inspecao: { view: true, create: true, edit: true, delete: false, approve: false, configure: false, export: true },
      reunioes: { view: true, create: true, edit: true, delete: false, approve: false, configure: false },
      acoes: { view: true, create: true, edit: true, delete: false, approve: false, configure: false },
      auditoria: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        configure: false,
        export: true,
      },
      visitaTecnica: { view: true, create: true, edit: true, delete: false, approve: false, configure: false },
      comunique: { view: true, create: true, edit: true, delete: false, approve: false, configure: false, share: true },
      configuracoes: { view: true, create: false, edit: false, delete: false, approve: false, configure: false },
      pesquisaSatisfacao: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        approve: false,
        configure: false,
        share: true,
        export: false,
      },
      rotaInspecao: { view: true, create: true, edit: true, delete: false, approve: false, configure: false },
    },
    tecnico: {
      dashboard: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        configure: false,
        export: false,
      },
      cadastros: { view: true, create: true, edit: true, delete: false, approve: false, configure: false },
      inspecao: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        approve: false,
        configure: false,
        export: false,
      },
      reunioes: { view: true, create: false, edit: false, delete: false, approve: false, configure: false },
      acoes: { view: true, create: true, edit: true, delete: false, approve: false, configure: false },
      auditoria: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        configure: false,
        export: false,
      },
      visitaTecnica: { view: true, create: true, edit: true, delete: false, approve: false, configure: false },
      comunique: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        approve: false,
        configure: false,
        share: false,
      },
      configuracoes: { view: true, create: false, edit: false, delete: false, approve: false, configure: false },
      pesquisaSatisfacao: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        configure: false,
        share: false,
        export: false,
      },
      rotaInspecao: { view: true, create: true, edit: false, delete: false, approve: false, configure: false },
    },
    digitador: {
      dashboard: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        configure: false,
        export: false,
      },
      cadastros: { view: true, create: true, edit: false, delete: false, approve: false, configure: false },
      inspecao: {
        view: true,
        create: true,
        edit: false,
        delete: false,
        approve: false,
        configure: false,
        export: false,
      },
      reunioes: { view: true, create: false, edit: false, delete: false, approve: false, configure: false },
      acoes: { view: true, create: false, edit: false, delete: false, approve: false, configure: false },
      auditoria: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        configure: false,
        export: false,
      },
      visitaTecnica: { view: true, create: true, edit: false, delete: false, approve: false, configure: false },
      comunique: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        configure: false,
        share: false,
      },
      configuracoes: { view: false, create: false, edit: false, delete: false, approve: false, configure: false },
      pesquisaSatisfacao: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        configure: false,
        share: false,
        export: false,
      },
      rotaInspecao: { view: true, create: false, edit: false, delete: false, approve: false, configure: false },
    },
    visualizador: {
      dashboard: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        configure: false,
        export: false,
      },
      cadastros: { view: true, create: false, edit: false, delete: false, approve: false, configure: false },
      inspecao: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        configure: false,
        export: false,
      },
      reunioes: { view: true, create: false, edit: false, delete: false, approve: false, configure: false },
      acoes: { view: true, create: false, edit: false, delete: false, approve: false, configure: false },
      auditoria: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        configure: false,
        export: false,
      },
      visitaTecnica: { view: true, create: false, edit: false, delete: false, approve: false, configure: false },
      comunique: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        configure: false,
        share: false,
      },
      configuracoes: { view: false, create: false, edit: false, delete: false, approve: false, configure: false },
      pesquisaSatisfacao: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        configure: false,
        share: false,
        export: false,
      },
      rotaInspecao: { view: true, create: false, edit: false, delete: false, approve: false, configure: false },
    },
  })

  // Inicializar o tema temporário com base no tema atual
  useEffect(() => {
    if (theme === "light") setTemaTemp("claro")
    else if (theme === "dark") setTemaTemp("escuro")
    else setTemaTemp("automatico")
  }, [theme])

  // Função para lidar com a mudança temporária do tema (antes de salvar)
  const handleTemaChange = (value: string) => {
    setTemaTemp(value)
  }

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    setConfiguracoes({ ...configuracoes, [field]: value })
  }

  const handleSelectChange = (field) => (value) => {
    setConfiguracoes({ ...configuracoes, [field]: value })
  }

  const handleSwitchChange = (field) => (checked) => {
    setConfiguracoes({ ...configuracoes, [field]: checked })
  }

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFoto(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const regenerateToken = () => {
    const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setConfiguracoes({ ...configuracoes, token: newToken })
    toast({
      title: "Token regenerado",
      description: "Seu token de API foi regenerado com sucesso.",
    })
  }

  // Função para alterar permissões
  const handlePermissionChange = (role: string, module: string, action: string, checked: boolean) => {
    setRolePermissions((prev) => {
      const newPermissions = { ...prev }
      newPermissions[role][module][action] = checked
      return newPermissions
    })
    setIsPermissionsChanged(true)
  }

  // Função para selecionar todas as permissões de um módulo
  const handleSelectAllForModule = (role: string, module: string, checked: boolean) => {
    setRolePermissions((prev) => {
      const newPermissions = { ...prev }
      Object.keys(actionTranslations).forEach((action) => {
        if (newPermissions[role][module][action] !== undefined) {
          newPermissions[role][module][action] = checked
        }
      })
      return newPermissions
    })
    setIsPermissionsChanged(true)
  }

  // Função para selecionar uma permissão para todos os módulos
  const handleSelectAllForAction = (role: string, action: string, checked: boolean) => {
    setRolePermissions((prev) => {
      const newPermissions = { ...prev }
      Object.keys(moduleTranslations).forEach((module) => {
        if (newPermissions[role][module] && newPermissions[role][module][action] !== undefined) {
          newPermissions[role][module][action] = checked
        }
      })
      return newPermissions
    })
    setIsPermissionsChanged(true)
  }

  // Função para verificar se todas as permissões de um módulo estão selecionadas
  const areAllPermissionsSelectedForModule = (role: string, module: string) => {
    return Object.keys(actionTranslations).every((action) => {
      // Verifica se a permissão existe para este módulo antes de verificar seu valor
      return rolePermissions[role][module][action] === undefined || rolePermissions[role][module][action]
    })
  }

  // Função para verificar se todas as permissões de uma ação estão selecionadas
  const areAllPermissionsSelectedForAction = (role: string, action: string) => {
    return Object.keys(moduleTranslations).every((module) => {
      // Verifica se o módulo existe e se a permissão existe para este módulo
      return (
        !rolePermissions[role][module] ||
        rolePermissions[role][module][action] === undefined ||
        rolePermissions[role][module][action]
      )
    })
  }

  // Função para aplicar as alterações quando o usuário clica em "Salvar"
  const handleSaveChanges = () => {
    // Aplicar o tema selecionado
    if (temaTemp === "claro") setTheme("light")
    else if (temaTemp === "escuro") setTheme("dark")
    else setTheme("system")

    // Mostrar feedback visual
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram salvas com sucesso.",
      duration: 3000,
    })
  }

  // Função para salvar as permissões
  const handleSavePermissions = () => {
    // Aqui você implementaria a lógica para salvar as permissões no backend
    // Por enquanto, apenas mostramos um toast de sucesso
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 3000)
    setIsPermissionsChanged(false)

    toast({
      title: "Permissões atualizadas",
      description: "As permissões dos perfis foram atualizadas com sucesso.",
      duration: 3000,
    })
    setShowConfirmDialog(false)
  }

  // Função para verificar se o perfil admin está sendo modificado
  const isAdminBeingModified = () => {
    // Verificar se alguma permissão do admin está sendo desativada
    for (const module in rolePermissions.admin) {
      for (const action in rolePermissions.admin[module]) {
        if (!rolePermissions.admin[module][action]) {
          return true
        }
      }
    }
    return false
  }

  // Função para confirmar alterações nas permissões
  const confirmPermissionChanges = () => {
    if (isAdminBeingModified()) {
      setShowConfirmDialog(true)
    } else {
      handleSavePermissions()
    }
  }

  // Função para rolar a tabela horizontalmente
  const scrollTable = (direction: "left" | "right") => {
    if (tableRef.current) {
      const scrollAmount = 150 // pixels to scroll
      const currentScroll = tableRef.current.scrollLeft

      if (direction === "left") {
        tableRef.current.scrollLeft = currentScroll - scrollAmount
      } else {
        tableRef.current.scrollLeft = currentScroll + scrollAmount
      }
    }
  }

  // Função para expandir/colapsar um módulo
  const toggleModuleExpansion = (moduleKey: string) => {
    if (expandedModule === moduleKey) {
      setExpandedModule(null)
    } else {
      setExpandedModule(moduleKey)
    }
  }

  // Função para obter todas as ações disponíveis para um módulo
  const getAvailableActionsForModule = (role: string, module: string) => {
    if (!rolePermissions[role][module]) return []

    return Object.keys(rolePermissions[role][module]).filter((action) => action in actionTranslations)
  }

  return (
    <Tabs defaultValue="perfil" className="w-full">
      <TabsList className="grid grid-cols-5 mb-6">
        <TabsTrigger value="perfil">Informações do Perfil</TabsTrigger>
        <TabsTrigger value="interface">Preferências de Interface</TabsTrigger>
        <TabsTrigger value="integracoes">Integrações e Sistema</TabsTrigger>
        <TabsTrigger value="seguranca">Restrições e Segurança</TabsTrigger>
        <TabsTrigger value="permissoes">Controle de Permissões</TabsTrigger>
      </TabsList>

      {/* Seção: Informações do Perfil */}
      <TabsContent value="perfil">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Informações do Perfil
            </CardTitle>
            <CardDescription>Visualize e edite suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={foto || "/placeholder.svg"} alt="Foto de perfil" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center">
                  <Label htmlFor="foto" className="cursor-pointer text-sm text-blue-500 hover:text-blue-700">
                    Alterar foto
                  </Label>
                  <input id="foto" type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="nome">Nome completo</Label>
                    </div>
                    <Input id="nome" value={configuracoes.nome} disabled className="bg-gray-50" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="email">E-mail</Label>
                    </div>
                    <Input id="email" value={configuracoes.email} disabled className="bg-gray-50" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="telefone">Telefone (opcional)</Label>
                    </div>
                    <Input
                      id="telefone"
                      value={configuracoes.telefone}
                      onChange={handleChange("telefone")}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="cargo">Cargo / Função</Label>
                    </div>
                    <Input id="cargo" value={configuracoes.cargo} disabled className="bg-gray-50" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="fusoHorario">Fuso horário</Label>
                    </div>
                    <Select value={configuracoes.fusoHorario} onValueChange={handleSelectChange("fusoHorario")}>
                      <SelectTrigger id="fusoHorario">
                        <SelectValue placeholder="Selecione o fuso horário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                        <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                        <SelectItem value="America/Belem">Belém (GMT-3)</SelectItem>
                        <SelectItem value="America/Bahia">Salvador (GMT-3)</SelectItem>
                        <SelectItem value="America/Noronha">Fernando de Noronha (GMT-2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Último acesso</h4>
                  <p className="text-sm text-gray-600">05/05/2025 – 17:00 – IP: 192.168.1.1</p>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Dispositivos conectados</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                      <div>
                        <p className="text-sm font-medium">Windows 11 - Chrome</p>
                        <p className="text-xs text-gray-500">Conectado agora • 192.168.1.1</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Atual</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                      <div>
                        <p className="text-sm font-medium">iPhone 13 - Safari</p>
                        <p className="text-xs text-gray-500">Conectado há 2 dias • 187.122.X.X</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        Encerrar sessão
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Seção: Preferências de Interface */}
      <TabsContent value="interface">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Preferências de Interface
            </CardTitle>
            <CardDescription>Personalize a aparência e comportamento do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tema" className="text-sm font-medium dark:text-gray-200">
                    Tema do sistema
                  </Label>
                  <Select value={temaTemp} onValueChange={handleTemaChange}>
                    <SelectTrigger id="tema">
                      <SelectValue placeholder="Selecione o tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claro">Claro</SelectItem>
                      <SelectItem value="escuro">Escuro</SelectItem>
                      <SelectItem value="automatico">Automático (baseado no sistema)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    As alterações de tema serão aplicadas ao clicar em "Salvar alterações".
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idioma" className="text-sm font-medium dark:text-gray-200">
                    Idioma preferencial
                  </Label>
                  <Select value={configuracoes.idioma} onValueChange={handleSelectChange("idioma")}>
                    <SelectTrigger id="idioma">
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">Inglês (Estados Unidos)</SelectItem>
                      <SelectItem value="es">Espanhol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paginaInicial" className="text-sm font-medium dark:text-gray-200">
                    Página inicial após login
                  </Label>
                  <Select value={configuracoes.paginaInicial} onValueChange={handleSelectChange("paginaInicial")}>
                    <SelectTrigger id="paginaInicial">
                      <SelectValue placeholder="Selecione a página inicial" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="agenda">Agenda</SelectItem>
                      <SelectItem value="relatorios">Relatórios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium dark:text-gray-200">Notificações</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notificacoesEmail" className="text-sm dark:text-gray-200">
                      Notificações por e-mail
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Receba atualizações importantes por e-mail
                    </p>
                  </div>
                  <Switch
                    id="notificacoesEmail"
                    checked={configuracoes.notificacoesEmail}
                    onCheckedChange={handleSwitchChange("notificacoesEmail")}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notificacoesSom" className="text-sm dark:text-gray-200">
                      Sons ao receber alertas
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Reproduzir sons quando receber notificações
                    </p>
                  </div>
                  <Switch
                    id="notificacoesSom"
                    checked={configuracoes.notificacoesSom}
                    onCheckedChange={handleSwitchChange("notificacoesSom")}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Seção: Integrações e Sistema */}
      <TabsContent value="integracoes">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-blue-500" />
              Integrações e Sistema
            </CardTitle>
            <CardDescription>Gerencie integrações com outros serviços e configurações do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="googleDrive" className="text-sm dark:text-gray-200">
                      Integração com Google Drive
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sincronize documentos com o Google Drive</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {configuracoes.googleDrive ? "Conectado" : "Desconectado"}
                    </span>
                    <Switch
                      id="googleDrive"
                      checked={configuracoes.googleDrive}
                      onCheckedChange={handleSwitchChange("googleDrive")}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium dark:text-gray-200">Backup automático</h4>

                  <div className="space-y-2">
                    <Label htmlFor="backupFrequencia" className="text-xs text-gray-500 dark:text-gray-400">
                      Frequência
                    </Label>
                    <Select
                      value={configuracoes.backupFrequencia}
                      onValueChange={handleSelectChange("backupFrequencia")}
                    >
                      <SelectTrigger id="backupFrequencia">
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diário</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupHora" className="text-xs text-gray-500 dark:text-gray-400">
                      Hora programada
                    </Label>
                    <Input
                      id="backupHora"
                      type="time"
                      value={configuracoes.backupHora}
                      onChange={handleChange("backupHora")}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium dark:text-gray-200">Token de API pessoal</h4>
                  <div className="space-y-2">
                    <div className="flex">
                      <Input value={configuracoes.token} readOnly className="rounded-r-none font-mono text-xs" />
                      <Button type="button" className="rounded-l-none" onClick={regenerateToken}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerar
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Use este token para acessar a API. Mantenha-o em segredo.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium dark:text-gray-200">Exportar meus dados</h4>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" className="justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar como CSV
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar como PDF
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Exporte seus dados para uso pessoal. Apenas dados de leitura serão exportados.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Seção: Restrições e Segurança */}
      <TabsContent value="seguranca">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Restrições e Segurança
            </CardTitle>
            <CardDescription>Informações sobre segurança e restrições da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium flex items-center gap-2 mb-2 dark:text-gray-200">
                <Key className="h-4 w-4 text-gray-500" />
                Excluir conta
              </h4>
              <p className="text-sm text-gray-600 mb-2 dark:text-gray-400">
                Não permitido — Apenas administradores podem gerenciar contas.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Para solicitar a exclusão da sua conta, entre em contato com o administrador do sistema.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <h4 className="text-sm font-medium text-blue-700 mb-2 dark:text-gray-200">Informação importante</h4>
              <p className="text-sm text-blue-600 dark:text-gray-400">
                Todas as configurações aplicam-se exclusivamente à conta atual.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Nova Seção: Controle de Permissões */}
      <TabsContent value="permissoes">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Gerenciar Permissões</h2>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                <SelectTrigger className="w-[200px] bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="gestor">Gestor</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="digitador">Digitador</SelectItem>
                  <SelectItem value="visualizador">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">{roleDescriptions[selectedRole]}</p>
        </div>

        <Card className="border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-200">Módulo</th>
                    {Object.entries(actionTranslations).map(([actionKey, actionName]) => (
                      <th
                        key={actionKey}
                        className="text-center py-3 px-4 font-medium text-gray-700 border-l border-gray-200 dark:text-gray-200 dark:border-gray-600"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center justify-center">
                            {actionIcons[actionKey]}
                            <span className="ml-1 text-sm">{actionName}</span>
                          </div>
                          <Checkbox
                            id={`select-all-${actionKey}`}
                            checked={areAllPermissionsSelectedForAction(selectedRole, actionKey)}
                            onCheckedChange={(checked) =>
                              handleSelectAllForAction(selectedRole, actionKey, checked === true)
                            }
                            className="h-4 w-4 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 dark:data-[state=checked]:bg-blue-500 dark:data-[state=checked]:border-blue-500"
                          />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(moduleTranslations).map(([moduleKey, moduleName], index) => {
                    // Verifica se o módulo existe nas permissões do perfil selecionado
                    if (!rolePermissions[selectedRole][moduleKey]) return null

                    // Obtém as ações disponíveis para este módulo
                    const availableActions = getAvailableActionsForModule(selectedRole, moduleKey)

                    return (
                      <tr
                        key={moduleKey}
                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:hover:bg-gray-700 ${
                          index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50/30 dark:bg-gray-700/30"
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="text-gray-500 dark:text-gray-400">{moduleIcons[moduleKey]}</div>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">{moduleName}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3.5 w-3.5 text-gray-400 cursor-help dark:text-gray-500" />
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className="max-w-xs text-xs dark:bg-gray-700 dark:text-gray-300"
                                >
                                  <p>{moduleDescriptions[moduleKey]}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </td>
                        {Object.entries(actionTranslations).map(([actionKey, actionName]) => {
                          // Verifica se esta ação está disponível para este módulo
                          if (!availableActions.includes(actionKey)) {
                            return (
                              <td
                                key={actionKey}
                                className="py-3 px-4 text-center border-l border-gray-200 dark:border-gray-600"
                              >
                                <span className="text-gray-300 dark:text-gray-500">-</span>
                              </td>
                            )
                          }

                          const isChecked = rolePermissions[selectedRole][moduleKey][actionKey]
                          const isDisabled =
                            selectedRole === "admin" && actionKey === "view" && moduleKey === "dashboard"

                          return (
                            <td
                              key={actionKey}
                              className="py-3 px-4 text-center border-l border-gray-200 dark:border-gray-600"
                            >
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={isChecked}
                                  disabled={isDisabled}
                                  onCheckedChange={(checked) => {
                                    if (!isDisabled) {
                                      handlePermissionChange(selectedRole, moduleKey, actionKey, checked === true)
                                    }
                                  }}
                                  className={`h-5 w-5 rounded-sm ${
                                    actionKey === "delete" && isChecked
                                      ? "data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500 dark:data-[state=checked]:bg-red-500 dark:data-[state=checked]:border-red-500"
                                      : "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 dark:data-[state=checked]:bg-blue-500 dark:data-[state=checked]:border-blue-500"
                                  }`}
                                />
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <Button
            className={`
              px-4 py-2 transition-colors
              ${showSaveSuccess ? "bg-green-600 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-600"}
              ${isPermissionsChanged ? "opacity-100" : "opacity-80"}
            `}
            onClick={confirmPermissionChanges}
          >
            {showSaveSuccess ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Permissões salvas
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Permissões
              </>
            )}
          </Button>
        </div>

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent className="max-w-md dark:bg-gray-800 dark:border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-800 flex items-center gap-2 dark:text-gray-200">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Modificando permissões de Administrador
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                Você está prestes a modificar as permissões do perfil Administrador. Isso pode limitar o acesso de
                administradores ao sistema.
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 dark:bg-amber-900/10 dark:border-amber-800 dark:text-amber-400">
                  <p className="text-sm">
                    Administradores geralmente precisam de acesso completo ao sistema. Continuar com estas alterações
                    pode impedir que administradores acessem áreas críticas.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSavePermissions}
                className="bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-700"
              >
                Continuar mesmo assim
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TabsContent>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" className="border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Cancelar
        </Button>
        <Button
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          onClick={handleSaveChanges}
        >
          Salvar alterações
        </Button>
      </div>
    </Tabs>
  )
}

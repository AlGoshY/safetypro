"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, CheckCircle, XCircle } from "lucide-react"
import { useAuth, type UserRole } from "@/contexts/auth-context"

// Descrições dos perfis
const roleDescriptions = {
  admin: "Acesso total ao sistema, incluindo configurações avançadas e gerenciamento de usuários.",
  gestor: "Acesso amplo para gerenciar equipes, aprovar ações e visualizar relatórios completos.",
  supervisor: "Supervisão de atividades, criação de registros e acompanhamento de indicadores.",
  tecnico: "Registro de inspeções, visitas técnicas e ações corretivas.",
  digitador: "Entrada de dados básicos e visualização limitada de informações.",
  visualizador: "Apenas visualização de informações, sem permissão para criar ou editar.",
}

// Definição das permissões por perfil
const rolePermissions = {
  admin: {
    dashboard: { view: true, create: true, edit: true, delete: true, approve: true, export: true, share: true },
    cadastros: { view: true, create: true, edit: true, delete: true, approve: true, export: true, share: true },
    inspecao: { view: true, create: true, edit: true, delete: true, approve: true, export: true, share: true },
    reunioes: { view: true, create: true, edit: true, delete: true, approve: true, export: true, share: true },
    acoes: { view: true, create: true, edit: true, delete: true, approve: true, export: true, share: true },
    auditoria: { view: true, create: true, edit: true, delete: true, approve: true, export: true, share: true },
    visitaTecnica: { view: true, create: true, edit: true, delete: true, approve: true, export: true, share: true },
    comunique: { view: true, create: true, edit: true, delete: true, approve: true, export: true, share: true },
    configuracoes: { view: true, create: true, edit: true, delete: true, approve: true, export: true, share: true },
  },
  gestor: {
    dashboard: { view: true, create: false, edit: false, delete: false, approve: true, export: true, share: true },
    cadastros: { view: true, create: true, edit: true, delete: false, approve: true, export: true, share: true },
    inspecao: { view: true, create: true, edit: true, delete: false, approve: true, export: true, share: true },
    reunioes: { view: true, create: true, edit: true, delete: false, approve: true, export: true, share: true },
    acoes: { view: true, create: true, edit: true, delete: false, approve: true, export: true, share: true },
    auditoria: { view: true, create: false, edit: false, delete: false, approve: true, export: true, share: true },
    visitaTecnica: { view: true, create: true, edit: true, delete: false, approve: true, export: true, share: true },
    comunique: { view: true, create: true, edit: true, delete: false, approve: true, export: true, share: true },
    configuracoes: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      approve: false,
      export: false,
      share: false,
    },
  },
  supervisor: {
    dashboard: { view: true, create: false, edit: false, delete: false, approve: false, export: true, share: true },
    cadastros: { view: true, create: true, edit: true, delete: false, approve: false, export: true, share: true },
    inspecao: { view: true, create: true, edit: true, delete: false, approve: false, export: true, share: true },
    reunioes: { view: true, create: true, edit: true, delete: false, approve: false, export: true, share: true },
    acoes: { view: true, create: true, edit: true, delete: false, approve: false, export: true, share: true },
    auditoria: { view: true, create: false, edit: false, delete: false, approve: false, export: true, share: true },
    visitaTecnica: { view: true, create: true, edit: true, delete: false, approve: false, export: true, share: true },
    comunique: { view: true, create: true, edit: true, delete: false, approve: false, export: true, share: true },
    configuracoes: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      approve: false,
      export: false,
      share: false,
    },
  },
  tecnico: {
    dashboard: { view: true, create: false, edit: false, delete: false, approve: false, export: true, share: false },
    cadastros: { view: true, create: true, edit: true, delete: false, approve: false, export: true, share: false },
    inspecao: { view: true, create: true, edit: true, delete: false, approve: false, export: true, share: false },
    reunioes: { view: true, create: false, edit: false, delete: false, approve: false, export: true, share: false },
    acoes: { view: true, create: true, edit: true, delete: false, approve: false, export: true, share: false },
    auditoria: { view: true, create: false, edit: false, delete: false, approve: false, export: true, share: false },
    visitaTecnica: { view: true, create: true, edit: true, delete: false, approve: false, export: true, share: false },
    comunique: { view: true, create: true, edit: true, delete: false, approve: false, export: true, share: false },
    configuracoes: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      approve: false,
      export: false,
      share: false,
    },
  },
  digitador: {
    dashboard: { view: true, create: false, edit: false, delete: false, approve: false, export: false, share: false },
    cadastros: { view: true, create: true, edit: false, delete: false, approve: false, export: false, share: false },
    inspecao: { view: true, create: true, edit: false, delete: false, approve: false, export: false, share: false },
    reunioes: { view: true, create: false, edit: false, delete: false, approve: false, export: false, share: false },
    acoes: { view: true, create: false, edit: false, delete: false, approve: false, export: false, share: false },
    auditoria: { view: true, create: false, edit: false, delete: false, approve: false, export: false, share: false },
    visitaTecnica: {
      view: true,
      create: true,
      edit: false,
      delete: false,
      approve: false,
      export: false,
      share: false,
    },
    comunique: { view: true, create: false, edit: false, delete: false, approve: false, export: false, share: false },
    configuracoes: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      approve: false,
      export: false,
      share: false,
    },
  },
  visualizador: {
    dashboard: { view: true, create: false, edit: false, delete: false, approve: false, export: false, share: false },
    cadastros: { view: true, create: false, edit: false, delete: false, approve: false, export: false, share: false },
    inspecao: { view: true, create: false, edit: false, delete: false, approve: false, export: false, share: false },
    reunioes: { view: true, create: false, edit: false, delete: false, approve: false, export: false, share: false },
    acoes: { view: true, create: false, edit: false, delete: false, approve: false, export: false, share: false },
    auditoria: { view: true, create: false, edit: false, delete: false, approve: false, export: false, share: false },
    visitaTecnica: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      approve: false,
      export: false,
      share: false,
    },
    comunique: { view: true, create: false, edit: false, delete: false, approve: false, export: false, share: false },
    configuracoes: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      approve: false,
      export: false,
      share: false,
    },
  },
}

export default function PerfilPage() {
  const { user } = useAuth()
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin")

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
  }

  // Tradução das ações
  const actionTranslations = {
    view: "Visualizar",
    create: "Criar",
    edit: "Editar",
    delete: "Excluir",
    approve: "Aprovar",
    export: "Exportar",
    share: "Compartilhar",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Configuração de Perfis</h1>
        <Badge variant="outline" className="px-3 py-1">
          <Shield className="w-4 h-4 mr-1" />
          Seu perfil: {user?.role.toUpperCase()}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Perfis e Permissões
          </CardTitle>
          <CardDescription>Visualize as permissões de cada perfil no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admin" onValueChange={(value) => setSelectedRole(value as UserRole)}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="gestor">Gestor</TabsTrigger>
              <TabsTrigger value="supervisor">Supervisor</TabsTrigger>
              <TabsTrigger value="tecnico">Técnico</TabsTrigger>
              <TabsTrigger value="digitador">Digitador</TabsTrigger>
              <TabsTrigger value="visualizador">Visualizador</TabsTrigger>
            </TabsList>

            {Object.entries(roleDescriptions).map(([role, description]) => (
              <TabsContent key={role} value={role} className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-1">Descrição do Perfil</h3>
                  <p className="text-blue-700 text-sm">{description}</p>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Módulo</TableHead>
                        <TableHead>Permissões</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(moduleTranslations).map(([moduleKey, moduleName]) => (
                        <TableRow key={moduleKey}>
                          <TableCell className="font-medium">{moduleName}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(actionTranslations).map(([actionKey, actionName]) => {
                                // @ts-ignore - Estamos acessando dinamicamente
                                const hasPermission = rolePermissions[role][moduleKey]?.[actionKey]

                                return (
                                  <Badge
                                    key={actionKey}
                                    variant={hasPermission ? "default" : "outline"}
                                    className={`flex items-center gap-1 ${
                                      hasPermission
                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                        : "bg-gray-100 text-gray-500"
                                    }`}
                                  >
                                    {hasPermission ? (
                                      <CheckCircle className="h-3 w-3" />
                                    ) : (
                                      <XCircle className="h-3 w-3" />
                                    )}
                                    {actionName}
                                  </Badge>
                                )
                              })}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="text-red-500 text-6xl mb-4">
        <Shield className="h-16 w-16" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Acesso Restrito</h1>
      <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta página.</p>
    </div>
  )
}

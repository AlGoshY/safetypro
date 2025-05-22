"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Pesquisa, StatusPesquisa } from "@/types/pesquisa-satisfacao"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  PlusCircle,
  Search,
  QrCode,
  BarChart4,
  Eye,
  Pencil,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
} from "lucide-react"
import { usePesquisa } from "@/contexts/pesquisa-context"

export function GerenciarPesquisas() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    pesquisas,
    isLoading: isLoadingContext,
    carregarPesquisas,
    atualizarPesquisa,
    excluirPesquisa,
  } = usePesquisa()
  const [pesquisasFiltradas, setPesquisasFiltradas] = useState<Pesquisa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<StatusPesquisa | "todas">("todas")
  const [pesquisaParaExcluir, setPesquisaParaExcluir] = useState<string | null>(null)
  const [pesquisaParaEncerrar, setPesquisaParaEncerrar] = useState<string | null>(null)
  const [pesquisaParaAtivar, setPesquisaParaAtivar] = useState<string | null>(null)

  // Carregar pesquisas apenas uma vez na montagem do componente
  useEffect(() => {
    carregarPesquisas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Removida a dependência para evitar loops

  // Filtrar pesquisas quando os filtros ou dados mudarem
  useEffect(() => {
    if (!isLoadingContext) {
      const filtrarPesquisas = () => {
        let resultado = [...pesquisas]

        // Filtrar por termo de busca
        if (searchTerm) {
          resultado = resultado.filter(
            (p) =>
              p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.descricao?.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        }

        // Filtrar por status
        if (activeTab !== "todas") {
          resultado = resultado.filter((p) => p.status === activeTab)
        }

        setPesquisasFiltradas(resultado)
      }

      filtrarPesquisas()
      setIsLoading(false)
    }
  }, [searchTerm, activeTab, pesquisas, isLoadingContext])

  const handleExcluirPesquisa = async () => {
    if (!pesquisaParaExcluir) return

    try {
      const success = await excluirPesquisa(pesquisaParaExcluir)
      if (success) {
        toast({
          title: "Pesquisa excluída",
          description: "A pesquisa foi excluída com sucesso",
          variant: "default",
        })
      } else {
        throw new Error("Não foi possível excluir a pesquisa")
      }
    } catch (error) {
      console.error("Erro ao excluir pesquisa:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a pesquisa",
        variant: "destructive",
      })
    } finally {
      setPesquisaParaExcluir(null)
    }
  }

  const handleEncerrarPesquisa = async () => {
    if (!pesquisaParaEncerrar) return

    try {
      await atualizarPesquisa(pesquisaParaEncerrar, { status: "encerrada" })
      toast({
        title: "Pesquisa encerrada",
        description: "A pesquisa foi encerrada com sucesso",
        variant: "default",
      })
    } catch (error) {
      console.error("Erro ao encerrar pesquisa:", error)
      toast({
        title: "Erro",
        description: "Não foi possível encerrar a pesquisa",
        variant: "destructive",
      })
    } finally {
      setPesquisaParaEncerrar(null)
    }
  }

  const handleAtivarPesquisa = async () => {
    if (!pesquisaParaAtivar) return

    try {
      await atualizarPesquisa(pesquisaParaAtivar, { status: "ativa" })
      toast({
        title: "Pesquisa ativada",
        description: "A pesquisa foi ativada com sucesso",
        variant: "default",
      })
      toast({
        title: "Atenção",
        description: "Esta pesquisa não poderá mais ser editada após ser ativada",
        variant: "default",
      })
    } catch (error) {
      console.error("Erro ao ativar pesquisa:", error)
      toast({
        title: "Erro",
        description: "Não foi possível ativar a pesquisa",
        variant: "destructive",
      })
    } finally {
      setPesquisaParaAtivar(null)
    }
  }

  const copiarLinkPesquisa = (link: string) => {
    navigator.clipboard.writeText(`${window.location.origin}${link}`)
    toast({
      title: "Link copiado",
      description: "Link da pesquisa copiado para a área de transferência",
      variant: "default",
    })
  }

  const renderStatusBadge = (status: StatusPesquisa) => {
    switch (status) {
      case "ativa":
        return (
          <Badge variant="default" className="bg-green-500">
            Ativa
          </Badge>
        )
      case "encerrada":
        return <Badge variant="secondary">Encerrada</Badge>
      case "rascunho":
        return <Badge variant="outline">Rascunho</Badge>
    }
  }

  const renderSkeletonRows = () => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-full" />
          </TableCell>
        </TableRow>
      ))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar pesquisas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => router.push("/pesquisa-satisfacao/criar")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Pesquisa
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as StatusPesquisa | "todas")}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="ativa">Ativas</TabsTrigger>
          <TabsTrigger value="encerrada">Encerradas</TabsTrigger>
          <TabsTrigger value="rascunho">Rascunhos</TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Pesquisas de Satisfação</CardTitle>
            <CardDescription>Visualize, edite e gerencie todas as suas pesquisas de satisfação</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Término</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  renderSkeletonRows()
                ) : pesquisasFiltradas.length > 0 ? (
                  pesquisasFiltradas.map((pesquisa) => (
                    <TableRow key={pesquisa.id}>
                      <TableCell className="font-medium">{pesquisa.titulo}</TableCell>
                      <TableCell>{renderStatusBadge(pesquisa.status)}</TableCell>
                      <TableCell>{new Date(pesquisa.dataInicio).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{new Date(pesquisa.dataFim).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/pesquisa-satisfacao/dashboard?id=${pesquisa.id}`)}
                            title="Ver Dashboard"
                          >
                            <BarChart4 className="h-4 w-4" />
                          </Button>

                          {(pesquisa.status === "ativa" || pesquisa.status === "rascunho") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/pesquisa-satisfacao/visualizar?id=${pesquisa.id}`)}
                              title="Visualizar Formulário"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}

                          {pesquisa.status === "ativa" && pesquisa.linkPublico && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copiarLinkPesquisa(pesquisa.linkPublico!)}
                                title="Copiar Link"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/pesquisa-satisfacao/qrcode?id=${pesquisa.id}`)}
                                title="Ver QR Code"
                              >
                                <QrCode className="h-4 w-4" />
                              </Button>

                              {/* Botão de bloqueado para indicar que não pode ser editado */}
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled
                                title="Não é possível editar uma pesquisa ativa"
                              >
                                <Lock className="h-4 w-4 text-gray-400" />
                              </Button>
                            </>
                          )}

                          {pesquisa.status === "rascunho" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/pesquisa-satisfacao/editar/${pesquisa.id}`)}
                              title="Editar Pesquisa"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}

                          {pesquisa.status === "rascunho" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setPesquisaParaAtivar(pesquisa.id)}
                              title="Ativar Pesquisa"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                          )}

                          {pesquisa.status === "ativa" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setPesquisaParaEncerrar(pesquisa.id)}
                              title="Encerrar Pesquisa"
                            >
                              <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setPesquisaParaExcluir(pesquisa.id)}
                            title="Excluir Pesquisa"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <AlertCircle className="h-8 w-8 mb-2" />
                        <p>Nenhuma pesquisa encontrada</p>
                        {searchTerm && <p className="text-sm mt-1">Tente ajustar os filtros de busca</p>}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>

      {/* Diálogo de confirmação para ativar pesquisa */}
      <AlertDialog open={!!pesquisaParaAtivar} onOpenChange={(open) => !open && setPesquisaParaAtivar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ativar Pesquisa</AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Você tem certeza que deseja ativar esta pesquisa?
              <span className="block font-semibold text-amber-500 mt-2">
                Atenção: Uma vez ativada, esta pesquisa não poderá mais ser editada.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPesquisaParaAtivar(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleAtivarPesquisa} className="bg-green-500 hover:bg-green-600">
              Ativar Pesquisa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmação para encerrar pesquisa */}
      <AlertDialog open={!!pesquisaParaEncerrar} onOpenChange={(open) => !open && setPesquisaParaEncerrar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Encerrar Pesquisa</AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Você tem certeza que deseja encerrar esta pesquisa?
              <span className="block font-semibold text-red-500 mt-2">
                Atenção: Uma vez encerrada, esta pesquisa não poderá ser reativada.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPesquisaParaEncerrar(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEncerrarPesquisa} className="bg-red-500 hover:bg-red-600">
              Encerrar Pesquisa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmação para excluir pesquisa */}
      <AlertDialog open={!!pesquisaParaExcluir} onOpenChange={(open) => !open && setPesquisaParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Pesquisa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta pesquisa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExcluirPesquisa} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { NovoTipoReuniaoModal } from "./novo-tipo-reuniao-modal"
import { EditarTipoReuniaoModal } from "./editar-tipo-reuniao-modal"
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

type FrequenciaReuniao =
  | "Diária"
  | "Semanal"
  | "Quinzenal"
  | "Mensal"
  | "Bimestral"
  | "Trimestral"
  | "Semestral"
  | "Anual"
  | "Sob demanda"

interface TipoReuniao {
  id: string
  codigo: string
  nome: string
  descricao: string
  ativo: boolean
  frequencias: FrequenciaReuniao[]
}

const tiposReuniaoIniciais: TipoReuniao[] = [
  {
    id: "1",
    codigo: "CIPA",
    nome: "CIPA",
    descricao: "Comissão Interna de Prevenção de Acidentes",
    ativo: true,
    frequencias: ["Mensal", "Semanal"],
  },
  {
    id: "2",
    codigo: "SEG",
    nome: "Segurança",
    descricao: "Reunião de segurança do trabalho",
    ativo: true,
    frequencias: ["Diária", "Semanal", "Mensal"],
  },
  {
    id: "3",
    codigo: "OPER",
    nome: "Operacional",
    descricao: "Reunião operacional de equipe",
    ativo: true,
    frequencias: ["Diária", "Semanal"],
  },
  {
    id: "4",
    codigo: "ADM",
    nome: "Administrativa",
    descricao: "Reunião administrativa",
    ativo: false,
    frequencias: ["Semanal", "Mensal", "Trimestral"],
  },
  {
    id: "5",
    codigo: "TREIN",
    nome: "Treinamento",
    descricao: "Reunião de treinamento",
    ativo: true,
    frequencias: ["Sob demanda"],
  },
]

export function CadastroTiposReuniao() {
  const { toast } = useToast()
  const [tiposReuniao, setTiposReuniao] = useState<TipoReuniao[]>(tiposReuniaoIniciais)
  const [busca, setBusca] = useState("")
  const [tipoParaExcluir, setTipoParaExcluir] = useState<string | null>(null)
  const [tipoParaEditar, setTipoParaEditar] = useState<TipoReuniao | null>(null)

  const tiposFiltrados = tiposReuniao.filter(
    (tipo) =>
      tipo.nome.toLowerCase().includes(busca.toLowerCase()) ||
      tipo.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      tipo.descricao.toLowerCase().includes(busca.toLowerCase()),
  )

  const handleAdicionarTipo = (novoTipo: Omit<TipoReuniao, "id">) => {
    // Gerar ID único para o novo tipo
    const novoId = (Math.max(...tiposReuniao.map((t) => Number.parseInt(t.id))) + 1).toString()

    // Adicionar o novo tipo à lista
    setTiposReuniao([...tiposReuniao, { id: novoId, ...novoTipo }])

    // Mostrar mensagem de sucesso
    toast({
      title: "Tipo de reunião adicionado",
      description: `O tipo "${novoTipo.nome}" foi adicionado com sucesso.`,
    })
  }

  const handleEditarTipo = (id: string, tipoAtualizado: Omit<TipoReuniao, "id">) => {
    // Atualizar o tipo na lista
    setTiposReuniao(tiposReuniao.map((tipo) => (tipo.id === id ? { ...tipo, ...tipoAtualizado } : tipo)))

    // Limpar o tipo em edição
    setTipoParaEditar(null)

    // Mostrar mensagem de sucesso
    toast({
      title: "Tipo de reunião atualizado",
      description: `O tipo "${tipoAtualizado.nome}" foi atualizado com sucesso.`,
    })
  }

  const handleExcluir = (id: string) => {
    // Remover o tipo da lista
    setTiposReuniao(tiposReuniao.filter((tipo) => tipo.id !== id))

    // Limpar o tipo para exclusão
    setTipoParaExcluir(null)

    // Mostrar mensagem de sucesso
    toast({
      title: "Tipo de reunião excluído",
      description: "O tipo de reunião foi excluído com sucesso.",
    })
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Cadastro de Tipos de Reunião</h1>
        <p className="text-gray-500 mt-1">Gerencie os tipos de reunião disponíveis no sistema</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Buscar tipos de reunião..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* Componente de modal para novo tipo */}
        <NovoTipoReuniaoModal onSave={handleAdicionarTipo} />
      </div>

      <div className="bg-white rounded-md shadow">
        <div className="p-4 border-b">
          <h2 className="font-medium">Tipos de Reunião Cadastrados</h2>
        </div>

        {tiposFiltrados.map((tipo) => (
          <div key={tipo.id} className="p-4 border-b last:border-b-0">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{tipo.nome}</h3>
                  <span className="text-sm text-gray-500">({tipo.codigo})</span>
                  <Badge
                    variant={tipo.ativo ? "default" : "destructive"}
                    className={tipo.ativo ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                  >
                    {tipo.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="text-gray-600 mt-1">{tipo.descricao}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tipo.frequencias.map((freq) => (
                    <Badge key={freq} variant="outline" className="bg-blue-50">
                      {freq}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setTipoParaEditar(tipo)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => setTipoParaExcluir(tipo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {tiposFiltrados.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {busca ? "Nenhum tipo de reunião encontrado para o filtro aplicado." : "Nenhum tipo de reunião cadastrado."}
          </div>
        )}
      </div>

      {/* Modal de edição */}
      {tipoParaEditar && (
        <EditarTipoReuniaoModal
          tipo={tipoParaEditar}
          onSave={(tipoAtualizado) => handleEditarTipo(tipoParaEditar.id, tipoAtualizado)}
          onCancel={() => setTipoParaEditar(null)}
        />
      )}

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={!!tipoParaExcluir} onOpenChange={() => setTipoParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este tipo de reunião? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => tipoParaExcluir && handleExcluir(tipoParaExcluir)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

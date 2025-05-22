"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { useToast } from "@/hooks/use-toast"

export function StatusReuniao() {
  const [ativo, setAtivo] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const { toast } = useToast()

  const handleToggleStatus = (checked: boolean) => {
    if (ativo && !checked) {
      // Se está desativando uma reunião ativa, mostra o diálogo de confirmação
      setShowDialog(true)
    } else {
      // Se está ativando, apenas muda o estado
      setAtivo(checked)
      toast({
        title: checked ? "Reunião ativada" : "Reunião desativada",
        description: checked ? "A reunião foi ativada com sucesso." : "A reunião foi desativada com sucesso.",
      })
    }
  }

  const confirmarDesativacao = () => {
    setAtivo(false)
    setShowDialog(false)
    toast({
      title: "Reunião desativada",
      description: "A reunião foi desativada com sucesso.",
    })
  }

  const cancelarDesativacao = () => {
    setShowDialog(false)
  }

  return (
    <div className="flex items-center space-x-4">
      <Badge
        variant={ativo ? "default" : "outline"}
        className={ativo ? "bg-green-500 hover:bg-green-600" : "text-red-500 border-red-200"}
      >
        {ativo ? "Ativo" : "Inativo"}
      </Badge>

      <div className="flex items-center space-x-2">
        <Switch id="status-reuniao" checked={ativo} onCheckedChange={handleToggleStatus} />
        <Label htmlFor="status-reuniao" className="text-sm font-medium">
          {ativo ? "Desativar" : "Ativar"} reunião
        </Label>
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar reunião?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao desativar esta reunião, ela não será mais exibida nas listagens padrão e os participantes não receberão
              notificações. Você poderá reativá-la posteriormente se necessário.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelarDesativacao}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarDesativacao} className="bg-red-500 hover:bg-red-600">
              Sim, desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

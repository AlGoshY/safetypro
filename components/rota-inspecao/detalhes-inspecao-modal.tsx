"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye } from "lucide-react"

interface DetalhesInspecaoModalProps {
  item: any
}

export function DetalhesInspecaoModal({ item }: DetalhesInspecaoModalProps) {
  const [open, setOpen] = useState(false)

  // Dados mockados para a tabela de detalhes
  const detalhesAtividades = [
    {
      id: 1,
      avaliacao: "Conforme",
      processos: "Combinados",
      atividade: "Combinados 2023 - Queda de Mesmo Nível",
      descricaoSetor: "Área de Produção",
      comoAvaliar: "Os pisos dos setores possuem superfície antiderrapante?",
      anexo: false,
      obs: "Verificado em 12/05/2023",
      acoes: true,
      resolvido: "Sim",
    },
    {
      id: 2,
      avaliacao: "Não Conforme",
      processos: "Combinados",
      atividade: "Combinados 2023 - Água Quente",
      descricaoSetor: "Área de Produção",
      comoAvaliar:
        "Existe dispositivo que possibilite a realização de bloqueio físico de acesso junto aos pontos de água quente nas linhas de higienização?",
      anexo: true,
      obs: "Necessário implementar bloqueio",
      acoes: true,
      resolvido: "Não",
    },
  ]

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="h-8 w-8">
        <Eye className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Inspeção</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Unidade Centralizadora</h3>
              <p className="text-sm">{item.unidadeCentralizadora || "Filial Central 1"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Unidade</h3>
              <p className="text-sm">{item.unidade}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Técnico da unidade</h3>
              <p className="text-sm">{item.tecnico}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mb-4">
            <Button className="bg-red-600 hover:bg-red-700">INICIAR LANÇAMENTO</Button>
            <Button variant="outline">EXPORTAR ROTA DE INSPEÇÃO</Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Processos</TableHead>
                  <TableHead>Atividade</TableHead>
                  <TableHead>Descrição do setor</TableHead>
                  <TableHead>Como avaliar</TableHead>
                  <TableHead>Anexo</TableHead>
                  <TableHead>OBS</TableHead>
                  <TableHead>Ações</TableHead>
                  <TableHead>Resolvido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detalhesAtividades.map((detalhe) => (
                  <TableRow key={detalhe.id}>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          detalhe.avaliacao === "Conforme"
                            ? "bg-green-100 text-green-800"
                            : detalhe.avaliacao === "Não Conforme"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {detalhe.avaliacao}
                      </span>
                    </TableCell>
                    <TableCell>{detalhe.processos}</TableCell>
                    <TableCell>{detalhe.atividade}</TableCell>
                    <TableCell>{detalhe.descricaoSetor}</TableCell>
                    <TableCell>{detalhe.comoAvaliar}</TableCell>
                    <TableCell>{detalhe.anexo ? "Sim" : "Não"}</TableCell>
                    <TableCell>{detalhe.obs}</TableCell>
                    <TableCell>{detalhe.acoes ? "Sim" : "Não"}</TableCell>
                    <TableCell>{detalhe.resolvido}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline">SALVAR</Button>
            <Button variant="secondary">FINALIZAR</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

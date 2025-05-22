"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface CadastroAcaoModalProps {
  onClose: () => void
  onSave: (acao: any) => void
}

export function CadastroAcaoModal({ onClose, onSave }: CadastroAcaoModalProps) {
  const [problema, setProblema] = useState("")
  const [causa, setCausa] = useState("")
  const [acao, setAcao] = useState("")
  const [observacao, setObservacao] = useState("")
  const [requerimento, setRequerimento] = useState("DDS - Implementado")
  const [responsavel, setResponsavel] = useState("Chaves Gerente ADM do SST")
  const [dataPrevisao, setDataPrevisao] = useState<Date | undefined>(new Date())
  const [prioridade, setPrioridade] = useState("Baixa")
  const [resolvido, setResolvido] = useState(false)
  const [descricaoAnexo, setDescricaoAnexo] = useState("")
  const [tipoAnexo, setTipoAnexo] = useState("anomalia")
  const [anexos, setAnexos] = useState<File[]>([])
  const [anexosList, setAnexosList] = useState<
    Array<{ codigo: string; tipo: string; descricao: string; data: string }>
  >([{ codigo: "178", tipo: "Anomalia", descricao: "fgfdg", data: "Invalid date" }])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setAnexos([...anexos, ...newFiles])

      // Adicionar à lista de anexos
      const newAnexosList = newFiles.map((file) => ({
        codigo: Math.floor(Math.random() * 1000).toString(),
        tipo: tipoAnexo === "anomalia" ? "Anomalia" : "Solução",
        descricao: descricaoAnexo || file.name,
        data: format(new Date(), "dd/MM/yyyy"),
      }))

      setAnexosList([...anexosList, ...newAnexosList])
      setDescricaoAnexo("")
    }
  }

  const handleRemoveAnexo = (codigo: string) => {
    setAnexosList(anexosList.filter((anexo) => anexo.codigo !== codigo))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const novaAcao = {
      problema,
      causa,
      acao,
      observacao,
      requerimento,
      responsavel,
      dataPrevisao: dataPrevisao ? format(dataPrevisao, "dd/MM/yyyy") : "",
      prioridade,
      resolvido,
      anexos: anexosList,
    }

    onSave(novaAcao)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Cadastro de Ações Visitas</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Problema*</label>
            <Textarea
              value={problema}
              onChange={(e) => setProblema(e.target.value)}
              required
              className="min-h-[80px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição causa*</label>
            <Textarea value={causa} onChange={(e) => setCausa(e.target.value)} required className="min-h-[80px]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">O que fazer*</label>
            <Textarea value={acao} onChange={(e) => setAcao(e.target.value)} required className="min-h-[80px]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
            <Textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} className="min-h-[80px]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requerimento-Levantamento*</label>
            <Select value={requerimento} onValueChange={setRequerimento} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o requerimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DDS - Implementado">DDS - Implementado</SelectItem>
                <SelectItem value="Plano de Atendimento a Emergência">Plano de Atendimento a Emergência</SelectItem>
                <SelectItem value="Planejamento Anual">Planejamento Anual</SelectItem>
                <SelectItem value="Diário de Bordo">Diário de Bordo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsável*</label>
              <Select value={responsavel} onValueChange={setResponsavel} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chaves Gerente ADM do SST">Chaves Gerente ADM do SST</SelectItem>
                  <SelectItem value="João Silva">João Silva</SelectItem>
                  <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                  <SelectItem value="Pedro Oliveira">Pedro Oliveira</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Previsão*</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {dataPrevisao ? format(dataPrevisao, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={dataPrevisao} onSelect={setDataPrevisao} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade*</label>
              <Select value={prioridade} onValueChange={setPrioridade} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Crítica">Crítica</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center mt-2">
                <Checkbox
                  id="resolvido"
                  checked={resolvido}
                  onCheckedChange={(checked) => setResolvido(checked as boolean)}
                />
                <label htmlFor="resolvido" className="ml-2 text-sm font-medium text-gray-700">
                  Resolvido
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t mt-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Descrição anexo"
                  value={descricaoAnexo}
                  onChange={(e) => setDescricaoAnexo(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-4">
                <RadioGroup value={tipoAnexo} onValueChange={setTipoAnexo} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="anomalia" id="anomalia" />
                    <Label htmlFor="anomalia">Anomalia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solucao" id="solucao" />
                    <Label htmlFor="solucao">Solução</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <div className="relative">
                  <input type="file" id="file-upload" className="sr-only" onChange={handleFileChange} />
                  <label
                    htmlFor="file-upload"
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded cursor-pointer inline-block"
                  >
                    ANEXAR
                  </label>
                </div>
              </div>
            </div>

            {anexosList.length > 0 && (
              <div className="border rounded-md overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Código
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tipo
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Descrição
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Data Inclusão
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Visualizar
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Excluir
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {anexosList.map((anexo) => (
                      <tr key={anexo.codigo}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {anexo.codigo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{anexo.tipo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{anexo.descricao}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{anexo.data}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span className="sr-only">Visualizar</span>
                          </Button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500"
                            onClick={() => handleRemoveAnexo(anexo.codigo)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Linhas por página:
                <Select defaultValue="25">
                  <SelectTrigger className="w-16 ml-2">
                    <SelectValue placeholder="25" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-4">1-1 de 1</span>
                <div className="flex">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 mr-2" disabled>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Anterior</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6.1584 3.13514C5.95694 3.32401 5.94673 3.64042 6.13559 3.84188L9.565 7.49991L6.13559 11.1579C5.94673 11.3594 5.95694 11.6758 6.1584 11.8647C6.35986 12.0535 6.67627 12.0433 6.86514 11.8419L10.6151 7.84188C10.7954 7.64955 10.7954 7.35027 10.6151 7.15794L6.86514 3.15794C6.67627 2.95648 6.35986 2.94628 6.1584 3.13514Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Próximo</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              SALVAR
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

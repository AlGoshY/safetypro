"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Plus, Trash2, FileOutputIcon as FileExport } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function LancamentoInspecaoPage() {
  const { toast } = useToast()
  const [dataInspecao, setDataInspecao] = useState("08/05/2025")
  const [equipe, setEquipe] = useState<Array<{ id: string; nome: string; convidado: boolean; email: string }>>([])
  const [showAddPessoaModal, setShowAddPessoaModal] = useState(false)

  // Dados de exemplo
  const unidades = ["Matriz São Paulo", "Filial Rio de Janeiro", "Filial Belo Horizonte"]
  const setores = ["Produção", "Administrativo", "Logística", "Comercial", "TI"]

  const handleAdicionarPessoa = () => {
    setShowAddPessoaModal(true)
  }

  const handleIniciarInspecao = () => {
    if (equipe.length === 0) {
      toast({
        title: "Atenção",
        description: "É necessário adicionar pelo menos uma pessoa à equipe de inspeção.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Inspeção iniciada",
      description: "A inspeção foi iniciada com sucesso!",
    })
    // Aqui seria a navegação para a próxima etapa
  }

  const handleExportarInspecao = () => {
    toast({
      title: "Exportação iniciada",
      description: "O arquivo será baixado em instantes.",
    })
    // Lógica de exportação
  }

  const handleRemoverPessoa = (id: string) => {
    setEquipe(equipe.filter((pessoa) => pessoa.id !== id))
    toast({
      title: "Pessoa removida",
      description: "A pessoa foi removida da equipe de inspeção.",
    })
  }

  return (
    <div className="w-full h-full p-0 m-0">
      <div className="w-full h-full bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Lançamento de Inspeção</h1>

        {/* Identificação da ISS */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Identificação da ISS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
              <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Selecione uma unidade</option>
                {unidades.map((unidade, index) => (
                  <option key={index} value={unidade}>
                    {unidade}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
              <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Selecione um setor</option>
                {setores.map((setor, index) => (
                  <option key={index} value={setor}>
                    {setor}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Inspeção</label>
              <div className="relative">
                <input
                  type="text"
                  value={dataInspecao}
                  onChange={(e) => setDataInspecao(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Equipe de Inspeção */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Equipe de Inspeção</h2>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                  >
                    Ações
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nome
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Convidado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    E-mail
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {equipe.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                      Nenhum registro encontrado
                    </td>
                  </tr>
                ) : (
                  equipe.map((pessoa) => (
                    <tr key={pessoa.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleRemoverPessoa(pessoa.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pessoa.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pessoa.convidado ? "Sim" : "Não"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pessoa.email}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex gap-4">
            <Button
              onClick={handleAdicionarPessoa}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADICIONAR PESSOA
            </Button>

            <Button onClick={handleIniciarInspecao} className="bg-blue-600 hover:bg-blue-700 text-white">
              INICIAR INSPEÇÃO
            </Button>
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Exportar */}
        <div>
          <Button onClick={handleExportarInspecao} variant="outline" className="text-gray-700 border-gray-300">
            <FileExport className="h-4 w-4 mr-2" />
            EXPORTAR INSPEÇÃO SISTÊMICA
          </Button>
        </div>
      </div>

      {showAddPessoaModal && (
        <AdicionarPessoaModal
          onClose={() => setShowAddPessoaModal(false)}
          onAdd={(pessoa) => {
            setEquipe([...equipe, { ...pessoa, id: Date.now().toString() }])
            setShowAddPessoaModal(false)
            toast({
              title: "Pessoa adicionada",
              description: `${pessoa.nome} foi adicionado(a) à equipe de inspeção.`,
            })
          }}
        />
      )}
    </div>
  )
}

function AdicionarPessoaModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (pessoa: { nome: string; convidado: boolean; email: string }) => void
}) {
  const [nome, setNome] = useState("")
  const [convidado, setConvidado] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return

    onAdd({
      nome,
      convidado,
      email,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Adicionar Pessoa</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 focus:outline-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o nome"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o e-mail"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="convidado"
              checked={convidado}
              onChange={(e) => setConvidado(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="convidado" className="ml-2 block text-sm text-gray-700">
              Convidado externo
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="border-gray-300">
              CANCELAR
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!nome.trim()}>
              ADICIONAR
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

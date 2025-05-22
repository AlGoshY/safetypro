"use client"

import { useState } from "react"
import { CadastrarItemModal } from "@/components/inspecao/cadastrar-item-modal"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function CadastrarItemPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sortBy, setSortBy] = useState("")

  // Filtros avançados
  const [advancedFilters, setAdvancedFilters] = useState({
    dataCriacaoInicio: "",
    dataCriacaoFim: "",
    apenasAtivos: false,
    apenasInativos: false,
  })

  const [itensInspecao, setItensInspecao] = useState([
    {
      id: 1,
      nome: "Verificação de EPI",
      descricao: "Verificar se todos os funcionários estão utilizando os EPIs adequados",
      status: "ativo",
      dataCriacao: "10/05/2023",
    },
    {
      id: 2,
      nome: "Condições do ambiente",
      descricao: "Avaliar as condições gerais do ambiente de trabalho",
      status: "ativo",
      dataCriacao: "15/05/2023",
    },
    {
      id: 3,
      nome: "Procedimentos de segurança",
      descricao: "Verificar se os procedimentos de segurança estão sendo seguidos",
      status: "inativo",
      dataCriacao: "20/05/2023",
    },
  ])

  // Converter data no formato DD/MM/YYYY para objeto Date
  const parseDate = (dateString) => {
    if (!dateString) return null
    const [day, month, year] = dateString.split("/")
    return new Date(`${year}-${month}-${day}`)
  }

  // Filtrar e ordenar itens
  const filteredItems = itensInspecao.filter((item) => {
    // Filtro básico de busca e status
    const matchesSearch =
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "" || item.status === statusFilter

    // Filtros avançados
    let matchesAdvancedFilters = true

    // Filtro de data de início
    if (advancedFilters.dataCriacaoInicio) {
      const itemDate = parseDate(item.dataCriacao)
      const startDate = new Date(advancedFilters.dataCriacaoInicio)
      if (itemDate < startDate) {
        matchesAdvancedFilters = false
      }
    }

    // Filtro de data de fim
    if (advancedFilters.dataCriacaoFim) {
      const itemDate = parseDate(item.dataCriacao)
      const endDate = new Date(advancedFilters.dataCriacaoFim)
      if (itemDate > endDate) {
        matchesAdvancedFilters = false
      }
    }

    // Filtro de status avançado
    if (advancedFilters.apenasAtivos && item.status !== "ativo") {
      matchesAdvancedFilters = false
    }

    if (advancedFilters.apenasInativos && item.status !== "inativo") {
      matchesAdvancedFilters = false
    }

    return matchesSearch && matchesStatus && matchesAdvancedFilters
  })

  // Ordenar itens
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "nome") {
      return a.nome.localeCompare(b.nome)
    } else if (sortBy === "data") {
      // Converter datas no formato DD/MM/YYYY para objetos Date
      const dateA = a.dataCriacao.split("/").reverse().join("-")
      const dateB = b.dataCriacao.split("/").reverse().join("-")
      return new Date(dateB) - new Date(dateA) // Mais recente primeiro
    }
    return 0
  })

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleOpenModal = () => {
    setEditMode(false)
    setCurrentItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    setCurrentItem(item)
    setEditMode(true)
    setIsModalOpen(true)
  }

  const confirmDelete = (item) => {
    setItemToDelete(item)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    if (itemToDelete) {
      setItensInspecao(itensInspecao.filter((item) => item.id !== itemToDelete.id))
      toast({
        title: "Item excluído",
        description: "O item foi excluído com sucesso",
        variant: "default",
      })
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const handleAdvancedFilterChange = (e) => {
    const { name, value, type, checked } = e.target
    setAdvancedFilters({
      ...advancedFilters,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleToggleAdvancedFilters = () => {
    setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)
  }

  const handleResetAdvancedFilters = () => {
    setAdvancedFilters({
      dataCriacaoInicio: "",
      dataCriacaoFim: "",
      apenasAtivos: false,
      apenasInativos: false,
    })
  }

  const handleApplyAdvancedFilters = () => {
    // Os filtros já são aplicados automaticamente
    setIsAdvancedFiltersOpen(false)
    toast({
      title: "Filtros aplicados",
      description: "Os filtros avançados foram aplicados com sucesso",
      variant: "default",
    })
  }

  return (
    <div className="w-full h-full p-0 m-0">
      <div className="w-full h-full bg-white p-6">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Inspeção</h1>
            <p className="text-gray-500 mt-2">Gerenciamento de itens de verificação para inspeções</p>
          </div>
          <Button
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-all duration-200 shadow-sm"
          >
            <span className="text-lg">+</span>
            <span>Cadastrar Novo Item</span>
          </Button>
        </div>

        {/* Filtros e Pesquisa */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar item..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="">Status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>

            <select
              className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="">Ordenar por</option>
              <option value="nome">Nome</option>
              <option value="data">Data de criação</option>
            </select>
          </div>

          <Button
            variant="outline"
            className="ml-auto border-gray-300 text-gray-700"
            onClick={handleToggleAdvancedFilters}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filtros avançados
          </Button>
        </div>

        {/* Tabela de Itens */}
        <div className="overflow-x-auto border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Item
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
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data de Criação
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedItems.length > 0 ? (
                sortedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.nome}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-1">{item.descricao}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === "ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status === "ativo" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dataCriacao}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => handleEdit(item)}>
                        Editar
                      </button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => confirmDelete(item)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm || statusFilter || Object.values(advancedFilters).some((v) => v) ? (
                      <div>
                        <p className="text-lg mb-2">Nenhum item encontrado</p>
                        <p className="text-sm">Tente ajustar os filtros ou termos de busca</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg mb-2">Nenhum item cadastrado</p>
                        <p className="text-sm">Clique em "Cadastrar Novo Item" para começar</p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">1</span> a <span className="font-medium">{sortedItems.length}</span>{" "}
            de <span className="font-medium">{sortedItems.length}</span> itens
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-gray-300 text-gray-700" disabled>
              Anterior
            </Button>
            <Button variant="outline" className="border-gray-300 bg-blue-50 text-blue-600 border-blue-200">
              1
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700" disabled>
              Próximo
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Cadastro/Edição */}
      <CadastrarItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editMode={editMode}
        itemData={currentItem}
        onSave={(item) => {
          if (editMode) {
            setItensInspecao(itensInspecao.map((i) => (i.id === item.id ? item : i)))
            toast({
              title: "Item atualizado",
              description: "O item foi atualizado com sucesso",
              variant: "default",
            })
          } else {
            setItensInspecao([
              ...itensInspecao,
              { ...item, id: Date.now(), dataCriacao: new Date().toLocaleDateString() },
            ])
            toast({
              title: "Item cadastrado",
              description: "O item foi cadastrado com sucesso",
              variant: "default",
            })
          }
          setIsModalOpen(false)
          setEditMode(false)
          setCurrentItem(null)
        }}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o item "{itemToDelete?.nome}"?
              <br />
              Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete} className="border-gray-300 text-gray-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Filtros Avançados */}
      <Dialog open={isAdvancedFiltersOpen} onOpenChange={setIsAdvancedFiltersOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filtros Avançados</DialogTitle>
            <DialogDescription>
              Utilize os filtros abaixo para refinar sua busca de itens de inspeção.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataCriacaoInicio">Data de criação (início)</Label>
                <Input
                  id="dataCriacaoInicio"
                  name="dataCriacaoInicio"
                  type="date"
                  value={advancedFilters.dataCriacaoInicio}
                  onChange={handleAdvancedFilterChange}
                  className="col-span-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataCriacaoFim">Data de criação (fim)</Label>
                <Input
                  id="dataCriacaoFim"
                  name="dataCriacaoFim"
                  type="date"
                  value={advancedFilters.dataCriacaoFim}
                  onChange={handleAdvancedFilterChange}
                  className="col-span-3"
                />
              </div>
            </div>

            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="apenasAtivos" className="flex items-center space-x-2 cursor-pointer">
                  <span>Apenas itens ativos</span>
                </Label>
                <Switch
                  id="apenasAtivos"
                  name="apenasAtivos"
                  checked={advancedFilters.apenasAtivos}
                  onCheckedChange={(checked) => {
                    setAdvancedFilters({
                      ...advancedFilters,
                      apenasAtivos: checked,
                      apenasInativos: checked ? false : advancedFilters.apenasInativos,
                    })
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="apenasInativos" className="flex items-center space-x-2 cursor-pointer">
                  <span>Apenas itens inativos</span>
                </Label>
                <Switch
                  id="apenasInativos"
                  name="apenasInativos"
                  checked={advancedFilters.apenasInativos}
                  onCheckedChange={(checked) => {
                    setAdvancedFilters({
                      ...advancedFilters,
                      apenasInativos: checked,
                      apenasAtivos: checked ? false : advancedFilters.apenasAtivos,
                    })
                  }}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={handleResetAdvancedFilters}>
              Limpar Filtros
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" onClick={handleApplyAdvancedFilters}>
              Aplicar Filtros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

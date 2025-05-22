import { CriarPesquisaForm } from "@/components/pesquisa-satisfacao/criar-pesquisa-form"

export default function CriarPesquisaPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Criar Nova Pesquisa de Satisfação</h1>
      <CriarPesquisaForm />
    </div>
  )
}

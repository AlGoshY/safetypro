import CadastroVisitaTecnica from "@/components/visita-tecnica/cadastro-visita-tecnica"

export default function CadastrarVisitaTecnicaPage() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex items-center border-b pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cadastrar Visita Técnica</h1>
          <p className="text-gray-500 mt-1">Registre informações sobre visitas técnicas realizadas</p>
        </div>
      </div>
      <CadastroVisitaTecnica />
    </div>
  )
}

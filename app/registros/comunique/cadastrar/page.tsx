import { CadastroComunique } from "@/components/comunique/cadastro-comunique"
import { Megaphone } from "lucide-react"

export default function CadastrarComuniquePage() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <Megaphone className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cadastrar Comunique</h1>
            <p className="text-gray-500 mt-1">
              Registre ocorrências, sugestões ou melhorias para o ambiente de trabalho
            </p>
          </div>
        </div>
      </div>

      {/* Dicas rápidas */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-md">
        <h3 className="font-medium text-amber-800">Dicas para um bom registro:</h3>
        <ul className="mt-2 text-sm text-amber-700 list-disc list-inside space-y-1">
          <li>Descreva a ocorrência com o máximo de detalhes possível</li>
          <li>Adicione fotos para melhor visualização da situação</li>
          <li>Sugira melhorias ou soluções quando aplicável</li>
          <li>Informe corretamente o local e setor da ocorrência</li>
        </ul>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <CadastroComunique />
      </div>
    </div>
  )
}

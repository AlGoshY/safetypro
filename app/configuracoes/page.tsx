import { MainLayout } from "@/components/layout/main-layout"
import { ConfiguracoesSistema } from "@/components/configuracoes/configuracoes-sistema"

export default function ConfiguracoesPage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>
          <p className="text-gray-500 mt-1">Gerencie as configurações do sistema</p>
        </div>

        <ConfiguracoesSistema />
      </div>
    </MainLayout>
  )
}

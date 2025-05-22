import { MainLayout } from "@/components/layout/main-layout"
import { LocalAISettings } from "@/components/ai/local-ai-settings"

export default function AssistenteConfigPage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Configurações do Assistente</h2>
          <p className="text-gray-500 mt-1">Gerencie as configurações do assistente virtual</p>
        </div>

        <LocalAISettings />
      </div>
    </MainLayout>
  )
}

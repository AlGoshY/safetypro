import { CadastroReuniao } from "@/components/reunioes/cadastro-reuniao"
import { StatusReuniao } from "@/components/reunioes/status-reuniao"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CadastroReuniaoPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cadastro de Reunião</h1>
        <div className="flex items-center gap-4">
          <StatusReuniao />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <Tabs defaultValue="informacoes" className="w-full">
          <div className="border-b px-6 py-3">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="informacoes">Informações</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="informacoes" className="p-0">
            <CadastroReuniao />
          </TabsContent>

          <TabsContent value="configuracoes" className="p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Configurações da Reunião</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Notificações</h3>
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div>
                      <p className="font-medium">Lembrete por email</p>
                      <p className="text-sm text-gray-500">Enviar lembretes aos participantes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Privacidade</h3>
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div>
                      <p className="font-medium">Reunião privada</p>
                      <p className="text-sm text-gray-500">Visível apenas para convidados</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

import type React from "react"
export default function ResponderPesquisaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#0f2167] text-white py-4">
        <div className="container flex items-center">
          <img src="/sst-logo-white.png" alt="SST Logo" className="h-8 w-8 mr-2" />
          <h1 className="text-xl font-semibold">Pesquisa de Satisfação</h1>
        </div>
      </header>
      <main className="flex-1 container py-8">{children}</main>
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
        <div className="container">
          <p>© {new Date().getFullYear()} SST - Saúde e Segurança do Trabalho. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

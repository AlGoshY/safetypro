import type React from "react"

export default function AtividadesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Rota de Inspeção - Cadastro de Atividades</h1>
        <p className="text-gray-600">Cadastre as atividades que serão incluídas nas rotas de inspeção de segurança.</p>
      </div>
      {children}
    </div>
  )
}

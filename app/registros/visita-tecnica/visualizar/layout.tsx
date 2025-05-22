import type React from "react"

export default function VisualizarVisitaTecnicaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Detalhes da Visita Técnica</h1>
      {children}
    </div>
  )
}

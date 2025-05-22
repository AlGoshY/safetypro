import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Visualizar Comunique | SST",
  description: "Visualize e gerencie os registros de comunicações e ocorrências.",
}

export default function VisualizarComuniqueLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

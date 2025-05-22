import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Comunique | SST",
  description: "Sistema de comunicação de ocorrências e incidentes.",
}

export default function ComuniqueLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

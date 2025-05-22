import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compartilhamento de Comunique | SST",
  description: "Compartilhe informações do Comunique via QR Code e links",
}

export default function CompartilharComuniqueLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

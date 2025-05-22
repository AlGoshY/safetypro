import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compartilhamento | SST",
  description: "Compartilhe informações através de QR Codes e links",
}

export default function CompartilhamentoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

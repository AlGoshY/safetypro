import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cadastro de Indicadores | Sistema SST",
  description: "Gerenciamento de indicadores para reuniões",
}

export default function IndicadoresLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Relatório de Inspeção",
  description: "Visualize e exporte relatórios de inspeções realizadas",
}

export default function RelatorioInspecaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

// Garantir que o layout correto seja aplicado
import type React from "react"
import { MainLayout } from "@/components/layout/main-layout"

export default function TiposReuniaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}

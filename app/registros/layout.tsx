import type { ReactNode } from "react"
import { MainLayout } from "@/components/layout/main-layout"

export default function RegistrosLayout({
  children,
}: {
  children: ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}

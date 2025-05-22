import type React from "react"
import { Toaster } from "@/components/ui/toaster"

export default function GerenciadorAcoesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

import type React from "react"
export default function CadastrarComuniqueLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="container mx-auto py-6">{children}</div>
}

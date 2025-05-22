"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import Dashboard from "@/components/dashboard/dashboard"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [router])

  // Não renderizamos nada até que a verificação de autenticação seja concluída
  // Em um sistema real, você poderia mostrar um loader aqui
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  )
}

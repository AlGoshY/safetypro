import { redirect } from "next/navigation"

export default function VisitaTecnicaPage() {
  redirect("/registros/visita-tecnica/cadastrar")
  return null
}

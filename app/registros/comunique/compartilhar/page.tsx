import type { Metadata } from "next"
import { CompartilhamentoComunique } from "@/components/comunique/compartilhamento-comunique"

export const metadata: Metadata = {
  title: "Compartilhamento de Comunique | SST",
  description: "Compartilhe informações do Comunique via QR Code e links",
}

export default function CompartilharComuniquePage() {
  return <CompartilhamentoComunique />
}

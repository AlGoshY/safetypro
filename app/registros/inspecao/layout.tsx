import type React from "react"
export default function InspecaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="w-full">{children}</div>
}

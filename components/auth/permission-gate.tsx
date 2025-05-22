"use client"

import type { ReactNode } from "react"
import { useAuth, type Permissions } from "@/contexts/auth-context"

interface PermissionGateProps {
  module: keyof Permissions
  action: string
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGate({ module, action, children, fallback = null }: PermissionGateProps) {
  const { hasPermission } = useAuth()

  if (hasPermission(module, action)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { UnidadeProvider } from "@/contexts/unidade-context"
import { AuthProvider } from "@/contexts/auth-context"
import { PesquisaProvider } from "@/contexts/pesquisa-context"
import { LocalAIProvider } from "@/components/ai/local-ai-context"
import { Toaster } from "@/components/ui/toaster"
import { AIContextProvider } from "@/contexts/ai-context"
import { TooltipProvider } from "@/components/ui/tooltip"

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <UnidadeProvider>
          <LocalAIProvider>
            <AIContextProvider>
              <PesquisaProvider>
                <TooltipProvider>
                  {children}
                  <Toaster />
                </TooltipProvider>
              </PesquisaProvider>
            </AIContextProvider>
          </LocalAIProvider>
        </UnidadeProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

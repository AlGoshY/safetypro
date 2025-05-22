"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  autoGenerateCode?: boolean
  generateCodeOnMount?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onChange, autoGenerateCode = false, generateCodeOnMount = false, ...props }, ref) => {
    // Referência para o elemento input
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Função para gerar código automaticamente
    const generateCode = React.useCallback(() => {
      if (inputRef.current) {
        // Gerar um código único baseado em timestamp e número aleatório
        const timestamp = new Date().getTime()
        const random = Math.floor(Math.random() * 10000)
        const generatedCode = `COD-${timestamp}-${random}`

        // Atualizar o valor do input
        inputRef.current.value = generatedCode

        // Disparar evento de mudança para atualizar o estado do formulário
        const event = new Event("input", { bubbles: true })
        inputRef.current.dispatchEvent(event)

        // Se houver um manipulador onChange, chamá-lo com o evento simulado
        if (onChange) {
          const simulatedEvent = {
            target: inputRef.current,
            currentTarget: inputRef.current,
          } as React.ChangeEvent<HTMLInputElement>

          onChange(simulatedEvent)
        }
      }
    }, [onChange])

    // Gerar código ao montar o componente, se solicitado
    React.useEffect(() => {
      if (generateCodeOnMount || autoGenerateCode) {
        generateCode()
      }
    }, [generateCodeOnMount, autoGenerateCode, generateCode])

    // Combinar a ref passada com a ref interna
    const handleRef = (element: HTMLInputElement) => {
      inputRef.current = element
      if (typeof ref === "function") {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    }

    // Manipular mudanças no input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e)
      }
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500",
          className,
        )}
        onChange={handleChange}
        ref={handleRef}
        {...props}
      />
    )
  },
)

Input.displayName = "Input"

export { Input }

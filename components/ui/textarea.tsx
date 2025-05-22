"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  showCharCount?: boolean
  maxCount?: number
  showLimitMessage?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, showCharCount = true, maxCount = 1024, showLimitMessage = true, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(0)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      if (props.onChange) {
        props.onChange(e)
      }
    }

    React.useEffect(() => {
      if (props.value && typeof props.value === "string") {
        setCharCount(props.value.length)
      }
    }, [props.value])

    // Determina a cor do contador baseado na proximidade do limite
    const getCounterColor = () => {
      if (charCount >= maxCount) return "text-red-500 font-medium"
      if (charCount >= maxCount * 0.9) return "text-amber-500 font-medium"
      return "text-muted-foreground"
    }

    return (
      <div className="space-y-1">
        {showLimitMessage && (
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 mr-1"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Limite máximo de {maxCount} caracteres
          </div>
        )}
        <div className="relative">
          <textarea
            className={cn(
              "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            ref={ref}
            maxLength={maxCount}
            onChange={handleChange}
            {...props}
          />
          {showCharCount && (
            <div className={`absolute bottom-1.5 right-2 text-xs ${getCounterColor()}`}>
              {charCount}/{maxCount}
            </div>
          )}
        </div>
      </div>
    )
  },
)
Textarea.displayName = "Textarea"

export { Textarea }

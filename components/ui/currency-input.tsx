import * as React from "react"

import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils"

type CurrencyInputProps = Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> & {
  /** Valor decimal em string ("25.99"), ou "" quando vazio. */
  value: string
  onValueChange: (value: string) => void
}

/** Input de dinheiro preenchido da direita pra esquerda: digitar 2599 vira R$ 25,99. */
const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onValueChange, ...props }, ref) => {
    const cents = value ? Math.round(Number(value) * 100) : 0

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        // bloqueia o submit com R$ 0,00 (exige algum dígito diferente de zero)
        pattern=".*[1-9].*"
        title="Informe um valor maior que zero"
        {...props}
        value={formatCurrency(cents / 100)}
        onChange={(e) => {
          // 13 dígitos = até R$ 99 bilhões, ainda exato em float
          const digits = e.target.value.replace(/\D/g, "").slice(0, 13)
          const next = Number(digits)
          onValueChange(next ? (next / 100).toFixed(2) : "")
        }}
      />
    )
  },
)
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }

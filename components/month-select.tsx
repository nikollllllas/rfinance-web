"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatMonthDisplay, formatMonthShort } from "@/lib/utils"

interface MonthSelectProps {
  value: string
  onValueChange: (month: string) => void
  months: string[]
}

export function MonthSelect({ value, onValueChange, months }: MonthSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[104px] sm:w-[200px]" aria-label="Mês">
        <SelectValue placeholder="Mês" />
      </SelectTrigger>
      <SelectContent>
        {months.map((month) => (
          <SelectItem key={month} value={month}>
            <span className="sm:hidden">{formatMonthShort(month)}</span>
            <span className="hidden sm:inline">{formatMonthDisplay(month)}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

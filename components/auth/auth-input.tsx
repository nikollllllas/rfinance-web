import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type AuthInputProps = React.ComponentProps<typeof Input> & {
  icon: React.ReactNode
  rightSlot?: React.ReactNode
}

export function AuthInput({ icon, rightSlot, className, ...props }: AuthInputProps) {
  return (
    <div className="relative flex items-center">
      <span className="pointer-events-none absolute left-3 flex text-muted-foreground">{icon}</span>
      <Input
        className={cn(
          "h-[46px] rounded-xl border-border pl-10 focus-visible:border-success focus-visible:ring-success",
          rightSlot && "pr-10",
          className
        )}
        {...props}
      />
      {rightSlot ? <span className="absolute right-3 flex items-center">{rightSlot}</span> : null}
    </div>
  )
}

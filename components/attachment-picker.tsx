"use client"

import { useRef, useState } from "react"
import { FileText, ImageIcon, Paperclip, X } from "lucide-react"
import { cn } from "@/lib/utils"

export const ATTACHMENT_ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png,.webp,.heic"
export const ATTACHMENT_ACCEPTED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
])
export const ATTACHMENT_MAX_SIZE_BYTES = 10 * 1024 * 1024

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface AttachmentPickerProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  disabled?: boolean
  onRejected?: (reason: string) => void
}

export function AttachmentPicker({
  files,
  onFilesChange,
  disabled,
  onRejected,
}: AttachmentPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const addFiles = (incoming: FileList | File[]) => {
    const accepted: File[] = []
    for (const file of Array.from(incoming)) {
      if (!ATTACHMENT_ACCEPTED_MIME_TYPES.has(file.type)) {
        onRejected?.(`${file.name}: tipo não suportado`)
        continue
      }
      if (file.size > ATTACHMENT_MAX_SIZE_BYTES) {
        onRejected?.(`${file.name}: maior que 10MB`)
        continue
      }
      accepted.push(file)
    }
    if (accepted.length > 0) onFilesChange([...files, ...accepted])
  }

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragOver(false)
          if (!disabled && e.dataTransfer.files.length > 0) {
            addFiles(e.dataTransfer.files)
          }
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-4 py-6 text-center transition-colors",
          isDragOver ? "border-primary bg-accent" : "border-input hover:bg-accent/50",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <Paperclip className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">
          Arraste comprovantes aqui ou clique pra selecionar
        </span>
        <span className="text-xs text-muted-foreground">
          PDF, JPEG, PNG, WEBP ou HEIC, até 10MB
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ATTACHMENT_ACCEPTED_TYPES}
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </button>

      {files.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-lg border px-2.5 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                {file.type === "application/pdf" ? (
                  <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                ) : (
                  <ImageIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                )}
                <span className="truncate text-xs">{file.name}</span>
                <span className="flex-shrink-0 text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </span>
              </div>
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeFile(index)}
                className="flex-shrink-0 text-muted-foreground hover:text-destructive disabled:pointer-events-none"
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Remover</span>
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

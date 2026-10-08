"use client"

import { useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { FileText, ImageIcon, Loader2, Paperclip, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { kubbClientConfig } from "@/lib/kubb-client"
import { attachmentsControllerGetDownloadUrl } from "@/lib/api/attachments/attachments-controller-get-download-url"
import {
  useTransactionAttachmentsControllerList,
  transactionAttachmentsControllerListQueryKey,
} from "@/lib/api/attachments/hooks/use-transaction-attachments-controller-list"
import { useTransactionAttachmentsControllerUpload } from "@/lib/api/attachments/hooks/use-transaction-attachments-controller-upload"
import { useAttachmentsControllerRemove } from "@/lib/api/attachments/hooks/use-attachments-controller-remove"
import { ATTACHMENT_ACCEPTED_TYPES } from "@/components/attachment-picker"

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface TransactionAttachmentsProps {
  transactionId: string
}

export function TransactionAttachments({ transactionId }: TransactionAttachmentsProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [openingId, setOpeningId] = useState<string | null>(null)

  const { data, isLoading } = useTransactionAttachmentsControllerList(transactionId, {
    client: kubbClientConfig,
  })
  const attachments = data ?? []

  const queryKey = transactionAttachmentsControllerListQueryKey(transactionId)

  const uploadMutation = useTransactionAttachmentsControllerUpload({
    client: kubbClientConfig,
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey })
      },
      onError: (error) => {
        toast({
          title: "Erro",
          description: error instanceof Error ? error.message : "Falha ao enviar comprovante",
          variant: "destructive",
        })
      },
    },
  })

  const removeMutation = useAttachmentsControllerRemove({
    client: kubbClientConfig,
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey })
      },
    },
  })

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    uploadMutation.mutate({ transactionId, data: formData })
  }

  const handleOpen = async (id: string) => {
    setOpeningId(id)
    try {
      const result = await attachmentsControllerGetDownloadUrl(id, kubbClientConfig)
      if (result?.url) window.open(result.url, "_blank", "noopener,noreferrer")
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao abrir o comprovante",
        variant: "destructive",
      })
    } finally {
      setOpeningId(null)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Comprovantes</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
        >
          {uploadMutation.isPending ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Paperclip className="mr-1.5 h-3.5 w-3.5" />
          )}
          Anexar
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={ATTACHMENT_ACCEPTED_TYPES}
          className="hidden"
          onChange={handleFileSelected}
        />
      </div>

      {isLoading ? (
        <p className="text-xs text-muted-foreground">Carregando comprovantes...</p>
      ) : attachments.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nenhum comprovante anexado.</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between rounded-lg border px-2.5 py-2"
            >
              <button
                type="button"
                onClick={() => handleOpen(attachment.id)}
                disabled={openingId === attachment.id}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                {attachment.mimeType === "application/pdf" ? (
                  <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                ) : (
                  <ImageIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                )}
                <span className="truncate text-xs">{attachment.fileName}</span>
                <span className="flex-shrink-0 text-xs text-muted-foreground">
                  {formatBytes(attachment.sizeBytes)}
                </span>
                {openingId === attachment.id && (
                  <Loader2 className="h-3 w-3 flex-shrink-0 animate-spin" />
                )}
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 flex-shrink-0 text-destructive hover:text-destructive"
                onClick={() => removeMutation.mutate({ id: attachment.id })}
                disabled={removeMutation.isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="sr-only">Remover</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

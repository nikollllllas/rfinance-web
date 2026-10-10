"use client"

import { useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { FileImage, FileText, Loader2, Paperclip, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  useTransactionAttachmentsControllerList,
  transactionAttachmentsControllerListQueryKey,
} from "@/lib/api/attachments/hooks/useTransactionAttachmentsControllerList"
import { useTransactionAttachmentsControllerUpload } from "@/lib/api/attachments/hooks/useTransactionAttachmentsControllerUpload"
import { useAttachmentsControllerRemove } from "@/lib/api/attachments/hooks/useAttachmentsControllerRemove"
import type { AttachmentResponseDto } from "@/lib/api/schemas/AttachmentResponseDto"
import { ATTACHMENT_ACCEPTED_TYPES } from "@/components/attachment-picker"
import { AttachmentViewer } from "@/components/attachment-viewer"
import { PdfViewerDialog } from "@/components/pdf-viewer-dialog"

const PREVIEWABLE_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

function attachmentContentUrl(id: string): string {
  return `/api/v1/attachments/${id}/content`
}

function attachmentOrder(attachment: AttachmentResponseDto): number {
  if (PREVIEWABLE_IMAGE_TYPES.has(attachment.mimeType)) return 0
  if (attachment.mimeType === "application/pdf") return 2
  return 1
}

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
  const [imageIndex, setImageIndex] = useState<number | null>(null)
  const [openPdf, setOpenPdf] = useState<AttachmentResponseDto | null>(null)

  const { data, isLoading } = useTransactionAttachmentsControllerList({ path: { transactionId } })
  const attachments = [...(data ?? [])].sort((a, b) => attachmentOrder(a) - attachmentOrder(b))
  const images = attachments
    .filter((attachment) => PREVIEWABLE_IMAGE_TYPES.has(attachment.mimeType))
    .map((attachment) => ({
      id: attachment.id,
      fileName: attachment.fileName,
      src: attachmentContentUrl(attachment.id),
    }))

  const queryKey = transactionAttachmentsControllerListQueryKey({ path: { transactionId } })

  const uploadMutation = useTransactionAttachmentsControllerUpload({
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
    uploadMutation.mutate({ path: { transactionId }, body: { file } })
  }

  const handleOpen = (attachment: AttachmentResponseDto) => {
    if (PREVIEWABLE_IMAGE_TYPES.has(attachment.mimeType)) {
      setImageIndex(images.findIndex((image) => image.id === attachment.id))
    } else if (attachment.mimeType === "application/pdf") {
      setOpenPdf(attachment)
    } else {
      window.open(attachmentContentUrl(attachment.id), "_blank", "noopener,noreferrer")
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
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {attachments.map((attachment) => {
            const isImage = PREVIEWABLE_IMAGE_TYPES.has(attachment.mimeType)
            const Icon = attachment.mimeType === "application/pdf" ? FileText : FileImage
            return (
              <div
                key={attachment.id}
                className="relative aspect-square overflow-hidden rounded-lg border bg-muted"
              >
                <button
                  type="button"
                  onClick={() => handleOpen(attachment)}
                  className="flex h-full w-full items-center justify-center"
                >
                  {isImage ? (
                    <img
                      src={attachmentContentUrl(attachment.id)}
                      alt={attachment.fileName}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
                      <Icon className="h-6 w-6" />
                      <span className="line-clamp-2 break-all text-center text-[10px] text-foreground">
                        {attachment.fileName}
                      </span>
                      <span className="text-[10px]">{formatBytes(attachment.sizeBytes)}</span>
                    </span>
                  )}
                  <span className="sr-only">Ver {attachment.fileName}</span>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7 rounded-full bg-background/80 text-destructive backdrop-blur-sm hover:bg-background hover:text-destructive"
                  onClick={() => removeMutation.mutate({ path: { id: attachment.id } })}
                  disabled={removeMutation.isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Remover</span>
                </Button>
              </div>
            )
          })}
        </div>
      )}

      <AttachmentViewer images={images} index={imageIndex} onClose={() => setImageIndex(null)} />
      <PdfViewerDialog
        file={openPdf ? attachmentContentUrl(openPdf.id) : null}
        fileName={openPdf?.fileName ?? ""}
        onClose={() => setOpenPdf(null)}
      />
    </div>
  )
}

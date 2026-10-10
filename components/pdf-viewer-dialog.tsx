"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Download, Loader2, X, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

const PdfDocument = dynamic(() => import("@/components/pdf-document"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
})

const MIN_SCALE = 0.5
const MAX_SCALE = 3
const SCALE_STEP = 0.25

interface PdfViewerDialogProps {
  file: string | null
  fileName: string
  onClose: () => void
}

export function PdfViewerDialog({ file, fileName, onClose }: PdfViewerDialogProps) {
  const [scale, setScale] = useState(1)

  return (
    <Dialog
      open={file !== null}
      onOpenChange={(open) => {
        if (open) return
        setScale(1)
        onClose()
      }}
    >
      <DialogContent
        hideClose
        className="flex touch-auto flex-col gap-0 overflow-hidden p-0 sm:h-[90dvh] sm:max-w-4xl"
      >
        <div className="flex items-center gap-1 border-b px-3 py-2">
          <div className="min-w-0 flex-1">
            <DialogTitle className="truncate text-sm font-medium">{fileName}</DialogTitle>
            <DialogDescription className="sr-only">Visualização do comprovante em PDF</DialogDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScale((value) => Math.max(MIN_SCALE, value - SCALE_STEP))}
            disabled={scale <= MIN_SCALE}
          >
            <ZoomOut className="h-4 w-4" />
            <span className="sr-only">Diminuir zoom</span>
          </Button>
          <span className="w-11 text-center text-xs tabular-nums text-muted-foreground">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScale((value) => Math.min(MAX_SCALE, value + SCALE_STEP))}
            disabled={scale >= MAX_SCALE}
          >
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">Aumentar zoom</span>
          </Button>
          {file ? (
            <Button variant="ghost" size="icon" asChild>
              <a href={file} download={fileName}>
                <Download className="h-4 w-4" />
                <span className="sr-only">Baixar</span>
              </a>
            </Button>
          ) : null}
          <DialogClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </DialogClose>
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-muted/60 p-3 sm:p-6">
          {file ? <PdfDocument file={file} scale={scale} /> : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

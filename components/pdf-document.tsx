"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString()

const MAX_PAGE_WIDTH = 900

interface PdfDocumentProps {
  file: string
  scale: number
}

export default function PdfDocument({ file, scale }: PdfDocumentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [numPages, setNumPages] = useState(0)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="w-full">
      {width > 0 ? (
        <Document
          file={file}
          onLoadSuccess={(document) => setNumPages(document.numPages)}
          loading={
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          }
          error={
            <p className="py-12 text-center text-sm text-muted-foreground">
              Não foi possível carregar o PDF.
            </p>
          }
          className="mx-auto flex w-max min-w-full flex-col items-center gap-4"
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i}
              pageNumber={i + 1}
              width={Math.min(width, MAX_PAGE_WIDTH) * scale}
              loading={null}
              className="overflow-hidden rounded-md shadow-soft"
            />
          ))}
        </Document>
      ) : null}
    </div>
  )
}

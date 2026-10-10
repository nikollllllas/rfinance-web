"use client"

import Lightbox from "yet-another-react-lightbox"
import Counter from "yet-another-react-lightbox/plugins/counter"
import Download from "yet-another-react-lightbox/plugins/download"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/counter.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"

export interface AttachmentViewerImage {
  id: string
  fileName: string
  src: string
}

interface AttachmentViewerProps {
  images: AttachmentViewerImage[]
  index: number | null
  onClose: () => void
}

const labels = {
  Previous: "Anterior",
  Next: "Próxima",
  Close: "Fechar",
  "Zoom in": "Aumentar zoom",
  "Zoom out": "Diminuir zoom",
  Download: "Baixar",
  Lightbox: "Visualizador de comprovantes",
  Carousel: "Carrossel",
  Slide: "Imagem",
  Thumbnails: "Miniaturas",
  "Show thumbnails": "Mostrar miniaturas",
  "Hide thumbnails": "Ocultar miniaturas",
  "{index} of {total}": "{index} de {total}",
}

export function AttachmentViewer({ images, index, onClose }: AttachmentViewerProps) {
  const multiple = images.length > 1

  return (
    <Lightbox
      open={index !== null}
      index={index ?? 0}
      close={onClose}
      slides={images.map((image) => ({
        src: image.src,
        alt: image.fileName,
        download: { url: image.src, filename: image.fileName },
      }))}
      plugins={multiple ? [Zoom, Download, Counter, Thumbnails] : [Zoom, Download]}
      labels={labels}
      carousel={{ finite: true }}
      controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
      zoom={{ maxZoomPixelRatio: 4, scrollToZoom: true }}
      thumbnails={{ width: 64, height: 64, border: 0, padding: 0, gap: 8, imageFit: "cover" }}
      render={multiple ? undefined : { buttonPrev: () => null, buttonNext: () => null }}
    />
  )
}

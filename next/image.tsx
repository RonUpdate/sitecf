import * as React from "react"

interface ImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  fill?: boolean
  className?: string
  priority?: boolean
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down"
  objectPosition?: string
  quality?: number | string
  placeholder?: "blur" | "empty"
  loading?: "lazy" | "eager"
}

const Image: React.FC<ImageProps> = (props) => {
  const { src, alt, width, height, fill, className } = props

  let style: React.CSSProperties = {}

  if (fill) {
    style = {
      ...style,
      position: "absolute",
      width: "100%",
      height: "100%",
      objectFit: props.objectFit || "cover",
      objectPosition: props.objectPosition || "center",
      imageRendering: "optimizeQuality",
    }
  } else {
    if (width) {
      style = { ...style, width: typeof width === "number" ? `${width}px` : width }
    }
    if (height) {
      style = { ...style, height: typeof height === "number" ? `${height}px` : height }
    }
  }

  return React.createElement("img", {
    src: src,
    alt: alt,
    className: className,
    style: style,
  })
}

export default Image

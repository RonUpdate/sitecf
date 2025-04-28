import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Art Market - Beautiful Coloring Pages for Everyone"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 128,
        background: "linear-gradient(to bottom, #f0e6ff, #ffffff)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: "bold",
          color: "#7c3aed",
          marginBottom: 20,
        }}
      >
        Art Market
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: "bold",
          textAlign: "center",
          color: "#1f2937",
        }}
      >
        Beautiful Coloring Pages for Everyone
      </div>
    </div>,
    {
      ...size,
    },
  )
}

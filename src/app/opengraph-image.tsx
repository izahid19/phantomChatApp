import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Phantom - Private Self-Destructing Chat"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #09090b, #18181b)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          {/* Icon/Logo Placeholder - using text/shape for now as loading external images in edge can be tricky without absolute URLs */}
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "#fff",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "20px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "#09090b",
                borderRadius: "50%",
              }}
            />
          </div>
          <div
            style={{
              color: "white",
              fontSize: 80,
              fontWeight: "bold",
              letterSpacing: "-0.05em",
            }}
          >
            Phantom
          </div>
        </div>
        <div
          style={{
            color: "#a1a1aa",
            fontSize: 30,
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Private conversations that vanish into thin air.
          <br />
          No sign-up. No history. No trace.
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

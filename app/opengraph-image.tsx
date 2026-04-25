import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hiram — Decision systems that turn data into revenue";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#7BE0B5";
const BG = "#0a0a0c";
const FG = "#f4f4f6";
const SUBTLE = "#7a7a85";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          color: FG,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          position: "relative",
        }}
      >
        {/* Top: brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: "ui-monospace, Menlo, Consolas, monospace",
            color: ACCENT,
            fontSize: 28,
            letterSpacing: "0.18em",
            fontWeight: 500,
          }}
        >
          HIRAM
        </div>

        {/* Center: strapline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              fontWeight: 500,
              letterSpacing: "-0.025em",
              color: FG,
            }}
          >
            Decision systems that turn data into revenue.
          </div>
          <div
            style={{
              width: 96,
              height: 4,
              background: ACCENT,
              borderRadius: 2,
            }}
          />
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontFamily: "ui-monospace, Menlo, Consolas, monospace",
            fontSize: 22,
            letterSpacing: "0.12em",
            color: SUBTLE,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>hiram.systems</div>
          <div style={{ display: "flex", color: ACCENT }}>
            decisionsystems@scale
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

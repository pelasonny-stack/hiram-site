import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0c",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ width: 120, height: 22, background: "#7BE0B5", borderRadius: 4 }} />
          <div style={{ width: 120, height: 22, background: "#7BE0B5", opacity: 0.6, borderRadius: 4 }} />
          <div style={{ width: 120, height: 22, background: "#7BE0B5", opacity: 0.3, borderRadius: 4 }} />
        </div>
      </div>
    ),
    { ...size },
  );
}

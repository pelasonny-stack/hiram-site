import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ width: 22, height: 4, background: "#7BE0B5", borderRadius: 1 }} />
          <div style={{ width: 22, height: 4, background: "#7BE0B5", opacity: 0.6, borderRadius: 1 }} />
          <div style={{ width: 22, height: 4, background: "#7BE0B5", opacity: 0.3, borderRadius: 1 }} />
        </div>
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";

// Home-screen icon: the favicon's "N." in ink on the portfolio red (user's pick 3, 25 Nov), full bleed
// because iOS rounds the corners itself.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ff3b1f" }}>
        <svg width="180" height="180" viewBox="0 0 32 32">
          <path d="M5.5 24V8h4l8 10.6V8h4v16h-4l-8-10.6V24z" fill="#0e0e0e" />
          <rect x="23.5" y="20" width="4" height="4" fill="#0e0e0e" />
        </svg>
      </div>
    ),
    size,
  );
}

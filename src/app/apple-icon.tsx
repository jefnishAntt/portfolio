import { ImageResponse } from "next/og";

// Home-screen icon for iOS. Same mark as icon.svg; iOS rounds the corners itself.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0b" }}>
        <svg width="132" height="132" viewBox="0 0 32 32">
          <path
            d="M4.5 17H10l3.5-9.5 4.5 16 3-6.5h6.5"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}

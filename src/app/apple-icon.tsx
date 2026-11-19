import { ImageResponse } from "next/og";

// Home-screen icon for iOS. Same mark as icon.svg; iOS rounds the corners itself.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0b" }}>
        <svg width="150" height="150" viewBox="0 0 32 32" fill="none" stroke="#ffffff" strokeWidth="3.1" strokeLinecap="butt" strokeLinejoin="round">
          <path d="M12.9 11.6L4.2 15.5L13.2 21.2" />
          <path d="M17.6 8.2L14.9 23.4" />
          <path d="M19.4 11.2L27.9 15.5L20.9 20.4" />
        </svg>
      </div>
    ),
    size,
  );
}

import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Self-hosted at build time by next/font: no requests to Google from visitors' browsers.
const sans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Jefnish Antt: developer at Haddy Designs and final-year CSE student, learning the maths, AI and neuroscience behind brain-computer interfaces.";

export const metadata: Metadata = {
  title: {
    default: "Jefnish ANTT · Developer, brains & machines",
    template: "%s · Jefnish ANTT",
  },
  description,
  applicationName: "Jefnish ANTT",
  authors: [{ name: "Jefnish Antt J" }],
  openGraph: { title: "Jefnish ANTT · Developer, brains & machines", description, type: "website" },
  twitter: { card: "summary", title: "Jefnish ANTT · Developer, brains & machines", description },
  referrer: "strict-origin-when-cross-origin",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

// Sets the saved theme before first paint so there is no flash.
const themeScript = `try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Figtree, Geist_Mono, NTR } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ntr = NTR({
  weight: "400",
  variable: "--font-ntr",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jefnish",
  description: "Jefnish Antt - Full-Stack Software Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${figtree.variable} ${geistMono.variable} ${ntr.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

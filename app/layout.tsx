import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { VT323 } from "next/font/google";
import "./globals.css";
import "./retro-terminal.css";
import FontLoader from "./FontLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://checkmate.maisybrain.com'),
  title: "checkmate * ੈ♡‧₊˚",
  description: "your own little angel.. care for a game?",
  openGraph: {
    title: "checkmate * ੈ♡‧₊˚",
    description: "your own little angel.. care for a game?",
    images: [
      {
        url: "/images/checkmate-preview.jpg",
        width: 1200,
        height: 630,
        alt: "checkmate",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        
        {/* Twitter/X Card Meta Tags - Added per Twitter docs */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@maisybrain" />
        <meta name="twitter:creator" content="@maisybrain" />
        <meta name="twitter:title" content="checkmate * ੈ♡‧₊˚" />
        <meta name="twitter:description" content="your own little angel.. care for a game?" />
        <meta name="twitter:image" content="https://checkmate.maisybrain.com/images/checkmate-preview.jpg" />
        <meta name="twitter:image:alt" content="checkmate aesthetic with cute ASCII character" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable} antialiased bg-black text-white min-h-screen retro-font`}
      >
        <FontLoader />
        {children}
      </body>
    </html>
  );
}

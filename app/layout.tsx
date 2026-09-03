import type { Metadata } from "next";
import "./globals.css";
import VisitorTracker from "@/components/visitor-tracker";
import MacrroAiChat from "@/components/macrro-ai-chat";

const siteUrl = "https://macro-roblx-pb.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Macrro Online - Download Macro & Tools Windows",
    template: "%s | Macrro Online",
  },
  description:
    "Macrro Online adalah pusat download software, macro, tools, dan utilitas untuk Windows dengan informasi file yang jelas dan eksekusi lokal di komputer pengguna.",
  keywords: [
    "macro",
    "macro Windows",
    "download macro",
    "Roblox macro",
    "auto clicker",
    "Windows tools",
    "software Windows",
    "Macrro Online",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website", locale: "id_ID", url: siteUrl, siteName: "Macrro Online",
    title: "Macrro Online - Download Macro & Tools Windows",
    description: "Pusat download software, macro, tools, dan utilitas untuk Windows.",
  },
  twitter: {
    card: "summary",
    title: "Macrro Online - Download Macro & Tools Windows",
    description: "Pusat download software, macro, tools, dan utilitas untuk Windows.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8124668365639299" crossOrigin="anonymous" />
      </head>
      <body>
        <VisitorTracker />
        {children}
        <MacrroAiChat />
      </body>
    </html>
  );
}

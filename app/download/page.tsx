import type { Metadata } from "next";
import DownloadClient from "./download-client";

export const metadata: Metadata = {
  title: "Download Macro & Tools Windows",
  description:
    "Download macro, tools, dan utilitas Windows dari Macrro Online. File dijalankan secara lokal di komputer pengguna dengan informasi penggunaan dan keamanan yang jelas.",
  alternates: {
    canonical: "https://macro-roblx-pb.vercel.app/download",
  },
  openGraph: {
    title: "Download Macro & Tools Windows",
    description:
      "Download macro, tools, dan utilitas Windows dari Macrro Online.",
    url: "https://macro-roblx-pb.vercel.app/download",
    type: "website",
    locale: "id_ID",
    siteName: "Macrro Online",
  },
};

export default function DownloadPage() {
  return <DownloadClient />;
}

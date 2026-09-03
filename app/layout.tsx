import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Macrro Online — Digital Download Platform",
  description: "Fast, secure and simple digital download platform."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import VisitorTracker from "@/components/visitor-tracker";

export const metadata: Metadata = {
  title: "Macrro Online - Digital Download Platform",
  description: "Fast, secure and simple digital download platform."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}

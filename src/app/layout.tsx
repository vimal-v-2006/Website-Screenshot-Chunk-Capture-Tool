import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Website Screenshot Chunk Capture Tool",
  description: "Full Page Website Screenshot Chunker. Capture any website as high-quality, chunked screenshots with custom aspect ratios.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeetCode GitHub Readme Stats Card",
  description:
    "Generate LeetCode stats SVG cards for your GitHub README.",
  keywords: [
    "leetcode",
    "github",
    "readme",
    "stats",
    "card",
    "coding",
    "programming",
    "statistics",
  ],
  authors: [{ name: "Romit Sagu" }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
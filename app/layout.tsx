import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Atharva | Design Portfolio",
  description: "Personal design portfolio showcasing creative work and projects",
  keywords: ["design", "portfolio", "creative", "UI/UX", "graphic design", "atharva"],
  authors: [{ name: "Atharva" }],
  metadataBase: new URL("https://atharva.cc"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Atharva | Design Portfolio",
    description: "Personal design portfolio showcasing creative work and projects",
    url: "https://atharva.cc",
    siteName: "Atharva",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atharva | Design Portfolio",
    description: "Personal design portfolio showcasing creative work and projects",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-inter antialiased`}>
        {children}
      </body>
    </html>
  );
}
